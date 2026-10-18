<?php

use App\Http\Controllers\Api\V1\AdminController;
use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\CatalogoController;
use App\Http\Controllers\Api\V1\ComentarioController;
use App\Http\Controllers\Api\V1\ContactoController;
use App\Http\Controllers\Api\V1\MensajeController;
use App\Http\Controllers\Api\V1\PerfilController;
use App\Http\Controllers\Api\V1\UsuarioController;
use App\Http\Middleware\ForzarRespuestaJson;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| API REST de la app móvil (Android). Autenticación con tokens personales
| de Sanctum (`Authorization: Bearer <token>`). Todas las respuestas son JSON.
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::prefix('v1')->middleware(ForzarRespuestaJson::class)->name('api.')->group(function () {

    Route::controller(AuthController::class)->middleware('throttle:10,1')->group(function () {
        Route::post('auth/login', 'login')->name('login');
        Route::post('auth/register', 'register')->name('register');
        Route::post('auth/forgot-password', 'forgotPassword')->name('forgot_password');
    });

    Route::middleware('auth:sanctum')->group(function () {

        Route::controller(AuthController::class)->group(function () {
            Route::post('auth/logout', 'logout')->name('logout');
            Route::get('me', 'me')->name('me');
        });

        Route::get('selects', [CatalogoController::class, 'selects'])->name('selects');

        Route::controller(ContactoController::class)->group(function () {
            Route::get('contactos', 'index')->name('contactos.index');
            Route::post('contactos', 'store')->name('contactos.store');
            Route::post('contactos/buscar', 'buscar')->name('contactos.buscar');
            Route::get('contactos/{contacto}', 'show')->name('contactos.show');
            Route::put('contactos/{contacto}', 'update')->name('contactos.update');
            Route::delete('contactos/{contacto}', 'destroy')->name('contactos.destroy');
        });

        Route::controller(ComentarioController::class)->group(function () {
            Route::get('comentarios', 'index')->name('comentarios.index');
            Route::post('comentarios', 'store')->name('comentarios.store');
            Route::put('comentarios/{comentario}', 'update')->name('comentarios.update');
            Route::delete('comentarios/{comentario}', 'destroy')->name('comentarios.destroy');
        });

        Route::controller(MensajeController::class)->group(function () {
            Route::get('conversaciones', 'conversaciones')->name('conversaciones.index');
            Route::get('conversaciones/{usuario}', 'conversacion')->whereNumber('usuario')->name('conversaciones.show');
            Route::delete('conversaciones/{usuario}', 'borrar')->whereNumber('usuario')->name('conversaciones.destroy');
            Route::post('mensajes', 'enviar')->name('mensajes.store');
        });

        Route::controller(UsuarioController::class)->group(function () {
            Route::post('usuarios/buscar', 'buscar')->name('usuarios.buscar');
            Route::get('usuarios/{usuario}', 'show')->name('usuarios.show');
        });

        Route::controller(PerfilController::class)->prefix('perfil')->name('perfil.')->group(function () {
            Route::patch('/', 'update')->name('update');
            Route::put('localizacion', 'localizacion')->name('localizacion');
            Route::put('password', 'password')->name('password');
            Route::post('foto', 'foto')->name('foto');
            Route::delete('/', 'destroy')->name('destroy');
        });

        Route::controller(AdminController::class)->prefix('admin')->name('admin.')->middleware('can:admin')->group(function () {
            Route::get('usuarios', 'usuarios')->name('usuarios');
            Route::get('usuarios/{usuario}/frecuencias', 'frecuenciasUsuario')->name('usuarios.frecuencias');
            Route::post('usuarios/{usuario}/admin', 'swapAdmin')->name('usuarios.admin');
            Route::delete('usuarios/{usuario}', 'eliminarUsuario')->name('usuarios.destroy');

            Route::get('tipos-contacto', 'tiposContacto')->name('tipos_contacto.index');
            Route::post('tipos-contacto', 'crearTipoContacto')->name('tipos_contacto.store');
            Route::put('tipos-contacto/{tipo}', 'editarTipoContacto')->name('tipos_contacto.update');
            Route::delete('tipos-contacto/{tipo}', 'eliminarTipoContacto')->name('tipos_contacto.destroy');

            Route::get('tipos-codificacion', 'tiposCodificacion')->name('tipos_codificacion.index');
            Route::post('tipos-codificacion', 'crearTipoCodificacion')->name('tipos_codificacion.store');
            Route::put('tipos-codificacion/{tipo}', 'editarTipoCodificacion')->name('tipos_codificacion.update');
            Route::delete('tipos-codificacion/{tipo}', 'eliminarTipoCodificacion')->name('tipos_codificacion.destroy');
        });
    });
});
