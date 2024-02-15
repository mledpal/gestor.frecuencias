<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\ComentarioController;
use App\Http\Controllers\ContactoController;
use App\Http\Controllers\FrecuenciaController;
use App\Http\Controllers\MainController;
use App\Http\Controllers\MensajeController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\TiposContactoController;
use App\Http\Controllers\UserController;
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

Route::controller(AdminController::class)->group(function () {
    Route::get('admin/usuarios', 'usuarios')->name('admin_usuarios');
    Route::get('admin/tipos_contacto', 'tipos_contacto')->name('admin_tipos_contacto');
});

Route::controller(UserController::class)->group(function () {
    Route::post('user/busqueda', 'busqueda')->name('usuario_busqueda');
    Route::get('user/{id}/getInfo', 'getInfo')->name('usuario_informacion');
    Route::post('user/{id}/delete', 'eliminar')->name('usuario_eliminar');
    Route::post('/user/{id}/swapAdmin', 'swapAdmin')->name('usuario_swap_admin');
});

Route::controller(MensajeController::class)->group(function () {
    Route::post('mensajes/enviar', 'enviarMensaje')->name('enviar_mensaje');
    Route::get('mensajes/recuperar', 'getConversaciones')->name('todas_conversaciones');
    Route::get('mensajes/{destinoId}/recuperar', 'recuperarConversacion')->name('recuperar_conversacion');
    Route::delete('mensajes/{id}/delete', 'borrarConversacion')->name('borrar_conversacion');
});

Route::controller(TiposContactoController::class)->group(function () {
    Route::post('tipo_contacto/nuevo', 'crear')->name('nuevo_tipo_contacto');
    Route::post('tipo_contacto/{id}/editar', 'editar')->name('editar_tipo_contacto');
    Route::post('tipo_contacto/{id}/eliminar', 'eliminar')->name('eliminar_tipo_contacto');
});



Route::controller(MainController::class)->group(function () {
    Route::get('/', 'index')->name('index');
    Route::get('/logout', 'logout')->name('index.logout');
    Route::get('/radio', 'radio')->name('index.radio');
    Route::get('/exportar', 'exportar')->name('exportar');
    Route::get('/importar', 'importar')->name('importar');
});

Route::controller(ContactoController::class)->group(function () {
    Route::post('contacto/crear', 'crear')->name('contacto_crear');
    Route::post('contacto/{id}/eliminar', 'eliminar')->name('contacto_eliminar');
    Route::get('ajax/contacto/get', 'getContacts')->name('contacto_get');
    Route::get('ajax/contacto/{id}', 'getContactInfo')->name('contacto_info');
    Route::post('ajax/contacto/{id}', 'actualizar')->name('contacto_actualizar');
    Route::post('/', 'busqueda')->name('contacto_busqueda');
});

Route::controller(ComentarioController::class)->group(function () {
    Route::post('comentario/crear', 'crear')->name('comentario_crear');
    Route::get('/comentario/{frecuencia}/{localizacion}', 'getComentarios')->name('comentario_fetch');
    Route::delete('/comentario/{id}/eliminar', 'eliminar')->name('comentario_eliminar');
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
