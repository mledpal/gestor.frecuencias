package radioescucha.ledemar.es.ui.feature.perfil

import android.content.Context
import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.graphics.Matrix
import android.net.Uri
import androidx.exifinterface.media.ExifInterface
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import java.io.ByteArrayOutputStream

/**
 * Prepara la foto de perfil para ProfileImageRequest: relación 1:1
 * (recorte centrado), orientación EXIF aplicada y menos de 1024 KB.
 */
object Imagen {

    private const val LADO = 640
    private const val MAX_BYTES = 1000 * 1024

    suspend fun prepararAvatar(context: Context, uri: Uri): ByteArray? = withContext(Dispatchers.IO) {
        val original = context.contentResolver.openInputStream(uri)?.use { BitmapFactory.decodeStream(it) } ?: return@withContext null
        val rotada = aplicarExif(context, uri, original)

        val lado = minOf(rotada.width, rotada.height)
        val cuadrada = Bitmap.createBitmap(rotada, (rotada.width - lado) / 2, (rotada.height - lado) / 2, lado, lado)
        val final = if (lado > LADO) Bitmap.createScaledBitmap(cuadrada, LADO, LADO, true) else cuadrada

        var calidad = 90
        var bytes: ByteArray
        do {
            bytes = ByteArrayOutputStream().use { salida ->
                final.compress(Bitmap.CompressFormat.JPEG, calidad, salida)
                salida.toByteArray()
            }
            calidad -= 10
        } while (bytes.size > MAX_BYTES && calidad > 30)

        bytes
    }

    private fun aplicarExif(context: Context, uri: Uri, bitmap: Bitmap): Bitmap {
        val orientacion = runCatching {
            context.contentResolver.openInputStream(uri)?.use {
                ExifInterface(it).getAttributeInt(ExifInterface.TAG_ORIENTATION, ExifInterface.ORIENTATION_NORMAL)
            }
        }.getOrNull() ?: ExifInterface.ORIENTATION_NORMAL

        val grados = when (orientacion) {
            ExifInterface.ORIENTATION_ROTATE_90 -> 90f
            ExifInterface.ORIENTATION_ROTATE_180 -> 180f
            ExifInterface.ORIENTATION_ROTATE_270 -> 270f
            else -> return bitmap
        }
        return Bitmap.createBitmap(bitmap, 0, 0, bitmap.width, bitmap.height, Matrix().apply { postRotate(grados) }, true)
    }
}
