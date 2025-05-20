<?php

namespace App\Http\Controllers;

use App\Models\UserPreference;
use App\Services\RecommendationService;
use Illuminate\Http\Request;

class UserPreferenceController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'rating' => 'required|numeric|min:0|max:5',
            'category' => 'required|string|max:255',
            'country' => 'required|string|max:255',
        ]);

        cache()->forget('user_recommendations_' . $request->user()->id);

        $preference = UserPreference::updateOrCreate(
            ['user_id' => $request->user()->id],
            $request->only('rating', 'category', 'country')
        );

        return response()->json([
            'message' => 'Preferences saved successfully',
            'data' => $preference
        ]);
    }

    public function show(Request $request)
    {
        $preference = $request->user()->preference;

        return response()->json([
            'data' => $preference
        ]);
    }

    public function recommendations(Request $request)
    {
        $recommendationService = new RecommendationService();
        $recommendations = $recommendationService->getRecommendationsForUser($request->user());

        if ($recommendations->isEmpty()) {
            return response()->json([
                'message' => 'No recommendations found. Try adjusting your preferences.',
                'data' => []
            ], 404);
        }

        $recommendations->load([
            'categories',
            'reviews.user',
            'reviews.comments.user',
            'reviews.likes',
            'photos',
        ]);
        $recommendations->loadCount('likes');

        return response()->json([
            'message' => 'Personal recommendations based on your preferences and liked places',
            'data' => $recommendations
        ]);
    }
}
