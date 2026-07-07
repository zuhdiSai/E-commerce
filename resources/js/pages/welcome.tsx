import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowRight, ShoppingBag, Truck, ShieldCheck, Tag, BadgeCheck, Clock, Shirt, Laptop, Monitor, Smartphone, Watch, Glasses, Footprints, Camera } from 'lucide-react';
import { ProductCard } from '@/components/product-card';
import { Button } from '@/components/ui/button';
import type { Category, Product } from '@/types';

type Props = {
    categories: Category[];
    featuredProducts: Product[];
    newestProducts: Product[];
    bestSellingProducts: Product[];
    trustStats: { users: number; products: number; sales: number };
};

const getCategoryIcon = (slug: string) => {
    const s = slug.toLowerCase();
    if (s.includes('elektronik') || s.includes('gadget') || s.includes('laptop')) return <Laptop className="h-6 w-6" />;
    if (s.includes('handphone') || s.includes('smartphone')) return <Smartphone className="h-6 w-6" />;
    if (s.includes('komputer') || s.includes('monitor')) return <Monitor className="h-6 w-6" />;
    if (s.includes('kamera')) return <Camera className="h-6 w-6" />;
    if (s.includes('baju') || s.includes('kaos') || s.includes('pakaian') || s.includes('kemeja') || s.includes('jaket')) return <Shirt className="h-6 w-6" />;
    if (s.includes('sepatu') || s.includes('sandal')) return <Footprints className="h-6 w-6" />;
    if (s.includes('jam')) return <Watch className="h-6 w-6" />;
    if (s.includes('kacamata')) return <Glasses className="h-6 w-6" />;
    return <ShoppingBag className="h-6 w-6" />;
};

