<?php

namespace App\Console\Commands;

use App\Models\Banda;
use App\Models\Codificacion;
use App\Models\Contacto;
use App\Models\Ctcss;
use App\Models\Dcs;
use App\Models\Frecuencia;
use App\Models\Localizacion;
use App\Models\ModoTransmision;
use App\Models\Repetidor;
use App\Models\TipoCodificacion;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Throwable;

class importar_frecuencias extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'generate:importar_frecuencias';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Importar frecuencias de CSV de la versión anterior del gestor';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $file = fopen('./database/csv/frecuencias.csv', 'r');
        echo "Importando frecuencias\n\n";
        while ($linea = fgetcsv($file, 1024, ';')) {
            $this->importar_frecuencias($linea);
        }
        fclose($file);
        echo "\nFrecuencias importadas\n";
    }

    public function importar_frecuencias($linea)
    {
        // Registro;Frecuencia;Memoria;Observaciones;Localidad;Banda;Fecha;Exportar;Comprobado;Mhz;Khz;S;R;CTCSS;DCS;Repetidor;Offset;SECRA;Modo
        if ($linea[0] == "Registro" || $linea[8] == "FALSO") return;


        $nuevoRepetidor  = array();
        $nuevoContacto = array();
        $nuevaFrecuencia = array();
        $nuevaLocalizacion = array();

        $nuevaCodificacion = array();
        $tipoCodificacion = null;
        $codificacion = null;

        $dcs = null;
        $ctcss = null;
        $banda = null;
        $localizacion = null;
        $modo = null; // $linea[19];

        $observaciones = null; // $linea[3]


        try {
            $exp_fecha = implode('/', explode('/', $linea[6]));
            $fecha = Carbon::createFromFormat('d/m/Y', $exp_fecha);
        } catch (Throwable $e) {
            $fecha = Carbon::today();
        }


        $comprobado = $linea[8] == "VERDADERO" ? 1 : 0;

        // REPETIDOR $linea[16] -> Desplazamiento
        if ($linea[15] === "VERDADERO") {
            $direccion = substr($linea[16], 0, 1);
            $offset = substr($linea[16], 1);
            $nuevoRepetidor = Repetidor::create(['offset' => $offset, 'direccion' => $direccion]);
        }


        // SECRAFONIA / CODIFICACION
        if (strtolower($linea[17]) != "no" && !empty($linea[17])) {

            $tipoCodificacion = TipoCodificacion::where('nombre', 'like', '%' . $linea[17] . '%')->first();
            $nuevaFrecuencia['codificada'] = true;
            $nuevaCodificacion['tipo_id'] = $tipoCodificacion->id ?? null;

            if (!empty($linea[13])) { //CTCSS
                $ctcss = Ctcss::where('codigo', $linea[13])->first();
                $nuevaCodificacion['ctcss_id'] = ($ctcss) ? $ctcss->id : null;
            } else {
                $nuevaCodificacion['ctcss_id'] = null;
            }

            if (!empty($linea[14])) { // DCS
                $dcs = Dcs::where('codigo', $linea[14])->first();
                $nuevaCodificacion['dcs_id'] = ($dcs) ? $dcs->id : null;
            } else {
                $nuevaCodificacion['dcs_id'] = null;
            }

            try {
                $codificacion = Codificacion::create($nuevaCodificacion);
            } catch (Throwable $e) {
                dd($nuevaCodificacion);
            }
        } else {
            $nuevaFrecuencia['codificada'] = false;
            $tipoCodificacion = null;
            $codificacion = null;
        }


        // BANDA
        if (!empty($linea[5])) {
            $banda = Banda::where('banda', str_replace(" ", "", strtolower($linea[5])))->first();
        }

        // MODO
        if (!empty($linea[18])) {
            $modo = ModoTransmision::where('nombre', 'like', '%' . substr($linea[18], 0, 2) . '%')->first();
        }


        // LOCALIZACION
        $localizacion = null;
        $location = Localizacion::where('localidad', $linea[4])->first();

        if ($linea[4] != "N/A") {
            if (empty($location)) {
                $nuevaLocalizacion['localidad'] = $linea[4];
                $nuevaLocalizacion['provincia'] = null;
                $nuevaLocalizacion['gps'] = null;
                $localizacion  = Localizacion::create($nuevaLocalizacion);
            } else {
                $localizacion = $location;
            }
        } else {
            $localizacion = null;
        }



        // FRECUENCIA
        $nuevaFrecuencia['frecuencia'] = str_replace(" Mhz", "", $linea[1]);

        $frecuencia = Frecuencia::create($nuevaFrecuencia);


        // TIPO DE CONTACTO

        $nombre = strtolower($linea[3]);

        if (
            strpos(
                $nombre,
                'polici'
            ) !== false ||
            strpos($nombre, 'bomber') !== false ||
            strpos($nombre, 'guardia') !== false ||
            strpos($nombre, 'protec') !== false ||
            strpos($nombre, 'ambu') !== false
        ) {
            echo "Servicio \n";
            $tipo_contacto = 7; // Servicios
        } elseif (
            strpos($nombre, 'aerop') !== false ||
            strpos($nombre, 'avi') !== false
        ) {
            echo "Aviación \n";
            $tipo_contacto = 2; // Aviacion
        } elseif (
            strpos($nombre, 'repe') !== false ||
            strpos($nombre, 'eco-') !== false ||
            strpos($nombre, 'remer') !== false
        ) {
            echo "URE \n";
            $tipo_contacto = 8;
        } else {
            $tipo_contacto = 1; // Desconocidos
        }


        unset($nombre);

        // CONTACTO
        if ($nuevoRepetidor) $nuevoContacto['repetidor_id'] = $nuevoRepetidor->id;
        if ($tipoCodificacion) $nuevoContacto['codificacion_id'] = $codificacion->id;
        if ($banda) $nuevoContacto['banda_id'] = $banda->id;
        if ($modo) $nuevoContacto['modo_id'] = $modo->id;
        $nuevoContacto['frecuencia_id'] = $frecuencia->id;
        $nuevoContacto['nombre'] = $linea[3];
        $nuevoContacto['observaciones'] = $linea[3];
        $nuevoContacto['comprobado'] = $comprobado;
        $nuevoContacto['fecha'] = $fecha;
        $nuevoContacto['hora'] = date("H:i:s", time());
        $nuevoContacto['localizacion_id'] = $localizacion->id ?? null;
        $nuevoContacto['user_id'] = 1;
        $nuevoContacto['tipo_id'] = $tipo_contacto;
        $nuevoContacto['hora'] = null;

        $contacto = Contacto::create($nuevoContacto);
    }
}
