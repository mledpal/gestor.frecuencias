<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Usuario para la app móvil. La foto se devuelve con URL absoluta y los
 * roles como flags, que es lo que consume el cliente.
 */
class UserResource extends JsonResource
{
    /**
     * Si es true se incluyen los datos privados (email, nombre, localización...).
     */
    public bool $completo = false;

    public function completo(): static
    {
        $this->completo = true;

        return $this;
    }

    public function toArray(Request $request): array
    {
        $datos = [
            'id' => $this->id,
            'username' => $this->username,
            'indicativo' => $this->indicativo,
            'photo' => url($this->photo),
            'is_admin' => $this->whenLoaded('roles', fn () => $this->isAdmin, false),
            'is_root' => $this->whenLoaded('roles', fn () => $this->isRoot, false),
        ];

        if ($this->completo) {
            $datos += [
                'nombre' => $this->nombre,
                'apellidos' => $this->apellidos,
                'email' => $this->email,
                'ip' => $this->ip,
                'ultima_conexion' => $this->ultima_conexion,
                'localizacion' => new LocalizacionResource($this->whenLoaded('localizacion')),
            ];
        }

        return $datos;
    }
}
