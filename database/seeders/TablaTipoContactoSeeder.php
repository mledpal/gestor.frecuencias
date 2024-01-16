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
        TipoContacto::firstOrCreate(['nombre' => 'Desconocido', 'color' => 'bg-gray-900']);
        TipoContacto::firstOrCreate(['nombre' => 'Aviación', 'color' => 'bg-red-500']);
        TipoContacto::firstOrCreate(['nombre' => 'Emisoras', 'color' => 'bg-lime-500']);
        TipoContacto::firstOrCreate(['nombre' => 'Empresa', 'color' => 'bg-gray-500']);
        TipoContacto::firstOrCreate(['nombre' => 'Evento', 'color' => 'bg-green-500']);
        TipoContacto::firstOrCreate(['nombre' => 'Particular', 'color' => 'bg-lime-500']);
        TipoContacto::firstOrCreate(['nombre' => 'Servicio', 'color' => 'bg-blue-500']);
        TipoContacto::firstOrCreate(['nombre' => 'URE', 'color' => 'bg-yellow-500']);
    }
}
