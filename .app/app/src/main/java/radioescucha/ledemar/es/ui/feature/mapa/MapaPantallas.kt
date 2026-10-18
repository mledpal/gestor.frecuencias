package radioescucha.ledemar.es.ui.feature.mapa

import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.navigationBarsPadding
import androidx.compose.foundation.layout.padding
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.Check
import androidx.compose.material.icons.filled.Map
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.material3.TopAppBar
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.produceState
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.google.android.gms.maps.CameraUpdateFactory
import com.google.android.gms.maps.model.CameraPosition
import com.google.android.gms.maps.model.LatLng
import com.google.android.gms.maps.model.LatLngBounds
import com.google.maps.android.compose.GoogleMap
import com.google.maps.android.compose.MapProperties
import com.google.maps.android.compose.MapUiSettings
import com.google.maps.android.compose.Marker
import com.google.maps.android.compose.MarkerState
import com.google.maps.android.compose.rememberCameraPositionState
import com.google.maps.android.compose.rememberUpdatedMarkerState
import radioescucha.ledemar.es.BuildConfig
import radioescucha.ledemar.es.core.network.Contacto
import radioescucha.ledemar.es.core.network.Resultado
import radioescucha.ledemar.es.core.util.Formatos
import radioescucha.ledemar.es.ui.components.BotonPrincipal
import radioescucha.ledemar.es.ui.components.Cargando
import radioescucha.ledemar.es.ui.components.EstadoVacio
import radioescucha.ledemar.es.ui.contenedor
import radioescucha.ledemar.es.ui.feature.contactos.BotonMiUbicacion

/** Centro por defecto de GPSSearch.jsx (Linares). */
private val CentroPorDefecto = LatLng(38.095929, -3.634245)

@Composable
private fun AvisoSinClave(modifier: Modifier = Modifier) {
    EstadoVacio(
        Icons.Filled.Map,
        "Mapa no configurado",
        "Añade MAPS_API_KEY en local.properties (clave de Maps SDK for Android) y vuelve a compilar.",
        modifier,
    )
}

/**
 * Mapa de un punto GPS. Con `editable` se elige la posición tocando el mapa
 * (equivalente a GPSSearch.jsx) y se devuelve con `alConfirmar`.
 */
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun MapaPantalla(gpsInicial: String?, editable: Boolean, alConfirmar: (String) -> Unit, alVolver: () -> Unit) {
    val inicial = Formatos.parsearGps(gpsInicial)?.let { LatLng(it.first, it.second) }
    var punto by remember { mutableStateOf(inicial) }
    val camara = rememberCameraPositionState { position = CameraPosition.fromLatLngZoom(inicial ?: CentroPorDefecto, if (inicial != null) 13f else 6f) }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text(if (editable) "Elegir ubicación" else "Ubicación") },
                navigationIcon = { IconButton(onClick = alVolver) { Icon(Icons.AutoMirrored.Filled.ArrowBack, "Volver") } },
            )
        },
    ) { padding ->
        if (!BuildConfig.MAPS_CONFIGURADO) {
            AvisoSinClave(Modifier.padding(padding))
            return@Scaffold
        }
        Box(
            Modifier
                .padding(padding)
                .fillMaxSize(),
        ) {
            GoogleMap(
                modifier = Modifier.fillMaxSize(),
                cameraPositionState = camara,
                uiSettings = MapUiSettings(zoomControlsEnabled = false),
                onMapClick = { if (editable) punto = it },
            ) {
                punto?.let { Marker(state = rememberUpdatedMarkerState(it), title = Formatos.formatearGps(it.latitude, it.longitude)) }
            }

            if (editable) {
                Card(
                    modifier = Modifier
                        .align(Alignment.BottomCenter)
                        .fillMaxWidth()
                        .navigationBarsPadding()
                        .padding(16.dp),
                    colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceContainerHigh),
                ) {
                    Column(Modifier.padding(16.dp)) {
                        Text(
                            punto?.let { Formatos.formatearGps(it.latitude, it.longitude) } ?: "Toca el mapa para situar el contacto",
                            style = MaterialTheme.typography.titleSmall,
                        )
                        BotonMiUbicacion { gps ->
                            Formatos.parsearGps(gps)?.let {
                                punto = LatLng(it.first, it.second)
                                camara.move(CameraUpdateFactory.newLatLngZoom(punto!!, 14f))
                            }
                        }
                        BotonPrincipal(
                            "Usar esta ubicación",
                            cargando = false,
                            alPulsar = { punto?.let { alConfirmar(Formatos.formatearGps(it.latitude, it.longitude)) } },
                            icono = Icons.Filled.Check,
                        )
                    }
                }
            }
        }
    }
}

/**
 * Mapa con todas las frecuencias localizadas de un usuario (MapaFrecuencias.jsx, solo admin).
 */
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun MapaUsuarioPantalla(usuarioId: Int, username: String, alVolver: () -> Unit) {
    val container = contenedor()
    val resultado by produceState<Resultado<List<Contacto>>?>(null, usuarioId) {
        value = container.adminRepositorio.frecuenciasUsuario(usuarioId)
    }
    val camara = rememberCameraPositionState { position = CameraPosition.fromLatLngZoom(CentroPorDefecto, 5f) }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Frecuencias de $username") },
                navigationIcon = { IconButton(onClick = alVolver) { Icon(Icons.AutoMirrored.Filled.ArrowBack, "Volver") } },
            )
        },
    ) { padding ->
        val r = resultado
        when {
            !BuildConfig.MAPS_CONFIGURADO -> AvisoSinClave(Modifier.padding(padding))
            r == null -> Cargando(Modifier.padding(padding))
            r is Resultado.Error -> EstadoVacio(Icons.Filled.Map, "Error", r.mensaje, Modifier.padding(padding))
            r is Resultado.Ok -> {
                val puntos = r.datos.mapNotNull { c -> Formatos.parsearGps(c.localizacion?.gps)?.let { c to LatLng(it.first, it.second) } }
                LaunchedEffect(puntos) {
                    if (puntos.size == 1) {
                        camara.move(CameraUpdateFactory.newLatLngZoom(puntos.first().second, 12f))
                    } else if (puntos.size > 1) {
                        val limites = LatLngBounds.builder().apply { puntos.forEach { include(it.second) } }.build()
                        runCatching { camara.move(CameraUpdateFactory.newLatLngBounds(limites, 120)) }
                    }
                }
                GoogleMap(
                    modifier = Modifier
                        .padding(padding)
                        .fillMaxSize(),
                    cameraPositionState = camara,
                    properties = MapProperties(),
                ) {
                    puntos.forEach { (c, posicion) ->
                        Marker(
                            state = remember(c.id) { MarkerState(posicion) },
                            title = "${c.frecuencia} MHz",
                            snippet = listOfNotNull(c.nombre, c.localizacion?.localidad).joinToString(" · "),
                        )
                    }
                }
            }
        }
    }
}
