<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Marca las peticiones de la API como JSON para que los errores de
 * validación, autenticación y autorización se devuelvan siempre como JSON
 * (nunca como redirecciones), aunque el cliente no envíe `Accept`.
 */
class ForzarRespuestaJson
{
    public function handle(Request $request, Closure $next): Response
    {
        $request->headers->set('Accept', 'application/json');

        return $next($request);
    }
}
