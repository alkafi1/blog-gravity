<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Modules\Role\Models\Role;
use Modules\Role\Models\Permission;
use Illuminate\Support\Facades\DB;

class SyncRolesPermissions extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'rbac:sync';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Sync system roles and permissions to database';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Syncing Roles and Permissions...');

        DB::transaction(function () {
            // Define Permissions
            $groups = [
                'users' => ['view', 'create', 'update', 'delete'],
                'categories' => ['view', 'create', 'update', 'delete'],
                'posts' => ['view', 'create', 'update', 'update.all', 'delete', 'delete.all', 'publish'],
                'roles' => ['view', 'create', 'update', 'delete'],
            ];

            $allPermissions = [];

            foreach ($groups as $group => $actions) {
                foreach ($actions as $action) {
                    $name = "{$group}.{$action}";
                    $permission = Permission::firstOrCreate(
                        ['name' => $name],
                        ['group' => $group, 'description' => "Can {$action} {$group}"]
                    );
                    $allPermissions[$name] = $permission;
                }
            }

            // Define Roles
            $roles = [
                'super-admin' => [
                    'label' => 'Super Admin',
                    'permissions' => array_keys($allPermissions), // All permissions
                ],
                'admin' => [
                    'label' => 'Administrator',
                    'permissions' => [
                        'users.view', 'users.create', 'users.update',
                        'categories.view', 'categories.create', 'categories.update', 'categories.delete',
                        'posts.view', 'posts.create', 'posts.update.all', 'posts.delete.all', 'posts.publish',
                    ],
                ],
                'editor' => [
                    'label' => 'Editor',
                    'permissions' => [
                        'categories.view',
                        'posts.view', 'posts.create', 'posts.update.all', 'posts.delete.all', 'posts.publish',
                    ],
                ],
                'writer' => [
                    'label' => 'Writer',
                    'permissions' => [
                        'posts.view', 'posts.create', 'posts.update', 'posts.delete',
                    ],
                ],
            ];

            foreach ($roles as $slug => $details) {
                $role = Role::firstOrCreate(
                    ['slug' => $slug],
                    ['name' => $details['label'], 'description' => $details['label']]
                );

                // Sync Permissions
                $permissionIds = [];
                foreach ($details['permissions'] as $permName) {
                    if (isset($allPermissions[$permName])) {
                        $permissionIds[] = $allPermissions[$permName]->id;
                    }
                }
                $role->permissions()->sync($permissionIds);
            }
        });

        $this->info('Roles and Permissions synced successfully!');
    }
}
