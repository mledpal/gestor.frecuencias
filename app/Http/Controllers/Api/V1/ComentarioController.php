<?php

namespace App\Http\Controllers\Api\V1;

use App\Events\ComentarioEliminado;
use App\Events\NuevoComentario;
use App\Http\Controllers\Controller;
use App\Http\Requests\ValidarComentario;
use App\Http\Resources\ComentarioResource;
use App\Models\Comentario;
use Exception;
use Illuminate\Http\Request;

class ComentarioController extends Controller
{
    /**
     * Comentarios de una frecuencia + localización (también sin localización).
     */
    public function index(Request $request)
    {
        $request->validate([
            'frecuencia_id' => 'required|integer',
            'localizacion_id' => 'nullable|integer',
        ]);

        $comentarios = Comentario::with('user.roles')
            ->where('frecuencia_id', $request->frecuencia_id)
            ->where('localizacion_id', $request->localizacion_id)
            ->orderBy('created_at', 'desc')
            ->get();

        return ComentarioResource::collection($comentarios);
    }

    public function store(ValidarComentario $request)
    {
        $comentario = Comentario::create([
            'user_id' => $request->user()->id,
            'frecuencia_id' => $request->frecuencia_id,
            'comentario' => $request->comentario,
            'localizacion_id' => $request->localizacion_id ?? null,
        ]);

        try {
            broadcast(new NuevoComentario($comentario));
        } catch (Exception $e) {
            report($e);
        }

        return (new ComentarioResource($comentario->load('user.roles')))->response()->setStatusCode(201);
    }

    public function update(Request $request, Comentario $comentario)
    {
        $this->authorize('update', $comentario);

        $request->validate(['comentario' => 'required|string']);

        $comentario->update(['comentario' => $request->comentario]);

        return new ComentarioResource($comentario->load('user.roles'));
    }

    public function destroy(Comentario $comentario)
    {
        $this->authorize('delete', $comentario);

        $comentario->delete();

        try {
            broadcast(new ComentarioEliminado($comentario));
        } catch (Exception $e) {
            report($e);
        }

        return response()->noContent();
    }
}
