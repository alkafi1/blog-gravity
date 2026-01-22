<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;
use App\Http\Controllers\Admin\Post\PublicPostController;
use App\Http\Controllers\Admin\Post\PostController;
use App\Http\Controllers\Admin\Category\CategoryController;
use App\Http\Controllers\Admin\Subcategory\SubcategoryController;
use App\Http\Controllers\Admin\User\UserController;
use App\Http\Controllers\Admin\Role\RoleController;

// Public routes
Route::get('/', [PublicPostController::class, 'index'])->name('home');
Route::get('/blog/{slug}', [PublicPostController::class, 'show'])->name('blog.show');

// Authenticated routes
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

// Admin routes
Route::middleware(['auth', 'verified'])->prefix('admin')->name('admin.')->group(function () {
    Route::resource('categories', CategoryController::class);
    Route::resource('subcategories', SubcategoryController::class);
    Route::resource('posts', PostController::class);
    Route::resource('users', UserController::class);
    Route::resource('roles', RoleController::class);
});

require __DIR__.'/settings.php';
