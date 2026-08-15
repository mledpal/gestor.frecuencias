<?php

namespace Tests\Feature;

use App\Events\ComentarioEliminado;
use App\Events\NuevoComentario;
use App\Models\Comentario;
use App\Models\User;
use Illuminate\Support\Facades\Event;

class a03_ComentarioTest extends FixtureTestCase
{
    /**
     * Test de creación, edición y borrado de comentarios con sus reglas de
     * autorización.
     */
    public function test_comentarios(): void
    {
        $usuario = $this->usuario;
        $admin = $this->admin;
        $frecuencia = $this->frecuencia;
        $localizacion = $this->localizacion;

        // Creamos un comentario vacio y debe fallar
        $this->actingAs($usuario)->post('/comentario/crear', [
            'frecuencia_id' => $frecuencia->id,
            'comentario' => '',
            'localizacion_id' => $localizacion->id,
        ])->assertStatus(302)->assertSessionHasErrors(['comentario']);

        // Creamos un comentario con datos válidos
        $this->actingAs($usuario)->post('/comentario/crear', [
            'frecuencia_id' => $frecuencia->id,
            'comentario' => 'Comentario de prueba',
            'localizacion_id' => $localizacion->id,
        ])->assertStatus(302)->assertSessionHasNoErrors();

        $comentario = $usuario->comentarios()->where('comentario', 'Comentario de prueba')->first();

        // El propietario puede editar su propio comentario
        $this->actingAs($usuario)->post('/comentario/'.$comentario->id.'/editar', [
            'id' => $comentario->id,
            'frecuencia_id' => $frecuencia->id,
            'localizacion_id' => $localizacion->id,
            'comentario' => 'Comentario de prueba editado',
        ])->assertStatus(302)->assertSessionHasNoErrors();

        // Un administrador también puede editar el comentario
        $this->actingAs($admin)->post('/comentario/'.$comentario->id.'/editar', [
            'id' => $comentario->id,
            'frecuencia_id' => $frecuencia->id,
            'localizacion_id' => $localizacion->id,
            'comentario' => 'Comentario de prueba editado por admin',
        ])->assertStatus(302)->assertSessionHasNoErrors();

        // Un usuario ajeno (ni autor ni admin) NO puede borrar el comentario
        $otro = User::factory()->create();
        $otro->roles()->sync([4]);

        $this->actingAs($otro)
            ->delete(route('comentario_eliminar', ['id' => $comentario->id]))
            ->assertForbidden();

        $this->assertDatabaseHas('comentarios', ['id' => $comentario->id]);

        // El autor sí puede borrar su propio comentario
        $this->actingAs($usuario)
            ->delete(route('comentario_eliminar', ['id' => $comentario->id]))
            ->assertStatus(302)->assertSessionHasNoErrors();

        $this->assertDatabaseMissing('comentarios', ['id' => $comentario->id]);

        // Un administrador puede borrar el comentario de otro usuario
        $comentarioAjeno = Comentario::create([
            'user_id' => $usuario->id,
            'frecuencia_id' => $frecuencia->id,
            'localizacion_id' => $localizacion->id,
            'comentario' => 'Otro comentario de prueba',
        ]);

        $this->actingAs($admin)
            ->delete(route('comentario_eliminar', ['id' => $comentarioAjeno->id]))
            ->assertStatus(302)->assertSessionHasNoErrors();

        $this->assertDatabaseMissing('comentarios', ['id' => $comentarioAjeno->id]);
    }

    /**
     * El borrado emite ComentarioEliminado (no NuevoComentario) y lo hace
     * después de borrar de la base de datos: antes se reutilizaba el evento
     * NuevoComentario y se emitía ANTES del delete, así que un suscriptor
     * que refrescara al recibirlo aún veía el comentario borrado.
     */
    public function test_eliminar_comentario_emite_comentario_eliminado_tras_borrar(): void
    {
        Event::fake([ComentarioEliminado::class, NuevoComentario::class]);

        $comentario = Comentario::create([
            'user_id' => $this->usuario->id,
            'frecuencia_id' => $this->frecuencia->id,
            'localizacion_id' => $this->localizacion->id,
            'comentario' => 'Comentario a borrar',
        ]);

        $this->actingAs($this->usuario)
            ->delete(route('comentario_eliminar', ['id' => $comentario->id]))
            ->assertStatus(302);

        Event::assertDispatched(ComentarioEliminado::class, function ($event) use ($comentario) {
            return ! Comentario::query()->whereKey($comentario->id)->exists()
                && $event->comentario->id === $comentario->id;
        });
        Event::assertNotDispatched(NuevoComentario::class);
    }
}
