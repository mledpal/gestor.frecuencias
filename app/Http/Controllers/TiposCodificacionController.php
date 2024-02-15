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
            return redirect('/');
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
        if (Auth::check() && $id != 1) {
            $tipo = TipoCodificacion::findorFail($id);

            if ($tipo) {
                try {
                    $tipo->delete();
                } catch (Exception $e) {
                    return null;
                }
            }
        }
    }
}
