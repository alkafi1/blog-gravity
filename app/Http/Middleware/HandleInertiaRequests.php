<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'auth' => [
                'user' => $request->user(),
                'permissions' => $request->user()
                    ? ($request->user()->hasRole('super-admin')
                        ? ['*']
                        : $request->user()->roles()->with('permissions')->get()->flatMap->permissions->pluck('name')->unique()->values()->all())
                    : [],
            ],
            'flash' => [
                'success' => $request->session()->get('success'),
                'error' => $request->session()->get('error'),
            ],
            'stats' => $request->user() ? [
                'users' => \Modules\User\Models\User::count(),
                'categories' => \Modules\Category\Models\Category::count(),
                'posts' => [
                    'total' => \Modules\Post\Models\Post::count(),
                    'published' => \Modules\Post\Models\Post::where('status', 'published')->count(),
                    'drafts' => \Modules\Post\Models\Post::where('status', 'draft')->count(),
                ]
            ] : null,
            'sidebarOpen' => ! $request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',
        ];
    }
}
