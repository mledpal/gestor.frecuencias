<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Testing\TestResponse;

/**
 * Verifica la autorización de los canales privados de mensajería y
 * comentarios (routes/channels.php). Antes de esta corrección los mensajes
 * viajaban por canales públicos de Pusher: cualquiera podía suscribirse sin
 * estar autenticado. socket_id usa un valor ficticio válido para el SDK de
 * Pusher (\d+\.\d+); la firma es puramente local (HMAC), no llega a golpear
 * la red de Pusher.
 */
class a05_BroadcastTest extends FixtureTestCase
{
    private function autorizarCanal(string $canal): TestResponse
    {
        return $this->postJson('/broadcasting/auth', [
            'socket_id' => '123.456',
            'channel_name' => 'private-'.$canal,
        ]);
    }

    public function test_un_tercero_no_puede_autorizar_el_canal_de_otra_conversacion(): void
    {
        $otro = User::factory()->create();
        $otro->roles()->sync([4]);

        $canal = 'canal-'.min($this->usuario->id, $this->admin->id).'-'.max($this->usuario->id, $this->admin->id).'-mensajes';

        $this->actingAs($otro)
            ->autorizarCanal($canal)
            ->assertForbidden();
    }

    public function test_los_dos_interlocutores_autorizan_su_canal_de_mensajes(): void
    {
        $canal = 'canal-'.min($this->usuario->id, $this->admin->id).'-'.max($this->usuario->id, $this->admin->id).'-mensajes';

        $this->actingAs($this->usuario)->autorizarCanal($canal)->assertOk();
        $this->actingAs($this->admin)->autorizarCanal($canal)->assertOk();
    }

    public function test_un_invitado_no_autoriza_ningun_canal_de_mensajes(): void
    {
        $canal = 'canal-'.min($this->usuario->id, $this->admin->id).'-'.max($this->usuario->id, $this->admin->id).'-mensajes';

        $this->autorizarCanal($canal)->assertForbidden();
    }

    public function test_cualquier_autenticado_autoriza_el_canal_de_comentarios(): void
    {
        $canal = 'canal-'.$this->frecuencia->id.'-'.$this->localizacion->id.'-comentarios';

        $this->actingAs($this->usuario)->autorizarCanal($canal)->assertOk();
    }

    public function test_un_invitado_no_autoriza_el_canal_de_comentarios(): void
    {
        $canal = 'canal-'.$this->frecuencia->id.'-'.$this->localizacion->id.'-comentarios';

        $this->autorizarCanal($canal)->assertForbidden();
    }
}
