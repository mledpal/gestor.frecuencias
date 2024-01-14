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
        TipoContacto::firstOrCreate(['nombre' => 'Servicio', 'color' => 'bg-indigo-700 bg-gradient-to-r from-indigo-500']);
        TipoContacto::firstOrCreate(['nombre' => 'Particular', 'color' => 'bg-blue-800 bg-gradient-to-r from-blue-500']);
        TipoContacto::firstOrCreate(['nombre' => 'Empresa', 'color' => 'bg-yellow-800 bg-gradient-to-r from-yellow-500 ']);
        TipoContacto::firstOrCreate(['nombre' => 'URE', 'color' => 'bg-red-800 bg-gradient-to-r from-red-500']);
        TipoContacto::firstOrCreate(['nombre' => 'Evento']);
        TipoContacto::firstOrCreate(['nombre' => 'Desconocido']);
    }
}
