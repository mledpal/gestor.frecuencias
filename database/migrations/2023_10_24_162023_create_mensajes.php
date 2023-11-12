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
        Schema::create('mensajes', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('id_remitente')->nullable(false);
            $table->unsignedBigInteger('id_destinatario')->nullable(false);
            $table->text('mensaje');
            $table->timestamps();

            $table->foreign('id_remitente')->references('id')->on('users')->onDelete('restrict')->onUpdate('restrict');
            $table->foreign('id_destinatario')->references('id')->on('users')->onDelete('restrict')->onUpdate('restrict');
        });
    }
    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('mensajes');
    }
};
