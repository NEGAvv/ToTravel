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
        Schema::table('tourist_places', function (Blueprint $table) {
            $table->decimal('rating_weighted', 3, 2)->nullable()->after('rating');
            $table->unsignedSmallInteger('quality_score')->nullable()->after('rating_weighted');
            $table->unsignedInteger('review_count')->default(0)->after('quality_score');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('tourist_places', function (Blueprint $table) {
            $table->dropColumn(['rating_weighted', 'quality_score', 'review_count']);
        });
    }
};
