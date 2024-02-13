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
        $user = User::with('roles')->get();

        foreach ($user as $us) {
            echo $us->username . " " . $us->isAdmin;
        }
    }
}
