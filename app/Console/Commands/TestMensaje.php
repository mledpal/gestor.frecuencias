<?php

namespace App\Console\Commands;

use Ably\AblyRest;
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

        $apiKey = '-n3DVQ.QW58iA:NlZmlh8WGzadRH-9wz3yTlUFOl_955uZga9OOMEPTGE';
        $ably = new AblyRest($apiKey);
        $channelName = 'chatroom';
        $channel = $ably->channels->get($channelName);
        $messageData = array(
            'mensaje' => 'Este es un mensaje de prueba desde PHP',
            'usuario' => 'usuario_prueba'
        );
        $channel->publish('mensaje', $messageData);
    }
}
