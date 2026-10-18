package radioescucha.ledemar.es

import androidx.compose.ui.graphics.Color
import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertNull
import org.junit.Assert.assertTrue
import org.junit.Test
import radioescucha.ledemar.es.core.network.Contacto
import radioescucha.ledemar.es.core.network.Localizacion
import radioescucha.ledemar.es.core.network.OpcionCatalogo
import radioescucha.ledemar.es.core.network.Repetidor
import radioescucha.ledemar.es.core.network.TipoContacto
import radioescucha.ledemar.es.core.util.ColoresTailwind
import radioescucha.ledemar.es.core.util.Filtros
import radioescucha.ledemar.es.core.util.Formatos
import radioescucha.ledemar.es.ui.feature.contactos.FormularioContacto

class FormatosTest {

    @Test
    fun normaliza_la_frecuencia_como_el_accessor_del_backend() {
        assertEquals("145.500", Formatos.normalizarFrecuencia("145.5"))
        assertEquals("145.500", Formatos.normalizarFrecuencia(" 145,5 "))
        assertEquals("12.5125", Formatos.normalizarFrecuencia("12.5125"))
        assertEquals("118.100", Formatos.normalizarFrecuencia("118.1"))
        assertNull(Formatos.normalizarFrecuencia("abc"))
        assertNull(Formatos.normalizarFrecuencia("0"))
    }

    @Test
    fun parsea_gps_con_y_sin_espacio() {
        assertEquals(38.0902883 to -3.6244309, Formatos.parsearGps("38.0902883, -3.6244309"))
        assertEquals(38.0 to -3.0, Formatos.parsearGps("38,-3"))
        assertNull(Formatos.parsearGps("100,0"))
        assertNull(Formatos.parsearGps("hola"))
        assertNull(Formatos.parsearGps(null))
    }

    @Test
    fun formatea_gps_con_seis_decimales() {
        assertEquals("38.095929,-3.634245", Formatos.formatearGps(38.0959291, -3.6342449))
    }

    @Test
    fun formatea_fecha_iso_de_laravel() {
        assertEquals("1 oct 2026", Formatos.fechaDia("2026-10-01"))
        assertTrue(Formatos.fechaHoraLarga("2026-10-18T13:20:00.000000Z").contains("2026"))
    }
}

class ColoresTailwindTest {

    @Test
    fun convierte_colores_tailwind() {
        assertEquals(Color(0xFFEF4444), ColoresTailwind.aColor("red-500"))
        assertEquals(Color(0xFF0EA5E9), ColoresTailwind.aColor("bg-sky-500"))
    }

    @Test
    fun valores_invalidos_devuelven_el_color_por_defecto() {
        assertEquals(ColoresTailwind.porDefecto, ColoresTailwind.aColor("Test"))
        assertEquals(ColoresTailwind.porDefecto, ColoresTailwind.aColor("red-550"))
        assertEquals(ColoresTailwind.porDefecto, ColoresTailwind.aColor(null))
        assertFalse(ColoresTailwind.esValido("marron-500"))
    }
}

class FiltrosTest {

    private fun contacto(id: Int, favorito: Boolean = false, comprobado: Boolean = false, privado: Boolean = false, tipo: Int = 1) =
        Contacto(id = id, userId = 1, nombre = "C$id", favorito = favorito, comprobado = comprobado, privado = privado, tipo = TipoContacto(tipo, "T$tipo"))

    private val contactos = listOf(
        contacto(1, favorito = true, comprobado = true),
        contacto(2, privado = true, comprobado = true, tipo = 2),
        contacto(3, tipo = 3),
    )

    @Test
    fun todos_activos_muestra_todo() {
        assertEquals(3, Filtros.TODOS.aplicar(contactos).size)
    }

    @Test
    fun solo_favoritos_y_solo_privados() {
        val tipos = listOf(1, 2, 3)
        assertEquals(listOf(1), Filtros.soloFavoritos(tipos).aplicar(contactos).map { it.id })
        assertEquals(listOf(2), Filtros.soloPrivados(tipos).aplicar(contactos).map { it.id })
        assertTrue(Filtros.ninguno(tipos).aplicar(contactos).isEmpty())
    }

    @Test
    fun los_filtros_se_combinan_con_or_como_en_la_web() {
        val f = Filtros.ninguno(listOf(1, 2, 3)).copy(tiposOcultos = setOf(1, 2))
        // Solo el tipo 3 activo: aparece el contacto 3.
        assertEquals(listOf(3), f.aplicar(contactos).map { it.id })
        // Añadiendo "comprobados" aparecen también 1 y 2.
        assertEquals(listOf(1, 2, 3), f.copy(comprobado = true).aplicar(contactos).map { it.id })
    }
}

class FormularioContactoTest {

    private val valido = FormularioContacto(nombre = "Torre", frecuencia = "118,1", tipoId = 2, fecha = "2026-10-01", hora = "10:30")

    @Test
    fun formulario_valido_sin_errores() {
        assertTrue(valido.validar().isEmpty())
    }

    @Test
    fun detecta_campos_obligatorios_y_formatos() {
        val errores = FormularioContacto(nombre = "", frecuencia = "x", tipoId = null, gps = "abc", offset = "0.6").validar()
        assertEquals(setOf("nombre", "frecuencia", "tipo_id", "gps", "direccion"), errores.keys)
    }

    @Test
    fun la_peticion_normaliza_valores_y_usa_el_sentinel_menos_uno() {
        val p = valido.copy(gps = "38.1, -3.6", favorito = true).aPeticion()
        assertEquals("118.100", p.frecuencia)
        assertEquals("38.1,-3.6", p.gps)
        assertEquals(1, p.favorito)
        assertEquals(-1, p.modoId)
        assertNull(p.offset)
        assertNull(p.direccion)
    }

    @Test
    fun ida_y_vuelta_desde_un_contacto() {
        val c = Contacto(
            id = 9, userId = 1, nombre = "Rep", frecuencia = "145.600", fecha = "2026-10-01", hora = "09:00",
            favorito = true, privado = true, comprobado = true,
            localizacion = Localizacion(5, "Linares", "Jaén", "España", "38,-3"),
            tipo = TipoContacto(3, "Emisora", "red-500"),
            modo = OpcionCatalogo(2, "FM"),
            repetidor = Repetidor(1, "0.600", "-"),
        )
        val f = FormularioContacto.desde(c)
        assertEquals(5, f.localizacionId)
        assertEquals(2, f.modoId)
        assertEquals("-", f.aPeticion().direccion)
        assertTrue(f.tieneRepetidor)

        val copia = FormularioContacto.copiaDe(c)
        assertFalse(copia.favorito || copia.privado || copia.comprobado)
    }
}
