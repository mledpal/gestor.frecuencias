<?php

namespace App\Http\Controllers;

use App\Models\Contacto;
use App\Models\Rol;
use App\Models\User;
use Illuminate\Contracts\Database\Eloquent\Builder;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Route;

class MainController extends Controller
{
    public function index()
    {
        if (Auth::check()) {

            $user = Auth::user();

            $tipos_contacto = ['Servicio' => 'Servicio', 'Persona' => 'Persona', 'Evento' => 'Evento'];

            $contactos = Contacto::with('localizacion', 'frecuencia', 'frecuencia.codificacion', 'frecuencia.codificacion.tipo', 'frecuencia.codificacion.ctcss', 'frecuencia.codificacion.dcs', 'frecuencia.modo')->where('user_id', $user->id)->get();

            $roles = $user->roles;

            return Inertia::render('Inicio', [
                'canLogin' => Route::has('login'),
                'canRegister' => Route::has('register'),
                'userDB' => $user,
                'username' => $user->username,
                'title' => 'Inicio',
                'roles' => $roles,
                'contactos' => $contactos,
                'tipos_contacto' => $tipos_contacto,
            ]);
        } else {
            return redirect('/login');
        }
    }

    public function logout()
    {
        Auth::logout();
        return Redirect::to('/');
    }

    public function radio()
    {
        return view('radio');
    }

}
