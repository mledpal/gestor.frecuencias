<?php

namespace Tests\Feature;

use App\Models\User;
use Database\Seeders\TablaRoles;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class a01_UserTest extends TestCase
{
    use RefreshDatabase;

    // El registro asigna el rol 'user', por lo que necesitamos los roles sembrados.
    protected bool $seed = true;

    protected string $seeder = TablaRoles::class;

    public function test_user()
    {

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
        if ($usuarioTest != null) {
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
    }
}
