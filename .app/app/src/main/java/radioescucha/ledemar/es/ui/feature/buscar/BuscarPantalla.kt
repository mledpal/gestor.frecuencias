package radioescucha.ledemar.es.ui.feature.buscar

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Badge
import androidx.compose.material.icons.filled.CalendarMonth
import androidx.compose.material.icons.filled.Clear
import androidx.compose.material.icons.filled.Place
import androidx.compose.material.icons.filled.Search
import androidx.compose.material.icons.filled.SettingsInputAntenna
import androidx.compose.material3.DatePicker
import androidx.compose.material3.DatePickerDialog
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.material3.SegmentedButton
import androidx.compose.material3.SegmentedButtonDefaults
import androidx.compose.material3.SingleChoiceSegmentedButtonRow
import androidx.compose.material3.SnackbarHost
import androidx.compose.material3.SnackbarHostState
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.material3.TopAppBar
import androidx.compose.material3.rememberDatePickerState
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.dp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import kotlinx.coroutines.launch
import radioescucha.ledemar.es.core.network.BusquedaPeticion
import radioescucha.ledemar.es.core.network.OpcionCatalogo
import radioescucha.ledemar.es.core.network.Resultado
import radioescucha.ledemar.es.core.util.Formatos
import radioescucha.ledemar.es.ui.components.BotonPrincipal
import radioescucha.ledemar.es.ui.components.Campo
import radioescucha.ledemar.es.ui.components.SelectorCatalogo
import radioescucha.ledemar.es.ui.contenedor
import java.time.Instant
import java.time.ZoneOffset

/**
 * Búsqueda de contactos (BuscarContacto.jsx): propios o públicos de otros
 * radioescuchas. El resultado sustituye a la lista de contactos.
 */
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun BuscarPantalla(alVerResultados: () -> Unit) {
    val container = contenedor()
    val repo = container.contactosRepositorio
    val selects by repo.selects.collectAsStateWithLifecycle()
    val scope = rememberCoroutineScope()
    val snackbar = remember { SnackbarHostState() }

    var propio by rememberSaveable { mutableStateOf(true) }
    var nombre by rememberSaveable { mutableStateOf("") }
    var frecuencia by rememberSaveable { mutableStateOf("") }
    var tipoId by rememberSaveable { mutableStateOf(-1) }
    var comprobado by rememberSaveable { mutableStateOf(0) } // 0 = todos, 1 = sí, 2 = no
    var fechaIni by rememberSaveable { mutableStateOf("") }
    var fechaFin by rememberSaveable { mutableStateOf("") }
    var localidad by rememberSaveable { mutableStateOf("") }
    var provincia by rememberSaveable { mutableStateOf("") }
    var buscando by remember { mutableStateOf(false) }
    var eligiendo by remember { mutableStateOf<String?>(null) }

    fun limpiar() {
        nombre = ""; frecuencia = ""; tipoId = -1; comprobado = 0
        fechaIni = ""; fechaFin = ""; localidad = ""; provincia = ""
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Buscar frecuencias") },
                actions = { IconButton(onClick = ::limpiar) { Icon(Icons.Filled.Clear, "Limpiar") } },
            )
        },
        snackbarHost = { SnackbarHost(snackbar) },
    ) { padding ->
        Column(
            Modifier
                .padding(padding)
                .fillMaxSize()
                .verticalScroll(rememberScrollState())
                .padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp),
        ) {
            SingleChoiceSegmentedButtonRow(Modifier.fillMaxWidth()) {
                SegmentedButton(propio, { propio = true }, SegmentedButtonDefaults.itemShape(0, 2)) { Text("Mis contactos") }
                SegmentedButton(!propio, { propio = false }, SegmentedButtonDefaults.itemShape(1, 2)) { Text("Comunidad") }
            }
            Text(
                if (propio) "Busca entre tus propios contactos." else "Busca entre los contactos públicos del resto de radioescuchas.",
                style = MaterialTheme.typography.bodySmall,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
            )

            Campo(frecuencia, { frecuencia = it }, "Frecuencia", icono = Icons.Filled.SettingsInputAntenna, teclado = KeyboardType.Decimal, sufijo = { Text("MHz") })
            Campo(nombre, { nombre = it }, "Nombre", icono = Icons.Filled.Badge)
            SelectorCatalogo(
                "Tipo de contacto",
                listOf(OpcionCatalogo(-1, "Cualquiera")) + selects?.tiposContacto.orEmpty().map { OpcionCatalogo(it.id, it.nombre) },
                tipoId,
                { tipoId = it },
            )

            Text("Comprobado", style = MaterialTheme.typography.labelLarge, color = MaterialTheme.colorScheme.onSurfaceVariant)
            SingleChoiceSegmentedButtonRow(Modifier.fillMaxWidth()) {
                listOf("Todos", "Sí", "No").forEachIndexed { i, etiqueta ->
                    SegmentedButton(comprobado == i, { comprobado = i }, SegmentedButtonDefaults.itemShape(i, 3)) { Text(etiqueta) }
                }
            }

            Row(horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                Campo(
                    Formatos.fechaDia(fechaIni), {}, "Desde", modifier = Modifier.weight(1f),
                    accion = { IconButton(onClick = { eligiendo = "ini" }) { Icon(Icons.Filled.CalendarMonth, "Elegir") } },
                )
                Campo(
                    Formatos.fechaDia(fechaFin), {}, "Hasta", modifier = Modifier.weight(1f),
                    accion = { IconButton(onClick = { eligiendo = "fin" }) { Icon(Icons.Filled.CalendarMonth, "Elegir") } },
                )
            }

            Campo(localidad, { localidad = it }, "Localidad", icono = Icons.Filled.Place)
            Campo(provincia, { provincia = it }, "Provincia", icono = Icons.Filled.Place)

            BotonPrincipal("Buscar", buscando, {
                buscando = true
                scope.launch {
                    val peticion = BusquedaPeticion(
                        propio = propio,
                        nombre = nombre.trim().ifBlank { null },
                        frecuencia = frecuencia.trim().replace(',', '.').ifBlank { null },
                        tipoId = tipoId.takeIf { it != -1 },
                        comprobado = when (comprobado) { 1 -> true; 2 -> false; else -> null },
                        fechaIni = fechaIni.ifBlank { null },
                        fechaFin = fechaFin.ifBlank { null },
                        localidad = localidad.trim().ifBlank { null },
                        provincia = provincia.trim().ifBlank { null },
                    )
                    when (val r = repo.buscar(peticion)) {
                        is Resultado.Ok -> alVerResultados()
                        is Resultado.Error -> snackbar.showSnackbar(r.mensaje)
                    }
                    buscando = false
                }
            }, icono = Icons.Filled.Search)
        }
    }

    eligiendo?.let { cual ->
        val estado = rememberDatePickerState()
        DatePickerDialog(
            onDismissRequest = { eligiendo = null },
            confirmButton = {
                TextButton(onClick = {
                    estado.selectedDateMillis?.let {
                        val fecha = Instant.ofEpochMilli(it).atOffset(ZoneOffset.UTC).toLocalDate().toString()
                        if (cual == "ini") fechaIni = fecha else fechaFin = fecha
                    }
                    eligiendo = null
                }) { Text("Aceptar") }
            },
            dismissButton = {
                TextButton(onClick = {
                    if (cual == "ini") fechaIni = "" else fechaFin = ""
                    eligiendo = null
                }) { Text("Quitar") }
            },
        ) { DatePicker(estado) }
    }
}
