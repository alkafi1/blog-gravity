<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Post;
use App\Models\Category;
use App\Models\Subcategory;
use App\Models\User;
use Illuminate\Support\Str;

class PostSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $user = User::first();
        if (!$user) {
            $user = User::factory()->create();
        }

        $statuses = ['published', 'draft', 'rejected', 'pending', 'watch'];

        $techArticles = [
            'Artificial Intelligence' => [
                'Machine Learning' => [
                    'The Future of Machine Learning in Healthcare',
                    'Building Your First Neural Network with Python',
                    'Advanced Algorithms for Predictive Analytics',
                ],
                'Generative AI' => [
                    'Generative AI: Revolutionizing Creative Content',
                    'The Ethics of Large Language Models',
                    'Designing Prompts for Better AI Interactions',
                ],
            ],
            'Web Development' => [
                'React' => [
                    'Mastering React Server Components',
                    'State Management Patterns in Modern React',
                    'Performance Tuning Your React Application',
                ],
                'Laravel' => [
                    'Laravel 11: What is New and Improved',
                    'Building Robust REST APIs with Laravel',
                    'Scalable Architecture Patterns in PHP',
                ],
            ],
            'DevOps & Infrastructure' => [
                'Kubernetes' => [
                    'Scaling Microservices with Kubernetes',
                    'Best Practices for K8s Security',
                    'Monitoring Cloud-Native Applications',
                ],
                'Docker' => [
                    'Containerization Strategies for Enterprise',
                    'Optimizing Docker Images for Speed',
                    'Multi-stage Builds: A Deep Dive',
                ],
            ],
        ];

        foreach ($techArticles as $catName => $subs) {
            $category = Category::where('name', $catName)->first();
            if (!$category) continue;

            foreach ($subs as $subName => $titles) {
                $subcat = Subcategory::where('name', $subName)->first();

                foreach ($titles as $index => $title) {
                    $layout = ($index % 5) + 1;
                    $status = $statuses[array_rand($statuses)];

                    $content = "## {$title}\n\n" .
                    "Exploring the depths of modern technology requires a strategic approach to understanding and implementation. In this detailed guide, we dive into the core concepts, practical applications, and future trends that are shaping our industry today. From initial architecture to final optimization, every step is critical for success in the fast-paced world of digital evolution.\n\n" .
                    "We'll cover the latest best practices, common pitfalls to avoid, and expert recommendations based on years of industry experience. Whether you're working on enterprise-scale solutions or innovative startup projects, these insights will help you navigate the complex terrain of current technological advancements. Our focus is on providing clear, actionable information that you can immediately apply to your work, ensuring that your projects are not only functional but also scalable and secure.\n\n" .
                    "Additionally, we'll examine real-world use cases, case studies, and comparative analyses to provide a well-rounded perspective. This approach allows readers to see the practical utility of the theories discussed, bridging the gap between abstract concepts and tangible results. Join us on this journey as we explore how these technologies are redefining the standards of excellence in our field and paving the way for a more connected and efficient future.\n\n" .
                    str_repeat("Detailed analysis and further exploration of technical details to ensure the article provides significant value and meets the required length for high-quality content presentation. ", 12);

                    Post::create([
                        'title' => $title,
                        'slug' => Str::slug($title . "-" . uniqid()),
                        'content' => $content,
                        'category_id' => $category->id,
                        'subcategory_id' => $subcat ? $subcat->id : null,
                        'user_id' => $user->id,
                        'layout_type' => $layout,
                        'featured_image' => "https://images.unsplash.com/photo-" . (1500000000000 + rand(100000, 999999)) . "?auto=format&fit=crop&q=80&w=1200",
                        'thumbnail_image' => "https://images.unsplash.com/photo-" . (1500000000000 + rand(100000, 999999)) . "?auto=format&fit=crop&q=80&w=400",
                        'share_image' => "https://images.unsplash.com/photo-" . (1500000000000 + rand(100000, 999999)) . "?auto=format&fit=crop&q=80&w=1200&h=630",
                        'status' => $status,
                        'shares' => rand(10, 500),
                        'likes' => rand(20, 1000),
                        'reads' => rand(100, 5000),
                        'published_at' => $status === 'published' ? now() : null,
                    ]);
                }
            }
        }
    }
}
