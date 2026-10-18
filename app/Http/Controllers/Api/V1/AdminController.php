<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\ValidarTipoContacto;
use App\Http\Requests\ValidarTiposCodificacion;
use App\Http\Resources\ContactoResource;
use App\Http\Resources\UserResource;
use App\Models\Contacto;
use App\Models\TipoCodificacion;
use App\Models\TipoContacto;
use App\Models\User;

/**
 * Panel de administración de la app móvil. Todas las rutas van tras
 * `can:admin` (Gate definido en AuthServiceProvider); el usuario root (id 1)
 * y el tipo de contacto por defecto (id 1) están protegidos igual que en la web.
 */
class AdminController extends Controller
{
    public function usuarios()
    {
        $usuarios = User::with('localizacion', 'roles')
            ->withCount(['contactos as frecuencias_localizadas_count' => function ($query) {
                $query->whereHas('localizacion', function ($localizacion) {
                    $localizacion->whereNotNull('gps')->where('gps', '!=', '');
                });
            }])
            ->orderBy('username')
            ->get();

        return response()->json($usuarios->map(fn (User $usuario) => [
            ...(new UserResource($usuario))->completo()->resolve(),
            'frecuencias_localizadas_count' => $usuario->frecuencias_localizadas_count,
        ]));
    }

    public function frecuenciasUsuario(User $usuario)
    {
        $contactos = Contacto::with('frecuencia', 'localizacion', 'tipo')
            ->where('user_id', $usuario->id)
            ->whereHas('localizacion', function ($query) {
                $query->whereNotNull('gps')->where('gps', '!=', '');
            })
            ->get();

        return ContactoResource::collection($contactos);
    }

    public function swapAdmin(User $usuario)
    {
        abort_if($usuario->id === 1, 422, 'No se puede modificar el usuario root.');

        $roles = $usuario->roles->pluck('id')->all();
        $roles = $usuario->isAdmin
            ? array_diff($roles, [2])
            : array_merge($roles, [2]);

        $usuario->roles()->sync(array_values(array_unique($roles)));

        return (new UserResource($usuario->load('roles', 'localizacion')))->completo();
    }

    public function eliminarUsuario(User $usuario)
    {
        abort_if($usuario->id === 1, 422, 'No se puede eliminar el usuario root.');

        $usuario->tokens()->delete();
        $usuario->delete();

        return response()->noContent();
    }

    // TIPOS DE CONTACTO

    public function tiposContacto()
    {
        return response()->json(TipoContacto::orderBy('nombre', 'asc')->get(['id', 'nombre', 'color']));
    }

    public function crearTipoContacto(ValidarTipoContacto $request)
    {
        $tipo = TipoContacto::create($request->only('nombre', 'color'));

        return response()->json($tipo->only('id', 'nombre', 'color'), 201);
    }

    public function editarTipoContacto(ValidarTipoContacto $request, TipoContacto $tipo)
    {
        $tipo->update($request->only('nombre', 'color'));

        return response()->json($tipo->only('id', 'nombre', 'color'));
    }

    public function eliminarTipoContacto(TipoContacto $tipo)
    {
        abort_if($tipo->id === 1, 422, 'No se puede eliminar el tipo de contacto por defecto.');

        $tipo->delete();

        return response()->noContent();
    }

    // TIPOS DE CODIFICACIÓN

    public function tiposCodificacion()
    {
        return response()->json(TipoCodificacion::orderBy('nombre', 'asc')->get(['id', 'nombre']));
    }

    public function crearTipoCodificacion(ValidarTiposCodificacion $request)
    {
        $tipo = TipoCodificacion::create($request->only('nombre'));

        return response()->json($tipo->only('id', 'nombre'), 201);
    }

    public function editarTipoCodificacion(ValidarTiposCodificacion $request, TipoCodificacion $tipo)
    {
        $tipo->update($request->only('nombre'));

        return response()->json($tipo->only('id', 'nombre'));
    }

    public function eliminarTipoCodificacion(TipoCodificacion $tipo)
    {
        $tipo->delete();

        return response()->noContent();
    }
}
