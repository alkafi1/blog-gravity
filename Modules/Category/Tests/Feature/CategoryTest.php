<?php

namespace Modules\Category\Tests\Feature;

use Tests\TestCase;
use Modules\User\Models\User;
use Modules\Category\Models\Category;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Str;

class CategoryTest extends TestCase
{
    use RefreshDatabase;

    protected $user;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create();
    }

    public function test_can_list_categories()
    {
        Category::factory()->count(5)->create();

        $response = $this->actingAs($this->user)->get('/admin/categories');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->component('admin/categories/index'));
    }

    public function test_can_create_category()
    {
        $data = [
            'name' => 'New Category',
            'slug' => 'new-category',
        ];

        $response = $this->actingAs($this->user)->post('/admin/categories', $data);

        $response->assertRedirect();
        $this->assertDatabaseHas('categories', [
            'name' => 'New Category',
            'slug' => 'new-category',
        ]);
    }

    public function test_can_update_category()
    {
        $category = Category::create(['name' => 'Old Name', 'slug' => 'old-slug']);

        $data = [
            'name' => 'New Name',
            'slug' => 'new-slug',
        ];

        $response = $this->actingAs($this->user)->put("/admin/categories/{$category->id}", $data);

        $response->assertRedirect();
        $this->assertDatabaseHas('categories', [
            'id' => $category->id,
            'name' => 'New Name'
        ]);
    }

    public function test_can_delete_category()
    {
        $category = Category::create(['name' => 'To Delete', 'slug' => 'to-delete']);

        $response = $this->actingAs($this->user)->delete("/admin/categories/{$category->id}");

        $response->assertRedirect();
        $this->assertDatabaseMissing('categories', ['id' => $category->id]);
    }
}
