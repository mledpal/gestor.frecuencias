<?php

namespace App\Http\Controllers;

use App\Http\Requests\ValidarContacto;
use App\Models\Contacto;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ContactoController extends Controller
{
    public function actualizar(ValidarContacto $request)
    {
        if (Auth::check()) {

            $user = Auth::user();
            $requestAll = $request->all();
            
            if(!isset($requestAll['comprobado'])) {
                $requestAll['comprobado'] = false;
            }

            $contacto = Contacto::findorFail($request->id);

            $contacto->update($requestAll);


            return redirect('/')->with('mensaje', 'Contacto actualizado con éxito');

        } else {
            return redirect('/login');
        }
    }
}
