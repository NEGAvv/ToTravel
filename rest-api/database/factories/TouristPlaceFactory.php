<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;
use App\Models\TouristPlace;

class TouristPlaceFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = TouristPlace::class;

    /**
     * Define the model's default state.
     */
    public function definition(): array
    {
        return [
            'location_id' => fake()->numberBetween(-10000, 10000),
            'name' => fake()->name(),
            'description' => fake()->text(),
            'country' => fake()->country(),
            'address_string' => fake()->word(),
            'latitude' => fake()->latitude(),
            'longitude' => fake()->longitude(),
            'rating' => fake()->randomFloat(0, 0, 9999999999.),
            'rating_weighted' => fake()->randomFloat(0, 0, 9999999999.),
            'quality_score' => fake()->randomFloat(0, 0, 9999999999.),
            'review_count' => fake()->numberBetween(-10000, 10000),
            'category' => fake()->word(),
        ];
    }
}
