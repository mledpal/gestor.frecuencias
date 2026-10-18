package radioescucha.ledemar.es.ui.feature.admin

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.aspectRatio
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.automirrored.filled.KeyboardArrowRight
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.AdminPanelSettings
import androidx.compose.material.icons.filled.Category
import androidx.compose.material.icons.filled.Check
import androidx.compose.material.icons.filled.Delete
import androidx.compose.material.icons.filled.Edit
import androidx.compose.material.icons.filled.GraphicEq
import androidx.compose.material.icons.filled.Group
import androidx.compose.material.icons.filled.Map
import androidx.compose.material.icons.filled.RemoveModerator
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.FloatingActionButton
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.ListItem
import androidx.compose.material3.ListItemDefaults
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.PrimaryTabRow
import androidx.compose.material3.Scaffold
import androidx.compose.material3.SnackbarHost
import androidx.compose.material3.SnackbarHostState
import androidx.compose.material3.Tab
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.material3.TopAppBar
import androidx.compose.material3.pulltorefresh.PullToRefreshBox
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.unit.dp
import androidx.lifecycle.ViewModel
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.lifecycle.viewModelScope
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import radioescucha.ledemar.es.core.network.Resultado
import radioescucha.ledemar.es.core.network.TipoCodificacion
import radioescucha.ledemar.es.core.network.TipoContacto
import radioescucha.ledemar.es.core.network.Usuario
import radioescucha.ledemar.es.core.util.ColoresTailwind
import radioescucha.ledemar.es.data.AdminRepositorio
import radioescucha.ledemar.es.data.ContactosRepositorio
import radioescucha.ledemar.es.ui.appViewModel
import radioescucha.ledemar.es.ui.components.Avatar
import radioescucha.ledemar.es.ui.components.Campo
import radioescucha.ledemar.es.ui.components.Cargando
import radioescucha.ledemar.es.ui.components.DialogoConfirmar
import radioescucha.ledemar.es.ui.components.EstadoVacio
import radioescucha.ledemar.es.ui.components.Etiqueta
import radioescucha.ledemar.es.ui.contenedor
import radioescucha.ledemar.es.ui.theme.Paleta

// ------------------------------------------------------------------
// Portada del panel
// ------------------------------------------------------------------

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun AdminPantalla(alUsuarios: () -> Unit, alTiposContacto: () -> Unit, alTiposCodificacion: () -> Unit) {
    Scaffold(topBar = { TopAppBar(title = { Text("Administración") }) }) { padding ->
        Column(
            Modifier
                .padding(padding)
                .verticalScroll(rememberScrollState())
                .padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp),
        ) {
            TarjetaAdmin(Icons.Filled.Group, "Usuarios", "Promover o degradar administradores, eliminar cuentas y ver sus frecuencias en el mapa.", alUsuarios)
            TarjetaAdmin(Icons.Filled.Category, "Tipos de contacto", "Categorías de los contactos y su color.", alTiposContacto)
            TarjetaAdmin(Icons.Filled.GraphicEq, "Tipos de codificación", "Catálogo de codificaciones (DMR, analógico…).", alTiposCodificacion)
        }
    }
}

@Composable
private fun TarjetaAdmin(icono: ImageVector, titulo: String, texto: String, alPulsar: () -> Unit) {
    Card(onClick = alPulsar, colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceContainer)) {
        ListItem(
            leadingContent = {
                Box(
                    Modifier
                        .size(48.dp)
                        .clip(RoundedCornerShape(14.dp))
                        .background(MaterialTheme.colorScheme.primaryContainer),
                    contentAlignment = Alignment.Center,
                ) { Icon(icono, null, tint = MaterialTheme.colorScheme.onPrimaryContainer) }
            },
            headlineContent = { Text(titulo, style = MaterialTheme.typography.titleMedium) },
            supportingContent = { Text(texto) },
            trailingContent = { Icon(Icons.AutoMirrored.Filled.KeyboardArrowRight, null) },
            colors = ListItemDefaults.colors(containerColor = androidx.compose.ui.graphics.Color.Transparent),
        )
    }
}

// ------------------------------------------------------------------
// Usuarios
// ------------------------------------------------------------------

data class UsuariosEstado(val cargando: Boolean = true, val usuarios: List<Usuario> = emptyList(), val mensaje: String? = null)

class AdminUsuariosViewModel(private val repo: AdminRepositorio) : ViewModel() {
    private val _estado = MutableStateFlow(UsuariosEstado())
    val estado = _estado.asStateFlow()

