<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MensajeResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'remitente_id' => $this->remitente_id,
            'destinatario_id' => $this->destinatario_id,
            'mensaje' => $this->mensaje,
            'created_at' => $this->created_at,
        ];
    }
}
