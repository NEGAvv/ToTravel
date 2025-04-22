<?php

namespace App\Providers;

use App\Models\TouristPlace;
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
    ];

    /**
     * Bootstrap any authentication / authorization services.
     */
    public function boot(): void {}
}
