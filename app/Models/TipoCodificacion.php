<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TipoCodificacion extends Model
{
    use HasFactory;

    protected $table="tipo_codificacion";
    protected $fillable= ['nombre'];
}