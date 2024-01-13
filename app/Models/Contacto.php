<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Contacto extends Model
{
    use HasFactory;

    protected $table = "contacto";
    protected $fillable = ['nombre', 'comprobado', 'fecha', 'hora', 'tipo', 'localizacion_id', 'frecuencia_id', 'user_id', 'observaciones', 'tipo_id'];

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

}
