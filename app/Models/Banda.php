<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Banda extends Model
{
    use HasFactory;

    protected $table="banda";

    protected $fillable=['banda'];

    /**
     * Relación de una banda con una frecuencia
     */
    public function contactos()
    {
        return $this->hasMany(Contacto::class);
    }
}
