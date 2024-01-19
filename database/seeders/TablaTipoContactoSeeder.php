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
        TipoContacto::firstOrCreate(['nombre' => 'Desconocido', 'color' => 'bg-gradient-to-b bg-gray-900 from-gray-600']);
        TipoContacto::firstOrCreate(['nombre' => 'Aviación', 'color' => 'bg-gradient-to-b bg-red-500 from-red-900']);
        TipoContacto::firstOrCreate(['nombre' => 'Emisoras', 'color' => 'bg-gradient-to-b bg-orange-500 from-gray-900']);
        TipoContacto::firstOrCreate(['nombre' => 'Empresa', 'color' => 'bg-gradient-to-b bg-pink-500 from-pink-900']);
        TipoContacto::firstOrCreate(['nombre' => 'Evento', 'color' => 'bg-green-500']);
        TipoContacto::firstOrCreate(['nombre' => 'Particular', 'color' => 'bg-gradient-to-b bg-lime-500 from-lime-900']);
        TipoContacto::firstOrCreate(['nombre' => 'Servicio', 'color' => 'bg-gradient-to-b bg-blue-500 from-blue-900']);
        TipoContacto::firstOrCreate(['nombre' => 'URE', 'color' => 'bg-gradient-to-b bg-yellow-500 from-yellow-800
        ']);
    }
}
