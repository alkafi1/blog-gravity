<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Permission Groups
    |--------------------------------------------------------------------------
    |
    | Define all permission groups and their available actions.
    | Format: 'group_name' => ['action1', 'action2', ...]
    |
    */
    'permission_groups' => [
        'users' => ['view', 'create', 'update', 'delete'],
        'categories' => ['view', 'create', 'update', 'delete'],
        'subcategories' => ['view', 'create', 'update', 'delete'],
        'posts' => ['view', 'create', 'update', 'update.all', 'delete', 'delete.all', 'publish'],
        'roles' => ['view', 'create', 'update', 'delete'],
    ],

    /*
    |--------------------------------------------------------------------------
    | Roles Configuration
    |--------------------------------------------------------------------------
    |
    | Define all system roles and their assigned permissions.
    | Format:
    | 'role-slug' => [
    |     'label' => 'Display Name',
    |     'permissions' => ['permission.name', ...]
    | ]
    |
    */
    'roles' => [
        'super-admin' => [
            'label' => 'Super Admin',
            'permissions' => '*', // Special case: all permissions
        ],
        'admin' => [
            'label' => 'Administrator',
            'permissions' => [
                'users.view', 'users.create', 'users.update',
                'categories.view', 'categories.create', 'categories.update', 'categories.delete',
                'subcategories.view', 'subcategories.create', 'subcategories.update', 'subcategories.delete',
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
    ],
];
