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
            $table->unsignedBigInteger('id_repetidor')->nullable();
            $table->unsignedBigInteger('id_codificacion')->nullable();
            $table->unsignedBigInteger('id_banda')->nullable();
            $table->unsignedBigInteger('id_modo')->nullable(false);
            $table->timestamps();

            $table->foreign('id_codificacion', 'fk_frec_codi')->references('id')->on('codificacion')->onDelete('restrict')->onUpdate('restrict');
            $table->foreign('id_modo', 'fk_frec_modo')->references('id')->on('modostransmision')->onDelete('restrict')->onUpdate('restrict');
            $table->foreign('id_banda', 'fk_frec_band')->references('id')->on('banda')->onDelete('restrict')->onUpdate('restrict');
            $table->foreign('id_repetidor', 'fk_frec_repe')->references('id')->on('repetidor')->onDelete('restrict')->onUpdate('restrict');
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