export default function Welcome({ categories, featuredProducts, newestProducts, bestSellingProducts, trustStats }: Props) {
    const { name } = usePage<{ name: string }>().props;

    return (
        <>
            <Head title={`Beranda | ${name || 'Store'}`} />

            {/* 1. Hero Banner */}
            <section className="relative overflow-hidden bg-neutral-900 text-white">
                <div className="absolute inset-0">
                    <img
                        src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070&auto=format&fit=crop"
                        alt="Hero background"
                        className="h-full w-full object-cover opacity-40 mix-blend-overlay"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-neutral-900/80 to-transparent" />
                </div>
                <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32 flex flex-col md:flex-row gap-12 items-center">
                    <div className="max-w-2xl flex-1">
                        <span className="mb-4 inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-sm font-medium text-neutral-200 backdrop-blur-sm">
                            <Tag className="mr-2 h-4 w-4" />
                            Koleksi Terbaru 2026
                        </span>
                        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
                            Gaya Anda, <br />
                            <span className="text-neutral-400">Pilihan Kami.</span>
                        </h1>
                        <p className="mt-6 text-lg text-neutral-300">
                            Destinasi belanja terbaik untuk melengkapi gaya keseharian Anda. Temukan produk berkualitas dengan harga bersaing.
                        </p>
                        
                        {/* Trust Numbers */}
                        <div className="mt-8 flex gap-6 sm:gap-10 border-t border-white/10 pt-8">
                            <div>
                                <p className="text-2xl sm:text-3xl font-bold text-white">{trustStats.users}+</p>
                                <p className="text-xs sm:text-sm text-neutral-400 mt-1">Pelanggan</p>
                            </div>
                            <div>
                                <p className="text-2xl sm:text-3xl font-bold text-white">{trustStats.products}+</p>
                                <p className="text-xs sm:text-sm text-neutral-400 mt-1">Produk</p>
                            </div>
                            <div>
                                <p className="text-2xl sm:text-3xl font-bold text-white">{trustStats.sales}+</p>
                                <p className="text-xs sm:text-sm text-neutral-400 mt-1">Pesanan Selesai</p>
                            </div>
                        </div>

                        <div className="mt-10 flex gap-4">
                            <Link href="/products">
                                <Button size="lg" className="h-12 rounded-xl bg-white text-neutral-900 hover:bg-neutral-200 hover:text-neutral-900 px-8 text-base font-semibold transition-all">
                                    Mulai Belanja
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* 2. Featured Categories */}
            <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
                <div className="mb-8 flex items-end justify-between">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl dark:text-white">
                            Kategori Pilihan
                        </h2>
                        <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
                            Jelajahi produk berdasarkan kategori terpopuler
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                    {categories.slice(0, 5).map((category) => (
                        <Link
                            key={category.id}
                            href={`/products?category=${category.slug}`}
                            className="group flex flex-col items-center justify-center rounded-2xl border border-neutral-200/80 bg-white p-6 transition-all hover:border-neutral-900 hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900/50 dark:hover:border-white"
                        >
                            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-neutral-100 transition-colors group-hover:bg-neutral-900 group-hover:text-white dark:bg-neutral-800 dark:group-hover:bg-white dark:group-hover:text-neutral-900">
                                {getCategoryIcon(category.slug)}
                            </div>
                            <h3 className="text-center font-medium text-neutral-900 dark:text-white">
                                {category.name}
                            </h3>
                        </Link>
                    ))}
                </div>
            </section>

            {/* 3. Best Selling Products (Produk Terlaris) */}
            {bestSellingProducts.length > 0 && (
                <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                    <div className="mb-8 flex items-end justify-between">
                        <div>
                            <h2 className="text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl dark:text-white">
                                Produk Terlaris
                            </h2>
                            <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
                                Pilihan favorit pelanggan kami
                            </p>
                        </div>
                        <Link href="/products" className="hidden sm:block">
                            <Button variant="ghost" className="font-semibold text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white">
                                Lihat Semua <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </Link>
                    </div>

                    <div className="grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
                        {bestSellingProducts.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                </section>
            )}

            {/* 3.5 Featured Products */}
            <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                <div className="mb-8 flex items-end justify-between">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl dark:text-white">
                            Rekomendasi Spesial
                        </h2>
                        <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
                            Dipilih khusus untuk Anda
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
                    {featuredProducts.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </section>

            {/* 4. Promo Banner */}
            <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                <div className="relative overflow-hidden rounded-3xl bg-neutral-100 dark:bg-neutral-800">
                    <div className="absolute inset-0 opacity-10 dark:opacity-20 bg-[radial-gradient(#000_1px,transparent_1px)] dark:bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
                    <div className="relative flex flex-col items-center justify-between p-8 sm:flex-row sm:p-12">
                        <div className="mb-8 text-center sm:mb-0 sm:text-left">
                            <h3 className="text-2xl font-bold text-neutral-900 sm:text-3xl dark:text-white">
                                Gratis Ongkir Seluruh Indonesia
                            </h3>
                            <p className="mt-2 text-neutral-600 dark:text-neutral-300">
                                Dapatkan subsidi ongkir untuk minimum pembelanjaan Rp 100.000.
                            </p>
                            <div className="mt-6 flex flex-wrap gap-4 justify-center sm:justify-start">
                                <div className="flex items-center gap-2 rounded-lg bg-white px-4 py-2 shadow-sm dark:bg-neutral-900">
                                    <Truck className="h-5 w-5 text-emerald-500" />
                                    <span className="text-sm font-medium dark:text-white">Pengiriman Cepat</span>
                                </div>
                                <div className="flex items-center gap-2 rounded-lg bg-white px-4 py-2 shadow-sm dark:bg-neutral-900">
                                    <ShieldCheck className="h-5 w-5 text-blue-500" />
                                    <span className="text-sm font-medium dark:text-white">Garansi 100%</span>
                                </div>
                            </div>
                        </div>
                        <div className="shrink-0">
                            <Link href="/products">
                                <Button size="lg" className="rounded-xl px-8 shadow-md">
                                    Klaim Sekarang
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* 5. Newest Products */}
            <section className="mx-auto max-w-7xl px-4 py-12 pb-24 sm:px-6 lg:px-8">
                <div className="mb-8 flex items-end justify-between">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl dark:text-white">
                            Kedatangan Baru
                        </h2>
                        <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
                            Koleksi terbaru yang baru saja rilis
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
                    {newestProducts.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </section>

            {/* 6. Trust Badges */}
            <section className="border-t border-neutral-200/80 bg-neutral-50 dark:border-neutral-800 dark:bg-[#09090B]">
                <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
                        <div className="flex flex-col items-center text-center">
                            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                                <ShieldCheck className="h-6 w-6" />
                            </div>
                            <h4 className="font-semibold text-neutral-900 dark:text-white">Pembayaran Aman</h4>
                            <p className="mt-2 text-xs text-neutral-500 dark:text-neutral-400">Transaksi terenkripsi 100%</p>
                        </div>
                        <div className="flex flex-col items-center text-center">
                            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
                                <Truck className="h-6 w-6" />
                            </div>
                            <h4 className="font-semibold text-neutral-900 dark:text-white">Gratis Ongkir</h4>
                            <p className="mt-2 text-xs text-neutral-500 dark:text-neutral-400">Min. belanja Rp 100.000</p>
                        </div>
                        <div className="flex flex-col items-center text-center">
                            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400">
                                <BadgeCheck className="h-6 w-6" />
                            </div>
                            <h4 className="font-semibold text-neutral-900 dark:text-white">Garansi 100% Asli</h4>
                            <p className="mt-2 text-xs text-neutral-500 dark:text-neutral-400">Produk original & bergaransi</p>
                        </div>
                        <div className="flex flex-col items-center text-center">
                            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400">
                                <Clock className="h-6 w-6" />
                            </div>
                            <h4 className="font-semibold text-neutral-900 dark:text-white">Pengiriman Cepat</h4>
                            <p className="mt-2 text-xs text-neutral-500 dark:text-neutral-400">Ke seluruh Indonesia</p>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
