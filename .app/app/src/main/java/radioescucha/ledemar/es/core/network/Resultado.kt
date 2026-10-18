package radioescucha.ledemar.es.core.network

import kotlinx.coroutines.CancellationException
import kotlinx.serialization.json.Json
import retrofit2.HttpException
import java.io.IOException

/**
 * Resultado de una llamada a la API, con el error ya traducido a un mensaje
 * mostrable y los errores de validación por campo (422).
 */
sealed interface Resultado<out T> {
    data class Ok<T>(val datos: T) : Resultado<T>
    data class Error(
        val mensaje: String,
        val codigo: Int? = null,
        val campos: Map<String, String> = emptyMap(),
    ) : Resultado<Nothing>
}

inline fun <T, R> Resultado<T>.map(transformar: (T) -> R): Resultado<R> = when (this) {
    is Resultado.Ok -> Resultado.Ok(transformar(datos))
    is Resultado.Error -> this
}

inline fun <T> Resultado<T>.alOk(accion: (T) -> Unit): Resultado<T> {
    if (this is Resultado.Ok) accion(datos)
    return this
}

inline fun <T> Resultado<T>.alError(accion: (Resultado.Error) -> Unit): Resultado<T> {
    if (this is Resultado.Error) accion(this)
    return this
}

/**
 * Ejecuta una llamada de red y convierte las excepciones en [Resultado.Error].
 */
suspend fun <T> llamar(json: Json, bloque: suspend () -> T): Resultado<T> = try {
    Resultado.Ok(bloque())
} catch (e: CancellationException) {
    throw e
} catch (e: HttpException) {
    errorHttp(json, e)
} catch (e: IOException) {
    Resultado.Error("No se pudo conectar con el servidor. Comprueba tu conexión.")
} catch (e: Exception) {
    Resultado.Error(e.message ?: "Error inesperado")
}

private fun errorHttp(json: Json, e: HttpException): Resultado.Error {
    val cuerpo = runCatching { e.response()?.errorBody()?.string() }.getOrNull()
    val error = cuerpo?.let { runCatching { json.decodeFromString<ErrorApi>(it) }.getOrNull() }
    val campos = error?.errors?.mapValues { it.value.firstOrNull().orEmpty() }.orEmpty()

    val mensaje = when {
        campos.isNotEmpty() -> campos.values.first()
        !error?.message.isNullOrBlank() && e.code() != 500 -> error!!.message!!
        e.code() == 401 -> "Tu sesión ha caducado. Vuelve a iniciar sesión."
        e.code() == 403 -> "No tienes permiso para realizar esta acción."
        e.code() == 404 -> "No se ha encontrado el recurso."
        e.code() == 429 -> "Demasiados intentos. Espera un momento."
        else -> "Error del servidor (${e.code()})"
    }

    return Resultado.Error(mensaje, e.code(), campos)
}
