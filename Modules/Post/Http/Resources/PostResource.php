<?php

namespace Modules\Post\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Modules\Category\Http\Resources\CategoryResource;
use Modules\User\Http\Resources\UserResource;

class PostResource extends JsonResource
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
            'title' => $this->title,
            'slug' => $this->slug,
            'content' => $this->content,
            'status' => $this->status,
            'layout_type' => $this->layout_type,
            'featured_image' => $this->featured_image,
            'thumbnail_image' => $this->thumbnail_image,
            'share_image' => $this->share_image,
            'published_at' => $this->published_at,
            'category_id' => $this->category_id,
            'subcategory_id' => $this->subcategory_id,
            'category' => $this->whenLoaded('category', function() {
                return (new \App\Http\Resources\SelectListResource($this->category))->resolve();
            }),
            'subcategory' => $this->whenLoaded('subcategory', function() {
                return (new \App\Http\Resources\SelectListResource($this->subcategory))->resolve();
            }),
            'user_id' => $this->user_id,
            'user' => $this->whenLoaded('user', function() {
                return (new UserResource($this->user))->resolve();
            }),
            'shares' => $this->shares,
            'likes' => $this->likes,
            'reads' => $this->reads,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
