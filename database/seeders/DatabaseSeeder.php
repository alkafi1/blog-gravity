<?php

namespace Database\Seeders;

use Modules\User\Models\User;
use Illuminate\Database\Seeder;
use Modules\Role\Database\Seeders\RoleSeeder;
use Modules\Category\Database\Seeders\CategorySeeder;
use Modules\Post\Database\Seeders\PostSeeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            RoleSeeder::class,
            CategorySeeder::class,
        ]);

        // Create Super Admin
        $superAdmin = User::factory()->create([
            'name' => 'Super Admin',
            'email' => 'superadmin@example.com',
            'password' => bcrypt('password'),
        ]);

        $superRole = \Modules\Role\Models\Role::where('slug', 'super-admin')->first();
        if ($superRole) {
            $superAdmin->roles()->attach($superRole);
        }

        // Create Admin
        $admin = User::factory()->create([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'password' => bcrypt('password'),
        ]);

        $adminRole = \Modules\Role\Models\Role::where('slug', 'admin')->first();
        if ($adminRole) {
            $admin->roles()->attach($adminRole);
        }

        // Now call PostSeeder which will use the existing Super Admin
        $this->call([
            PostSeeder::class,
        ]);
    }
}
