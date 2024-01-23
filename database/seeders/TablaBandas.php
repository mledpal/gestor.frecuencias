<?php

namespace Database\Seeders;

use App\Models\Banda;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class TablaBandas extends Seeder
{
    //{["160m", "80m", "40m", "20m", "15m", "10m", "2m", "70cm", "23cm", "13cm", "3cm", "6cm", "9cm", "24cm", "47cm"])->default('2m');
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        foreach ($this->datos() as $key => $value) {
            Banda::firstOrCreate($value);
        }
    }

    private function datos()
    {
        return [
            ['banda' => 'Desconocida'],
            ['banda' => 'FM Comercial'],
            ['banda' => '160m', 'frecuencia' => '1.8 - 2.0 MHz'],
            ['banda' => '80m', 'frecuencia' => '3.5 - 4.0 MHz'],
            ['banda' => '40m', 'frecuencia' => '7.0 - 7.3 MHz'],
            ['banda' => '20m', 'frecuencia' => '14.0 - 14.35 MHz'],
            ['banda' => '15m', 'frecuencia' => '21.0 - 21.45 MHz'],
            ['banda' => '10m', 'frecuencia' => '28.0 - 29.7 MHz'],
            ['banda' => '2m', 'frecuencia' => '144 - 148 MHz'],
            ['banda' => '70cm', 'frecuencia' => '420 - 450 MHz'],

            ['nombre' => 'Frecuencia tremendamente baja', 'banda' => 'TLF', 'uit' => '', 'frecuencia' => '< 3 Hz', 'longitud' => '> 100,000 km', 'uso' => 'Frecuencia en la que trabaja la actividad neuronal'],
            ['nombre' => 'Frecuencia extremadamente baja', 'banda' => 'ELF', 'uit' => '1', 'frecuencia' => '3–30 Hz', 'longitud' => '100,000 km – 10,000 km', 'uso' => 'Actividad neuronal, comunicación con submarinos'],
            ['nombre' => 'Frecuencia superbaja', 'banda' => 'SLF', 'uit' => '2', 'frecuencia' => '30–300 Hz', 'longitud' => '10,000 km – 1000 km', 'uso' => 'Comunicación con submarinos'],
            ['nombre' => 'Frecuencia ultrabaja', 'banda' => 'ULF', 'uit' => '3', 'frecuencia' => '300–3000 Hz', 'longitud' => '1000 km – 100 km', 'uso' => 'Comunicación con submarinos, comunicaciones en minas a través de la tierra'],
            ['nombre' => 'Frecuencia muy baja', 'banda' => 'VLF', 'uit' => '4', 'frecuencia' => '3–30 kHz', 'longitud' => '100 km – 10 km', 'uso' => 'Radioayuda, señales de tiempo, comunicación submarina, pulsómetros inalámbricos, Geofísica'],
            ['nombre' => 'Frecuencia baja u onda larga', 'banda' => 'LF', 'uit' => '5', 'frecuencia' => '30–300 kHz', 'longitud' => '10 km – 1 km', 'uso' => 'Radioayuda, señales de tiempo, radiodifusión en AM (onda larga) (Europa y partes de Asia), RFID, radioafición'],
            ['nombre' => 'Frecuencia media u onda media', 'banda' => 'MF', 'uit' => '6', 'frecuencia' => '300–3000 kHz', 'longitud' => '1 km – 100 m', 'uso' => 'Radiodifusión en AM (onda media), radioafición, balizamiento de aludes'],
            ['nombre' => 'Frecuencia alta u onda corta', 'banda' => 'HF', 'uit' => '7', 'frecuencia' => '3–30 MHz', 'longitud' => '100 m – 10 m', 'uso' => 'Radiodifusión en onda corta, banda ciudadana y radioafición, comunicaciones de aviación sobre el horizonte, RFID, radar, comunicaciones ALE, comunicación cuasi-vertical (NVIS), telefonía móvil y marina'],
            ['nombre' => 'Frecuencia muy alta', 'banda' => 'VHF', 'uit' => '8', 'frecuencia' => '30–300 MHz', 'longitud' => '10 m – 1 m', 'uso' => 'FM, televisión, comunicaciones con aviones a la vista entre tierra-avión y avión-avión, telefonía móvil marítima y terrestre, radioaficionados, radio meteorológica'],
            ['nombre' => 'Frecuencia ultraalta', 'banda' => 'UHF', 'uit' => '9', 'frecuencia' => '300–3000 MHz', 'longitud' => '1 m – 100 mm', 'uso' => 'Televisión, hornos microondas, comunicaciones por microondas, radioastronomía, telefonía móvil, redes inalámbricas, Bluetooth, ZigBee, GPS, comunicaciones uno a uno como FRS y GMRS, radioafición'],
            ['nombre' => 'Frecuencia superalta', 'banda' => 'SHF', 'uit' => '10', 'frecuencia' => '3–30 GHz', 'longitud' => '100 mm – 10 mm', 'uso' => 'Radioastronomía, comunicaciones por microondas, redes inalámbricas, radares modernos, comunicaciones por satélite, televisión por satélite, DBS, radioafición'],
            ['nombre' => 'Frecuencia extremadamente alta', 'banda' => 'EHF', 'uit' => '11', 'frecuencia' => '30–300 GHz', 'longitud' => '10 mm – 1 mm', 'uso' => 'Radioastronomía, transmisión por microondas de alta frecuencia, teledetección, radioafición, armas de microondas, escáner de ondas milimétricas'],
            ['nombre' => 'Terahercios o Frecuencia tremendamente alta', 'banda' => 'THz or THF', 'uit' => '12', 'frecuencia' => '300–3,000 GHz', 'longitud' => '1 mm – 100 μm', 'uso' => 'Radiografía de terahercios – un posible substituto para los rayos X en algunas aplicaciones médicas, dinámica molecular ultrarrápida, física de la materia condensada, espectroscopía mediante terahercios, comunicaciones/computación mediante terahercios, teledetección submilimétrica, radioafición']
        ];
    }
}
