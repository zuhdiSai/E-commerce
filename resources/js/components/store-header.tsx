import { Link, usePage, router } from '@inertiajs/react';
import { ShoppingBag, ShoppingCart, User, Menu, X, Search } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

export function StoreHeader() {
    const { auth, cartCount, viewing_as_customer, name } = usePage<{
        auth: { user: { name: string; role: string } | null };
        cartCount: number;
        viewing_as_customer?: boolean;
        name: string;
    }>().props;
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.get('/products', { search: searchQuery });
        }
    };

    return (
        <>
            {auth?.user?.role === 'admin' && viewing_as_customer && (
                <div className="bg-yellow-100 px-4 py-2 text-center text-sm font-medium text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-200 flex justify-center items-center gap-4 relative z-50">
                    <span>Anda sedang melihat sebagai Customer</span>
                    <Link href="/admin/exit-view-as-customer" className="underline hover:text-yellow-900 dark:hover:text-yellow-100 font-bold">
                        Kembali ke Dashboard Admin
                    </Link>
                </div>
            )}
            
            <header className="sticky top-0 z-40 w-full border-b border-neutral-200/80 bg-white/80 backdrop-blur-xl dark:border-neutral-800 dark:bg-[#09090B]/80">
                <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                    {/* Left: Logo + Nav */}
                    <div className="flex items-center gap-8">
                        <Link href="/" className="flex items-center gap-2.5">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-900 dark:bg-white">
                                <ShoppingBag className="h-4 w-4 text-white dark:text-neutral-900" />
                            </div>
                            <span className="text-lg font-bold tracking-tight text-neutral-900 dark:text-white">
                                {name || 'Store'}
                            </span>
                        </Link>
                        <nav className="hidden items-center gap-1 md:flex">
                            <Link
                                href="/"
                                className="rounded-md px-3 py-2 text-sm font-medium text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white"
                            >
                                Beranda
                            </Link>

                            <Link
                                href="/products"
                                className="rounded-md px-3 py-2 text-sm font-medium text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white"
                            >
                                Produk
                            </Link>
                            <Link
                                href="/tentang-kami"
                                className="rounded-md px-3 py-2 text-sm font-medium text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white"
                            >
                                Tentang Kami
                            </Link>
                            <Link
                                href="/kontak"
                                className="rounded-md px-3 py-2 text-sm font-medium text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white"
                            >
                                Kontak
                            </Link>
                        </nav>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-3">
                        <form onSubmit={handleSearch} className="hidden md:flex relative">
                            <Input 
                                type="search" 
                                placeholder="Cari produk..." 
                                className="w-64 rounded-full bg-neutral-100 pl-10 dark:bg-neutral-800 border-none"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
                        </form>

                        {/* Cart icon */}
                        {auth?.user && (
                            <Link href="/cart" className="relative ml-2">
                                <Button variant="ghost" size="icon" className="h-9 w-9">
                                    <ShoppingCart className="h-5 w-5" />
                                </Button>
                                {cartCount > 0 && (
                                    <span className="absolute -top-0.5 -right-0.5 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                                        {cartCount > 99 ? '99+' : cartCount}
                                    </span>
                                )}
                            </Link>
                        )}

                        {auth?.user ? (
                            <Link href="/profile">
                                <Button variant="ghost" size="sm" className="hidden gap-2 sm:inline-flex">
                                    <User className="h-4 w-4" />
                                    {auth.user.name}
                                </Button>
                            </Link>
                        ) : (
                            <div className="hidden gap-2 sm:flex">
                                <Link href="/login">
                                    <Button variant="ghost" size="sm">
                                        Masuk
                                    </Button>
                                </Link>
                                <Link href="/register">
                                    <Button size="sm">Daftar</Button>
                                </Link>
                            </div>
                        )}

                        {/* Mobile menu button */}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="md:hidden"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            {mobileMenuOpen ? (
                                <X className="h-5 w-5" />
                            ) : (
                                <Menu className="h-5 w-5" />
                            )}
                        </Button>
                    </div>
                </div>

                {/* Mobile Nav */}
                <div
                    className={cn(
                        'overflow-hidden border-t border-neutral-200/80 transition-all duration-300 ease-in-out md:hidden dark:border-neutral-800',
                        mobileMenuOpen ? 'max-h-96' : 'max-h-0 border-t-0',
                    )}
                >
                    <div className="space-y-2 px-4 py-3">
                        <form onSubmit={handleSearch} className="relative mb-4">
                            <Input 
                                type="search" 
                                placeholder="Cari produk..." 
                                className="w-full rounded-full bg-neutral-100 pl-10 dark:bg-neutral-800"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
                        </form>
                        <Link
                            href="/"
                            className="block rounded-md px-3 py-2 text-sm font-medium text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800"
                        >
                            Beranda
                        </Link>
                        <Link
                            href="/products"
                            className="block rounded-md px-3 py-2 text-sm font-medium text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800"
                        >
                            Produk
                        </Link>
                        <Link
                            href="/tentang-kami"
                            className="block rounded-md px-3 py-2 text-sm font-medium text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800"
                        >
                            Tentang Kami
                        </Link>
                        <Link
                            href="/kontak"
                            className="block rounded-md px-3 py-2 text-sm font-medium text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800"
                        >
                            Kontak
                        </Link>
                        {auth?.user && (
                            <Link
                                href="/cart"
                                className="flex items-center justify-between rounded-md px-3 py-2 text-sm font-medium text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800"
                            >
                                Keranjang
                                {cartCount > 0 && (
                                    <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[11px] font-bold text-white">
                                        {cartCount}
                                    </span>
                                )}
                            </Link>
                        )}
                        {!auth?.user && (
                            <div className="flex gap-2 pt-2">
                                <Link href="/login" className="flex-1">
                                    <Button variant="outline" size="sm" className="w-full">
                                        Masuk
                                    </Button>
                                </Link>
                                <Link href="/register" className="flex-1">
                                    <Button size="sm" className="w-full">
                                        Daftar
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </header>
        </>
    );
}
