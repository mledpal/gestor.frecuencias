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
            $table->time('hora');
            $table->enum('tipo', ['servicio', 'persona', 'evento']);
            $table->unsignedBigInteger('servicio')->nullable(true);
            $table->unsignedBigInteger('persona')->nullable(true);
            $table->unsignedBigInteger('frecuencia')->nullable(false);
            $table->unsignedBigInteger('user')->nullable(false);

            $table->timestamps();

            $table->foreign('user')->references('id')->on('users');
            $table->foreign('frecuencia')->references('id')->on('frecuencia');
            $table->foreign('servicio')->references('id')->on('servicio');
            $table->foreign('persona')->references('id')->on('persona');
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
