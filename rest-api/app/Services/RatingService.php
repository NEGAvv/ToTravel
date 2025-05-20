<?php

namespace App\Services;

use App\Models\TouristPlace;
use Illuminate\Support\Facades\Cache;

class RatingService
{
    private float $globalAverageRating;
    private int $minVotesRequired;

    public function __construct(float $globalAverageRating, int $minVotesRequired = 10)
    {
        $this->globalAverageRating = $globalAverageRating;
        $this->minVotesRequired = $minVotesRequired;
    }

    public function calculateWeightedRating(float $averageRating, int $numberOfVotes): float
    {
        // Формула зваженого середнього: R_b = (v/(v+m))*R + (m/(v+m))*C
        $weightedRating = ($numberOfVotes / ($numberOfVotes + $this->minVotesRequired)) * $averageRating
            + ($this->minVotesRequired / ($numberOfVotes + $this->minVotesRequired)) * $this->globalAverageRating;

        return $weightedRating;
    }

    public function normalizeRating(float $weightedRating): float
    {
        // Нормалізація до шкали 0-1 (де min=1, max=5)
        return ($weightedRating - 1) / (5 - 1);
    }

    public function calculateQualityScore(float $normalizedRating): int
    {
        // Перетворення на шкалу 0-100
        return (int) round($normalizedRating * 100);
    }

    public function getGlobalAverageRating(): float
    {
        return $this->globalAverageRating;
    }
}
