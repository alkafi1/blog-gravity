<?php

namespace Modules\Post\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdatePostRequest extends FormRequest
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
            'slug' => 'required|string|unique:posts,slug,' . $this->post->id,
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
        ];
    }
}
