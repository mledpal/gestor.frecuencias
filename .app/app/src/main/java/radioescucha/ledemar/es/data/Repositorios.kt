package radioescucha.ledemar.es.data

import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.serialization.json.Json
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.MultipartBody
import okhttp3.RequestBody.Companion.toRequestBody
import radioescucha.ledemar.es.core.datastore.Sesion
import radioescucha.ledemar.es.core.network.ApiService
import radioescucha.ledemar.es.core.network.BusquedaPeticion
import radioescucha.ledemar.es.core.network.BusquedaUsuariosPeticion
import radioescucha.ledemar.es.core.network.ComentarioPeticion
import radioescucha.ledemar.es.core.network.Contacto
import radioescucha.ledemar.es.core.network.ContactoPeticion
import radioescucha.ledemar.es.core.network.EmailPeticion
import radioescucha.ledemar.es.core.network.Localizacion
import radioescucha.ledemar.es.core.network.LoginPeticion
import radioescucha.ledemar.es.core.network.MensajePeticion
import radioescucha.ledemar.es.core.network.NombrePeticion
import radioescucha.ledemar.es.core.network.PasswordPeticion
import radioescucha.ledemar.es.core.network.PasswordSimple
import radioescucha.ledemar.es.core.network.PerfilPeticion
import radioescucha.ledemar.es.core.network.RegistroPeticion
import radioescucha.ledemar.es.core.network.Resultado
import radioescucha.ledemar.es.core.network.Selects
import radioescucha.ledemar.es.core.network.TipoContactoPeticion
import radioescucha.ledemar.es.core.network.Usuario
import radioescucha.ledemar.es.core.network.alOk
import radioescucha.ledemar.es.core.network.llamar

/**
 * Autenticación y datos del usuario de la sesión.
 */
class AuthRepositorio(private val api: ApiService, private val sesion: Sesion, private val json: Json) {

    suspend fun login(email: String, password: String) =
        llamar(json) { api.login(LoginPeticion(email.trim(), password)) }
            .alOk { sesion.iniciar(it.token, it.user) }

    suspend fun registro(peticion: RegistroPeticion) =
        llamar(json) { api.registro(peticion) }
            .alOk { sesion.iniciar(it.token, it.user) }

    suspend fun recuperarPassword(email: String) =
        llamar(json) { api.recuperarPassword(EmailPeticion(email.trim())) }

    suspend fun refrescarUsuario() =
        llamar(json) { api.yo() }.alOk { sesion.actualizarUsuario(it) }

    suspend fun logout() {
        llamar(json) { api.logout() }
        sesion.cerrar()
    }
}

/**
 * Contactos propios, resultado de la búsqueda activa y catálogos. Guarda el
 * estado en memoria para compartirlo entre pantallas (como AppContext en la web).
 */
class ContactosRepositorio(private val api: ApiService, private val json: Json) {

    private val _contactos = MutableStateFlow<List<Contacto>>(emptyList())
    val contactos: StateFlow<List<Contacto>> = _contactos.asStateFlow()

    /** Resultado de la última búsqueda; null = se muestran los contactos propios. */
    private val _busqueda = MutableStateFlow<List<Contacto>?>(null)
    val busqueda: StateFlow<List<Contacto>?> = _busqueda.asStateFlow()

    private val _selects = MutableStateFlow<Selects?>(null)
    val selects: StateFlow<Selects?> = _selects.asStateFlow()

    suspend fun cargar(): Resultado<List<Contacto>> =
        llamar(json) { api.contactos() }.alOk { _contactos.value = it }

    suspend fun cargarSelects(forzar: Boolean = false): Resultado<Selects> {
        if (!forzar) _selects.value?.let { return Resultado.Ok(it) }
        return llamar(json) { api.selects() }.alOk { _selects.value = it }
    }

    suspend fun obtener(id: Int) = llamar(json) { api.contacto(id) }

    suspend fun crear(peticion: ContactoPeticion) =
        llamar(json) { api.crearContacto(peticion) }.alOk { nuevo ->
            _contactos.update { (it + nuevo).sortedBy { c -> c.nombre.lowercase() } }
        }

    suspend fun actualizar(id: Int, peticion: ContactoPeticion) =
        llamar(json) { api.actualizarContacto(id, peticion) }.alOk { editado ->
            _contactos.update { lista -> lista.map { if (it.id == id) editado else it }.sortedBy { c -> c.nombre.lowercase() } }
            _busqueda.update { lista -> lista?.map { if (it.id == id) editado else it } }
        }

    suspend fun eliminar(id: Int) =
        llamar(json) { api.eliminarContacto(id) }.alOk {
            _contactos.update { lista -> lista.filterNot { it.id == id } }
            _busqueda.update { lista -> lista?.filterNot { it.id == id } }
        }

