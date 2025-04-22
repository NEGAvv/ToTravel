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
        Schema::create('tourist_places', function (Blueprint $table) {
            $table->id();
            $table->string('location_id')->unique();
            $table->string('name');
            $table->text('description')->nullable();
            $table->string('country')->nullable();
            $table->string('address_string')->nullable();
            $table->decimal('latitude', 10, 7)->nullable();
            $table->decimal('longitude', 10, 7)->nullable();
            $table->float('rating')->nullable();
            $table->string('category')->nullable();
            $table->index('category');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tourist_places');
    }
};
