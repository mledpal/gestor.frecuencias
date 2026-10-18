package radioescucha.ledemar.es.core.util

import androidx.compose.ui.graphics.Color

/**
 * Paleta Tailwind usada por los tipos de contacto (`tipo_contacto.color`,
 * validado en ValidarTipoContacto con el formato `nombre-intensidad`).
 */
object ColoresTailwind {

    val intensidades = listOf(100, 200, 300, 400, 500, 600, 700, 800, 900)

    private val paleta: Map<String, List<Long>> = mapOf(
        "blue" to listOf(0xFFDBEAFE, 0xFFBFDBFE, 0xFF93C5FD, 0xFF60A5FA, 0xFF3B82F6, 0xFF2563EB, 0xFF1D4ED8, 0xFF1E40AF, 0xFF1E3A8A),
        "emerald" to listOf(0xFFD1FAE5, 0xFFA7F3D0, 0xFF6EE7B7, 0xFF34D399, 0xFF10B981, 0xFF059669, 0xFF047857, 0xFF065F46, 0xFF064E3B),
        "fuchsia" to listOf(0xFFFAE8FF, 0xFFF5D0FE, 0xFFF0ABFC, 0xFFE879F9, 0xFFD946EF, 0xFFC026D3, 0xFFA21CAF, 0xFF86198F, 0xFF701A75),
        "gray" to listOf(0xFFF3F4F6, 0xFFE5E7EB, 0xFFD1D5DB, 0xFF9CA3AF, 0xFF6B7280, 0xFF4B5563, 0xFF374151, 0xFF1F2937, 0xFF111827),
        "green" to listOf(0xFFDCFCE7, 0xFFBBF7D0, 0xFF86EFAC, 0xFF4ADE80, 0xFF22C55E, 0xFF16A34A, 0xFF15803D, 0xFF166534, 0xFF14532D),
        "indigo" to listOf(0xFFE0E7FF, 0xFFC7D2FE, 0xFFA5B4FC, 0xFF818CF8, 0xFF6366F1, 0xFF4F46E5, 0xFF4338CA, 0xFF3730A3, 0xFF312E81),
        "orange" to listOf(0xFFFFEDD5, 0xFFFED7AA, 0xFFFDBA74, 0xFFFB923C, 0xFFF97316, 0xFFEA580C, 0xFFC2410C, 0xFF9A3412, 0xFF7C2D12),
        "pink" to listOf(0xFFFCE7F3, 0xFFFBCFE8, 0xFFF9A8D4, 0xFFF472B6, 0xFFEC4899, 0xFFDB2777, 0xFFBE185D, 0xFF9D174D, 0xFF831843),
        "purple" to listOf(0xFFF3E8FF, 0xFFE9D5FF, 0xFFD8B4FE, 0xFFC084FC, 0xFFA855F7, 0xFF9333EA, 0xFF7E22CE, 0xFF6B21A8, 0xFF581C87),
        "red" to listOf(0xFFFEE2E2, 0xFFFECACA, 0xFFFCA5A5, 0xFFF87171, 0xFFEF4444, 0xFFDC2626, 0xFFB91C1C, 0xFF991B1B, 0xFF7F1D1D),
        "rose" to listOf(0xFFFFE4E6, 0xFFFECDD3, 0xFFFDA4AF, 0xFFFB7185, 0xFFF43F5E, 0xFFE11D48, 0xFFBE123C, 0xFF9F1239, 0xFF881337),
        "sky" to listOf(0xFFE0F2FE, 0xFFBAE6FD, 0xFF7DD3FC, 0xFF38BDF8, 0xFF0EA5E9, 0xFF0284C7, 0xFF0369A1, 0xFF075985, 0xFF0C4A6E),
        "violet" to listOf(0xFFEDE9FE, 0xFFDDD6FE, 0xFFC4B5FD, 0xFFA78BFA, 0xFF8B5CF6, 0xFF7C3AED, 0xFF6D28D9, 0xFF5B21B6, 0xFF4C1D95),
        "yellow" to listOf(0xFFFEF9C3, 0xFFFEF08A, 0xFFFDE047, 0xFFFACC15, 0xFFEAB308, 0xFFCA8A04, 0xFFA16207, 0xFF854D0E, 0xFF713F12),
    )

    val nombres: List<String> = paleta.keys.sorted()

    val porDefecto = Color(0xFF64748B)

    /**
     * Convierte "red-500" (o "bg-red-500") en un [Color]. Devuelve el gris
     * por defecto si el valor no es válido.
     */
    fun aColor(valor: String?): Color {
        val partes = valor?.removePrefix("bg-")?.split("-") ?: return porDefecto
        if (partes.size != 2) return porDefecto
        val indice = intensidades.indexOf(partes[1].toIntOrNull())
        val tonos = paleta[partes[0]] ?: return porDefecto
        return if (indice >= 0) Color(tonos[indice]) else porDefecto
    }

    fun esValido(valor: String): Boolean = aColor(valor) != porDefecto
}
