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
                ->limit(100)
                ->get();

            return response()->json($conversacion);
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

            $otherUsers = User::with('roles')
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
                    } else {
                        $user->last_message = null;
                        $user->last_message_time = null;
                    }

                    return $user;
                });

            return response()->json($otherUsers);
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
