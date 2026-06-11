<?php

namespace Tests\Feature;

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

        // Un usuario no administrador NO puede borrar comentarios (403)
        $this->actingAs($usuario)
            ->delete(route('comentario_eliminar', ['id' => $comentario->id]))
            ->assertForbidden();

        $this->assertDatabaseHas('comentarios', ['id' => $comentario->id]);

        // Un administrador sí puede borrar el comentario
        $this->actingAs($admin)
            ->delete(route('comentario_eliminar', ['id' => $comentario->id]))
            ->assertStatus(302)->assertSessionHasNoErrors();

        $this->assertDatabaseMissing('comentarios', ['id' => $comentario->id]);
    }
}
