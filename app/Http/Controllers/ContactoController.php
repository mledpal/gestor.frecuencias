<?php

namespace App\Http\Controllers;

use App\Http\Requests\ValidarContacto;
use App\Models\Banda;
use App\Models\Contacto;
use App\Models\Ctcss;
use App\Models\Dcs;
use App\Models\Frecuencia;
use App\Models\Localizacion;
use App\Models\ModoTransmision;
use App\Models\Repetidor;
use App\Models\TipoCodificacion;
use App\Models\TipoContacto;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;


class ContactoController extends Controller
{
    /**
     * Función que , mediante AJAX, recoge los contactos solicitados
     */

    public function getContacts()
    {
        if (Auth::check()) {

            $user = Auth::user();

            $contactos = Contacto::with('localizacion', 'tipo', 'frecuencia', 'codificacion', 'ctcss', 'dcs', 'banda', 'modo', 'repetidor')->where('user_id', $user->id)->orderBy('nombre', 'asc')->get();

            return json_encode($contactos);
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

            $requestAll = $request->all();

            if ($request->ctcss_id == -1) {
                $requestAll['ctcss_id'] = null;
            } else {
                $requestAll['ctcss_id'] = $request->ctcss_id;
            }
            if ($request->dcs_id == -1) {
                $requestAll['dcs_id'] = null;
            } else {
                $requestAll['dcs_id'] = $request->dcs_id;
            }
            if ($request->banda_id == -1) {
                $requestAll['banda_id'] = null;
            } else {
                $requestAll['banda_id'] = $request->banda_id;
            }

            if ($request->modo_id == -1) {
                $requestAll['modo_id'] = null;
            } else {
                $requestAll['modo_id'] = $request->modo_id;
            }

            if ($request->codificacion_id == -1) {
                $requestAll['codificacion_id'] = null;
            } else {
                $requestAll['codificacion_id'] = $request->codificacion_id;
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

                if($localizacion_bus) {
                    if ($localizacion_id !== $localizacion_bus->id) {
                        $localizacion_id = $localizacion_bus->id;
                    }
                } else {
                    $localizacion = Localizacion::create([
                        'localidad' => $request->localidad,
                        'provincia' => $request->provincia,
                        'pais' => $request->pais,
                        'gps' => $request->gps
                    ]);

                    $localizacion_id = $localizacion->id;
                }
            }



            $frecuencia_bus = Frecuencia::where('frecuencia', $request->frecuencia)->first();
            if (!$frecuencia_bus) {
                $frecuencia = Frecuencia::create(['frecuencia' => $request->frecuencia]);
                $frecuencia_id = $frecuencia->id;
            } else {
                $frecuencia_id = $frecuencia_bus->id;
            }

            // Repetidor
            $repetidor_id = null;
            if (isset($request->offset) && isset($request->direccion)) {
                $repetidor_bus = Repetidor::where('offset', $request->offset)->where('direccion', $request->direccion);

                if ($repetidor_bus) {
                    $repetidor_id = $repetidor_bus->id;
                } else {
                    $nuevoRepetidor = Repetidor::create(['offset' => $request->offset, 'direccion' => $request->direccion]);
                    $repetidor_id = $nuevoRepetidor->id;
                }
            }


            // Crea el nuevo contacto
            $contacto = array();
            $contacto['nombre'] = $request->nombre;
            $contacto['comprobado'] = $request->comprobado;
            $contacto['privado'] = $request->privado;
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

            $newContact = Contacto::create($contacto);

            if ($newContact) {
                return back()->with('flash', [
                    'mensaje' => 'Contacto creado correctamente',
                ]);
            } else {
                return back()->with('flash', [
                    'mensaje-error' => 'Hubo un error',
                ]);
            }
        } else {
            return redirect('/login');
        }
    }


    /**
     * Función que sirve para actualizar los datos de un contacto
     * @param $request ValidarContacto // Datos recibidos del formulario
     */
    public function actualizar(ValidarContacto $request)
    {
        if (Auth::check()) {

            $user = Auth::user();

            $requestAll = $request->all();

            if ($request->modo_id == -1) {
                $requestAll['modo_id'] = null;
            } else {
                $requestAll['modo_id'] = $request->modo_id;
            }

            if ($request->ctcss_id == -1) {
                $requestAll['ctcss_id'] = null;
            } else {
                $requestAll['ctcss_id'] = $request->ctcss_id;
            }

            if ($request->dcs_id == -1) {
                $requestAll['dcs_id'] = null;
            } else {
                $requestAll['dcs_id'] = $request->dcs_id;
            }

            if ($request->banda_id == -1) {
                $requestAll['banda_id'] = null;
            } else {
                $requestAll['banda_id'] = $request->banda_id;
            }

            if ($request->codificacion_id == -1) {
                $requestAll['codificacion_id'] = null;
            } else {
                $requestAll['codificacion_id'] = $request->codificacion_id;
            }

            $contacto = Contacto::with('frecuencia', 'codificacion', 'localizacion')->findorFail($request->id);

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
            ]);


