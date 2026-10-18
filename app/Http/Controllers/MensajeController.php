<?php

namespace App\Http\Controllers;

use App\Http\Requests\ValidarMensaje;
use App\Services\MensajeService;
use Illuminate\Support\Facades\Auth;

class MensajeController extends Controller
{
    public function __construct(private MensajeService $servicio) {}

    public function recuperarConversacion($destinoId)
    {
        return response()->json($this->servicio->conversacion(Auth::id(), (int) $destinoId));
    }

    public function enviarMensaje(ValidarMensaje $request)
    {
        $this->servicio->enviar(Auth::id(), (int) $request->destinatario_id, $request->mensaje);

        return back();
    }

    /**
     * Función que devuelve las conversaciones del usuario autenticado
     * Añadiendo los datos del último mensaje
     */
    public function getConversaciones()
    {
        return response()->json($this->servicio->conversaciones(Auth::id()));
    }

    public function borrarConversacion($id)
    {
        $this->servicio->borrar(Auth::id(), (int) $id);
    }
}
