package radioescucha.ledemar.es.navigation

import androidx.compose.animation.AnimatedContentTransitionScope
import androidx.compose.animation.core.tween
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.foundation.layout.WindowInsets
import androidx.compose.foundation.layout.consumeWindowInsets
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.AdminPanelSettings
import androidx.compose.material.icons.filled.Forum
import androidx.compose.material.icons.filled.Person
import androidx.compose.material.icons.filled.Search
import androidx.compose.material.icons.filled.SettingsInputAntenna
import androidx.compose.material.icons.outlined.AdminPanelSettings
import androidx.compose.material.icons.outlined.Forum
import androidx.compose.material.icons.outlined.Person
import androidx.compose.material.icons.outlined.Search
import androidx.compose.material.icons.outlined.SettingsInputAntenna
import androidx.compose.material3.Icon
import androidx.compose.material3.NavigationBar
import androidx.compose.material3.NavigationBarItem
import androidx.compose.material3.Scaffold
import androidx.compose.material3.SnackbarHost
import androidx.compose.material3.SnackbarHostState
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.navigation.NavBackStackEntry
import androidx.navigation.NavDestination.Companion.hasRoute
import androidx.navigation.NavDestination.Companion.hierarchy
import androidx.navigation.NavGraph.Companion.findStartDestination
import androidx.navigation.NavHostController
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.currentBackStackEntryAsState
import androidx.navigation.compose.rememberNavController
import androidx.navigation.toRoute
import kotlinx.coroutines.launch
import kotlinx.serialization.Serializable
import radioescucha.ledemar.es.ui.contenedor
import radioescucha.ledemar.es.ui.feature.admin.AdminPantalla
import radioescucha.ledemar.es.ui.feature.admin.AdminUsuariosPantalla
import radioescucha.ledemar.es.ui.feature.admin.TiposCodificacionPantalla
import radioescucha.ledemar.es.ui.feature.admin.TiposContactoPantalla
import radioescucha.ledemar.es.ui.feature.auth.LoginPantalla
import radioescucha.ledemar.es.ui.feature.auth.RecuperarPantalla
import radioescucha.ledemar.es.ui.feature.auth.RegistroPantalla
import radioescucha.ledemar.es.ui.feature.buscar.BuscarPantalla
import radioescucha.ledemar.es.ui.feature.contactos.ContactoPantalla
import radioescucha.ledemar.es.ui.feature.contactos.ContactosPantalla
import radioescucha.ledemar.es.ui.feature.mapa.MapaPantalla
import radioescucha.ledemar.es.ui.feature.mapa.MapaUsuarioPantalla
import radioescucha.ledemar.es.ui.feature.mensajes.BuscarUsuariosPantalla
import radioescucha.ledemar.es.ui.feature.mensajes.ChatPantalla
import radioescucha.ledemar.es.ui.feature.mensajes.ConversacionesPantalla
import radioescucha.ledemar.es.ui.feature.perfil.PerfilPantalla
import kotlin.reflect.KClass

// Rutas type-safe. Sustituyen al router manual por `vista` de Vistas.jsx.

@Serializable object RutaLogin
@Serializable object RutaRegistro
@Serializable object RutaRecuperar

@Serializable object RutaContactos
@Serializable object RutaBuscar
@Serializable object RutaMensajes
@Serializable object RutaPerfil
@Serializable object RutaAdmin

/** `id == null` crea un contacto nuevo. */
@Serializable data class RutaContacto(val id: Int? = null)
@Serializable data class RutaMapa(val gps: String? = null, val editable: Boolean = false)
@Serializable data class RutaChat(val usuarioId: Int, val username: String)
@Serializable object RutaBuscarUsuarios
@Serializable object RutaAdminUsuarios
@Serializable object RutaAdminTiposContacto
@Serializable object RutaAdminTiposCodificacion
@Serializable data class RutaMapaUsuario(val usuarioId: Int, val username: String)

private const val CLAVE_GPS = "gps"

private data class Pestana(val ruta: Any, val clase: KClass<*>, val texto: String, val icono: ImageVector, val iconoActivo: ImageVector)

