<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Category;
use Illuminate\Support\Str;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $mainCategories = [
            'Artificial Intelligence',
            'Web Development',
            'DevOps & Infrastructure',
            'Mobile Development',
            'Cybersecurity',
            'Cloud Computing',
            'Data Science',
            'Blockchain'
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
