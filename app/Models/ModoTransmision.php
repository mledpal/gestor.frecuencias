<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ModoTransmision extends Model
{
    use HasFactory;

    protected $table = 'modotransmision';

    protected $fillable = ['nombre', 'descripcion'];
}
