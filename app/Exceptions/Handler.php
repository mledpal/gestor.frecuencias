<?php

namespace App\Exceptions;

use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Throwable;

class Handler extends ExceptionHandler
{
    /**
     * The list of the inputs that are never flashed to the session on validation exceptions.
     *
     * @var array<int, string>
     */
    protected $dontFlash = [
        'current_password',
        'password',
        'password_confirmation',
    ];

    /**
     * Register the exception handling callbacks for the application.
     */
    public function register(): void
    {
        // La API móvil recibe siempre los errores (401, 403, 422...) en JSON.
        $this->shouldRenderJsonWhen(fn ($request) => $request->is('api/*') || $request->expectsJson());

        $this->reportable(function (Throwable $e) {
            //
        });
    }
}