    suspend fun buscar(peticion: BusquedaPeticion) =
        llamar(json) { api.buscarContactos(peticion) }.alOk { _busqueda.value = it }

    fun limpiarBusqueda() {
        _busqueda.value = null
    }

    fun limpiar() {
        _contactos.value = emptyList()
        _busqueda.value = null
        _selects.value = null
    }
}

/**
 * Comentarios, mensajería y búsqueda de usuarios.
 */
class SocialRepositorio(private val api: ApiService, private val json: Json) {

    suspend fun comentarios(frecuenciaId: Int, localizacionId: Int?) =
        llamar(json) { api.comentarios(frecuenciaId, localizacionId) }

    suspend fun comentar(texto: String, frecuenciaId: Int, localizacionId: Int?) =
        llamar(json) { api.crearComentario(ComentarioPeticion(texto, frecuenciaId, localizacionId)) }

    suspend fun editarComentario(id: Int, texto: String) =
        llamar(json) { api.editarComentario(id, ComentarioPeticion(texto)) }

    suspend fun eliminarComentario(id: Int) = llamar(json) { api.eliminarComentario(id) }

    suspend fun conversaciones() = llamar(json) { api.conversaciones() }

    suspend fun conversacion(usuarioId: Int) = llamar(json) { api.conversacion(usuarioId) }

    suspend fun borrarConversacion(usuarioId: Int) = llamar(json) { api.borrarConversacion(usuarioId) }

    suspend fun enviar(destinatarioId: Int, texto: String) =
        llamar(json) { api.enviarMensaje(MensajePeticion(destinatarioId, texto)) }

    suspend fun buscarUsuarios(peticion: BusquedaUsuariosPeticion) = llamar(json) { api.buscarUsuarios(peticion) }

    suspend fun usuario(id: Int) = llamar(json) { api.usuario(id) }
}

/**
 * Perfil del usuario de la sesión. Cada cambio refresca el usuario guardado.
 */
class PerfilRepositorio(private val api: ApiService, private val sesion: Sesion, private val json: Json) {

    suspend fun actualizar(peticion: PerfilPeticion) =
        llamar(json) { api.actualizarPerfil(peticion) }.alOk { sesion.actualizarUsuario(it) }

    suspend fun localizacion(localizacion: Localizacion) =
        llamar(json) { api.actualizarLocalizacion(localizacion) }.alOk { sesion.actualizarUsuario(it) }

    suspend fun cambiarPassword(actual: String, nueva: String, confirmacion: String) =
        llamar(json) { api.cambiarPassword(PasswordPeticion(actual, nueva, confirmacion)) }

    /** Sube la foto ya recortada a 1:1 y comprimida (ver ui/feature/perfil/Imagen.kt). */
    suspend fun subirFoto(jpeg: ByteArray): Resultado<Usuario> {
        val parte = MultipartBody.Part.createFormData(
            "photo",
            "avatar.jpg",
            jpeg.toRequestBody("image/jpeg".toMediaType()),
        )
        return llamar(json) { api.subirFoto(parte) }.alOk { sesion.actualizarUsuario(it) }
    }

    suspend fun eliminarCuenta(password: String) =
        llamar(json) { api.eliminarCuenta(PasswordSimple(password)) }.alOk { sesion.cerrar() }
}

/**
 * Panel de administración.
 */
class AdminRepositorio(private val api: ApiService, private val json: Json) {

    suspend fun usuarios() = llamar(json) { api.adminUsuarios() }

    suspend fun frecuenciasUsuario(id: Int) = llamar(json) { api.adminFrecuenciasUsuario(id) }

    suspend fun cambiarRol(id: Int) = llamar(json) { api.adminCambiarRol(id) }

    suspend fun eliminarUsuario(id: Int) = llamar(json) { api.adminEliminarUsuario(id) }

    suspend fun tiposContacto() = llamar(json) { api.tiposContacto() }

    suspend fun guardarTipoContacto(id: Int?, nombre: String, color: String) = llamar(json) {
        val peticion = TipoContactoPeticion(nombre.trim(), color)
        if (id == null) api.crearTipoContacto(peticion) else api.editarTipoContacto(id, peticion)
    }

    suspend fun eliminarTipoContacto(id: Int) = llamar(json) { api.eliminarTipoContacto(id) }

    suspend fun tiposCodificacion() = llamar(json) { api.tiposCodificacion() }

    suspend fun guardarTipoCodificacion(id: Int?, nombre: String) = llamar(json) {
        val peticion = NombrePeticion(nombre.trim())
        if (id == null) api.crearTipoCodificacion(peticion) else api.editarTipoCodificacion(id, peticion)
    }

    suspend fun eliminarTipoCodificacion(id: Int) = llamar(json) { api.eliminarTipoCodificacion(id) }
}
