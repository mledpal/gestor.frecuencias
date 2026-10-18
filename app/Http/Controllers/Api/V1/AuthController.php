<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\ValidateRegister;
use App\Http\Resources\UserResource;
use App\Models\Rol;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Validation\ValidationException;

/**
 * Autenticación de la app móvil mediante tokens personales de Sanctum.
 */
class AuthController extends Controller
{
    public function login(LoginRequest $request)
    {
        $request->ensureIsNotRateLimited();

        $usuario = User::where('email', $request->email)->first();

        if (! $usuario || ! Hash::check($request->password, $usuario->password)) {
            RateLimiter::hit($request->throttleKey());

            throw ValidationException::withMessages([
                'email' => trans('auth.failed'),
            ]);
        }

        RateLimiter::clear($request->throttleKey());

        $usuario->ultima_conexion = DB::raw('CURRENT_TIMESTAMP');
        $usuario->ip = $request->ip();
        $usuario->save();

        return $this->respuestaConToken($usuario->refresh(), $request->input('device_name', 'android'));
    }

    public function register(ValidateRegister $request)
    {
        $usuario = User::create([
            'username' => $request->username,
            'nombre' => $request->nombre,
            'apellidos' => $request->apellidos,
            'indicativo' => $request->indicativo ?? '',
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'ultima_conexion' => DB::raw('CURRENT_TIMESTAMP'),
            'ip' => $request->ip(),
        ]);

        // Rol de usuario por defecto
        $usuario->roles()->sync(Rol::where('nombre', 'user')->first());

        event(new Registered($usuario));

        return $this->respuestaConToken($usuario->refresh(), $request->input('device_name', 'android'), 201);
    }

    public function forgotPassword(Request $request)
    {
        $request->validate(['email' => 'required|email']);

        $status = Password::sendResetLink($request->only('email'));

        if ($status !== Password::RESET_LINK_SENT) {
            throw ValidationException::withMessages(['email' => [trans($status)]]);
        }

        return response()->json(['message' => trans($status)]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()?->delete();

        return response()->noContent();
    }

    public function me(Request $request)
    {
        return (new UserResource($request->user()->load('roles', 'localizacion')))->completo();
    }

    private function respuestaConToken(User $usuario, string $dispositivo, int $estado = 200)
    {
        $usuario->load('roles', 'localizacion');

        return response()->json([
            'token' => $usuario->createToken($dispositivo)->plainTextToken,
            'user' => (new UserResource($usuario))->completo(),
        ], $estado);
    }
}
