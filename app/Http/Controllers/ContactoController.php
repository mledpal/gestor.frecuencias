<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Concerns\ConstruyeSelectsDeContacto;
use App\Http\Requests\ValidarContacto;
use App\Models\Contacto;
use App\Services\ContactoService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

class ContactoController extends Controller
{
    use ConstruyeSelectsDeContacto;

    /**
     * Función que , mediante AJAX, recoge los contactos solicitados
     */
    public function getContacts()
    {
        if (Auth::check()) {

            $user = Auth::user();

            $contactos = Contacto::with(ContactoService::RELACIONES)->where('user_id', $user->id)->orderBy('nombre', 'asc')->get();

            return response()->json($contactos);
        } else {
            return redirect('/login');
        }
    }

    /**
     * Funcion que sirve para crear un nuevo contacto
     */
    public function crear(ValidarContacto $request, ContactoService $servicio)
    {
        $user = Auth::user();

        // Busca si ya existe ese contacto creado (Por frecuencia, localización y usuario actual)
        if ($servicio->existeDuplicado($user, $request->frecuencia, $request->localidad, $request->provincia)) {
            return back()->with('flash', [
                'mensaje-error' => 'Ya existe ese contacto',
            ]);
        }

        $servicio->crear($user, $request->all());

        return back();
    }

    /**
     * Función que sirve para actualizar los datos de un contacto
     *
     * @param  $request  ValidarContacto // Datos recibidos del formulario
     */
    public function actualizar(ValidarContacto $request, ContactoService $servicio)
    {
        $contacto = Contacto::with('frecuencia', 'codificacion', 'localizacion')->findOrFail($request->id);

        $this->authorize('update', $contacto);

        $servicio->actualizar($contacto, $request->all());

        return redirect('/')->with('mensaje', 'Contacto actualizado con éxito');
    }

    public function getContactInfo($id)
    {
        $contacto = Contacto::findOrFail($id);

        $this->authorize('view', $contacto);

        return $contacto;
    }

    /**
     * Función que sirve para eliminar un contacto
     *
     * @param  $id  -> Id del contacto
     */
    public function eliminar($id)
    {
        $contacto = Contacto::findOrFail($id);

        $this->authorize('delete', $contacto);

        $contacto->delete();

        return back();
    }

    /**
     * Función para buscar Contactos/Frecuencias
     */
    public function busqueda(Request $request, ContactoService $servicio)
    {
        $user = Auth::user();

        $busqueda = $servicio->buscar($user, $request->all());

        // La búsqueda pública (rama "propio" = false) puede devolver
        // contactos de toda la plataforma: se limita para no serializar
        // la tabla completa en cada búsqueda sin filtros.
        return Inertia::render('Inicio', [
            'canLogin' => Route::has('login'),
            'canRegister' => Route::has('register'),
            'userDB' => $user,
            'username' => $user->username,
            'title' => 'Inicio | Busqueda',
            'roles' => $user->roles,
            'selects' => $this->selectsDeContacto(),
            'busqueda' => $busqueda->limit(200)->get(),
        ]);
    }
}
