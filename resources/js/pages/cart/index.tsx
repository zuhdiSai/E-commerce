import { Head, Link, router } from '@inertiajs/react';
import { Minus, Plus, Trash2, ArrowRight, ShoppingBag, Package } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { CartItemData } from '@/types';

type Props = {
    cartItems: CartItemData[];
};

function formatPrice(price: number): string {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(price);
}

export default function CartIndex({ cartItems }: Props) {
    const [updatingItems, setUpdatingItems] = useState<Set<number>>(new Set());

    const updateQuantity = (item: CartItemData, newQuantity: number) => {
        if (newQuantity < 1) return;
        if (item.product && newQuantity > item.product.stock) return;

        setUpdatingItems((prev) => new Set(prev).add(item.id));
        
        router.patch(`/cart/${item.id}`, { quantity: newQuantity }, {
            preserveScroll: true,
            preserveState: true,
            onFinish: () => {
                setUpdatingItems((prev) => {
                    const next = new Set(prev);
                    next.delete(item.id);
                    return next;
                });
            }
        });
    };

    const removeItem = (item: CartItemData) => {
        setUpdatingItems((prev) => new Set(prev).add(item.id));
        
        router.delete(`/cart/${item.id}`, {
            preserveScroll: true,
            preserveState: true,
            onFinish: () => {
                setUpdatingItems((prev) => {
                    const next = new Set(prev);
                    next.delete(item.id);
                    return next;
                });
            }
        });
    };

    const subtotal = cartItems.reduce((acc, item) => {
        return acc + (item.product ? item.product.price * item.quantity : 0);
    }, 0);

    return (
        <>
            <Head title="Keranjang Belanja" />

            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <div className="mb-8 flex items-end justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl dark:text-white">
                            Keranjang Belanja
                        </h1>
                        <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
                            {cartItems.length} item di keranjang Anda
                        </p>
                    </div>
                </div>

                {cartItems.length === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-neutral-300 py-32 dark:border-neutral-700">
                        <ShoppingBag className="mb-6 h-16 w-16 text-neutral-300 dark:text-neutral-600" />
                        <h2 className="mb-2 text-xl font-bold text-neutral-700 dark:text-neutral-200">
                            Keranjang Anda kosong
                        </h2>
                        <p className="mb-8 max-w-sm text-center text-sm text-neutral-500 dark:text-neutral-400">
                            Sepertinya Anda belum menambahkan produk apapun ke keranjang belanja Anda.
                        </p>
                        <Link href="/products">
                            <Button size="lg" className="rounded-xl px-8">
                                Mulai Belanja
                            </Button>
                        </Link>
                    </div>
                ) : (
                    <div className="grid gap-8 lg:grid-cols-12 lg:items-start lg:gap-12">
                        {/* Cart Items */}
                        <div className="lg:col-span-8">
                            <ul className="divide-y divide-neutral-200 overflow-hidden rounded-2xl border border-neutral-200/80 bg-white shadow-sm dark:divide-neutral-800 dark:border-neutral-800 dark:bg-neutral-900/50">
                                {cartItems.map((item) => (
                                    <li key={item.id} className="flex p-4 sm:p-6">
                                        {/* Image */}
                                        <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl border border-neutral-200/50 bg-neutral-100 sm:h-32 sm:w-32 dark:border-neutral-700/50 dark:bg-neutral-800">
                                            {item.product?.thumbnail ? (
                                                <img
                                                    src={item.product.thumbnail}
                                                    alt={item.product.name}
                                                    className="h-full w-full object-cover"
                                                />
                                            ) : (
                                                <div className="flex h-full w-full items-center justify-center">
                                                    <Package className="h-8 w-8 text-neutral-300 dark:text-neutral-600" />
                                                </div>
                                            )}
                                        </div>

                                        {/* Details */}
                                        <div className="ml-4 flex flex-1 flex-col justify-between sm:ml-6">
                                            <div className="relative justify-between pr-9 sm:flex sm:gap-x-6 sm:pr-0">
                                                <div>
                                                    <h3 className="text-sm">
                                                        <Link
                                                            href={item.product ? `/products/${item.product.slug}` : '#'}
                                                            className="font-semibold text-neutral-900 hover:text-neutral-600 dark:text-neutral-100 dark:hover:text-neutral-300"
                                                        >
                                                            {item.product?.name ?? 'Produk tidak tersedia'}
                                                        </Link>
                                                    </h3>
                                                    {item.product?.category && (
                                                        <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                                                            {item.product.category.name}
                                                        </p>
                                                    )}
                                                    <p className="mt-1 text-sm font-bold text-neutral-900 dark:text-white">
                                                        {item.product ? formatPrice(item.product.price) : '-'}
                                                    </p>
                                                </div>

                                                <div className="mt-4 sm:mt-0 sm:pr-9">
                                                    <div className={cn(
                                                        "flex w-fit items-center overflow-hidden rounded-lg border border-neutral-200 transition-opacity dark:border-neutral-700",
                                                        updatingItems.has(item.id) && "opacity-50 pointer-events-none"
                                                    )}>
                                                        <button
                                                            onClick={() => updateQuantity(item, item.quantity - 1)}
                                                            disabled={item.quantity <= 1}
                                                            className="flex h-8 w-8 items-center justify-center text-neutral-500 transition-colors hover:bg-neutral-100 disabled:opacity-30 dark:text-neutral-400 dark:hover:bg-neutral-800"
                                                        >
                                                            <Minus className="h-3 w-3" />
                                                        </button>
                                                        <span className="flex h-8 w-10 items-center justify-center border-x border-neutral-200 text-sm font-semibold text-neutral-900 dark:border-neutral-700 dark:text-white">
                                                            {item.quantity}
                                                        </span>
                                                        <button
                                                            onClick={() => updateQuantity(item, item.quantity + 1)}
                                                            disabled={!item.product || item.quantity >= item.product.stock}
                                                            className="flex h-8 w-8 items-center justify-center text-neutral-500 transition-colors hover:bg-neutral-100 disabled:opacity-30 dark:text-neutral-400 dark:hover:bg-neutral-800"
                                                        >
                                                            <Plus className="h-3 w-3" />
                                                        </button>
                                                    </div>

                                                    <div className="absolute top-0 right-0 sm:top-auto sm:right-auto sm:mt-3">
                                                        <button
                                                            onClick={() => removeItem(item)}
                                                            className="flex p-2 text-neutral-400 transition-colors hover:text-red-500 dark:text-neutral-500 dark:hover:text-red-400"
                                                        >
                                                            <span className="sr-only">Hapus</span>
                                                            <Trash2 className="h-4 w-4" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="mt-4 flex space-x-2 text-sm text-neutral-700 dark:text-neutral-300">
                                                {item.product && item.product.stock > 0 ? (
                                                    <p className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                                                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                                        Tersedia
                                                    </p>
                                                ) : (
                                                    <p className="flex items-center gap-1.5 text-red-600 dark:text-red-400">
                                                        <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                                                        Stok habis
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Order Summary */}
                        <div className="sticky top-24 rounded-2xl border border-neutral-200/80 bg-neutral-50/50 p-6 shadow-sm lg:col-span-4 dark:border-neutral-800 dark:bg-neutral-900/30">
                            <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">
                                Ringkasan Belanja
                            </h2>

                            <dl className="mt-6 space-y-4 text-sm text-neutral-600 dark:text-neutral-400">
                                <div className="flex items-center justify-between">
                                    <dt>Total Harga ({cartItems.length} barang)</dt>
                                    <dd className="font-medium text-neutral-900 dark:text-white">
                                        {formatPrice(subtotal)}
                                    </dd>
                                </div>
                                <div className="flex items-center justify-between border-t border-neutral-200/80 pt-4 dark:border-neutral-800">
                                    <dt className="text-base font-bold text-neutral-900 dark:text-white">
                                        Total Belanja
                                    </dt>
                                    <dd className="text-xl font-bold text-neutral-900 dark:text-white">
                                        {formatPrice(subtotal)}
                                    </dd>
                                </div>
                            </dl>

                            <div className="mt-8">
                                <Link href="/checkout" className="block w-full">
                                    <Button
                                        size="lg"
                                        className="h-12 w-full rounded-xl text-base font-semibold shadow-md transition-all hover:shadow-lg"
                                    >
                                        Lanjut ke Checkout
                                        <ArrowRight className="ml-2 h-5 w-5" />
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
