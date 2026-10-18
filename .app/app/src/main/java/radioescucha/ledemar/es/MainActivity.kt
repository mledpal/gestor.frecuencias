package radioescucha.ledemar.es

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.animation.Crossfade
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.core.splashscreen.SplashScreen.Companion.installSplashScreen
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import radioescucha.ledemar.es.core.datastore.Tema
import radioescucha.ledemar.es.navigation.NavegacionAuth
import radioescucha.ledemar.es.navigation.NavegacionPrincipal
import radioescucha.ledemar.es.ui.theme.RadioescuchaTheme

class MainActivity : ComponentActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        val container = (application as RadioescuchaApp).container
        // El splash se mantiene hasta saber si hay sesión guardada.
        installSplashScreen().setKeepOnScreenCondition { container.sesion.autenticado.value == null }
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()

        setContent {
            val tema by container.sesion.tema.collectAsStateWithLifecycle(Tema.OSCURO)
            val autenticado by container.sesion.autenticado.collectAsStateWithLifecycle()

            LaunchedEffect(autenticado) {
                when (autenticado) {
                    true -> container.authRepositorio.refrescarUsuario()
                    false -> container.alCerrarSesion()
                    null -> Unit
                }
            }

            RadioescuchaTheme(tema) {
                Surface(Modifier.fillMaxSize(), color = MaterialTheme.colorScheme.background) {
                    Crossfade(autenticado, label = "sesion") { estado ->
                        when (estado) {
                            true -> NavegacionPrincipal()
                            false -> NavegacionAuth()
                            null -> Unit
                        }
                    }
                }
            }
        }
    }
}
