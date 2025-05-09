<?php

namespace App\Providers;

use App\Models\Comment;
use App\Models\Review;
use App\Models\TouristPlace;
use App\Policies\CommentPolicy;
use App\Policies\ReviewPolicy;
use App\Policies\TouristPlacePolicy;
use Illuminate\Support\ServiceProvider;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The policy mappings for the application.
     *
     * @var array<class-string, class-string>
     */
    protected $policies = [
        TouristPlace::class => TouristPlacePolicy::class,
        Review::class => ReviewPolicy::class,
        Comment::class => CommentPolicy::class,
    ];

    /**
     * Bootstrap any authentication / authorization services.
     */
    public function boot(): void {}
}
