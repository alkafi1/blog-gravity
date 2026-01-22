<?php

namespace Modules\Subcategory\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreSubcategoryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'slug' => ['required', 'string', 'max:255', 'unique:subcategories,slug'],
            'category_id' => ['required', 'exists:categories,id'],
        ];
    }
}
