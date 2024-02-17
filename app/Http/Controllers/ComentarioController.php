<?php

namespace App\Http\Controllers;

use App\Events\NuevoComentario;
use App\Http\Requests\ValidarComentario;
use App\Models\Comentario;
use Exception;
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

            $comentario = Comentario::create($nuevoComentario);

            try {
                broadcast(new NuevoComentario($comentario));
            } catch (Exception $e) {
                echo null;
            }

            return back();
        } else {
            return redirect('/login');
        }
    }

    /**
     * Función para editar un comentario (Sólo Admins o propietarios)
     */
    public function editar(ValidarComentario $request)
    {
        if (Auth::check()) {
            $user = Auth::user();

            if ($user->isAdmin || $user->id === $request->user_id) {
                $comentario = Comentario::findOrFail($request->id);
                $comentario->update([
                    'comentario' => $request->comentario,
                ]);
            }
        }
        return back();
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

            $comentario = Comentario::findOrFail($id);
            try {
                broadcast(new NuevoComentario($comentario));
            } catch (Exception $e) {
                echo null;
            }

            if (Comentario::destroy($id)) {
                return back();
                // return json_encode(['mensaje' => 'Comentario eliminado']);
            }
        } else {
            return redirect('/login');
        }
    }
}
