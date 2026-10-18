<?php

namespace Tests\Feature\Api;

use App\Models\Comentario;
use App\Models\Mensaje;
use App\Models\TipoCodificacion;
use App\Models\TipoContacto;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Laravel\Sanctum\Sanctum;
use Tests\Feature\FixtureTestCase;

/**
 * Comentarios, mensajería, perfil y administración de la API móvil.
 */
class ApiSocialTest extends FixtureTestCase
{
    public function test_comentarios_crear_listar_y_borrar_solo_admin_o_propietario(): void
    {
        Sanctum::actingAs($this->usuario);

        $id = $this->postJson('/api/v1/comentarios', [
            'comentario' => 'Se escucha bien',
            'frecuencia_id' => $this->frecuencia->id,
            'localizacion_id' => $this->localizacion->id,
        ])->assertCreated()->assertJsonPath('user.id', $this->usuario->id)->json('id');

        $this->getJson('/api/v1/comentarios?frecuencia_id='.$this->frecuencia->id.'&localizacion_id='.$this->localizacion->id)
            ->assertOk()
            ->assertJsonCount(1)
            ->assertJsonPath('0.comentario', 'Se escucha bien');

        $otro = User::factory()->create();
        Sanctum::actingAs($otro);
        $this->deleteJson("/api/v1/comentarios/{$id}")->assertForbidden();

        Sanctum::actingAs($this->admin);
        $this->putJson("/api/v1/comentarios/{$id}", ['comentario' => 'Editado'])->assertOk()->assertJsonPath('comentario', 'Editado');
        $this->deleteJson("/api/v1/comentarios/{$id}")->assertNoContent();
        $this->assertNull(Comentario::find($id));
    }

    public function test_comentarios_sin_localizacion(): void
    {
        Sanctum::actingAs($this->usuario);

        $this->postJson('/api/v1/comentarios', [
            'comentario' => 'Sin ubicación',
            'frecuencia_id' => $this->frecuencia->id,
        ])->assertCreated();

        $this->getJson('/api/v1/comentarios?frecuencia_id='.$this->frecuencia->id)
            ->assertOk()
            ->assertJsonCount(1);
    }

    public function test_mensajes_enviar_conversacion_y_borrar(): void
    {
        Sanctum::actingAs($this->usuario);

        $this->postJson('/api/v1/mensajes', [
            'destinatario_id' => $this->admin->id,
            'mensaje' => 'Hola admin',
        ])->assertCreated()->assertJsonPath('remitente_id', $this->usuario->id);

        $this->getJson('/api/v1/conversaciones')
            ->assertOk()
            ->assertJsonCount(1)
            ->assertJsonPath('0.id', $this->admin->id)
            ->assertJsonPath('0.last_message', 'Hola admin')
            ->assertJsonPath('0.is_admin', true);

        $this->getJson('/api/v1/conversaciones/'.$this->admin->id)
            ->assertOk()
            ->assertJsonCount(1)
            ->assertJsonPath('0.mensaje', 'Hola admin');

        $this->deleteJson('/api/v1/conversaciones/'.$this->admin->id)->assertNoContent();
        $this->assertSame(0, Mensaje::count());
    }

    public function test_buscar_usuarios_excluye_al_propio(): void
    {
        Sanctum::actingAs($this->usuario);

        $this->postJson('/api/v1/usuarios/buscar', ['usuario' => 'Admin'])
            ->assertOk()
            ->assertJsonCount(1)
            ->assertJsonPath('0.username', 'Admin');
    }

    public function test_perfil_actualiza_datos_localizacion_y_foto(): void
    {
        Storage::fake('images');
        Sanctum::actingAs($this->usuario);

        $this->patchJson('/api/v1/perfil', ['nombre' => 'Miguel', 'indicativo' => 'EA7XYZ'])
            ->assertOk()
            ->assertJsonPath('nombre', 'Miguel')
            ->assertJsonPath('indicativo', 'EA7XYZ');

        $this->putJson('/api/v1/perfil/localizacion', [
            'localidad' => 'Linares',
            'provincia' => 'Jaén',
            'pais' => 'España',
            'gps' => '38.0902883, -3.6244309',
        ])->assertOk()->assertJsonPath('localizacion.id', $this->localizacion->id);

        $respuesta = $this->postJson('/api/v1/perfil/foto', [
            'photo' => UploadedFile::fake()->image('avatar.jpg', 200, 200),
        ])->assertOk();

        $this->assertStringContainsString('/images/user/', $respuesta->json('photo'));
    }

    public function test_perfil_foto_no_cuadrada_devuelve_422(): void
    {
        Storage::fake('images');
        Sanctum::actingAs($this->usuario);

        $this->postJson('/api/v1/perfil/foto', [
            'photo' => UploadedFile::fake()->image('avatar.jpg', 300, 200),
        ])->assertStatus(422);
    }

    public function test_borrar_cuenta_exige_password(): void
    {
        Sanctum::actingAs($this->usuario);

        $this->deleteJson('/api/v1/perfil', ['password' => 'mala'])->assertStatus(422);
        $this->deleteJson('/api/v1/perfil', ['password' => 'password'])->assertNoContent();
        $this->assertNull(User::find($this->usuario->id));
    }

    public function test_admin_prohibido_para_usuario_normal(): void
    {
        Sanctum::actingAs($this->usuario);

        $this->getJson('/api/v1/admin/usuarios')->assertForbidden();
        $this->getJson('/api/v1/admin/tipos-contacto')->assertForbidden();
    }

    public function test_admin_gestiona_usuarios_y_catalogos(): void
    {
        Sanctum::actingAs($this->admin);

        $this->getJson('/api/v1/admin/usuarios')
            ->assertOk()
            ->assertJsonStructure([['id', 'username', 'email', 'is_admin', 'frecuencias_localizadas_count']]);

        $this->postJson('/api/v1/admin/usuarios/'.$this->usuario->id.'/admin')
            ->assertOk()
            ->assertJsonPath('is_admin', true);

        $tipo = $this->postJson('/api/v1/admin/tipos-contacto', ['nombre' => 'Aviación', 'color' => 'sky-500'])
            ->assertCreated()->json('id');
        $this->putJson("/api/v1/admin/tipos-contacto/{$tipo}", ['nombre' => 'Aviación civil', 'color' => 'sky-600'])
            ->assertOk()->assertJsonPath('color', 'sky-600');
        $this->deleteJson("/api/v1/admin/tipos-contacto/{$tipo}")->assertNoContent();
        $this->assertNull(TipoContacto::find($tipo));

        $codificacion = $this->postJson('/api/v1/admin/tipos-codificacion', ['nombre' => 'DMR'])->assertCreated()->json('id');
        $this->deleteJson("/api/v1/admin/tipos-codificacion/{$codificacion}")->assertNoContent();
        $this->assertNull(TipoCodificacion::find($codificacion));

        $this->deleteJson('/api/v1/admin/usuarios/'.$this->usuario->id)->assertNoContent();
        $this->assertNull(User::find($this->usuario->id));
    }
}
