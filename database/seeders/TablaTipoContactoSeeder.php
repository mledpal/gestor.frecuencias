<?php

namespace Database\Seeders;

use App\Models\TipoContacto;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class TablaTipoContactoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        TipoContacto::create(['nombre' => 'Servicio']);
        TipoContacto::create(['nombre' => 'Particular']);
        TipoContacto::create(['nombre' => 'Evento']);
        TipoContacto::create(['nombre' => 'Desconocido']);
    }
}
