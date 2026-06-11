<?php

namespace App\Policies;

use App\Models\Contacto;
use App\Models\User;

class ContactoPolicy
{
    /**
     * El usuario puede ver el contacto si es suyo o si es público (no privado).
     */
    public function view(User $user, Contacto $contacto): bool
    {
        return $contacto->user_id === $user->id || ! $contacto->privado;
    }

    /**
     * Sólo el propietario puede actualizar el contacto.
     */
    public function update(User $user, Contacto $contacto): bool
    {
        return $contacto->user_id === $user->id;
    }

    /**
     * El propietario o un administrador puede eliminar el contacto.
     */
    public function delete(User $user, Contacto $contacto): bool
    {
        return $contacto->user_id === $user->id || $user->isAdmin;
    }
}
