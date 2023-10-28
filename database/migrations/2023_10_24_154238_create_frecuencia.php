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
        Schema::create('frecuencia', function (Blueprint $table) {
            $table->id();
            $table->string('frecuencia')->nullable(false);
            $table->tinyInteger('calidad')->default(0);
            $table->boolean('codificada');
            $table->unsignedBigInteger('codificacion')->nullable(true);
            $table->unsignedBigInteger('banda')->nullable(true);
            $table->timestamps();

            $table->foreign('codificacion')->references('id')->on('codificacion');
            $table->foreign('banda')->references('id')->on('banda');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('frecuencia');
    }
};
