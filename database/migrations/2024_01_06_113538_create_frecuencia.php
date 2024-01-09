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
            $table->float('frecuencia')->nullable(false);
            $table->tinyInteger('calidad')->default(0);
            $table->boolean('codificada');
            $table->unsignedBigInteger('repetidor_id')->nullable();
            $table->unsignedBigInteger('codificacion_id')->nullable();
            $table->unsignedBigInteger('banda_id')->nullable();
            $table->unsignedBigInteger('modo_id')->nullable(false);
            $table->timestamps();

            $table->foreign('codificacion_id', 'fk_frec_codi')->references('id')->on('codificacion')->onDelete('restrict')->onUpdate('restrict');
            $table->foreign('modo_id', 'fk_frec_modo')->references('id')->on('modotransmision')->onDelete('restrict')->onUpdate('restrict');
            $table->foreign('banda_id', 'fk_frec_band')->references('id')->on('banda')->onDelete('restrict')->onUpdate('restrict');
            $table->foreign('repetidor_id', 'fk_frec_repe')->references('id')->on('repetidor')->onDelete('restrict')->onUpdate('restrict');
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
