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
        Schema::create('usuarios_contactos', function (Blueprint $table) {
            $table->unsignedBigInteger('user_id')->nullable(false);
            $table->unsignedBigInteger('contacto_id')->nullable(false);

            $table->foreign('user_id', 'fk_user_contacto')->references('id')->on('users');
            $table->foreign('contacto_id', 'fk_contacto_user')->references('id')->on('contacto');

            $table->primary(['user_id', 'contacto_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('usuarios_contactos');
    }
};
