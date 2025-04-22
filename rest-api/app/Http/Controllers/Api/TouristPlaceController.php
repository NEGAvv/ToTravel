<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\TouristPlace;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Cache;

class TouristPlaceController extends Controller
{
    use AuthorizesRequests;




    public function search(Request $request)
    {
        $request->validate([
            'query' => 'required|string|min:2',
        ]);

        $result = $this->searchAndStorePlace($request->query('query'));

        if (isset($result['error'])) {
            return response()->json($result, 404);
        }

        return response()->json($result);
    }

    public function searchAndStorePlace(string $query): array
    {
        $cacheKey = 'search:' . md5($query); 
        $cached = Cache::get($cacheKey);

        if ($cached) {
            return array_merge($cached, ['cached' => true]);
        }

        // 1. search in db
        $dbResults = TouristPlace::where('name', 'ILIKE', "%$query%")
            ->orWhere('address_string', 'ILIKE', "%$query%")
            ->orWhere('description', 'ILIKE', "%$query%")
            ->limit(5)
            ->get();



        
        if ($dbResults->count() >= 5) {
            return [
                'source' => 'database',
                'results' => $dbResults,
                'message' => 'Found in local database'
            ];
        }

        // 2. config of api
        $key = config('services.tripadvisor.key');
        $baseUrl = rtrim(config('services.tripadvisor.base_url'), '/');

        // 3. search query
        $searchUrl = "$baseUrl/location/search?key=$key&searchQuery=" . urlencode($query) . "&language=en";

        $searchResponse = Http::withHeaders(['accept' => 'application/json'])
            ->timeout(30)
            ->get($searchUrl);

        if ($searchResponse->failed()) {
            // return what in the db if api won't work
            return $dbResults->isNotEmpty() ? [
                'source' => 'database',
                'results' => $dbResults,
                'message' => 'Used partial results from database (API failed)'
            ] : [
                'error' => 'Search API request failed',
                'status' => $searchResponse->status(),
                'details' => $searchResponse->json()
            ];
        }

        $apiResults = $searchResponse->json()['data'] ?? [];

        if (empty($apiResults)) {
            return $dbResults->isNotEmpty() ? [
                'source' => 'database',
                'results' => $dbResults,
                'message' => 'Used results from database (no API results)'
            ] : [
                'error' => 'No results found anywhere'
            ];
        }

        // 4. proccess results
        $savedPlaces = [];
        $errors = [];

        foreach (array_slice($apiResults, 0, 5) as $result) {
            try {
                if (!isset($result['location_id'])) continue;

                $locationId = $result['location_id'];

                // is duplicate
                if (TouristPlace::where('location_id', $locationId)->exists()) {
                    continue;
                }

                // details api
                $detailsUrl = "$baseUrl/location/$locationId/details";
                $detailsResponse = Http::retry(3, 1000)
                    ->withHeaders(['accept' => 'application/json'])
                    ->timeout(30)
                    ->get($detailsUrl, [
                        'key' => $key,
                        'language' => 'en',
                        'currency' => 'USD',
                    ]);

                if ($detailsResponse->failed()) continue;

                $details = $detailsResponse->json();
                if (!isset($details['name'], $details['location_id'])) continue;

                // prepare data
                $placeData = [
                    'location_id' => $details['location_id'],
                    'name' => $details['name'],
                    'description' => $details['description'] ?? null,
                    'country' => $details['address_obj']['country'] ?? null,
                    'address_string' => $details['address_obj']['address_string'] ?? null,
                    'latitude' => $details['latitude'] ?? null,
                    'longitude' => $details['longitude'] ?? null,
                    'rating' => $details['rating'] ?? null,
                    'category' => $details['category']['name'] ?? $details['category']['localized_name'] ?? null,
                ];

                // save
                $place = TouristPlace::create($placeData);
                $savedPlaces[] = $place;

            } catch (\Exception $e) {
                $errors[] = [
                    'location_id' => $result['location_id'] ?? null,
                    'name' => $result['name'] ?? null,
                    'error' => $e->getMessage()
                ];
                continue;
            }
        }

        // return [
        //     'source' => !empty($savedPlaces) ? 'api_and_database' : 'database',
        //     'results' =>  $savedPlaces,
        //     'message' => !empty($savedPlaces)
        //         ? 'Combined results from database and API'
        //         : 'Used existing results from database',
        //     'errors' => $errors
        // ];
        $resultToCache = [
            'source' => !empty($savedPlaces) ? 'api_and_database' : 'database',
            'results' => !empty($savedPlaces) ? $savedPlaces : $dbResults,
            'message' => !empty($savedPlaces)
                ? 'Combined results from database and API'
                : 'Used existing results from database',
            //'errors' => $errors
        ];

        Cache::put($cacheKey, $resultToCache, now()->addDays(7));

        return $resultToCache;
    }

    



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
