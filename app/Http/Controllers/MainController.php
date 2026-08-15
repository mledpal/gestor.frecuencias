<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Concerns\ConstruyeSelectsDeContacto;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

class MainController extends Controller
{
    use ConstruyeSelectsDeContacto;

    public function index()
    {
        if (Auth::check()) {

            $user = Auth::user();

            $campos_select = $this->selectsDeContacto();

            return Inertia::render('Inicio', [
                'canLogin' => Route::has('login'),
                'canRegister' => Route::has('register'),
                'userDB' => $user,
                // 'username' => $user->username,
                'title' => 'Inicio',
                // 'roles' => $roles,
                'selects' => $campos_select,
            ]);
        } else {
            return redirect('/login');
        }
    }
}
