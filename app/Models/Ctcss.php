<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Ctcss extends Model
{
    use HasFactory;


    protected $table="ctcss_codes";
    protected $fillable=['codigo'];
}
