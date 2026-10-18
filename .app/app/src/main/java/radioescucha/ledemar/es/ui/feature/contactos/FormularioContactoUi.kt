package radioescucha.ledemar.es.ui.feature.contactos

import android.Manifest
import android.annotation.SuppressLint
import android.content.pm.PackageManager
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ExperimentalLayoutApi
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.width
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.CalendarMonth
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.filled.GraphicEq
import androidx.compose.material.icons.filled.Lock
import androidx.compose.material.icons.filled.Map
import androidx.compose.material.icons.filled.MyLocation
import androidx.compose.material.icons.automirrored.filled.Notes
import androidx.compose.material.icons.filled.Place
import androidx.compose.material.icons.filled.Repeat
import androidx.compose.material.icons.filled.Schedule
import androidx.compose.material.icons.filled.SettingsInputAntenna
import androidx.compose.material.icons.filled.Star
import androidx.compose.material.icons.filled.Badge
import androidx.compose.material3.DatePicker
import androidx.compose.material3.DatePickerDialog
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.FilterChip
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.SegmentedButton
import androidx.compose.material3.SegmentedButtonDefaults
import androidx.compose.material3.SingleChoiceSegmentedButtonRow
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.material3.TimePicker
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.rememberDatePickerState
import androidx.compose.material3.rememberTimePickerState
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.dp
import androidx.core.content.ContextCompat
import com.google.android.gms.location.LocationServices
import com.google.android.gms.location.Priority
import com.google.android.gms.tasks.CancellationTokenSource
import kotlinx.coroutines.launch
import kotlinx.coroutines.suspendCancellableCoroutine
import radioescucha.ledemar.es.core.network.OpcionCatalogo
import radioescucha.ledemar.es.core.network.Selects
import radioescucha.ledemar.es.core.util.ColoresTailwind
import radioescucha.ledemar.es.core.util.Formatos
import radioescucha.ledemar.es.ui.components.Calidad
import radioescucha.ledemar.es.ui.components.Campo
import radioescucha.ledemar.es.ui.components.SeccionPlegable
import radioescucha.ledemar.es.ui.components.SelectorCatalogo
import java.time.Instant
import java.time.LocalDate
import java.time.LocalTime
import java.time.ZoneOffset
import kotlin.coroutines.resume

/**
 * Formulario de contacto (campos de handleContacts.js / ValidarContacto).
 * Con `editable = false` se muestra en solo lectura (contactos ajenos).
 */
