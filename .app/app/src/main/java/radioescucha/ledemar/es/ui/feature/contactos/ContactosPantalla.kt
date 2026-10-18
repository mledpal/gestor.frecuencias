package radioescucha.ledemar.es.ui.feature.contactos

import androidx.compose.foundation.ExperimentalFoundationApi
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ExperimentalLayoutApi
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.filled.FilterList
import androidx.compose.material.icons.filled.Lock
import androidx.compose.material.icons.filled.Place
import androidx.compose.material.icons.filled.Repeat
import androidx.compose.material.icons.filled.Search
import androidx.compose.material.icons.filled.SettingsInputAntenna
import androidx.compose.material.icons.filled.Star
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.ExtendedFloatingActionButton
import androidx.compose.material3.FilterChip
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.InputChip
import androidx.compose.material3.InputChipDefaults
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.ModalBottomSheet
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.Scaffold
import androidx.compose.material3.SnackbarHost
import androidx.compose.material3.SnackbarHostState
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.material3.TopAppBar
import androidx.compose.material3.TopAppBarDefaults
import androidx.compose.material3.pulltorefresh.PullToRefreshBox
import androidx.compose.material3.rememberModalBottomSheetState
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.input.nestedscroll.nestedScroll
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import radioescucha.ledemar.es.core.network.Contacto
import radioescucha.ledemar.es.core.util.ColoresTailwind
import radioescucha.ledemar.es.core.util.Filtros
import radioescucha.ledemar.es.ui.appViewModel
import radioescucha.ledemar.es.ui.components.Avatar
import radioescucha.ledemar.es.ui.components.Cargando
import radioescucha.ledemar.es.ui.components.EstadoVacio
import radioescucha.ledemar.es.ui.components.Led
import radioescucha.ledemar.es.ui.components.PantallaLcd
import radioescucha.ledemar.es.ui.theme.FuenteMarca
import radioescucha.ledemar.es.ui.theme.Paleta
import radioescucha.ledemar.es.ui.theme.estiloLcd

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ContactosPantalla(
    alAbrir: (Int) -> Unit,
    alNuevo: () -> Unit,
    alBuscar: () -> Unit,
) {
    val vm = appViewModel { ContactosViewModel(it.contactosRepositorio, it.sesion, it.json) }
    val estado by vm.estado.collectAsStateWithLifecycle()
    val snackbar = remember { SnackbarHostState() }
    var verFiltros by rememberSaveable { mutableStateOf(false) }
    val scroll = TopAppBarDefaults.enterAlwaysScrollBehavior()

    LaunchedEffect(estado.error) {
        estado.error?.let {
            snackbar.showSnackbar(it)
            vm.descartarError()
        }
    }

    Scaffold(
        modifier = Modifier.nestedScroll(scroll.nestedScrollConnection),
        topBar = {
            TopAppBar(
                title = { Text("RADIOESCUCHA", fontFamily = FuenteMarca, style = MaterialTheme.typography.titleMedium, color = MaterialTheme.colorScheme.primary) },
                actions = {
                    IconButton(onClick = alBuscar) { Icon(Icons.Filled.Search, contentDescription = "Buscar") }
                    IconButton(onClick = { verFiltros = true }) { Icon(Icons.Filled.FilterList, contentDescription = "Filtros") }
                },
                scrollBehavior = scroll,
            )
        },
        floatingActionButton = {
            ExtendedFloatingActionButton(onClick = alNuevo, icon = { Icon(Icons.Filled.Add, null) }, text = { Text("Nuevo") })
        },
        snackbarHost = { SnackbarHost(snackbar) },
    ) { padding ->
        PullToRefreshBox(
            isRefreshing = estado.cargando && estado.total > 0,
            onRefresh = vm::refrescar,
            modifier = Modifier
                .padding(padding)
                .fillMaxSize(),
        ) {
            when {
                estado.cargando && estado.total == 0 -> Cargando()
                estado.total == 0 && !estado.enBusqueda -> EstadoVacio(
                    icono = Icons.Filled.SettingsInputAntenna,
                    titulo = "Aún no hay contactos",
                    texto = "Registra tu primera escucha: frecuencia, ubicación, repetidor y codificación.",
                    accion = "Añadir contacto",
                    alPulsar = alNuevo,
                    extra = { TextButton(onClick = alBuscar) { Text("Buscar frecuencias de otros radioescuchas") } },
                )
                else -> ListaContactos(estado, vm, alAbrir, alNuevo)
            }
        }
    }

    if (verFiltros) {
        HojaFiltros(
            filtros = estado.filtros,
            tipos = estado.selects?.tiposContacto.orEmpty().map { it.id to it.nombre },
            alCambiar = vm::cambiarFiltros,
            alAlternarTodos = vm::alternarTodos,
            alCerrar = { verFiltros = false },
        )
    }
}