    init { cargar() }

    fun cargar() {
        viewModelScope.launch {
            _estado.update { it.copy(cargando = true) }
            when (val r = repo.usuarios()) {
                is Resultado.Ok -> _estado.update { it.copy(cargando = false, usuarios = r.datos) }
                is Resultado.Error -> _estado.update { it.copy(cargando = false, mensaje = r.mensaje) }
            }
        }
    }

    fun cambiarRol(u: Usuario) {
        viewModelScope.launch {
            when (val r = repo.cambiarRol(u.id)) {
                is Resultado.Ok -> _estado.update { e ->
                    e.copy(
                        usuarios = e.usuarios.map { if (it.id == u.id) it.copy(isAdmin = r.datos.isAdmin) else it },
                        mensaje = if (r.datos.isAdmin) "${u.username} ahora es administrador" else "${u.username} ya no es administrador",
                    )
                }
                is Resultado.Error -> _estado.update { it.copy(mensaje = r.mensaje) }
            }
        }
    }

    fun eliminar(u: Usuario) {
        viewModelScope.launch {
            when (val r = repo.eliminarUsuario(u.id)) {
                is Resultado.Ok -> _estado.update { e -> e.copy(usuarios = e.usuarios.filterNot { it.id == u.id }, mensaje = "Usuario eliminado") }
                is Resultado.Error -> _estado.update { it.copy(mensaje = r.mensaje) }
            }
        }
    }

    fun descartarMensaje() = _estado.update { it.copy(mensaje = null) }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun AdminUsuariosPantalla(alVerMapa: (Int, String) -> Unit, alVolver: () -> Unit) {
    val vm = appViewModel { AdminUsuariosViewModel(it.adminRepositorio) }
    val estado by vm.estado.collectAsStateWithLifecycle()
    val yo by contenedor().sesion.usuario.collectAsStateWithLifecycle()
    val snackbar = remember { SnackbarHostState() }
    var pestana by rememberSaveable { mutableIntStateOf(0) }
    var eliminando by remember { mutableStateOf<Usuario?>(null) }

    LaunchedEffect(estado.mensaje) { estado.mensaje?.let { snackbar.showSnackbar(it); vm.descartarMensaje() } }

    // Como Users.jsx: se ocultan el usuario actual y el root.
    val visibles = estado.usuarios.filter { it.id != yo?.id && !it.isRoot }
    val admins = visibles.filter { it.isAdmin }
    val normales = visibles.filterNot { it.isAdmin }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Usuarios") },
                navigationIcon = { IconButton(onClick = alVolver) { Icon(Icons.AutoMirrored.Filled.ArrowBack, "Volver") } },
            )
        },
        snackbarHost = { SnackbarHost(snackbar) },
    ) { padding ->
        Column(Modifier.padding(padding)) {
            PrimaryTabRow(selectedTabIndex = pestana) {
                Tab(pestana == 0, { pestana = 0 }, text = { Text("Administradores (${admins.size})") })
                Tab(pestana == 1, { pestana = 1 }, text = { Text("Usuarios (${normales.size})") })
            }
            PullToRefreshBox(isRefreshing = estado.cargando && visibles.isNotEmpty(), onRefresh = vm::cargar, modifier = Modifier.fillMaxSize()) {
                val lista = if (pestana == 0) admins else normales
                when {
                    estado.cargando && visibles.isEmpty() -> Cargando()
                    lista.isEmpty() -> EstadoVacio(Icons.Filled.Group, "Nadie por aquí", "No hay usuarios en esta categoría.")
                    else -> LazyColumn(contentPadding = PaddingValues(16.dp), verticalArrangement = Arrangement.spacedBy(10.dp)) {
                        items(lista, key = { it.id }) { u ->
                            TarjetaUsuario(u, alCambiarRol = { vm.cambiarRol(u) }, alEliminar = { eliminando = u }, alVerMapa = { alVerMapa(u.id, u.username) })
                        }
                    }
                }
            }
        }
    }

    eliminando?.let { u ->
        DialogoConfirmar(
            titulo = "Eliminar usuario",
            texto = "Se eliminará la cuenta de ${u.username} y todos sus contactos.",
            alConfirmar = { vm.eliminar(u); eliminando = null },
            alCancelar = { eliminando = null },
        )
    }
}

