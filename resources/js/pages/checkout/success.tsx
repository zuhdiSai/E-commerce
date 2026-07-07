import { Head, Link } from '@inertiajs/react';
import { CheckCircle, Package, ArrowRight, Home, ChevronRight, Wallet, Building2, QrCode, Truck, Copy, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import type { OrderData } from '@/types';

type Props = {
    order: OrderData;
};

function formatPrice(price: number): string {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(price);
}

export default function CheckoutSuccess({ order }: Props) {
    const totalItems = order.items.reduce((acc, item) => acc + item.quantity, 0);

    return (
        <>
            <Head title="Pesanan Berhasil" />

            <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
                <div className="flex flex-col items-center text-center">
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30">
                        <CheckCircle className="h-10 w-10 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    
                    <h1 className="mt-6 text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">
                        Pesanan Berhasil!
                    </h1>
                    
                    <p className="mt-4 text-base text-neutral-500 dark:text-neutral-400">
                        Terima kasih telah berbelanja. Pesanan Anda telah kami terima dan sedang diproses.
                    </p>
                    
                    <div className="mt-8 w-full max-w-md">
                        <div className="rounded-xl border border-neutral-200/80 bg-neutral-50 p-6 dark:border-neutral-800 dark:bg-neutral-900/50">
                            <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
                                Nomor Pesanan
                            </p>
                            <p className="mt-1 text-2xl font-bold tracking-wider text-neutral-900 dark:text-white">
                                {order.order_number}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="mt-12">
                    <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
                        Ringkasan Pesanan
                    </h2>
                    
                    <Card className="mt-6 overflow-hidden">
                        <CardContent className="p-0">
                            <ul className="divide-y divide-neutral-200/80 dark:divide-neutral-800">
                                {order.items.map((item) => (
                                    <li key={item.id} className="flex items-center gap-4 p-4 sm:p-6">
                                        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-neutral-100 dark:bg-neutral-800">
                                            <Package className="h-6 w-6 text-neutral-400" />
                                        </div>
                                        <div className="flex flex-1 flex-col sm:flex-row sm:items-center sm:justify-between">
                                            <div>
                                                <h4 className="text-sm font-medium text-neutral-900 dark:text-white">
                                                    {item.product_name}
                                                </h4>
                                                <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                                                    {item.quantity} x {formatPrice(item.product_price)}
                                                </p>
                                            </div>
                                            <div className="mt-2 sm:mt-0">
                                                <p className="text-sm font-bold text-neutral-900 dark:text-white">
                                                    {formatPrice(item.subtotal)}
                                                </p>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                            
                            <div className="bg-neutral-50 p-6 dark:bg-neutral-900/50">
                                <dl className="space-y-4 text-sm text-neutral-600 dark:text-neutral-400">
                                    <div className="flex justify-between">
                                        <dt>Total Items</dt>
                                        <dd className="font-medium text-neutral-900 dark:text-white">{totalItems} barang</dd>
                                    </div>
                                    <div className="flex justify-between border-t border-neutral-200/80 pt-4 dark:border-neutral-800">
                                        <dt className="text-base font-bold text-neutral-900 dark:text-white">Total Pembayaran</dt>
                                        <dd className="text-base font-bold text-neutral-900 dark:text-white">{formatPrice(order.total_amount)}</dd>
                                    </div>
                                </dl>
                            </div>
                        </CardContent>
                    </Card>
                </div>
                
                {/* Payment Instructions */}
                {order.payment_method && (
                    <div className="mt-8">
                        <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
                            Instruksi Pembayaran
                        </h2>
                        <Card className="mt-6 border-blue-200 bg-blue-50/50 dark:border-blue-900/50 dark:bg-blue-900/10">
                            <CardContent className="p-6">
                                {order.payment_method === 'bank_transfer' && (
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/50">
                                                <Building2 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-neutral-900 dark:text-white">Transfer Bank (BCA)</h3>
                                                <p className="text-sm text-neutral-600 dark:text-neutral-400">a.n. PT Toko Kita Sejahtera</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between rounded-lg border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
                                            <div className="text-lg font-mono font-bold tracking-wider text-neutral-900 dark:text-white">
                                                8732 1928 33
                                            </div>
                                            <Button variant="outline" size="sm" onClick={() => navigator.clipboard.writeText('8732192833')}>
                                                <Copy className="mr-2 h-4 w-4" /> Salin
                                            </Button>
                                        </div>
                                        <div className="flex items-start gap-2 rounded-lg bg-amber-50 p-3 text-sm text-amber-800 dark:bg-amber-900/30 dark:text-amber-200">
                                            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                                            <p>Pastikan nominal transfer sesuai hingga 3 digit terakhir untuk mempercepat verifikasi otomatis.</p>
                                        </div>
                                    </div>
                                )}
                                
                                {order.payment_method === 'ewallet' && (
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/50">
                                                <Wallet className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-neutral-900 dark:text-white">E-Wallet (OVO / Dana / GoPay)</h3>
                                                <p className="text-sm text-neutral-600 dark:text-neutral-400">a.n. Toko Kita</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between rounded-lg border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
                                            <div className="text-lg font-mono font-bold tracking-wider text-neutral-900 dark:text-white">
                                                0812 3456 7890
                                            </div>
                                            <Button variant="outline" size="sm" onClick={() => navigator.clipboard.writeText('081234567890')}>
                                                <Copy className="mr-2 h-4 w-4" /> Salin
                                            </Button>
                                        </div>
                                    </div>
                                )}

                                {order.payment_method === 'qris' && (
                                    <div className="flex flex-col items-center space-y-4 py-4">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-pink-100 dark:bg-pink-900/50">
                                            <QrCode className="h-6 w-6 text-pink-600 dark:text-pink-400" />
                                        </div>
                                        <h3 className="font-semibold text-neutral-900 dark:text-white">Scan QRIS Berikut</h3>
                                        <div className="rounded-xl border-4 border-white bg-white p-2 shadow-sm">
                                            {/* Dummy QR Code Image */}
                                            <img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=qris_dummy_payment_data" alt="QRIS" className="h-48 w-48 object-contain" />
                                        </div>
                                        <p className="text-center text-sm text-neutral-600 dark:text-neutral-400">
                                            Buka aplikasi m-banking atau e-wallet Anda, lalu scan QR code ini.
                                        </p>
                                    </div>
                                )}

                                {order.payment_method === 'cod' && (
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900/50">
                                                <Truck className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-neutral-900 dark:text-white">Cash on Delivery (Bayar di Tempat)</h3>
                                                <p className="text-sm text-neutral-600 dark:text-neutral-400">Siapkan uang pas</p>
                                            </div>
                                        </div>
                                        <div className="rounded-lg bg-white p-4 text-center dark:bg-neutral-900">
                                            <p className="text-base text-neutral-900 dark:text-white">
                                                Siapkan uang tunai sebesar: <br/>
                                                <strong className="text-2xl font-bold">{formatPrice(order.total_amount)}</strong>
                                            </p>
                                            <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
                                                Serahkan pembayaran langsung kepada kurir saat pesanan tiba di alamat Anda.
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                )}
                
                {order.address && (
                    <div className="mt-8 rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900/50">
                        <h3 className="mb-4 text-lg font-semibold text-neutral-900 dark:text-white">
                            Alamat Pengiriman
                        </h3>
                        <div className="text-sm text-neutral-600 dark:text-neutral-400">
                            <p className="font-medium text-neutral-900 dark:text-neutral-200">{order.address.recipient_name}</p>
                            <p className="mt-1">{order.address.phone}</p>
                            <p className="mt-2">{order.address.address_line}</p>
                            <p>{order.address.city}, {order.address.province} {order.address.postal_code}</p>
                        </div>
                    </div>
                )}

                <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
                    <Link href="/products" className="w-full sm:w-auto">
                        <Button variant="outline" size="lg" className="w-full">
                            <ArrowRight className="mr-2 h-4 w-4 rotate-180" />
                            Lanjut Belanja
                        </Button>
                    </Link>
                    <Link href="/dashboard" className="w-full sm:w-auto">
                        <Button size="lg" className="w-full">
                            Ke Dashboard <ChevronRight className="ml-2 h-4 w-4" />
                        </Button>
                    </Link>
                </div>
            </div>
        </>
    );
}
