<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Review extends Model
{
    /** @use HasFactory<\Database\Factories\ReviewFactory> */
    use HasFactory;

    protected $fillable = [
        'place_id',
        'user_id',
        'rating',
        'review_text'
    ];

    public function place()
    {
        return $this->belongsTo(TouristPlace::class, 'place_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function comments()
    {
        return $this->hasMany(Comment::class, 'review_id');
    }

    public function likes()
    {
        return $this->hasMany(Like::class, 'review_id');
    }

    protected static function booted()
    {
        static::created(function ($review) {
            $review->place->updateRating();
        });

        static::updated(function ($review) {
            $review->place->updateRating();
        });

        static::deleted(function ($review) {
            $review->place->updateRating();
        });
    }
}
