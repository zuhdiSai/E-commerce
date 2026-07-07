import { Head, Link, router } from '@inertiajs/react';
import { Search, SlidersHorizontal, X, Package } from 'lucide-react';
import { useState, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { Product, Category, PaginatedData, ProductFilters } from '@/types';

type Props = {
    products: PaginatedData<Product>;
    categories: Category[];
    filters: ProductFilters;
};

import { ProductCard } from '@/components/product-card';

function Pagination({ data }: { data: PaginatedData<Product> }) {
    if (data.last_page <= 1) return null;

    return (
        <div className="mt-12 flex items-center justify-center gap-1">
            {data.links.map((link, i) => (
                <Link
                    key={i}
                    href={link.url || '#'}
                    preserveScroll
                    preserveState
                    className={cn(
                        'flex h-10 min-w-[2.5rem] items-center justify-center rounded-lg px-3 text-sm font-medium transition-all',
                        link.active
                            ? 'bg-neutral-900 text-white shadow-sm dark:bg-white dark:text-neutral-900'
                            : 'text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800',
                        !link.url && 'pointer-events-none opacity-40',
                    )}
                    dangerouslySetInnerHTML={{ __html: link.label }}
                />
            ))}
        </div>
    );
}

export default function ProductIndex({ products, categories, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const searchTimerRef = useRef<ReturnType<typeof setTimeout>>(null);

    const applyFilters = useCallback(
        (newFilters: Partial<ProductFilters>) => {
            const merged = { ...filters, ...newFilters };
            router.get(
                '/products',
                {
                    ...(merged.category ? { category: merged.category } : {}),
                    ...(merged.search ? { search: merged.search } : {}),
                },
                {
                    preserveState: true,
                    preserveScroll: true,
                },
            );
        },
        [filters],
    );

    const handleSearch = useCallback(
        (value: string) => {
            setSearch(value);
            if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
            searchTimerRef.current = setTimeout(() => {
                applyFilters({ search: value });
            }, 400);
        },
        [applyFilters],
    );

    const clearFilters = useCallback(() => {
        setSearch('');
        router.get('/products', {}, { preserveState: true, preserveScroll: true });
    }, []);

    const hasActiveFilters = filters.category || filters.search;

    return (
        <>
            <Head title="Katalog Produk" />

            {/* Hero Section */}
            <section className="relative overflow-hidden border-b border-neutral-200/80 bg-white dark:border-neutral-800 dark:bg-[#09090B]">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(120,119,198,0.15),transparent)] dark:bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(120,119,198,0.08),transparent)]" />
                <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
                    <div className="mx-auto max-w-2xl text-center">
                        <h1 className="text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl dark:text-white">
                            Katalog Produk
                        </h1>
                        <p className="mt-3 text-base text-neutral-500 dark:text-neutral-400">
                            Temukan produk terbaik pilihan kami dengan kualitas premium
                        </p>
                    </div>

                    {/* Search Bar */}
                    <div className="mx-auto mt-8 max-w-xl">
                        <div className="relative">
                            <Search className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                            <Input
                                id="search-products"
                                type="text"
                                placeholder="Cari produk..."
                                value={search}
                                onChange={(e) => handleSearch(e.target.value)}
                                className="h-12 rounded-xl border-neutral-200/80 bg-neutral-50/50 pl-11 pr-4 text-base shadow-none transition-all focus:bg-white focus:shadow-md dark:border-neutral-700 dark:bg-neutral-800/50 dark:focus:bg-neutral-800"
                            />
                            {search && (
                                <button
                                    onClick={() => handleSearch('')}
                                    className="absolute top-1/2 right-4 -translate-y-1/2 rounded-full p-0.5 text-neutral-400 transition-colors hover:bg-neutral-200 hover:text-neutral-600 dark:hover:bg-neutral-700"
                                >
                                    <X className="h-3.5 w-3.5" />
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Content */}
            <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                {/* Category Filter */}
                <div className="mb-8 flex flex-wrap items-center gap-2">
                    <SlidersHorizontal className="mr-1 h-4 w-4 text-neutral-400" />
                    <button
                        onClick={() => applyFilters({ category: '' })}
                        className={cn(
                            'rounded-full border px-4 py-1.5 text-sm font-medium transition-all',
                            !filters.category
                                ? 'border-neutral-900 bg-neutral-900 text-white shadow-sm dark:border-neutral-100 dark:bg-white dark:text-neutral-900'
                                : 'border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300 hover:text-neutral-900 dark:border-neutral-700 dark:bg-neutral-800/50 dark:text-neutral-400 dark:hover:border-neutral-600 dark:hover:text-white',
                        )}
                    >
                        Semua
                    </button>
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            id={`filter-${cat.slug}`}
                            onClick={() => applyFilters({ category: cat.slug })}
                            className={cn(
                                'rounded-full border px-4 py-1.5 text-sm font-medium transition-all',
                                filters.category === cat.slug
                                    ? 'border-neutral-900 bg-neutral-900 text-white shadow-sm dark:border-neutral-100 dark:bg-white dark:text-neutral-900'
                                    : 'border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300 hover:text-neutral-900 dark:border-neutral-700 dark:bg-neutral-800/50 dark:text-neutral-400 dark:hover:border-neutral-600 dark:hover:text-white',
                            )}
                        >
                            {cat.name}
                        </button>
                    ))}

                    {hasActiveFilters && (
                        <button
                            onClick={clearFilters}
                            className="ml-2 flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-medium text-neutral-500 transition-colors hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
                        >
                            <X className="h-3 w-3" />
                            Reset
                        </button>
                    )}
                </div>

                {/* Results info */}
                <div className="mb-6 flex items-center justify-between">
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                        Menampilkan{' '}
                        <span className="font-medium text-neutral-700 dark:text-neutral-200">
                            {products.total}
                        </span>{' '}
                        produk
                        {filters.category && (
                            <>
                                {' '}di kategori{' '}
                                <Badge variant="secondary" className="ml-1">
                                    {categories.find((c) => c.slug === filters.category)?.name}
                                </Badge>
                            </>
                        )}
                        {filters.search && (
                            <>
                                {' '}untuk &ldquo;
                                <span className="font-medium text-neutral-700 dark:text-neutral-200">
                                    {filters.search}
                                </span>
                                &rdquo;
                            </>
                        )}
                    </p>
                </div>

                {/* Product Grid */}
                {products.data.length > 0 ? (
                    <div className="grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
                        {products.data.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-neutral-300 py-20 dark:border-neutral-700">
                        <Package className="mb-4 h-12 w-12 text-neutral-300 dark:text-neutral-600" />
                        <h3 className="text-lg font-semibold text-neutral-700 dark:text-neutral-300">
                            Tidak ada produk ditemukan
                        </h3>
                        <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                            Coba ubah filter atau kata kunci pencarian
                        </p>
                        <Button
                            variant="outline"
                            onClick={clearFilters}
                            className="mt-6"
                        >
                            Reset Filter
                        </Button>
                    </div>
                )}

                <Pagination data={products} />
            </section>
        </>
    );
}
