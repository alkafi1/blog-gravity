<?php

namespace Modules\Category\Database\Seeders;

use Illuminate\Database\Seeder;
use Modules\Category\Models\Category;
use Illuminate\Support\Str;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $mainCategories = [
            'Technology', 'Health & Lifestyle', 'Business', 'Sports', 'Entertainment',
            'Education', 'Politics', 'Science', 'Travel', 'Food', 'Fashion', 'Art',
            'Environment', 'History', 'Philosophy', 'Photography', 'Music', 'Movies',
            'Gaming', 'Finance'
        ];

        foreach ($mainCategories as $name) {
            $slug = Str::slug($name);
            Category::firstOrCreate(
                ['slug' => $slug],
                ['name' => $name]
            );
        }
    }
}
