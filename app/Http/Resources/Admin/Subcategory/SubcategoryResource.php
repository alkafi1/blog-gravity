<?php

namespace App\Http\Resources\Admin\Subcategory;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Resources\SelectListResource;

class SubcategoryResource extends JsonResource
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
            'slug' => $this->slug,
            'category_id' => $this->category_id,
            'category' => SelectListResource::make($this->whenLoaded('category'))->resolve(),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
