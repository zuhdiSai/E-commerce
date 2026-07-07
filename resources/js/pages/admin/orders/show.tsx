import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import { Package, ArrowLeft, User, MapPin, CreditCard, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

type OrderItem = {
    id: number;
    product_id: number | null;
    product_name: string;
    product_price: number;
    quantity: number;
    subtotal: number;
    product?: {
        thumbnail: string | null;
    };
};

type Order = {
    id: number;
    order_number: string;
    status: string;
    total_amount: number;
    notes: string | null;
    created_at: string;
    voucher_code: string | null;
    discount_amount: number;
    user: {
        name: string;
        email: string;
        phone?: string;
    };
    address: {
        recipient_name: string;
        phone_number: string;
        full_address: string;
        city: string;
        postal_code: string;
    };
    items: OrderItem[];
};

type Props = {
    order: Order;
};

const getStatusBadge = (status: string) => {
    switch (status) {
        case 'pending':
            return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-400">Menunggu Pembayaran</Badge>;
        case 'diproses':
            return <Badge variant="secondary" className="bg-blue-100 text-blue-800 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400">Diproses</Badge>;
        case 'dikirim':
            return <Badge variant="secondary" className="bg-purple-100 text-purple-800 hover:bg-purple-100 dark:bg-purple-900/30 dark:text-purple-400">Dikirim</Badge>;
        case 'selesai':
            return <Badge variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-400">Selesai</Badge>;
        case 'dibatalkan':
            return <Badge variant="secondary" className="bg-red-100 text-red-800 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-400">Dibatalkan</Badge>;
        default:
            return <Badge variant="secondary">{status}</Badge>;
    }
};

export default function OrderShow({ order }: Props) {
    const handleStatusChange = (status: string) => {
        if (confirm(`Ubah status pesanan menjadi ${status}?`)) {
            router.put(`/admin/orders/${order.id}`, { status }, { preserveScroll: true });
        }
    };

    const subtotal = order.items.reduce((acc, item) => acc + item.subtotal, 0);

    return (
        <AdminLayout>
            <Head title={`Detail Pesanan #${order.order_number}`} />

            <div className="mb-6 flex items-center justify-between">
                <div>
                    <div className="flex items-center gap-3">
                        <Link href="/admin/orders" className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full transition-colors">
                            <ArrowLeft className="h-5 w-5 text-neutral-500" />
                        </Link>
                        <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
                            Pesanan #{order.order_number}
                        </h1>
                        {getStatusBadge(order.status)}
                    </div>
                    <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400 ml-12">
                        Dibuat pada {new Date(order.created_at).toLocaleDateString('id-ID', {
                            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
                            hour: '2-digit', minute: '2-digit'
                        })}
                    </p>
                </div>
                
                <div className="flex gap-2">
                    <select
                        className="h-10 rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-300"
                        value={order.status}
                        onChange={(e) => handleStatusChange(e.target.value)}
                    >
                        <option value="pending">Pending (Menunggu Pembayaran)</option>
                        <option value="diproses">Diproses</option>
                        <option value="dikirim">Dikirim</option>
                        <option value="selesai">Selesai</option>
                        <option value="dibatalkan">Dibatalkan</option>
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Main Info */}
                <div className="md:col-span-2 space-y-6">
                    {/* Items List */}
                    <div className="rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900/50">
                        <h2 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4 flex items-center gap-2">
                            <ShoppingBag className="h-5 w-5 text-indigo-500" />
                            Produk Dipesan
                        </h2>
                        
                        <div className="space-y-4 divide-y divide-neutral-100 dark:divide-neutral-800">
                            {order.items.map(item => (
                                <div key={item.id} className="pt-4 first:pt-0 flex gap-4">
                                    <div className="h-16 w-16 shrink-0 rounded-md bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center overflow-hidden">
                                        {item.product?.thumbnail ? (
                                            <img src={`/storage/${item.product.thumbnail}`} alt={item.product_name} className="h-full w-full object-cover" />
                                        ) : (
                                            <Package className="h-6 w-6 text-neutral-400" />
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-neutral-900 dark:text-white truncate">
                                            {item.product_name}
                                        </p>
                                        <p className="text-sm text-neutral-500 mt-1">
                                            {item.quantity} x Rp {item.product_price.toLocaleString('id-ID')}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-medium text-neutral-900 dark:text-white">
                                            Rp {item.subtotal.toLocaleString('id-ID')}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-6 pt-4 border-t border-neutral-100 dark:border-neutral-800">
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between text-neutral-500">
                                    <span>Subtotal Produk</span>
                                    <span>Rp {subtotal.toLocaleString('id-ID')}</span>
                                </div>
                                {order.discount_amount > 0 && (
                                    <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                                        <span>Diskon {order.voucher_code ? `(${order.voucher_code})` : ''}</span>
                                        <span>- Rp {order.discount_amount.toLocaleString('id-ID')}</span>
                                    </div>
                                )}
                                <div className="flex justify-between text-lg font-semibold text-neutral-900 dark:text-white pt-2">
                                    <span>Total Pembayaran</span>
                                    <span>Rp {order.total_amount.toLocaleString('id-ID')}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Notes */}
                    {order.notes && (
                        <div className="rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900/50">
                            <h2 className="text-sm font-semibold text-neutral-900 dark:text-white mb-2">
                                Catatan Pesanan
                            </h2>
                            <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                {order.notes}
                            </p>
                        </div>
                    )}
                </div>

                {/* Sidebar Info */}
                <div className="space-y-6">
                    {/* Customer Info */}
                    <div className="rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900/50">
                        <h2 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4 flex items-center gap-2">
                            <User className="h-5 w-5 text-indigo-500" />
                            Pelanggan
                        </h2>
                        <div className="space-y-3 text-sm">
                            <div>
                                <p className="font-medium text-neutral-900 dark:text-white">{order.user.name}</p>
                                <p className="text-neutral-500">{order.user.email}</p>
                            </div>
                        </div>
                    </div>

                    {/* Shipping Address */}
                    <div className="rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900/50">
                        <h2 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4 flex items-center gap-2">
                            <MapPin className="h-5 w-5 text-indigo-500" />
                            Alamat Pengiriman
                        </h2>
                        {order.address ? (
                            <div className="space-y-1 text-sm text-neutral-600 dark:text-neutral-400">
                                <p className="font-medium text-neutral-900 dark:text-white">{order.address.recipient_name}</p>
                                <p>{order.address.phone_number}</p>
                                <p className="pt-2">{order.address.full_address}</p>
                                <p>{order.address.city}, {order.address.postal_code}</p>
                            </div>
                        ) : (
                            <p className="text-sm text-neutral-500 italic">Alamat tidak tersedia.</p>
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
