<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;
use App\Models\Photo;
use App\Models\TouristPlace;

class PhotoFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Photo::class;

    /**
     * Define the model's default state.
     */
    public function definition(): array
    {
        return [
            'tourist_place_id' => TouristPlace::factory(),
            'caption' => fake()->word(),
            'source' => fake()->word(),
            'user' => fake()->word(),
            'thumbnail_url' => fake()->word(),
            'small_url' => fake()->word(),
            'medium_url' => fake()->word(),
            'large_url' => fake()->word(),
            'original_url' => fake()->word(),
        ];
    }
}
