<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;

/**
 * Interlocutor de una conversación con los datos de su último mensaje
 * (ver MensajeService::conversaciones).
 */
class ConversacionResource extends UserResource
{
    public function toArray(Request $request): array
    {
        return parent::toArray($request) + [
            'last_message' => $this->last_message,
            'last_message_time' => $this->last_message_time,
            'last_message_at' => $this->last_message_at,
        ];
    }
}
