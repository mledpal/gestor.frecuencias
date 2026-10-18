<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class LocalizacionResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'localidad' => $this->localidad,
            'provincia' => $this->provincia,
            'pais' => $this->pais,
            'gps' => $this->gps,
        ];
    }
}
