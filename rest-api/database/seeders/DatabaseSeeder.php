<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Like;
use App\Models\Review;
use App\Models\User;
use App\Models\Comment;
use App\Models\TouristPlace;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        // User::factory()->create([
        //     'name' => 'Test User',
        //     'email' => 'test@example.com',
        // ]);

        // User::create([
        //     'name' => 'Admin User',
        //     'email' => 'admin@example.com',
        //     'email_verified_at' => now(),
        //     'password' => Hash::make('password123'),
        //     'role' => 'ADMIN',
        //     'bio' => 'Я головний адміністратор сайту.',
        //     'location' => 'Київ, Україна',
        //     'interests' => json_encode(['керування', 'моніторинг', 'безпека']),
        // ]);

        User::factory(10)->create();

        // Категорії і туристичні місця
        // Category::factory(5)->create();

        // TouristPlace::factory(10)->create()->each(function ($place) {
        //     $categories = Category::inRandomOrder()->take(rand(1, 3))->pluck('id');
        //     $place->categories()->attach($categories);
        // });

        // // Завантаження існуючих записів
        $users = User::all();
        $places = TouristPlace::all();

        if ($users->count() && $places->count()) {
            Review::factory(50)->make()->each(function ($review) use ($users, $places) {
                $review->user_id = $users->random()->id;
                $review->place_id = $places->random()->id;
                $review->save();
            });
        }

        $reviews = Review::all();

        if ($users->count() && $reviews->count()) {
            Comment::factory(100)->make()->each(function ($comment) use ($users, $reviews) {
                $comment->user_id = $users->random()->id;
                $comment->review_id = $reviews->random()->id;
                $comment->save();
            });

            Like::factory(200)->make()->each(function ($like) use ($users, $places, $reviews) {
                do {
                    $like->user_id = $users->random()->id;

                    if ($places->count() && rand(0, 1)) {
                        $like->place_id = $places->random()->id;
                        $like->review_id = null;
                    } elseif ($reviews->count()) {
                        $like->place_id = null;
                        $like->review_id = $reviews->random()->id;
                    }

                    // Check if this combination already exists
                    $exists = Like::where('user_id', $like->user_id)
                        ->where('place_id', $like->place_id)
                        ->where('review_id', $like->review_id)
                        ->exists();
                } while ($exists);

                $like->save();
            });
        }
    }
}
