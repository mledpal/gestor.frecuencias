<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Contacto con sus catálogos aplanados a {id, nombre}. Los flags se
 * devuelven como booleanos reales (en BD son tinyint).
 */
class ContactoResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'user_id' => $this->user_id,
            'nombre' => $this->nombre,
            'fecha' => $this->fecha,
            'hora' => $this->hora,
            'observaciones' => $this->observaciones,
            'calidad' => (int) $this->calidad,
            'comprobado' => (bool) $this->comprobado,
            'privado' => (bool) $this->privado,
            'favorito' => (bool) $this->favorito,
            'frecuencia_id' => $this->frecuencia_id,
            'frecuencia' => $this->frecuencia?->frecuencia,
            'localizacion' => new LocalizacionResource($this->whenLoaded('localizacion')),
            'tipo' => $this->tipo ? ['id' => $this->tipo->id, 'nombre' => $this->tipo->nombre, 'color' => $this->tipo->color] : null,
            'banda' => $this->catalogo($this->banda, 'banda'),
            'modo' => $this->catalogo($this->modo, 'nombre'),
            'codificacion' => $this->catalogo($this->codificacion, 'nombre'),
            'ctcss' => $this->catalogo($this->ctcss, 'codigo'),
            'dcs' => $this->catalogo($this->dcs, 'codigo'),
            'repetidor' => $this->repetidor ? ['id' => $this->repetidor->id, 'offset' => $this->repetidor->offset, 'direccion' => $this->repetidor->direccion] : null,
            'usuario' => new UserResource($this->whenLoaded('usuario')),
        ];
    }

    private function catalogo($modelo, string $campo): ?array
    {
        return $modelo ? ['id' => $modelo->id, 'nombre' => (string) $modelo->{$campo}] : null;
    }
}
