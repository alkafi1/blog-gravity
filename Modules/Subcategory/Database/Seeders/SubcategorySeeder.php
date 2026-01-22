<?php

namespace Modules\Subcategory\Database\Seeders;

use Illuminate\Database\Seeder;
use Modules\Category\Models\Category;
use Modules\Subcategory\Models\Subcategory;
use Illuminate\Support\Str;

class SubcategorySeeder extends Seeder
{
    public function run(): void
    {
        $mapping = [
            'Artificial Intelligence' => ['Machine Learning', 'Natural Language Processing', 'Computer Vision', 'Generative AI'],
            'Web Development' => ['React', 'Next.js', 'Laravel', 'Vue.js', 'Typescript'],
            'DevOps & Infrastructure' => ['Docker', 'Kubernetes', 'CI/CD Pipelines', 'Terraform'],
            'Mobile Development' => ['Flutter', 'React Native', 'Swift', 'Kotlin'],
            'Cybersecurity' => ['Network Security', 'Ethical Hacking', 'Zero Trust', 'Identity Management'],
            'Cloud Computing' => ['AWS', 'Azure', 'Google Cloud', 'Serverless'],
            'Data Science' => ['Big Data', 'Data Visualization', 'Pandas', 'Spark'],
            'Blockchain' => ['Smart Contracts', 'Web3', 'DeFi', 'Ethereum'],
        ];

        foreach ($mapping as $catName => $subs) {
            $category = Category::where('name', $catName)->first();
            if ($category) {
                foreach ($subs as $subName) {
                    Subcategory::firstOrCreate(
                        ['slug' => Str::slug($subName)],
                        ['name' => $subName, 'category_id' => $category->id]
                    );
                }
            }
        }
    }
}
