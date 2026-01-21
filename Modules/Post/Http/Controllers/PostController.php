<?php

namespace Modules\Post\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Modules\Post\Models\Post;
use Modules\Category\Models\Category;
use Inertia\Inertia;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Auth;

class PostController extends Controller
{
    public function index()
    {
        Gate::authorize('viewAny', Post::class);
        $posts = Post::with(['category', 'user'])->latest()->get();
        return Inertia::render('admin/posts/index', [
            'posts' => $posts
        ]);
    }

    public function create()
    {
        Gate::authorize('create', Post::class);
        $categories = Category::all();
        return Inertia::render('admin/posts/create', [
            'categories' => $categories
        ]);
    }

    public function store(Request $request)
    {
        Gate::authorize('create', Post::class);
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'slug' => 'required|string|unique:posts,slug',
            'content' => ['required', 'string', function ($attribute, $value, $fail) {
                if (str_word_count(strip_tags($value)) < 150) {
                    $fail('The content must be at least 150 words.');
                }
            }],
            'category_id' => 'nullable|exists:categories,id',
            'layout_type' => 'required|integer|min:1|max:5',
            'featured_image' => 'nullable|image|max:2048',
            'thumbnail_image' => 'nullable|image|max:1024',
            'share_image' => 'nullable|image|max:1536',
            'status' => 'required|in:published,draft,rejected,pending,watch',
        ]);

        if ($request->hasFile('featured_image')) {
            $path = $request->file('featured_image')->store('posts', 'public');
            $validated['featured_image'] = '/storage/' . $path;
        }

        if ($request->hasFile('thumbnail_image')) {
            $path = $request->file('thumbnail_image')->store('posts/thumbs', 'public');
            $validated['thumbnail_image'] = '/storage/' . $path;
        }

        if ($request->hasFile('share_image')) {
            $path = $request->file('share_image')->store('posts/shares', 'public');
            $validated['share_image'] = '/storage/' . $path;
        }

        $validated['user_id'] = Auth::id();
        if ($request->status === 'published') {
            Gate::authorize('publish', Post::class);
            if (!$request->published_at) {
                $validated['published_at'] = now();
            }
        }

        Post::create($validated);

        return redirect()->route('admin.posts.index')->with('success', 'Post created successfully.');
    }

    public function edit(Post $post)
    {
        Gate::authorize('update', $post);
        $categories = Category::all();
        return Inertia::render('admin/posts/edit', [
            'post' => $post,
            'categories' => $categories
        ]);
    }

    public function update(Request $request, Post $post)
    {
        Gate::authorize('update', $post);
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'slug' => 'required|string|unique:posts,slug,' . $post->id,
            'content' => ['required', 'string', function ($attribute, $value, $fail) {
                if (str_word_count(strip_tags($value)) < 150) {
                    $fail('The content must be at least 150 words.');
                }
            }],
            'category_id' => 'nullable|exists:categories,id',
            'layout_type' => 'required|integer|min:1|max:5',
            'featured_image' => 'nullable',
            'thumbnail_image' => 'nullable',
            'share_image' => 'nullable',
            'status' => 'required|in:published,draft,rejected,pending,watch',
        ]);

        if ($request->hasFile('featured_image')) {
            $request->validate(['featured_image' => 'image|max:2048']);
            $path = $request->file('featured_image')->store('posts', 'public');
            $validated['featured_image'] = '/storage/' . $path;
        }

        if ($request->hasFile('thumbnail_image')) {
            $request->validate(['thumbnail_image' => 'image|max:1024']);
            $path = $request->file('thumbnail_image')->store('posts/thumbs', 'public');
            $validated['thumbnail_image'] = '/storage/' . $path;
        }

        if ($request->hasFile('share_image')) {
            $request->validate(['share_image' => 'image|max:1536']);
            $path = $request->file('share_image')->store('posts/shares', 'public');
            $validated['share_image'] = '/storage/' . $path;
        }

        if ($request->status === 'published') {
            Gate::authorize('publish', $post);
            if (!$post->published_at) {
                $validated['published_at'] = now();
            }
        }

        $post->update($validated);

        return redirect()->route('admin.posts.index')->with('success', 'Post updated successfully.');
    }

    public function destroy(Post $post)
    {
        Gate::authorize('delete', $post);
        $post->delete();
        return redirect()->back()->with('success', 'Post deleted successfully.');
    }
}
