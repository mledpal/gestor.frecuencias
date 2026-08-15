<?php

namespace App\Events;

use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

/**
 * Se emite tras borrar un comentario (a diferencia de NuevoComentario, que
 * antes se reutilizaba también para los borrados y se emitía ANTES del
 * delete: los suscriptores refrescaban y veían el comentario todavía
 * presente durante una ventana breve).
 */
class ComentarioEliminado implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $comentario;

    public function __construct($comentario)
    {
        $this->comentario = $comentario;
    }

    public function broadcastOn()
    {
        return [new PrivateChannel('canal-'.$this->comentario['frecuencia_id'].'-'.$this->comentario['localizacion_id'].'-comentarios')];
    }

    public function broadcastAs()
    {
        return 'ComentarioEliminado';
    }
}
