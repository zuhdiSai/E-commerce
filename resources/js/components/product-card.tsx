import { Link, router, usePage } from '@inertiajs/react';
import { Package, Heart, ShoppingCart } from 'lucide-react';
import { useState } from 'react';
import type { Product } from '@/types';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

type Props = {
    product: Product;
};

function formatPrice(price: number): string {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(price);
}

export function ProductCard({ product }: Props) {
    const { auth } = usePage<{ auth: { user: any | null } }>().props;
    const [isWishlisted, setIsWishlisted] = useState(false);
    
    // Simulate discount for UI purpose (since it's not in DB yet)
    const hasDiscount = product.id % 3 === 0; 
    const discountPercent = 20;
    const originalPrice = hasDiscount ? Math.round(product.price / (1 - (discountPercent / 100))) : product.price;

    const toggleWishlist = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (!auth.user) {
            toast.error('Silakan masuk untuk menambahkan ke wishlist');
            return router.get('/login');
        }
        setIsWishlisted(!isWishlisted);
        toast.success(isWishlisted ? 'Dihapus dari wishlist' : 'Ditambahkan ke wishlist');
    };

    const quickAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (!auth.user) {
            toast.error('Silakan masuk untuk menambahkan ke keranjang');
            return router.get('/login');
        }
        router.post('/cart', {
            product_id: product.id,
            quantity: 1,
        }, {
            preserveScroll: true,
            onSuccess: () => toast.success('Berhasil ditambahkan ke keranjang')
        });
    };

    return (
        <Link
            href={`/products/${product.slug}`}
            id={`product-${product.id}`}
            className="group relative flex flex-col overflow-hidden rounded-2xl border border-neutral-200/80 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-neutral-200/50 dark:border-neutral-800 dark:bg-neutral-900/50 dark:hover:shadow-neutral-900/50"
        >
            {/* Image */}
            <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-neutral-100 to-neutral-50 dark:from-neutral-800 dark:to-neutral-900">
                {product.thumbnail ? (
                    <img
                        src={product.thumbnail}
                        alt={product.name}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center">
                        <Package className="h-12 w-12 text-neutral-300 dark:text-neutral-600" />
                    </div>
                )}
                
                {/* Wishlist Button */}
                <button 
                    onClick={toggleWishlist}
                    className="absolute right-3 top-3 z-10 rounded-full bg-white/90 p-2 text-neutral-600 shadow-sm backdrop-blur-sm transition-colors hover:text-red-500 dark:bg-neutral-900/90 dark:text-neutral-400 dark:hover:text-red-400"
                >
                    <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
                </button>

                {/* Stock badge */}
                {product.stock === 0 && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
                        <span className="rounded-full bg-white/90 px-4 py-1.5 text-xs font-semibold text-neutral-900">
                            Stok Habis
                        </span>
                    </div>
                )}

                {/* Category & Discount pill */}
                <div className="absolute top-3 left-3 flex flex-col gap-2">
                    {product.category && (
                        <span className="w-fit rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-medium text-neutral-700 shadow-sm backdrop-blur-sm dark:bg-neutral-900/90 dark:text-neutral-300">
                            {product.category.name}
                        </span>
                    )}
                    {hasDiscount && (
                        <span className="w-fit rounded-full bg-red-500 px-2.5 py-1 text-[11px] font-bold text-white shadow-sm">
                            -{discountPercent}%
                        </span>
                    )}
                </div>

                {/* Quick Add Overlay */}
                {product.stock > 0 && (
                    <div className="absolute inset-x-0 bottom-0 translate-y-full bg-gradient-to-t from-black/60 to-transparent p-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                        <Button 
                            onClick={quickAddToCart}
                            size="sm" 
                            className="w-full gap-2 shadow-lg"
                        >
                            <ShoppingCart className="h-4 w-4" />
                            Tambah ke Keranjang
                        </Button>
                    </div>
                )}
            </div>

            {/* Info */}
            <div className="flex flex-1 flex-col gap-2 p-4">
                <h3 className="line-clamp-2 text-sm font-semibold leading-tight text-neutral-900 transition-colors group-hover:text-neutral-700 dark:text-neutral-100 dark:group-hover:text-white">
                    {product.name}
                </h3>
                <div className="mt-auto">
                    <div className="flex items-center gap-2">
                        <p className="text-base font-bold tracking-tight text-neutral-900 dark:text-white">
                            {formatPrice(product.price)}
                        </p>
                        {hasDiscount && (
                            <p className="text-xs text-neutral-400 line-through">
                                {formatPrice(originalPrice)}
                            </p>
                        )}
                    </div>
                    {product.stock > 0 && product.stock <= 10 && (
                        <p className="mt-1 text-xs text-amber-600 dark:text-amber-400">
                            Sisa {product.stock} lagi
                        </p>
                    )}
                </div>
            </div>
        </Link>
    );
}
