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
        Schema::create('persona', function (Blueprint $table) {
            $table->id();
            $table->string('nombre')->nullable(false);
            $table->string('indicativo')->nullable(false);
            $table->unsignedBigInteger('localizacion')->nullable(false);
            $table->timestamps();
            $table->foreign('localizacion')->references('id')->on('localizacion');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('persona');
    }
};
