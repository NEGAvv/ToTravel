<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Like extends Model
{
    /** @use HasFactory<\Database\Factories\LikeFactory> */
    use HasFactory;

    protected $fillable = [
        'place_id', 
        'review_id', 
        'user_id'
];

    public function place()
    {
        return $this->belongsTo(TouristPlace::class, 'place_id');
    }

    public function review()
    {
        return $this->belongsTo(Review::class, 'review_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
