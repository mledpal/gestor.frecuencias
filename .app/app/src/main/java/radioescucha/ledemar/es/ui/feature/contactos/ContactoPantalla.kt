package radioescucha.ledemar.es.ui.feature.contactos

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.imePadding
import androidx.compose.foundation.layout.navigationBarsPadding
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.AddCircle
import androidx.compose.material.icons.filled.Delete
import androidx.compose.material.icons.filled.Save
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.PrimaryTabRow
import androidx.compose.material3.Scaffold
import androidx.compose.material3.SnackbarHost
import androidx.compose.material3.SnackbarHostState
import androidx.compose.material3.Surface
import androidx.compose.material3.Tab
import androidx.compose.material3.Text
import androidx.compose.material3.TopAppBar
import androidx.compose.material3.TopAppBarDefaults
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import androidx.lifecycle.ViewModel
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.lifecycle.viewModelScope
import kotlinx.coroutines.channels.Channel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.receiveAsFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import radioescucha.ledemar.es.core.network.Contacto
import radioescucha.ledemar.es.core.network.Resultado
import radioescucha.ledemar.es.core.network.Selects
import radioescucha.ledemar.es.data.ContactosRepositorio
import radioescucha.ledemar.es.ui.appViewModel
import radioescucha.ledemar.es.ui.components.Avatar
import radioescucha.ledemar.es.ui.components.BotonPrincipal
import radioescucha.ledemar.es.ui.components.Cargando
import radioescucha.ledemar.es.ui.components.DialogoConfirmar
import radioescucha.ledemar.es.ui.components.EstadoVacio
import radioescucha.ledemar.es.ui.components.PantallaLcd
import radioescucha.ledemar.es.ui.feature.comentarios.ComentariosSeccion

data class ContactoEstado(
    val cargando: Boolean = true,
    val contacto: Contacto? = null,
    val formulario: FormularioContacto = FormularioContacto(),
    val errores: Map<String, String> = emptyMap(),
    val guardando: Boolean = false,
    val selects: Selects? = null,
    val error: String? = null,
)

sealed interface EventoContacto {
    data class Mensaje(val texto: String) : EventoContacto
    data object Cerrar : EventoContacto
}

/**
 * Crear (`id == null`), ver o editar un contacto. Si el contacto es de otro
 * usuario se muestra en solo lectura con la opción "Agregar a mis contactos".
 */
