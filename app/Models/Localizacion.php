<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Localizacion extends Model
{
    use HasFactory;

    protected $table = 'localizacion';

    protected $fillable = ['calle', 'localidad', 'provincia', 'pais', 'gps'];


    /**
     * Relación de una localización con su usuario
     */
    public function localizacion(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
