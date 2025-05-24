<?php

namespace App\Models;

use App\Services\RatingService;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class TouristPlace extends Model
{
    /** @use HasFactory<\Database\Factories\TouristPlaceFactory> */
    use HasFactory;

    protected $fillable = [
        'location_id',
        'name',
        'description',
        'country',
        'address_string',
        'latitude',
        'longitude',
        'rating',
        'rating_weighted',
        'quality_score',
        'review_count',
        'category',

    ];

    public function reviews()
    {
        return $this->hasMany(Review::class, 'place_id');
    }

    public function likes()
    {
        return $this->hasMany(Like::class, 'place_id');
    }

    public function categories()
    {
        return $this->belongsToMany(Category::class, 'category_tourist_place', 'place_id', 'category_id');
    }

    public function photos()
    {
        return $this->hasMany(Photo::class);
    }


    public function updateRating()
    {
        $reviews = $this->reviews();

        $averageRating = $reviews->avg('rating') ?? 0;
        $reviewCount = $reviews->count();

        $globalAverage = Review::avg('rating') ?? 3.0;

        $calculator = new RatingService($globalAverage);

        $weightedRating = $calculator->calculateWeightedRating($averageRating, $reviewCount);
        $normalizedRating = $calculator->normalizeRating($weightedRating);
        $qualityScore = $calculator->calculateQualityScore($normalizedRating);

        $this->update([
            'rating' => round($averageRating, 1),
            'rating_weighted' => round($weightedRating, 2),
            'quality_score' => $qualityScore,
            'review_count' => $reviewCount,
        ]);
        $this->refresh();
    }
}
