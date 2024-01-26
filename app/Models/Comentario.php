<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Comentario extends Model
{
    use HasFactory;

    protected $table = 'comentarios';

    protected $fillable = ['comentario', 'user_id', 'localizacion_id', 'frecuencia_id'];


    /**
     * Relación de un comentario con su usuario
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Relación de un comentario con su localización
     */

    public function localizacion()
    {
        return $this->belongsTo(Localizacion::class);
    }

    /**
     * Relación de un comentario con su frecuencia
     */
    public function frecuencia()
    {
        return $this->belongsTo(Frecuencia::class);
    }
}
