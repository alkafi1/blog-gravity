<?php

use Illuminate\Support\Facades\Route;
use Modules\Subcategory\Http\Controllers\SubcategoryController;

Route::middleware(['auth', 'verified'])->prefix('admin')->name('admin.')->group(function () {
    Route::resource('subcategories', SubcategoryController::class);
});
