<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

// Modular home route is defined in Modules/Post/Routes/web.php

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard', [
            'stats' => [
                'users' => \Modules\User\Models\User::count(),
                'categories' => \Modules\Category\Models\Category::count(),
                'posts' => [
                    'total' => \Modules\Post\Models\Post::count(),
                    'published' => \Modules\Post\Models\Post::where('status', 'published')->count(),
                    'drafts' => \Modules\Post\Models\Post::where('status', 'draft')->count(),
                ]
            ]
        ]);
    })->name('dashboard');
});

require __DIR__.'/settings.php';
