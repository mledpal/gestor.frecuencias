<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Índice compuesto para la consulta de comentarios por frecuencia y
     * localización (ComentarioController::getComentarios), que filtra por
     * ambas columnas a la vez. Las claves foráneas ya crean índices de
     * columna única, pero no uno combinado.
     */
    public function up(): void
    {
        Schema::table('comentarios', function (Blueprint $table) {
            $table->index(['frecuencia_id', 'localizacion_id'], 'idx_comentarios_frecuencia_localizacion');
        });
    }

    public function down(): void
    {
        Schema::table('comentarios', function (Blueprint $table) {
            $table->dropIndex('idx_comentarios_frecuencia_localizacion');
        });
    }
};
