<?php

namespace App\Http\Controllers;

use App\Http\Requests\ValidarLocalizacion;
use App\Models\Localizacion;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    public function updateLocalizacion(ValidarLocalizacion $request)
    {
        if (Auth::check()) {

            $usuario = User::findOrFail(Auth::user()->id);

            // LOCALIZACION

            $localizacion_bus = Localizacion::where('localidad', $request->localidad)->where('provincia', $request->provincia)->where('pais', $request->pais)->where('gps', $request->gps)->first();

            if ($localizacion_bus) { // Si la localización existe en la BBDD

                if ($localizacion_bus->id !== $usuario->localizacion_id) { // Si NO Es la misma localización que tenía guardada
                    $usuario->update(['localizacion_id' => $localizacion_bus->id]);
                } // Si es la misma, no hace nada
            } else { // Si la localización no está guardada , la crea y la asigna
                $nuevaLocalizacion = Localizacion::create([
                    'localidad' => $request->localidad,
                    'provincia' => $request->provincia ?? null,
                    'pais' => $request->pais,
                    'gps' => $request->gps,
                ]);

                $usuario->update([
                    'localizacion_id' => $nuevaLocalizacion->id,
                ]);

            } // FIN  LOCALIZACION

            return back()->with('flash', ['mensaje' => 'Localización actualizada correctamente']);

        } else {
            return route('/login');
        }
    }
}
