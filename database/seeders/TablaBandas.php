<?php

namespace Database\Seeders;

use App\Models\Banda;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class TablaBandas extends Seeder
{
    //{["160m", "80m", "40m", "20m", "15m", "10m", "2m", "70cm", "23cm", "13cm", "3cm", "6cm", "9cm", "24cm", "47cm"])->default('2m');
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        foreach ($this->datos() as $key => $value) {
            Banda::create($value);
        }
    }

    private function datos()
    {
        return [
            ['banda' => '160m'],
            ['banda' => '80m'],
            ['banda' => '40m'],
            ['banda' => '20m'],
            ['banda' => '15m'],
            ['banda' => '10m'],
            ['banda' => '2m'],
            ['banda' => '70cm'],
            ['banda' => '47m'],
            ['banda' => '24cm'],
            ['banda' => '23cm'],
            ['banda' => '13cm'],
            ['banda' => '9cm'],
            ['banda' => '6cm'],
            ['banda' => '3cm'],
        ];
    }
}
