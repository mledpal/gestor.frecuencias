<?php

namespace App\Http\Controllers\Concerns;

use App\Models\Banda;
use App\Models\Ctcss;
use App\Models\Dcs;
use App\Models\ModoTransmision;
use App\Models\TipoCodificacion;
use App\Models\TipoContacto;

/**
 * Construye los catálogos (selects) que necesitan los formularios de contacto.
 * Centraliza la lógica que antes estaba duplicada en MainController e
 * ContactoController.
 */
trait ConstruyeSelectsDeContacto
{
    /**
     * @return array<string, array<int|string, string>>
     */
    protected function selectsDeContacto(): array
    {
        $bandas = Banda::orderBy('id', 'ASC')->pluck('banda', 'id')->toArray();
        $bandas[-1] = 'Desconocido';

        $modos = ModoTransmision::orderBy('id', 'ASC')->pluck('nombre', 'id')->toArray();
        $modos[-1] = 'Desconocido';

        $codificaciones = TipoCodificacion::orderBy('nombre', 'ASC')->pluck('nombre', 'id')->toArray();
        $codificaciones[-1] = 'Ninguna';

        $dcs = Dcs::orderBy('codigo', 'ASC')->pluck('codigo', 'id')->toArray();
        $dcs[-1] = 'Ninguno';

        $ctcss = Ctcss::orderBy('codigo', 'ASC')->pluck('codigo', 'id')->toArray();
        $ctcss[-1] = 'Ninguno';

        return [
            'tipos_contacto' => TipoContacto::orderBy('nombre', 'ASC')->pluck('nombre', 'id')->toArray(),
            'modos' => $modos,
            'codificaciones' => $codificaciones,
            'dcs' => $dcs,
            'ctcss' => $ctcss,
            'direcciones' => ['=' => '=', '+' => '+', '-' => '-'],
            'bandas' => $bandas,
        ];
    }
}
