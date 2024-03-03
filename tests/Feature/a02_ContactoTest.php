<?php

namespace Tests\Feature;

use App\Models\Contacto;
use App\Models\TipoContacto;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class a02_ContactoTest extends TestCase
{
    /**
     * Test de Contactos
     */
    public function test_contactos(): void
    {
        // Cargamos al usuario de pruebas
        $usuario = User::where('email', 'email@gmail.com')->first();

        // Intentamos crear un contacto sin estar logueados
        $response = $this->post('/contacto/crear', [
            'frecuencia' => "150.5",
            'tipo_contacto' => 1,
            'tipo_codificacion' => 1,
            'nombre' => 'Contacto de Prueba',
            'comprobado' => 0,
            'favorito'=> 0,
            'fecha'=> now(),
            'observaciones'=> 'Contacto de Prueba',
            'user_id' => $usuario->id,
        ])->assertStatus(302);

        // Creamos un tipo de Contacto
        $tipoContacto = TipoContacto::where(['nombre' => 'Test'])->first();

        if($tipoContacto == null) {
            $tipoContacto = TipoContacto::create(['nombre' => 'Test', 'color' => 'Test']);
        }

        // Creamos un Contacto nuevo y válido
        $response = $this->actingAs($usuario)->post('/contacto/crear', [
            'nombre' => 'Contacto de Prueba',
            'comprobado' => 0,
            'privado' => 1,
            'fecha'=> date("Y-m-d"),
            'hora' => date("H:i"),
            'tipo_id' => $tipoContacto->id,
            'frecuencia' => "150.5",
            'tipo_contacto' => 1,
            'tipo_codificacion' => 1,
            'calidad' => 0,
            'favorito'=> 0,
            'localizacion_id' => -1,
            'codificacion_id' => -1,
            'modo_id' => -1,
            'banda_id' => -1,
            'dcs_id' => -1,
            'ctcss_id' => -1,
            'observaciones'=> 'Contacto de Prueba',
            'localidad' => 'Test',
            'provincia' => 'Test',
            'user_id' => $usuario->id,
        ])->assertStatus(302)->assertSessionHasNoErrors();


        // Intentamos crear un contacto con un nombre vacío
        $response = $this->actingAs($usuario)->post('/contacto/crear', [
            'nombre' => '',
            'comprobado' => 0,
            'privado' => 1,
            'fecha'=> date("Y-m-d"),
            'hora' => date("H:i"),
            'tipo_id' => $tipoContacto->id,
            'frecuencia' => "150.5",
            'tipo_contacto' => 1,
            'tipo_codificacion' => 1,
            'calidad' => 0,
            'favorito'=> 0,
            'localizacion_id' => -1,
            'codificacion_id' => -1,
            'modo_id' => -1,
            'banda_id' => -1,
            'dcs_id' => -1,
            'ctcss_id' => -1,
            'observaciones'=> 'Contacto de Prueba',
            'localidad' => 'Test',
            'provincia' => 'Test',
            'user_id' => $usuario->id,
        ])->assertStatus(302)->assertSessionHasErrors(['nombre']);

        // Intentamos crear un contacto con una frecuencia vacía
        $response = $this->actingAs($usuario)->post('/contacto/crear', [
            'nombre' => 'Contacto de Prueba',
            'comprobado' => 0,
            'privado' => 1,
            'fecha'=> date("Y-m-d"),
            'hora' => date("H:i"),
            'tipo_id' => $tipoContacto->id,
            'frecuencia' => "",
            'tipo_contacto' => 1,
            'tipo_codificacion' => 1,
            'calidad' => 0,
            'favorito'=> 0,
            'localizacion_id' => -1,
            'codificacion_id' => -1,
            'modo_id' => -1,
            'banda_id' => -1,
            'dcs_id' => -1,
            'ctcss_id' => -1,
            'observaciones'=> 'Contacto de Prueba',
            'localidad' => 'Test',
            'provincia' => 'Test',
            'user_id' => $usuario->id,
        ])->assertStatus(302)->assertSessionHasErrors(['frecuencia']);




        // Añadimos un segundo contacto para pruebas
        $segundoContacto = $this->actingAs($usuario)->post('/contacto/crear', [
            'nombre' => 'Contacto de Prueba 2',
            'comprobado' => 0,
            'privado' => 1,
            'fecha'=> date("Y-m-d"),
            'hora' => date("H:i"),
            'tipo_id' => $tipoContacto->id,
            'frecuencia' => "150.25",
            'tipo_contacto' => 1,
            'tipo_codificacion' => 1,
            'calidad' => 0,
            'favorito'=> 0,
            'localizacion_id' => -1,
            'codificacion_id' => -1,
            'modo_id' => -1,
            'banda_id' => -1,
            'dcs_id' => -1,
            'ctcss_id' => -1,
            'observaciones'=> 'Contacto de Prueba 2',
            'localidad' => 'Test',
            'provincia' => 'Test',
            'user_id' => $usuario->id,
        ])->assertStatus(302)->assertSessionHasNoErrors();

        $segundoContacto = Contacto::where('nombre', 'Contacto de Prueba 2')->first();

        // Intentamos editar el nombre del segundo contacto al nombre del primer contacto.

        $response = $this->actingAs($usuario)->post('/ajax/contacto/{id}', [
            'id' => $segundoContacto->id,
            'nombre' => 'Contacto de Prueba',
            'comprobado' => 0,
            'privado' => 1,
            'fecha'=> date("Y-m-d"),
            'hora' => date("H:i"),
            'tipo_id' => $tipoContacto->id,
            'frecuencia_id' => 2,
            'frecuencia' => "150.25",
            'tipo_contacto' => 1,
            'tipo_codificacion' => 1,
            'calidad' => 0,
            'favorito'=> 0,
            'localizacion_id' => -1,
            'codificacion_id' => -1,
            'modo_id' => -1,
            'banda_id' => -1,
            'dcs_id' => -1,
            'ctcss_id' => -1,
            'observaciones'=> 'Contacto de Prueba',
            'localidad' => 'Test',
            'provincia' => 'Test',
            'user_id' => $usuario->id,
        ])->assertStatus(302)->assertSessionHasNoErrors();



        // Intentamos eliminar un contacto inexistente
        $response = $this->actingAs($usuario)->post('/contacto/{id}/eliminar/', ['id' => 100])->assertNotFound('/');

        // Eliminamos el contacto creado
        $response = $this->actingAs($usuario)->post('/contacto/{id}/eliminar/', ['id' => 1])->assertSessionHasNoErrors('/');

        // Probamos a buscar una frecuencia existente
        $response = $this->actingAs($usuario)->post(route('contacto_busqueda'), ['frecuencia' => "150.5"])->assertStatus(200);

        // Probamos a buscar una frecuencia inexistente
        $response = $this->actingAs($usuario)->post(route('contacto_busqueda'), ['frecuencia' => "1500.55"])->assertStatus(200);

        // Probamos a buscar un nombre
        $response = $this->actingAs($usuario)->post(route('contacto_busqueda'), ['nombre' => "Contacto de Prueba"])->assertStatus(200);

        // Probamos una búsqueda vacía
        $response = $this->actingAs($usuario)->post(route('contacto_busqueda'), [])->assertStatus(200);

    }
}