@Composable
private fun TarjetaUsuario(u: Usuario, alCambiarRol: () -> Unit, alEliminar: () -> Unit, alVerMapa: () -> Unit) {
    Card(colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceContainer)) {
        Column(Modifier.padding(14.dp)) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Avatar(u.photo, tamano = 52.dp, admin = u.isAdmin)
                Spacer(Modifier.width(12.dp))
                Column(Modifier.weight(1f)) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Text(u.username, style = MaterialTheme.typography.titleMedium)
                        if (u.isAdmin) {
                            Spacer(Modifier.width(6.dp))
                            Etiqueta("Admin", Paleta.Ambar)
                        }
                    }
                    Text(listOfNotNull(u.nombre, u.apellidos).joinToString(" "), style = MaterialTheme.typography.bodyMedium)
                    Text(u.email.orEmpty(), style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
                }
            }
            val lugar = listOfNotNull(u.localizacion?.localidad, u.localizacion?.provincia).filter { it.isNotBlank() }.joinToString(", ")
            Spacer(Modifier.height(8.dp))
            if (lugar.isNotBlank()) Detalle("Localización", lugar)
            u.ip?.let { Detalle("IP", it) }
            u.ultimaConexion?.let { Detalle("Última conexión", it.replace('T', ' ').take(16)) }
            Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.End) {
                if (u.frecuenciasLocalizadas > 0) {
                    TextButton(onClick = alVerMapa) {
                        Icon(Icons.Filled.Map, null)
                        Text(" Mapa (${u.frecuenciasLocalizadas})")
                    }
                }
                TextButton(onClick = alCambiarRol) {
                    Icon(if (u.isAdmin) Icons.Filled.RemoveModerator else Icons.Filled.AdminPanelSettings, null)
                    Text(if (u.isAdmin) " Quitar admin" else " Hacer admin")
                }
                IconButton(onClick = alEliminar) { Icon(Icons.Filled.Delete, "Eliminar", tint = MaterialTheme.colorScheme.error) }
            }
        }
    }
}

@Composable
private fun Detalle(etiqueta: String, valor: String) {
    Row {
        Text("$etiqueta: ", style = MaterialTheme.typography.labelMedium, color = MaterialTheme.colorScheme.onSurfaceVariant)
        Text(valor, style = MaterialTheme.typography.labelMedium)
    }
}

// ------------------------------------------------------------------
// Catálogos (tipos de contacto y de codificación)
// ------------------------------------------------------------------

data class CatalogoEstado<T>(val cargando: Boolean = true, val elementos: List<T> = emptyList(), val mensaje: String? = null)

class TiposContactoViewModel(private val repo: AdminRepositorio, private val contactos: ContactosRepositorio) : ViewModel() {
    private val _estado = MutableStateFlow(CatalogoEstado<TipoContacto>())
    val estado = _estado.asStateFlow()

    init { cargar() }

    fun cargar() = viewModelScope.launch {
        when (val r = repo.tiposContacto()) {
            is Resultado.Ok -> _estado.update { it.copy(cargando = false, elementos = r.datos) }
            is Resultado.Error -> _estado.update { it.copy(cargando = false, mensaje = r.mensaje) }
        }
    }

    fun guardar(id: Int?, nombre: String, color: String) = viewModelScope.launch {
        when (val r = repo.guardarTipoContacto(id, nombre, color)) {
            is Resultado.Ok -> { cargar(); contactos.cargarSelects(forzar = true); _estado.update { it.copy(mensaje = "Tipo guardado") } }
            is Resultado.Error -> _estado.update { it.copy(mensaje = r.mensaje) }
        }
    }

    fun eliminar(id: Int) = viewModelScope.launch {
        when (val r = repo.eliminarTipoContacto(id)) {
            is Resultado.Ok -> { cargar(); contactos.cargarSelects(forzar = true); _estado.update { it.copy(mensaje = "Tipo eliminado") } }
            is Resultado.Error -> _estado.update { it.copy(mensaje = r.mensaje) }
        }
    }

    fun descartarMensaje() = _estado.update { it.copy(mensaje = null) }
}

class TiposCodificacionViewModel(private val repo: AdminRepositorio, private val contactos: ContactosRepositorio) : ViewModel() {
    private val _estado = MutableStateFlow(CatalogoEstado<TipoCodificacion>())
    val estado = _estado.asStateFlow()

    init { cargar() }

    fun cargar() = viewModelScope.launch {
        when (val r = repo.tiposCodificacion()) {
            is Resultado.Ok -> _estado.update { it.copy(cargando = false, elementos = r.datos) }
            is Resultado.Error -> _estado.update { it.copy(cargando = false, mensaje = r.mensaje) }
        }
    }

