<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Frecuencia extends Model
{
    use HasFactory;

    protected $table = 'frecuencia';

    protected $fillable = ['frecuencia', 'calidad', 'codificada', 'repetidor_id', 'codificacion_id', 'banda_id', 'modo_id'];

    /**
     * Relación de una localización con su contacto
     */
    public function contacto()
    {
        return $this->hasOne(Contacto::class);
    }

    /**
     * Relación de la frecuencia con un repetidor
     */
    public function repetidor(): BelongsTo
    {
        return $this->belongsTo(Repetidor::class);
    }

    /**
     * Relación de la frecuencia con su codificación
     */
    public function codificacion()
    {
        return $this->belongsTo(Codificacion::class);
    }

    /**
     * Relación de la frecuencia con su banda
     */
    public function banda(): BelongsTo
    {
        return $this->belongsTo(Banda::class);
    }

    /**
     * Relación de la frecuencia con su modo de transmision
     */
    public function modo()
    {
        return $this->belongsTo(ModoTransmision::class);
    }

    /**
     * Función que devuelve el valor de la frecuencia con 3 decimales fijos
     */
    public function getFrecuenciaAttribute()
    {

        return number_format($this->attributes['frecuencia'], 3);
    }
}
