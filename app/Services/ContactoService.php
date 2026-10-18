<?php

namespace App\Services;

use App\Models\Contacto;
use App\Models\Frecuencia;
use App\Models\Localizacion;
use App\Models\Repetidor;
use App\Models\User;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\DB;

/**
 * Lógica de negocio de los contactos compartida por el controlador web
 * (Inertia) y la API REST de la app móvil: deduplicación de los catálogos
 * Frecuencia / Localizacion / Repetidor, chequeo de duplicados y búsqueda.
 */
class ContactoService
{
    /**
     * Relaciones que se cargan siempre al devolver contactos.
     */
    public const RELACIONES = ['localizacion', 'tipo', 'frecuencia', 'codificacion', 'ctcss', 'dcs', 'banda', 'modo', 'repetidor'];

    /**
     * Selects que usan el sentinel -1 ("Desconocido"/"Ninguno").
     */
    private const SELECTS = ['ctcss_id', 'dcs_id', 'banda_id', 'modo_id', 'codificacion_id'];

    /**
     * Normaliza los selects que usan el sentinel -1 a null antes de persistir.
     *
     * @param  array<string, mixed>  $datos
     * @return array<string, mixed>
     */
    public function normalizarSelects(array $datos): array
    {
        foreach (self::SELECTS as $campo) {
            if (! array_key_exists($campo, $datos) || $datos[$campo] == -1) {
                $datos[$campo] = null;
            }
        }

        if (array_key_exists('localizacion_id', $datos) && $datos['localizacion_id'] == -1) {
            $datos['localizacion_id'] = null;
        }

        return $datos;
    }

    /**
     * Comprueba si el usuario ya tiene un contacto con la misma frecuencia y
     * localidad/provincia.
     */
    public function existeDuplicado(User $user, ?string $frecuencia, ?string $localidad, ?string $provincia, ?int $excluirId = null): bool
    {
        return Contacto::whereHas('frecuencia', function (Builder $query) use ($frecuencia) {
            $this->whereFrecuencia($query, $frecuencia);
        })->whereHas('localizacion', function (Builder $query) use ($localidad, $provincia) {
            $query->where('localidad', $localidad)->where('provincia', $provincia);
        })->where('user_id', $user->id)
            ->when($excluirId, fn ($query) => $query->where('id', '!=', $excluirId))
            ->exists();
    }

    /**
     * Busca la frecuencia en el catálogo o la crea.
     */
    public function resolverFrecuencia(string $frecuencia): int
    {
        $existente = $this->whereFrecuencia(Frecuencia::query(), $frecuencia)->first();

        return ($existente ?? Frecuencia::create(['frecuencia' => $frecuencia]))->id;
    }

    /**
     * Filtra por frecuencia con tolerancia: la columna es float(8,4) y una
     * igualdad exacta falla con valores no representables (118.1 se guarda
     * como 118.0999...), lo que duplicaba frecuencias en el catálogo.
     */
    private function whereFrecuencia(Builder $query, ?string $frecuencia): Builder
    {
        return $query->whereRaw('ABS(frecuencia - ?) < 0.00005', [(float) $frecuencia]);
    }

    /**
     * Busca el repetidor (offset + dirección) o lo crea. Null si no hay offset.
     */
    public function resolverRepetidor(?string $offset, ?string $direccion): ?int
    {
        if (! isset($offset) || ! isset($direccion)) {
            return null;
        }

        return Repetidor::firstOrCreate(['offset' => $offset, 'direccion' => $direccion])->id;
    }

    /**
     * Crea un contacto nuevo para el usuario.
     *
     * @param  array<string, mixed>  $datos
     */
    public function crear(User $user, array $datos): Contacto
    {
        $datos = $this->normalizarSelects($datos);

        // Localización
        $localizacion_id = $datos['localizacion_id'] ?? null;
        if (isset($datos['localidad']) || isset($datos['provincia']) || isset($datos['gps'])) {
            $localizacion = Localizacion::firstOrCreate([
                'localidad' => $datos['localidad'] ?? null,
                'provincia' => $datos['provincia'] ?? null,
                'pais' => $datos['pais'] ?? null,
                'gps' => $datos['gps'] ?? null,
            ]);

            $localizacion_id = $localizacion->id;
        }

        return Contacto::create([
            'nombre' => $datos['nombre'],
            'comprobado' => $datos['comprobado'] ?? false,
            'privado' => $datos['privado'] ?? false,
            'fecha' => $datos['fecha'],
            'hora' => $datos['hora'] ?? null,
            'tipo_id' => $datos['tipo_id'],
            'localizacion_id' => $localizacion_id,
            'frecuencia_id' => $this->resolverFrecuencia($datos['frecuencia']),
            'repetidor_id' => $this->resolverRepetidor($datos['offset'] ?? null, $datos['direccion'] ?? null),
            'codificacion_id' => $datos['codificacion_id'],
            'dcs_id' => $datos['dcs_id'],
            'ctcss_id' => $datos['ctcss_id'],
            'banda_id' => $datos['banda_id'],
            'modo_id' => $datos['modo_id'],
            'user_id' => $user->id,
            'observaciones' => $datos['observaciones'] ?? null,
            'calidad' => $datos['calidad'] ?? 0,
            'favorito' => $datos['favorito'] ?? false,
        ]);
    }