class ContactoViewModel(
    private val repo: ContactosRepositorio,
    private val id: Int?,
    private val usuarioId: Int?,
) : ViewModel() {

    private val _estado = MutableStateFlow(ContactoEstado(cargando = id != null))
    val estado = _estado.asStateFlow()

    private val _eventos = Channel<EventoContacto>(Channel.BUFFERED)
    val eventos = _eventos.receiveAsFlow()

    val esNuevo get() = id == null
    val esPropio get() = _estado.value.contacto?.let { it.userId == usuarioId } ?: true

    init {
        viewModelScope.launch {
            repo.selects.collect { s -> _estado.update { it.copy(selects = s) } }
        }
        viewModelScope.launch {
            repo.cargarSelects()
            if (id == null) {
                val tipoPorDefecto = repo.selects.value?.tiposContacto?.firstOrNull()?.id
                _estado.update { it.copy(formulario = it.formulario.copy(tipoId = tipoPorDefecto)) }
            } else {
                cargar(id)
            }
        }
    }

    private suspend fun cargar(id: Int) {
        // Primero la copia en memoria (lista propia o búsqueda) y luego la del servidor.
        (repo.contactos.value + repo.busqueda.value.orEmpty()).firstOrNull { it.id == id }?.let { c ->
            _estado.update { it.copy(cargando = false, contacto = c, formulario = FormularioContacto.desde(c)) }
        }
        when (val r = repo.obtener(id)) {
            is Resultado.Ok -> _estado.update { it.copy(cargando = false, contacto = r.datos, formulario = FormularioContacto.desde(r.datos)) }
            is Resultado.Error -> _estado.update { it.copy(cargando = false, error = if (it.contacto == null) r.mensaje else null) }
        }
    }

    fun cambiar(formulario: FormularioContacto) {
        _estado.update { it.copy(formulario = formulario, errores = it.errores - cambiados(it.formulario, formulario)) }
    }

    private fun cambiados(antes: FormularioContacto, despues: FormularioContacto): Set<String> = buildSet {
        if (antes.nombre != despues.nombre) add("nombre")
        if (antes.frecuencia != despues.frecuencia) add("frecuencia")
        if (antes.tipoId != despues.tipoId) add("tipo_id")
        if (antes.gps != despues.gps) add("gps")
        if (antes.hora != despues.hora) add("hora")
        if (antes.direccion != despues.direccion || antes.offset != despues.offset) add("direccion")
    }

    fun ponerGps(gps: String) = cambiar(_estado.value.formulario.copy(gps = gps))

    /** Guarda: crea si es nuevo o ajeno ("Agregar a mis contactos"), actualiza si es propio. */
    fun guardar() {
        val actual = _estado.value
        val formulario = if (!esPropio) FormularioContacto.copiaDe(actual.contacto!!) else actual.formulario
        val errores = formulario.validar()
        if (errores.isNotEmpty()) {
            _estado.update { it.copy(errores = errores) }
            viewModelScope.launch { _eventos.send(EventoContacto.Mensaje("Revisa los campos marcados")) }
            return
        }

        _estado.update { it.copy(guardando = true) }
        viewModelScope.launch {
            val r = if (id == null || !esPropio) repo.crear(formulario.aPeticion()) else repo.actualizar(id, formulario.aPeticion())
            _estado.update { it.copy(guardando = false) }
            when (r) {
                is Resultado.Ok -> {
                    _eventos.send(
                        EventoContacto.Mensaje(
                            when {
                                id == null -> "Contacto creado"
                                !esPropio -> "Contacto agregado a tu lista"
                                else -> "Contacto actualizado"
                            },
                        ),
                    )
                    if (id == null || !esPropio) _eventos.send(EventoContacto.Cerrar) else _estado.update { it.copy(contacto = r.datos) }
                }
                is Resultado.Error -> {
                    _estado.update { it.copy(errores = r.campos) }
                    _eventos.send(EventoContacto.Mensaje(r.mensaje))
                }
            }
        }
    }

    fun eliminar() {
        val id = id ?: return
        viewModelScope.launch {
            when (val r = repo.eliminar(id)) {
                is Resultado.Ok -> {
                    _eventos.send(EventoContacto.Mensaje("Contacto eliminado"))
                    _eventos.send(EventoContacto.Cerrar)
                }
                is Resultado.Error -> _eventos.send(EventoContacto.Mensaje(r.mensaje))
            }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ContactoPantalla(
    id: Int?,
    gpsElegido: String?,
    alConsumirGps: () -> Unit,
    alAbrirMapa: (gps: String?, editable: Boolean) -> Unit,
    alAbrirChat: (Int, String) -> Unit,
    alVolver: (String?) -> Unit,
) {
    val container = radioescucha.ledemar.es.ui.contenedor()
    val usuario by container.sesion.usuario.collectAsStateWithLifecycle()
    val vm = appViewModel(clave = "contacto-$id") { ContactoViewModel(it.contactosRepositorio, id, it.sesion.usuario.value?.id) }
    val estado by vm.estado.collectAsStateWithLifecycle()
    val snackbar = remember { SnackbarHostState() }
    var confirmarBorrado by remember { mutableStateOf(false) }
    var pestana by rememberSaveable { mutableIntStateOf(0) }

    LaunchedEffect(gpsElegido) {
        gpsElegido?.let {
            vm.ponerGps(it)
            alConsumirGps()
        }
    }

    val scope = rememberCoroutineScope()
    LaunchedEffect(Unit) {
        // El último mensaje se pasa a la pantalla anterior al cerrar.
        var ultimo: String? = null
        vm.eventos.collect { e ->
            when (e) {
                is EventoContacto.Mensaje -> {
                    ultimo = e.texto
                    scope.launch { snackbar.showSnackbar(e.texto) }
                }
                EventoContacto.Cerrar -> alVolver(ultimo)
            }
        }
    }

    val contacto = estado.contacto
    val propio = vm.esPropio
    val editable = propio
    val color = colorTipo(contacto?.tipo?.color ?: estado.selects?.tiposContacto?.firstOrNull { it.id == estado.formulario.tipoId }?.color)
    val puedeBorrar = contacto != null && (propio || usuario?.isAdmin == true)

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text(if (vm.esNuevo) "Nuevo contacto" else if (propio) "Editar contacto" else "Contacto") },
                navigationIcon = { IconButton(onClick = { alVolver(null) }) { Icon(Icons.AutoMirrored.Filled.ArrowBack, "Volver") } },
                actions = {
                    if (puedeBorrar) IconButton(onClick = { confirmarBorrado = true }) { Icon(Icons.Filled.Delete, "Eliminar") }
                },
                colors = TopAppBarDefaults.topAppBarColors(containerColor = Color.Transparent),
            )
        },
        snackbarHost = { SnackbarHost(snackbar) },
        bottomBar = {
            if (!estado.cargando && (contacto != null || vm.esNuevo) && pestana == 0) {
                Surface(tonalElevation = 3.dp) {
                    Box(
                        Modifier
                            .navigationBarsPadding()
                            .imePadding()
                            .padding(16.dp),
                    ) {
                        if (propio) {
                            BotonPrincipal(if (vm.esNuevo) "Crear contacto" else "Guardar cambios", estado.guardando, vm::guardar, icono = Icons.Filled.Save)
                        } else {
                            BotonPrincipal("Agregar a mis contactos", estado.guardando, vm::guardar, icono = Icons.Filled.AddCircle)
                        }
                    }
                }
            }
        },
    ) { padding ->
        when {
            estado.cargando -> Cargando(Modifier.padding(padding))
            estado.error != null -> EstadoVacio(Icons.Filled.Delete, "No disponible", estado.error!!, Modifier.padding(padding))
            else -> Column(
                Modifier
                    .padding(padding)
                    .fillMaxSize(),
            ) {
                // Cabecera con el color del tipo, como el degradado de EditarContacto.jsx
                Box(
                    Modifier
                        .fillMaxWidth()
                        .background(Brush.verticalGradient(listOf(color.copy(alpha = 0.35f), Color.Transparent)))
                        .padding(horizontal = 16.dp, vertical = 8.dp),
                ) {
                    Column {
                        PantallaLcd(
                            frecuencia = estado.formulario.frecuencia.ifBlank { null },
                            etiqueta = (contacto?.modo?.nombre ?: "VFO").uppercase(),
                            subtitulo = estado.formulario.nombre.ifBlank { "Sin nombre" },
                            modifier = Modifier.fillMaxWidth(),
                        )
                        contacto?.usuario?.takeIf { !propio }?.let { dueno ->
                            Row(Modifier.padding(top = 10.dp), verticalAlignment = Alignment.CenterVertically) {
                                Avatar(dueno.photo, tamano = 32.dp, admin = dueno.isAdmin)
                                Spacer(Modifier.width(8.dp))
                                Column(Modifier.weight(1f)) {
                                    Text("Registrado por", style = MaterialTheme.typography.labelSmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
                                    Text(dueno.username, style = MaterialTheme.typography.titleSmall)
                                }
                                androidx.compose.material3.TextButton(onClick = { alAbrirChat(dueno.id, dueno.username) }) { Text("Enviar mensaje") }
                            }
                        }
                    }
                }

                if (contacto != null) {
                    PrimaryTabRow(selectedTabIndex = pestana, containerColor = Color.Transparent) {
                        Tab(pestana == 0, onClick = { pestana = 0 }, text = { Text("Datos") })
                        Tab(pestana == 1, onClick = { pestana = 1 }, text = { Text("Comentarios") })
                    }
                }

                if (pestana == 0 || contacto == null) {
                    FormularioContactoUi(
                        formulario = estado.formulario,
                        selects = estado.selects,
                        errores = estado.errores,
                        editable = editable,
                        alCambiar = vm::cambiar,
                        alAbrirMapa = { gps -> alAbrirMapa(gps, editable) },
                        modifier = Modifier
                            .verticalScroll(rememberScrollState())
                            .padding(16.dp),
                    )
                } else {
                    val frecuenciaId = contacto.frecuenciaId
                    if (frecuenciaId != null) {
                        ComentariosSeccion(frecuenciaId, contacto.localizacion?.id, Modifier.fillMaxSize())
                    }
                }
            }
        }
    }

    if (confirmarBorrado) {
        DialogoConfirmar(
            titulo = "Eliminar contacto",
            texto = "¿Seguro que quieres eliminar \"${contacto?.nombre}\"? Esta acción no se puede deshacer.",
            alConfirmar = {
                confirmarBorrado = false
                vm.eliminar()
            },
            alCancelar = { confirmarBorrado = false },
        )
    }
}
