<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Dcs extends Model
{
    use HasFactory;

    protected $table="dcs_codes";
    protected $fillable=['codigo'];
}
