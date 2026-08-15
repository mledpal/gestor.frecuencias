<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Las claves foráneas ya crean índice de columna única, pero no cubren
     * los ORDER BY / WHERE compuestos que usan MensajeController y
     * ContactoController, que hoy provocan filesort en MySQL:
     *  - mensajes: el filtro es un OR de (remitente,destinatario) en ambos
     *    sentidos, ordenado por created_at (MensajeController::recuperarConversacion
     *    y ::getConversaciones), de ahí los dos índices con el par invertido.
     *  - contacto: where('user_id')->orderBy('nombre') es la consulta base
     *    de casi todos los listados de contactos; 'privado' se filtra en la
     *    búsqueda pública de ContactoController::busqueda.
     */
    public function up(): void
    {
        Schema::table('mensajes', function (Blueprint $table) {
            $table->index(['remitente_id', 'destinatario_id', 'created_at'], 'idx_mensajes_rem_dest_fecha');
            $table->index(['destinatario_id', 'remitente_id', 'created_at'], 'idx_mensajes_dest_rem_fecha');
        });

        Schema::table('contacto', function (Blueprint $table) {
            $table->index(['user_id', 'nombre'], 'idx_contacto_usuario_nombre');
            $table->index('privado', 'idx_contacto_privado');
        });
    }

    public function down(): void
    {
        Schema::table('mensajes', function (Blueprint $table) {
            $table->dropIndex('idx_mensajes_rem_dest_fecha');
            $table->dropIndex('idx_mensajes_dest_rem_fecha');
        });

        Schema::table('contacto', function (Blueprint $table) {
            $table->dropIndex('idx_contacto_usuario_nombre');
            $table->dropIndex('idx_contacto_privado');
        });
    }
};
