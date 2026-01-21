<?php

namespace Modules\Post\Models;

use Modules\Category\Models\Category;
use Modules\User\Models\User;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Post extends Model
{
    /** @use HasFactory<\Database\Factories\PostFactory> */
    use HasFactory, HasUuids;

    protected $fillable = [
        'title',
        'slug',
        'content',
        'category_id',
        'user_id',
        'layout_type',
        'featured_image',
        'thumbnail_image',
        'share_image',
        'status',
        'shares',
        'likes',
        'reads',
        'published_at',
    ];

    protected $casts = [
        'published_at' => 'datetime',
        'shares' => 'integer',
        'likes' => 'integer',
        'reads' => 'integer',
    ];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    protected function featuredImage(): \Illuminate\Database\Eloquent\Casts\Attribute
    {
        return \Illuminate\Database\Eloquent\Casts\Attribute::make(
            get: function (?string $value) {
                if (!$value) return null;
                if (filter_var($value, FILTER_VALIDATE_URL) || str_starts_with($value, '/storage/')) {
                    return $value;
                }
                return \Illuminate\Support\Facades\Storage::url($value);
            },
        );
    }

    protected function thumbnailImage(): \Illuminate\Database\Eloquent\Casts\Attribute
    {
        return \Illuminate\Database\Eloquent\Casts\Attribute::make(
            get: function (?string $value) {
                if (!$value) return null;
                if (filter_var($value, FILTER_VALIDATE_URL) || str_starts_with($value, '/storage/')) {
                    return $value;
                }
                return \Illuminate\Support\Facades\Storage::url($value);
            },
        );
    }
}
