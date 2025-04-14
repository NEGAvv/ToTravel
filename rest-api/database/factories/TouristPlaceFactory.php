<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\TouristPlace>
 */
class TouristPlaceFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => $this->faker->companySuffix() . ' ' . $this->faker->citySuffix(),
            'location' => $this->faker->city() . ', ' . $this->faker->country(),
            'description' => $this->faker->realTextBetween(100, 180),
            'rating' => $this->faker->randomFloat(1, 3.5, 5.0),
        ];
    }
}
