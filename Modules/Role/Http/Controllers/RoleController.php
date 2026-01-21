<?php

namespace Modules\Role\Http\Controllers;

use App\Http\Controllers\AdminResourceController;
use Modules\Role\Http\Requests\StoreRoleRequest;
use Modules\Role\Http\Requests\UpdateRoleRequest;
use Modules\Role\Models\Role;
use Modules\Role\Models\Permission;
use Inertia\Inertia;

class RoleController extends AdminResourceController
{
    public function __construct()
    {
        $this->authorizeResource(Role::class, 'role');
    }

    public function index()
    {
        $roles = Role::with('permissions')->get();
        return Inertia::render('admin/roles/index', [
            'roles' => $roles
        ]);
    }

    public function create()
    {
        $permissionsByGroup = Permission::all()->groupBy('group');
        return Inertia::render('admin/roles/create', [
            'permissionsByGroup' => $permissionsByGroup
        ]);
    }

    public function store(StoreRoleRequest $request)
    {
        $role = Role::create($request->validated());
        if ($request->has('permissions')) {
            $role->permissions()->sync($request->permissions);
        }

        return redirect()->route('admin.roles.index')->with('success', 'Role created successfully.');
    }

    public function edit(Role $role)
    {
        $role->load('permissions');
        $permissionsByGroup = Permission::all()->groupBy('group');

        return Inertia::render('admin/roles/edit', [
            'role' => $role,
            'permissionsByGroup' => $permissionsByGroup
        ]);
    }

    public function update(UpdateRoleRequest $request, Role $role)
    {
        $role->update($request->validated());
        $role->permissions()->sync($request->input('permissions', []));

        return redirect()->route('admin.roles.index')->with('success', 'Role updated successfully.');
    }

    public function destroy(Role $role)
    {
        // Prevent deleting critical roles if necessary
        if (in_array($role->slug, ['super-admin', 'admin'])) {
            return redirect()->back()->with('error', 'Cannot delete system-critical roles.');
        }

        $role->delete();
        return redirect()->back()->with('success', 'Role deleted successfully.');
    }
}
