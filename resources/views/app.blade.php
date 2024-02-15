<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta id ="meta_token" content="{{ csrf_token() }}" />

    <link rel="icon" type="image/x-icon" href="/img/logo.webp">
    <title inertia>{{ config('app.name', 'Gestor de Frecuencias') }}</title>
    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />

    {{-- OpenGraph --}}
    <meta property=”og:title” content=”Gestión de Frecuencias 2.0” />
    <meta property=”og:description” content=”App web para tener almacenados tus contactos de radio y poder compartirlas
        con más radioaficionados.” />
    <meta property=”og:url” content=”https://www.radioescucha.es” />
    <meta property=”og:image” content=”https://www.radioescucha.es/img/logo.webp” />
    <meta property="og:site_name" content="Gestión de Frecuencias v2.0" />

    <!-- Scripts -->
    @routes
    @viteReactRefresh
    @vite(['resources/js/app.jsx', "resources/js/Pages/{$page['component']}.jsx"])
    @inertiaHead
</head>

<body class="font-sans antialiased">
    @inertia
</body>

</html>
