<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Concerns\ConstruyeSelectsDeContacto;
use App\Models\Contacto;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

class MainController extends Controller
{
    use ConstruyeSelectsDeContacto;

    public function index()
    {
        if (Auth::check()) {

            $user = Auth::user();

            $contactos = Contacto::with('localizacion', 'tipo', 'frecuencia', 'codificacion', 'ctcss', 'dcs', 'banda', 'modo', 'repetidor')->where('user_id', $user->id)->orderBy('nombre', 'asc')->get();

            $campos_select = $this->selectsDeContacto();

            return Inertia::render('Inicio', [
                'canLogin' => Route::has('login'),
                'canRegister' => Route::has('register'),
                'userDB' => $user,
                // 'username' => $user->username,
                'title' => 'Inicio',
                // 'roles' => $roles,
                'contactos' => $contactos,
                'selects' => $campos_select,
            ]);
        } else {
            return redirect('/login');
        }
    }

    // Ruta para desloguearse
    public function logout()
    {
        Auth::logout();

        return Redirect::to('/');
    }

    // Ruta de la vista de la radio
    public function radio()
    {
        return view('radio');
    }
}
