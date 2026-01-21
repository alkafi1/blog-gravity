<?php

namespace Modules\Role\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class RoleResource extends JsonResource
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
            'description' => $this->description,
            'permissions' => $this->whenLoaded('permissions'), // Assuming PermissionResource isn't strictly needed if just returning collection/array
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
