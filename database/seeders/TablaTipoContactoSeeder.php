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
        TipoContacto::create(['nombre' => 'Desconocido', 'color' => 'gray-900']);
        TipoContacto::create(['nombre' => 'Aviación', 'color' => 'red-600']);
        TipoContacto::create(['nombre' => 'Emisoras', 'color' => 'yellow-600']);
        TipoContacto::create(['nombre' => 'Empresa', 'color' => 'pink-600']);
        TipoContacto::create(['nombre' => 'Evento', 'color' => 'green-600']);
        TipoContacto::create(['nombre' => 'Particular', 'color' => 'emerald-800']);
        TipoContacto::create(['nombre' => 'Servicio', 'color' => 'blue-800']);
        TipoContacto::create(['nombre' => 'URE', 'color' => 'sky-600']);
    }
}
