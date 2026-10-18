<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\ValidarUsuario;
use App\Http\Resources\UserResource;
use App\Models\User;

class UsuarioController extends Controller
{
    public function buscar(ValidarUsuario $request)
    {
        $usuarios = User::with('roles')
            ->select('id', 'username', 'photo', 'indicativo')
            ->whereNot('id', $request->user()->id)
            ->orderBy('username', 'asc');

        if (isset($request->usuario)) {
            $usuarios->where('username', 'like', '%'.$request->usuario.'%');
        }

        if (isset($request->localidad)) {
            $usuarios->whereHas('localizacion', function ($query) use ($request) {
                $query->where('localidad', 'like', '%'.$request->localidad.'%');
            });
        }

        if (isset($request->provincia)) {
            $usuarios->whereHas('localizacion', function ($query) use ($request) {
                $query->where('provincia', 'like', '%'.$request->provincia.'%');
            });
        }

        if (isset($request->indicativo)) {
            $usuarios->where('indicativo', 'like', '%'.$request->indicativo.'%');
        }

        return UserResource::collection($usuarios->limit(100)->get());
    }

    public function show(User $usuario)
    {
        return new UserResource($usuario->load('roles'));
    }
}
