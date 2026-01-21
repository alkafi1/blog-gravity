<?php

namespace Modules\Role\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Modules\Role\Models\Role;
use Modules\Role\Models\Permission;
use Inertia\Inertia;

class RoleController extends Controller
{
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

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'required|string|unique:roles,slug',
            'description' => 'nullable|string',
            'permissions' => 'array'
        ]);

        $role = Role::create($validated);
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

    public function update(Request $request, Role $role)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'required|string|unique:roles,slug,' . $role->id,
            'description' => 'nullable|string',
            'permissions' => 'array'
        ]);

        $role->update($validated);
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
