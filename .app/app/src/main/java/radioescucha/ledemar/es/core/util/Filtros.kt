package radioescucha.ledemar.es.core.util

import kotlinx.serialization.Serializable
import radioescucha.ledemar.es.core.network.Contacto

/**
 * Filtros locales de la lista de contactos, equivalentes a
 * resources/js/hooks/useFilters.js: un contacto se muestra si cumple
 * CUALQUIERA de los filtros activos (OR). Los tipos se toman del catálogo en
 * vez de usar ids fijos; `tiposOcultos` guarda los desmarcados.
 */
@Serializable
data class Filtros(
    val favorito: Boolean = true,
    val comprobado: Boolean = true,
    val noComprobado: Boolean = true,
    val publico: Boolean = true,
    val privado: Boolean = true,
    val tiposOcultos: Set<Int> = emptySet(),
) {
    fun tipoActivo(id: Int) = id !in tiposOcultos

    val todosActivos: Boolean
        get() = favorito && comprobado && noComprobado && publico && privado && tiposOcultos.isEmpty()

    fun aplicar(contactos: List<Contacto>): List<Contacto> = contactos.filter { c ->
        (c.favorito && favorito) ||
            (c.comprobado && comprobado) ||
            (!c.comprobado && noComprobado) ||
            (!c.privado && publico) ||
            (c.privado && privado) ||
            (c.tipo != null && tipoActivo(c.tipo.id))
    }

    companion object {
        val TODOS = Filtros()

        fun ninguno(tipos: Collection<Int>) = Filtros(false, false, false, false, false, tipos.toSet())

        /** Atajos "Ver favoritos / privados / todos" de la pantalla vacía. */
        fun soloFavoritos(tipos: Collection<Int>) = ninguno(tipos).copy(favorito = true)
        fun soloPrivados(tipos: Collection<Int>) = ninguno(tipos).copy(privado = true)
    }
}
