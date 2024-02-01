<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Mensaje extends Model
{
    use HasFactory;

    protected $table = 'mensajes';
    protected $fillable = ['remitente_id', 'destinatario_id', 'mensaje'];

    /**
     * Relación del mensaje con el remitente
     */
    public function remitente() {
        return $this->belongsTo(User::class, 'remitente_id', 'id');
    }

    /**
     * Relación del mensaje con el destinatario
     */
    public function destinatario() {
        return $this->belongsTo(User::class, 'destinatario_id', 'id');
    }
}
