package radioescucha.ledemar.es.core.util

import java.time.LocalDate
import java.time.OffsetDateTime
import java.time.ZoneId
import java.time.format.DateTimeFormatter
import java.time.format.FormatStyle
import java.util.Locale

private val es = Locale.forLanguageTag("es-ES")
private val madrid = ZoneId.of("Europe/Madrid")

/** Utilidades de formato compartidas (fechas es-ES, GPS "lat,lng", frecuencias). */
object Formatos {

    private val fechaLarga = DateTimeFormatter.ofLocalizedDateTime(FormatStyle.LONG, FormatStyle.SHORT).withLocale(es)
    private val fechaCorta = DateTimeFormatter.ofPattern("dd/MM/yy HH:mm", es)
    private val soloHora = DateTimeFormatter.ofPattern("HH:mm", es)
    private val fechaDia = DateTimeFormatter.ofPattern("d MMM yyyy", es)

    private fun parsear(iso: String?): OffsetDateTime? =
        iso?.let { runCatching { OffsetDateTime.parse(it).atZoneSameInstant(madrid).toOffsetDateTime() }.getOrNull() }

    /** "18 de octubre de 2026, 15:20" (comentarios). */
    fun fechaHoraLarga(iso: String?): String = parsear(iso)?.format(fechaLarga) ?: ""

    /** "15:20" si es de hoy, si no "18/10/26 15:20" (mensajes). */
    fun fechaHoraCorta(iso: String?): String {
        val fecha = parsear(iso) ?: return ""
        return if (fecha.toLocalDate() == LocalDate.now(madrid)) fecha.format(soloHora) else fecha.format(fechaCorta)
    }

    /** "2026-10-01" -> "1 oct 2026". */
    fun fechaDia(fecha: String?): String =
        fecha?.let { runCatching { LocalDate.parse(it.take(10)).format(fechaDia) }.getOrNull() } ?: ""

    /**
     * Normaliza la frecuencia tecleada (coma decimal, espacios) y la formatea
     * con 3 decimales como hace Frecuencia::getFrecuenciaAttribute.
     */
    fun normalizarFrecuencia(texto: String): String? {
        val valor = texto.trim().replace(',', '.').toDoubleOrNull() ?: return null
        if (valor <= 0) return null
        val cuatro = String.format(Locale.US, "%.4f", valor)
        return if (cuatro.endsWith("5")) cuatro else String.format(Locale.US, "%.3f", valor)
    }

    /** Parsea "lat,lng" (con o sin espacio). */
    fun parsearGps(gps: String?): Pair<Double, Double>? {
        val partes = gps?.split(",")?.map { it.trim() } ?: return null
        if (partes.size != 2) return null
        val lat = partes[0].toDoubleOrNull() ?: return null
        val lng = partes[1].toDoubleOrNull() ?: return null
        if (lat !in -90.0..90.0 || lng !in -180.0..180.0) return null
        return lat to lng
    }

    fun formatearGps(lat: Double, lng: Double): String =
        String.format(Locale.US, "%.6f,%.6f", lat, lng)
}
