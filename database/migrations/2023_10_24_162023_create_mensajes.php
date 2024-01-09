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
            $table->unsignedBigInteger('remitente_id')->nullable(false);
            $table->unsignedBigInteger('destinatario_id')->nullable(false);
            $table->text('mensaje');
            $table->timestamps();

            $table->foreign('remitente_id')->references('id')->on('users')->onDelete('restrict')->onUpdate('restrict');
            $table->foreign('destinatario_id')->references('id')->on('users')->onDelete('restrict')->onUpdate('restrict');
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
