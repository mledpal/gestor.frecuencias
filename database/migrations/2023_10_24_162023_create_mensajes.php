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
            $table->unsignedBigInteger('remitente')->nullable(false);
            $table->unsignedBigInteger('destinatario')->nullable(false);
            $table->text('mensaje');
            $table->timestamps();
            $table->foreign('remitente')->references('id')->on('users')->onDelete('cascade')->onUpdate('cascade');
            $table->foreign('destinatario')->references('id')->on('users')->onDelete('cascade')->onUpdate('cascade');
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
