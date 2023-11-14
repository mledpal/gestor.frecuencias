<?php

namespace Database\Seeders;

use App\Models\Rol;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class TablaRoles extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        foreach ($this->datos() as $key => $value) {
            Rol::create($value);
        }
    }

    private function datos()
    {
        return [
            ['nombre' => 'root'],
            ['nombre' => 'admin'],
            ['nombre' => 'eco-alfa'],
            ['nombre' => 'user'],
            ['nombre' => 'guest'],
        ];
    }
}
