<?php

namespace Modules\Subcategory\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateSubcategoryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $subcategory = $this->route('subcategory');
        $id = is_object($subcategory) ? $subcategory->id : $subcategory;

        return [
            'name' => ['required', 'string', 'max:255'],
            'slug' => ['required', 'string', 'max:255', 'unique:subcategories,slug,' . $id],
            'category_id' => ['required', 'exists:categories,id'],
        ];
    }
}
