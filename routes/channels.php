<?php

use Illuminate\Support\Facades\Broadcast;

/*
|--------------------------------------------------------------------------
| Broadcast Channels
|--------------------------------------------------------------------------
|
| Here you may register all of the event broadcasting channels that your
| application supports. The given channel authorization callbacks are
| used to check if an authenticated user can listen to the channel.
|
*/

Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});

// Conversación privada entre dos usuarios: solo los dos interlocutores
// pueden suscribirse al canal de sus mensajes.
Broadcast::channel('canal-{idA}-{idB}-mensajes', function ($user, $idA, $idB) {
    return in_array((int) $user->id, [(int) $idA, (int) $idB], true);
});

// Comentarios de una frecuencia/localización: visibles para cualquier
// usuario autenticado, igual que ComentarioController::getComentarios.
Broadcast::channel('canal-{frecuenciaId}-{localizacionId}-comentarios', function ($user) {
    return $user !== null;
});
