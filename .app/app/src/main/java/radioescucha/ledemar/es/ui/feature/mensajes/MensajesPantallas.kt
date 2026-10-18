package radioescucha.ledemar.es.ui.feature.mensajes

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.imePadding
import androidx.compose.foundation.layout.navigationBarsPadding
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.layout.widthIn
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.lazy.rememberLazyListState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.automirrored.filled.Send
import androidx.compose.material.icons.filled.Chat
import androidx.compose.material.icons.filled.Delete
import androidx.compose.material.icons.filled.PersonSearch
import androidx.compose.material.icons.filled.Search
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.FilledIconButton
import androidx.compose.material3.FloatingActionButton
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.ListItem
import androidx.compose.material3.ListItemDefaults
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Scaffold
import androidx.compose.material3.SnackbarHost
import androidx.compose.material3.SnackbarHostState
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.material3.TopAppBar
import androidx.compose.material3.pulltorefresh.PullToRefreshBox
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.lifecycle.ViewModel
import androidx.lifecycle.compose.LifecycleResumeEffect
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.lifecycle.viewModelScope
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import kotlinx.serialization.Serializable
import kotlinx.serialization.json.Json
import radioescucha.ledemar.es.core.network.BusquedaUsuariosPeticion
import radioescucha.ledemar.es.core.network.Mensaje
import radioescucha.ledemar.es.core.network.Resultado
import radioescucha.ledemar.es.core.network.Usuario
import radioescucha.ledemar.es.core.realtime.TiempoReal
import radioescucha.ledemar.es.core.util.Formatos
import radioescucha.ledemar.es.data.SocialRepositorio
import radioescucha.ledemar.es.ui.appViewModel
import radioescucha.ledemar.es.ui.components.Avatar
import radioescucha.ledemar.es.ui.components.BotonPrincipal
import radioescucha.ledemar.es.ui.components.Campo
import radioescucha.ledemar.es.ui.components.Cargando
import radioescucha.ledemar.es.ui.components.DialogoConfirmar
import radioescucha.ledemar.es.ui.components.EstadoVacio
import radioescucha.ledemar.es.ui.contenedor
import java.time.OffsetDateTime

// ------------------------------------------------------------------
// Conversaciones
// ------------------------------------------------------------------

data class ConversacionesEstado(
    val cargando: Boolean = true,
    val conversaciones: List<Usuario> = emptyList(),
    val error: String? = null,
)

class ConversacionesViewModel(private val repo: SocialRepositorio) : ViewModel() {
    private val _estado = MutableStateFlow(ConversacionesEstado())
    val estado = _estado.asStateFlow()

    fun cargar() {
        viewModelScope.launch {
            _estado.update { it.copy(cargando = true) }
            when (val r = repo.conversaciones()) {
                is Resultado.Ok -> _estado.value = ConversacionesEstado(cargando = false, conversaciones = r.datos)
                is Resultado.Error -> _estado.update { it.copy(cargando = false, error = r.mensaje) }
            }
        }
    }

    fun borrar(usuarioId: Int) {
        viewModelScope.launch {
            when (val r = repo.borrarConversacion(usuarioId)) {
                is Resultado.Ok -> _estado.update { e -> e.copy(conversaciones = e.conversaciones.filterNot { it.id == usuarioId }) }
                is Resultado.Error -> _estado.update { it.copy(error = r.mensaje) }
            }
        }
    }