            // REPETIDOR

            if (!isset($request->offset)) { // Si los valores de offset son nulos, se pone a null el id del repetidor
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


            if (isset($request->localizacion_id) && !empty($localizacion_bus)) {

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


            return redirect('/')->with('mensaje', 'Contacto actualizado con éxito');
        } else {
            return redirect('/login');
        }
    }


    public function getContactInfo($id)
    {
        if (Auth::check()) {

            $contacto = Contacto::findorFail($id);

            if ($contacto) {
                return $contacto;
            } else {
                return redirect('/login');
            }
        }
    }


    /**
     * Función que sirve para eliminar un contacto
     * @param $id -> Id del contacto
     */
    public function eliminar($id)
    {
        if (Auth::check()) {
            $contacto = Contacto::findorFail($id);

            if ($contacto) {
                $contacto->delete();
                // return redirect('/')->with('mensaje', 'Contacto eliminado con éxito');
            }
        }
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
                $busqueda = Contacto::with('localizacion', 'tipo', 'frecuencia', 'codificacion', 'ctcss', 'dcs', 'banda', 'modo', 'repetidor')->where('privado', false)->orderBy('nombre', 'asc');
            }

            if (isset($request->nombre)) {
                $busqueda->where('nombre', 'like', '%' . $request->nombre . '%');
            }

            if (isset($request->frecuencia)) {
                $busqueda->whereHas('frecuencia', function ($query) use ($request) {
                    $query->where('frecuencia', 'like', '%' . $request->frecuencia . '%');
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
                    $query->where('localidad', 'like', '%' . $request->localidad . '%');
                });
            }

            if (isset($request->provincia)) {
                $busqueda->whereHas('localizacion', function ($query) use ($request) {
                    $query->where('provincia', 'like', '%' . $request->provincia . '%');
                });
            }



            $tipos_contacto = TipoContacto::orderBy('nombre', 'ASC')->get()->pluck('nombre', 'id')->toArray();

            $bandas = Banda::orderBy('id', 'ASC')->get()->pluck('banda', 'id')->toArray();
            $bandas[-1] = "Desconocido";

            $modos = ModoTransmision::orderBy('id', 'ASC')->get()->pluck('nombre', 'id')->toArray();
            $modos[-1] = "Desconocido";

            $tiposCodificacion = TipoCodificacion::orderBy('nombre', 'ASC')->get()->pluck('nombre', 'id')->toArray();
            $tiposCodificacion[-1] = "Desconocido";

            $dcsCodes = Dcs::orderBy('codigo', 'ASC')->get()->pluck('codigo', 'id')->toArray();
            $dcsCodes[-1] = "Desconocido";

            $ctcssCodes = Ctcss::orderBy('codigo', 'ASC')->get()->pluck('codigo', 'id')->toArray();
            $ctcssCodes[-1] = 'Desconocido';

            $direcciones = ['=' => '=', '+' => '+', '-' => '-'];
            $roles = $user->roles;

            $contactos = Contacto::with('localizacion', 'tipo', 'frecuencia', 'codificacion', 'ctcss', 'dcs', 'banda', 'modo', 'repetidor')->where('user_id', $user->id)->orderBy('nombre', 'asc')->get();

            $campos_select = [
                'tipos_contacto' => $tipos_contacto,
                'modos' => $modos,
                'codificaciones' => $tiposCodificacion,
                'dcs' => $dcsCodes,
                'ctcss' => $ctcssCodes,
                'direcciones' => $direcciones,
                'bandas' => $bandas,
            ];

            return Inertia::render('Inicio', [
                'canLogin' => Route::has('login'),
                'canRegister' => Route::has('register'),
                'userDB' => $user,
                'username' => $user->username,
                'title' => 'Inicio | Busqueda',
                'roles' => $roles,
                'contactos' => $contactos,
                'selects' => $campos_select,
                'busqueda' => $busqueda->get(),

            ]);
        } else {
            return redirect('/');
        }
    }
}
