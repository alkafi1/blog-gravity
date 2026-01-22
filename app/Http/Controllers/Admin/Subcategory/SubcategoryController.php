<?php

namespace App\Http\Controllers\Admin\Subcategory;

use App\Http\Controllers\AdminResourceController;
use Illuminate\Http\Request;
use App\Http\Requests\Admin\Subcategory\StoreSubcategoryRequest;
use App\Http\Requests\Admin\Subcategory\UpdateSubcategoryRequest;
use App\Models\Subcategory;
use App\Models\Category;
use App\Http\Resources\Admin\Subcategory\SubcategoryResource;
use App\Http\Resources\SelectListResource;
use Inertia\Inertia;

class SubcategoryController extends AdminResourceController
{
    public function __construct()
    {
        $this->authorizeResource(Subcategory::class, 'subcategory');
    }

    public function index()
    {
        $subcategories = Subcategory::with('category')->latest()->get();
        $categories = Category::all();
        return Inertia::render('admin/subcategories/index', [
            'subcategories' => SubcategoryResource::collection($subcategories)->resolve(),
            'categories' => SelectListResource::collection($categories)->resolve()
        ]);
    }

    public function create()
    {
        $categories = Category::all();
        return Inertia::render('admin/subcategories/create', [
            'subcategory' => (new SubcategoryResource(new Subcategory()))->resolve(),
            'categories' => SelectListResource::collection($categories)->resolve()
        ]);
    }

    public function store(StoreSubcategoryRequest $request)
    {
        Subcategory::create($request->validated());

        return redirect()->route('admin.subcategories.index')->with('success', 'Subcategory created successfully.');
    }

    public function edit(Subcategory $subcategory)
    {
        $categories = Category::all();
        return Inertia::render('admin/subcategories/edit', [
            'subcategory' => (new SubcategoryResource($subcategory))->resolve(),
            'categories' => SelectListResource::collection($categories)->resolve()
        ]);
    }

    public function update(UpdateSubcategoryRequest $request, Subcategory $subcategory)
    {
        $subcategory->update($request->validated());

        return redirect()->route('admin.subcategories.index')->with('success', 'Subcategory updated successfully.');
    }

    public function destroy(Subcategory $subcategory)
    {
        $subcategory->delete();
        return redirect()->back()->with('success', 'Subcategory deleted successfully.');
    }
}
