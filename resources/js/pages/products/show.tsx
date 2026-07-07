import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    ShoppingCart,
    ChevronLeft,
    ChevronRight,
    Package,
    Minus,
    Plus,
    ArrowLeft,
    Truck,
    ShieldCheck,
    RotateCcw,
} from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { Product } from '@/types';

type Props = {
    product: Product;
    relatedProducts: Product[];
};

function formatPrice(price: number): string {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(price);
}

function ImageGallery({ product }: { product: Product }) {
    const images = product.images || [];
    const [activeIndex, setActiveIndex] = useState(0);

    // If there's no images, show a placeholder
    if (images.length === 0) {
        return (
            <div className="aspect-square w-full overflow-hidden rounded-2xl bg-gradient-to-br from-neutral-100 to-neutral-50 dark:from-neutral-800 dark:to-neutral-900">
                <div className="flex h-full w-full items-center justify-center">
                    <Package className="h-20 w-20 text-neutral-300 dark:text-neutral-600" />
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Main Image */}
            <div className="group relative aspect-square w-full overflow-hidden rounded-2xl bg-gradient-to-br from-neutral-100 to-neutral-50 dark:from-neutral-800 dark:to-neutral-900">
                {images[activeIndex] ? (
                    <img 
                        src={`/storage/${images[activeIndex].path}`} 
                        alt={product.name} 
                        className="h-full w-full object-cover"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center">
                        <Package className="h-20 w-20 text-neutral-300 dark:text-neutral-600" />
                    </div>
                )}

                {/* Navigation arrows */}
                {images.length > 1 && (
                    <>
                        <button
                            onClick={() =>
                                setActiveIndex((prev) =>
                                    prev === 0 ? images.length - 1 : prev - 1,
                                )
                            }
                            className="absolute top-1/2 left-3 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-neutral-700 opacity-0 shadow-md backdrop-blur-sm transition-all hover:bg-white group-hover:opacity-100 dark:bg-neutral-800/90 dark:text-neutral-300 dark:hover:bg-neutral-700"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </button>
                        <button
                            onClick={() =>
                                setActiveIndex((prev) =>
                                    prev === images.length - 1 ? 0 : prev + 1,
                                )
                            }
                            className="absolute top-1/2 right-3 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-neutral-700 opacity-0 shadow-md backdrop-blur-sm transition-all hover:bg-white group-hover:opacity-100 dark:bg-neutral-800/90 dark:text-neutral-300 dark:hover:bg-neutral-700"
                        >
                            <ChevronRight className="h-4 w-4" />
                        </button>

                        {/* Dots indicator */}
                        <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-1.5">
                            {images.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setActiveIndex(i)}
                                    className={cn(
                                        'h-1.5 rounded-full transition-all',
                                        i === activeIndex
                                            ? 'w-6 bg-neutral-900 dark:bg-white'
                                            : 'w-1.5 bg-neutral-400/50 hover:bg-neutral-400 dark:bg-neutral-600 dark:hover:bg-neutral-500',
                                    )}
                                />
                            ))}
                        </div>
                    </>
                )}
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-1">
                    {images.map((image, i) => (
                        <button
                            key={image.id}
                            onClick={() => setActiveIndex(i)}
                            className={cn(
                                'relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl border-2 transition-all sm:h-20 sm:w-20',
                                i === activeIndex
                                    ? 'border-neutral-900 shadow-md dark:border-white'
                                    : 'border-transparent opacity-60 hover:opacity-100',
                            )}
                        >
                            {image ? (
                                <img 
                                    src={`/storage/${image.path}`} 
                                    alt={`${product.name} thumbnail ${i + 1}`} 
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <div className="flex h-full w-full items-center justify-center bg-neutral-100 dark:bg-neutral-800">
                                    <Package className="h-6 w-6 text-neutral-300 dark:text-neutral-600" />
                                </div>
                            )}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

function RelatedProductCard({ product }: { product: Product }) {
    return (
        <Link
            href={`/products/${product.slug}`}
            className="group flex flex-col overflow-hidden rounded-2xl border border-neutral-200/80 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-neutral-800 dark:bg-neutral-900/50"
        >
            <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-neutral-100 to-neutral-50 dark:from-neutral-800 dark:to-neutral-900">
                {product.thumbnail ? (
                    <img 
                        src={`/storage/${product.thumbnail}`} 
                        alt={product.name} 
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center">
                        <Package className="h-10 w-10 text-neutral-300 dark:text-neutral-600" />
                    </div>
                )}
            </div>
            <div className="p-4">
                <h4 className="line-clamp-2 text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                    {product.name}
                </h4>
                <p className="mt-1.5 text-sm font-bold text-neutral-900 dark:text-white">
                    {formatPrice(product.price)}
                </p>
            </div>
        </Link>
    );
}

export default function ProductShow({ product, relatedProducts }: Props) {
    const { auth } = usePage().props;
    const [quantity, setQuantity] = useState(1);

    const incrementQty = () =>
        setQuantity((prev) => Math.min(prev + 1, product.stock));
    const decrementQty = () => setQuantity((prev) => Math.max(prev - 1, 1));

    const [isAdding, setIsAdding] = useState(false);
    const [isBuyingNow, setIsBuyingNow] = useState(false);

    const addToCart = (redirect: boolean = false) => {
        if (!auth.user) {
            router.visit('/login');
            return;
        }

        if (redirect) {
            setIsBuyingNow(true);
        } else {
            setIsAdding(true);
        }

        router.post('/cart', {
            product_id: product.id,
            quantity: quantity,
        }, {
            preserveScroll: true,
            preserveState: true,
            onFinish: () => {
                setIsAdding(false);
                setIsBuyingNow(false);
            },
            onSuccess: () => {
                if (redirect) {
                    router.visit('/checkout');
                }
            }
        });
    };

    return (
        <>
            <Head title={product.name} />

            <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-10 lg:px-8">
                {/* Back link */}
                <Link
                    href="/products"
                    className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-neutral-500 transition-colors hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Kembali ke Katalog
                </Link>

                {/* Product Detail */}
                <div className="grid gap-8 lg:grid-cols-2 lg:gap-16">
                    {/* Gallery */}
                    <ImageGallery product={product} />

                    {/* Product Info */}
                    <div className="flex flex-col">
                        {/* Category */}
                        {product.category && (
                            <Link
                                href={`/products?category=${product.category.slug}`}
                                className="mb-3 w-fit"
                            >
                                <Badge
                                    variant="secondary"
                                    className="cursor-pointer transition-colors hover:bg-neutral-200 dark:hover:bg-neutral-700"
                                >
                                    {product.category.name}
                                </Badge>
                            </Link>
                        )}

                        {/* Name */}
                        <h1 className="text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl dark:text-white">
                            {product.name}
                        </h1>

                        {/* Price */}
                        <div className="mt-4 flex items-baseline gap-3">
                            <span className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">
                                {formatPrice(product.price)}
                            </span>
                        </div>

                        {/* Stock Status */}
                        <div className="mt-4">
                            {product.stock > 0 ? (
                                <div className="flex items-center gap-2">
                                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                                    <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                                        Stok tersedia ({product.stock})
                                    </span>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <span className="h-2 w-2 rounded-full bg-red-500" />
                                    <span className="text-sm font-medium text-red-600 dark:text-red-400">
                                        Stok habis
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Separator */}
                        <div className="my-6 h-px bg-neutral-200 dark:bg-neutral-800" />

                        {/* Description */}
                        {product.description && (
                            <div className="mb-6">
                                <h2 className="mb-2 text-sm font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                                    Deskripsi
                                </h2>
                                <p className="leading-relaxed text-neutral-600 dark:text-neutral-300">
                                    {product.description}
                                </p>
                            </div>
                        )}

                        {/* Add to Cart */}
                        {product.stock > 0 && (
                            <div className="mt-auto space-y-4">
                                {/* Quantity selector */}
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                                        Jumlah
                                    </label>
                                    <div className="flex w-fit items-center overflow-hidden rounded-xl border border-neutral-200 dark:border-neutral-700">
                                        <button
                                            onClick={decrementQty}
                                            disabled={quantity <= 1}
                                            className="flex h-11 w-11 items-center justify-center text-neutral-500 transition-colors hover:bg-neutral-100 disabled:opacity-30 dark:text-neutral-400 dark:hover:bg-neutral-800"
                                        >
                                            <Minus className="h-4 w-4" />
                                        </button>
                                        <span className="flex h-11 w-14 items-center justify-center border-x border-neutral-200 text-sm font-semibold text-neutral-900 dark:border-neutral-700 dark:text-white">
                                            {quantity}
                                        </span>
                                        <button
                                            onClick={incrementQty}
                                            disabled={quantity >= product.stock}
                                            className="flex h-11 w-11 items-center justify-center text-neutral-500 transition-colors hover:bg-neutral-100 disabled:opacity-30 dark:text-neutral-400 dark:hover:bg-neutral-800"
                                        >
                                            <Plus className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>

                                {/* Subtotal */}
                                <div className="flex items-center justify-between rounded-xl bg-neutral-50 px-4 py-3 dark:bg-neutral-800/50">
                                    <span className="text-sm text-neutral-500 dark:text-neutral-400">
                                        Subtotal
                                    </span>
                                    <span className="text-lg font-bold text-neutral-900 dark:text-white">
                                        {formatPrice(product.price * quantity)}
                                    </span>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-3">
                                    <Button
                                        id="add-to-cart"
                                        size="lg"
                                        onClick={() => addToCart(false)}
                                        disabled={isAdding || isBuyingNow}
                                        variant="outline"
                                        className="h-13 w-16 shrink-0 rounded-xl border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50 dark:border-indigo-500 dark:text-indigo-400 dark:hover:bg-indigo-950 transition-colors"
                                        title="Tambah ke Keranjang"
                                    >
                                        <ShoppingCart className="h-6 w-6" />
                                    </Button>
                                    
                                    <Button
                                        id="buy-now"
                                        size="lg"
                                        onClick={() => addToCart(true)}
                                        disabled={isAdding || isBuyingNow}
                                        className="h-13 flex-1 rounded-xl bg-indigo-600 text-base font-bold shadow-md transition-all hover:bg-indigo-700 hover:shadow-lg dark:bg-indigo-500 dark:hover:bg-indigo-600"
                                    >
                                        {isBuyingNow ? 'Memproses...' : 'Beli Sekarang'}
                                    </Button>
                                </div>
                            </div>
                        )}

                        {/* Trust badges */}
                        <div className="mt-8 grid grid-cols-3 gap-4">
                            <div className="flex flex-col items-center gap-2 rounded-xl border border-neutral-200/80 p-3 text-center dark:border-neutral-800">
                                <Truck className="h-5 w-5 text-neutral-400" />
                                <span className="text-xs text-neutral-500 dark:text-neutral-400">
                                    Pengiriman Cepat
                                </span>
                            </div>
                            <div className="flex flex-col items-center gap-2 rounded-xl border border-neutral-200/80 p-3 text-center dark:border-neutral-800">
                                <ShieldCheck className="h-5 w-5 text-neutral-400" />
                                <span className="text-xs text-neutral-500 dark:text-neutral-400">
                                    Garansi Resmi
                                </span>
                            </div>
                            <div className="flex flex-col items-center gap-2 rounded-xl border border-neutral-200/80 p-3 text-center dark:border-neutral-800">
                                <RotateCcw className="h-5 w-5 text-neutral-400" />
                                <span className="text-xs text-neutral-500 dark:text-neutral-400">
                                    7 Hari Retur
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Related Products */}
                {relatedProducts.length > 0 && (
                    <section className="mt-16">
                        <div className="mb-6 flex items-center justify-between">
                            <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
                                Produk Terkait
                            </h2>
                            {product.category && (
                                <Link
                                    href={`/products?category=${product.category.slug}`}
                                    className="text-sm font-medium text-neutral-500 transition-colors hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
                                >
                                    Lihat Semua →
                                </Link>
                            )}
                        </div>
                        <div className="grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
                            {relatedProducts.map((rp) => (
                                <RelatedProductCard key={rp.id} product={rp} />
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </>
    );
}
