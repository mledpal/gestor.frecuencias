<?php

namespace App\Services;

use App\Events\NuevoMensaje;
use App\Models\Mensaje;
use App\Models\User;
use Exception;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Collection;

/**
 * Lógica de la mensajería privada compartida por el controlador web y la API.
 */
class MensajeService
{
    /**
     * Mensajes entre dos usuarios, en cualquier dirección.
     */
    private function entre(int $userId, int $otroId): Builder
    {
        return Mensaje::where(function ($query) use ($userId, $otroId) {
            $query->where('remitente_id', $userId)
                ->where('destinatario_id', $otroId);
        })
            ->orWhere(function ($query) use ($userId, $otroId) {
                $query->where('remitente_id', $otroId)
                    ->where('destinatario_id', $userId);
            });
    }

    /**
     * Últimos 100 mensajes de una conversación, del más reciente al más antiguo.
     */
    public function conversacion(int $userId, int $otroId): Collection
    {
        return $this->entre($userId, $otroId)
            ->with(['remitente:id,username,photo,indicativo', 'destinatario:id,username,photo,indicativo'])
            ->orderBy('created_at', 'desc')
            ->orderBy('id', 'desc')
            ->limit(100)
            ->get();
    }

    /**
     * Guarda un mensaje y lo emite por el canal de la conversación.
     */
    public function enviar(int $remitenteId, int $destinatarioId, string $texto): Mensaje
    {
        $mensaje = Mensaje::create([
            'remitente_id' => $remitenteId,
            'destinatario_id' => $destinatarioId,
            'mensaje' => $texto,
        ]);

        try {
            broadcast(new NuevoMensaje($mensaje));
        } catch (Exception $e) {
            report($e);
        }

        return $mensaje;
    }

    /**
     * Borra la conversación completa entre dos usuarios.
     */
    public function borrar(int $userId, int $otroId): void
    {
        $this->entre($userId, $otroId)->delete();
    }

    /**
     * Interlocutores del usuario con los datos del último mensaje de cada
     * conversación (`last_message`, `last_message_time` y `last_message_at`).
     */
    public function conversaciones(int $userId): Collection
    {
        // Un único mensaje (el más reciente) por cada par de
        // interlocutores, calculado en BD en vez de traer todos los
        // mensajes del usuario a PHP y recorrerlos por cada conversación.
        $ultimosIds = Mensaje::selectRaw('MAX(id) as id')
            ->where('remitente_id', $userId)
            ->orWhere('destinatario_id', $userId)
            ->groupByRaw('LEAST(remitente_id, destinatario_id), GREATEST(remitente_id, destinatario_id)')
            ->pluck('id');

        $ultimosMensajes = Mensaje::whereIn('id', $ultimosIds)
            ->get(['remitente_id', 'destinatario_id', 'mensaje', 'created_at']);

        $mensajePorInterlocutor = $ultimosMensajes->keyBy(function ($mensaje) use ($userId) {
            return $mensaje->remitente_id == $userId ? $mensaje->destinatario_id : $mensaje->remitente_id;
        });

        return User::with('roles')
            ->whereIn('id', $mensajePorInterlocutor->keys())
            ->get(['id', 'photo', 'username', 'indicativo'])
            ->map(function ($user) use ($mensajePorInterlocutor) {
                $lastMessage = $mensajePorInterlocutor->get($user->id);

                if ($lastMessage) {
                    $created_at = $lastMessage->created_at;

                    if ($created_at->isToday()) {
                        $lastMessageTime = $created_at->format('H:i:s');
                    } elseif ($created_at->isYesterday()) {
                        $lastMessageTime = 'Ayer';
                    } else {
                        $lastMessageTime = $created_at->format('d/m/y');
                    }

                    $user->last_message = $lastMessage->mensaje;
                    $user->last_message_time = $lastMessageTime;
                    $user->last_message_at = $created_at;
                } else {
                    $user->last_message = null;
                    $user->last_message_time = null;
                    $user->last_message_at = null;
                }

                return $user;
            })
            ->sortByDesc('last_message_at')
            ->values();
    }
}
