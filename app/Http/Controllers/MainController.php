<?php

namespace App\Http\Controllers;

use App\Models\User;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;

class MainController extends Controller
{
    public function index()
    {
        if (Auth::check()) {
            return Inertia::render('Inicio', [
                'canLogin' => Route::has('login'),
                'canRegister' => Route::has('register'),
                'username' => Auth::user()->username,
                'title' => 'Inicio',
            ]);
        } else {
            return redirect('/login');
        }
    }
}
