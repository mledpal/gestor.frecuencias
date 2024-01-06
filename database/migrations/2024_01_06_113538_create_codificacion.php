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

            $table->unsignedBigInteger('tipo')->nullable()->change();
            $table->foreignId('tipo', 'fk_codificacion_tipo')->references('id')->on('tipo_codificacion')->onDelete('restrict')->onUpdate('restrict');

            $table->unsignedBigInteger('DCS')->nullable()->change();
            $table->foreignId('DCS', 'fk_codificacion_dcs')->references('id')->on('dcs_codes')->onDelete('restrict')->onUpdate('restrict');

            $table->unsignedBigInteger('CTCSS')->nullable()->change();
            $table->foreignId('CTCSS', 'fk_codificacion_ctcss')->references('id')->on('ctcss_codes')->onDelete('restrict')->onUpdate('restrict');

            // $table->enum('tipo', ['Ninguna', 'secrafonia', 'DMR', 'Tetra', 'Tetrapol', 'MPT1327'])->default('Ninguna');

            // $table->enum('DCS', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104]);

            // $table->enum('CTCSS', [0, 67.0, 69.3, 71.9, 74.4, 77.0, 79.7, 82.5, 85.4, 88.5, 91.5, 94.8, 97.4, 100.0, 103.5, 107.2, 110.9, 114.8, 118.8, 123.0, 127.3, 131.8, 136.5, 141.3, 146.2, 151.4, 156.7, 162.2, 167.9, 173.8, 179.9, 186.2, 192.8, 203.5, 210.7, 218.1, 225.7, 233.6, 241.8, 250.3]);

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
