# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Proyecto

"Gestor de Frecuencias" (radioescucha.es): app Laravel 12 + Inertia + React 18 para que radioaficionados registren *contactos* (escuchas) asociados a una frecuencia y una localización, con mensajería en tiempo real y panel de administración. El código, los comentarios y los nombres de dominio están en **español** — mantén ese idioma al añadir código.

## Comandos

```bash
# Arranque (dos consolas)
php artisan serve
yarn dev

# Instalación inicial
composer install && yarn install
php artisan key:generate && php artisan storage:link
php artisan migrate --seed          # crea antes la BD `frecuencias`

# Build de frontend (también sirve para validar que el JSX compila)
yarn build          # == npx vite build

# Tests PHP (PHPUnit 11)
php artisan test
php artisan test --testsuite=Feature
php artisan test tests/Feature/a02_ContactoTest.php
php artisan test --filter=nombre_del_metodo

# Tests JS (Jest; `yarn test` arranca en modo --watchAll)
npx jest
npx jest resources/js/tests/Helpers/getContactos.test.js

# Formato PHP
./vendor/bin/pint            # el repo NO está formateado entero: formatea solo lo que toques
```

`yarn lint` está **roto**: `.eslintrc.cjs` referencia `eslint-plugin-react`, `-react-hooks` y `-react-refresh`, que no están instalados. Valida el frontend con `yarn build` en su lugar.

## Tests: gotchas de infraestructura

- Los tests Feature corren contra **MySQL real**, base `test_frecuencias` (ver `phpunit.xml`); el host sale del `.env`. No es SQLite en memoria — la base debe existir.
- `User::isAdmin` / `isRoot` dependen de **ids de rol fijos** (1 = root, 2 = admin, 4 = user), sembrados por `TablaRoles`.
- Con `RefreshDatabase` MySQL no resetea el autoincremento en el rollback. Por eso los roles se siembran **una sola vez** vía `protected bool $seed = true; protected string $seeder = TablaRoles::class;` en [FixtureTestCase.php](tests/Feature/FixtureTestCase.php), nunca desde `setUp()`; si se hace en `setUp()` los ids se desplazan y `isAdmin` se rompe.
- Los tests Feature heredan de [FixtureTestCase](tests/Feature/FixtureTestCase.php), que crea `$usuario`, `$admin`, `$frecuencia` y `$localizacion` propios.
- `UserFactory` devuelve la contraseña **en texto plano**; el cast `'password' => 'hashed'` del modelo la hashea con `BCRYPT_ROUNDS=4`. No hardcodear hashes bcrypt cost-10.

## Arquitectura

### Backend (Laravel 12, estructura pre-11 con `app/Http/Kernel.php` y providers clásicos)

- **Inertia**, no API REST: los controladores devuelven `Inertia::render('Inicio', [...])` o `back()`. `routes/api.php` está prácticamente vacío. Algunos endpoints AJAX (`ajax/contacto/*`, `mensajes/*`) sí devuelven JSON.
- Rutas web agrupadas por controlador con `Route::controller(...)` dentro de un único `middleware('auth')` en [routes/web.php](routes/web.php).
- **Modelo de datos**: `Contacto` es el agregado central; apunta por `belongsTo` a `Frecuencia`, `Localizacion`, `TipoContacto`, `Repetidor`, `Banda`, `ModoTransmision`, `TipoCodificacion`, `Ctcss`, `Dcs` y `User`. Los nombres de tabla son en singular y explícitos (`protected $table = "contacto"`).
  - `Frecuencia` y `Localizacion` se comportan como **catálogos deduplicados**: al crear/actualizar un contacto se busca la fila existente (misma frecuencia, o misma localidad+provincia+país+gps) y solo se crea si no existe. Lo mismo con `Repetidor` (offset + dirección). Esta deduplicación es intencionada — ver la nota del README sobre la remodelación de relaciones.
  - Un usuario no puede tener dos contactos con la misma frecuencia + localización (validación explícita en `ContactoController::crear`).
