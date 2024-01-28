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
        TipoContacto::firstOrCreate(['nombre' => 'Desconocido', 'color' => 'bg-gradient-to-b bg-gray-900 from-gray-900 to-gray-600']);
        TipoContacto::firstOrCreate(['nombre' => 'Aviación', 'color' => 'bg-gradient-to-b bg-red-700 from-red-900 to-red-500 ']);
        TipoContacto::firstOrCreate(['nombre' => 'Emisoras', 'color' => 'bg-gradient-to-b bg-orange-700 from-orange-900 to-orange-600 ']);
        TipoContacto::firstOrCreate(['nombre' => 'Empresa', 'color' => 'bg-gradient-to-b bg-pink-700 from-pink-900 to-pink-500 ']);
        TipoContacto::firstOrCreate(['nombre' => 'Evento', 'color' => 'bg-gradient-to-b bg-green-700 from-green-900 to-green-600 ']);
        TipoContacto::firstOrCreate(['nombre' => 'Particular', 'color' => 'bg-gradient-to-b bg-emerald-700 from-emerald-800 to-emerald-500 ']);
        TipoContacto::firstOrCreate(['nombre' => 'Servicio', 'color' => 'bg-gradient-to-b bg-blue-700 from-blue-900 to-blue-500']);
        TipoContacto::firstOrCreate(['nombre' => 'URE', 'color' => 'bg-gradient-to-b bg-sky-700 from-sky-900 to-sky-600']);
    }
}
