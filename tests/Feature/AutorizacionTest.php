<?php

namespace Tests\Feature;

use App\Models\Contacto;
use App\Models\Frecuencia;
use App\Models\Rol;
use App\Models\TipoContacto;
use App\Models\User;
use Database\Seeders\TablaRoles;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

/**
 * Tests autónomos (crean sus propios datos) que verifican las reglas de
 * autorización reforzadas: un usuario no puede actuar sobre recursos de otros
 * y las acciones de administración exigen el rol admin.
 */
class AutorizacionTest extends TestCase
{
    use RefreshDatabase;

    // Siembra los roles una sola vez tras el migrate:fresh inicial, de modo que
    // los ids (2 = admin, 4 = user) sean estables entre tests.
    protected bool $seed = true;

    protected string $seeder = TablaRoles::class;

    /**
     * @param  array<int, int>  $roles  Ids de rol (2 = admin, 4 = user)
     */
    private function crearUsuario(array $roles = [4]): User
    {
        $user = User::factory()->create();
        $user->roles()->sync($roles);

        return $user;
    }

    private function crearContacto(User $user, array $extra = []): Contacto
    {
        $frecuencia = Frecuencia::create(['frecuencia' => '145.500']);

        return Contacto::create(array_merge([
            'nombre' => 'Contacto',
            'comprobado' => false,
            'privado' => false,
            'favorito' => false,
            'fecha' => date('Y-m-d'),
            'frecuencia_id' => $frecuencia->id,
            'user_id' => $user->id,
        ], $extra));
    }

    public function test_la_relacion_rol_users_devuelve_los_usuarios(): void
    {
        $user = $this->crearUsuario([2]);
        $admin = Rol::where('nombre', 'admin')->first();

        $this->assertTrue($admin->users->contains($user));
    }

    public function test_usuario_no_puede_eliminar_contacto_ajeno(): void
    {
        $duenyo = $this->crearUsuario();
        $otro = $this->crearUsuario();
        $contacto = $this->crearContacto($duenyo);

        $this->actingAs($otro)
            ->post(route('contacto_eliminar', ['id' => $contacto->id]))
            ->assertForbidden();

        $this->assertDatabaseHas('contacto', ['id' => $contacto->id]);
    }

    public function test_propietario_puede_eliminar_su_contacto(): void
    {
        $duenyo = $this->crearUsuario();
        $contacto = $this->crearContacto($duenyo);

        $this->actingAs($duenyo)
            ->post(route('contacto_eliminar', ['id' => $contacto->id]))
            ->assertStatus(302);

        $this->assertDatabaseMissing('contacto', ['id' => $contacto->id]);
    }

    public function test_admin_puede_eliminar_contacto_ajeno(): void
    {
        $duenyo = $this->crearUsuario();
        $admin = $this->crearUsuario([2, 4]);
        $contacto = $this->crearContacto($duenyo);

        $this->actingAs($admin)
            ->post(route('contacto_eliminar', ['id' => $contacto->id]))
            ->assertStatus(302);

        $this->assertDatabaseMissing('contacto', ['id' => $contacto->id]);
    }

    public function test_usuario_no_puede_ver_contacto_privado_ajeno(): void
    {
        $duenyo = $this->crearUsuario();
        $otro = $this->crearUsuario();
        $contacto = $this->crearContacto($duenyo, ['privado' => true]);

        $this->actingAs($otro)
            ->get(route('contacto_info', ['id' => $contacto->id]))
            ->assertForbidden();
    }

    public function test_usuario_no_admin_no_puede_eliminar_usuarios(): void
    {
        $user = $this->crearUsuario();
        $victima = $this->crearUsuario();

        $this->actingAs($user)
            ->delete(route('usuario_eliminar', ['id' => $victima->id]))
            ->assertForbidden();

        $this->assertDatabaseHas('users', ['id' => $victima->id]);
    }

    public function test_usuario_no_admin_no_puede_eliminar_tipo_contacto(): void
    {
        $user = $this->crearUsuario();
        $tipo = TipoContacto::create(['nombre' => 'Prueba', 'color' => 'red-500']);

        $this->actingAs($user)
            ->post(route('eliminar_tipo_contacto', ['id' => $tipo->id]))
            ->assertForbidden();

        $this->assertDatabaseHas('tipo_contacto', ['id' => $tipo->id]);
    }

    public function test_admin_puede_eliminar_tipo_contacto(): void
    {
        $admin = $this->crearUsuario([2, 4]);
        $tipo = TipoContacto::create(['nombre' => 'Prueba', 'color' => 'red-500']);

        $this->actingAs($admin)
            ->post(route('eliminar_tipo_contacto', ['id' => $tipo->id]))
            ->assertStatus(302);

        $this->assertDatabaseMissing('tipo_contacto', ['id' => $tipo->id]);
    }
}