@OptIn(ExperimentalLayoutApi::class)
@Composable
fun FormularioContactoUi(
    formulario: FormularioContacto,
    selects: Selects?,
    errores: Map<String, String>,
    editable: Boolean,
    alCambiar: (FormularioContacto) -> Unit,
    alAbrirMapa: (String?) -> Unit,
    modifier: Modifier = Modifier,
) {
    val f = formulario
    var elegirFecha by remember { mutableStateOf(false) }
    var elegirHora by remember { mutableStateOf(false) }

    Column(modifier, verticalArrangement = Arrangement.spacedBy(12.dp)) {

        // ---- Datos ----
        Campo(f.nombre, { alCambiar(f.copy(nombre = it)) }, "Nombre *", icono = Icons.Filled.Badge, error = errores["nombre"], habilitado = editable)

        Campo(
            f.frecuencia, { alCambiar(f.copy(frecuencia = it)) }, "Frecuencia *",
            icono = Icons.Filled.SettingsInputAntenna,
            teclado = KeyboardType.Decimal,
            sufijo = { Text("MHz") },
            error = errores["frecuencia"],
            habilitado = editable,
        )

        SelectorCatalogo(
            "Tipo de contacto *",
            selects?.tiposContacto.orEmpty().map { OpcionCatalogo(it.id, it.nombre) },
            f.tipoId,
            { alCambiar(f.copy(tipoId = it)) },
            error = errores["tipo_id"],
            habilitado = editable,
        )

        Row(horizontalArrangement = Arrangement.spacedBy(12.dp)) {
            Campo(
                Formatos.fechaDia(f.fecha), {}, "Fecha *",
                icono = Icons.Filled.CalendarMonth,
                modifier = Modifier.weight(1f),
                error = errores["fecha"],
                habilitado = editable,
                accion = { if (editable) IconButton(onClick = { elegirFecha = true }) { Icon(Icons.Filled.CalendarMonth, "Elegir fecha") } },
            )
            Campo(
                f.hora, { alCambiar(f.copy(hora = it)) }, "Hora",
                icono = Icons.Filled.Schedule,
                modifier = Modifier.weight(1f),
                error = errores["hora"],
                habilitado = editable,
                accion = { if (editable) IconButton(onClick = { elegirHora = true }) { Icon(Icons.Filled.Schedule, "Elegir hora") } },
            )
        }

        FlowRow(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            FilterChip(
                selected = f.favorito, enabled = editable,
                onClick = { alCambiar(f.copy(favorito = !f.favorito)) },
                label = { Text("Favorito") },
                leadingIcon = { Icon(Icons.Filled.Star, null) },
            )
            FilterChip(
                selected = f.comprobado, enabled = editable,
                onClick = { alCambiar(f.copy(comprobado = !f.comprobado)) },
                label = { Text("Comprobado") },
                leadingIcon = { Icon(Icons.Filled.CheckCircle, null) },
            )
            FilterChip(
                selected = f.privado, enabled = editable,
                onClick = { alCambiar(f.copy(privado = !f.privado)) },
                label = { Text("Privado") },
                leadingIcon = { Icon(Icons.Filled.Lock, null) },
            )
        }

        Column {
            Text("Calidad de la señal", style = MaterialTheme.typography.labelLarge, color = MaterialTheme.colorScheme.onSurfaceVariant)
            Calidad(f.calidad, if (editable) { n -> alCambiar(f.copy(calidad = n)) } else null)
        }

        Row(horizontalArrangement = Arrangement.spacedBy(12.dp)) {
            SelectorCatalogo("Banda", selects?.bandas.orEmpty(), f.bandaId, { alCambiar(f.copy(bandaId = it)) }, Modifier.weight(1f), habilitado = editable)
            SelectorCatalogo("Modo TX", selects?.modos.orEmpty(), f.modoId, { alCambiar(f.copy(modoId = it)) }, Modifier.weight(1f), habilitado = editable)
        }

        Campo(f.observaciones, { alCambiar(f.copy(observaciones = it)) }, "Observaciones", icono = Icons.AutoMirrored.Filled.Notes, lineas = 3, habilitado = editable)

        // ---- Localización ----
        SeccionPlegable(
            "Localización", Icons.Filled.Place,
            inicialmenteAbierta = f.tieneLocalizacion || errores.containsKey("gps"),
            resumen = listOf(f.localidad, f.provincia).filter { it.isNotBlank() }.joinToString(", "),
        ) {
            Campo(f.localidad, { alCambiar(f.copy(localidad = it)) }, "Localidad", habilitado = editable)
            Campo(f.provincia, { alCambiar(f.copy(provincia = it)) }, "Provincia", habilitado = editable)
            Campo(f.pais, { alCambiar(f.copy(pais = it)) }, "País", habilitado = editable)
            Campo(
                f.gps, { alCambiar(f.copy(gps = it)) }, "GPS (lat,lng)",
                error = errores["gps"],
                habilitado = editable,
                accion = {
                    IconButton(onClick = { alAbrirMapa(f.gps.ifBlank { null }) }) { Icon(Icons.Filled.Map, "Ver en el mapa") }
                },
            )
            if (editable) {
                BotonMiUbicacion { gps -> alCambiar(f.copy(gps = gps)) }
            }
        }

        // ---- Repetidor ----
        SeccionPlegable(
            "Repetidor", Icons.Filled.Repeat,
            inicialmenteAbierta = f.tieneRepetidor,
            resumen = if (f.tieneRepetidor) "${f.direccion} ${f.offset} MHz" else null,
        ) {
            Text("Dirección del offset", style = MaterialTheme.typography.labelLarge, color = MaterialTheme.colorScheme.onSurfaceVariant)
            val direcciones = selects?.direcciones ?: listOf("=", "+", "-")
            SingleChoiceSegmentedButtonRow(Modifier.fillMaxWidth()) {
                direcciones.forEachIndexed { i, d ->
                    SegmentedButton(
                        selected = f.direccion == d,
                        onClick = { if (editable) alCambiar(f.copy(direccion = if (f.direccion == d) "" else d)) },
                        shape = SegmentedButtonDefaults.itemShape(i, direcciones.size),
                        enabled = editable,
                    ) { Text(d) }
                }
            }
            errores["direccion"]?.let { Text(it, color = MaterialTheme.colorScheme.error, style = MaterialTheme.typography.bodySmall) }
            Campo(f.offset, { alCambiar(f.copy(offset = it)) }, "Offset", teclado = KeyboardType.Decimal, sufijo = { Text("MHz") }, habilitado = editable)
        }

        // ---- Codificación ----
        SeccionPlegable(
            "Codificación", Icons.Filled.GraphicEq,
            inicialmenteAbierta = f.tieneCodificacion,
            resumen = listOfNotNull(
                selects?.codificaciones?.firstOrNull { it.id == f.codificacionId && it.id != -1 }?.nombre,
                selects?.ctcss?.firstOrNull { it.id == f.ctcssId && it.id != -1 }?.let { "CTCSS ${it.nombre}" },
                selects?.dcs?.firstOrNull { it.id == f.dcsId && it.id != -1 }?.let { "DCS ${it.nombre}" },
            ).joinToString(" · "),
        ) {
            SelectorCatalogo("Codificación", selects?.codificaciones.orEmpty(), f.codificacionId, { alCambiar(f.copy(codificacionId = it)) }, habilitado = editable)
            Row(horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                SelectorCatalogo("CTCSS", selects?.ctcss.orEmpty(), f.ctcssId, { alCambiar(f.copy(ctcssId = it)) }, Modifier.weight(1f), habilitado = editable)
                SelectorCatalogo("DCS", selects?.dcs.orEmpty(), f.dcsId, { alCambiar(f.copy(dcsId = it)) }, Modifier.weight(1f), habilitado = editable)
            }
        }
    }

    if (elegirFecha) DialogoFecha(f.fecha, { alCambiar(f.copy(fecha = it)) }, { elegirFecha = false })
    if (elegirHora) DialogoHora(f.hora, { alCambiar(f.copy(hora = it)) }, { elegirHora = false })
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
private fun DialogoFecha(actual: String, alElegir: (String) -> Unit, alCerrar: () -> Unit) {
    val inicial = runCatching { LocalDate.parse(actual) }.getOrDefault(LocalDate.now())
    val estado = rememberDatePickerState(initialSelectedDateMillis = inicial.atStartOfDay().toInstant(ZoneOffset.UTC).toEpochMilli())
    DatePickerDialog(
        onDismissRequest = alCerrar,
        confirmButton = {
            TextButton(onClick = {
                estado.selectedDateMillis?.let { alElegir(Instant.ofEpochMilli(it).atOffset(ZoneOffset.UTC).toLocalDate().toString()) }
                alCerrar()
            }) { Text("Aceptar") }
        },
        dismissButton = { TextButton(onClick = alCerrar) { Text("Cancelar") } },
    ) { DatePicker(estado) }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
private fun DialogoHora(actual: String, alElegir: (String) -> Unit, alCerrar: () -> Unit) {
    val inicial = runCatching { LocalTime.parse(actual) }.getOrDefault(LocalTime.now())
    val estado = rememberTimePickerState(inicial.hour, inicial.minute, is24Hour = true)
    AlertDialog(
        onDismissRequest = alCerrar,
        confirmButton = {
            TextButton(onClick = {
                alElegir("%02d:%02d".format(estado.hour, estado.minute))
                alCerrar()
            }) { Text("Aceptar") }
        },
        dismissButton = { TextButton(onClick = alCerrar) { Text("Cancelar") } },
        text = { TimePicker(estado) },
    )
}

/**
 * Rellena el GPS con la ubicación actual del dispositivo (no existe en la
 * web, donde el GPS se teclea o se elige en el mapa).
 */
@SuppressLint("MissingPermission")
@Composable
fun BotonMiUbicacion(alObtener: (String) -> Unit) {
    val context = LocalContext.current
    val scope = rememberCoroutineScope()
    var buscando by remember { mutableStateOf(false) }

    val obtener: () -> Unit = {
        buscando = true
        scope.launch {
            val cliente = LocationServices.getFusedLocationProviderClient(context)
            val token = CancellationTokenSource()
            val ubicacion = suspendCancellableCoroutine { cont ->
                cliente.getCurrentLocation(Priority.PRIORITY_HIGH_ACCURACY, token.token)
                    .addOnSuccessListener { cont.resume(it) }
                    .addOnFailureListener { cont.resume(null) }
                cont.invokeOnCancellation { token.cancel() }
            }
            ubicacion?.let { alObtener(Formatos.formatearGps(it.latitude, it.longitude)) }
            buscando = false
        }
    }

    val permiso = rememberLauncherForActivityResult(ActivityResultContracts.RequestMultiplePermissions()) { concedidos ->
        if (concedidos.values.any { it }) obtener()
    }

    OutlinedButton(
        onClick = {
            val concedido = ContextCompat.checkSelfPermission(context, Manifest.permission.ACCESS_FINE_LOCATION) == PackageManager.PERMISSION_GRANTED ||
                ContextCompat.checkSelfPermission(context, Manifest.permission.ACCESS_COARSE_LOCATION) == PackageManager.PERMISSION_GRANTED
            if (concedido) obtener() else permiso.launch(arrayOf(Manifest.permission.ACCESS_FINE_LOCATION, Manifest.permission.ACCESS_COARSE_LOCATION))
        },
        enabled = !buscando,
        modifier = Modifier.fillMaxWidth(),
    ) {
        Icon(Icons.Filled.MyLocation, null)
        Spacer(Modifier.width(8.dp))
        Text(if (buscando) "Obteniendo ubicación…" else "Usar mi ubicación actual")
    }
}

/** Color del tipo del contacto para la cabecera. */
fun colorTipo(color: String?) = ColoresTailwind.aColor(color)
