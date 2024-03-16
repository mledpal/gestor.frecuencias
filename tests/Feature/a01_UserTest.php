<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Support\Facades\Artisan;
use Tests\TestCase;

class a01_UserTest extends TestCase
{
    public function setUp(): void
    {
        parent::setUp();

        echo "\nCreando la base de datos\n";
        Artisan::call('migrate');

        try {
            echo "\nEjecutando los seeders\n";
            $this->artisan('db:seed');
        } catch (\Exception $e) {
            echo "\nNo se han usado los seeders";
        }

    }

    public function test_User() {

        echo "\nTESTS Registro Usuario\n";
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

        // Borramos el usuario si existe
        $usuarioTest = User::where('email', 'email@gmail.com')->first();
        if($usuarioTest != null) {
            $usuarioTest->delete();
        }

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

        // Comprobamos si el usuario se ha registrado
        $this->assertDatabaseHas('users', [
            'email' => 'email@gmail.com']);


        // Comprobamos si el usuario tiene el rol de usuario
        $usuarioTest = User::where('email', 'email@gmail.com')->first();
        $this->assertDatabaseHas('users_roles', [
            'user_id' => $usuarioTest->id,
            'rol_id' => 4]);

        // Comprobamos si el usuario se ha logueado
        $this->assertAuthenticated();

        // Comprobamos si el usuario se ha redirigido a la página principal
        $registroCorrecto->assertRedirect('/');


        // Comprobamos si se cierra la sesion
        $this->post('/logout');
        $this->assertGuest();


        // Registro con username repetido
        $registroRepetido = $this->post('/register', [
            'username' => 'Test',
            'email' => 'email@gmail.com',
            'password' => 'password',
            'password_confirmation' => 'password',
            'nombre' => 'Test 2',
            'apellidos' => 'Test 2',
            'ip' => $this->app->request->ip(),
            'ultima_conexion' => now()->toDateTimeString(),
        ]);
        $registroRepetido->assertStatus(302)->assertSessionHasErrors(['username']);


        // Registro con email repetido
        $registroRepetido2 = $this->post('/register', [
            'username' => 'Test2',
            'email' => 'email@gmail.com',
            'password' => 'password',
            'password_confirmation' => 'password',
            'nombre' => 'Test 2',
            'apellidos' => 'Test 2',
            'ip' => $this->app->request->ip(),
            'ultima_conexion' => now()->toDateTimeString(),
        ]);
        $registroRepetido2->assertStatus(302)->assertSessionHasErrors(['email']);


        // Intento de registro con las contraseñas NO coincidentes
        $registroIncorrecto = $this->post('/register', [
            'username' => 'Test2',
            'email' => 'email2@gmail.com',
            'password' => 'password',
            'password_confirmation' => 'password2',
            'nombre' => 'Test 2',
            'apellidos' => 'Test 2',
            'ip' => $this->app->request->ip(),
            'ultima_conexion' => now()->toDateTimeString(),
        ]);
        $registroIncorrecto->assertStatus(302)->assertSessionHasErrors(['password']);

        try{
            // Creamos un usuario con permiso de admin para futuras pruebas
            $usuarioAdmin = User::create([
                'username' => 'Admin',
                'email' => 'admin@gmail.com',
                'password' => 'password',
                'password_confirmation' => 'password',
                'nombre' => 'Admin',
                'apellidos' => 'Admin',
                'ip' => $this->app->request->ip(),
                'ultima_conexion' => now()->toDateTimeString(),
        ]);
        $usuarioAdmin->roles()->sync([1,2]);
        } catch (\Exception $e) {
            echo "\nError al crear el usuario Admin\n";
        }


    }
}
