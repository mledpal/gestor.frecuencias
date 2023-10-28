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
        Schema::table('contacto', function (Blueprint $table) {
            $table->unsignedBigInteger('frecuencia')->nullable(false);
            $table->foreign('frecuencia')->references('id')->on('frecuencia');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('contacto', function (Blueprint $table) {
            $table->dropColumn('frecuencia');
        });
    }
};
