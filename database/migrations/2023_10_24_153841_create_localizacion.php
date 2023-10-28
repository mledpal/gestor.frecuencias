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
        Schema::create('localizacion', function (Blueprint $table) {
            $table->id();
            $table->string('calle')->nullable(false);
            $table->string('localidad')->nullable();
            $table->string('provincia')->nullable();
            $table->string('pais')->default('España');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('localizacion');
    }
};
