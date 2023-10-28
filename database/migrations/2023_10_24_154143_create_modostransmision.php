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
        Schema::create('modostransmision', function (Blueprint $table) {
            $table->id();
            $table->enum('nombre', ["AM", "FM", "LSB", "USB", "CW", "FSK", "PSK", "RTTY", "Packet Radio", "D-STAR", "DMR", "P25", "C4FM", "PSK31", "APRS", "SSTV", "JT65", "FT8"]);
            $table->string('descripcion');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('modostransmision');
    }
};