@OptIn(ExperimentalFoundationApi::class)
@Composable
private fun ListaContactos(estado: ListaContactosEstado, vm: ContactosViewModel, alAbrir: (Int) -> Unit, alNuevo: () -> Unit) {
    val tipos = estado.selects?.tiposContacto?.map { it.id }.orEmpty()

    LazyColumn(
        contentPadding = PaddingValues(start = 16.dp, end = 16.dp, top = 4.dp, bottom = 96.dp),
        verticalArrangement = Arrangement.spacedBy(10.dp),
        modifier = Modifier.fillMaxSize(),
    ) {
        item {
            PantallaLcd(
                frecuencia = estado.contactos.firstOrNull()?.frecuencia,
                etiqueta = if (estado.enBusqueda) "SCAN" else "MEM",
                subtitulo = "MEM ${estado.contactos.size.toString().padStart(3, '0')}/${estado.total.toString().padStart(3, '0')}",
                leds = {
                    Led(Paleta.LedRx, encendido = estado.contactos.isNotEmpty(), etiqueta = "RX")
                    Led(Paleta.Ambar, encendido = estado.enBusqueda, etiqueta = "SCAN", parpadeo = true)
                },
                modifier = Modifier.fillMaxWidth(),
            )
        }

        item {
            LazyRow(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                if (estado.enBusqueda) {
                    item {
                        InputChip(
                            selected = true,
                            onClick = vm::limpiarBusqueda,
                            label = { Text("Búsqueda activa") },
                            trailingIcon = { Icon(Icons.Filled.Close, contentDescription = "Quitar búsqueda", Modifier.size(InputChipDefaults.IconSize)) },
                        )
                    }
                }
                item {
                    FilterChip(
                        selected = estado.filtros.todosActivos,
                        onClick = { vm.cambiarFiltros(Filtros.TODOS) },
                        label = { Text("Todos") },
                    )
                }
                item {
                    FilterChip(
                        selected = !estado.filtros.todosActivos && estado.filtros == Filtros.soloFavoritos(tipos),
                        onClick = { vm.cambiarFiltros(Filtros.soloFavoritos(tipos)) },
                        label = { Text("Favoritos") },
                        leadingIcon = { Icon(Icons.Filled.Star, null, Modifier.size(18.dp)) },
                    )
                }
                item {
                    FilterChip(
                        selected = !estado.filtros.todosActivos && estado.filtros == Filtros.soloPrivados(tipos),
                        onClick = { vm.cambiarFiltros(Filtros.soloPrivados(tipos)) },
                        label = { Text("Privados") },
                        leadingIcon = { Icon(Icons.Filled.Lock, null, Modifier.size(18.dp)) },
                    )
                }
            }
        }

        if (estado.contactos.isEmpty()) {
            item {
                EstadoVacio(
                    icono = Icons.Filled.FilterList,
                    titulo = "Sin resultados",
                    texto = if (estado.enBusqueda) "La búsqueda no ha devuelto contactos." else "Ningún contacto cumple los filtros activos.",
                    accion = if (estado.enBusqueda) "Quitar búsqueda" else "Ver todos",
                    alPulsar = { if (estado.enBusqueda) vm.limpiarBusqueda() else vm.cambiarFiltros(Filtros.TODOS) },
                    modifier = Modifier.height(320.dp),
                )
            }
        }

        items(estado.contactos, key = { it.id }) { contacto ->
            FilaContacto(contacto, alPulsar = { alAbrir(contacto.id) }, modifier = Modifier.animateItem())
        }
    }
}

/**
 * Fila tipo "banco de memoria": franja con el color del tipo, frecuencia en
 * fuente LCD y los iconos de estado (carpeta Contactos/Icons de la web).
 */
