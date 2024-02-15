<?php

namespace App\Http\Controllers;

use App\Models\TipoCodificacion;
use App\Models\TipoContacto;
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
                    $usuario->isRoot = $usuario->isRoot;
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

    /**
     * Muestra una lista de los tipos de contacto que hay en BBDD
     */
    public function tipos_contacto()
    {
        if (Auth::check() && Auth::user()->isAdmin) {
            $tipos_contacto = TipoContacto::orderBy('nombre', 'asc')->get();
            return response()->json($tipos_contacto);
        } else {
            return redirect('/login');
        }
    }

    /**
     * Muestra una lista de los tipos de codificacion que hay en BBDD
     */
    public function tipos_codificacion()
    {
        if (Auth::check() && Auth::user()->isAdmin) {
            $tipos_codificacion = TipoCodificacion::orderBy('nombre', 'asc')->get();
            return response()->json($tipos_codificacion);
        } else {
            return redirect('/login');
        }
    }
}
