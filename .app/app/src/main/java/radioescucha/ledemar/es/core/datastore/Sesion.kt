package radioescucha.ledemar.es.core.datastore

import android.content.Context
import androidx.datastore.preferences.core.edit
import androidx.datastore.preferences.core.stringPreferencesKey
import androidx.datastore.preferences.preferencesDataStore
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.flow.map
import kotlinx.coroutines.launch
import kotlinx.serialization.json.Json
import radioescucha.ledemar.es.core.network.Usuario

private val Context.dataStore by preferencesDataStore(name = "radioescucha")

enum class Tema { SISTEMA, CLARO, OSCURO }

/**
 * Estado de la sesión y preferencias persistidas en DataStore. El token se
 * mantiene también en memoria para que el interceptor HTTP lo lea sin bloquear.
 */
class Sesion(
    private val context: Context,
    private val json: Json,
    private val scope: CoroutineScope,
) {
    private val claveToken = stringPreferencesKey("token")
    private val claveUsuario = stringPreferencesKey("usuario")
    private val claveTema = stringPreferencesKey("tema")
    private val claveFiltros = stringPreferencesKey("filtros")

    @Volatile
    var token: String? = null
        private set

    private val _usuario = MutableStateFlow<Usuario?>(null)
    val usuario: StateFlow<Usuario?> = _usuario.asStateFlow()

    /** null mientras se lee DataStore al arrancar. */
    private val _autenticado = MutableStateFlow<Boolean?>(null)
    val autenticado: StateFlow<Boolean?> = _autenticado.asStateFlow()

    val tema = context.dataStore.data.map { prefs ->
        prefs[claveTema]?.let { runCatching { Tema.valueOf(it) }.getOrNull() } ?: Tema.OSCURO
    }

    val filtros = context.dataStore.data.map { prefs -> prefs[claveFiltros] }

    init {
        scope.launch {
            val prefs = context.dataStore.data.first()
            token = prefs[claveToken]
            _usuario.value = prefs[claveUsuario]?.let { runCatching { json.decodeFromString<Usuario>(it) }.getOrNull() }
            _autenticado.value = token != null
        }
    }

    suspend fun iniciar(token: String, usuario: Usuario) {
        this.token = token
        context.dataStore.edit {
            it[claveToken] = token
            it[claveUsuario] = json.encodeToString(Usuario.serializer(), usuario)
        }
        _usuario.value = usuario
        _autenticado.value = true
    }

    suspend fun actualizarUsuario(usuario: Usuario) {
        context.dataStore.edit { it[claveUsuario] = json.encodeToString(Usuario.serializer(), usuario) }
        _usuario.value = usuario
    }

    /** Cierra la sesión local (también se llama al recibir un 401). */
    fun cerrar() {
        token = null
        _usuario.value = null
        _autenticado.value = false
        scope.launch {
            context.dataStore.edit {
                it.remove(claveToken)
                it.remove(claveUsuario)
            }
        }
    }

    suspend fun guardarTema(tema: Tema) {
        context.dataStore.edit { it[claveTema] = tema.name }
    }

    suspend fun guardarFiltros(valor: String) {
        context.dataStore.edit { it[claveFiltros] = valor }
    }
}
