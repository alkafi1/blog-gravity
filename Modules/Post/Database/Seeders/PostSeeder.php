<?php

namespace Modules\Post\Database\Seeders;

use Illuminate\Database\Seeder;
use Modules\Post\Models\Post;
use Modules\Category\Models\Category;
use Modules\User\Models\User;
use Illuminate\Support\Str;

class PostSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = Category::all();
        $user = User::first();

        if (!$user) {
            $user = User::factory()->create();
        }

        $statuses = ['published', 'draft', 'rejected', 'pending', 'watch'];

        foreach ($categories as $category) {
            for ($i = 1; $i <= 5; $i++) {
                $content = "Explore the future of {$category->name} with our in-depth analysis of article layout {$i}. In today's rapidly evolving digital landscape, understanding the nuances of content presentation is crucial for creators and publishers alike. This comprehensive guide delves into best practices, design principles, and strategic implementation to help you craft compelling narratives that resonate with your audience. We'll examine historical trends, current innovations, and future projections to provide a holistic view of the industry. From typography choices to layout structures, every element plays a pivotal role in user engagement and information retention. Join us as we uncover the secrets behind high-performing articles and discover how you can leverage these insights to elevate your own content strategy. This article is designed to be informative, engaging, and practically applicable for professionals across various domains. Whether you're a seasoned journalist or an aspiring blogger, there's always something new to learn in the world of digital publishing. Let's embark on this journey together and redefine the standards of excellence in communication.";

                // Ensure more than 150 words
                $content .= " " . str_repeat("Additional context and detailed explanation to ensure the word count requirement is met comfortably. ", 8);

                $status = $statuses[array_rand($statuses)];

                Post::create([
                    'title' => "{$category->name} - Article Layout {$i}",
                    'slug' => Str::slug("{$category->name} Article Layout {$i} " . uniqid()),
                    'content' => $content,
                    'category_id' => $category->id,
                    'user_id' => $user->id,
                    'layout_type' => $i,
                    'featured_image' => "https://images.unsplash.com/photo-" . (1500000000000 + rand(100000, 999999)) . "?auto=format&fit=crop&q=80&w=1200",
                    'thumbnail_image' => "https://images.unsplash.com/photo-" . (1500000000000 + rand(100000, 999999)) . "?auto=format&fit=crop&q=80&w=400",
                    'share_image' => "https://images.unsplash.com/photo-" . (1500000000000 + rand(100000, 999999)) . "?auto=format&fit=crop&q=80&w=1200&h=630",
                    'status' => $status,
                    'shares' => rand(0, 500),
                    'likes' => rand(0, 1000),
                    'reads' => rand(100, 5000),
                    'published_at' => $status === 'published' ? now() : null,
                ]);
            }
        }
    }
}
