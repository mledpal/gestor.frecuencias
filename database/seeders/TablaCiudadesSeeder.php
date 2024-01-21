<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TablaCiudadesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        //Eloquent::unguard();
        $path = 'database/sql/select.sql';
        DB::unprepared(file_get_contents($path));
    }
}
