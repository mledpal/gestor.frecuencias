<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Concerns\ConstruyeSelectsDeContacto;
use App\Http\Controllers\Controller;
use App\Models\TipoContacto;

class CatalogoController extends Controller
{
    use ConstruyeSelectsDeContacto;

    /**
     * Catálogos de los formularios de contacto. Se devuelven como listas
     * `[{id, nombre}]` en vez de mapas `{id: nombre}`: con la clave -1 el
     * orden y el tipo de las claves no son estables en JSON. La opción -1
     * ("Desconocido"/"Ninguno") va siempre la primera.
     */
    public function selects()
    {
        $selects = collect($this->selectsDeContacto())
            ->except('direcciones', 'tipos_contacto')
            ->map(fn ($opciones) => collect($opciones)
                ->map(fn ($nombre, $id) => ['id' => (int) $id, 'nombre' => (string) $nombre])
                ->sortBy(fn ($opcion) => $opcion['id'] == -1 ? 0 : 1)
                ->values());

        // Los tipos de contacto incluyen el color para pintar las listas.
        $selects['tipos_contacto'] = TipoContacto::orderBy('nombre', 'asc')->get(['id', 'nombre', 'color']);
        $selects['direcciones'] = ['=', '+', '-'];

        return response()->json($selects);
    }
}
