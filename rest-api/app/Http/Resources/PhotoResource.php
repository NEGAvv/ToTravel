<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PhotoResource extends JsonResource
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
            'caption' => $this->caption,
            'source' => $this->source,
            'user' => $this->user,
            'thumbnail_url' => $this->thumbnail_url,
            'small_url' => $this->small_url,
            'medium_url' => $this->medium_url,
            'large_url' => $this->large_url,
            'original_url' => $this->original_url,
        ];
    }
}
