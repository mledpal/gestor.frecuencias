package radioescucha.ledemar.es.core.realtime

import android.util.Log
import com.pusher.client.ChannelAuthorizer
import com.pusher.client.Pusher
import com.pusher.client.PusherOptions
import com.pusher.client.channel.PrivateChannelEventListener
import com.pusher.client.channel.PusherEvent
import com.pusher.client.AuthorizationFailureException
import com.pusher.client.connection.ConnectionState
import kotlinx.coroutines.channels.awaitClose
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.callbackFlow
import kotlinx.coroutines.flow.emptyFlow
import okhttp3.FormBody
import okhttp3.OkHttpClient
import okhttp3.Request
import radioescucha.ledemar.es.BuildConfig
import radioescucha.ledemar.es.core.datastore.Sesion

/** Evento recibido por un canal privado: nombre (p. ej. "NuevoMensaje") y JSON. */
data class EventoTiempoReal(val nombre: String, val datos: String)

/**
 * Conexión única a Pusher (o Reverb, que usa el mismo protocolo) compartida
 * por toda la app, con conteo de referencias por canal como
 * resources/js/Helpers/realtime.js. Los canales privados se autorizan contra
 * /api/broadcasting/auth con el token Sanctum de la sesión.
 */
class TiempoReal(
    private val http: OkHttpClient,
    private val sesion: Sesion,
    private val baseUrl: String,
) {
    private var pusher: Pusher? = null
    private val referencias = mutableMapOf<String, Int>()

    val habilitado: Boolean get() = BuildConfig.PUSHER_KEY.isNotBlank()

    /**
     * Canal de la conversación entre dos usuarios (ver App\Events\NuevoMensaje).
     */
    fun canalMensajes(a: Int, b: Int) = "private-canal-${minOf(a, b)}-${maxOf(a, b)}-mensajes"

    /**
     * Canal de comentarios de una frecuencia + localización (ver App\Events\NuevoComentario).
     */
    fun canalComentarios(frecuenciaId: Int, localizacionId: Int?) =
        "private-canal-$frecuenciaId-${localizacionId ?: ""}-comentarios"

    /**
     * Se suscribe al canal mientras el Flow esté activo.
     */
    fun eventos(canal: String, vararg nombres: String): Flow<EventoTiempoReal> {
        if (!habilitado) return emptyFlow()

        return callbackFlow {
            val oyente = object : PrivateChannelEventListener {
                override fun onEvent(evento: PusherEvent) {
                    trySend(EventoTiempoReal(evento.eventName, evento.data ?: "{}"))
                }

                override fun onSubscriptionSucceeded(nombreCanal: String) = Unit

                override fun onAuthenticationFailure(mensaje: String?, e: Exception?) {
                    Log.w(TAG, "No se pudo autorizar $canal: $mensaje", e)
                }
            }

            suscribir(canal, oyente, nombres)
            awaitClose { desuscribir(canal, oyente, nombres) }
        }
    }

    @Synchronized
    private fun suscribir(canal: String, oyente: PrivateChannelEventListener, nombres: Array<out String>) {
        val cliente = conectar()
        val existente = cliente.getPrivateChannel(canal)
        if (existente == null) {
            cliente.subscribePrivate(canal, oyente, *nombres)
        } else {
            nombres.forEach { existente.bind(it, oyente) }
        }
        referencias[canal] = (referencias[canal] ?: 0) + 1
    }

    @Synchronized
    private fun desuscribir(canal: String, oyente: PrivateChannelEventListener, nombres: Array<out String>) {
        val cliente = pusher ?: return
        cliente.getPrivateChannel(canal)?.let { c -> nombres.forEach { c.unbind(it, oyente) } }

        val restantes = (referencias[canal] ?: 1) - 1
        if (restantes <= 0) {
            referencias.remove(canal)
            cliente.unsubscribe(canal)
        } else {
            referencias[canal] = restantes
        }

        if (referencias.isEmpty()) desconectar()
    }

    private fun conectar(): Pusher {
        pusher?.let {
            if (it.connection.state == ConnectionState.DISCONNECTED) it.connect()
            return it
        }

        val opciones = PusherOptions()
            .setChannelAuthorizer(AutorizadorSanctum())
            .setUseTLS(BuildConfig.PUSHER_TLS)

        if (BuildConfig.PUSHER_HOST.isNotBlank()) {
            opciones.setHost(BuildConfig.PUSHER_HOST)
                .setWsPort(BuildConfig.PUSHER_PORT)
                .setWssPort(BuildConfig.PUSHER_PORT)
        } else {
            opciones.setCluster(BuildConfig.PUSHER_CLUSTER)
        }

        return Pusher(BuildConfig.PUSHER_KEY, opciones).also {
            it.connect()
            pusher = it
        }
    }

    @Synchronized
    fun desconectar() {
        pusher?.disconnect()
        pusher = null
        referencias.clear()
    }

    /**
     * Autoriza canales privados con el token Bearer actual (se lee en cada
     * petición, así que sobrevive a cambios de sesión).
     */
    private inner class AutorizadorSanctum : ChannelAuthorizer {
        override fun authorize(channelName: String, socketId: String): String {
            val peticion = Request.Builder()
                .url(baseUrl + "api/broadcasting/auth")
                .header("Accept", "application/json")
                .apply { sesion.token?.let { header("Authorization", "Bearer $it") } }
                .post(FormBody.Builder().add("socket_id", socketId).add("channel_name", channelName).build())
                .build()

            http.newCall(peticion).execute().use { respuesta ->
                val cuerpo = respuesta.body.string()
                if (!respuesta.isSuccessful) {
                    throw AuthorizationFailureException("HTTP ${respuesta.code}: $cuerpo")
                }
                return cuerpo
            }
        }
    }

    private companion object {
        const val TAG = "TiempoReal"
    }
}
