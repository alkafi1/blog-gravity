<?php

namespace Modules\Post\Http\Controllers;

use App\Http\Controllers\AdminResourceController;
use Illuminate\Http\Request;
use Modules\Post\Http\Requests\StorePostRequest;
use Modules\Post\Http\Requests\UpdatePostRequest;
use Modules\Post\Models\Post;
use Modules\Category\Models\Category;
use Inertia\Inertia;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Auth;

use Modules\Post\Http\Resources\PostResource;
use App\Http\Resources\SelectListResource;
use Modules\Subcategory\Models\Subcategory;

class PostController extends AdminResourceController
{
    public function __construct()
    {
        $this->authorizeResource(Post::class, 'post');
    }

    public function index()
    {
        $posts = Post::with(['category', 'subcategory', 'user'])->latest()->get();
        $categories = Category::all();
        $subcategories = Subcategory::all();
        $authors = \Modules\User\Models\User::all();

        return Inertia::render('admin/posts/index', [
            'posts' => PostResource::collection($posts)->resolve(),
            'categories' => SelectListResource::collection($categories)->resolve(),
            'subcategories' => SelectListResource::collection($subcategories)->resolve(),
            'authors' => \Modules\User\Http\Resources\UserResource::collection($authors)->resolve(),
        ]);
    }

    public function create()
    {
        $categories = Category::all();
        $subcategories = Subcategory::all();
        return Inertia::render('admin/posts/create', [
            'categories' => SelectListResource::collection($categories)->resolve(),
            'subcategories' => SelectListResource::collection($subcategories)->resolve(),
        ]);
    }

    public function store(StorePostRequest $request)
    {
        $validated = $request->validated();

        if ($request->hasFile('featured_image')) {
            $path = $request->file('featured_image')->store('posts', 'public');
            $validated['featured_image'] = $path;
        }

        if ($request->hasFile('thumbnail_image')) {
            $path = $request->file('thumbnail_image')->store('posts/thumbs', 'public');
            $validated['thumbnail_image'] = $path;
        }

        if ($request->hasFile('share_image')) {
            $path = $request->file('share_image')->store('posts/shares', 'public');
            $validated['share_image'] = $path;
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
        $categories = Category::all();
        $subcategories = Subcategory::all();
        return Inertia::render('admin/posts/edit', [
            'post' => (new PostResource($post))->resolve(),
            'categories' => SelectListResource::collection($categories)->resolve(),
            'subcategories' => SelectListResource::collection($subcategories)->resolve(),
        ]);
    }

    public function update(UpdatePostRequest $request, Post $post)
    {
        $validated = $request->validated();

        if ($request->hasFile('featured_image')) {
            $path = $request->file('featured_image')->store('posts', 'public');
            $validated['featured_image'] = $path;
        }

        if ($request->hasFile('thumbnail_image')) {
            $path = $request->file('thumbnail_image')->store('posts/thumbs', 'public');
            $validated['thumbnail_image'] = $path;
        }

        if ($request->hasFile('share_image')) {
            $path = $request->file('share_image')->store('posts/shares', 'public');
            $validated['share_image'] = $path;
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
        $post->delete();
        return redirect()->back()->with('success', 'Post deleted successfully.');
    }
}
