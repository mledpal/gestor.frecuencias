<?php

namespace Tests\Feature\Api;

use App\Models\Contacto;
use App\Models\Frecuencia;
use App\Models\Localizacion;
use App\Models\TipoContacto;
use App\Models\User;
use Laravel\Sanctum\Sanctum;
use Tests\Feature\FixtureTestCase;

class ApiContactoTest extends FixtureTestCase
{
    private TipoContacto $tipo;

    protected function setUp(): void
    {
        parent::setUp();

        $this->tipo = TipoContacto::create(['nombre' => 'Test', 'color' => 'red-500']);
    }

    /**
     * @return array<string, mixed>
     */
    private function datosContacto(array $cambios = []): array
    {
        return array_merge([
            'nombre' => 'Torre de control',
            'frecuencia' => '118.100',
            'fecha' => '2026-10-01',
            'hora' => '10:30',
            'tipo_id' => $this->tipo->id,
            'modo_id' => -1,
            'banda_id' => -1,
            'codificacion_id' => -1,
            'ctcss_id' => -1,
            'dcs_id' => -1,
            'calidad' => 4,
            'comprobado' => 1,
            'privado' => 0,
            'favorito' => 1,
            'localidad' => 'Linares',
            'provincia' => 'Jaén',
            'pais' => 'España',
            'gps' => '38.0902883, -3.6244309',
            'offset' => '0.600',
            'direccion' => '-',
        ], $cambios);
    }

    public function test_crear_contacto_reutiliza_catalogos_y_devuelve_recurso(): void
    {
        Sanctum::actingAs($this->usuario);

        $respuesta = $this->postJson('/api/v1/contactos', $this->datosContacto())
            ->assertCreated()
            ->assertJsonPath('nombre', 'Torre de control')
            ->assertJsonPath('frecuencia', '118.100')
            ->assertJsonPath('favorito', true)
            ->assertJsonPath('privado', false)
            ->assertJsonPath('modo', null)
            ->assertJsonPath('repetidor.direccion', '-')
            ->assertJsonPath('tipo.color', 'red-500');

        // La localización de FixtureTestCase coincide: no se duplica.
        $this->assertSame($this->localizacion->id, $respuesta->json('localizacion.id'));
        $this->assertSame(1, Localizacion::count());
    }

    public function test_crear_contacto_duplicado_devuelve_409(): void
    {
        Sanctum::actingAs($this->usuario);

        $this->postJson('/api/v1/contactos', $this->datosContacto())->assertCreated();
        $this->postJson('/api/v1/contactos', $this->datosContacto())->assertStatus(409);
    }

    public function test_crear_contacto_sin_nombre_devuelve_422(): void
    {
        Sanctum::actingAs($this->usuario);

        $this->postJson('/api/v1/contactos', $this->datosContacto(['nombre' => '']))
            ->assertStatus(422)
            ->assertJsonValidationErrors('nombre');
    }

    public function test_actualizar_contacto_cambia_la_frecuencia_por_texto(): void
    {
        Sanctum::actingAs($this->usuario);

        $id = $this->postJson('/api/v1/contactos', $this->datosContacto())->json('id');

        $this->putJson("/api/v1/contactos/{$id}", $this->datosContacto([
            'nombre' => 'Aproximación',
            'frecuencia' => '120.200',
            'offset' => null,
        ]))->assertOk()
            ->assertJsonPath('nombre', 'Aproximación')
            ->assertJsonPath('frecuencia', '120.200')
            ->assertJsonPath('repetidor', null);

        // 118.100 y 120.200 no son representables en float: no deben duplicarse.
        $this->postJson('/api/v1/contactos', $this->datosContacto(['frecuencia' => '120.2', 'localidad' => 'Otra']))->assertCreated();
        $this->assertSame(3, Frecuencia::count());
    }

    public function test_un_tercero_no_puede_editar_ni_ver_un_contacto_privado(): void
    {
        $contacto = $this->crearContactoDe($this->admin, ['privado' => 1]);

        Sanctum::actingAs($this->usuario);

        $this->getJson("/api/v1/contactos/{$contacto->id}")->assertForbidden();
        $this->putJson("/api/v1/contactos/{$contacto->id}", $this->datosContacto())->assertForbidden();
        $this->deleteJson("/api/v1/contactos/{$contacto->id}")->assertForbidden();
    }

    public function test_el_propietario_borra_su_contacto(): void
    {
        $contacto = $this->crearContactoDe($this->usuario);

        Sanctum::actingAs($this->usuario);

        $this->deleteJson("/api/v1/contactos/{$contacto->id}")->assertNoContent();
        $this->assertNull(Contacto::find($contacto->id));
    }

    public function test_index_solo_devuelve_contactos_propios(): void
    {
        $this->crearContactoDe($this->usuario);
        $this->crearContactoDe($this->admin);

        Sanctum::actingAs($this->usuario);

        $this->getJson('/api/v1/contactos')->assertOk()->assertJsonCount(1);
    }

    public function test_busqueda_publica_excluye_privados_y_propios(): void
    {
        $otro = User::factory()->create();
        $this->crearContactoDe($otro, ['nombre' => 'Público']);
        $this->crearContactoDe($otro, ['nombre' => 'Oculto', 'privado' => 1]);
        $this->crearContactoDe($this->usuario, ['nombre' => 'Mío']);

        Sanctum::actingAs($this->usuario);

        $this->postJson('/api/v1/contactos/buscar', ['propio' => false])
            ->assertOk()
            ->assertJsonCount(1)
            ->assertJsonPath('0.nombre', 'Público')
            ->assertJsonPath('0.usuario.id', $otro->id);

        $this->postJson('/api/v1/contactos/buscar', ['propio' => true, 'nombre' => 'Mí'])
            ->assertOk()
            ->assertJsonCount(1)
            ->assertJsonPath('0.nombre', 'Mío');
    }

    private function crearContactoDe(User $usuario, array $cambios = []): Contacto
    {
        return Contacto::create(array_merge([
            'nombre' => 'Contacto',
            'fecha' => '2026-10-01',
            'tipo_id' => $this->tipo->id,
            'frecuencia_id' => $this->frecuencia->id,
            'localizacion_id' => $this->localizacion->id,
            'user_id' => $usuario->id,
            'privado' => 0,
            'comprobado' => 0,
            'favorito' => 0,
        ], $cambios));
    }
}
