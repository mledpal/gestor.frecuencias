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
        Schema::create('comentarios', function (Blueprint $table) {
            $table->id();
            $table->text('comentario');
            $table->unsignedBigInteger('user_id');
            $table->foreign('user_id', 'fk_comentario_user')->references('id')->on('users')->onDelete('cascade')->onUpdate('cascade');

            $table->unsignedBigInteger('frecuencia_id');
            $table->foreign('frecuencia_id', 'fk_comentario_frecuencia')->references('id')->on('frecuencia')->onDelete('cascade')->onUpdate('cascade');

            $table->unsignedBigInteger('localizacion_id')->nullable();
            $table->foreign('localizacion_id', 'fk_comentario_localizacion')->references('id')->on('localizacion')->nullonDelete()->cascadeOnUpdate();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('comentarios');
    }
};
