<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\TouristPlace;
use App\Services\TripAdvisorService;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;


class TouristPlaceController extends Controller
{
    use AuthorizesRequests;


    protected TripAdvisorService $tripAdvisorService;

    public function __construct(TripAdvisorService $tripAdvisorService)
    {
        $this->tripAdvisorService = $tripAdvisorService;
    }

    public function search(Request $request)
    {
        $query = $request->input('query');
        $results = $this->tripAdvisorService->search($query);

        return response()->json($results);
    }


    public function index(Request $request)
    {
        $queryBuilder = TouristPlace::with(['categories', 'reviews', 'photos'])
            ->withCount('likes');

        if ($request->filled('search')) {
            $searchTerm = strtolower($request->search);

            $queryBuilder->whereRaw('LOWER(name) LIKE ?', ['%' . $searchTerm . '%']);

            $checkResults = clone $queryBuilder;

            if (!$checkResults->exists()) {
                $results = $this->tripAdvisorService->search($searchTerm);

                $queryBuilder = TouristPlace::with(['categories', 'reviews', 'photos'])
                    ->withCount('likes')
                    ->whereRaw('LOWER(name) LIKE ?', ['%' . $searchTerm . '%']);
            }
        }


        if ($request->filled('categories')) {
            $queryBuilder->whereHas('categories', function ($q) use ($request) {
                $q->whereIn('name', $request->categories);
            });
        }

        if ($request->filled('rating')) {
            $selectedRating = (float) $request->rating;
            $queryBuilder->where('rating', '>=', $selectedRating)
                ->where('rating', '<', $selectedRating + 1);
        }

        if ($request->filled('country')) {
            $queryBuilder->where('country', $request->country);
        }

        if ($request->filled('sort_by')) {
        $sortField = $request->sort_by;
        $sortOrder = $request->get('sort_order', 'asc');

        if (in_array($sortField, ['name', 'rating', 'likes_count'])) {
            if ($sortField === 'rating') {
                $queryBuilder->orderByRaw("rating IS NULL")
                    ->orderBy('rating', $sortOrder);
            } else {
                $queryBuilder->orderBy($sortField, $sortOrder);
            }
        }
    } else {
        $queryBuilder->orderByRaw("quality_score IS NULL")
            ->orderBy('quality_score', 'desc')
            ->orderBy('rating_weighted', 'desc')
            ->orderBy('review_count', 'desc'); 
    }


        return $queryBuilder->limit(12)->get();
    }


    public function show($id)
    {
        return TouristPlace::with([
            'categories',
            'reviews.user',
            'reviews.comments.user',
            'reviews.likes',
            'photos',
        ])
            ->withCount('likes')
            ->findOrFail($id);
    }


    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $this->authorize('create', TouristPlace::class);

        $validated = $request->validate([
            'location_id'     => 'required|integer|exists:locations,id',
            'name'            => 'required|string|max:255',
            'description'     => 'nullable|string',
            'country'         => 'required|string|max:100',
            'address_string'  => 'nullable|string|max:255',
            'latitude'        => 'nullable|numeric|between:-90,90',
            'longitude'       => 'nullable|numeric|between:-180,180',
            'rating'          => 'nullable|numeric|min:0|max:5',
            'category_ids'    => 'nullable|array',
            'category_ids.*'  => 'exists:categories,id',
        ]);


        $place = TouristPlace::create($validated);

        if (!empty($validated['category_ids'])) {
            $place->categories()->sync($validated['category_ids']);
        }

        return response()->json($place->load(['categories', 'reviews', 'photos']), 201);
    }



    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, TouristPlace $touristPlace)
    {
        $this->authorize('update', $touristPlace);

        $validated = $request->validate([
            'location_id'     => 'sometimes|required|integer|exists:locations,id',
            'name'            => 'sometimes|required|string|max:255',
            'description'     => 'nullable|string',
            'country'         => 'sometimes|required|string|max:100',
            'address_string'  => 'nullable|string|max:255',
            'latitude'        => 'nullable|numeric|between:-90,90',
            'longitude'       => 'nullable|numeric|between:-180,180',
            'rating'          => 'nullable|numeric|min:0|max:5',
            'category_ids'    => 'nullable|array',
            'category_ids.*'  => 'exists:categories,id',
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
        $this->authorize('delete', $touristPlace);

        $touristPlace->categories()->detach();
        $touristPlace->delete();

        return response()->json(['message' => 'Place deleted']);
    }
}
