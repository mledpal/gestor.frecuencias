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
        Schema::create('evento', function (Blueprint $table) {
            $table->id();
            $table->string('nombre')->nullable(false);
            $table->string('indicativo')->nullable(false);
            $table->unsignedBigInteger('contacto_id')->nullable(false);
            $table->timestamps();

            $table->foreign('contacto_id','fk_even_cont')->references('id')->on('contacto')->onDelete('cascade')->onUpdate('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('evento');
    }
};
