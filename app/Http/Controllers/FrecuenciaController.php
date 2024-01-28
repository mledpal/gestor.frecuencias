<?php

namespace App\Http\Controllers;

use App\Models\Banda;
use App\Models\Contacto;
use App\Models\Ctcss;
use App\Models\Dcs;
use App\Models\Frecuencia;
use App\Models\ModoTransmision;
use App\Models\TipoCodificacion;
use App\Models\TipoContacto;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

class FrecuenciaController extends Controller
{
    /**
     * Función para buscar Contactos/Frecuencias
     */
    public function busqueda(Request $request)
    {

        $user = Auth::user();

        if (Auth::check()) {
            $frecuencias = Frecuencia::with('contacto', 'contacto.tipo', 'contacto.codificacion', 'contacto.banda')->limit(5);

            if (isset($request->frecuencia)) {
                $frecuencias->where('frecuencia', 'like', '%' . $request->frecuencia . '%');
            }

            // if (isset($request->nombre)) {
            //     $frecuencias->where('frecuencia', 'like', '%' . $request->frecuencia . '%');
            // }

            $busqueda = $frecuencias->get()->toArray();


            $tipos_contacto = TipoContacto::orderBy('nombre', 'ASC')->get()->pluck('nombre', 'id')->toArray();

            $bandas = Banda::orderBy('id', 'ASC')->get()->pluck('banda', 'id')->toArray();
            $bandas[-1] = "Desconocido";

            $modos = ModoTransmision::orderBy('id', 'ASC')->get()->pluck('nombre', 'id')->toArray();
            $modos[-1] = "Desconocido";

            $tiposCodificacion = TipoCodificacion::orderBy('nombre', 'ASC')->get()->pluck('nombre', 'id')->toArray();
            $tiposCodificacion[-1] = "Desconocido";

            $dcsCodes = Dcs::orderBy('codigo', 'ASC')->get()->pluck('codigo', 'id')->toArray();
            $dcsCodes[-1] = "Desconocido";

            $ctcssCodes = Ctcss::orderBy('codigo', 'ASC')->get()->pluck('codigo', 'id')->toArray();
            $ctcssCodes[-1] = 'Desconocido';

            $direcciones = ['=' => '=', '+' => '+', '-' => '-'];
            $roles = $user->roles;

            $campos_select = [
                'tipos_contacto' => $tipos_contacto,
                'modos' => $modos,
                'codificaciones' => $tiposCodificacion,
                'dcs' => $dcsCodes,
                'ctcss' => $ctcssCodes,
                'direcciones' => $direcciones,
                'bandas' => $bandas,
            ];

            $contactos = Contacto::with('localizacion', 'tipo', 'frecuencia', 'codificacion', 'ctcss', 'dcs', 'banda', 'modo', 'repetidor')->where('user_id', $user->id)->orderBy('nombre', 'asc')->get();

            return Inertia::render('Inicio', [
                'canLogin' => Route::has('login'),
                'canRegister' => Route::has('register'),
                'userDB' => $user,
                'username' => $user->username,
                'title' => 'Inicio',
                'roles' => $roles,
                'contactos' => $contactos,
                'selects' => $campos_select,
                'busqueda' => $busqueda,
            ]);
        } else {
            return redirect('/');
        }
    }
}
