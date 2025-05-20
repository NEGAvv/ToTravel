<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserPreference extends Model
{
    protected $fillable = ['user_id', 'rating', 'category', 'country'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
