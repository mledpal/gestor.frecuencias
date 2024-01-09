<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Frecuencia extends Model
{
    use HasFactory;

    protected $table = 'frecuencia';

    protected $fillable =['frecuencia', 'calidad', 'codificada', 'repetidor_id', 'codificacion_id', 'banda_id', 'modo_id']
}
