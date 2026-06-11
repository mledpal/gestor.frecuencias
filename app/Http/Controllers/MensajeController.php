<?php

namespace App\Http\Controllers;

use App\Events\NuevoMensaje;
use App\Http\Requests\ValidarMensaje;
use App\Models\Mensaje;
use App\Models\User;
use Exception;
use Illuminate\Support\Facades\Auth;

class MensajeController extends Controller
{
    public function recuperarConversacion($destinoId)
    {
        if (Auth::check()) {

            $userId = Auth::id();

            $conversacion = Mensaje::with(['remitente:id,username,photo,indicativo', 'destinatario:id,username,photo,indicativo'])
                ->where(function ($query) use ($userId, $destinoId) {
                    $query->where('remitente_id', $userId)
                        ->where('destinatario_id', $destinoId);
                })
                ->orWhere(function ($query) use ($userId, $destinoId) {
                    $query->where('remitente_id', $destinoId)
                        ->where('destinatario_id', $userId);
                })
                ->orderBy('created_at', 'desc')
                ->get();

            return json_encode($conversacion);
        } else {
            return route('/login');
        }
    }

    public function enviarMensaje(ValidarMensaje $request)
    {

        if (Auth::check()) {
            $userId = Auth::id();
            $requestAll = $request->all();
            $requestAll['remitente_id'] = $userId;

            $nuevoMensaje = Mensaje::create($requestAll);

            try {
                broadcast(new NuevoMensaje($nuevoMensaje));
            } catch (Exception $e) {
                report($e);
            }

            return back();
        } else {
            return route('/login');
        }
    }

    /**
     * Función que devuelve las conversaciones del usuario autenticado
     * Añadiendo los datos del último mensaje
     */
    public function getConversaciones()
    {
        if (Auth::check()) {
            $userId = Auth::id();

            // Obtener conversaciones del usuario
            $conversaciones = Mensaje::select('remitente_id', 'destinatario_id')
                ->where('remitente_id', $userId)
                ->orWhere('destinatario_id', $userId)
                ->groupBy('remitente_id', 'destinatario_id')
                ->get();

            // Obtener IDs de otros usuarios en las conversaciones
            $otherUserIds = $conversaciones->flatMap(function ($conversacion) {
                return [$conversacion->remitente_id, $conversacion->destinatario_id];
            })->reject(function ($otherUserId) use ($userId) {
                return $otherUserId == $userId;
            })->unique();

            // Una sola consulta con todos los mensajes del usuario (evita N+1).
            $mensajes = Mensaje::where('remitente_id', $userId)
                ->orWhere('destinatario_id', $userId)
                ->orderBy('created_at', 'desc')
                ->get(['remitente_id', 'destinatario_id', 'mensaje', 'created_at']);

            // Obtener detalles de los otros usuarios con el último mensaje
            $otherUsers = User::with('roles')->whereIn('id', $otherUserIds)->get(['id', 'photo', 'username', 'indicativo'])->map(function ($user) use ($mensajes, $userId) {
                $lastMessage = $mensajes->first(function ($mensaje) use ($user, $userId) {
                    return ($mensaje->remitente_id == $user->id && $mensaje->destinatario_id == $userId)
                        || ($mensaje->remitente_id == $userId && $mensaje->destinatario_id == $user->id);
                });

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
                } else {
                    $user->last_message = null;
                    $user->last_message_time = null;
                }

                return $user;
            });

            return json_encode($otherUsers);
        } else {
            return route('/login');
        }
    }

    public function borrarConversacion($id)
    {
        if (Auth::check()) {
            $idUsuario = Auth::id();

            Mensaje::where(function ($query) use ($idUsuario, $id) {
                $query->where('remitente_id', $idUsuario)
                    ->where('destinatario_id', $id);
            })
                ->orWhere(function ($query) use ($idUsuario, $id) {
                    $query->where('remitente_id', $id)
                        ->where('destinatario_id', $idUsuario);
                })
                ->delete();
        } else {
            return route('/login');
        }
    }
}