    fun descartarError() = _estado.update { it.copy(error = null) }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ConversacionesPantalla(alAbrirChat: (Int, String) -> Unit, alBuscarUsuarios: () -> Unit) {
    val vm = appViewModel { ConversacionesViewModel(it.socialRepositorio) }
    val estado by vm.estado.collectAsStateWithLifecycle()
    val snackbar = remember { SnackbarHostState() }
    var borrando by remember { mutableStateOf<Usuario?>(null) }

    // Se refresca cada vez que se vuelve a la pantalla (p. ej. desde un chat).
    LifecycleResumeEffect(Unit) {
        vm.cargar()
        onPauseOrDispose { }
    }
    LaunchedEffect(estado.error) {
        estado.error?.let { snackbar.showSnackbar(it); vm.descartarError() }
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Mensajes") },
                actions = { IconButton(onClick = alBuscarUsuarios) { Icon(Icons.Filled.Search, "Buscar usuarios") } },
            )
        },
        floatingActionButton = {
            FloatingActionButton(onClick = alBuscarUsuarios) { Icon(Icons.Filled.PersonSearch, "Nueva conversación") }
        },
        snackbarHost = { SnackbarHost(snackbar) },
    ) { padding ->
        PullToRefreshBox(
            isRefreshing = estado.cargando && estado.conversaciones.isNotEmpty(),
            onRefresh = vm::cargar,
            modifier = Modifier
                .padding(padding)
                .fillMaxSize(),
        ) {
            when {
                estado.cargando && estado.conversaciones.isEmpty() -> Cargando()
                estado.conversaciones.isEmpty() -> EstadoVacio(
                    Icons.Filled.Chat,
                    "Sin conversaciones",
                    "Busca a otros radioescuchas por usuario, indicativo o localidad y envíales un mensaje.",
                    accion = "Buscar usuarios",
                    alPulsar = alBuscarUsuarios,
                )
                else -> LazyColumn(contentPadding = PaddingValues(vertical = 8.dp)) {
                    items(estado.conversaciones, key = { it.id }) { u ->
                        ListItem(
                            modifier = Modifier
                                .clickable { alAbrirChat(u.id, u.username) }
                                .padding(horizontal = 8.dp),
                            leadingContent = { Avatar(u.photo, admin = u.isAdmin, tamano = 52.dp) },
                            headlineContent = {
                                Row(verticalAlignment = Alignment.CenterVertically) {
                                    Text(u.username, style = MaterialTheme.typography.titleMedium, modifier = Modifier.weight(1f))
                                    Text(u.horaUltimoMensaje.orEmpty(), style = MaterialTheme.typography.labelSmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
                                }
                            },
                            supportingContent = {
                                Column {
                                    u.indicativo?.takeIf { it.isNotBlank() }?.let { Text(it, style = MaterialTheme.typography.labelMedium, color = MaterialTheme.colorScheme.primary) }
                                    Text(u.ultimoMensaje.orEmpty(), maxLines = 1, overflow = TextOverflow.Ellipsis)
                                }
                            },
                            trailingContent = {
                                IconButton(onClick = { borrando = u }) { Icon(Icons.Filled.Delete, "Borrar conversación") }
                            },
                            colors = ListItemDefaults.colors(containerColor = MaterialTheme.colorScheme.surface),
                        )
                    }
                }
            }
        }
    }

    borrando?.let { u ->
        DialogoConfirmar(
            titulo = "Borrar conversación",
            texto = "Se eliminarán todos los mensajes con ${u.username}.",
            alConfirmar = { vm.borrar(u.id); borrando = null },
            alCancelar = { borrando = null },
        )
    }
}

// ------------------------------------------------------------------
// Chat
// ------------------------------------------------------------------

data class ChatEstado(
    val cargando: Boolean = true,
    val otro: Usuario? = null,
    /** Del más reciente al más antiguo (la lista se pinta invertida). */
    val mensajes: List<Mensaje> = emptyList(),
    val error: String? = null,
)

@Serializable
private data class EventoMensaje(val mensaje: Mensaje)

