<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\ValidateRegister;
use App\Models\Rol;
use App\Models\User;
use App\Providers\RouteServiceProvider;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpKernel\EventListener\ValidateRequestListener;

class RegisteredUserController extends Controller
{
    /**
     * Display the registration view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Register');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(ValidateRegister $request): RedirectResponse
    {

        if ($request->indicativo == NULL) $indicativo = "";

        $user = User::create([
            'username' => $request->username,
            'nombre' => $request->nombre,
            'apellidos' => $request->apellidos,
            'indicativo' => $request->indicativo ?? $indicativo,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'ultima_conexion' => DB::raw('CURRENT_TIMESTAMP'),
            'ip' => $request->ip(),
        ]);

        // Asigno el rol de usuario por defecto
        // y se guarda en la tabla pivote
        $user_rol = Rol::where('nombre', 'user')->first()->id;
        $user->roles()->sync($user_rol);

        event(new Registered($user));

        Auth::login($user);

        return redirect('/');
    }
}
