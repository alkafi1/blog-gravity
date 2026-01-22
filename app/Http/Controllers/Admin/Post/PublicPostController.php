<?php

namespace App\Http\Controllers\Admin\Post;

use App\Http\Controllers\Controller;
use App\Models\Post;
use App\Models\Category;
use Inertia\Inertia;

class PublicPostController extends Controller
{
    public function index()
    {
        $featuredPost = Post::where('status', 'published')
            ->with(['category', 'user'])
            ->latest('published_at')
            ->first();

        $categories = Category::with(['posts' => function($query) {
                $query->where('status', 'published')->latest('published_at')->take(4);
            }])
            ->get();

        return Inertia::render('welcome', [
            'featuredPost' => $featuredPost,
            'categories' => $categories,
        ]);
    }

    public function show($slug)
    {
        $post = Post::where('slug', $slug)
            ->where('status', 'published')
            ->with(['category', 'user'])
            ->firstOrFail();

        // Increment reads count
        $post->increment('reads');

        return Inertia::render('blog/show', [
            'post' => $post
        ]);
    }
}
