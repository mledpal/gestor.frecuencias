@component('mail::message')
# Bienvenido, {{ $user->nombre }}

Gracias por registrarte en nuestra aplicación. Esperamos que disfrutes de nuestros servicios.

Gracias,
{{ config('app.name') }}
@endcomponent
