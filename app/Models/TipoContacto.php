<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TipoContacto extends Model
{
    use HasFactory;

    protected $table = "tipo_contacto";
    protected $fillable = ['nombre'];

    /**
     * Relación de un Tipo de Contacto con sus Contactos
     */
    public function contactos() {
        return $this->hasMany(Contacto::class);
    }
}
