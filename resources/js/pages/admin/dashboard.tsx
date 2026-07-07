import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { formatDistanceToNow } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';
import AdminLayout from '@/layouts/admin-layout';
import { Users, Package, ShoppingCart, TrendingUp, FileDown, FileText, DollarSign, TrendingDown, Minus, ChevronRight, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatusBadge } from '@/components/StatusBadge';


type Props = {
    stats: {
        total_users: number;
        users_trend: number;
        users_this_month: number;
        total_products: number;
        products_trend: number;
        products_this_month: number;
        total_orders: number;
        orders_trend: number;
        orders_this_month: number;
        revenue_this_month: number;
        revenue_last_month: number;
        revenue_trend_percent: number;
        sales_trend: { date: string; total: number }[];
        top_products: { id: number; name: string; thumbnail: string | null; total_sold: number; total_revenue: number }[];
        low_stock_products: { id: number; name: string; stock: number; thumbnail: string | null }[];
        recent_orders: any[];
    };
    filters: {
        date_range: string;
        period_label: string;
    };
};

export default function AdminDashboard({ stats, filters }: Props) {
    const [dateRange, setDateRange] = useState(filters.date_range);

    const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        setDateRange(value);
        router.get('/admin/dashboard', { date_range: value }, { preserveState: true });
    };
    return (
        <AdminLayout>
            <Head title="Admin Dashboard" />

            <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-2 text-sm text-neutral-500 dark:text-neutral-400">
                        <span>Dasbor</span>
                        <ChevronRight className="h-4 w-4" />
                        <span className="font-medium text-neutral-900 dark:text-white">Ringkasan</span>
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
                        Dashboard
                    </h1>
                    <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                        Ringkasan performa toko Anda.
                    </p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                    <div className="relative">
                        <select
                            value={dateRange}
                            onChange={handleFilterChange}
                            className="appearance-none rounded-md border border-neutral-200/80 bg-white pl-9 pr-8 py-2 text-sm font-medium text-neutral-700 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-neutral-800 dark:bg-neutral-900/50 dark:text-neutral-300 dark:focus:border-indigo-400 dark:focus:ring-indigo-400"
                        >
                            <option value="today">Hari Ini</option>
                            <option value="7_days">7 Hari Terakhir</option>
                            <option value="30_days">30 Hari Terakhir</option>
                        </select>
                        <Calendar className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500 dark:text-neutral-400" />
                        <ChevronRight className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 rotate-90 text-neutral-500 dark:text-neutral-400" />
                    </div>
                    <a href={`/admin/dashboard/export/pdf?date_range=${filters.date_range}`} target="_blank" rel="noopener noreferrer">
                        <Button variant="outline" className="gap-2 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 dark:border-red-900/50 dark:hover:bg-red-900/20">
                            <FileText className="h-4 w-4" />
                            PDF
                        </Button>
                    </a>
                    <a href={`/admin/dashboard/export/excel?date_range=${filters.date_range}`}>
                        <Button variant="outline" className="gap-2 border-emerald-200 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 dark:border-emerald-900/50 dark:hover:bg-emerald-900/20">
                            <FileDown className="h-4 w-4" />
                            Excel
                        </Button>
                    </a>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card className="border-neutral-200/80 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900/50">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                            Total Pendapatan
                        </CardTitle>
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
                            <DollarSign className="h-4 w-4" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-neutral-900 dark:text-white">
                            Rp {stats.revenue_this_month.toLocaleString('id-ID')}
                        </div>
                        <p className="mt-1 flex items-center text-xs">
                            {stats.revenue_trend_percent > 0 ? (
                                <span className="flex items-center text-emerald-600 dark:text-emerald-400 font-medium">
                                    <TrendingUp className="mr-1 h-3 w-3" />
                                    +{stats.revenue_trend_percent}%
                                </span>
                            ) : stats.revenue_trend_percent < 0 ? (
                                <span className="flex items-center text-red-600 dark:text-red-400 font-medium">
                                    <TrendingDown className="mr-1 h-3 w-3" />
                                    {stats.revenue_trend_percent}%
                                </span>
                            ) : (
                                <span className="flex items-center text-neutral-500 font-medium">
                                    <Minus className="mr-1 h-3 w-3" />
                                    0%
                                </span>
                            )}
                            <span className="ml-1 text-neutral-500 dark:text-neutral-400">dari sebelumnya</span>
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-neutral-200/80 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900/50">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                            Total Pengguna
                        </CardTitle>
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400">
                            <Users className="h-4 w-4" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-neutral-900 dark:text-white">
                            {stats.total_users}
                        </div>
                        <p className="mt-1 flex items-center text-xs">
                            {stats.users_trend > 0 ? (
                                <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                                    +{stats.users_this_month}
                                </span>
                            ) : stats.users_trend < 0 ? (
                                <span className="text-red-600 dark:text-red-400 font-medium">
                                    {stats.users_trend}
                                </span>
                            ) : (
                                <span className="text-neutral-500 font-medium">
                                    +{stats.users_this_month}
                                </span>
                            )}
                            <span className="ml-1 text-neutral-500 dark:text-neutral-400">baru periode ini</span>
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-neutral-200/80 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900/50">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                            Total Produk
                        </CardTitle>
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-50 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400">
                            <Package className="h-4 w-4" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-neutral-900 dark:text-white">
                            {stats.total_products}
                        </div>
                        <p className="mt-1 flex items-center text-xs">
                            {stats.products_trend > 0 ? (
                                <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                                    +{stats.products_this_month}
                                </span>
                            ) : stats.products_trend < 0 ? (
                                <span className="text-red-600 dark:text-red-400 font-medium">
                                    {stats.products_trend}
                                </span>
                            ) : (
                                <span className="text-neutral-500 font-medium">
                                    +{stats.products_this_month}
                                </span>
                            )}
                            <span className="ml-1 text-neutral-500 dark:text-neutral-400">baru periode ini</span>
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-neutral-200/80 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900/50">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                            Total Pesanan
                        </CardTitle>
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                            <ShoppingCart className="h-4 w-4" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-neutral-900 dark:text-white">
                            {stats.total_orders}
                        </div>
                        <p className="mt-1 flex items-center text-xs">
                            {stats.orders_trend > 0 ? (
                                <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                                    +{stats.orders_this_month}
                                </span>
                            ) : stats.orders_trend < 0 ? (
                                <span className="text-red-600 dark:text-red-400 font-medium">
                                    {stats.orders_trend}
                                </span>
                            ) : (
                                <span className="text-neutral-500 font-medium">
                                    +{stats.orders_this_month}
                                </span>
                            )}
                            <span className="ml-1 text-neutral-500 dark:text-neutral-400">pesanan dari sebelumnya</span>
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Sales Trend Chart */}
            <div className="mt-8 rounded-2xl border border-neutral-200/80 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900/50 p-6">
                <div className="mb-6 flex items-center justify-between">
                    <h2 className="font-semibold text-neutral-900 dark:text-white">Tren Penjualan ({filters.period_label})</h2>
                </div>
                <div className="h-72 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={stats.sales_trend} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e5e5" className="dark:stroke-neutral-800" />
                            <XAxis 
                                dataKey="date" 
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#888888', fontSize: 12 }}
                                dy={10}
                            />
                            <YAxis 
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#888888', fontSize: 12 }}
                                tickFormatter={(value) => `Rp${(value / 1000).toLocaleString('id-ID')}k`}
                                dx={-10}
                            />
                            <Tooltip 
                                formatter={(value: any) => [`Rp ${Number(value).toLocaleString('id-ID')}`, 'Pendapatan']}
                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                            />
                            <Line 
                                type="monotone" 
                                dataKey="total" 
                                stroke="#4f46e5" 
                                strokeWidth={3}
                                dot={{ fill: '#4f46e5', strokeWidth: 2, r: 4 }}
                                activeDot={{ r: 6, strokeWidth: 0 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="mt-8 grid gap-6 lg:grid-cols-2">
                {/* Top 5 Products */}
                <div className="rounded-2xl border border-neutral-200/80 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900/50 overflow-hidden flex flex-col">
                    <div className="border-b border-neutral-200/80 px-6 py-4 dark:border-neutral-800">
                        <h2 className="font-semibold text-neutral-900 dark:text-white">Produk Terlaris</h2>
                    </div>
                    <div className="p-6 flex-1">
                        {stats.top_products.length === 0 ? (
                            <div className="flex h-full items-center justify-center">
                                <p className="text-sm text-neutral-500 dark:text-neutral-400">Belum ada data penjualan.</p>
                            </div>
                        ) : (
                            <div className="space-y-5">
                                {stats.top_products.map((product, idx) => (
                                    <div key={product.id} className="flex items-center gap-4">
                                        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-xs font-bold text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400">
                                            {idx + 1}
                                        </div>
                                        <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-neutral-200/80 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900/50">
                                            {product.thumbnail ? (
                                                <img src={`/storage/${product.thumbnail}`} alt={product.name} className="h-full w-full object-cover" />
                                            ) : (
                                                <Package className="h-full w-full p-2 text-neutral-300 dark:text-neutral-600" />
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="truncate font-medium text-neutral-900 dark:text-white">{product.name}</p>
                                            <p className="text-sm text-neutral-500 dark:text-neutral-400">{product.total_sold} terjual</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-semibold text-neutral-900 dark:text-white">Rp {Number(product.total_revenue).toLocaleString('id-ID')}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Low Stock Alerts */}
                <div className="rounded-2xl border border-neutral-200/80 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900/50 overflow-hidden flex flex-col">
                    <div className="border-b border-neutral-200/80 px-6 py-4 dark:border-neutral-800">
                        <h2 className="font-semibold text-neutral-900 dark:text-white">Peringatan Stok Menipis</h2>
                    </div>
                    <div className="p-6 flex-1">
                        {stats.low_stock_products.length === 0 ? (
                            <div className="flex flex-col h-full items-center justify-center text-center space-y-3">
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30">
                                    <Package className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                                </div>
                                <div>
                                    <p className="font-medium text-neutral-900 dark:text-white">Semua stok aman</p>
                                    <p className="text-sm text-neutral-500 dark:text-neutral-400">Tidak ada produk dengan stok di bawah 5.</p>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {stats.low_stock_products.map(product => (
                                    <div key={product.id} className="flex items-center justify-between rounded-lg border border-red-100 bg-red-50/50 p-4 dark:border-red-900/20 dark:bg-red-900/10">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100 dark:bg-red-900/30">
                                                <Package className="h-5 w-5 text-red-600 dark:text-red-400" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-neutral-900 dark:text-white">{product.name}</p>
                                                <p className="text-sm font-semibold text-red-600 dark:text-red-400">
                                                    Sisa {product.stock} stok
                                                </p>
                                            </div>
                                        </div>
                                        <Link href={`/admin/products/${product.id}/edit`}>
                                            <Button variant="outline" size="sm" className="h-8 border-red-200 text-red-600 hover:bg-red-100 dark:border-red-800 dark:hover:bg-red-900/30">
                                                Restok
                                            </Button>
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="mt-8 rounded-2xl border border-neutral-200/80 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900/50">
                <div className="flex items-center justify-between border-b border-neutral-200/80 px-6 py-4 dark:border-neutral-800">
                    <h2 className="font-semibold text-neutral-900 dark:text-white">Pesanan Terbaru</h2>
                    <Link href="/admin/orders" className="text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400">
                        Lihat Semua &rarr;
                    </Link>
                </div>
                <div className="p-6">
                    {stats.recent_orders.length === 0 ? (
                        <p className="text-sm text-neutral-500 dark:text-neutral-400">Belum ada pesanan.</p>
                    ) : (
                        <div className="space-y-4">
                            {stats.recent_orders.map(order => (
                                <div key={order.id} className="flex items-center justify-between rounded-lg border border-neutral-200/80 p-4 dark:border-neutral-800">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <p className="font-medium text-neutral-900 dark:text-white">{order.order_number}</p>
                                            <span className="text-xs text-neutral-400 dark:text-neutral-500">•</span>
                                            <p className="text-xs text-neutral-500 dark:text-neutral-400">
                                                {formatDistanceToNow(new Date(order.created_at), { addSuffix: true, locale: idLocale })}
                                            </p>
                                        </div>
                                        <p className="text-sm mt-1 text-neutral-500 dark:text-neutral-400">{order.user?.name}</p>
                                    </div>
                                    <div className="text-right flex flex-col items-end gap-2">
                                        <p className="font-medium text-neutral-900 dark:text-white">Rp {order.total_amount.toLocaleString('id-ID')}</p>
                                        <StatusBadge status={order.status} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
