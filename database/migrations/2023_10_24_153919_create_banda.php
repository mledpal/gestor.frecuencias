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
        Schema::create('banda', function (Blueprint $table) {
            $table->id();
            $table->enum('banda', ["160m", "80m", "40m", "20m", "15m", "10m", "2m", "70cm", "23cm", "13cm", "3cm", "6cm", "9cm", "24cm", "47cm"])->default('2m');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('banda');
    }
};
