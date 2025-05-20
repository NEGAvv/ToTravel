<?php

namespace App\Http\Controllers\Api;

use App\Models\Review;
use App\Http\Controllers\Controller;
use App\Models\TouristPlace;
use Illuminate\Http\Request;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class ReviewController extends Controller
{
    use AuthorizesRequests;
    /**
     * Display a listing of the resource.
     */
    public function index(TouristPlace $touristPlace)
    {
        return $touristPlace->reviews()->with('user', 'comments.user')->latest()->get();
    }

    public function store(Request $request, TouristPlace $touristPlace)
    {
        $validated = $request->validate([
            'rating' => 'required|numeric|min:1|max:5',
            'review_text' => 'nullable|string|max:1000',
        ]);

        $review = Review::create([
            'place_id' => $touristPlace->id,
            'user_id' => auth()->id(),
            'rating' => $validated['rating'],
            'review_text' => $validated['review_text'],
        ]);

        $touristPlace->updateRating();
        
        cache()->forget('user_recommendations_' . $request->user()->id);

        return response()->json($review->load('user'), 201);
    }


    public function update(Request $request, Review $review)
    {
        $this->authorize('update', $review);

        $validated = $request->validate([
            'rating' => 'required|numeric|min:1|max:5',
            'review_text' => 'nullable|string|max:1000',
        ]);

        $review->update($validated);

        return response()->json($review->refresh());
    }

    public function destroy(Review $review)
    {
        $this->authorize('delete', $review);

        $place = $review->place;
        $review->delete();
        //$this->updatePlaceRating($place);

        return response()->json(['message' => 'Review deleted']);
    }

    protected function updatePlaceRating(TouristPlace $place)
    {
        $average = $place->reviews()->avg('rating');
        $place->update(['rating' => $average]);
    }
}
