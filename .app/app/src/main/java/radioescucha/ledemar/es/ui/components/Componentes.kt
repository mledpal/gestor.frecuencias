package radioescucha.ledemar.es.ui.components

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.core.RepeatMode
import androidx.compose.animation.core.animateFloat
import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.animation.core.infiniteRepeatable
import androidx.compose.animation.core.rememberInfiniteTransition
import androidx.compose.animation.core.tween
import androidx.compose.animation.expandVertically
import androidx.compose.animation.shrinkVertically
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ExpandMore
import androidx.compose.material.icons.filled.Star
import androidx.compose.material.icons.outlined.StarOutline
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.DropdownMenuItem
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.ExposedDropdownMenuAnchorType
import androidx.compose.material3.ExposedDropdownMenuBox
import androidx.compose.material3.ExposedDropdownMenuDefaults
import androidx.compose.material3.FilledTonalButton
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.alpha
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.rotate
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import coil3.compose.AsyncImage
import radioescucha.ledemar.es.R
import radioescucha.ledemar.es.core.network.OpcionCatalogo
import radioescucha.ledemar.es.ui.theme.FuenteMarca
import radioescucha.ledemar.es.ui.theme.LocalColoresLcd
import radioescucha.ledemar.es.ui.theme.Paleta
import radioescucha.ledemar.es.ui.theme.estiloLcd

/**
 * Display LCD con la frecuencia, como CabeceraLCD.jsx: dígitos "fantasma"
 * apagados detrás y etiqueta de modo a la izquierda.
 */
@Composable
fun PantallaLcd(
    frecuencia: String?,
    modifier: Modifier = Modifier,
    etiqueta: String = "MAIN",
    subtitulo: String? = null,
    leds: @Composable (() -> Unit)? = null,
) {
    val lcd = LocalColoresLcd.current
    Column(
        modifier
            .clip(MaterialTheme.shapes.medium)
            .background(Brush.verticalGradient(listOf(lcd.fondo, lcd.fondo.copy(alpha = 0.85f))))
            .border(1.dp, lcd.borde, MaterialTheme.shapes.medium)
            .padding(horizontal = 16.dp, vertical = 12.dp),
    ) {
        Row(verticalAlignment = Alignment.CenterVertically) {
            Text(etiqueta, style = estiloLcd(16), color = lcd.texto.copy(alpha = 0.8f))
            Spacer(Modifier.weight(1f))
            leds?.invoke()
        }
        Box(Modifier.fillMaxWidth(), contentAlignment = Alignment.CenterEnd) {
            val texto = frecuencia ?: "---.---"
            // Segmentos apagados con el mismo formato que el valor (como en CabeceraLCD.jsx).
            val fantasma = texto.map { if (it == '.') '.' else '8' }.joinToString("").padStart(8, '8')
            Text(fantasma, style = estiloLcd(48), color = lcd.apagado, maxLines = 1)
            Text(texto, style = estiloLcd(48), color = lcd.texto, maxLines = 1)
        }
        Row(verticalAlignment = Alignment.CenterVertically) {
            Text(
                subtitulo.orEmpty(),
                style = estiloLcd(18),
                color = lcd.texto.copy(alpha = 0.85f),
                maxLines = 1,
                overflow = TextOverflow.Ellipsis,
                modifier = Modifier.weight(1f),
            )
            Text("MHz", style = estiloLcd(18), color = lcd.texto.copy(alpha = 0.85f))
        }
    }
}

