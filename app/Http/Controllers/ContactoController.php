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

        // dd($request->request);

        if (Auth::check()) {

            $user = Auth::user();

            // dd($request);
            // Localización

            $localizacion_id = null;
            if (isset($request->localidad) && isset($request->provincia)) {

                $localizacion_bus = Localizacion::where('localidad', $request->localidad)->where('provincia', $request->provincia)->where('pais', $request->pais)->where('gps', $request->gps)->first();

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
            if (isset($request->offset)) {
                $repetidor = Repetidor::firstOrCreate(['offset' => $request->offset, 'direccion' => $request->direccion]);
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
            $contacto['repetidor_id'] = $repetidor->id ?? null;
            $contacto['codificacion_id'] = $request->codificacion_id;
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
                'codificacion_id' => $request->codificacion_id
            ]);


            // REPETIDOR

            $repetidor_bus = Repetidor::where('offset', $request->offset)->where('direccion', $request->direccion)->first();

            if (isset($request->repetidor_id) && !empty($repetidor_bus)) {
                if ($request->repetidor_id == $repetidor_bus->id) { // Mismo Repetidor
                    $contacto->repetidor->update([
                        'offset' => $request->offset,
                        'direccion' => $request->direccion,
                    ]);
                } else {
                    $contacto->update(['repetidor_id' => $repetidor_bus->id]); // Existe pero es diferente por lo que se cambia
                }
            } elseif (isset($request->offset) && isset($request->direccion)) { // No existe el repetidor, por lo que se crea nuevo
                $repetidor = Repetidor::create([
                    'offset' => $request->offset,
                    'direccion' => $request->direccion,
                ]);
                $contacto->update(['repetidor_id' => $repetidor->id]);
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
