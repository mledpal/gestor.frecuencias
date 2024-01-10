<?php

namespace Database\Seeders;

use App\Models\Localizacion;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class TablaUsuarioSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $localizacion = [
            'localidad' => 'Linares',
            'provincia' => 'Jaén',
            'pais' => 'ES',
            'gps' => '38.0902883, -3.6244309',
        ];

        $localizacion = Localizacion::create($localizacion);

        $usuario = [
            'username' => 'migueldj',
            'password' => '$2y$10$uSJSghO6LQe8zsl.vq.rquBA7Np0mLJERjvgooNBfvcF4/0aLvLGu',
            'nombre' => 'Miguel',
            'apellidos' => 'Ledesma Palacios',
            'email' => 'migledpal@gmail.com',
            'photo' => '',
            'qsl' => '',
            'indicativo' => 'ECB23NVN',
            'localizacion_id' => $localizacion->id,
        ];

        $usuario = User::create($usuario);

        $usuario->roles()->sync([1,2,4]);

    }
}