private fun entrada(): AnimatedContentTransitionScope<NavBackStackEntry>.() -> androidx.compose.animation.EnterTransition = {
    slideIntoContainer(AnimatedContentTransitionScope.SlideDirection.Start, tween(280)) + fadeIn(tween(280))
}

private fun salida(): AnimatedContentTransitionScope<NavBackStackEntry>.() -> androidx.compose.animation.ExitTransition = {
    slideOutOfContainer(AnimatedContentTransitionScope.SlideDirection.End, tween(280)) + fadeOut(tween(200))
}

@Composable
fun NavegacionAuth() {
    val nav = rememberNavController()
    NavHost(nav, startDestination = RutaLogin, enterTransition = { fadeIn(tween(250)) }, exitTransition = { fadeOut(tween(200)) }) {
        composable<RutaLogin> {
            LoginPantalla(alRegistro = { nav.navigate(RutaRegistro) }, alRecuperar = { nav.navigate(RutaRecuperar) })
        }
        composable<RutaRegistro> { RegistroPantalla(alVolver = { nav.popBackStack() }) }
        composable<RutaRecuperar> { RecuperarPantalla(alVolver = { nav.popBackStack() }) }
    }
}

/** Devuelve el GPS elegido en el mapa a la pantalla que lo abrió. */
private fun NavHostController.devolverGps(gps: String) {
    previousBackStackEntry?.savedStateHandle?.set(CLAVE_GPS, gps)
    popBackStack()
}

@Composable
private fun gpsDevuelto(entrada: NavBackStackEntry): String? =
    entrada.savedStateHandle.getStateFlow<String?>(CLAVE_GPS, null).collectAsStateWithLifecycle().value

