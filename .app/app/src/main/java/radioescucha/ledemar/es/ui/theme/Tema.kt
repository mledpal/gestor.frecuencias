package radioescucha.ledemar.es.ui.theme

import android.app.Activity
import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.ColorScheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Shapes
import androidx.compose.material3.Typography
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.runtime.Immutable
import androidx.compose.runtime.SideEffect
import androidx.compose.runtime.staticCompositionLocalOf
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalView
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.Font
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.core.view.WindowCompat
import radioescucha.ledemar.es.R
import radioescucha.ledemar.es.core.datastore.Tema

// Identidad visual "escáner de radio" (resources/css/app.css): chasis oscuro,
// display LCD ámbar y LEDs RX/TX. El tema claro usa los tonos del logo.

val FuenteLcd = FontFamily(
    Font(R.font.ds_digital, FontWeight.Normal),
    Font(R.font.ds_digital_bold, FontWeight.Bold),
)
val FuenteMarca = FontFamily(Font(R.font.ethnocentric))

object Paleta {
    val Ambar = Color(0xFFFFB000)
    val AmbarApagado = Color(0xFF3A2C08)
    val FondoLcd = Color(0xFF1A1405)
    val LedRx = Color(0xFF39FF14)
    val LedTx = Color(0xFFFF3131)
    val Naranja = Color(0xFFD98546)
    val Marino = Color(0xFF16233B)
    val Crema = Color(0xFFF7F1E3)
}

private val Oscuro = darkColorScheme(
    primary = Paleta.Ambar,
    onPrimary = Color(0xFF221800),
    primaryContainer = Color(0xFF3D2E00),
    onPrimaryContainer = Color(0xFFFFDEA0),
    secondary = Color(0xFF8FA3D6),
    onSecondary = Color(0xFF0E1A33),
    secondaryContainer = Color(0xFF26314A),
    onSecondaryContainer = Color(0xFFD9E2FF),
    tertiary = Color(0xFF6EE7A0),
    onTertiary = Color(0xFF00391E),
    tertiaryContainer = Color(0xFF0F3B27),
    onTertiaryContainer = Color(0xFFB7F5CF),
    background = Color(0xFF0F1115),
    onBackground = Color(0xFFE4E6EB),
    surface = Color(0xFF0F1115),
    onSurface = Color(0xFFE4E6EB),
    surfaceVariant = Color(0xFF242A32),
    onSurfaceVariant = Color(0xFFA9B1BE),
    surfaceContainerLowest = Color(0xFF0A0B0D),
    surfaceContainerLow = Color(0xFF14171C),
    surfaceContainer = Color(0xFF1A1E24),
    surfaceContainerHigh = Color(0xFF20252C),
    surfaceContainerHighest = Color(0xFF2A3038),
    outline = Color(0xFF4A525E),
    outlineVariant = Color(0xFF2A2F36),
    error = Color(0xFFFF6B6B),
    onError = Color(0xFF3B0000),
    errorContainer = Color(0xFF5C1414),
    onErrorContainer = Color(0xFFFFDAD6),
)

private val Claro = lightColorScheme(
    primary = Color(0xFFB45309),
    onPrimary = Color.White,
    primaryContainer = Color(0xFFFFDDB8),
    onPrimaryContainer = Color(0xFF2E1500),
    secondary = Paleta.Marino,
    onSecondary = Color.White,
    secondaryContainer = Color(0xFFDCE3F5),
    onSecondaryContainer = Color(0xFF111C30),
    tertiary = Color(0xFF15803D),
    onTertiary = Color.White,
    tertiaryContainer = Color(0xFFC9F2D6),
    onTertiaryContainer = Color(0xFF00210C),
    background = Color(0xFFFAF7F0),
    onBackground = Color(0xFF1C1B19),
    surface = Color(0xFFFAF7F0),
    onSurface = Color(0xFF1C1B19),
    surfaceVariant = Color(0xFFEDE6D8),
    onSurfaceVariant = Color(0xFF4F4639),
    surfaceContainerLowest = Color.White,
    surfaceContainerLow = Color(0xFFF5F1E8),
    surfaceContainer = Color(0xFFEFEADF),
    surfaceContainerHigh = Color(0xFFE9E3D7),
    surfaceContainerHighest = Color(0xFFE3DDD0),
    outline = Color(0xFF80776A),
    outlineVariant = Color(0xFFD3CABB),
)

/** Colores propios del display LCD, distintos en claro y oscuro. */
@Immutable
data class ColoresLcd(val fondo: Color, val texto: Color, val apagado: Color, val borde: Color)

val LocalColoresLcd = staticCompositionLocalOf {
    ColoresLcd(Paleta.FondoLcd, Paleta.Ambar, Paleta.AmbarApagado, Color(0xFF2A2F36))
}

private val Formas = Shapes(
    extraSmall = RoundedCornerShape(6.dp),
    small = RoundedCornerShape(10.dp),
    medium = RoundedCornerShape(16.dp),
    large = RoundedCornerShape(22.dp),
    extraLarge = RoundedCornerShape(28.dp),
)

private val base = Typography()
private val Tipografia = base.copy(
    headlineMedium = base.headlineMedium.copy(fontWeight = FontWeight.Bold),
    titleLarge = base.titleLarge.copy(fontWeight = FontWeight.SemiBold),
    titleMedium = base.titleMedium.copy(fontWeight = FontWeight.SemiBold),
    labelLarge = base.labelLarge.copy(fontWeight = FontWeight.SemiBold),
)

/** Estilo del texto de las frecuencias (fuente DS-Digital). */
fun estiloLcd(tamano: Int) = TextStyle(fontFamily = FuenteLcd, fontSize = tamano.sp, letterSpacing = 1.sp)

@Composable
fun RadioescuchaTheme(tema: Tema = Tema.OSCURO, contenido: @Composable () -> Unit) {
    val oscuro = when (tema) {
        Tema.SISTEMA -> isSystemInDarkTheme()
        Tema.CLARO -> false
        Tema.OSCURO -> true
    }
    val esquema: ColorScheme = if (oscuro) Oscuro else Claro
    val lcd = if (oscuro) {
        ColoresLcd(Paleta.FondoLcd, Paleta.Ambar, Paleta.AmbarApagado, Color(0xFF2A2F36))
    } else {
        ColoresLcd(Color(0xFF1E2A1C), Color(0xFFB7F5A0), Color(0xFF2E3D2B), Color(0xFF9AA59A))
    }

    val vista = LocalView.current
    if (!vista.isInEditMode) {
        SideEffect {
            val ventana = (vista.context as Activity).window
            WindowCompat.getInsetsController(ventana, vista).apply {
                isAppearanceLightStatusBars = !oscuro
                isAppearanceLightNavigationBars = !oscuro
            }
        }
    }

    androidx.compose.runtime.CompositionLocalProvider(LocalColoresLcd provides lcd) {
        MaterialTheme(colorScheme = esquema, typography = Tipografia, shapes = Formas, content = contenido)
    }
}
