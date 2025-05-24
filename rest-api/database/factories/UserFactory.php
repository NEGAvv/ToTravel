<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;


/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\User>
 */
class UserFactory extends Factory
{
    /**
     * The current password being used by the factory.


     */
    protected static ?string $password;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $interestsPool = [
            'travel',
            'photography',
            'mountains',
            'sea',
            'urban adventure',
            'cycling',
            'food',
            'music',
            'history',
            'architecture',
            'cultural events',
            'camping',
            'rafting',
            'hiking'
        ];

        return [
            'name' => $this->faker->name(),
            'email' => $this->faker->unique()->safeEmail(),
            'email_verified_at' => now(),
            'password' => static::$password ??= Hash::make('password'),
            'role' => 'USER',
            'bio' => $this->faker->realTextBetween(40, 100),
            'location' => $this->faker->city() . ', ' . $this->faker->country(),
            'interests' => implode(', ', $this->faker->randomElements($interestsPool, rand(2, 4))),
            'remember_token' => Str::random(10),

        ];
    }

    /**
     * Indicate that the model's email address should be unverified.
     */
    public function unverified(): static
    {
        return $this->state(fn(array $attributes) => [
            'email_verified_at' => null,
        ]);
    }
}
