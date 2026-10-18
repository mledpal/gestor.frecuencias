<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\ProfileImageRequest;
use App\Http\Resources\UserResource;
use App\Models\Localizacion;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;

class PerfilController extends Controller
{
    public function update(Request $request)
    {
        $usuario = $request->user();

        $datos = $request->validate([
            'nombre' => 'sometimes|required|string|max:50',
            'apellidos' => 'sometimes|required|string|max:150',
            'email' => ['sometimes', 'required', 'email', 'max:255', Rule::unique(User::class)->ignore($usuario->id)],
            'indicativo' => 'sometimes|nullable|string|max:30',
        ]);

        $usuario->fill($datos);

        if ($usuario->isDirty('email')) {
            $usuario->email_verified_at = null;
        }

        $usuario->save();

        return $this->perfil($usuario);
    }

    /**
     * Asigna al usuario una localización del catálogo (o la crea si no existe).
     */
    public function localizacion(Request $request)
    {
        $datos = $request->validate([
            'localidad' => 'nullable|string|max:255',
            'provincia' => 'nullable|string|max:255',
            'pais' => 'nullable|string|max:255',
            'gps' => 'nullable|string|max:100',
        ]);

        $localizacion = Localizacion::firstOrCreate([
            'localidad' => $datos['localidad'] ?? null,
            'provincia' => $datos['provincia'] ?? null,
            'pais' => $datos['pais'] ?? null,
            'gps' => $datos['gps'] ?? null,
        ]);

        $usuario = $request->user();
        $usuario->update(['localizacion_id' => $localizacion->id]);

        return $this->perfil($usuario);
    }

    public function password(Request $request)
    {
        $datos = $request->validate([
            'current_password' => ['required', 'current_password'],
            'password' => ['required', Password::defaults(), 'confirmed'],
        ]);

        $request->user()->update(['password' => $datos['password']]);

        return response()->noContent();
    }

    public function foto(ProfileImageRequest $request)
    {
        $request->validate(['photo' => 'required']);

        $usuario = $request->user();

        // getRawOriginal(): el accessor `photo` antepone '/images/'.
        $usuario->photo = User::setArchivo($request->file('photo'), 'user/'.$usuario->username, $usuario->getRawOriginal('photo'));
        $usuario->save();

        return $this->perfil($usuario);
    }

    public function destroy(Request $request)
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $usuario = $request->user();
        $usuario->tokens()->delete();
        $usuario->delete();

        return response()->noContent();
    }

    private function perfil(User $usuario)
    {
        return (new UserResource($usuario->refresh()->load('roles', 'localizacion')))->completo();
    }
}
