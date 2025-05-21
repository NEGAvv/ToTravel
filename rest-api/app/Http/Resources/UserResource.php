<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'role' => $this->role,
            'bio' => $this->bio,
            'location' => $this->location,
            'interests' => is_array($this->interests)
                ? $this->interests
                : (is_string($this->interests) ? explode(',', $this->interests) : []),
            'avatar_url' => $this->avatar ? asset('storage/avatars/' . $this->avatar) : null,
            'reviews' => ReviewResource::collection($this->whenLoaded('reviews')),

            // comments — if admin 
            'comments' => $this->when(
                $request->user()?->role === 'ADMIN' && $this->relationLoaded('comments'),
                fn() => $this->comments->map(function ($comment) {
                    return [
                        'id' => $comment->id,
                        'review_id' => $comment->review_id,
                        'comment_text' => $comment->comment_text,
                        'created_at' => $comment->created_at,
                    ];
                })
            ),

            'created_at' => $this->created_at,
        ];
    }
}
