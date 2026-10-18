package radioescucha.ledemar.es.ui.feature.comentarios

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.imePadding
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.Send
import androidx.compose.material.icons.filled.Delete
import androidx.compose.material.icons.filled.Edit
import androidx.compose.material.icons.filled.Forum
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.FilledIconButton
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.lifecycle.ViewModel
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.lifecycle.viewModelScope
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import radioescucha.ledemar.es.core.network.Comentario
import radioescucha.ledemar.es.core.network.Resultado
import radioescucha.ledemar.es.core.realtime.TiempoReal
import radioescucha.ledemar.es.core.util.Formatos
import radioescucha.ledemar.es.data.SocialRepositorio
import radioescucha.ledemar.es.ui.appViewModel
import radioescucha.ledemar.es.ui.components.Avatar
import radioescucha.ledemar.es.ui.components.Cargando
import radioescucha.ledemar.es.ui.components.DialogoConfirmar
import radioescucha.ledemar.es.ui.components.EstadoVacio
import radioescucha.ledemar.es.ui.contenedor

data class ComentariosEstado(
    val cargando: Boolean = true,
    val comentarios: List<Comentario> = emptyList(),
    val enviando: Boolean = false,
    val error: String? = null,
)

/**
 * Comentarios de una frecuencia + localización (no de un contacto concreto),
 * refrescados en tiempo real con NuevoComentario / ComentarioEliminado.
 */
class ComentariosViewModel(
    private val repo: SocialRepositorio,
    tiempoReal: TiempoReal,
    private val frecuenciaId: Int,
    private val localizacionId: Int?,
) : ViewModel() {

    private val _estado = MutableStateFlow(ComentariosEstado())
    val estado = _estado.asStateFlow()

    init {
        cargar()
        viewModelScope.launch {
            tiempoReal.eventos(tiempoReal.canalComentarios(frecuenciaId, localizacionId), "NuevoComentario", "ComentarioEliminado")
                .collect {
                    delay(400) // como useComentarios.js: deja terminar la transacción
                    cargar()
                }
        }
    }

    fun cargar() {
        viewModelScope.launch {
            when (val r = repo.comentarios(frecuenciaId, localizacionId)) {
                is Resultado.Ok -> _estado.update { it.copy(cargando = false, comentarios = r.datos, error = null) }
                is Resultado.Error -> _estado.update { it.copy(cargando = false, error = r.mensaje) }
            }
        }
    }

    fun enviar(texto: String, alOk: () -> Unit) {
        if (texto.isBlank()) return
        _estado.update { it.copy(enviando = true) }
        viewModelScope.launch {
            when (val r = repo.comentar(texto.trim(), frecuenciaId, localizacionId)) {
                is Resultado.Ok -> {
                    _estado.update { it.copy(enviando = false, comentarios = listOf(r.datos) + it.comentarios.filterNot { c -> c.id == r.datos.id }) }
                    alOk()
                }
                is Resultado.Error -> _estado.update { it.copy(enviando = false, error = r.mensaje) }
            }
        }
    }

    fun editar(id: Int, texto: String) {
        viewModelScope.launch {
            when (val r = repo.editarComentario(id, texto.trim())) {
                is Resultado.Ok -> _estado.update { it.copy(comentarios = it.comentarios.map { c -> if (c.id == id) r.datos else c }) }
                is Resultado.Error -> _estado.update { it.copy(error = r.mensaje) }
            }
        }
    }

    fun eliminar(id: Int) {
        viewModelScope.launch {
            when (val r = repo.eliminarComentario(id)) {
                is Resultado.Ok -> _estado.update { it.copy(comentarios = it.comentarios.filterNot { c -> c.id == id }) }
                is Resultado.Error -> _estado.update { it.copy(error = r.mensaje) }
            }
        }
    }
}

