<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Codificacion extends Model
{
    use HasFactory;

    protected $table = 'codificacion';

    protected $fillable = ['tipo_id', 'dcs_id', 'ctcss_id'];

    /**
     * Relación de una Codificación y su tipo
     */
    public function tipo()
    {
        return $this->belongsTo(TipoCodificacion::class);
    }

    /**
     * Relación de una Codificación y el Codigo CTCSS
     */
    public function ctcss()
    {
        return $this->belongsTo(Ctcss::class);
    }

    /**
     * Relación de una Codificación y el Codigo DCS
     */
    public function dcs()
    {
        return $this->belongsTo(Dcs::class);
    }

    /**
     * Relación del repetidor con su frecuencia
     */
    public function contacto()
    {
        return $this->hasMany(Contacto::class);
    }
}
