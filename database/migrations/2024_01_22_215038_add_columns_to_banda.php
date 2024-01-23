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
        Schema::table('banda', function (Blueprint $table) {
            $table->string('nombre')->after('banda')->nullable();
            $table->char('uit')->after('nombre')->nullable();
            $table->string('frecuencia')->after('uit')->nullable();
            $table->string('longitud')->after('frecuencia')->nullable();
            $table->text('uso')->after('longitud')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('banda', function (Blueprint $table) {
            $table->dropColumn('abreviatura');
            $table->dropColumn('frecuencia');
            $table->dropColumn('longitud');
            $table->dropColumn('uso');
        });
    }
};