- **Sentinel `-1`**: los selects del frontend usan `-1` para "Desconocido"/"Ninguno". `ContactoController::normalizarSelects()` lo convierte a `null` antes de persistir, y [ConstruyeSelectsDeContacto](app/Http/Controllers/Concerns/ConstruyeSelectsDeContacto.php) añade la opción `-1` al construir los catálogos. Cualquier campo `*_id` nuevo con esa semántica debe añadirse a ambos sitios.
- **Autorización**: policies auto-descubiertas (`ContactoPolicy`, `ComentarioPolicy`), invocadas con `$this->authorize(...)` en los controladores. Los chequeos de admin en cambio usan los accessors `$user->isAdmin` / `$user->isRoot` basados en ids de rol.
- **Accessors con efectos visibles**: `Frecuencia::getFrecuenciaAttribute` formatea siempre a 3–4 decimales; `Contacto::getHoraAttribute` formatea la hora; `User::photo` devuelve `/images/...` o la imagen por defecto. Al comparar valores en queries o tests, ten en cuenta que el valor leído del modelo ya viene transformado.
- **Middleware Inertia**: [HandleInertiaRequests](app/Http/Middleware/HandleInertiaRequests.php) comparte `auth.user` **con la relación `roles` ya cargada** (el frontend la asume siempre presente) y las rutas de Ziggy.
- **Tiempo real**: eventos `NuevoMensaje` / `NuevoComentario` (`ShouldBroadcast`) sobre canales públicos con nombre determinista (`canal-{idMenor}-{idMayor}-mensajes`). Broadcaster configurable entre Pusher y Ably.
- **Imágenes de perfil**: disco `images` (`storage/app/images`) enlazado a `public/images` vía `php artisan storage:link`; subida mediante `User::setArchivo()`.
- `php artisan make:service Nombre` crea `app/Services/NombreService.php` (comando propio, [MakeService.php](app/Console/Commands/MakeService.php)).

### Frontend (React 18 + Inertia + Tailwind)

- Alias `@/` → `resources/js/` (definido por triplicado en `jsconfig.json`, `babel.config.cjs` y resuelto por Vite).
- **Una sola página Inertia real**: casi todo cuelga de `Pages/Inicio.jsx` → `AppProvider` → `AppMain` → [Vistas.jsx](resources/js/Pages/Vistas.jsx). La navegación interna es un **router manual por estado**: `vista` en el contexto es un string (`"main"`, `"movil"`, `"crear_contacto"`, `"mensajes"`, `"admin_users"`, …) y `Vistas.jsx` renderiza condicionalmente. Añadir pantalla = añadir un caso ahí, no una ruta Inertia nueva.
- **Estado global**: `AppContext` ([AppProvider.jsx](resources/js/Components/AppProvider/AppProvider.jsx)) guarda `contactos`, `busqueda`, `selects`, `userDB`, `isAdmin`, `vista`, `modoOscuro` y `isSmallScreen`. Las props que llegan de Inertia se vuelcan al contexto en `AppMain`.
- **Responsive por rama de componente**, no solo por CSS: `isSmallScreen` (`max-width: 1000px`) decide entre `MainPage` y `MovilPage`, y se pasa hacia abajo a muchos componentes.
- La lógica se extrae a hooks (`resources/js/hooks/use*.js`) y helpers (`resources/js/Helpers`, `Components/*/Helpers`), dejando el JSX lo más declarativo posible; los tests Jest existentes cubren helpers, no componentes.
- Config sensible por `import.meta.env` (`VITE_PUSHER_APP_KEY`, `VITE_GOOGLE_MAPS_API_KEY`); no hardcodear claves — ver [realtime.js](resources/js/Helpers/realtime.js) y `googleMapsLoader.js`.
- El dev server de Vite está fijado a `127.0.0.1:5173` con CORS abierto a `*.frecuencias.test` porque la app se sirve desde Laragon en otro origen ([vite.config.js](vite.config.js)).

### Despliegue

Vercel (`vercel.json` + `api/index.php`, runtime `vercel-php`), con caches de Laravel redirigidas a `/tmp` y sesión en cookie.

## Deuda técnica conocida

- `EditarContacto.jsx` (~940 líneas) y `NuevoContacto.jsx` (~783) duplican lógica con `handleContacts.js`; falta extraer un `useContactoForm` común.
- Faltan plugins de ESLint, Prettier y PropTypes; no hay PHPStan/Larastan.
- `config/cors.php` usa `APP_URL`/`FRONTEND_URL`: hay que poblar `FRONTEND_URL` y `GOOGLE_MAPS_API_KEY`/`VITE_GOOGLE_MAPS_API_KEY` en el `.env` real.
