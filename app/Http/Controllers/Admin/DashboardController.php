<?php

namespace App\Http\Controllers\Admin;

use App\Exports\DashboardExport;
use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Barryvdh\DomPDF\Facade\Pdf;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;
use Maatwebsite\Excel\Facades\Excel;

class DashboardController extends Controller
{
    /**
     * Display the admin dashboard.
     */
    public function index(Request $request): Response
    {
        $dateRange = $request->input('date_range', '30_days');
        $now = Carbon::now();

        if ($dateRange === 'today') {
            $startDate = $now->copy()->startOfDay();
            $endDate = $now->copy()->endOfDay();
            $prevStartDate = $now->copy()->subDay()->startOfDay();
            $prevEndDate = $now->copy()->subDay()->endOfDay();
            $periodLabel = 'Hari Ini';
        } elseif ($dateRange === '7_days') {
            $startDate = $now->copy()->subDays(6)->startOfDay();
            $endDate = $now->copy()->endOfDay();
            $prevStartDate = $now->copy()->subDays(13)->startOfDay();
            $prevEndDate = $now->copy()->subDays(7)->endOfDay();
            $periodLabel = '7 Hari Terakhir';
        } elseif ($dateRange === 'custom' && $request->has('start') && $request->has('end')) {
            $startDate = Carbon::parse($request->input('start'))->startOfDay();
            $endDate = Carbon::parse($request->input('end'))->endOfDay();
            $diffInDays = $startDate->diffInDays($endDate) + 1;
            $prevStartDate = $startDate->copy()->subDays($diffInDays)->startOfDay();
            $prevEndDate = $startDate->copy()->subDays(1)->endOfDay();
            $periodLabel = 'Kustom';
        } else {
            // Default: 30 days
            $dateRange = '30_days';
            $startDate = $now->copy()->subDays(29)->startOfDay();
            $endDate = $now->copy()->endOfDay();
            $prevStartDate = $now->copy()->subDays(59)->startOfDay();
            $prevEndDate = $now->copy()->subDays(30)->endOfDay();
            $periodLabel = '30 Hari Terakhir';
        }

        // Total Users (All time for total, but new users in period for trend)
        $totalUsers = User::count();
        $usersThisPeriod = User::whereBetween('created_at', [$startDate, $endDate])->count();
        $usersLastPeriod = User::whereBetween('created_at', [$prevStartDate, $prevEndDate])->count();
        $usersTrend = $usersThisPeriod - $usersLastPeriod;

        // Total Products
        $totalProducts = Product::count();
        $productsThisPeriod = Product::whereBetween('created_at', [$startDate, $endDate])->count();
        $productsLastPeriod = Product::whereBetween('created_at', [$prevStartDate, $prevEndDate])->count();
        $productsTrend = $productsThisPeriod - $productsLastPeriod;

        // Total Orders (Orders in period)
        $totalOrders = Order::whereBetween('created_at', [$startDate, $endDate])->count();
        $ordersLastPeriod = Order::whereBetween('created_at', [$prevStartDate, $prevEndDate])->count();
        $ordersTrend = $totalOrders - $ordersLastPeriod;

        // Revenue
        $validStatuses = ['selesai', 'dikirim'];

        $revenueThisPeriod = Order::whereIn('status', $validStatuses)
            ->whereBetween('created_at', [$startDate, $endDate])
            ->sum('total_amount');

        $revenueLastPeriod = Order::whereIn('status', $validStatuses)
            ->whereBetween('created_at', [$prevStartDate, $prevEndDate])
            ->sum('total_amount');

        $revenueTrendPercent = 0;
        if ($revenueLastPeriod > 0) {
            $revenueTrendPercent = round((($revenueThisPeriod - $revenueLastPeriod) / $revenueLastPeriod) * 100, 1);
        } elseif ($revenueThisPeriod > 0) {
            $revenueTrendPercent = 100;
        }

        // Sales Trend
        $salesTrend = DB::table('orders')
            ->select(DB::raw('DATE(created_at) as date'), DB::raw('SUM(total_amount) as total'))
            ->whereIn('status', $validStatuses)
            ->whereBetween('created_at', [$startDate, $endDate])
            ->groupBy(DB::raw('DATE(created_at)'))
            ->orderBy(DB::raw('DATE(created_at)'))
            ->get()
            ->keyBy('date');

        $salesTrendData = collect();
        $actualDiff = $startDate->diffInDays($endDate);
        for ($i = 0; $i <= $actualDiff; $i++) {
            $dateObj = $startDate->copy()->addDays($i);
            $dateStr = $dateObj->format('Y-m-d');
            $salesTrendData->push([
                'date' => $dateObj->format('d M'),
                'total' => isset($salesTrend[$dateStr]) ? (int) $salesTrend[$dateStr]->total : 0,
            ]);
        }

        // Top 5 Products
        $topProducts = DB::table('order_items')
            ->join('orders', 'order_items.order_id', '=', 'orders.id')
            ->join('products', 'order_items.product_id', '=', 'products.id')
            ->select('products.id', 'products.name', 'products.thumbnail',
                DB::raw('SUM(order_items.quantity) as total_sold'),
                DB::raw('SUM(order_items.subtotal) as total_revenue'))
            ->whereIn('orders.status', $validStatuses)
            ->whereBetween('orders.created_at', [$startDate, $endDate])
            ->groupBy('products.id', 'products.name', 'products.thumbnail')
            ->orderByDesc('total_sold')
            ->take(5)
            ->get();

        // Low Stock Alert
        $lowStockProducts = Product::where('stock', '<', 5)
            ->select('id', 'name', 'stock', 'thumbnail')
            ->orderBy('stock', 'asc')
            ->take(5)
            ->get();

        $stats = [
            'total_users' => $totalUsers,
            'users_trend' => $usersTrend,
            'users_this_month' => $usersThisPeriod,
            'total_products' => $totalProducts,
            'products_trend' => $productsTrend,
            'products_this_month' => $productsThisPeriod,
            'total_orders' => $totalOrders,
            'orders_trend' => $ordersTrend,
            'orders_this_month' => $totalOrders,
            'revenue_this_month' => $revenueThisPeriod,
            'revenue_last_month' => $revenueLastPeriod,
            'revenue_trend_percent' => $revenueTrendPercent,
            'sales_trend' => $salesTrendData,
            'top_products' => $topProducts,
            'low_stock_products' => $lowStockProducts,
            'recent_orders' => Order::with('user')->whereBetween('created_at', [$startDate, $endDate])->latest()->take(5)->get(),
        ];

        return Inertia::render('admin/dashboard', [
            'stats' => $stats,
            'filters' => [
                'date_range' => $dateRange,
                'period_label' => $periodLabel,
            ],
        ]);
    }

