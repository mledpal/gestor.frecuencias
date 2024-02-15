<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('usuarios_contactos', function (Blueprint $table) {
            // Eliminar la restricción de clave externa existente
            $table->dropForeign('fk_user_contacto');

            // Establecer la eliminación en cascada para la clave externa user_id
            $table->foreign('user_id', 'fk_user_contacto')
                ->references('id')->on('users')
                ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('usuarios_contactos', function (Blueprint $table) {
            // Revertir los cambios si es necesario
            $table->dropForeign('fk_user_contacto');
            // Volver a establecer la restricción de clave externa original
            $table->foreign('user_id', 'fk_user_contacto')
                ->references('id')->on('users');
        });
    }
};