/** LED de estado (RX verde, TX rojo, MSG ámbar). */
@Composable
fun Led(color: Color, encendido: Boolean, etiqueta: String, parpadeo: Boolean = false) {
    val transicion = rememberInfiniteTransition(label = "led")
    val brillo by transicion.animateFloat(
        initialValue = 1f,
        targetValue = if (parpadeo) 0.25f else 1f,
        animationSpec = infiniteRepeatable(tween(600), RepeatMode.Reverse),
        label = "brillo",
    )
    Row(verticalAlignment = Alignment.CenterVertically, modifier = Modifier.padding(start = 10.dp)) {
        Box(
            Modifier
                .size(8.dp)
                .alpha(if (encendido) brillo else 1f)
                .clip(CircleShape)
                .background(if (encendido) color else color.copy(alpha = 0.18f)),
        )
        Spacer(Modifier.width(4.dp))
        Text(etiqueta, style = estiloLcd(13), color = LocalColoresLcd.current.texto.copy(alpha = 0.7f))
    }
}

/** Avatar circular; con halo ámbar si el usuario es administrador. */
@Composable
fun Avatar(url: String?, tamano: Dp = 44.dp, admin: Boolean = false, modifier: Modifier = Modifier) {
    val borde = if (admin) BorderStroke(2.dp, Paleta.Ambar) else BorderStroke(1.dp, MaterialTheme.colorScheme.outlineVariant)
    AsyncImage(
        model = url,
        contentDescription = null,
        placeholder = painterResource(R.drawable.default_user),
        error = painterResource(R.drawable.default_user),
        fallback = painterResource(R.drawable.default_user),
        contentScale = ContentScale.Crop,
        modifier = modifier
            .size(tamano)
            .clip(CircleShape)
            .border(borde, CircleShape),
    )
}

/** Logo + nombre de la app con la tipografía Ethnocentric de la web. */
@Composable
fun Marca(modifier: Modifier = Modifier, tamanoLogo: Dp = 96.dp) {
    Column(modifier, horizontalAlignment = Alignment.CenterHorizontally) {
        Image(painterResource(R.drawable.logo), contentDescription = null, modifier = Modifier.size(tamanoLogo))
        Spacer(Modifier.height(12.dp))
        Text(
            "RADIOESCUCHA",
            fontFamily = FuenteMarca,
            style = MaterialTheme.typography.titleLarge,
            color = MaterialTheme.colorScheme.primary,
        )
        Text(
            "Gestor de frecuencias",
            style = MaterialTheme.typography.bodyMedium,
            color = MaterialTheme.colorScheme.onSurfaceVariant,
        )
    }
}

/** Campo de texto con mensaje de error de validación. */
@Composable
fun Campo(
    valor: String,
    alCambiar: (String) -> Unit,
    etiqueta: String,
    modifier: Modifier = Modifier,
    error: String? = null,
    icono: ImageVector? = null,
    teclado: KeyboardType = KeyboardType.Text,
    password: Boolean = false,
    lineas: Int = 1,
    habilitado: Boolean = true,
    sufijo: @Composable (() -> Unit)? = null,
    accion: @Composable (() -> Unit)? = null,
) {
    OutlinedTextField(
        value = valor,
        onValueChange = alCambiar,
        label = { Text(etiqueta) },
        modifier = modifier.fillMaxWidth(),
        isError = error != null,
        supportingText = error?.let { { Text(it) } },
        leadingIcon = icono?.let { { Icon(it, contentDescription = null) } },
        trailingIcon = accion,
        suffix = sufijo,
        singleLine = lineas == 1,
        minLines = lineas,
        enabled = habilitado,
        keyboardOptions = KeyboardOptions(keyboardType = teclado),
        visualTransformation = if (password) PasswordVisualTransformation() else androidx.compose.ui.text.input.VisualTransformation.None,
        shape = MaterialTheme.shapes.small,
    )
}

