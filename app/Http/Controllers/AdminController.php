<?php

namespace App\Http\Controllers;

use App\Models\Contacto;
use App\Models\TipoCodificacion;
use App\Models\TipoContacto;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

class AdminController extends Controller
{
    /**
     * Función para mostrar una lista de usuarios
     */
    public function usuarios()
    {
        abort_unless(Auth::user()?->isAdmin, 403);

        $usuarios = User::with('localizacion', 'roles')
            ->withCount(['contactos as frecuencias_localizadas_count' => function ($query) {
                $query->whereHas('localizacion', function ($localizacion) {
                    $localizacion->whereNotNull('gps')->where('gps', '!=', '');
                });
            }])
            ->get();

        $usuarios = $usuarios->map(function ($usuario) {
            $usuario->isAdmin = $usuario->isAdmin;
            $usuario->isRoot = $usuario->isRoot;

            return $usuario;
        });

        return response()->json($usuarios);
    }

    /**
     * Devuelve las frecuencias (contactos) de un usuario que tienen ubicación GPS,
     * para mostrarlas en un mapa.
     */
    public function frecuenciasUsuario($id)
    {
        abort_unless(Auth::user()?->isAdmin, 403);

        $contactos = Contacto::with('frecuencia', 'localizacion')
            ->where('user_id', $id)
            ->whereHas('localizacion', function ($query) {
                $query->whereNotNull('gps')->where('gps', '!=', '');
            })
            ->get();

        return response()->json($contactos);
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
