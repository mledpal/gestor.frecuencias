<?php

namespace App\Http\Controllers;

use App\Http\Requests\ValidarTipoContacto;
use App\Models\TipoContacto;
use Exception;
use Illuminate\Support\Facades\Auth;

class TiposContactoController extends Controller
{
    public function crear(ValidarTipoContacto $request)
    {
        if (Auth::check() && Auth::user()->isAdmin) {
            try {
                TipoContacto::create(['nombre' => $request->nombre, 'color' => $request->color]);
            } catch (Exception $e) {
                return null;
            }
        } else {
            return redirect('/');
        }
    }

    public function editar(ValidarTipoContacto $request)
    {
        if (Auth::check() && Auth::user()->isAdmin) {
            $tipoContacto = TipoContacto::findOrFail($request->id);

            try {
                $tipoContacto->update([
                    'nombre' => $request->nombre,
                    'color' => $request->color,
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
            $tipoContacto = TipoContacto::findorFail($id);

            if ($tipoContacto) {
                try {
                    $tipoContacto->delete();
                } catch (Exception $e) {
                    return null;
                }
            }
        }
    }
}
