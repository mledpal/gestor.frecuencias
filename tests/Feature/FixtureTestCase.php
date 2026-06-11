<?php

namespace Tests\Feature;

use App\Models\Frecuencia;
use App\Models\Localizacion;
use App\Models\User;
use Database\Seeders\TablaRoles;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

/**
 * Base para los tests de funcionalidad que necesitan un usuario normal, un
 * administrador y datos de catálogo. Cada test arranca con una base de datos
 * limpia (RefreshDatabase) y crea sus propios datos, de modo que el resultado
 * no depende del orden de ejecución ni de datos sembrados manualmente.
 */
abstract class FixtureTestCase extends TestCase
{
    use RefreshDatabase;

    // Siembra los roles una sola vez tras el migrate:fresh para que los ids
    // (1 = root, 2 = admin, 4 = user) sean estables.
    protected bool $seed = true;

    protected string $seeder = TablaRoles::class;

    protected User $usuario;

    protected User $admin;

    protected Frecuencia $frecuencia;

    protected Localizacion $localizacion;

    protected function setUp(): void
    {
        parent::setUp();

        $this->localizacion = Localizacion::create([
            'localidad' => 'Linares',
            'provincia' => 'Jaén',
            'pais' => 'España',
            'gps' => '38.0902883, -3.6244309',
        ]);

        $this->frecuencia = Frecuencia::create(['frecuencia' => '150.500']);

        $this->usuario = User::factory()->create(['email' => 'email@gmail.com']);
        $this->usuario->roles()->sync([4]);

        $this->admin = User::factory()->create(['username' => 'Admin']);
        $this->admin->roles()->sync([1, 2, 4]);
    }
}
