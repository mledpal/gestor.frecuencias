<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class NuevoComentario implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $comentario;

    public function __construct($comentario)
    {
        $this->comentario = $comentario;
    }

    public function broadcastOn()
    {
        return ['canal-' . $this->comentario['frecuencia_id'] . '-' . $this->comentario['localizacion_id'] . '-comentarios'];
    }

    public function broadcastAs()
    {
        return 'NuevoComentario';
    }
}
