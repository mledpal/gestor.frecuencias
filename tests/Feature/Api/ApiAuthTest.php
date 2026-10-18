<?php

namespace Tests\Feature\Api;

use App\Models\User;
use Laravel\Sanctum\Sanctum;
use Tests\Feature\FixtureTestCase;

class ApiAuthTest extends FixtureTestCase
{
    public function test_login_devuelve_token_y_usuario(): void
    {
        $respuesta = $this->postJson('/api/v1/auth/login', [
            'email' => 'email@gmail.com',
            'password' => 'password',
            'device_name' => 'test',
        ])->assertOk()
            ->assertJsonStructure(['token', 'user' => ['id', 'username', 'email', 'photo', 'is_admin', 'is_root']]);

        $this->assertFalse($respuesta->json('user.is_admin'));
        $this->assertStringStartsWith('http', $respuesta->json('user.photo'));

        $this->withToken($respuesta->json('token'))
            ->getJson('/api/v1/me')
            ->assertOk()
            ->assertJsonPath('id', $this->usuario->id);
    }

    public function test_login_con_credenciales_invalidas_devuelve_422(): void
    {
        $this->postJson('/api/v1/auth/login', [
            'email' => 'email@gmail.com',
            'password' => 'incorrecta',
        ])->assertStatus(422)->assertJsonValidationErrors('email');
    }

    public function test_registro_crea_usuario_con_rol_user(): void
    {
        $respuesta = $this->postJson('/api/v1/auth/register', [
            'username' => 'nuevo_usuario',
            'nombre' => 'Nuevo',
            'apellidos' => 'Usuario',
            'email' => 'nuevo@example.com',
            'password' => 'Secreta123!',
            'password_confirmation' => 'Secreta123!',
        ])->assertCreated()->assertJsonStructure(['token', 'user']);

        $usuario = User::find($respuesta->json('user.id'));
        $this->assertTrue($usuario->roles->contains('id', 4));
    }

    public function test_logout_revoca_el_token(): void
    {
        $token = $this->usuario->createToken('test')->plainTextToken;

        $this->withToken($token)->postJson('/api/v1/auth/logout')->assertNoContent();

        $this->assertCount(0, $this->usuario->tokens()->get());
    }

    public function test_sin_token_devuelve_401_json(): void
    {
        $this->get('/api/v1/contactos')->assertUnauthorized()->assertJson(['message' => 'Unauthenticated.']);
    }

    public function test_selects_devuelve_listas_con_opcion_desconocido_primero(): void
    {
        Sanctum::actingAs($this->usuario);

        $respuesta = $this->getJson('/api/v1/selects')
            ->assertOk()
            ->assertJsonStructure(['tipos_contacto', 'modos', 'codificaciones', 'dcs', 'ctcss', 'bandas', 'direcciones']);

        $this->assertSame(-1, $respuesta->json('modos.0.id'));
        $this->assertSame('Desconocido', $respuesta->json('modos.0.nombre'));
        $this->assertSame(['=', '+', '-'], $respuesta->json('direcciones'));
    }

    public function test_broadcast_auth_acepta_token(): void
    {
        $otro = User::factory()->create();
        $ids = [$this->usuario->id, $otro->id];
        sort($ids);

        Sanctum::actingAs($this->usuario);

        $this->postJson('/api/broadcasting/auth', [
            'socket_id' => '1234.5678',
            'channel_name' => 'private-canal-'.$ids[0].'-'.$ids[1].'-mensajes',
        ])->assertOk()->assertJsonStructure(['auth']);
    }
}
