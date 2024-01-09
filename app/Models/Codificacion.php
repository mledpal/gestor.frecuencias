<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Codificacion extends Model
{
    use HasFactory;

    protected $table = 'codificacion';

    protected $fillable = ['tipo', 'DCS', 'CTCSS', 'observaciones'];

    /**
     * Relación de una Codificación y su tipo
     */
    public function tipo()
    {
        return $this->hasOne(TipoCodificacion::class, 'tipo', 'id');
    }

    /**
     * Relación de una Codificación y el Codigo CTCSS
     */
    public function ctcss()
    {
        return $this->hasOne(Ctcss::class, 'ctcss', 'id');
    }

    /**
     * Relación de una Codificación y el Codigo DCS
     */
    public function dcs()
    {
        return $this->hasOne(Dcs::class, 'dcs', 'id');
    }

    /**
     * Relación del repetidor con su frecuencia
     */
    public function frecuencia()
    {
        return $this->belongsTo(Frecuencia::class);
    }
}
