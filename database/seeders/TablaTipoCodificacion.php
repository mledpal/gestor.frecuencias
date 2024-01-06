<?php

namespace Database\Seeders;

use App\Models\TipoCodificacion;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class TablaTipoCodificacion extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        foreach ($this->datos() as $key => $value) {
            TipoCodificacion::create($value);
        }
    }
    
    private function datos()
    {
        return [
            ['nombre' => 'Secrafonia'],
            ['nombre' => 'DMR'],
            ['nombre' => 'Tetra'],
            ['nombre' => 'Tetrapol'],
            ['nombre' => 'MPT1327'],
        ];
    }
}
