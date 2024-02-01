<?php

namespace App\Http\Controllers;

use App\Http\Requests\ValidarMensaje;
use App\Models\Mensaje;
use App\Models\User;
use Illuminate\Http\Request;
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

            Mensaje::create($requestAll);

            return back()->with('flash', ['mensaje' => 'Mensaje enviado']);
        } else {
            return route('/login');
        }
    }

    public function getConversaciones()
    {
        if (Auth::check()) {

            $userId = Auth::id();

            $conversaciones = Mensaje::select('remitente_id', 'destinatario_id')
                ->where('remitente_id', $userId)
                ->orWhere('destinatario_id', $userId)
                ->groupBy('remitente_id', 'destinatario_id')
                ->get();

            $otherUserIds = $conversaciones->flatMap(function ($conversacion) use ($userId) {
                return [$conversacion->remitente_id, $conversacion->destinatario_id];
            })->reject(function ($otherUserId) use ($userId) {
                return $otherUserId == $userId;
            })->unique();

            $otherUsers = User::with('roles')->whereIn('id', $otherUserIds)->get(['id', 'photo', 'username', 'indicativo']);

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
