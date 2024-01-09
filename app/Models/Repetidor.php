<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Repetidor extends Model
{
    use HasFactory;

    protected $table ="repetidor";

    protected $fillable = ['offset', 'direccion'];

    /**
     * Relación del repetidor con su frecuencia
     */
    public function frecuencia() {
        return $this->belongsTo(Frecuencia::class);
    }
}
