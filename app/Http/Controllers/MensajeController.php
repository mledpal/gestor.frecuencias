<?php

namespace App\Http\Controllers;

use App\Http\Requests\ValidarMensaje;
use App\Models\Mensaje;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

use Ably\AblyRest;
use App\Events\NuevoMensaje;
use Exception;

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
                echo null;
            }

            // $apiKey = '-n3DVQ.QW58iA:NlZmlh8WGzadRH-9wz3yTlUFOl_955uZga9OOMEPTGE';
            // $ably = new AblyRest($apiKey);
            // $channelName = 'chatroom';
            // $channel = $ably->channels->get($channelName);
            // $messageData = array(
            //     'mensaje' => 'Este es un mensaje de prueba desde PHP',
            //     'usuario' => 'usuario_prueba'
            // );

            // $channel->publish('mensaje', $messageData);

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
            $otherUserIds = $conversaciones->flatMap(function ($conversacion) use ($userId) {
                return [$conversacion->remitente_id, $conversacion->destinatario_id];
            })->reject(function ($otherUserId) use ($userId) {
                return $otherUserId == $userId;
            })->unique();

            // Obtener detalles de los otros usuarios con el último mensaje
            $otherUsers = User::with('roles')->whereIn('id', $otherUserIds)->get(['id', 'photo', 'username', 'indicativo'])->map(function ($user) use ($userId) {
                $lastMessage = Mensaje::where('remitente_id', $user->id)
                    ->where('destinatario_id', $userId)
                    ->orWhere('remitente_id', $userId)
                    ->where('destinatario_id', $user->id)
                    ->latest()
                    ->first();

                $user->last_message = $lastMessage ? $lastMessage->mensaje : null;
                $user->last_message_timestamp = $lastMessage ? $lastMessage->created_at->format('H:i:s') : null;
                // $user->last_message_timestamp = $lastMessage ? $lastMessage->created_at->format('Y-m-d H:i:s') : null;

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
