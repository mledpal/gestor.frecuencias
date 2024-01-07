<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Ctcss extends Model
{
    use HasFactory;


    protected $table="ctcss_codes";
    protected $fillable=['codigo'];

    /**
     * Relación de CTCSS y su Codificación
     */

    public function codificacion()
    {
        return $this->belongsTo(Codificacion::class, 'id', 'ctcss');
    }
}
