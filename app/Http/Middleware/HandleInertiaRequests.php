<?php

namespace App\Http\Middleware;

use App\Models\Category;
use App\Models\ContactMessage;
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
        $user = $request->user();

        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'auth' => [
                'user' => $user,
            ],
            'cartCount' => $user?->cart?->items()?->sum('quantity') ?? 0,
            'flash' => $request->session()->get('flash'),
            'sidebarOpen' => ! $request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',
            'viewing_as_customer' => $request->session()->get('view_as_customer', false),
            'globalCategories' => Category::orderBy('name')->get(),
            'unreadContactCount' => $user?->isAdmin() ? ContactMessage::unread()->count() : 0,
        ];
    }
}
