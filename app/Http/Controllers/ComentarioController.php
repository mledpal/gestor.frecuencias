<?php

namespace App\Http\Controllers;

use App\Events\NuevoComentario;
use App\Http\Requests\ValidarComentario;
use App\Models\Comentario;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ComentarioController extends Controller
{
    /**
     * Función para crear nuevos comentarios
     */
    public function crear(ValidarComentario $request)
    {

        if (Auth::check()) {
            $user = Auth::user();

            $nuevoComentario['user_id'] = $user->id;
            $nuevoComentario['frecuencia_id'] = $request->frecuencia_id;
            $nuevoComentario['comentario'] = $request->comentario;
            $nuevoComentario['localizacion_id'] = $request->localizacion_id ?? null;

            Comentario::create($nuevoComentario);

            broadcast(new NuevoComentario($nuevoComentario));

            if ($nuevoComentario) {
                return back()->with('mensaje', ['mensaje' => 'MEnsaje creado correctamente']);
            } else {
                return back()->with(
                    'flash',
                    [
                        'mensaje-error' => 'Hubo un problema',
                    ]
                );
            }
        } else {
            return redirect('/login');
        }
    }

    /**
     * Función que devuelve los mensajes solicitadoss
     */

    public function getComentarios($frecuencia, $localizacion)
    {
        if (Auth::check()) {
            $user = Auth::user();

            unset($comentarios);

            $comentarios = Comentario::with(['user:id,photo,username,indicativo'])->where('frecuencia_id', $frecuencia)->where('localizacion_id', $localizacion)->orderBy('created_at', 'desc')->get()->toArray();

            return json_encode($comentarios);
        } else {
            return redirect('/login');
        }
    }

    /**
     * Función que elimina un comentario dada su id
     * @param $id
     */
    public function eliminar($id)
    {
        if (Auth::check()) {

            if (Comentario::destroy($id)) {
                return back();
                // return json_encode(['mensaje' => 'Comentario eliminado']);
            }
        } else {
            return redirect('/login');
        }
    }
}
