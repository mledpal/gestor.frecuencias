package radioescucha.ledemar.es.ui.feature.auth

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ColumnScope
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.imePadding
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.safeDrawingPadding
import androidx.compose.foundation.layout.widthIn
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.Login
import androidx.compose.material.icons.filled.Badge
import androidx.compose.material.icons.filled.Email
import androidx.compose.material.icons.filled.Lock
import androidx.compose.material.icons.filled.Person
import androidx.compose.material.icons.filled.SettingsInputAntenna
import androidx.compose.material.icons.filled.Visibility
import androidx.compose.material.icons.filled.VisibilityOff
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
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
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.lifecycle.ViewModel
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.lifecycle.viewModelScope
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import radioescucha.ledemar.es.core.network.RegistroPeticion
import radioescucha.ledemar.es.core.network.Resultado
import radioescucha.ledemar.es.data.AuthRepositorio
import radioescucha.ledemar.es.ui.appViewModel
import radioescucha.ledemar.es.ui.components.BotonPrincipal
import radioescucha.ledemar.es.ui.components.Campo
import radioescucha.ledemar.es.ui.components.Marca

data class AuthEstado(
    val cargando: Boolean = false,
    val error: String? = null,
    val errores: Map<String, String> = emptyMap(),
    val aviso: String? = null,
)

class AuthViewModel(private val repo: AuthRepositorio) : ViewModel() {

    private val _estado = MutableStateFlow(AuthEstado())
    val estado = _estado.asStateFlow()

    private fun ejecutar(bloque: suspend () -> Resultado<*>, alOk: (Any?) -> Unit = {}) {
        if (_estado.value.cargando) return
        _estado.value = AuthEstado(cargando = true)
        viewModelScope.launch {
            when (val r = bloque()) {
                is Resultado.Ok -> {
                    _estado.update { it.copy(cargando = false) }
                    alOk(r.datos)
                }
                is Resultado.Error -> _estado.value = AuthEstado(error = r.mensaje, errores = r.campos)
            }
        }
    }

    fun login(email: String, password: String) {
        if (email.isBlank() || password.isBlank()) {
            _estado.value = AuthEstado(error = "Introduce tu email y contraseña")
            return
        }
        ejecutar({ repo.login(email, password) })
    }

    fun registro(peticion: RegistroPeticion) = ejecutar({ repo.registro(peticion) })

    fun recuperar(email: String) = ejecutar({ repo.recuperarPassword(email) }) {
        _estado.update { it.copy(aviso = "Te hemos enviado un enlace para restablecer la contraseña a $email") }
    }

    fun limpiar() {
        _estado.value = AuthEstado()
    }
}

/** Fondo común de las pantallas de acceso. */
@Composable
private fun FondoAuth(contenido: @Composable ColumnScope.() -> Unit) {
    Column(
        Modifier
            .fillMaxSize()
            .background(
                Brush.verticalGradient(
                    listOf(MaterialTheme.colorScheme.primaryContainer.copy(alpha = 0.35f), MaterialTheme.colorScheme.background),
                ),
            )
            .safeDrawingPadding()
            .imePadding()
            .verticalScroll(rememberScrollState())
            .padding(24.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center,
    ) {
        Spacer(Modifier.height(24.dp))
        Marca()
        Spacer(Modifier.height(28.dp))
        Card(
            modifier = Modifier
                .fillMaxWidth()
                .widthIn(max = 480.dp),
            colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceContainer),
            shape = MaterialTheme.shapes.large,
        ) {
            Column(Modifier.padding(20.dp), verticalArrangement = Arrangement.spacedBy(4.dp)) { contenido() }
        }
    }
}

@Composable
private fun MensajeError(texto: String?) {
    if (texto != null) {
        Text(texto, color = MaterialTheme.colorScheme.error, style = MaterialTheme.typography.bodyMedium, modifier = Modifier.padding(vertical = 4.dp))
    }
}

@Composable
private fun CampoPassword(valor: String, alCambiar: (String) -> Unit, etiqueta: String, error: String? = null) {
    var visible by remember { mutableStateOf(false) }
    Campo(
        valor, alCambiar, etiqueta,
        icono = Icons.Filled.Lock,
        password = !visible,
        teclado = KeyboardType.Password,
        error = error,
        accion = {
            IconButton(onClick = { visible = !visible }) {
                Icon(if (visible) Icons.Filled.VisibilityOff else Icons.Filled.Visibility, contentDescription = "Mostrar contraseña")
            }
        },
    )
}

