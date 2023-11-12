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
            $table->unsignedBigInteger('id_localizacion')->nullable(false);
            $table->timestamps();

            $table->foreign('id_localizacion', 'fk_pers_loca')->references('id')->on('localizacion')->onDelete('restrict')->onUpdate('restrict');;
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
