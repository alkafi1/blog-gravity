<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('posts', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('title');
            $table->string('slug')->unique();
            $table->longText('content');
            $table->integer('layout_type')->default(1);
            $table->string('featured_image')->nullable();
            $table->string('thumbnail_image')->nullable();
            $table->string('share_image')->nullable();
            $table->string('status')->default('draft');
            $table->integer('reads')->default(0);
            $table->integer('likes')->default(0);
            $table->integer('shares')->default(0);
            $table->foreignUuid('category_id')->constrained()->onDelete('cascade');
            $table->foreignUuid('user_id')->constrained()->onDelete('cascade');
            $table->timestamp('published_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('posts');
    }
};
