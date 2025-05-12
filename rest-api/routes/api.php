<?php

use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\CommentController;
use App\Http\Controllers\Api\LikeController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\PlaceController;
use App\Http\Controllers\Api\ReviewController;
use App\Http\Controllers\Api\TouristPlaceController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\AuthController;

// Route::get('/user', function (Request $request) {
//     return $request->user();
// })->middleware('auth:sanctum');

//Route::apiResource('places', PlaceController::class);

Route::get('/', function () {
    return "API is Working";
});




Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');

Route::middleware('auth:sanctum')->group(function () {

    // Routes of the tourist places
    Route::get('/places/search', [TouristPlaceController::class, 'search']);
    Route::get('places', [TouristPlaceController::class, 'index']);
    Route::get('places/{touristPlace}', [TouristPlaceController::class, 'show']);
    Route::post('places', [TouristPlaceController::class, 'store']);
    Route::put('places/{touristPlace}', [TouristPlaceController::class, 'update']);
    Route::delete('places/{touristPlace}', [TouristPlaceController::class, 'destroy']);


    // Routes of the categories

    Route::apiResource('categories', CategoryController::class)->only(['index', 'show']);

    // Reviews
    Route::get('/places/{touristPlace}/reviews', [ReviewController::class, 'index']);
    Route::post('places/{touristPlace}/reviews', [ReviewController::class, 'store']);
    Route::put('reviews/{review}', [ReviewController::class, 'update']);
    Route::delete('reviews/{review}', [ReviewController::class, 'destroy']);

    //Route::apiResource('reviews', ReviewController::class)->only(['index', 'show']);

    // Comments
    Route::post('reviews/{review}/comments', [CommentController::class, 'store']);
    Route::delete('comments/{comment}', [CommentController::class, 'destroy']);

    // Routes for likes
    Route::post('/likes', [LikeController::class, 'store']);
    Route::delete('/likes', [LikeController::class, 'destroy']);

    Route::get('/savedPlaces', [LikeController::class, 'savedPlaces']);

    // User profile
    Route::get('/user', [UserController::class, 'getUser']);
    Route::get('/profile', [UserController::class, 'show']);
    Route::put('/profile', [UserController::class, 'update']);
    Route::delete('/profile', [UserController::class, 'destroyOwnProfile']);

    // Admin routes
    Route::get('/admin/users', [UserController::class, 'index']);
    Route::get('/admin/users/search', [UserController::class, 'search']);
    Route::put('/admin/users/{id}', [UserController::class, 'adminUpdate']);
    Route::delete('/admin/users/{id}', [UserController::class, 'destroy']);

    // Admin review management
    Route::delete('/admin/reviews/{review}', [ReviewController::class, 'adminDestroy']);
    Route::put('/admin/reviews/{review}', [ReviewController::class, 'adminUpdate']);
});
