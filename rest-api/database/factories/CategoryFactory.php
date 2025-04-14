<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Category>
 */
class CategoryFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $categories = [
            'Historical Sites',
            'Beaches',
            'Mountains',
            'Museums',
            'Adventure Parks',
            'Religious Sites',
            'Wildlife Sanctuaries',
            'City Tours',
            'Cultural Heritage',
            'Food & Drinks',
            'Lakes & Rivers',
            'National Parks',
            'Hiking Trails',
            'Shopping Districts',
            'Art Galleries',
            'Nightlife',
            'Local Markets',
            'Zoos & Aquariums',
            'Landmarks',
            'Festivals & Events'
        ];

        return [
            'name' => $this->faker->unique()->randomElement($categories),
        ];
    }
}
