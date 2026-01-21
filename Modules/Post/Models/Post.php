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
        'featured_image' => \App\Casts\StorageUrl::class,
        'thumbnail_image' => \App\Casts\StorageUrl::class,
        'share_image' => \App\Casts\StorageUrl::class,
    ];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
