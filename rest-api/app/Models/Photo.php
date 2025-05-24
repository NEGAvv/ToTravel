<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Photo extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
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

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'id' => 'integer',
            'tourist_place_id' => 'integer',
        ];
    }

    public function touristPlace(): BelongsTo
    {
        return $this->belongsTo(TouristPlace::class);
    }
}
