<?php

namespace App\Services;

use App\Models\Localizacion;

class LocalizacionService
{
    public static function existe($localidad, $provincia, $pais, $gps)
    {
        $localizacion_bus = Localizacion::where('localidad', $localidad)->where('provincia', $provincia)->where('pais', $pais)->where('gps', $gps)->first();

        if ($localizacion_bus) {
            return $localizacion_bus->id;
        } else {
            return null;
        }
    }
}
