<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Role;
use App\Models\Permission;
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
            // Get permission groups from config
            $groups = config('rbac.permission_groups', []);

            $allPermissions = [];

            foreach ($groups as $group => $actions) {
                foreach ($actions as $action) {
                    $name = "{$group}.{$action}";
                    $permission = Permission::firstOrCreate(
                        ['name' => $name],
                        [
                            'slug' => $name,
                            'group' => $group,
                            'description' => "Can {$action} {$group}"
                        ]
                    );
                    $allPermissions[$name] = $permission;
                }
            }

            // Get roles from config
            $roles = config('rbac.roles', []);

            foreach ($roles as $slug => $details) {
                $role = Role::firstOrCreate(
                    ['slug' => $slug],
                    ['name' => $details['label'], 'description' => $details['label']]
                );

                // Sync Permissions
                $permissionIds = [];

                // Handle special case: '*' means all permissions
                if ($details['permissions'] === '*') {
                    $permissionIds = array_column($allPermissions, 'id');
                } else {
                    foreach ($details['permissions'] as $permName) {
                        if (isset($allPermissions[$permName])) {
                            $permissionIds[] = $allPermissions[$permName]->id;
                        }
                    }
                }

                $role->permissions()->sync($permissionIds);
            }
        });

        $this->info('Roles and Permissions synced successfully!');
    }
}