    fun guardar(id: Int?, nombre: String) = viewModelScope.launch {
        when (val r = repo.guardarTipoCodificacion(id, nombre)) {
            is Resultado.Ok -> { cargar(); contactos.cargarSelects(forzar = true); _estado.update { it.copy(mensaje = "Codificación guardada") } }
            is Resultado.Error -> _estado.update { it.copy(mensaje = r.mensaje) }
        }
    }

    fun eliminar(id: Int) = viewModelScope.launch {
        when (val r = repo.eliminarTipoCodificacion(id)) {
            is Resultado.Ok -> { cargar(); contactos.cargarSelects(forzar = true); _estado.update { it.copy(mensaje = "Codificación eliminada") } }
            is Resultado.Error -> _estado.update { it.copy(mensaje = r.mensaje) }
        }
    }

    fun descartarMensaje() = _estado.update { it.copy(mensaje = null) }
}

/** Esqueleto común de las pantallas de catálogo: lista + FAB + diálogo de edición. */
@OptIn(ExperimentalMaterial3Api::class)
@Composable
private fun <T> PantallaCatalogo(
    titulo: String,
    estado: CatalogoEstado<T>,
    clave: (T) -> Int,
    alVolver: () -> Unit,
    alNuevo: () -> Unit,
    alDescartarMensaje: () -> Unit,
    fila: @Composable (T) -> Unit,
) {
    val snackbar = remember { SnackbarHostState() }
    LaunchedEffect(estado.mensaje) { estado.mensaje?.let { snackbar.showSnackbar(it); alDescartarMensaje() } }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text(titulo) },
                navigationIcon = { IconButton(onClick = alVolver) { Icon(Icons.AutoMirrored.Filled.ArrowBack, "Volver") } },
            )
        },
        floatingActionButton = { FloatingActionButton(onClick = alNuevo) { Icon(Icons.Filled.Add, "Añadir") } },
        snackbarHost = { SnackbarHost(snackbar) },
    ) { padding ->
        when {
            estado.cargando -> Cargando(Modifier.padding(padding))
            else -> LazyColumn(
                Modifier.padding(padding),
                contentPadding = PaddingValues(start = 16.dp, end = 16.dp, top = 8.dp, bottom = 96.dp),
                verticalArrangement = Arrangement.spacedBy(8.dp),
            ) {
                items(estado.elementos, key = clave) { fila(it) }
            }
        }
    }
}

@Composable
private fun FilaCatalogo(titulo: String, inicio: @Composable () -> Unit, alEditar: () -> Unit, alEliminar: (() -> Unit)?) {
    Card(colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceContainer)) {
        ListItem(
            leadingContent = inicio,
            headlineContent = { Text(titulo) },
            trailingContent = {
                Row {
                    IconButton(onClick = alEditar) { Icon(Icons.Filled.Edit, "Editar") }
                    if (alEliminar != null) IconButton(onClick = alEliminar) { Icon(Icons.Filled.Delete, "Eliminar") }
                }
            },
            colors = ListItemDefaults.colors(containerColor = androidx.compose.ui.graphics.Color.Transparent),
        )
    }
}

@Composable
fun TiposContactoPantalla(alVolver: () -> Unit) {
    val vm = appViewModel { TiposContactoViewModel(it.adminRepositorio, it.contactosRepositorio) }
    val estado by vm.estado.collectAsStateWithLifecycle()
    var editando by remember { mutableStateOf<TipoContacto?>(null) }
    var eliminando by remember { mutableStateOf<TipoContacto?>(null) }

    PantallaCatalogo(
        "Tipos de contacto", estado, { it.id }, alVolver,
        alNuevo = { editando = TipoContacto(0, "", "blue-500") },
        alDescartarMensaje = vm::descartarMensaje,
    ) { tipo ->
        FilaCatalogo(
            tipo.nombre,
            inicio = { Box(Modifier.size(28.dp).clip(CircleShape).background(ColoresTailwind.aColor(tipo.color))) },
            alEditar = { editando = tipo },
            // El tipo 1 es el tipo por defecto y no se puede borrar.
            alEliminar = if (tipo.id != 1) ({ eliminando = tipo }) else null,
        )
    }

    editando?.let { tipo ->
        var nombre by remember(tipo) { mutableStateOf(tipo.nombre) }
        var color by remember(tipo) { mutableStateOf(tipo.color ?: "blue-500") }
        AlertDialog(
            onDismissRequest = { editando = null },
            title = { Text(if (tipo.id == 0) "Nuevo tipo de contacto" else "Editar tipo de contacto") },
            text = {
                Column(Modifier.verticalScroll(rememberScrollState())) {
                    Campo(nombre, { nombre = it }, "Nombre")
                    Spacer(Modifier.height(8.dp))
                    Text("Color", style = MaterialTheme.typography.labelLarge)
                    SelectorColor(color) { color = it }
                }
            },
            confirmButton = {
                TextButton(onClick = {
                    vm.guardar(tipo.id.takeIf { it != 0 }, nombre, color)
                    editando = null
                }, enabled = nombre.isNotBlank()) { Text("Guardar") }
            },
            dismissButton = { TextButton(onClick = { editando = null }) { Text("Cancelar") } },
        )
    }

    eliminando?.let { tipo ->
        DialogoConfirmar("Eliminar tipo", "¿Eliminar el tipo \"${tipo.nombre}\"?", alConfirmar = { vm.eliminar(tipo.id); eliminando = null }, alCancelar = { eliminando = null })
    }
}

