<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;


class Frecuencia extends Model
{
    use HasFactory;

    protected $table = 'frecuencia';

    protected $fillable = ['frecuencia'];

    /**
     * Relación de una localización con su contacto
     */
    public function contacto()
    {
        return $this->hasMany(Contacto::class);
    }

    /**
     * Relación de una frecuencia con sus comentarios
     */
    public function comentarios()
    {
        return $this->hasMany(Comentario::class);
    }

    /**
     * Función que devuelve el valor de la frecuencia con 3 decimales fijos
     */
    public function getFrecuenciaAttribute()
    {

        return number_format($this->attributes['frecuencia'], 3);
    }
}
