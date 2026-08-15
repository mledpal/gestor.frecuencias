<?php

namespace App\Events;

use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class NuevoMensaje implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $mensaje;

    public function __construct($mensaje)
    {
        $this->mensaje = $mensaje;
    }

    /**
     * Canal privado: solo los dos interlocutores de la conversación pueden
     * suscribirse (ver autorización en routes/channels.php).
     */
    public function broadcastOn()
    {
        $ids = [$this->mensaje['destinatario_id'], $this->mensaje['remitente_id']];
        sort($ids);

        return [new PrivateChannel('canal-'.$ids[0].'-'.$ids[1].'-mensajes')];
    }

    public function broadcastAs()
    {
        return 'NuevoMensaje';
    }

    /**
     * Recorta el payload a los campos que consume el frontend, en vez de
     * emitir el modelo Mensaje completo.
     */
    public function broadcastWith()
    {
        return [
            'mensaje' => [
                'id' => $this->mensaje['id'],
                'remitente_id' => $this->mensaje['remitente_id'],
                'destinatario_id' => $this->mensaje['destinatario_id'],
                'mensaje' => $this->mensaje['mensaje'],
                'created_at' => $this->mensaje['created_at'],
            ],
        ];
    }
}