class ChatViewModel(
    private val repo: SocialRepositorio,
    tiempoReal: TiempoReal,
    private val json: Json,
    private val yo: Int,
    private val otroId: Int,
) : ViewModel() {

    private val _estado = MutableStateFlow(ChatEstado())
    val estado = _estado.asStateFlow()
    private var idTemporal = -1

    init {
        viewModelScope.launch {
            (repo.usuario(otroId) as? Resultado.Ok)?.let { r -> _estado.update { it.copy(otro = r.datos) } }
        }
        cargar()
        viewModelScope.launch {
            tiempoReal.eventos(tiempoReal.canalMensajes(yo, otroId), "NuevoMensaje").collect { evento ->
                val mensaje = runCatching { json.decodeFromString<EventoMensaje>(evento.datos).mensaje }.getOrNull() ?: return@collect
                // Los propios ya están en la lista (envío optimista).
                if (mensaje.remitenteId == yo) return@collect
                _estado.update { e -> if (e.mensajes.any { it.id == mensaje.id }) e else e.copy(mensajes = listOf(mensaje) + e.mensajes) }
            }
        }
    }

    fun cargar() {
        viewModelScope.launch {
            when (val r = repo.conversacion(otroId)) {
                is Resultado.Ok -> _estado.update { it.copy(cargando = false, mensajes = r.datos) }
                is Resultado.Error -> _estado.update { it.copy(cargando = false, error = r.mensaje) }
            }
        }
    }

    /** Envío optimista con rollback si falla, como useConversacion.js. */
    fun enviar(texto: String) {
        val limpio = texto.trim()
        if (limpio.isEmpty()) return
        val temporal = Mensaje(idTemporal--, yo, otroId, limpio, OffsetDateTime.now().toString())
        _estado.update { it.copy(mensajes = listOf(temporal) + it.mensajes) }
        viewModelScope.launch {
            when (val r = repo.enviar(otroId, limpio)) {
                is Resultado.Ok -> _estado.update { e -> e.copy(mensajes = e.mensajes.map { if (it.id == temporal.id) r.datos else it }) }
                is Resultado.Error -> _estado.update { e -> e.copy(mensajes = e.mensajes.filterNot { it.id == temporal.id }, error = r.mensaje) }
            }
        }
    }

    fun descartarError() = _estado.update { it.copy(error = null) }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ChatPantalla(usuarioId: Int, username: String, alVolver: () -> Unit) {
    val yo = contenedor().sesion.usuario.collectAsStateWithLifecycle().value?.id ?: return
    val vm = appViewModel(clave = "chat-$usuarioId") { ChatViewModel(it.socialRepositorio, it.tiempoReal, it.json, yo, usuarioId) }
    val estado by vm.estado.collectAsStateWithLifecycle()
    val snackbar = remember { SnackbarHostState() }
    var texto by rememberSaveable { mutableStateOf("") }
    val lista = rememberLazyListState()

    LaunchedEffect(estado.mensajes.firstOrNull()?.id) { lista.animateScrollToItem(0) }
    LaunchedEffect(estado.error) { estado.error?.let { snackbar.showSnackbar(it); vm.descartarError() } }

    Scaffold(
        topBar = {
            TopAppBar(
                navigationIcon = { IconButton(onClick = alVolver) { Icon(Icons.AutoMirrored.Filled.ArrowBack, "Volver") } },
                title = {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Avatar(estado.otro?.photo, tamano = 36.dp, admin = estado.otro?.isAdmin == true)
                        Spacer(Modifier.width(10.dp))
                        Column {
                            Text(estado.otro?.username ?: username, style = MaterialTheme.typography.titleMedium)
                            estado.otro?.indicativo?.takeIf { it.isNotBlank() }?.let {
                                Text(it, style = MaterialTheme.typography.labelSmall, color = MaterialTheme.colorScheme.primary)
                            }
                        }
                    }
                },
            )
        },
        snackbarHost = { SnackbarHost(snackbar) },
        bottomBar = {
            Surface(tonalElevation = 3.dp) {
                Row(
                    Modifier
                        .navigationBarsPadding()
                        .imePadding()
                        .padding(horizontal = 12.dp, vertical = 8.dp),
                    verticalAlignment = Alignment.CenterVertically,
                ) {
                    OutlinedTextField(
                        value = texto,
                        onValueChange = { if (it.length <= 2000) texto = it },
                        placeholder = { Text("Mensaje") },
                        modifier = Modifier.weight(1f),
                        maxLines = 5,
                        shape = RoundedCornerShape(24.dp),
                    )
                    Spacer(Modifier.width(8.dp))
                    FilledIconButton(onClick = { vm.enviar(texto); texto = "" }, enabled = texto.isNotBlank()) {
                        Icon(Icons.AutoMirrored.Filled.Send, "Enviar")
                    }
                }
            }
        },
    ) { padding ->
        when {
            estado.cargando -> Cargando(Modifier.padding(padding))
            estado.mensajes.isEmpty() -> EstadoVacio(Icons.Filled.Chat, "Empieza la conversación", "Envía el primer mensaje a ${estado.otro?.username ?: username}.", Modifier.padding(padding))
            else -> LazyColumn(
                state = lista,
                reverseLayout = true,
                contentPadding = PaddingValues(12.dp),
                verticalArrangement = Arrangement.spacedBy(6.dp),
                modifier = Modifier
                    .padding(padding)
                    .fillMaxSize(),
            ) {
                items(estado.mensajes, key = { it.id }) { m -> Burbuja(m, propio = m.remitenteId == yo, pendiente = m.id < 0) }
            }
        }
    }
}

