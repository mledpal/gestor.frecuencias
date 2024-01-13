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
        Schema::create('contacto', function (Blueprint $table) {
            $table->id();
            $table->string('nombre')->nullable(false);
            $table->boolean('comprobado');
            $table->date('fecha');
            $table->time('hora')->nullable();

            $table->unsignedBigInteger('tipo_id')->nullable();
            $table->foreign('tipo_id', 'fk_cont_tipo')->references('id')->on('tipo_contacto')->onDelete('restrict')->onUpdate('restrict');

            $table->unsignedBigInteger('localizacion_id')->nullable();
            $table->foreign('localizacion_id', 'fk_cont_loca')->references('id')->on('localizacion')->onDelete('restrict')->onUpdate('restrict');

            $table->unsignedBigInteger('frecuencia_id')->nullable(false);
            $table->foreign('frecuencia_id', 'fk_cont_frecu')->references('id')->on('frecuencia')->onDelete('cascade')->onUpdate('cascade');

            $table->unsignedBigInteger('user_id')->nullable(false);
            $table->foreign('user_id', 'fk_cont_user')->references('id')->on('users')->onDelete('restrict')->onUpdate('restrict');

            $table->text('observaciones')->nullable();

            $table->timestamps();

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('contacto');
    }
};
