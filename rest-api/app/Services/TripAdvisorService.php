<?php

namespace App\Services;

use App\Models\TouristPlace;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Cache;

class TripAdvisorService
{
    public function search(string $query): array
    {
        $cached = $this->getFromCache($query);
        if ($cached) {
            return array_merge($cached, ['cached' => true]);
        }

        $dbResults = $this->searchDatabase($query);
        if ($dbResults->count() >= 5) {
            return $this->cacheAndReturn($query, 'database', $dbResults, 'Found in local database');
        }

        $apiResults = $this->searchExternalApi($query);
        if ($apiResults === null) {
            return $this->handleApiFailure($dbResults);
        }

        $savedPlaces = $this->processAndSaveApiResults($apiResults);
        $results = !empty($savedPlaces) ? $savedPlaces : $dbResults;

        return $this->cacheAndReturn(
            $query,
            !empty($savedPlaces) ? 'api_and_database' : 'database',
            $results,
            !empty($savedPlaces) ? 'Combined results from database and API' : 'Used existing results from database'
        );
    }

    private function getFromCache(string $query): ?array
    {
        $cacheKey = 'search:' . md5($query);
        return Cache::get($cacheKey);
    }

    private function searchDatabase(string $query)
    {
        return TouristPlace::where('name', 'ILIKE', "%$query%")
            ->orWhere('address_string', 'ILIKE', "%$query%")
            ->orWhere('description', 'ILIKE', "%$query%")
            ->limit(5)
            ->get();
    }

    private function searchExternalApi(string $query): ?array
    {
        $key = config('services.tripadvisor.key');
        $baseUrl = rtrim(config('services.tripadvisor.base_url'), '/');
        $searchUrl = "$baseUrl/location/search?key=$key&searchQuery=" . urlencode($query) . "&language=en";

        $response = Http::withHeaders(['accept' => 'application/json'])
            ->timeout(30)
            ->get($searchUrl);

        if ($response->failed()) return null;

        return $response->json()['data'] ?? [];
    }

    private function handleApiFailure($dbResults): array
    {
        return $dbResults->isNotEmpty() ? [
            'source' => 'database',
            'results' => $dbResults,
            'message' => 'Used partial results from database (API failed)'
        ] : [
            'error' => 'Search API request failed'
        ];
    }

    private function processAndSaveApiResults(array $apiResults): array
    {
        $saved = [];

        foreach (array_slice($apiResults, 0, 5) as $result) {
            try {
                if (!isset($result['location_id'])) continue;

                $locationId = $result['location_id'];
                if (TouristPlace::where('location_id', $locationId)->exists()) continue;

                $details = $this->fetchPlaceDetails($locationId);
                if (!$details || !isset($details['name'])) continue;

                $placeData = $this->mapDetailsToPlaceData($details);
                $saved[] = TouristPlace::create($placeData);
            } catch (\Exception $e) {
                continue;
            }
        }

        return $saved;
    }

    private function fetchPlaceDetails(string $locationId): ?array
    {
        $key = config('services.tripadvisor.key');
        $baseUrl = rtrim(config('services.tripadvisor.base_url'), '/');
        $url = "$baseUrl/location/$locationId/details";

        $response = Http::retry(3, 1000)
            ->withHeaders(['accept' => 'application/json'])
            ->timeout(30)
            ->get($url, [
                'key' => $key,
                'language' => 'en',
                'currency' => 'USD'
            ]);

        return $response->failed() ? null : $response->json();
    }

    private function mapDetailsToPlaceData(array $details): array
    {
        return [
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
    }

    private function cacheAndReturn(string $query, string $source, $results, string $message): array
    {
        $data = [
            'source' => $source,
            'results' => $results,
            'message' => $message
        ];

        Cache::put('search:' . md5($query), $data, now()->addDays(7));
        return $data;
    }
}
