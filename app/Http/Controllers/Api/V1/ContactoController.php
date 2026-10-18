<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\ValidarContacto;
use App\Http\Resources\ContactoResource;
use App\Models\Contacto;
use App\Services\ContactoService;
use Illuminate\Http\Request;

class ContactoController extends Controller
{
    public function __construct(private ContactoService $servicio) {}

    /**
     * Contactos propios del usuario.
     */
    public function index(Request $request)
    {
        $contactos = Contacto::with(ContactoService::RELACIONES)
            ->where('user_id', $request->user()->id)
            ->orderBy('nombre', 'asc')
            ->get();

        return ContactoResource::collection($contactos);
    }

    public function store(ValidarContacto $request)
    {
        $user = $request->user();

        if ($this->servicio->existeDuplicado($user, $request->frecuencia, $request->localidad, $request->provincia)) {
            return response()->json(['message' => 'Ya existe ese contacto'], 409);
        }

        $contacto = $this->servicio->crear($user, $request->all());

        return (new ContactoResource($contacto->load(ContactoService::RELACIONES)))
            ->response()->setStatusCode(201);
    }

    public function show(Contacto $contacto)
    {
        $this->authorize('view', $contacto);

        return new ContactoResource($contacto->load([...ContactoService::RELACIONES, 'usuario.roles']));
    }

    public function update(ValidarContacto $request, Contacto $contacto)
    {
        $this->authorize('update', $contacto);

        // La frecuencia siempre se resuelve a partir del texto enviado.
        $contacto = $this->servicio->actualizar($contacto->load('localizacion'), $request->except('frecuencia_id'));

        return new ContactoResource($contacto->load(ContactoService::RELACIONES));
    }

    public function destroy(Contacto $contacto)
    {
        $this->authorize('delete', $contacto);

        $contacto->delete();

        return response()->noContent();
    }

    public function buscar(Request $request)
    {
        $filtros = $request->validate([
            'propio' => 'nullable|boolean',
            'nombre' => 'nullable|string',
            'frecuencia' => 'nullable|string',
            'tipo_id' => 'nullable|integer',
            'comprobado' => 'nullable|boolean',
            'fecha_ini' => 'nullable|date',
            'fecha_fin' => 'nullable|date',
            'localidad' => 'nullable|string',
            'provincia' => 'nullable|string',
        ]);

        return ContactoResource::collection(
            $this->servicio->buscar($request->user(), $filtros)->limit(200)->get()
        );
    }
}