@Composable
fun NavegacionPrincipal() {
    val container = contenedor()
    val usuario by container.sesion.usuario.collectAsStateWithLifecycle()
    val nav = rememberNavController()
    val snackbar = remember { SnackbarHostState() }
    val scope = rememberCoroutineScope()
    val actual by nav.currentBackStackEntryAsState()

    val pestanas = buildList {
        add(Pestana(RutaContactos, RutaContactos::class, "Contactos", Icons.Outlined.SettingsInputAntenna, Icons.Filled.SettingsInputAntenna))
        add(Pestana(RutaBuscar, RutaBuscar::class, "Buscar", Icons.Outlined.Search, Icons.Filled.Search))
        add(Pestana(RutaMensajes, RutaMensajes::class, "Mensajes", Icons.Outlined.Forum, Icons.Filled.Forum))
        add(Pestana(RutaPerfil, RutaPerfil::class, "Perfil", Icons.Outlined.Person, Icons.Filled.Person))
        if (usuario?.isAdmin == true) add(Pestana(RutaAdmin, RutaAdmin::class, "Admin", Icons.Outlined.AdminPanelSettings, Icons.Filled.AdminPanelSettings))
    }
    val enPestana = pestanas.any { p -> actual?.destination?.hierarchy?.any { it.hasRoute(p.clase) } == true }

    fun irAPestana(ruta: Any) = nav.navigate(ruta) {
        popUpTo(nav.graph.findStartDestination().id) { saveState = true }
        launchSingleTop = true
        restoreState = true
    }

    fun volverConMensaje(mensaje: String?) {
        nav.popBackStack()
        mensaje?.let { scope.launch { snackbar.showSnackbar(it) } }
    }

    Scaffold(
        contentWindowInsets = WindowInsets(0),
        snackbarHost = { SnackbarHost(snackbar) },
        bottomBar = {
            if (enPestana) {
                NavigationBar {
                    pestanas.forEach { p ->
                        val seleccionada = actual?.destination?.hierarchy?.any { it.hasRoute(p.clase) } == true
                        NavigationBarItem(
                            selected = seleccionada,
                            onClick = { irAPestana(p.ruta) },
                            icon = { Icon(if (seleccionada) p.iconoActivo else p.icono, contentDescription = null) },
                            label = { Text(p.texto) },
                        )
                    }
                }
            }
        },
    ) { padding ->
        NavHost(
            nav,
            startDestination = RutaContactos,
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .consumeWindowInsets(padding),
            enterTransition = { fadeIn(tween(220)) },
            exitTransition = { fadeOut(tween(180)) },
        ) {
            // ---- Pestañas ----
            composable<RutaContactos> {
                ContactosPantalla(
                    alAbrir = { nav.navigate(RutaContacto(it)) },
                    alNuevo = { nav.navigate(RutaContacto()) },
                    alBuscar = { irAPestana(RutaBuscar) },
                )
            }
            composable<RutaBuscar> { BuscarPantalla(alVerResultados = { irAPestana(RutaContactos) }) }
            composable<RutaMensajes> {
                ConversacionesPantalla(
                    alAbrirChat = { id, nombre -> nav.navigate(RutaChat(id, nombre)) },
                    alBuscarUsuarios = { nav.navigate(RutaBuscarUsuarios) },
                )
            }
            composable<RutaPerfil> { entrada ->
                PerfilPantalla(
                    gpsElegido = gpsDevuelto(entrada),
                    alConsumirGps = { entrada.savedStateHandle[CLAVE_GPS] = null },
                    alAbrirMapa = { nav.navigate(RutaMapa(it, editable = true)) },
                )
            }
            composable<RutaAdmin> {
                AdminPantalla(
                    alUsuarios = { nav.navigate(RutaAdminUsuarios) },
                    alTiposContacto = { nav.navigate(RutaAdminTiposContacto) },
                    alTiposCodificacion = { nav.navigate(RutaAdminTiposCodificacion) },
                )
            }

            // ---- Pantallas de detalle ----
            composable<RutaContacto>(enterTransition = entrada(), popExitTransition = salida()) { entrada ->
                ContactoPantalla(
                    id = entrada.toRoute<RutaContacto>().id,
                    gpsElegido = gpsDevuelto(entrada),
                    alConsumirGps = { entrada.savedStateHandle[CLAVE_GPS] = null },
                    alAbrirMapa = { gps, editable -> nav.navigate(RutaMapa(gps, editable)) },
                    alAbrirChat = { id, nombre -> nav.navigate(RutaChat(id, nombre)) },
                    alVolver = ::volverConMensaje,
                )
            }
            composable<RutaMapa>(enterTransition = entrada(), popExitTransition = salida()) { entrada ->
                val ruta = entrada.toRoute<RutaMapa>()
                MapaPantalla(ruta.gps, ruta.editable, alConfirmar = { nav.devolverGps(it) }, alVolver = { nav.popBackStack() })
            }
            composable<RutaChat>(enterTransition = entrada(), popExitTransition = salida()) { entrada ->
                val ruta = entrada.toRoute<RutaChat>()
                ChatPantalla(ruta.usuarioId, ruta.username, alVolver = { nav.popBackStack() })
            }
            composable<RutaBuscarUsuarios>(enterTransition = entrada(), popExitTransition = salida()) {
                BuscarUsuariosPantalla(
                    alAbrirChat = { id, nombre -> nav.navigate(RutaChat(id, nombre)) { popUpTo<RutaBuscarUsuarios> { inclusive = true } } },
                    alVolver = { nav.popBackStack() },
                )
            }
            composable<RutaAdminUsuarios>(enterTransition = entrada(), popExitTransition = salida()) {
                AdminUsuariosPantalla(alVerMapa = { id, nombre -> nav.navigate(RutaMapaUsuario(id, nombre)) }, alVolver = { nav.popBackStack() })
            }
            composable<RutaAdminTiposContacto>(enterTransition = entrada(), popExitTransition = salida()) { TiposContactoPantalla(alVolver = { nav.popBackStack() }) }
            composable<RutaAdminTiposCodificacion>(enterTransition = entrada(), popExitTransition = salida()) { TiposCodificacionPantalla(alVolver = { nav.popBackStack() }) }
            composable<RutaMapaUsuario>(enterTransition = entrada(), popExitTransition = salida()) { entrada ->
                val ruta = entrada.toRoute<RutaMapaUsuario>()
                MapaUsuarioPantalla(ruta.usuarioId, ruta.username, alVolver = { nav.popBackStack() })
            }
        }
    }
}
