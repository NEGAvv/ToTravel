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
        Schema::create('photos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tourist_place_id')->constrained()->onDelete('cascade');
            $table->string('caption')->nullable();
            $table->string('source')->nullable();
            $table->string('user')->nullable();
            $table->string('thumbnail_url')->nullable();
            $table->string('small_url')->nullable();
            $table->string('medium_url')->nullable();
            $table->string('large_url')->nullable();
            $table->string('original_url')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('photos');
    }
};
