<?php

namespace Database\Seeders;

use App\Models\ModoTransmision;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class TablaModoTransmisionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        foreach ($this->datos() as $key => $value) {
            ModoTransmision::create(['nombre' => $value,'descripcion' => '']);
        }
    }

    private function datos()
    {
        return ["AM", "FM", "LSB", "USB", "CW", "FSK", "PSK", "RTTY", "Packet Radio", "D-STAR", "DMR", "P25", "C4FM", "PSK31", "APRS", "SSTV", "JT65", "FT8"];
    }
}
