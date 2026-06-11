<?php

namespace App\Http\Controllers;

use App\Http\Requests\ValidarTipoContacto;
use App\Models\TipoContacto;
use Illuminate\Support\Facades\Auth;

class TiposContactoController extends Controller
{
    public function crear(ValidarTipoContacto $request)
    {
        abort_unless(Auth::user()?->isAdmin, 403);

        TipoContacto::create(['nombre' => $request->nombre, 'color' => $request->color]);

        return back();
    }

    public function editar(ValidarTipoContacto $request)
    {
        abort_unless(Auth::user()?->isAdmin, 403);

        $tipoContacto = TipoContacto::findOrFail($request->id);

        $tipoContacto->update([
            'nombre' => $request->nombre,
            'color' => $request->color,
        ]);

        return back();
    }

    /**
     * Función para eliminar un tipo de contacto por su id
     */
    public function eliminar($id)
    {
        abort_unless(Auth::user()?->isAdmin, 403);

        // El tipo de contacto con id 1 es el tipo por defecto y no se puede borrar.
        abort_if($id == 1, 422, 'No se puede eliminar el tipo de contacto por defecto.');

        TipoContacto::findOrFail($id)->delete();

        return back();
    }
}
