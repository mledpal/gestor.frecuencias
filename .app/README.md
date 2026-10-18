# Radioescucha · App Android

App nativa (Kotlin + Jetpack Compose + Material 3) del Gestor de Frecuencias
[radioescucha.es](https://radioescucha.es). Consume la API REST `/api/v1` del
backend Laravel (carpeta madre, `routes/api.php`) con tokens de Sanctum.

## Abrir y ejecutar

1. Android Studio → **Open** → esta carpeta (`.app`).
2. Copia `local.properties.example` a `local.properties` y rellena las claves
   (Maps y Pusher son opcionales: sin ellas el mapa muestra un aviso y no hay tiempo real).
3. Arranca el backend accesible desde el emulador:
   ```bash
   php artisan serve --host=0.0.0.0 --port=8000
   ```
4. Ejecuta la configuración `app` (variante `debug`, apunta a `http://10.0.2.2:8000/`).

Desde la línea de comandos:

```bash
./gradlew assembleDebug        # APK en app/build/outputs/apk/debug
./gradlew testDebugUnitTest    # tests unitarios (formatos, filtros, formulario)
./gradlew assembleRelease      # requiere configurar la firma
```

Requisitos: JDK 17+, Android SDK con la plataforma 37 (las librerías de 2026 la exigen;
Gradle la descarga sola si las licencias están aceptadas). `minSdk` 26.

## Estructura

```
app/src/main/java/radioescucha/ledemar/es/
  AppContainer.kt        Inyección de dependencias manual (OkHttp, Retrofit, repositorios)
  core/network           Modelos, ApiService (Retrofit), Resultado y manejo de errores
  core/datastore         Sesión (token Sanctum), tema y filtros en DataStore
  core/realtime          Pusher/Reverb con autorización Bearer (/api/broadcasting/auth)
  core/util              Colores Tailwind, formatos (fechas, GPS, frecuencias), filtros
  data/                  Repositorios por dominio
  navigation/            NavHost type-safe + barra inferior
  ui/theme               Tema "escáner": chasis oscuro, LCD ámbar, fuentes DS-Digital y Ethnocentric
  ui/components          LCD, LEDs, avatar, selectores de catálogo, secciones plegables...
  ui/feature/            auth · contactos · comentarios · buscar · mensajes · perfil · admin · mapa
```

Cada pantalla es un `@Composable` + `ViewModel` con `StateFlow`; los ViewModels
se crean con `appViewModel { ... }` a partir del `AppContainer`.

## Funcionalidades (paridad con la web)

- Login, registro y recuperación de contraseña.
- Contactos: lista tipo banco de memorias, filtros (favoritos, comprobados, públicos,
  privados, por tipo), crear/editar/eliminar con frecuencia, banda, modo, calidad,
  localización (mapa y "mi ubicación"), repetidor y codificación (CTCSS/DCS).
- Búsqueda en tus contactos o en los públicos de la comunidad, y "Agregar a mis contactos".
- Comentarios por frecuencia + localización, en tiempo real.
- Mensajería privada con envío optimista y tiempo real; búsqueda de usuarios.
- Perfil: datos, localización, foto (recorte 1:1 automático), contraseña, tema, borrar cuenta.
- Administración: usuarios (promover/degradar, eliminar, mapa de sus frecuencias),
  tipos de contacto (con paleta de color) y tipos de codificación.

Las fuentes DS-Digital y Ethnocentric se copian de `public/`; revisa sus licencias antes de publicar en Google Play.
