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
        Schema::create('users_roles', function (Blueprint $table) {

            $table->unsignedBigInteger('id_user')->nullable(false);
            $table->unsignedBigInteger('id_rol')->nullable(false);

            $table->foreign('id_user')->references('id')->on('users');
            $table->foreign('id_rol')->references('id')->on('roles');

            $table->primary(['id_user', 'id_rol']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users_roles');
    }
};
