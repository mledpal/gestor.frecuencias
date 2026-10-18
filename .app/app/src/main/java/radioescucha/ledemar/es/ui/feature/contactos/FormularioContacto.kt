package radioescucha.ledemar.es.ui.feature.contactos

import radioescucha.ledemar.es.core.network.Contacto
import radioescucha.ledemar.es.core.network.ContactoPeticion
import radioescucha.ledemar.es.core.util.Formatos
import java.time.LocalDate
import java.time.LocalTime
import java.time.format.DateTimeFormatter

/**
 * Estado del formulario de contacto, común a "nuevo" y "editar" (en la web
 * esta lógica está duplicada entre NuevoContacto.jsx y EditarContacto.jsx).
 * Los selects usan -1 como "Desconocido"/"Ninguno".
 */
data class FormularioContacto(
    val nombre: String = "",
    val frecuencia: String = "",
    val tipoId: Int? = null,
    val fecha: String = LocalDate.now().toString(),
    val hora: String = LocalTime.now().format(DateTimeFormatter.ofPattern("HH:mm")),
    val observaciones: String = "",
    val comprobado: Boolean = false,
    val favorito: Boolean = false,
    val privado: Boolean = false,
    val calidad: Int = 0,
    val bandaId: Int = -1,
    val modoId: Int = -1,
    val localizacionId: Int? = null,
    val localidad: String = "",
    val provincia: String = "",
    val pais: String = "España",
    val gps: String = "",
    val direccion: String = "",
    val offset: String = "",
    val codificacionId: Int = -1,
    val ctcssId: Int = -1,
    val dcsId: Int = -1,
) {
    val tieneLocalizacion get() = localidad.isNotBlank() || provincia.isNotBlank() || gps.isNotBlank()
    val tieneRepetidor get() = offset.isNotBlank()
    val tieneCodificacion get() = codificacionId != -1 || ctcssId != -1 || dcsId != -1

    /** Errores por campo; vacío si el formulario es válido. */
    fun validar(): Map<String, String> = buildMap {
        if (nombre.isBlank()) put("nombre", "El nombre es obligatorio")
        if (frecuencia.isBlank()) {
            put("frecuencia", "La frecuencia es obligatoria")
        } else if (Formatos.normalizarFrecuencia(frecuencia) == null) {
            put("frecuencia", "Frecuencia no válida (p. ej. 145.500)")
        }
        if (tipoId == null) put("tipo_id", "Elige un tipo de contacto")
        if (runCatching { LocalDate.parse(fecha) }.isFailure) put("fecha", "Fecha no válida")
        if (hora.isNotBlank() && runCatching { LocalTime.parse(hora) }.isFailure) put("hora", "Hora no válida (HH:mm)")
        if (gps.isNotBlank() && Formatos.parsearGps(gps) == null) put("gps", "Coordenadas no válidas (lat,lng)")
        if (offset.isNotBlank() && direccion.isBlank()) put("direccion", "Indica la dirección del offset")
    }

    fun aPeticion() = ContactoPeticion(
        nombre = nombre.trim(),
        frecuencia = Formatos.normalizarFrecuencia(frecuencia) ?: frecuencia.trim(),
        fecha = fecha,
        hora = hora.ifBlank { null },
        tipoId = tipoId ?: 1,
        modoId = modoId,
        bandaId = bandaId,
        codificacionId = codificacionId,
        ctcssId = ctcssId,
        dcsId = dcsId,
        calidad = calidad,
        comprobado = if (comprobado) 1 else 0,
        privado = if (privado) 1 else 0,
        favorito = if (favorito) 1 else 0,
        observaciones = observaciones.trim().ifBlank { null },
        localizacionId = localizacionId,
        localidad = localidad.trim().ifBlank { null },
        provincia = provincia.trim().ifBlank { null },
        pais = pais.trim().ifBlank { null },
        gps = gps.replace(" ", "").ifBlank { null },
        offset = offset.trim().ifBlank { null },
        direccion = direccion.ifBlank { null }?.takeIf { offset.isNotBlank() },
    )

    companion object {
        fun desde(c: Contacto) = FormularioContacto(
            nombre = c.nombre,
            frecuencia = c.frecuencia.orEmpty(),
            tipoId = c.tipo?.id,
            fecha = c.fecha?.take(10) ?: LocalDate.now().toString(),
            hora = c.hora.orEmpty(),
            observaciones = c.observaciones.orEmpty(),
            comprobado = c.comprobado,
            favorito = c.favorito,
            privado = c.privado,
            calidad = c.calidad,
            bandaId = c.banda?.id ?: -1,
            modoId = c.modo?.id ?: -1,
            localizacionId = c.localizacion?.id,
            localidad = c.localizacion?.localidad.orEmpty(),
            provincia = c.localizacion?.provincia.orEmpty(),
            pais = c.localizacion?.pais ?: "España",
            gps = c.localizacion?.gps.orEmpty(),
            direccion = c.repetidor?.direccion.orEmpty(),
            offset = c.repetidor?.offset.orEmpty(),
            codificacionId = c.codificacion?.id ?: -1,
            ctcssId = c.ctcss?.id ?: -1,
            dcsId = c.dcs?.id ?: -1,
        )

        /**
         * Copia de un contacto ajeno para "Agregar a mis contactos": se
         * mantiene todo salvo los flags personales.
         */
        fun copiaDe(c: Contacto) = desde(c).copy(favorito = false, privado = false, comprobado = false)
    }
}
