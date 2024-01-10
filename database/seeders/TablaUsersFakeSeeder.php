<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class TablaUsersFakeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {

        $datos =
        [
            'nombre' => fake()->name(),
            'apellidos' => fake()->text(),
            'email' => fake()->unique()->safeEmail(),
            'username' => fake()->realText(rand(10, 20)).fake()->unique()->randomDigit(),
            'password' => '$2y$10$uSJSghO6LQe8zsl.vq.rquBA7Np0mLJERjvgooNBfvcF4/0aLvLGu',
            'indicativo' => fake()->randomDigit()
        ];

        for($x = 0; $x<=5; $x++) {
            User::create($datos);
        }
    }


}
