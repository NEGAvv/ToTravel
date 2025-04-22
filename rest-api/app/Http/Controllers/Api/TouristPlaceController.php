<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\TouristPlace;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class TouristPlaceController extends Controller
{
    use AuthorizesRequests;


    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return TouristPlace::with(['categories', 'reviews'])->get();
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        return TouristPlace::with(['categories', 'reviews'])->findOrFail($id);
    }


    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $this->authorize('create', TouristPlace::class);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'location' => 'required|string|max:255',
            'description' => 'nullable|string',
            'rating' => 'nullable|numeric|min:0|max:5',
            'category_ids' => 'nullable|array',
            'category_ids.*' => 'exists:categories,id',
        ]);

        $place = TouristPlace::create($validated);

        if (!empty($validated['category_ids'])) {
            $place->categories()->sync($validated['category_ids']);
        }

        return response()->json($place->load(['categories', 'reviews']), 201);
    }



    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, TouristPlace $touristPlace)
    {
        $this->authorize('update', $touristPlace);

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'location' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'rating' => 'nullable|numeric|min:0|max:5',
            'category_ids' => 'nullable|array',
            'category_ids.*' => 'exists:categories,id',
        ]);

        // Update main data
        $touristPlace->update($validated);

        // Sync categories 
        if (isset($validated['category_ids'])) {
            $touristPlace->categories()->sync($validated['category_ids']);
        }

        return response()->json($touristPlace->load(['categories', 'reviews']));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(TouristPlace $touristPlace)
    {
        $this->authorize('delete', TouristPlace::class);

        $touristPlace->categories()->detach();
        $touristPlace->delete();

        return response()->json(['message' => 'Place deleted']);
    }

}
