package radioescucha.ledemar.es.ui

import androidx.compose.runtime.Composable
import androidx.compose.ui.platform.LocalContext
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.lifecycle.viewmodel.initializer
import androidx.lifecycle.viewmodel.viewModelFactory
import radioescucha.ledemar.es.AppContainer
import radioescucha.ledemar.es.RadioescuchaApp

/** Contenedor de dependencias desde cualquier composable. */
@Composable
fun contenedor(): AppContainer = (LocalContext.current.applicationContext as RadioescuchaApp).container

/**
 * Crea (o recupera) un ViewModel construido a partir del [AppContainer].
 * `clave` permite tener varias instancias del mismo tipo (p. ej. un chat por usuario).
 */
@Composable
inline fun <reified VM : ViewModel> appViewModel(
    clave: String? = null,
    crossinline crear: (AppContainer) -> VM,
): VM {
    val container = contenedor()
    return viewModel(key = clave, factory = viewModelFactory { initializer { crear(container) } })
}
