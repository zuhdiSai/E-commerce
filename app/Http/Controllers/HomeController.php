<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    /**
     * Display the home/welcome page.
     */
    public function index(): Response|RedirectResponse
    {
        $user = request()->user();
        if ($user && $user->isAdmin() && ! session('view_as_customer')) {
            return redirect()->route('admin.dashboard');
        }

        // 1. Featured Categories (All categories for now)
        $categories = Category::query()->orderBy('name')->get();

        // 2. Featured Products (Random 8 products with stock > 0)
        $featuredProducts = Product::query()->where('is_active', true)
            ->where('stock', '>', 0)
            ->with('category')
            ->inRandomOrder()
            ->take(8)
            ->get();

        // 3. Newest Products (Latest 4 products with stock > 0)
        $newestProducts = Product::query()->where('is_active', true)
            ->where('stock', '>', 0)
            ->with('category')
            ->latest()
            ->take(4)
            ->get();

        // 4. Best Selling Products (Top 8 based on order items)
        $bestSellingProducts = Product::query()->where('is_active', true)
            ->with('category')
            ->withSum(['orderItems' => function ($query) {
                $query->whereHas('order', function ($q) {
                    $q->whereIn('status', ['selesai', 'dikirim']);
                });
            }], 'quantity')
            ->orderByDesc('order_items_sum_quantity')
            ->take(8)
            ->get();

        // 5. Trust Stats
        $trustStats = [
            'users' => User::count(),
            'products' => Product::where('is_active', true)->count(),
            'sales' => Order::whereIn('status', ['selesai', 'dikirim'])->count(),
        ];

        return Inertia::render('welcome', [
            'categories' => $categories,
            'featuredProducts' => $featuredProducts,
            'newestProducts' => $newestProducts,
            'bestSellingProducts' => $bestSellingProducts,
            'trustStats' => $trustStats,
        ]);
    }
}
