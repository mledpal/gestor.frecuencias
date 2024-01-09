<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call(TablaRoles::class);
        $this->call(TablaBandas::class);
        $this->call(TablaCTCSS::class);
        $this->call(TablaDCS::class);
        $this->call(TablaTipoCodificacion::class);
        $this->call(TablaUsuarioSeeder::class);
        $this->call(TablaModoTransmisionSeeder::class);
        // \App\Models\User::factory(10)->create();

        // \App\Models\User::factory()->create([
        //     'name' => 'Test User',
        //     'email' => 'test@example.com',
        // ]);
    }
}
