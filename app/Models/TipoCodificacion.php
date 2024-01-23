<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TipoCodificacion extends Model
{
    use HasFactory;

    protected $table = "tipo_codificacion";
    protected $fillable = ['nombre'];

    /**
     * Relación de un Tipo de Codificación y su Codificación
     */
    public function codificacion()
    {
        return $this->hasOne(Contacto::class);
    }
}
