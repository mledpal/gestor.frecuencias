<?php

namespace App\Console\Commands;

use Ably\AblyRest;
use App\Models\Contacto;
use App\Models\User;
use Illuminate\Console\Command;

class TestMensaje extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:test-mensaje';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $user = User::find(1);

        $busqueda = Contacto::with('localizacion', 'tipo', 'frecuencia', 'codificacion', 'ctcss', 'dcs', 'banda', 'modo', 'repetidor')->where('privado', false)->where('user_id', '!=', $user->id)->orderBy('nombre', 'asc')->get()->toArray();

        echo count($busqueda);
    }
}
