<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta id="meta_token" name="csrf-token" content="{{ csrf_token() }}" />

    <meta name="description"
        content="Plataforma online para radioaficionados y radioescuchas. Gestiona, busca y comparte frecuencias de radio, repetidores, subtonos CTCSS/DCS y escuchas con la comunidad." />
    <meta name="keywords"
        content="radioaficionados, radioescucha, frecuencias de radio, repetidores vhf uhf, subtonos ctcss dcs, contactos radio, walkie talkie, telecomunicaciones, radioaficion" />
    <meta name="author" content="radioescucha.es" />
    <meta name="robots" content="index, follow" />
    <meta name="theme-color" content="#0f172a" />

    <link rel="canonical" href="{{ url()->current() }}" />
    <link rel="icon" type="image/x-icon" href="/img/logo.webp">
    <link rel="apple-touch-icon" href="{{ URL::asset('/img/logo.webp') }}">
    <link rel="manifest" href="/site.webmanifest">

    <title inertia>{{ config('app.name', 'Gestor de Frecuencias') }}</title>
    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />

    {{-- OpenGraph --}}
    <meta property="og:title" content="Gestión de Frecuencias 2.0 | Radioescucha" />
    <meta property="og:description"
        content="Plataforma online para radioaficionados y radioescuchas. Gestiona, busca y comparte frecuencias de radio, repetidores, subtonos CTCSS/DCS y contactos con la comunidad." />
    <meta property="og:type" content="website">
    <meta property="og:url" content="{{ url()->current() }}" />
    <meta property="og:image" content="{{ URL::asset('/img/logo.png') }}" />
    <meta property="og:site_name" content="Gestión de Frecuencias" />
    <meta property="og:locale" content="es_ES" />

    <!-- Twitter Meta Tags -->
    <meta name="twitter:card" content="summary_large_image">
    <meta property="twitter:domain" content="radioescucha.es">
    <meta property="twitter:url" content="{{ url()->current() }}">
    <meta name="twitter:title" content="Gestor de Frecuencias | Radioescucha">
    <meta name="twitter:description"
        content="Plataforma online para radioaficionados y radioescuchas. Gestiona, busca y comparte frecuencias de radio, repetidores, subtonos CTCSS/DCS y contactos con la comunidad.">
    <meta name="twitter:image" content="{{ URL::asset('/img/logo.png') }}">

    <!-- Schema.org JSON-LD Structured Data -->
    <script type="application/ld+json">
    {!! json_encode([
        '@context' => 'https://schema.org',
        '@type' => 'WebApplication',
        'name' => 'Gestor de Frecuencias',
        'alternateName' => 'Radioescucha.es',
        'url' => 'https://www.radioescucha.es',
        'description' => 'Aplicación web para radioaficionados y radioescuchas para registrar, consultar y compartir frecuencias de radio, repetidores y contactos.',
        'applicationCategory' => 'UtilitiesApplication',
        'operatingSystem' => 'All',
        'inLanguage' => 'es',
        'image' => URL::asset('/img/logo.png'),
        'offers' => [
            '@type' => 'Offer',
            'price' => '0',
            'priceCurrency' => 'EUR',
        ],
    ], JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE) !!}
    </script>

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
