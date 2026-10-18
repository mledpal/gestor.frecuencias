package radioescucha.ledemar.es

import android.content.Context
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.SupervisorJob
import kotlinx.serialization.json.Json
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.OkHttpClient
import okhttp3.logging.HttpLoggingInterceptor
import radioescucha.ledemar.es.core.datastore.Sesion
import radioescucha.ledemar.es.core.network.ApiService
import radioescucha.ledemar.es.core.realtime.TiempoReal
import radioescucha.ledemar.es.data.AdminRepositorio
import radioescucha.ledemar.es.data.AuthRepositorio
import radioescucha.ledemar.es.data.ContactosRepositorio
import radioescucha.ledemar.es.data.PerfilRepositorio
import radioescucha.ledemar.es.data.SocialRepositorio
import retrofit2.Retrofit
import retrofit2.converter.kotlinx.serialization.asConverterFactory
import java.util.concurrent.TimeUnit

/**
 * Inyección de dependencias manual: un único contenedor creado en
 * [RadioescuchaApp] del que los ViewModels sacan lo que necesitan.
 */
class AppContainer(context: Context) {

    val scope = CoroutineScope(SupervisorJob() + Dispatchers.Default)

    val json = Json {
        ignoreUnknownKeys = true
        // Los -1 / 0 por defecto de las peticiones deben enviarse (modo_id es obligatorio).
        encodeDefaults = true
        explicitNulls = false
        coerceInputValues = true
        isLenient = true
    }

    val baseUrl: String = BuildConfig.API_BASE_URL.let { if (it.endsWith("/")) it else "$it/" }

    val sesion = Sesion(context.applicationContext, json, scope)

    val http: OkHttpClient = OkHttpClient.Builder()
        .connectTimeout(15, TimeUnit.SECONDS)
        .readTimeout(30, TimeUnit.SECONDS)
        .addInterceptor { cadena ->
            val peticion = cadena.request().newBuilder()
                .header("Accept", "application/json")
                .apply { sesion.token?.let { header("Authorization", "Bearer $it") } }
                .build()
            val respuesta = cadena.proceed(peticion)
            // Token revocado o caducado: se cierra la sesión y la app vuelve al login.
            if (respuesta.code == 401 && sesion.token != null && !peticion.url.encodedPath.contains("auth/login")) {
                sesion.cerrar()
            }
            respuesta
        }
        .apply {
            if (BuildConfig.DEBUG) {
                addInterceptor(HttpLoggingInterceptor().setLevel(HttpLoggingInterceptor.Level.BASIC))
            }
        }
        .build()

    val api: ApiService = Retrofit.Builder()
        .baseUrl(baseUrl)
        .client(http)
        .addConverterFactory(json.asConverterFactory("application/json".toMediaType()))
        .build()
        .create(ApiService::class.java)

    val tiempoReal = TiempoReal(http, sesion, baseUrl)

    val authRepositorio = AuthRepositorio(api, sesion, json)
    val contactosRepositorio = ContactosRepositorio(api, json)
    val socialRepositorio = SocialRepositorio(api, json)
    val perfilRepositorio = PerfilRepositorio(api, sesion, json)
    val adminRepositorio = AdminRepositorio(api, json)

    /** Limpia el estado en memoria al cerrar sesión. */
    fun alCerrarSesion() {
        contactosRepositorio.limpiar()
        tiempoReal.desconectar()
    }
}
