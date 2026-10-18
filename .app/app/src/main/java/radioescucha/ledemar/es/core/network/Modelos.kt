package radioescucha.ledemar.es.core.network

import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable

// Modelos de la API REST /api/v1 (ver app/Http/Resources en el backend Laravel).

@Serializable
data class Usuario(
    val id: Int,
    val username: String,
    val indicativo: String? = null,
    val photo: String? = null,
    @SerialName("is_admin") val isAdmin: Boolean = false,
    @SerialName("is_root") val isRoot: Boolean = false,
    // Solo en el perfil propio y en el panel de administración
    val nombre: String? = null,
    val apellidos: String? = null,
    val email: String? = null,
    val ip: String? = null,
    @SerialName("ultima_conexion") val ultimaConexion: String? = null,
    val localizacion: Localizacion? = null,
    @SerialName("frecuencias_localizadas_count") val frecuenciasLocalizadas: Int = 0,
    // Solo en la lista de conversaciones
    @SerialName("last_message") val ultimoMensaje: String? = null,
    @SerialName("last_message_time") val horaUltimoMensaje: String? = null,
)

@Serializable
data class Localizacion(
    val id: Int? = null,
    val localidad: String? = null,
    val provincia: String? = null,
    val pais: String? = null,
    val gps: String? = null,
)

@Serializable
data class OpcionCatalogo(val id: Int, val nombre: String)

@Serializable
data class TipoContacto(val id: Int, val nombre: String, val color: String? = null)

@Serializable
data class TipoCodificacion(val id: Int, val nombre: String)

@Serializable
data class Repetidor(val id: Int, val offset: String? = null, val direccion: String? = null)

@Serializable
data class Contacto(
    val id: Int,
    @SerialName("user_id") val userId: Int,
    val nombre: String,
    val fecha: String? = null,
    val hora: String? = null,
    val observaciones: String? = null,
    val calidad: Int = 0,
    val comprobado: Boolean = false,
    val privado: Boolean = false,
    val favorito: Boolean = false,
    @SerialName("frecuencia_id") val frecuenciaId: Int? = null,
    val frecuencia: String? = null,
    val localizacion: Localizacion? = null,
    val tipo: TipoContacto? = null,
    val banda: OpcionCatalogo? = null,
    val modo: OpcionCatalogo? = null,
    val codificacion: OpcionCatalogo? = null,
    val ctcss: OpcionCatalogo? = null,
    val dcs: OpcionCatalogo? = null,
    val repetidor: Repetidor? = null,
    val usuario: Usuario? = null,
)

@Serializable
data class Selects(
    @SerialName("tipos_contacto") val tiposContacto: List<TipoContacto> = emptyList(),
    val modos: List<OpcionCatalogo> = emptyList(),
    val codificaciones: List<OpcionCatalogo> = emptyList(),
    val dcs: List<OpcionCatalogo> = emptyList(),
    val ctcss: List<OpcionCatalogo> = emptyList(),
    val bandas: List<OpcionCatalogo> = emptyList(),
    val direcciones: List<String> = listOf("=", "+", "-"),
)

@Serializable
data class Comentario(
    val id: Int,
    val comentario: String,
    @SerialName("frecuencia_id") val frecuenciaId: Int,
    @SerialName("localizacion_id") val localizacionId: Int? = null,
    @SerialName("created_at") val creadoEn: String? = null,
    val user: Usuario? = null,
)

@Serializable
data class Mensaje(
    val id: Int,
    @SerialName("remitente_id") val remitenteId: Int,
    @SerialName("destinatario_id") val destinatarioId: Int,
    val mensaje: String,
    @SerialName("created_at") val creadoEn: String? = null,
)

// ---- Peticiones ----

@Serializable
data class LoginPeticion(
    val email: String,
    val password: String,
    @SerialName("device_name") val dispositivo: String = "android",
)

@Serializable
data class RegistroPeticion(
    val username: String,
    val nombre: String,
    val apellidos: String,
    val email: String,
    val indicativo: String? = null,
    val password: String,
    @SerialName("password_confirmation") val confirmacion: String,
    @SerialName("device_name") val dispositivo: String = "android",
)

@Serializable
data class AuthRespuesta(val token: String, val user: Usuario)

@Serializable
data class EmailPeticion(val email: String)

/**
 * Datos del formulario de contacto. Los selects usan -1 como
 * "Desconocido"/"Ninguno", igual que la web; el backend lo convierte a null.
 */
@Serializable
data class ContactoPeticion(
    val nombre: String,
    val frecuencia: String,
    val fecha: String,
    val hora: String? = null,
    @SerialName("tipo_id") val tipoId: Int,
    @SerialName("modo_id") val modoId: Int = -1,
    @SerialName("banda_id") val bandaId: Int = -1,
    @SerialName("codificacion_id") val codificacionId: Int = -1,
    @SerialName("ctcss_id") val ctcssId: Int = -1,
    @SerialName("dcs_id") val dcsId: Int = -1,
    val calidad: Int = 0,
    val comprobado: Int = 0,
    val privado: Int = 0,
    val favorito: Int = 0,
    val observaciones: String? = null,
    @SerialName("localizacion_id") val localizacionId: Int? = null,
    val localidad: String? = null,
    val provincia: String? = null,
    val pais: String? = null,
    val gps: String? = null,
    val offset: String? = null,
    val direccion: String? = null,
)

@Serializable
data class BusquedaPeticion(
    val propio: Boolean = true,
    val nombre: String? = null,
    val frecuencia: String? = null,
    @SerialName("tipo_id") val tipoId: Int? = null,
    val comprobado: Boolean? = null,
    @SerialName("fecha_ini") val fechaIni: String? = null,
    @SerialName("fecha_fin") val fechaFin: String? = null,
    val localidad: String? = null,
    val provincia: String? = null,
)

@Serializable
data class BusquedaUsuariosPeticion(
    val usuario: String? = null,
    val indicativo: String? = null,
    val localidad: String? = null,
    val provincia: String? = null,
)

@Serializable
data class ComentarioPeticion(
    val comentario: String,
    @SerialName("frecuencia_id") val frecuenciaId: Int? = null,
    @SerialName("localizacion_id") val localizacionId: Int? = null,
)

@Serializable
data class MensajePeticion(
    @SerialName("destinatario_id") val destinatarioId: Int,
    val mensaje: String,
)

@Serializable
data class PerfilPeticion(
    val nombre: String,
    val apellidos: String,
    val email: String,
    val indicativo: String? = null,
)

@Serializable
data class PasswordPeticion(
    @SerialName("current_password") val actual: String,
    val password: String,
    @SerialName("password_confirmation") val confirmacion: String,
)

@Serializable
data class PasswordSimple(val password: String)

@Serializable
data class TipoContactoPeticion(val nombre: String, val color: String)

@Serializable
data class NombrePeticion(val nombre: String)

@Serializable
data class ErrorApi(
    val message: String? = null,
    val errors: Map<String, List<String>>? = null,
)
