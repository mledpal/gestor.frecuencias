<?php

use App\Http\Controllers\ContactoController;
use App\Http\Controllers\MainController;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::controller(MainController::class)->group(function () {
    Route::get('/', 'index')->name('index');
    Route::get('/logout', 'logout')->name('index.logout');
    Route::get('/radio', 'radio')->name('index.radio');
});

Route::controller(ContactoController::class)->group(function () {
    Route::post('contacto/crear', 'crear')->name('contacto_crear');
    Route::post('contacto/{id}/eliminar', 'eliminar')->name('contacto_eliminar');
    Route::get('ajax/contacto/get', 'getContacts')->name('contacto_get');
    Route::post('ajax/contacto/{id}', 'actualizar')->name('contacto_actualizar');
});


Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::post('/profile/upload', [ProfileController::class, 'upload'])->name('profile.upload');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__ . '/auth.php';
