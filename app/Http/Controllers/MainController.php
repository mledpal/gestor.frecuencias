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

            $contactos = Contacto::with('localizacion', 'frecuencia')->where('user_id', $user->id)->get();

            // dd($contactos);

            $roles = $user->roles;

            return Inertia::render('Inicio', [
                'canLogin' => Route::has('login'),
                'canRegister' => Route::has('register'),
                'userDB' => $user,
                'username' => $user->username,
                'title' => 'Inicio',
                'roles' => $roles,
                'contactos' => $contactos,
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
