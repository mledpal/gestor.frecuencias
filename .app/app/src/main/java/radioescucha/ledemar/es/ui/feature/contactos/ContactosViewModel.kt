package radioescucha.ledemar.es.ui.feature.contactos

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.combine
import kotlinx.coroutines.flow.map
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch
import kotlinx.serialization.json.Json
import radioescucha.ledemar.es.core.datastore.Sesion
import radioescucha.ledemar.es.core.network.Contacto
import radioescucha.ledemar.es.core.network.Resultado
import radioescucha.ledemar.es.core.network.Selects
import radioescucha.ledemar.es.core.util.Filtros
import radioescucha.ledemar.es.data.ContactosRepositorio

data class ListaContactosEstado(
    val contactos: List<Contacto> = emptyList(),
    val total: Int = 0,
    val enBusqueda: Boolean = false,
    val filtros: Filtros = Filtros.TODOS,
    val selects: Selects? = null,
    val cargando: Boolean = true,
    val error: String? = null,
)

class ContactosViewModel(
    private val repo: ContactosRepositorio,
    private val sesion: Sesion,
    private val json: Json,
) : ViewModel() {

    private val cargando = MutableStateFlow(true)
    private val error = MutableStateFlow<String?>(null)

    private val filtros: StateFlow<Filtros> = sesion.filtros
        .map { guardado -> guardado?.let { runCatching { json.decodeFromString<Filtros>(it) }.getOrNull() } ?: Filtros.TODOS }
        .stateIn(viewModelScope, SharingStarted.Eagerly, Filtros.TODOS)

    val estado: StateFlow<ListaContactosEstado> = combine(
        combine(repo.contactos, repo.busqueda, ::Pair),
        filtros,
        repo.selects,
        cargando,
        error,
    ) { (propios, busqueda), f, selects, carga, err ->
        val base = busqueda ?: propios
        ListaContactosEstado(
            contactos = f.aplicar(base),
            total = base.size,
            enBusqueda = busqueda != null,
            filtros = f,
            selects = selects,
            cargando = carga,
            error = err,
        )
    }.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5_000), ListaContactosEstado())

    init {
        refrescar()
    }

    fun refrescar() {
        viewModelScope.launch {
            cargando.value = true
            repo.cargarSelects()
            val r = repo.cargar()
            error.value = (r as? Resultado.Error)?.mensaje
            cargando.value = false
        }
    }

    fun cambiarFiltros(nuevos: Filtros) {
        viewModelScope.launch { sesion.guardarFiltros(json.encodeToString(Filtros.serializer(), nuevos)) }
    }

    fun alternarTodos() {
        val tipos = estado.value.selects?.tiposContacto?.map { it.id }.orEmpty()
        cambiarFiltros(if (estado.value.filtros.todosActivos) Filtros.ninguno(tipos) else Filtros.TODOS)
    }

    fun limpiarBusqueda() = repo.limpiarBusqueda()

    fun descartarError() {
        error.value = null
    }
}
