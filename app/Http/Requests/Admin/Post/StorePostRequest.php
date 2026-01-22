<?php

namespace App\Http\Requests\Admin\Post;

use Illuminate\Foundation\Http\FormRequest;

class StorePostRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true; // Authorization is handled by the controller's middleware
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'title' => 'required|string|max:255',
            'slug' => 'required|string|unique:posts,slug',
            'content' => ['required', 'string', function ($attribute, $value, $fail) {
                if (str_word_count(strip_tags($value)) < 150) {
                    $fail('The content must be at least 150 words.');
                }
            }],
            'category_id' => 'nullable|exists:categories,id',
            'subcategory_id' => 'nullable|exists:subcategories,id',
            'layout_type' => 'required|integer|min:1|max:5',
            'featured_image' => 'nullable|image|max:2048',
            'thumbnail_image' => 'nullable|image|max:1024',
            'share_image' => 'nullable|image|max:1536',
            'status' => 'required|in:published,draft,rejected,pending,watch',
        ];
    }
}