@Composable
fun FilaContacto(contacto: Contacto, alPulsar: () -> Unit, modifier: Modifier = Modifier) {
    val color = ColoresTailwind.aColor(contacto.tipo?.color)
    Card(
        onClick = alPulsar,
        modifier = modifier.fillMaxWidth(),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceContainer),
        shape = MaterialTheme.shapes.medium,
    ) {
        Row(Modifier.height(androidx.compose.foundation.layout.IntrinsicSize.Min)) {
            Box(
                Modifier
                    .width(6.dp)
                    .fillMaxHeight()
                    .background(color),
            )
            Column(
                Modifier
                    .weight(1f)
                    .padding(horizontal = 14.dp, vertical = 12.dp),
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Text(
                        contacto.frecuencia ?: "---",
                        style = estiloLcd(30),
                        color = MaterialTheme.colorScheme.primary,
                    )
                    Text(" MHz", style = MaterialTheme.typography.labelSmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
                    Spacer(Modifier.weight(1f))
                    IconosEstado(contacto)
                }
                Text(
                    contacto.nombre,
                    style = MaterialTheme.typography.titleMedium,
                    maxLines = 1,
                    overflow = TextOverflow.Ellipsis,
                )
                Row(verticalAlignment = Alignment.CenterVertically) {
                    contacto.tipo?.let {
                        Box(Modifier.size(8.dp).clip(androidx.compose.foundation.shape.CircleShape).background(color))
                        Spacer(Modifier.width(6.dp))
                        Text(it.nombre, style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
                    }
                    val lugar = listOfNotNull(contacto.localizacion?.localidad, contacto.localizacion?.provincia).filter { it.isNotBlank() }.joinToString(", ")
                    if (lugar.isNotBlank()) {
                        Text("  ·  $lugar", style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onSurfaceVariant, maxLines = 1, overflow = TextOverflow.Ellipsis, modifier = Modifier.weight(1f, fill = false))
                    }
                    contacto.modo?.let {
                        Spacer(Modifier.weight(1f))
                        Text(it.nombre, style = estiloLcd(16), color = MaterialTheme.colorScheme.secondary)
                    }
                }
                contacto.usuario?.let { dueno ->
                    Spacer(Modifier.height(6.dp))
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Avatar(dueno.photo, tamano = 20.dp)
                        Spacer(Modifier.width(6.dp))
                        Text(dueno.username, style = MaterialTheme.typography.labelMedium, color = MaterialTheme.colorScheme.onSurfaceVariant)
                    }
                }
            }
        }
    }
}

@Composable
private fun IconosEstado(c: Contacto) {
    Row(horizontalArrangement = Arrangement.spacedBy(4.dp)) {
        if (c.repetidor != null) IconoEstado(Icons.Filled.Repeat, "Repetidor")
        if (!c.localizacion?.gps.isNullOrBlank()) IconoEstado(Icons.Filled.Place, "GPS")
        if (c.privado) IconoEstado(Icons.Filled.Lock, "Privado")
        if (c.comprobado) IconoEstado(Icons.Filled.CheckCircle, "Comprobado", MaterialTheme.colorScheme.tertiary)
        if (c.favorito) IconoEstado(Icons.Filled.Star, "Favorito", Paleta.Ambar)
    }
}

@Composable
private fun IconoEstado(icono: ImageVector, descripcion: String, tinte: androidx.compose.ui.graphics.Color = MaterialTheme.colorScheme.onSurfaceVariant) {
    Icon(icono, contentDescription = descripcion, tint = tinte, modifier = Modifier.size(18.dp))
}

@OptIn(ExperimentalMaterial3Api::class, ExperimentalLayoutApi::class)
@Composable
private fun HojaFiltros(
    filtros: Filtros,
    tipos: List<Pair<Int, String>>,
    alCambiar: (Filtros) -> Unit,
    alAlternarTodos: () -> Unit,
    alCerrar: () -> Unit,
) {
    ModalBottomSheet(onDismissRequest = alCerrar, sheetState = rememberModalBottomSheetState(skipPartiallyExpanded = true)) {
        Column(Modifier.padding(horizontal = 20.dp).padding(bottom = 32.dp)) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Text("Filtros", style = MaterialTheme.typography.titleLarge, modifier = Modifier.weight(1f))
                OutlinedButton(onClick = alAlternarTodos) { Text(if (filtros.todosActivos) "Desmarcar todos" else "Marcar todos") }
            }
            Text(
                "Se muestran los contactos que cumplan cualquiera de los filtros marcados.",
                style = MaterialTheme.typography.bodySmall,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
            )
            Spacer(Modifier.height(16.dp))
            Text("Estado", style = MaterialTheme.typography.titleSmall)
            FlowRow(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                ChipFiltro("Favoritos", filtros.favorito) { alCambiar(filtros.copy(favorito = it)) }
                ChipFiltro("Comprobados", filtros.comprobado) { alCambiar(filtros.copy(comprobado = it)) }
                ChipFiltro("Desconocidos", filtros.noComprobado) { alCambiar(filtros.copy(noComprobado = it)) }
                ChipFiltro("Públicos", filtros.publico) { alCambiar(filtros.copy(publico = it)) }
                ChipFiltro("Privados", filtros.privado) { alCambiar(filtros.copy(privado = it)) }
            }
            if (tipos.isNotEmpty()) {
                HorizontalDivider(Modifier.padding(vertical = 12.dp))
                Text("Tipo de contacto", style = MaterialTheme.typography.titleSmall)
                FlowRow(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    tipos.forEach { (id, nombre) ->
                        ChipFiltro(nombre, filtros.tipoActivo(id)) { activo ->
                            alCambiar(filtros.copy(tiposOcultos = if (activo) filtros.tiposOcultos - id else filtros.tiposOcultos + id))
                        }
                    }
                }
            }
        }
    }
}

@Composable
private fun ChipFiltro(texto: String, activo: Boolean, alCambiar: (Boolean) -> Unit) {
    FilterChip(selected = activo, onClick = { alCambiar(!activo) }, label = { Text(texto) })
}
