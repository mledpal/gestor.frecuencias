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
        Schema::create('codificacion', function (Blueprint $table) {
            $table->id();

            $table->unsignedBigInteger('tipo_id')->nullable()->change();
            $table->foreignId('tipo_id', 'fk_codificacion_tipo')->references('id')->on('tipo_codificacion')->onDelete('restrict')->onUpdate('restrict');

            $table->unsignedBigInteger('DCS_id')->nullable()->change();
            $table->foreignId('DCS_id', 'fk_codificacion_dcs')->references('id')->on('dcs_codes')->onDelete('restrict')->onUpdate('restrict');

            $table->unsignedBigInteger('CTCSS_id')->nullable()->change();
            $table->foreignId('CTCSS_id', 'fk_codificacion_ctcss')->references('id')->on('ctcss_codes')->onDelete('restrict')->onUpdate('restrict');

            $table->text('observaciones')->nullable(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('codificacion');
    }
};
