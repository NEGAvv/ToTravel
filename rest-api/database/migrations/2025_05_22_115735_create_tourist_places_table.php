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
            $table->integer('location_id');
            $table->string('name');
            $table->text('description');
            $table->string('country');
            $table->string('address_string');
            $table->double('latitude');
            $table->double('longitude');
            $table->float('rating')->default('0');
            $table->float('rating_weighted')->default('0');
            $table->float('quality_score')->default('0');
            $table->integer('review_count')->default(0);
            $table->string('category')->nullable();
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
