<?php

use Illuminate\Support\Facades\Route;
use Modules\Post\Http\Controllers\PublicPostController;
use Modules\Post\Http\Controllers\PostController;

Route::get('/', [PublicPostController::class, 'index'])->name('home');
Route::get('/blog/{slug}', [PublicPostController::class, 'show'])->name('blog.show');

Route::middleware(['auth', 'verified'])->prefix('admin')->name('admin.')->group(function () {
    Route::resource('posts', PostController::class);
});
