<?php

namespace Tests\Feature;

use App\Models\Frecuencia;
use App\Models\Localizacion;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class a03_ComentarioTest extends TestCase
{
    /**
     * A basic feature test example.
     */
    public function test_comentarios(): void
    {
        // Cargamos los datos para pruebas
        $usuario = User::where('email', 'email@gmail.com')->first();
        $admin = User::where('username', 'Admin')->first();
        $frecuencia = Frecuencia::first();
        $localizacion = Localizacion::first();


        // Creamos un comentario vacio y debe fallar
        $response = $this->actingAs($usuario)->post('/comentario/crear', [
            'frecuencia_id' => $frecuencia->id,
            'comentario' => '',
            'localizacion_id' => $localizacion->id,
        ])->assertStatus(302)->assertSessionHasErrors(['comentario']);

        // Creamos un comentario con datos válidos
        $response = $this->actingAs($usuario)->post('/comentario/crear', [
            'frecuencia_id' => $frecuencia->id,
            'comentario' => 'Comentario de prueba',
            'localizacion_id' => $localizacion->id,
        ])->assertStatus(302)->assertSessionHasNoErrors();

        $comentario = $usuario->comentarios()->where('comentario', 'Comentario de prueba')->first();

        // Editamos el comentario con datos válidos pero con usuario no autorizado
        $response = $this->actingAs($usuario)->post('/comentario/{id}/editar', [
            'id' => $comentario->id,
            'frecuencia_id' => $frecuencia->id,
            'localizacion_id' => $localizacion->id,
            'comentario' => 'Comentario de prueba editado',
        ])->assertStatus(302)->assertRedirect('/');

        // Editamos el comentario con datos válidos y usuario autorizado
        $response = $this->actingAs($admin)->post('/comentario/{id}/editar', [
            'id' => $comentario->id,
            'frecuencia_id' => $frecuencia->id,
            'localizacion_id' => $localizacion->id,
            'comentario' => 'Comentario de prueba editado',
        ])->assertStatus(302)->assertSessionHasNoErrors();

        // Borramos el comentario con usuario no autorizado
        $response = $this->actingAs($usuario)->delete(route('comentario_eliminar', ['id' => $comentario->id]))->assertStatus(302)->assertRedirect('/login');

        // Borramos el comentario con usuario autorizado
        $response = $this->actingAs($admin)->delete(route('comentario_eliminar', ['id' => $comentario->id]))->assertStatus(302)->assertSessionHasNoErrors();

    }
}
