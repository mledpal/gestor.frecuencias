<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Localizacion extends Model
{
    use HasFactory;

    protected $table = 'localizacion';

    protected $fillable = ['localidad', 'provincia', 'pais', 'gps'];


    /**
     * Relación de una localización con su usuario
     */
    public function usuario(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Relación de una localización con su frecuencia
     */
    public function frecuencia(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }


}