    /**
     * Actualiza un contacto en una única transacción. Si no llega
     * `frecuencia_id` (API), la frecuencia se resuelve a partir del texto.
     *
     * @param  array<string, mixed>  $datos
     */
    public function actualizar(Contacto $contacto, array $datos): Contacto
    {
        $datos = $this->normalizarSelects($datos);

        DB::transaction(function () use ($contacto, $datos) {
            $contacto->update([
                'nombre' => $datos['nombre'],
                'privado' => $datos['privado'] ?? false,
                'comprobado' => $datos['comprobado'] ?? false,
                'fecha' => $datos['fecha'],
                'hora' => $datos['hora'] ?? null,
                'tipo_id' => $datos['tipo_id'],
                'observaciones' => $datos['observaciones'] ?? null,
                'frecuencia_id' => $datos['frecuencia_id'] ?? $this->resolverFrecuencia($datos['frecuencia']),
                'calidad' => $datos['calidad'] ?? 0,
                'banda_id' => $datos['banda_id'],
                'modo_id' => $datos['modo_id'],
                'ctcss_id' => $datos['ctcss_id'],
                'dcs_id' => $datos['dcs_id'],
                'codificacion_id' => $datos['codificacion_id'],
                'favorito' => $datos['favorito'] ?? false,
            ]);

            // REPETIDOR: sin offset se desvincula; si no, se busca o se crea.
            $contacto->update([
                'repetidor_id' => isset($datos['offset'])
                    ? Repetidor::firstOrCreate(['offset' => $datos['offset'], 'direccion' => $datos['direccion'] ?? null])->id
                    : null,
            ]);

            // LOCALIZACION
            $localizacion_bus = Localizacion::where('localidad', $datos['localidad'] ?? null)
                ->where('provincia', $datos['provincia'] ?? null)
                ->where('pais', $datos['pais'] ?? null)
                ->where('gps', $datos['gps'] ?? null)
                ->first();

            if (isset($datos['localizacion_id']) && ! empty($localizacion_bus)) {
                if ($localizacion_bus->id == $datos['localizacion_id']) { // Es la misma localización
                    $contacto->localizacion->update([
                        'localidad' => $datos['localidad'] ?? null,
                        'provincia' => $datos['provincia'] ?? null,
                        'pais' => $datos['pais'] ?? null,
                        'gps' => $datos['gps'] ?? null,
                    ]);
                } else { // Existe la localización pero no es la anterior
                    $contacto->update(['localizacion_id' => $localizacion_bus->id]);
                }
            } elseif (! empty($localizacion_bus)) { // Sin localización previa pero ya existe en el catálogo
                $contacto->update(['localizacion_id' => $localizacion_bus->id]);
            } elseif (isset($datos['localidad']) && isset($datos['pais'])) { // No existe: se crea
                $localizacion = Localizacion::create([
                    'localidad' => $datos['localidad'],
                    'provincia' => $datos['provincia'] ?? null,
                    'pais' => $datos['pais'],
                    'gps' => $datos['gps'] ?? null,
                ]);

                $contacto->update(['localizacion_id' => $localizacion->id]);
            }
        });

        return $contacto->refresh();
    }

    /**
     * Construye la consulta de búsqueda de contactos: propios (`propio`) o
     * públicos de otros usuarios, con filtros opcionales.
     *
     * @param  array<string, mixed>  $filtros
     */
    public function buscar(User $user, array $filtros): Builder
    {
        if (! empty($filtros['propio'])) {
            $busqueda = Contacto::with(self::RELACIONES)->where('user_id', $user->id);
        } else {
            $busqueda = Contacto::with(['usuario' => function ($query) {
                $query->select('id', 'username', 'photo');
            }])
                ->with(self::RELACIONES)
                ->where('privado', false)
                ->where('user_id', '!=', $user->id);
        }

        $busqueda->orderBy('nombre', 'asc');

        if (isset($filtros['nombre'])) {
            $busqueda->where('nombre', 'like', '%'.$filtros['nombre'].'%');
        }

        if (isset($filtros['frecuencia'])) {
            $busqueda->whereHas('frecuencia', function ($query) use ($filtros) {
                $query->where('frecuencia', 'like', '%'.$filtros['frecuencia'].'%');
            });
        }

        if (isset($filtros['tipo_id'])) {
            $busqueda->where('tipo_id', $filtros['tipo_id']);
        }

        if (isset($filtros['comprobado'])) {
            $busqueda->where('comprobado', $filtros['comprobado']);
        }

        if (isset($filtros['fecha_ini'])) {
            $busqueda->whereDate('fecha', '>=', $filtros['fecha_ini']);
        }

        if (isset($filtros['fecha_fin'])) {
            $busqueda->whereDate('fecha', '<=', $filtros['fecha_fin']);
        }

        if (isset($filtros['localidad'])) {
            $busqueda->whereHas('localizacion', function ($query) use ($filtros) {
                $query->where('localidad', 'like', '%'.$filtros['localidad'].'%');
            });
        }

        if (isset($filtros['provincia'])) {
            $busqueda->whereHas('localizacion', function ($query) use ($filtros) {
                $query->where('provincia', 'like', '%'.$filtros['provincia'].'%');
            });
        }

        return $busqueda;
    }
}
