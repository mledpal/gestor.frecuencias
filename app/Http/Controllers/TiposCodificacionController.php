<?php

namespace App\Http\Controllers;

use App\Http\Requests\ValidarTiposCodificacion;
use App\Models\TipoCodificacion;
use Exception;
use Illuminate\Support\Facades\Auth;

class TiposCodificacionController extends Controller
{
    public function crear(ValidarTiposCodificacion $request)
    {
        if (Auth::check() && Auth::user()->isAdmin) {
            try {
                TipoCodificacion::create(['nombre' => $request->nombre]);
            } catch (Exception $e) {
                return null;
            }
        } else {
            return redirect('/', 302);
        }
    }

    public function editar(ValidarTiposCodificacion $request)
    {
        if (Auth::check() && Auth::user()->isAdmin) {
            $tipo = TipoCodificacion::findOrFail($request->id);

            try {
                $tipo->update([
                    'nombre' => $request->nombre,
                ]);
            } catch (Exception $e) {
                return null;
            }
        } else {
            return redirect('/');
        }
    }

    /**
     * Función para eliminar un tipo de contacto por su id
     */
    public function eliminar($id)
    {
        if (Auth::check() && Auth::user()->isAdmin) {

            if (TipoCodificacion::destroy($id)) {
                return response()->json(['mensaje' => 'Tipo de codificación eliminado correctamente'], 200);
            } else {
                return response()->json(['mensaje' => 'Tipo de codificación no fue eliminado '], 404);
            }
        } else {
            return redirect('/', 302);
        }
    }
}
