import { Head, Link } from '@inertiajs/react';
import { Package, ArrowLeft, MapPin, CheckCircle2, Clock, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { OrderData } from '@/types';

type Props = {
    order: OrderData;
};

export default function OrderShow({ order }: Props) {
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);
    };

    const formatDate = (dateString: string) => {
        return new Intl.DateTimeFormat('id-ID', { dateStyle: 'long', timeStyle: 'short' }).format(new Date(dateString));
    };

    const getStatusInfo = (status: string) => {
        switch (status) {
            case 'pending':
                return { label: 'Menunggu Pembayaran', icon: Clock, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-100 dark:bg-amber-500/20' };
            case 'processing':
                return { label: 'Sedang Diproses', icon: Package, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-100 dark:bg-blue-500/20' };
            case 'shipped':
                return { label: 'Sedang Dikirim', icon: Truck, color: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-100 dark:bg-indigo-500/20' };
            case 'completed':
                return { label: 'Pesanan Selesai', icon: CheckCircle2, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-100 dark:bg-emerald-500/20' };
            default:
                return { label: status, icon: Package, color: 'text-neutral-600 dark:text-neutral-400', bg: 'bg-neutral-100 dark:bg-neutral-800' };
        }
    };

    const statusInfo = getStatusInfo(order.status);
    const StatusIcon = statusInfo.icon;

    return (
        <>
            <Head title={`Detail Pesanan #${order.order_number}`} />

            <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
                <div className="mb-6">
                    <Link href="/profile" className="inline-flex items-center text-sm font-medium text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white transition-colors">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Kembali ke Profil
                    </Link>
                </div>

                <div className="mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
                            Pesanan #{order.order_number}
                        </h1>
                        <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                            Dibuat pada {formatDate(order.created_at)}
                        </p>
                    </div>
                    <div className={cn("inline-flex items-center gap-2 rounded-full px-3 py-1.5", statusInfo.bg, statusInfo.color)}>
                        <StatusIcon className="h-4 w-4" />
                        <span className="text-sm font-medium">{statusInfo.label}</span>
                    </div>
                </div>

                <div className="grid gap-8 lg:grid-cols-3">
                    {/* Left: Items */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900/50">
                            <h2 className="mb-4 font-semibold text-neutral-900 dark:text-white">Daftar Produk</h2>
                            <ul className="divide-y divide-neutral-200/80 dark:divide-neutral-800">
                                {order.items?.map((item) => (
                                    <li key={item.id} className="flex py-4">
                                        {/* Placeholder for item image if we have one, otherwise just icon */}
                                        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-neutral-100 dark:bg-neutral-800">
                                            <Package className="h-6 w-6 text-neutral-400" />
                                        </div>
                                        <div className="ml-4 flex flex-1 flex-col justify-center">
                                            <div className="flex justify-between text-base font-medium text-neutral-900 dark:text-white">
                                                <h3>{item.product_name}</h3>
                                                <p className="ml-4">{formatPrice(item.product_price * item.quantity)}</p>
                                            </div>
                                            <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                                                {formatPrice(item.product_price)} x {item.quantity}
                                            </p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Right: Summary & Address */}
                    <div className="space-y-6">
                        <div className="rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900/50">
                            <h2 className="mb-4 font-semibold text-neutral-900 dark:text-white">Ringkasan Pembayaran</h2>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between text-neutral-600 dark:text-neutral-400">
                                    <span>Subtotal Produk</span>
                                    <span>{formatPrice(order.total_amount)}</span>
                                </div>
                                <div className="flex justify-between text-neutral-600 dark:text-neutral-400">
                                    <span>Ongkos Kirim</span>
                                    <span>Gratis</span>
                                </div>
                                <div className="border-t border-neutral-200/80 pt-2 mt-2 dark:border-neutral-800"></div>
                                <div className="flex justify-between font-semibold text-neutral-900 dark:text-white text-base">
                                    <span>Total Belanja</span>
                                    <span>{formatPrice(order.total_amount)}</span>
                                </div>
                            </div>
                        </div>

                        {order.address && (
                            <div className="rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900/50">
                                <h2 className="mb-4 flex items-center gap-2 font-semibold text-neutral-900 dark:text-white">
                                    <MapPin className="h-4 w-4 text-neutral-500" />
                                    Alamat Pengiriman
                                </h2>
                                <div className="text-sm text-neutral-600 dark:text-neutral-400 space-y-1">
                                    <p className="font-medium text-neutral-900 dark:text-neutral-200">
                                        {order.address.recipient_name}
                                    </p>
                                    <p>{order.address.phone}</p>
                                    <p className="pt-2">{order.address.address_line}</p>
                                    <p>{order.address.city}, {order.address.province} {order.address.postal_code}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
