package radioescucha.ledemar.es.ui.feature.perfil

import android.content.Intent
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.PickVisualMediaRequest
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.Logout
import androidx.compose.material.icons.filled.Badge
import androidx.compose.material.icons.filled.CameraAlt
import androidx.compose.material.icons.filled.DeleteForever
import androidx.compose.material.icons.filled.Email
import androidx.compose.material.icons.filled.Info
import androidx.compose.material.icons.filled.Lock
import androidx.compose.material.icons.filled.Map
import androidx.compose.material.icons.filled.Palette
import androidx.compose.material.icons.filled.Person
import androidx.compose.material.icons.filled.Place
import androidx.compose.material.icons.filled.Save
import androidx.compose.material.icons.filled.SettingsInputAntenna
import androidx.compose.material.icons.filled.VolunteerActivism
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.Scaffold
import androidx.compose.material3.SegmentedButton
import androidx.compose.material3.SegmentedButtonDefaults
import androidx.compose.material3.SingleChoiceSegmentedButtonRow
import androidx.compose.material3.SmallFloatingActionButton
import androidx.compose.material3.SnackbarHost
import androidx.compose.material3.SnackbarHostState
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.material3.TopAppBar
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
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.dp
import androidx.core.net.toUri
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import kotlinx.coroutines.launch
import radioescucha.ledemar.es.BuildConfig
import radioescucha.ledemar.es.core.datastore.Tema
import radioescucha.ledemar.es.core.network.Localizacion
import radioescucha.ledemar.es.core.network.PerfilPeticion
import radioescucha.ledemar.es.core.network.Resultado
import radioescucha.ledemar.es.ui.components.Avatar
import radioescucha.ledemar.es.ui.components.BotonPrincipal
import radioescucha.ledemar.es.ui.components.Campo
import radioescucha.ledemar.es.ui.components.DialogoConfirmar
import radioescucha.ledemar.es.ui.components.Etiqueta
import radioescucha.ledemar.es.ui.components.SeccionPlegable
import radioescucha.ledemar.es.ui.contenedor
import radioescucha.ledemar.es.ui.feature.contactos.BotonMiUbicacion
import radioescucha.ledemar.es.ui.theme.Paleta

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun PerfilPantalla(
    gpsElegido: String?,
    alConsumirGps: () -> Unit,
    alAbrirMapa: (String?) -> Unit,
) {
    val container = contenedor()
    val repo = container.perfilRepositorio
    val usuario by container.sesion.usuario.collectAsStateWithLifecycle()
    val tema by container.sesion.tema.collectAsStateWithLifecycle(Tema.OSCURO)
    val scope = rememberCoroutineScope()
    val snackbar = remember { SnackbarHostState() }
    val context = LocalContext.current
    val u = usuario ?: return

    var nombre by rememberSaveable(u.id) { mutableStateOf(u.nombre.orEmpty()) }
    var apellidos by rememberSaveable(u.id) { mutableStateOf(u.apellidos.orEmpty()) }
    var email by rememberSaveable(u.id) { mutableStateOf(u.email.orEmpty()) }
    var indicativo by rememberSaveable(u.id) { mutableStateOf(u.indicativo.orEmpty()) }
    var localidad by rememberSaveable(u.id) { mutableStateOf(u.localizacion?.localidad.orEmpty()) }
    var provincia by rememberSaveable(u.id) { mutableStateOf(u.localizacion?.provincia.orEmpty()) }
    var pais by rememberSaveable(u.id) { mutableStateOf(u.localizacion?.pais ?: "España") }
    var gps by rememberSaveable(u.id) { mutableStateOf(u.localizacion?.gps.orEmpty()) }
    var actual by rememberSaveable { mutableStateOf("") }
    var nueva by rememberSaveable { mutableStateOf("") }
    var confirmacion by rememberSaveable { mutableStateOf("") }

    var errores by remember { mutableStateOf<Map<String, String>>(emptyMap()) }
    var guardando by remember { mutableStateOf<String?>(null) }
    var subiendoFoto by remember { mutableStateOf(false) }
    var confirmarSalir by remember { mutableStateOf(false) }
    var borrarCuenta by remember { mutableStateOf(false) }

    LaunchedEffect(gpsElegido) {
        gpsElegido?.let { gps = it; alConsumirGps() }
    }

    fun <T> ejecutar(seccion: String, ok: String, bloque: suspend () -> Resultado<T>, despues: () -> Unit = {}) {
        guardando = seccion
        scope.launch {
            when (val r = bloque()) {
                is Resultado.Ok -> { errores = emptyMap(); despues(); snackbar.showSnackbar(ok) }
                is Resultado.Error -> { errores = r.campos; snackbar.showSnackbar(r.mensaje) }
            }
            guardando = null
        }
    }

    val selectorFoto = rememberLauncherForActivityResult(ActivityResultContracts.PickVisualMedia()) { uri ->
        if (uri == null) return@rememberLauncherForActivityResult
        subiendoFoto = true
        scope.launch {
            val bytes = Imagen.prepararAvatar(context, uri)
            val r = if (bytes != null) repo.subirFoto(bytes) else Resultado.Error("No se pudo leer la imagen")
            snackbar.showSnackbar(if (r is Resultado.Error) r.mensaje else "Foto actualizada")
            subiendoFoto = false
        }
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Perfil") },
                actions = { IconButton(onClick = { confirmarSalir = true }) { Icon(Icons.AutoMirrored.Filled.Logout, "Cerrar sesión") } },
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
            // ---- Cabecera ----
            Column(Modifier.fillMaxWidth(), horizontalAlignment = Alignment.CenterHorizontally) {
                Box {
                    Avatar(u.photo, tamano = 112.dp, admin = u.isAdmin)
                    SmallFloatingActionButton(
                        onClick = { selectorFoto.launch(PickVisualMediaRequest(ActivityResultContracts.PickVisualMedia.ImageOnly)) },
                        modifier = Modifier.align(Alignment.BottomEnd),
                        shape = CircleShape,
                    ) {
                        if (subiendoFoto) CircularProgressIndicator(Modifier.size(18.dp), strokeWidth = 2.dp) else Icon(Icons.Filled.CameraAlt, "Cambiar foto")
                    }
                }
                Spacer(Modifier.height(12.dp))
                Text(u.username, style = MaterialTheme.typography.headlineSmall)
                if (!u.indicativo.isNullOrBlank()) Text(u.indicativo, style = MaterialTheme.typography.titleSmall, color = MaterialTheme.colorScheme.primary)
                Text(u.email.orEmpty(), style = MaterialTheme.typography.bodyMedium, color = MaterialTheme.colorScheme.onSurfaceVariant)
                if (u.isAdmin) {
                    Spacer(Modifier.height(6.dp))
                    Etiqueta(if (u.isRoot) "Root" else "Administrador", Paleta.Ambar)
                }
            }

            // ---- Datos personales ----
            SeccionPlegable("Datos personales", Icons.Filled.Person, inicialmenteAbierta = true) {
                Campo(nombre, { nombre = it }, "Nombre", icono = Icons.Filled.Badge, error = errores["nombre"])
                Campo(apellidos, { apellidos = it }, "Apellidos", icono = Icons.Filled.Badge, error = errores["apellidos"])
                Campo(email, { email = it }, "Email", icono = Icons.Filled.Email, teclado = KeyboardType.Email, error = errores["email"])
                Campo(indicativo, { indicativo = it.uppercase() }, "Indicativo", icono = Icons.Filled.SettingsInputAntenna, error = errores["indicativo"])
                BotonPrincipal("Guardar datos", guardando == "datos", {
                    ejecutar("datos", "Datos actualizados", {
                        repo.actualizar(PerfilPeticion(nombre.trim(), apellidos.trim(), email.trim(), indicativo.trim().ifBlank { null }))
                    })
                }, icono = Icons.Filled.Save)
            }

            // ---- Localización ----
            SeccionPlegable("Mi localización", Icons.Filled.Place, resumen = listOf(localidad, provincia).filter { it.isNotBlank() }.joinToString(", ")) {
                Campo(localidad, { localidad = it }, "Localidad")
                Campo(provincia, { provincia = it }, "Provincia")
                Campo(pais, { pais = it }, "País")
                Campo(
                    gps, { gps = it }, "GPS (lat,lng)",
                    accion = { IconButton(onClick = { alAbrirMapa(gps.ifBlank { null }) }) { Icon(Icons.Filled.Map, "Elegir en el mapa") } },
                )
                BotonMiUbicacion { gps = it }
                BotonPrincipal("Guardar localización", guardando == "localizacion", {
                    ejecutar("localizacion", "Localización actualizada", {
                        repo.localizacion(
                            Localizacion(
                                localidad = localidad.trim().ifBlank { null },
                                provincia = provincia.trim().ifBlank { null },
                                pais = pais.trim().ifBlank { null },
                                gps = gps.replace(" ", "").ifBlank { null },
                            ),
                        )
                    })
                }, icono = Icons.Filled.Save)
            }

            // ---- Contraseña ----
            SeccionPlegable("Cambiar contraseña", Icons.Filled.Lock) {
                Campo(actual, { actual = it }, "Contraseña actual", password = true, error = errores["current_password"])
                Campo(nueva, { nueva = it }, "Nueva contraseña", password = true, error = errores["password"])
                Campo(confirmacion, { confirmacion = it }, "Repite la nueva contraseña", password = true)
                BotonPrincipal("Actualizar contraseña", guardando == "password", {
                    ejecutar("password", "Contraseña actualizada", { repo.cambiarPassword(actual, nueva, confirmacion) }) {
                        actual = ""; nueva = ""; confirmacion = ""
                    }
                }, icono = Icons.Filled.Lock)
            }

            // ---- Apariencia ----
            SeccionPlegable("Apariencia", Icons.Filled.Palette) {
                SingleChoiceSegmentedButtonRow(Modifier.fillMaxWidth()) {
                    listOf(Tema.SISTEMA to "Sistema", Tema.CLARO to "Claro", Tema.OSCURO to "Oscuro").forEachIndexed { i, (valor, texto) ->
                        SegmentedButton(tema == valor, { scope.launch { container.sesion.guardarTema(valor) } }, SegmentedButtonDefaults.itemShape(i, 3)) { Text(texto) }
                    }
                }
            }

            // ---- Acerca de ----
            SeccionPlegable("Acerca de", Icons.Filled.Info) {
                Text("Radioescucha · Gestor de frecuencias", style = MaterialTheme.typography.titleSmall)
                Text("Versión ${BuildConfig.VERSION_NAME}", color = MaterialTheme.colorScheme.onSurfaceVariant)
                Text("App para registrar las escuchas de radioaficionados: frecuencias, ubicaciones, repetidores y codificación.")
                TextButton(onClick = { context.startActivity(Intent(Intent.ACTION_VIEW, "https://radioescucha.es".toUri())) }) { Text("radioescucha.es") }
                TextButton(onClick = { context.startActivity(Intent(Intent.ACTION_VIEW, "https://paypal.me/migueldj80?country.x=ES&locale.x=es_ES".toUri())) }) {
                    Icon(Icons.Filled.VolunteerActivism, null)
                    Text("  Apoyar el proyecto")
                }
            }

            OutlinedButton(onClick = { confirmarSalir = true }, modifier = Modifier.fillMaxWidth()) {
                Icon(Icons.AutoMirrored.Filled.Logout, null)
                Text("  Cerrar sesión")
            }
            TextButton(
                onClick = { borrarCuenta = true },
                colors = ButtonDefaults.textButtonColors(contentColor = MaterialTheme.colorScheme.error),
                modifier = Modifier.fillMaxWidth(),
            ) {
                Icon(Icons.Filled.DeleteForever, null)
                Text("  Eliminar mi cuenta")
            }
            Spacer(Modifier.height(24.dp))
        }
    }

    if (confirmarSalir) {
        DialogoConfirmar(
            titulo = "Cerrar sesión",
            texto = "¿Quieres cerrar la sesión en este dispositivo?",
            confirmar = "Cerrar sesión",
            peligroso = false,
            alConfirmar = {
                confirmarSalir = false
                scope.launch { container.authRepositorio.logout() }
            },
            alCancelar = { confirmarSalir = false },
        )
    }

    if (borrarCuenta) {
        var password by remember { mutableStateOf("") }
        var error by remember { mutableStateOf<String?>(null) }
        AlertDialog(
            onDismissRequest = { borrarCuenta = false },
            icon = { Icon(Icons.Filled.DeleteForever, null) },
            title = { Text("Eliminar cuenta") },
            text = {
                Column {
                    Text("Se borrarán tu cuenta y todos tus contactos. Escribe tu contraseña para confirmar.")
                    Spacer(Modifier.height(8.dp))
                    Campo(password, { password = it }, "Contraseña", password = true, error = error)
                }
            },
            confirmButton = {
                Button(
                    onClick = {
                        scope.launch {
                            when (val r = repo.eliminarCuenta(password)) {
                                is Resultado.Ok -> borrarCuenta = false
                                is Resultado.Error -> error = r.campos["password"] ?: r.mensaje
                            }
                        }
                    },
                    enabled = password.isNotBlank(),
                    colors = ButtonDefaults.buttonColors(containerColor = MaterialTheme.colorScheme.error),
                ) { Text("Eliminar") }
            },
            dismissButton = { TextButton(onClick = { borrarCuenta = false }) { Text("Cancelar") } },
        )
    }
}
