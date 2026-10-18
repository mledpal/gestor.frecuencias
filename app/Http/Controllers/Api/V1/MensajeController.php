<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\ValidarMensaje;
use App\Http\Resources\ConversacionResource;
use App\Http\Resources\MensajeResource;
use App\Services\MensajeService;
use Illuminate\Http\Request;

class MensajeController extends Controller
{
    public function __construct(private MensajeService $servicio) {}

    public function conversaciones(Request $request)
    {
        return ConversacionResource::collection($this->servicio->conversaciones($request->user()->id));
    }

    public function conversacion(Request $request, int $usuario)
    {
        return MensajeResource::collection($this->servicio->conversacion($request->user()->id, $usuario));
    }

    public function borrar(Request $request, int $usuario)
    {
        $this->servicio->borrar($request->user()->id, $usuario);

        return response()->noContent();
    }

    public function enviar(ValidarMensaje $request)
    {
        $mensaje = $this->servicio->enviar($request->user()->id, (int) $request->destinatario_id, $request->mensaje);

        return (new MensajeResource($mensaje))->response()->setStatusCode(201);
    }
}
