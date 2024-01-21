<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Contacto extends Model
{
    use HasFactory;

    protected $table = "contacto";
    protected $fillable = ['nombre', 'comprobado', 'fecha', 'hora', 'localizacion_id', 'frecuencia_id', 'user_id', 'observaciones', 'tipo_id', 'privado','calidad', 'repetidor_id', 'codificacion_id', 'banda_id', 'modo_id'];

    /**
     * Relación de un contacto con una frecuencia
     */
    public function frecuencia()
    {
        return $this->belongsTo(Frecuencia::class, 'frecuencia_id', 'id');
    }

    /**
     * Relación de un contacto con su usuario
     */
    public function usuario()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Relación de un contacto con la localizacion
     */
    public function localizacion()
    {
        return $this->belongsTo(Localizacion::class, 'localizacion_id', 'id');
    }

    /**
     * Relación de un contacto con el tipo de contacto que tiene
     */
    public function tipo()
    {
        return $this->belongsTo(TipoContacto::class);
    }

    /**
     * Relación del contacto con un repetidor
     */
    public function repetidor(): BelongsTo
    {
        return $this->belongsTo(Repetidor::class);
    }

    /**
     * Relación del contacto con su codificación
     */
    public function codificacion()
    {
        return $this->belongsTo(Codificacion::class);
    }

    /**
     * Relación del contacto con su banda
     */
    public function banda(): BelongsTo
    {
        return $this->belongsTo(Banda::class);
    }

    /**
     * Relación del contacto con su modo de transmision
     */
    public function modo()
    {
        return $this->belongsTo(ModoTransmision::class);
    }


    /**
     * Devuelve la hora formateada como H:m
     */
    public function getHoraAttribute() {
        if ($this->attributes['hora'] != null) {
            return date('H:m', strtotime($this->attributes['hora']));
        } else {
            return null;
        }
    }
}
