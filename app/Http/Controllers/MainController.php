<?php

namespace App\Http\Controllers;

use App\Models\Banda;
use App\Models\Codificacion;
use App\Models\Contacto;
use App\Models\Ctcss;
use App\Models\Dcs;
use App\Models\ModoTransmision;
use App\Models\Rol;
use App\Models\TipoCodificacion;
use App\Models\TipoContacto;
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

            $tipos_contacto = TipoContacto::orderBy('nombre', 'ASC')->get()->pluck('nombre', 'id')->toArray();

            $bandas = Banda::orderBy('id', 'ASC')->get()->pluck('banda', 'id')->toArray();
            $bandas[-1] = "Desconocido";

            $modos = ModoTransmision::orderBy('id', 'ASC')->get()->pluck('nombre', 'id')->toArray();
            $modos[-1] = "Desconocido";

            $tiposCodificacion = TipoCodificacion::orderBy('nombre', 'ASC')->get()->pluck('nombre', 'id')->toArray();
            $tiposCodificacion[-1] = "Ninguna";

            $dcsCodes = Dcs::orderBy('codigo', 'ASC')->get()->pluck('codigo', 'id')->toArray();
            $dcsCodes[-1] = "Ninguno";

            $ctcssCodes = Ctcss::orderBy('codigo', 'ASC')->get()->pluck('codigo', 'id')->toArray();
            $ctcssCodes[-1] = 'Ninguno';

            $contactos = Contacto::with('localizacion', 'tipo', 'frecuencia', 'codificacion', 'ctcss', 'dcs', 'banda', 'modo', 'repetidor')->where('user_id', $user->id)->orderBy('nombre', 'asc')->get();

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
