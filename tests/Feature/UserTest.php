<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\DB;
use Tests\TestCase;

class UserTest extends TestCase
{
    public function test_register() {
        Artisan::call('migrate');

        // Comprobamos si carga el formulario de registro
        $carga = $this->get('/register');
        $carga->assertStatus(200);
        $carga->assertSee('Register');
        $carga->assertSee('email');
        $carga->assertSee('password');


        // Registro Incorrecto
        $registroFallido = $this->post('/register', [
            'name' => 'Test',
            'email' => 'aaaaaa'] // Email incorrecto
        );

        $registroFallido->assertStatus(302)->assertSessionHasErrors(['email']);

        echo $this->app->request->ip();

        // Registro Correcto
        $registroCorrecto = $this->post('/register', [
            'username' => 'Test',
            'email' => 'email@gmail.com',
            'password' => 'password',
            'password_confirmation' => 'password',
            'nombre' => 'Test',
            'apellidos' => 'Test',
            'ip' => $this->app->request->ip(),
            'ultima_conexion' => now()->toDateTimeString(),
        ]);


        $registroCorrecto->assertStatus(302)->assertSessionHasNoErrors();

    }
}
