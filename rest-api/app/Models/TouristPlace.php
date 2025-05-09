<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TouristPlace extends Model
{
    /** @use HasFactory<\Database\Factories\TouristPlaceFactory> */
    use HasFactory;

    protected $fillable = [
        'location_id',
        'name',
        'description',
        'country',
        'address_string',
        'latitude',
        'longitude',
        'rating',
        'category',
    ];

    public function reviews()
    {
        return $this->hasMany(Review::class, 'place_id');
    }

    public function likes()
    {
        return $this->hasMany(Like::class, 'place_id');
    }

    public function categories()
    {
        return $this->belongsToMany(Category::class, 'category_tourist_place', 'place_id', 'category_id');
    }

    public function photos()
    {
        return $this->hasMany(Photo::class);
    }

    
    public function updateRating()
    {
        $averageRating = $this->reviews()->avg('rating');
        $this->rating = round($averageRating, 1);
        $this->save();
    }
}