    /**
     * Export dashboard summary to PDF or Excel.
     */
    public function export(Request $request, $format)
    {
        $dateRange = $request->input('date_range', '30_days');
        $now = Carbon::now();

        if ($dateRange === 'today') {
            $startDate = $now->copy()->startOfDay();
            $endDate = $now->copy()->endOfDay();
        } elseif ($dateRange === '7_days') {
            $startDate = $now->copy()->subDays(6)->startOfDay();
            $endDate = $now->copy()->endOfDay();
        } elseif ($dateRange === 'custom' && $request->has('start') && $request->has('end')) {
            $startDate = Carbon::parse($request->input('start'))->startOfDay();
            $endDate = Carbon::parse($request->input('end'))->endOfDay();
        } else {
            $startDate = $now->copy()->subDays(29)->startOfDay();
            $endDate = $now->copy()->endOfDay();
        }

        $validStatuses = ['selesai', 'dikirim'];

        // Total Revenue
        $totalRevenue = Order::whereIn('status', $validStatuses)
            ->whereBetween('created_at', [$startDate, $endDate])
            ->sum('total_amount');

        // Order Summary by Status
        $orderSummary = DB::table('orders')
            ->select('status', DB::raw('count(*) as count'))
            ->whereBetween('created_at', [$startDate, $endDate])
            ->groupBy('status')
            ->pluck('count', 'status')
            ->toArray();

        // Top 5 Products
        $topProducts = DB::table('order_items')
            ->join('orders', 'order_items.order_id', '=', 'orders.id')
            ->join('products', 'order_items.product_id', '=', 'products.id')
            ->select('products.name',
                DB::raw('SUM(order_items.quantity) as total_sold'),
                DB::raw('SUM(order_items.subtotal) as total_revenue'))
            ->whereIn('orders.status', $validStatuses)
            ->whereBetween('orders.created_at', [$startDate, $endDate])
            ->groupBy('products.name')
            ->orderByDesc('total_sold')
            ->take(5)
            ->get();

        $stats = [
            'start_date' => $startDate,
            'end_date' => $endDate,
            'total_users' => User::count(),
            'total_products' => Product::count(),
            'total_orders' => Order::whereBetween('created_at', [$startDate, $endDate])->count(),
            'total_revenue' => $totalRevenue,
            'order_summary' => $orderSummary,
            'top_products' => $topProducts,
            'recent_orders' => Order::with('user')->whereBetween('created_at', [$startDate, $endDate])->latest()->get(),
        ];

        if ($format === 'excel') {
            return Excel::download(new DashboardExport($stats), 'dashboard_summary.xlsx');
        }

        if ($format === 'pdf') {
            $pdf = Pdf::loadView('exports.dashboard', compact('stats'));

            return $pdf->stream('dashboard_summary.pdf');
        }

        abort(404);
    }
}
