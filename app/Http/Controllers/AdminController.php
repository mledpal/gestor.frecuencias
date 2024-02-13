<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminController extends Controller
{
    /**
     * Función para mostrar una lista de usuarios
     */
    public function usuarios()
    {
        if (Auth::check()) {
            $usuario = Auth::user();
            if ($usuario->isAdmin) {
                $usuarios = User::with('localizacion')->get();
                
                $usuarios = $usuarios->map(function ($usuario) {
                    $usuario->isAdmin = $usuario->isAdmin;
                    return $usuario;
                });
                return response()->json($usuarios);
            } else {
                return null;
            }
        } else {
            // Usuario no autenticado, redireccionar al login
            return redirect('/login');
        }
    }
}
