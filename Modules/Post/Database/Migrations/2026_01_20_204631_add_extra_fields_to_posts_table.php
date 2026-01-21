<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('posts', function (Blueprint $table) {
            $table->string('featured_image')->nullable()->after('content');
            $table->string('thumbnail_image')->nullable()->after('featured_image');
            $table->enum('status', ['published', 'draft', 'rejected', 'pending', 'watch'])->default('draft')->after('thumbnail_image');
            $table->integer('shares')->default(0)->after('status');
            $table->integer('likes')->default(0)->after('shares');
            $table->integer('reads')->default(0)->after('likes');
            $table->dropColumn('is_published');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('posts', function (Blueprint $table) {
            $table->boolean('is_published')->default(false)->after('layout_type');
            $table->dropColumn(['featured_image', 'thumbnail_image', 'status', 'shares', 'likes', 'reads']);
        });
    }
};
