<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Like;
use App\Models\TouristPlace;

class LikeController extends Controller
{


    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'place_id' => 'nullable|exists:tourist_places,id',
            'review_id' => 'nullable|exists:reviews,id',
        ]);

        $user = $request->user();

        if (!$request->place_id && !$request->review_id) {
            return response()->json(['error' => 'place_id or review_id is required'], 422);
        }

        if ($request->place_id && $request->review_id) {
            return response()->json(['error' => 'Only one of place_id or review_id should be set'], 422);
        }

        $conditions = [
            'user_id' => $user->id,
            'place_id' => $request->place_id,
            'review_id' => $request->review_id,
        ];

        // Check if like already exists
        $existing = Like::where($conditions)->first();
        if ($existing) {
            return response()->json(['message' => 'You already liked this item'], 409);
        }

        $like = Like::create($conditions);

        return response()->json(['message' => 'Liked successfully', 'like' => $like], 201);
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request)
    {
        $request->validate([
            'place_id' => 'nullable|exists:tourist_places,id',
            'review_id' => 'nullable|exists:reviews,id',
        ]);

        $user = $request->user();

        $like = Like::where('user_id', $user->id)
            ->where('place_id', $request->place_id)
            ->where('review_id', $request->review_id)
            ->first();

        if (!$like) {
            return response()->json(['message' => 'Like not found'], 404);
        }

        $like->delete();

        return response()->json(['message' => 'Like removed successfully']);
    }

    public function savedPlaces()
    {
        $userId = auth()->id();
    
        $places = TouristPlace::whereHas('likes', function ($query) use ($userId) {
            $query->where('user_id', $userId);
        })
        ->with(['photos', 'categories', 'likes'])
        ->withCount('likes')
        ->get();
    
        return response()->json($places);
    }
}
