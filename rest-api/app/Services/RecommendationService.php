<?php

namespace App\Services;

use App\Models\TouristPlace;
use App\Models\User;
use Rubix\ML\Datasets\Labeled;
use Rubix\ML\Classifiers\KNearestNeighbors;
use Rubix\ML\Extractors\CSV;
use Rubix\ML\Persisters\Filesystem;
use Rubix\ML\Transformers\OneHotEncoder;
use Rubix\ML\Transformers\NumericStringConverter;
use Rubix\ML\Pipeline;
use Rubix\ML\CrossValidation\Reports\Accuracy;
use Rubix\ML\PersistentModel;
use Illuminate\Console\Command;
use Illuminate\Support\Collection;

class RecommendationService
{
    const RECOMMENDATIONS_LIMIT = 12;

    public function getRecommendationsForUser(User $user): Collection
    {
        $cacheKey = 'user_recommendations_' . $user->id;
        return cache()->remember($cacheKey, now()->addHours(1), function () use ($user) {
            $recommendations = collect();

            if ($user->preference) {
                $recommendations = $this->getByPreferences($user->preference);
            }

            if ($recommendations->count() < self::RECOMMENDATIONS_LIMIT) {
                $remaining = self::RECOMMENDATIONS_LIMIT - $recommendations->count();
                $byLikes = $this->getByLikes($user, $remaining);
                $recommendations = $recommendations->merge($byLikes);
            }

            if ($recommendations->count() < self::RECOMMENDATIONS_LIMIT) {
                $remaining = self::RECOMMENDATIONS_LIMIT - $recommendations->count();
                $popular = $this->getPopularPlaces($remaining);
                $recommendations = $recommendations->merge($popular);
            }

            return $recommendations->unique('id')->take(self::RECOMMENDATIONS_LIMIT);
        });
    }

    protected function getByPreferences($preferences): Collection
    {
        $query = TouristPlace::query();

        if ($preferences->country) {
            $query->where('country', 'ilike', $preferences->country);
        }

        if ($preferences->category) {
            $query->whereHas(
                'categories',
                fn($q) => $q->where('name', 'ilike', $preferences->category)
            );
        }

        return $query->where('rating', '>=', $preferences->rating)
            ->orderBy('quality_score', 'desc')
            ->limit(self::RECOMMENDATIONS_LIMIT)
            ->get();
    }

    protected function getByLikes(User $user, int $limit): Collection
    {
        $likedPlaceIds = $user->likes()->pluck('place_id');

        if ($likedPlaceIds->isEmpty()) {
            return collect();
        }

        $likedData = TouristPlace::whereIn('id', $likedPlaceIds)
            ->select('country')
            ->with('categories')
            ->get();

        $likedCategories = $likedData->pluck('categories')->flatten()->pluck('id');
        $likedCountries = $likedData->pluck('country')->unique();

        return TouristPlace::where(function ($query) use ($likedCategories, $likedCountries) {
            $query->whereHas(
                'categories',
                fn($q) =>
                $q->whereIn('categories.id', $likedCategories)
            )->orWhereIn('country', $likedCountries);
        })
            ->whereNotIn('id', $likedPlaceIds)
            ->orderBy('quality_score', 'desc')
            ->limit($limit)
            ->get();
    }

    protected function getPopularPlaces(int $limit): Collection
    {
        return TouristPlace::orderBy('quality_score', 'desc')
            ->limit($limit)
            ->get();
    }
}
