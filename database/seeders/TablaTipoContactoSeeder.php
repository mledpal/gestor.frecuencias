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
        TipoContacto::firstOrCreate(['nombre' => 'Desconocido', 'color' => 'gray-900']);
        TipoContacto::firstOrCreate(['nombre' => 'Aviación', 'color' => 'red-600']);
        TipoContacto::firstOrCreate(['nombre' => 'Emisoras', 'color' => 'yellow-600']);
        TipoContacto::firstOrCreate(['nombre' => 'Empresa', 'color' => 'pink-600']);
        TipoContacto::firstOrCreate(['nombre' => 'Evento', 'color' => 'green-600']);
        TipoContacto::firstOrCreate(['nombre' => 'Particular', 'color' => 'emerald-800']);
        TipoContacto::firstOrCreate(['nombre' => 'Servicio', 'color' => 'blue-800']);
        TipoContacto::firstOrCreate(['nombre' => 'URE', 'color' => 'sky-600']);
    }
}
