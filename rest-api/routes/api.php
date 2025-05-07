<?php

use App\Http\Controllers\Api\CategoryController;
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

Route::get('/places/search', [TouristPlaceController::class, 'search']);


Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');

Route::middleware('auth:sanctum')->group(function () {

    // Routes of the tourist places

    Route::get('places', [TouristPlaceController::class, 'index']);
    Route::get('places/{touristPlace}', [TouristPlaceController::class, 'show']);
    Route::post('places', [TouristPlaceController::class, 'store']);
    Route::put('places/{touristPlace}', [TouristPlaceController::class, 'update']);
    Route::delete('places/{touristPlace}', [TouristPlaceController::class, 'destroy']);


    // Routes of the categories

    Route::apiResource('categories', CategoryController::class)->only(['index', 'show']);


    Route::apiResource('reviews', ReviewController::class)->only(['index', 'show']);

    // Routes for likes

    Route::post('/likes', [LikeController::class, 'store']);
    Route::delete('/likes', [LikeController::class, 'destroy']);

    Route::get('/savedPlaces', [LikeController::class, 'savedPlaces']);

    Route::get('/profile', [UserController::class, 'show']);
    Route::put('/profile', [UserController::class, 'update']);

    // for the admin
    Route::get('/users', [UserController::class, 'index']);
    Route::delete('/users/{id}', [UserController::class, 'destroy']);
});
