<?php

namespace App\Http\Controllers;

use App\Http\Requests\ValidarContacto;
use App\Models\Banda;
use App\Models\Contacto;
use App\Models\Localizacion;
use App\Models\Repetidor;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ContactoController extends Controller
{
    public function actualizar(ValidarContacto $request)
    {
        if (Auth::check()) {

            $user = Auth::user();

            $contacto = Contacto::with('frecuencia', 'frecuencia.contacto', 'frecuencia.codificacion', 'localizacion')->findorFail($request->id);

            $contacto->frecuencia->update([
                'calidad' => $request->calidad ?? 0,
                'banda_id' => $request->banda_id,
                'modo_id' => $request->modo_id,
            ]);

            $contacto->update([
                'nombre' => $request->nombre,
                'comprobado' => $request->comprobado ?? false,
                'fecha' => $request->fecha,
                'hora' => $request->hora,
                'tipo_id' => $request->tipo_id,
                'observaciones' => $request->observaciones,
                'frecuencia_id' => $request->frecuencia_id,

            ]);

            if (isset($request->codificacion_id)) {
                $contacto->frecuencia->codificacion->update([
                    'tipo_id' => $request->codificacion_id,
                    'dcs_id' => ($request->dcs_id != -1) ? $request->dcs_id : null,
                    'ctcss_id' => ($request->ctcss_id != -1) ? $request->ctcss_id : null,
                ]);

                $contacto->frecuencia->update([
                    'codificacion_id' => $request->codificacion_id,
                ]);
            }

            // REPETIDOR

            $repetidor_bus = Repetidor::where('offset', $request->offset)->where('direccion', $request->direccion)->first();

            if (isset($request->repetidor_id) && !empty($repetidor_bus)) {
                if ($request->repetidor_id == $repetidor_bus->id) { // Mismo Repetidor
                    $contacto->frecuencia->repetidor->update([
                        'offset' => $request->offset,
                        'direccion' => $request->direccion,
                    ]);
                } else {
                    $contacto->frecuencia->update(['repetidor_id' => $repetidor_bus->id]); // Existe pero es diferente por lo que se cambia
                }
            } else { // No existe el repetidor, por lo que se crea nuevo
                $repetidor = Repetidor::create([
                    'offset' => $request->offset,
                    'direccion' => $request->direccion,
                ]);
                $contacto->frecuencia->update(['repetidor_id' => $repetidor->id]);
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
                dd("La crea");
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
            } // FIN  LOCALIZACION




            return redirect('/')->with('mensaje', 'Contacto actualizado con éxito');
        } else {
            return redirect('/login');
        }
    }
}
