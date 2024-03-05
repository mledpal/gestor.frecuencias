<?php

namespace Tests\Feature;

use App\Models\TipoCodificacion;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class a04_TiposCodificacionTest extends TestCase
{
    /**
     * Test para Tipos de Codificación
     */
    public function test_codificacion(): void
    {

        $usuario = User::where('email', 'email@gmail.com')->first();
        $admin = User::where('username', 'Admin')->first();

        // Creamos un tipo de codificación vacio y debe fallar
        $response = $this->actingAs($usuario)->post('/tipo_codificacion/nuevo', [
            'nombre' => '',
        ])->assertStatus(302)->assertSessionHasErrors(['nombre']);

        // Creamos un tipo de codificación con datos válidos pero usuario no válido
        $response = $this->actingAs($usuario)->post('/tipo_codificacion/nuevo', [
            'nombre' => 'Tipo de codificación de prueba',
        ])->assertStatus(302)->assertRedirect('/');

        // Creamos un tipo de codificación con datos no válidos y usuario admin
        $response = $this->actingAs($admin)->post('/tipo_codificacion/nuevo', [
            'nombre' => 'Tipo de codificación de prueba con titulo mayor de 30 caracteres',
        ])->assertStatus(302)->assertSessionHasErrors(['nombre']);

        // Creamos un tipo de codificación con datos válidos
        $response = $this->actingAs($admin)->post('/tipo_codificacion/nuevo', [
            'nombre' => 'Test',
        ])->assertStatus(200)->assertSessionHasNoErrors();

        $codificacion = TipoCodificacion::where('nombre', 'Test')->first();

        // Eliminamos el tipo de codificación con usuario no autorizado
        $response = $this->actingAs($usuario)->delete(route('eliminar_tipo_codificacion', [
            'id' => $codificacion->id,
        ]))->assertStatus(302)->assertRedirect('/');

        // Eliminamos el tipo de codificación con usuario autorizado
        $response = $this->actingAs($admin)->delete(route('eliminar_tipo_codificacion', [
            'id' => $codificacion->id,
        ]))->assertStatus(302)->assertRedirect('/');

    }
}