/** Desplegable de un catálogo `[{id, nombre}]` (la opción -1 es "Desconocido"). */
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun SelectorCatalogo(
    etiqueta: String,
    opciones: List<OpcionCatalogo>,
    seleccionado: Int?,
    alSeleccionar: (Int) -> Unit,
    modifier: Modifier = Modifier,
    error: String? = null,
    habilitado: Boolean = true,
) {
    var abierto by remember { mutableStateOf(false) }
    val actual = opciones.firstOrNull { it.id == seleccionado }?.nombre.orEmpty()

    ExposedDropdownMenuBox(
        expanded = abierto && habilitado,
        onExpandedChange = { if (habilitado) abierto = it },
        modifier = modifier.fillMaxWidth(),
    ) {
        OutlinedTextField(
            value = actual,
            onValueChange = {},
            readOnly = true,
            enabled = habilitado,
            label = { Text(etiqueta) },
            isError = error != null,
            supportingText = error?.let { { Text(it) } },
            trailingIcon = { ExposedDropdownMenuDefaults.TrailingIcon(expanded = abierto) },
            shape = MaterialTheme.shapes.small,
            modifier = Modifier
                .menuAnchor(ExposedDropdownMenuAnchorType.PrimaryNotEditable, habilitado)
                .fillMaxWidth(),
        )
        ExposedDropdownMenu(expanded = abierto, onDismissRequest = { abierto = false }) {
            opciones.forEach { opcion ->
                DropdownMenuItem(
                    text = { Text(opcion.nombre) },
                    onClick = {
                        alSeleccionar(opcion.id)
                        abierto = false
                    },
                    contentPadding = ExposedDropdownMenuDefaults.ItemContentPadding,
                )
            }
        }
    }
}

/** Sección con cabecera que se pliega/despliega (Localización, Repetidor...). */
@Composable
fun SeccionPlegable(
    titulo: String,
    icono: ImageVector,
    inicialmenteAbierta: Boolean = false,
    resumen: String? = null,
    contenido: @Composable () -> Unit,
) {
    var abierta by rememberSaveable { mutableStateOf(inicialmenteAbierta) }
    val giro by animateFloatAsState(if (abierta) 180f else 0f, label = "giro")

    Surface(
        shape = MaterialTheme.shapes.medium,
        color = MaterialTheme.colorScheme.surfaceContainerLow,
        border = BorderStroke(1.dp, MaterialTheme.colorScheme.outlineVariant),
        modifier = Modifier.fillMaxWidth(),
    ) {
        Column {
            Row(
                Modifier
                    .fillMaxWidth()
                    .clickable { abierta = !abierta }
                    .padding(horizontal = 16.dp, vertical = 14.dp),
                verticalAlignment = Alignment.CenterVertically,
            ) {
                Icon(icono, contentDescription = null, tint = MaterialTheme.colorScheme.primary)
                Spacer(Modifier.width(12.dp))
                Column(Modifier.weight(1f)) {
                    Text(titulo, style = MaterialTheme.typography.titleSmall)
                    if (!abierta && !resumen.isNullOrBlank()) {
                        Text(resumen, style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onSurfaceVariant, maxLines = 1, overflow = TextOverflow.Ellipsis)
                    }
                }
                Icon(Icons.Filled.ExpandMore, contentDescription = null, modifier = Modifier.rotate(giro))
            }
            AnimatedVisibility(abierta, enter = expandVertically(), exit = shrinkVertically()) {
                Column(
                    Modifier.padding(start = 16.dp, end = 16.dp, bottom = 16.dp),
                    verticalArrangement = Arrangement.spacedBy(4.dp),
                ) { contenido() }
            }
        }
    }
}

/** Valoración 0–5 (campo `calidad`). */
@Composable
fun Calidad(valor: Int, alCambiar: ((Int) -> Unit)?, modifier: Modifier = Modifier) {
    Row(modifier, verticalAlignment = Alignment.CenterVertically) {
        (1..5).forEach { n ->
            val activa = n <= valor
            IconButton(
                onClick = { alCambiar?.invoke(if (valor == n) 0 else n) },
                enabled = alCambiar != null,
                modifier = Modifier.size(36.dp),
            ) {
                Icon(
                    if (activa) Icons.Filled.Star else Icons.Outlined.StarOutline,
                    contentDescription = "Calidad $n",
                    tint = if (activa) Paleta.Ambar else MaterialTheme.colorScheme.outline,
                )
            }
        }
    }
}

