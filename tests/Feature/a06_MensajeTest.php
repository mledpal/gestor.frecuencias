<?php

namespace Tests\Feature;

use App\Models\Mensaje;
use App\Models\User;

/**
 * MensajeController::getConversaciones se reescribió para calcular el
 * último mensaje por interlocutor con una subconsulta agrupada en BD en
 * vez de traer todos los mensajes del usuario a PHP y recorrerlos por cada
 * conversación (O(interlocutores × mensajes)). Este test fija el
 * comportamiento observable: un interlocutor por conversación, con el texto
 * del mensaje más reciente, sin filtrar conversaciones ajenas.
 */
class a06_MensajeTest extends FixtureTestCase
{
    private function crearMensaje(User $de, User $para, string $texto, string $creadoEn): Mensaje
    {
        $mensaje = Mensaje::create([
            'remitente_id' => $de->id,
            'destinatario_id' => $para->id,
            'mensaje' => $texto,
        ]);

        $mensaje->created_at = $creadoEn;
        $mensaje->save();

        return $mensaje;
    }

    public function test_get_conversaciones_devuelve_el_ultimo_mensaje_por_interlocutor(): void
    {
        $interlocutorA = User::factory()->create(['username' => 'InterlocutorA']);
        $interlocutorB = User::factory()->create(['username' => 'InterlocutorB']);
        $interlocutorC = User::factory()->create(['username' => 'InterlocutorC']);

        // Conversación con A: dos mensajes, el segundo es el último.
        $this->crearMensaje($this->usuario, $interlocutorA, 'Hola A', '2026-01-01 10:00:00');
        $this->crearMensaje($interlocutorA, $this->usuario, 'Último A', '2026-01-01 10:05:00');

        // Conversación con B: tres mensajes en ambos sentidos.
        $this->crearMensaje($this->usuario, $interlocutorB, 'Hola B', '2026-01-01 09:00:00');
        $this->crearMensaje($interlocutorB, $this->usuario, 'Respuesta B', '2026-01-01 09:10:00');
        $this->crearMensaje($this->usuario, $interlocutorB, 'Último B', '2026-01-01 09:20:00');

        // Conversación con C: un único mensaje.
        $this->crearMensaje($interlocutorC, $this->usuario, 'Único C', '2026-01-01 08:00:00');

        // Conversación ajena entre A y B: no debe aparecer para $this->usuario.
        $this->crearMensaje($interlocutorA, $interlocutorB, 'No me incumbe', '2026-01-01 11:00:00');

        $respuesta = $this->actingAs($this->usuario)
            ->getJson(route('todas_conversaciones'))
            ->assertOk()
            ->json();

        $this->assertCount(3, $respuesta);

        $porId = collect($respuesta)->keyBy('id');

        $this->assertSame('Último A', $porId[$interlocutorA->id]['last_message']);
        $this->assertSame('Último B', $porId[$interlocutorB->id]['last_message']);
        $this->assertSame('Único C', $porId[$interlocutorC->id]['last_message']);
    }
}
