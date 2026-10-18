package radioescucha.ledemar.es.core.network

import okhttp3.MultipartBody
import retrofit2.http.Body
import retrofit2.http.DELETE
import retrofit2.http.GET
import retrofit2.http.HTTP
import retrofit2.http.Multipart
import retrofit2.http.PATCH
import retrofit2.http.POST
import retrofit2.http.PUT
import retrofit2.http.Part
import retrofit2.http.Path
import retrofit2.http.Query

/**
 * API REST del backend (routes/api.php, prefijo /api/v1).
 */
interface ApiService {

    // ---- Autenticación ----
    @POST("api/v1/auth/login")
    suspend fun login(@Body peticion: LoginPeticion): AuthRespuesta

    @POST("api/v1/auth/register")
    suspend fun registro(@Body peticion: RegistroPeticion): AuthRespuesta

    @POST("api/v1/auth/forgot-password")
    suspend fun recuperarPassword(@Body peticion: EmailPeticion): ErrorApi

    @POST("api/v1/auth/logout")
    suspend fun logout()

    @GET("api/v1/me")
    suspend fun yo(): Usuario

    @GET("api/v1/selects")
    suspend fun selects(): Selects

    // ---- Contactos ----
    @GET("api/v1/contactos")
    suspend fun contactos(): List<Contacto>

    @GET("api/v1/contactos/{id}")
    suspend fun contacto(@Path("id") id: Int): Contacto

    @POST("api/v1/contactos")
    suspend fun crearContacto(@Body peticion: ContactoPeticion): Contacto

    @PUT("api/v1/contactos/{id}")
    suspend fun actualizarContacto(@Path("id") id: Int, @Body peticion: ContactoPeticion): Contacto

    @DELETE("api/v1/contactos/{id}")
    suspend fun eliminarContacto(@Path("id") id: Int)

    @POST("api/v1/contactos/buscar")
    suspend fun buscarContactos(@Body peticion: BusquedaPeticion): List<Contacto>

    // ---- Comentarios ----
    @GET("api/v1/comentarios")
    suspend fun comentarios(
        @Query("frecuencia_id") frecuenciaId: Int,
        @Query("localizacion_id") localizacionId: Int?,
    ): List<Comentario>

    @POST("api/v1/comentarios")
    suspend fun crearComentario(@Body peticion: ComentarioPeticion): Comentario

    @PUT("api/v1/comentarios/{id}")
    suspend fun editarComentario(@Path("id") id: Int, @Body peticion: ComentarioPeticion): Comentario

    @DELETE("api/v1/comentarios/{id}")
    suspend fun eliminarComentario(@Path("id") id: Int)

    // ---- Mensajes ----
    @GET("api/v1/conversaciones")
    suspend fun conversaciones(): List<Usuario>

    @GET("api/v1/conversaciones/{usuario}")
    suspend fun conversacion(@Path("usuario") usuarioId: Int): List<Mensaje>

    @DELETE("api/v1/conversaciones/{usuario}")
    suspend fun borrarConversacion(@Path("usuario") usuarioId: Int)

    @POST("api/v1/mensajes")
    suspend fun enviarMensaje(@Body peticion: MensajePeticion): Mensaje

    // ---- Usuarios ----
    @POST("api/v1/usuarios/buscar")
    suspend fun buscarUsuarios(@Body peticion: BusquedaUsuariosPeticion): List<Usuario>

    @GET("api/v1/usuarios/{id}")
    suspend fun usuario(@Path("id") id: Int): Usuario

    // ---- Perfil ----
    @PATCH("api/v1/perfil")
    suspend fun actualizarPerfil(@Body peticion: PerfilPeticion): Usuario

    @PUT("api/v1/perfil/localizacion")
    suspend fun actualizarLocalizacion(@Body peticion: Localizacion): Usuario

    @PUT("api/v1/perfil/password")
    suspend fun cambiarPassword(@Body peticion: PasswordPeticion)

    @Multipart
    @POST("api/v1/perfil/foto")
    suspend fun subirFoto(@Part foto: MultipartBody.Part): Usuario

    @HTTP(method = "DELETE", path = "api/v1/perfil", hasBody = true)
    suspend fun eliminarCuenta(@Body peticion: PasswordSimple)

    // ---- Administración ----
    @GET("api/v1/admin/usuarios")
    suspend fun adminUsuarios(): List<Usuario>

    @GET("api/v1/admin/usuarios/{id}/frecuencias")
    suspend fun adminFrecuenciasUsuario(@Path("id") id: Int): List<Contacto>

    @POST("api/v1/admin/usuarios/{id}/admin")
    suspend fun adminCambiarRol(@Path("id") id: Int): Usuario

    @DELETE("api/v1/admin/usuarios/{id}")
    suspend fun adminEliminarUsuario(@Path("id") id: Int)

    @GET("api/v1/admin/tipos-contacto")
    suspend fun tiposContacto(): List<TipoContacto>

    @POST("api/v1/admin/tipos-contacto")
    suspend fun crearTipoContacto(@Body peticion: TipoContactoPeticion): TipoContacto

    @PUT("api/v1/admin/tipos-contacto/{id}")
    suspend fun editarTipoContacto(@Path("id") id: Int, @Body peticion: TipoContactoPeticion): TipoContacto

    @DELETE("api/v1/admin/tipos-contacto/{id}")
    suspend fun eliminarTipoContacto(@Path("id") id: Int)

    @GET("api/v1/admin/tipos-codificacion")
    suspend fun tiposCodificacion(): List<TipoCodificacion>

    @POST("api/v1/admin/tipos-codificacion")
    suspend fun crearTipoCodificacion(@Body peticion: NombrePeticion): TipoCodificacion

    @PUT("api/v1/admin/tipos-codificacion/{id}")
    suspend fun editarTipoCodificacion(@Path("id") id: Int, @Body peticion: NombrePeticion): TipoCodificacion

    @DELETE("api/v1/admin/tipos-codificacion/{id}")
    suspend fun eliminarTipoCodificacion(@Path("id") id: Int)
}