@Composable
fun DialogoConfirmar(
    titulo: String,
    texto: String,
    confirmar: String = "Eliminar",
    peligroso: Boolean = true,
    alConfirmar: () -> Unit,
    alCancelar: () -> Unit,
) {
    AlertDialog(
        onDismissRequest = alCancelar,
        title = { Text(titulo) },
        text = { Text(texto) },
        confirmButton = {
            Button(
                onClick = alConfirmar,
                colors = if (peligroso) ButtonDefaults.buttonColors(containerColor = MaterialTheme.colorScheme.error) else ButtonDefaults.buttonColors(),
            ) { Text(confirmar) }
        },
        dismissButton = { TextButton(onClick = alCancelar) { Text("Cancelar") } },
    )
}

@Composable
fun EstadoVacio(
    icono: ImageVector,
    titulo: String,
    texto: String,
    modifier: Modifier = Modifier,
    accion: String? = null,
    alPulsar: (() -> Unit)? = null,
    extra: @Composable (() -> Unit)? = null,
) {
    Column(
        modifier
            .fillMaxSize()
            .padding(32.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center,
    ) {
        Surface(shape = CircleShape, color = MaterialTheme.colorScheme.primaryContainer, modifier = Modifier.size(88.dp)) {
            Box(contentAlignment = Alignment.Center) {
                Icon(icono, contentDescription = null, tint = MaterialTheme.colorScheme.onPrimaryContainer, modifier = Modifier.size(40.dp))
            }
        }
        Spacer(Modifier.height(20.dp))
        Text(titulo, style = MaterialTheme.typography.titleLarge, textAlign = TextAlign.Center)
        Spacer(Modifier.height(8.dp))
        Text(texto, style = MaterialTheme.typography.bodyMedium, color = MaterialTheme.colorScheme.onSurfaceVariant, textAlign = TextAlign.Center)
        if (accion != null && alPulsar != null) {
            Spacer(Modifier.height(20.dp))
            FilledTonalButton(onClick = alPulsar) { Text(accion) }
        }
        extra?.let {
            Spacer(Modifier.height(12.dp))
            it()
        }
    }
}

@Composable
fun Cargando(modifier: Modifier = Modifier) {
    Box(modifier.fillMaxSize(), contentAlignment = Alignment.Center) { CircularProgressIndicator() }
}

/** Botón principal ancho con indicador de carga. */
@Composable
fun BotonPrincipal(texto: String, cargando: Boolean, alPulsar: () -> Unit, modifier: Modifier = Modifier, icono: ImageVector? = null) {
    Button(
        onClick = alPulsar,
        enabled = !cargando,
        modifier = modifier
            .fillMaxWidth()
            .height(52.dp),
        shape = RoundedCornerShape(14.dp),
    ) {
        if (cargando) {
            CircularProgressIndicator(Modifier.size(22.dp), strokeWidth = 2.dp, color = MaterialTheme.colorScheme.onPrimary)
        } else {
            icono?.let {
                Icon(it, contentDescription = null, modifier = Modifier.size(20.dp))
                Spacer(Modifier.width(8.dp))
            }
            Text(texto, fontWeight = FontWeight.SemiBold)
        }
    }
}

/** Etiqueta pequeña con color (tipo de contacto, estado...). */
@Composable
fun Etiqueta(texto: String, color: Color, modifier: Modifier = Modifier) {
    Surface(color = color.copy(alpha = 0.18f), shape = RoundedCornerShape(50), modifier = modifier) {
        Text(
            texto,
            color = color,
            style = MaterialTheme.typography.labelSmall,
            modifier = Modifier.padding(horizontal = 8.dp, vertical = 3.dp),
            maxLines = 1,
        )
    }
}
