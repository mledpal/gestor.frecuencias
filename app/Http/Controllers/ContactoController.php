<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Concerns\ConstruyeSelectsDeContacto;
use App\Http\Requests\ValidarContacto;
use App\Models\Contacto;
use App\Models\Frecuencia;
use App\Models\Localizacion;
use App\Models\Repetidor;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
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

            $contactos = Contacto::with('localizacion', 'tipo', 'frecuencia', 'codificacion', 'ctcss', 'dcs', 'banda', 'modo', 'repetidor')->where('user_id', $user->id)->orderBy('nombre', 'asc')->get();

            return response()->json($contactos);
        } else {
            return redirect('/login');
        }
    }

    /**
     * Funcion que sirve para crear un nuevo contacto
     */
    public function crear(ValidarContacto $request)
    {
        if (Auth::check()) {

            $user = Auth::user();

            // dd($request);

            $requestAll = $this->normalizarSelects($request->all());

            if ($request->localizacion_id == -1) {
                $requestAll['localizacion_id'] = null;
            }

            // Busca si ya existe ese contacto creado (Por frecuencia, localización y usuario actual)
            $frecuencia_bus = $request->frecuencia;
            $localidad_bus = $request->localidad;
            $provincia_bus = $request->provincia;

            $existe = Contacto::whereHas('frecuencia', function (Builder $query) use ($frecuencia_bus) {
                $query->where('frecuencia', $frecuencia_bus);
            })->whereHas('localizacion', function (Builder $query) use ($localidad_bus, $provincia_bus) {
                $query->where('localidad', $localidad_bus)->where('provincia', $provincia_bus);
            })->where('user_id', $user->id)->first();

            if ($existe) {
                return back()->with('flash', [
                    'mensaje-error' => 'Ya existe ese contacto',
                ]);
            }

            // Localización

            $localizacion_id = $request->localizacion_id;
            if (isset($request->localidad) || isset($request->provincia) || isset($request->gps)) {

                $localizacion_bus = Localizacion::where('localidad', $request->localidad)->where('provincia', $request->provincia)->where('pais', $request->pais)->where('gps', $request->gps)->first();

                if ($localizacion_bus) {
                    if ($localizacion_id !== $localizacion_bus->id) {
                        $localizacion_id = $localizacion_bus->id;
                    }
                } else {
                    $localizacion = Localizacion::create([
                        'localidad' => $request->localidad,
                        'provincia' => $request->provincia,
                        'pais' => $request->pais,
                        'gps' => $request->gps,
                    ]);

                    $localizacion_id = $localizacion->id;
                }
            }

            if ($localizacion_id === -1) {
                $localizacion_id = null;
            }

            $frecuencia_bus = Frecuencia::where('frecuencia', $request->frecuencia)->first();
            if (! $frecuencia_bus) {
                $frecuencia = Frecuencia::create(['frecuencia' => $request->frecuencia]);
                $frecuencia_id = $frecuencia->id;
            } else {
                $frecuencia_id = $frecuencia_bus->id;
            }

            // Repetidor
            $repetidor_id = null;
            if (isset($request->offset) && isset($request->direccion)) {
                $repetidor_bus = Repetidor::where('offset', $request->offset)->where('direccion', $request->direccion)->first();

                if ($repetidor_bus) {
                    $repetidor_id = $repetidor_bus->id;
                } else {
                    $nuevoRepetidor = Repetidor::create(['offset' => $request->offset, 'direccion' => $request->direccion]);
                    $repetidor_id = $nuevoRepetidor->id;
                }
            }

            // Crea el nuevo contacto
            $contacto = [];
            $contacto['nombre'] = $request->nombre;
            $contacto['comprobado'] = $request->comprobado ?? false;
            $contacto['privado'] = $request->privado ?? false;
            $contacto['fecha'] = $request->fecha;
            $contacto['hora'] = $request->hora;
            $contacto['tipo_id'] = $request->tipo_id;
            $contacto['localizacion_id'] = $localizacion_id;
            $contacto['frecuencia_id'] = $frecuencia_id;
            $contacto['repetidor_id'] = $repetidor_id ?? null;
            $contacto['codificacion_id'] = $requestAll['codificacion_id'];
            $contacto['dcs_id'] = $requestAll['dcs_id'];
            $contacto['ctcss_id'] = $requestAll['ctcss_id'];
            $contacto['banda_id'] = $requestAll['banda_id'];
            $contacto['modo_id'] = $requestAll['modo_id'];
            $contacto['user_id'] = $user->id;
            $contacto['observaciones'] = $request->observaciones;
            $contacto['calidad'] = $request->calidad;
            $contacto['favorito'] = $request->favorito ?? false;

            $newContact = Contacto::create($contacto);

            if ($newContact) {
                return back();
                // return json_encode(['mensaje' => 'Contacto creado correctamente', 'id' => $newContact->id]);
            } else {
                return back();
                // return json_encode(['mensaje-error' => 'Contacto no creado']);
            }
        } else {
            return redirect('/login');
        }
    }

    /**
     * Función que sirve para actualizar los datos de un contacto
     *
     * @param  $request  ValidarContacto // Datos recibidos del formulario
     */
    public function actualizar(ValidarContacto $request)
    {
        if (Auth::check()) {

            $user = Auth::user();

            $requestAll = $this->normalizarSelects($request->all());

            $contacto = Contacto::with('frecuencia', 'codificacion', 'localizacion')->findOrFail($request->id);

            $this->authorize('update', $contacto);

            // Todo el update va en una única transacción: antes eran hasta 4
            // UPDATE independientes sobre la misma fila (más la posible
            // creación de Localizacion/Repetidor), sin garantía de que el
            // contacto quedara en un estado consistente si algo fallaba a mitad.
            DB::transaction(function () use ($request, $requestAll, $contacto) {
                $contacto->update([
                    'nombre' => $request->nombre,
                    'privado' => $request->privado ?? false,
                    'comprobado' => $request->comprobado ?? false,
                    'fecha' => $request->fecha,
                    'hora' => $request->hora,
                    'tipo_id' => $request->tipo_id,
                    'observaciones' => $request->observaciones,
                    'frecuencia_id' => $request->frecuencia_id,
                    'calidad' => $request->calidad ?? 0,
                    'banda_id' => $requestAll['banda_id'],
                    'modo_id' => $requestAll['modo_id'],
                    'ctcss_id' => $requestAll['ctcss_id'],
                    'dcs_id' => $requestAll['dcs_id'],
                    'codificacion_id' => $requestAll['codificacion_id'],
                    'favorito' => $request->favorito ?? false,
                ]);

                // REPETIDOR

                if (! isset($request->offset)) { // Si los valores de offset son nulos, se pone a null el id del repetidor
                    $contacto->update(['repetidor_id' => null]);
                } else {
                    $repetidor_bus = Repetidor::where('offset', $request->offset)->where('direccion', $request->direccion)->first();
                    if ($repetidor_bus) {
                        if ($repetidor_bus->id !== $contacto->repetidor_id) { // Si es el mismo, no hace nada
                            $contacto->update(['repetidor_id' => $repetidor_bus->id]); // Si existe y está creado, lo asigna
                        }
                    } else {
                        $nuevoRepetidor = Repetidor::create(['offset' => $request->offset, 'direccion' => $request->direccion]); // Si no existe, lo crea y lo asigna
                        $contacto->update(['repetidor_id' => $nuevoRepetidor->id]); // Si existe y está creado, lo asigna
                    }
                } // FIN REPETIDOR

                // LOCALIZACION

                $localizacion_bus = Localizacion::where('localidad', $request->localidad)->where('provincia', $request->provincia)->where('pais', $request->pais)->where('gps', $request->gps)->first();

                if (isset($request->localizacion_id) && ! empty($localizacion_bus)) {

                    if ($localizacion_bus->id == $request->localizacion_id) { // Es la misma localización

                        $contacto->localizacion->update([
                            'localidad' => $request->localidad,
                            'provincia' => $request->provincia ?? null,
                            'pais' => $request->pais,
                            'gps' => $request->gps,
                        ]);
                    } else {
                        $contacto->update([ // Existe la localización pero no es la anterior. Actualizo localizacion_id
                            'localizacion_id' => $localizacion_bus->id,
                        ]);
                    }
                } else {

                    if (isset($request->localidad) && isset($request->pais)) {
                        // No existe
                        $localizacion = Localizacion::create([ // Creo la nueva localización y actualizo el localizacion_id en frecuencia
                            'localidad' => $request->localidad,
                            'provincia' => $request->provincia ?? null,
                            'pais' => $request->pais ?? null,
                            'gps' => $request->gps ?? null,
                        ]);

                        $contacto->update([
                            'localizacion_id' => $localizacion->id,
                        ]);
                    }
                } // FIN  LOCALIZACION
            });

            return redirect('/')->with('mensaje', 'Contacto actualizado con éxito');
        } else {
            return redirect('/login');
        }
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
     * Normaliza los selects que usan el sentinel -1 ("Desconocido") a null
     * antes de persistirlos en la base de datos.
     *
     * @param  array<string, mixed>  $datos
     * @return array<string, mixed>
     */
    private function normalizarSelects(array $datos): array
    {
        foreach (['ctcss_id', 'dcs_id', 'banda_id', 'modo_id', 'codificacion_id'] as $campo) {
            if (! array_key_exists($campo, $datos) || $datos[$campo] == -1) {
                $datos[$campo] = null;
            }
        }

        return $datos;
    }

    /**
     * Función para buscar Contactos/Frecuencias
     */
    public function busqueda(Request $request)
    {

        $user = Auth::user();

        if (Auth::check()) {

            $busqueda = [];

            if ($request->propio) {
                $busqueda = Contacto::with('localizacion', 'tipo', 'frecuencia', 'codificacion', 'ctcss', 'dcs', 'banda', 'modo', 'repetidor')->where('user_id', $user->id)->orderBy('nombre', 'asc');
            } else {
                $busqueda = Contacto::with(['usuario' => function ($query) {
                    $query->select('id', 'username', 'photo');
                }])
                    ->with('localizacion', 'tipo', 'frecuencia', 'codificacion', 'ctcss', 'dcs', 'banda', 'modo', 'repetidor')
                    ->where('privado', false)
                    ->where('user_id', '!=', $user->id)
                    ->orderBy('nombre', 'asc');
            }

            if (isset($request->nombre)) {
                $busqueda->where('nombre', 'like', '%'.$request->nombre.'%');
            }

            if (isset($request->frecuencia)) {
                $busqueda->whereHas('frecuencia', function ($query) use ($request) {
                    $query->where('frecuencia', 'like', '%'.$request->frecuencia.'%');
                });
            }

            if (isset($request->tipo_id)) {
                $busqueda->where('tipo_id', $request->tipo_id);
            }

            if (isset($request->comprobado)) {
                $busqueda->where('comprobado', $request->comprobado);
            }

            if (isset($request->localidad)) {
                $busqueda->whereHas('localizacion', function ($query) use ($request) {
                    $query->where('localidad', 'like', '%'.$request->localidad.'%');
                });
            }

            if (isset($request->provincia)) {
                $busqueda->whereHas('localizacion', function ($query) use ($request) {
                    $query->where('provincia', 'like', '%'.$request->provincia.'%');
                });
            }

            $roles = $user->roles;

            $campos_select = $this->selectsDeContacto();

            // La búsqueda pública (rama "propio" = false) puede devolver
            // contactos de toda la plataforma: se limita para no serializar
            // la tabla completa en cada búsqueda sin filtros.
            return Inertia::render('Inicio', [
                'canLogin' => Route::has('login'),
                'canRegister' => Route::has('register'),
                'userDB' => $user,
                'username' => $user->username,
                'title' => 'Inicio | Busqueda',
                'roles' => $roles,
                'selects' => $campos_select,
                'busqueda' => $busqueda->limit(200)->get(),

            ]);
        } else {
            return redirect('/');
        }
    }
}
