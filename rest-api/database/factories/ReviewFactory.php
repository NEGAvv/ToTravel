<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;
use App\Models\Place;
use App\Models\Review;
use App\Models\TouristPlace;
use App\Models\User;

class ReviewFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Review::class;

    /**
     * Define the model's default state.
     */
    public function definition(): array
    {
        return [
            'place_id' => Place::factory(),
            'user_id' => User::factory(),
            'rating' => fake()->numberBetween(-10000, 10000),
            'review_text' => fake()->text(),
            'tourist_place_id' => TouristPlace::factory(),
        ];
    }
}
