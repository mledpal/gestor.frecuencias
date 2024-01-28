<?php

namespace App\Http\Controllers;

use App\Http\Requests\ValidarContacto;
use App\Models\Codificacion;
use App\Models\Contacto;
use App\Models\Frecuencia;
use App\Models\Localizacion;
use App\Models\Repetidor;
use App\Models\TipoCodificacion;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

use stdClass;

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

            $localizacion_id = null;
            if (isset($request->localidad) && isset($request->provincia)) {

                $localizacion_bus = Localizacion::where('localidad', $request->localidad)->where('provincia', $request->provincia)->where('pais', $request->pais)->first();


                if (!$localizacion_bus) {
                    $localizacion = Localizacion::create([
                        'localidad' => $request->localidad,
                        'provincia' => $request->provincia,
                        'pais' => $request->pais,
                        'gps' => $request->gps
                    ]);
                    $localizacion_id = $localizacion->id;
                } else {
                    $localizacion_id = $localizacion_bus->id;
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
            $contacto['codificacion_id'] = $request->codificacion_id ?? $request->codificacion;
            $contacto['dcs_id'] = $request->dcs_id;
            $contacto['ctcss_id'] = $request->ctcss_id;
            $contacto['banda_id'] = $request->banda_id;
            $contacto['modo_id'] = $request->modo_id;
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
                'banda_id' => $request->banda_id,
                'modo_id' => $request->modo_id,
                'ctcss_id' => $request->ctcss_id,
                'dcs_id' => $request->dcs_id,
                'codificacion_id' => $request->codificacion_id ?? $request->codificacion,
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
}
