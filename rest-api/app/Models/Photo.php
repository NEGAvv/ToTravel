<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Photo extends Model
{
    protected $fillable = [
        'tourist_place_id',
        'caption',
        'source',
        'user',
        'thumbnail_url',
        'small_url',
        'medium_url',
        'large_url',
        'original_url',
    ];

    public function touristPlace()
    {
        return $this->belongsTo(TouristPlace::class);
    }
}