@Composable
private fun Burbuja(m: Mensaje, propio: Boolean, pendiente: Boolean) {
    Row(Modifier.fillMaxWidth(), horizontalArrangement = if (propio) Arrangement.End else Arrangement.Start) {
        Card(
            shape = RoundedCornerShape(
                topStart = 18.dp, topEnd = 18.dp,
                bottomStart = if (propio) 18.dp else 4.dp,
                bottomEnd = if (propio) 4.dp else 18.dp,
            ),
            colors = CardDefaults.cardColors(
                containerColor = if (propio) MaterialTheme.colorScheme.primaryContainer else MaterialTheme.colorScheme.surfaceContainerHigh,
            ),
            modifier = Modifier.widthIn(max = 300.dp),
        ) {
            Column(Modifier.padding(horizontal = 14.dp, vertical = 8.dp)) {
                Text(m.mensaje, style = MaterialTheme.typography.bodyLarge)
                Text(
                    if (pendiente) "Enviando…" else Formatos.fechaHoraCorta(m.creadoEn),
                    style = MaterialTheme.typography.labelSmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                    modifier = Modifier.align(Alignment.End),
                )
            }
        }
    }
}

// ------------------------------------------------------------------
// Búsqueda de usuarios
// ------------------------------------------------------------------

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun BuscarUsuariosPantalla(alAbrirChat: (Int, String) -> Unit, alVolver: () -> Unit) {
    val repo = contenedor().socialRepositorio
    val scope = rememberCoroutineScope()
    var usuario by rememberSaveable { mutableStateOf("") }
    var indicativo by rememberSaveable { mutableStateOf("") }
    var localidad by rememberSaveable { mutableStateOf("") }
    var provincia by rememberSaveable { mutableStateOf("") }
    var resultados by remember { mutableStateOf<List<Usuario>?>(null) }
    var buscando by remember { mutableStateOf(false) }
    var error by remember { mutableStateOf<String?>(null) }

    fun buscar() {
        buscando = true
        scope.launch {
            when (val r = repo.buscarUsuarios(
                BusquedaUsuariosPeticion(
                    usuario.trim().ifBlank { null },
                    indicativo.trim().ifBlank { null },
                    localidad.trim().ifBlank { null },
                    provincia.trim().ifBlank { null },
                ),
            )) {
                is Resultado.Ok -> { resultados = r.datos; error = null }
                is Resultado.Error -> error = r.mensaje
            }
            buscando = false
        }
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Buscar usuarios") },
                navigationIcon = { IconButton(onClick = alVolver) { Icon(Icons.AutoMirrored.Filled.ArrowBack, "Volver") } },
            )
        },
    ) { padding ->
        LazyColumn(
            Modifier
                .padding(padding)
                .fillMaxSize(),
            contentPadding = PaddingValues(16.dp),
            verticalArrangement = Arrangement.spacedBy(8.dp),
        ) {
            item {
                Column(verticalArrangement = Arrangement.spacedBy(4.dp)) {
                    Campo(usuario, { usuario = it }, "Usuario")
                    Campo(indicativo, { indicativo = it }, "Indicativo")
                    Row(horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                        Campo(localidad, { localidad = it }, "Localidad", modifier = Modifier.weight(1f))
                        Campo(provincia, { provincia = it }, "Provincia", modifier = Modifier.weight(1f))
                    }
                    BotonPrincipal("Buscar", buscando, ::buscar, icono = Icons.Filled.Search)
                    error?.let { Text(it, color = MaterialTheme.colorScheme.error) }
                }
            }
            resultados?.let { lista ->
                if (lista.isEmpty()) {
                    item { Text("No se han encontrado usuarios.", color = MaterialTheme.colorScheme.onSurfaceVariant, modifier = Modifier.padding(16.dp)) }
                }
                items(lista, key = { it.id }) { u ->
                    Card(onClick = { alAbrirChat(u.id, u.username) }, colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceContainer)) {
                        ListItem(
                            leadingContent = { Avatar(u.photo, admin = u.isAdmin) },
                            headlineContent = { Text(u.username) },
                            supportingContent = { u.indicativo?.takeIf { it.isNotBlank() }?.let { Text(it) } },
                            trailingContent = { Icon(Icons.Filled.Chat, "Enviar mensaje") },
                            colors = ListItemDefaults.colors(containerColor = androidx.compose.ui.graphics.Color.Transparent),
                        )
                    }
                }
            }
        }
    }
}
