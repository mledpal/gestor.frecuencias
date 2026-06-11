<?php

namespace App\Policies;

use App\Models\Comentario;
use App\Models\User;

class ComentarioPolicy
{
    /**
     * El propietario o un administrador puede editar el comentario.
     */
    public function update(User $user, Comentario $comentario): bool
    {
        return $comentario->user_id === $user->id || $user->isAdmin;
    }

    /**
     * Sólo un administrador puede eliminar comentarios.
     */
    public function delete(User $user, Comentario $comentario): bool
    {
        return $user->isAdmin;
    }
}