/** Paleta Tailwind (Colores.jsx): una fila por color con sus 9 intensidades. */
@Composable
private fun SelectorColor(seleccionado: String, alElegir: (String) -> Unit) {
    Column(verticalArrangement = Arrangement.spacedBy(4.dp)) {
        ColoresTailwind.nombres.forEach { nombre ->
            Row(horizontalArrangement = Arrangement.spacedBy(4.dp), verticalAlignment = Alignment.CenterVertically) {
                Text(nombre, style = MaterialTheme.typography.labelSmall, modifier = Modifier.width(56.dp))
                ColoresTailwind.intensidades.forEach { intensidad ->
                    val valor = "$nombre-$intensidad"
                    val activo = valor == seleccionado
                    Box(
                        Modifier
                            .weight(1f)
                            .aspectRatio(1f)
                            .clip(RoundedCornerShape(4.dp))
                            .background(ColoresTailwind.aColor(valor))
                            .then(if (activo) Modifier.border(BorderStroke(2.dp, MaterialTheme.colorScheme.onSurface), RoundedCornerShape(4.dp)) else Modifier)
                            .clickable { alElegir(valor) },
                        contentAlignment = Alignment.Center,
                    ) {
                        if (activo) Icon(Icons.Filled.Check, null, Modifier.size(12.dp))
                    }
                }
            }
        }
    }
}

@Composable
fun TiposCodificacionPantalla(alVolver: () -> Unit) {
    val vm = appViewModel { TiposCodificacionViewModel(it.adminRepositorio, it.contactosRepositorio) }
    val estado by vm.estado.collectAsStateWithLifecycle()
    var editando by remember { mutableStateOf<TipoCodificacion?>(null) }
    var eliminando by remember { mutableStateOf<TipoCodificacion?>(null) }

    PantallaCatalogo(
        "Tipos de codificación", estado, { it.id }, alVolver,
        alNuevo = { editando = TipoCodificacion(0, "") },
        alDescartarMensaje = vm::descartarMensaje,
    ) { tipo ->
        FilaCatalogo(
            tipo.nombre,
            inicio = { Icon(Icons.Filled.GraphicEq, null, tint = MaterialTheme.colorScheme.primary) },
            alEditar = { editando = tipo },
            alEliminar = { eliminando = tipo },
        )
    }

    editando?.let { tipo ->
        var nombre by remember(tipo) { mutableStateOf(tipo.nombre) }
        AlertDialog(
            onDismissRequest = { editando = null },
            title = { Text(if (tipo.id == 0) "Nueva codificación" else "Editar codificación") },
            text = { Campo(nombre, { if (it.length <= 30) nombre = it }, "Nombre (máx. 30)") },
            confirmButton = {
                TextButton(onClick = {
                    vm.guardar(tipo.id.takeIf { it != 0 }, nombre)
                    editando = null
                }, enabled = nombre.isNotBlank()) { Text("Guardar") }
            },
            dismissButton = { TextButton(onClick = { editando = null }) { Text("Cancelar") } },
        )
    }

    eliminando?.let { tipo ->
        DialogoConfirmar("Eliminar codificación", "¿Eliminar \"${tipo.nombre}\"?", alConfirmar = { vm.eliminar(tipo.id); eliminando = null }, alCancelar = { eliminando = null })
    }
}