@Composable
fun ComentariosSeccion(frecuenciaId: Int, localizacionId: Int?, modifier: Modifier = Modifier) {
    val vm = appViewModel(clave = "comentarios-$frecuenciaId-$localizacionId") {
        ComentariosViewModel(it.socialRepositorio, it.tiempoReal, frecuenciaId, localizacionId)
    }
    val estado by vm.estado.collectAsStateWithLifecycle()
    val usuario by contenedor().sesion.usuario.collectAsStateWithLifecycle()
    var texto by remember { mutableStateOf("") }
    var editando by remember { mutableStateOf<Comentario?>(null) }
    var borrando by remember { mutableStateOf<Comentario?>(null) }

    Column(modifier) {
        Row(
            Modifier
                .fillMaxWidth()
                .padding(horizontal = 16.dp, vertical = 8.dp)
                .imePadding(),
            verticalAlignment = Alignment.CenterVertically,
        ) {
            OutlinedTextField(
                value = texto,
                onValueChange = { texto = it },
                placeholder = { Text("Escribe un comentario…") },
                modifier = Modifier.weight(1f),
                maxLines = 4,
                shape = MaterialTheme.shapes.large,
            )
            Spacer(Modifier.width(8.dp))
            FilledIconButton(onClick = { vm.enviar(texto) { texto = "" } }, enabled = texto.isNotBlank() && !estado.enviando) {
                Icon(Icons.AutoMirrored.Filled.Send, "Enviar")
            }
        }
        estado.error?.let { Text(it, color = MaterialTheme.colorScheme.error, modifier = Modifier.padding(horizontal = 16.dp)) }

        when {
            estado.cargando -> Cargando()
            estado.comentarios.isEmpty() -> EstadoVacio(
                Icons.Filled.Forum,
                "Sin comentarios",
                "Sé el primero en comentar esta frecuencia en esta ubicación.",
            )
            else -> LazyColumn(
                contentPadding = PaddingValues(16.dp),
                verticalArrangement = Arrangement.spacedBy(10.dp),
            ) {
                items(estado.comentarios, key = { it.id }) { c ->
                    // Igual que ComentarioPolicy: propietario o administrador.
                    val gestionable = usuario?.isAdmin == true || c.user?.id == usuario?.id
                    TarjetaComentario(c, gestionable, alEditar = { editando = c }, alBorrar = { borrando = c })
                }
            }
        }
    }

    editando?.let { c ->
        var nuevo by remember(c.id) { mutableStateOf(c.comentario) }
        AlertDialog(
            onDismissRequest = { editando = null },
            title = { Text("Editar comentario") },
            text = { OutlinedTextField(nuevo, { nuevo = it }, minLines = 3, modifier = Modifier.fillMaxWidth()) },
            confirmButton = {
                TextButton(onClick = {
                    vm.editar(c.id, nuevo)
                    editando = null
                }, enabled = nuevo.isNotBlank()) { Text("Guardar") }
            },
            dismissButton = { TextButton(onClick = { editando = null }) { Text("Cancelar") } },
        )
    }

    borrando?.let { c ->
        DialogoConfirmar(
            titulo = "Eliminar comentario",
            texto = "¿Deseas eliminar este comentario?",
            alConfirmar = {
                vm.eliminar(c.id)
                borrando = null
            },
            alCancelar = { borrando = null },
        )
    }
}

@Composable
private fun TarjetaComentario(c: Comentario, gestionable: Boolean, alEditar: () -> Unit, alBorrar: () -> Unit) {
    Card(colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceContainer)) {
        Column(Modifier.padding(14.dp)) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Avatar(c.user?.photo, tamano = 36.dp, admin = c.user?.isAdmin == true)
                Spacer(Modifier.width(10.dp))
                Column(Modifier.weight(1f)) {
                    Text(c.user?.username ?: "Usuario", style = MaterialTheme.typography.titleSmall)
                    Text(Formatos.fechaHoraLarga(c.creadoEn), style = MaterialTheme.typography.labelSmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
                }
                if (gestionable) {
                    IconButton(onClick = alEditar) { Icon(Icons.Filled.Edit, "Editar") }
                    IconButton(onClick = alBorrar) { Icon(Icons.Filled.Delete, "Eliminar") }
                }
            }
            Spacer(Modifier.padding(top = 8.dp))
            Text(c.comentario, style = MaterialTheme.typography.bodyMedium)
        }
    }
}