@Composable
fun LoginPantalla(alRegistro: () -> Unit, alRecuperar: () -> Unit) {
    val vm = appViewModel { AuthViewModel(it.authRepositorio) }
    val estado by vm.estado.collectAsStateWithLifecycle()
    var email by rememberSaveable { mutableStateOf("") }
    var password by rememberSaveable { mutableStateOf("") }

    FondoAuth {
        Text("Iniciar sesión", style = MaterialTheme.typography.headlineSmall)
        Text("Accede a tu banco de frecuencias", color = MaterialTheme.colorScheme.onSurfaceVariant)
        Spacer(Modifier.height(12.dp))
        Campo(email, { email = it }, "Email", icono = Icons.Filled.Email, teclado = KeyboardType.Email, error = estado.errores["email"])
        CampoPassword(password, { password = it }, "Contraseña", estado.errores["password"])
        MensajeError(estado.error.takeIf { estado.errores.isEmpty() })
        Spacer(Modifier.height(8.dp))
        BotonPrincipal("Entrar", estado.cargando, { vm.login(email, password) }, icono = Icons.AutoMirrored.Filled.Login)
        TextButton(onClick = { vm.limpiar(); alRecuperar() }, modifier = Modifier.align(Alignment.CenterHorizontally)) {
            Text("¿Has olvidado tu contraseña?")
        }
        TextButton(onClick = { vm.limpiar(); alRegistro() }, modifier = Modifier.align(Alignment.CenterHorizontally)) {
            Text("¿No tienes cuenta? Regístrate")
        }
    }
}

@Composable
fun RegistroPantalla(alVolver: () -> Unit) {
    val vm = appViewModel { AuthViewModel(it.authRepositorio) }
    val estado by vm.estado.collectAsStateWithLifecycle()
    var username by rememberSaveable { mutableStateOf("") }
    var nombre by rememberSaveable { mutableStateOf("") }
    var apellidos by rememberSaveable { mutableStateOf("") }
    var email by rememberSaveable { mutableStateOf("") }
    var indicativo by rememberSaveable { mutableStateOf("") }
    var password by rememberSaveable { mutableStateOf("") }
    var confirmacion by rememberSaveable { mutableStateOf("") }
    val e = estado.errores

    FondoAuth {
        Text("Crear cuenta", style = MaterialTheme.typography.headlineSmall)
        Spacer(Modifier.height(8.dp))
        Campo(username, { username = it }, "Usuario", icono = Icons.Filled.Person, error = e["username"])
        Campo(nombre, { nombre = it }, "Nombre", icono = Icons.Filled.Badge, error = e["nombre"])
        Campo(apellidos, { apellidos = it }, "Apellidos", icono = Icons.Filled.Badge, error = e["apellidos"])
        Campo(email, { email = it }, "Email", icono = Icons.Filled.Email, teclado = KeyboardType.Email, error = e["email"])
        Campo(indicativo, { indicativo = it.uppercase() }, "Indicativo (opcional)", icono = Icons.Filled.SettingsInputAntenna, error = e["indicativo"])
        CampoPassword(password, { password = it }, "Contraseña", e["password"])
        CampoPassword(confirmacion, { confirmacion = it }, "Repite la contraseña")
        MensajeError(estado.error.takeIf { e.isEmpty() })
        Spacer(Modifier.height(8.dp))
        BotonPrincipal("Registrarme", estado.cargando, {
            vm.registro(
                RegistroPeticion(
                    username = username.trim(),
                    nombre = nombre.trim(),
                    apellidos = apellidos.trim(),
                    email = email.trim(),
                    indicativo = indicativo.trim().ifBlank { null },
                    password = password,
                    confirmacion = confirmacion,
                ),
            )
        })
        TextButton(onClick = alVolver, modifier = Modifier.align(Alignment.CenterHorizontally)) {
            Text("Ya tengo cuenta")
        }
    }
}

@Composable
fun RecuperarPantalla(alVolver: () -> Unit) {
    val vm = appViewModel { AuthViewModel(it.authRepositorio) }
    val estado by vm.estado.collectAsStateWithLifecycle()
    var email by rememberSaveable { mutableStateOf("") }

    FondoAuth {
        Text("Recuperar contraseña", style = MaterialTheme.typography.headlineSmall)
        Text(
            "Escribe tu email y te enviaremos un enlace para crear una nueva contraseña.",
            color = MaterialTheme.colorScheme.onSurfaceVariant,
        )
        Spacer(Modifier.height(8.dp))
        Campo(email, { email = it }, "Email", icono = Icons.Filled.Email, teclado = KeyboardType.Email, error = estado.errores["email"])
        MensajeError(estado.error.takeIf { estado.errores.isEmpty() })
        estado.aviso?.let {
            Text(it, color = MaterialTheme.colorScheme.tertiary, textAlign = TextAlign.Start, modifier = Modifier.padding(vertical = 4.dp))
        }
        Spacer(Modifier.height(8.dp))
        BotonPrincipal("Enviar enlace", estado.cargando, { vm.recuperar(email) })
        TextButton(onClick = alVolver, modifier = Modifier.align(Alignment.CenterHorizontally)) {
            Text("Volver al inicio de sesión")
        }
    }
}
