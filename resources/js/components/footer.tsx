import { Link, usePage } from '@inertiajs/react';
import { ShoppingBag, Instagram, Facebook, MessagesSquare } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

function XIcon({ className }: { className?: string }) {
    return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
    );
}

export function Footer() {
    const { name } = usePage<{ name: string }>().props;
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle'|'loading'|'success'|'error'>('idle');

    const handleSubscribe = (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;
        setStatus('loading');
        // Simulate API call for now (can be hooked to actual route later)
        setTimeout(() => {
            setStatus('success');
            setEmail('');
        }, 1000);
    };

    return (
        <footer className="border-t border-neutral-200/80 bg-white dark:border-neutral-800 dark:bg-[#09090B]">
            <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-5">
                    {/* Column 1: Brand */}
                    <div className="lg:col-span-2">
                        <div className="flex items-center gap-2.5">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-900 dark:bg-white">
                                <ShoppingBag className="h-4 w-4 text-white dark:text-neutral-900" />
                            </div>
                            <span className="text-lg font-bold tracking-tight text-neutral-900 dark:text-white">
                                {name || 'Store'}
                            </span>
                        </div>
                        <p className="mt-4 text-sm leading-relaxed text-neutral-500 dark:text-neutral-400 max-w-sm">
                            Destinasi belanja fashion dan gaya hidup terpercaya. Temukan produk berkualitas dengan harga terbaik untuk kebutuhan Anda sehari-hari.
                        </p>
                    </div>

                    {/* Column 2: Quick Links */}
                    <div>
                        <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">Tautan Cepat</h3>
                        <ul className="mt-4 space-y-3">
                            <li>
                                <Link href="/" className="text-sm text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white transition-colors">
                                    Beranda
                                </Link>
                            </li>
                            <li>
                                <Link href="/products" className="text-sm text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white transition-colors">
                                    Produk
                                </Link>
                            </li>
                            <li>
                                <Link href="/tentang-kami" className="text-sm text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white transition-colors">
                                    Tentang Kami
                                </Link>
                            </li>
                            <li>
                                <Link href="/kontak" className="text-sm text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white transition-colors">
                                    Kontak
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Column 3: Policies */}
                    <div>
                        <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">Kebijakan</h3>
                        <ul className="mt-4 space-y-3">
                            <li>
                                <Link href="/kebijakan-privasi" className="text-sm text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white transition-colors">
                                    Kebijakan Privasi
                                </Link>
                            </li>
                            <li>
                                <Link href="/syarat-ketentuan" className="text-sm text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white transition-colors">
                                    Syarat & Ketentuan
                                </Link>
                            </li>
                            <li>
                                <Link href="/pengembalian-barang" className="text-sm text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white transition-colors">
                                    Pengembalian Barang
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Column 4: Newsletter & Social */}
                    <div className="lg:col-span-1">
                        <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">Newsletter</h3>
                        <p className="mt-4 text-xs text-neutral-500 dark:text-neutral-400 mb-3">
                            Dapatkan info promo terbaru
                        </p>
                        <form onSubmit={handleSubscribe} className="flex flex-col gap-2">
                            <Input 
                                type="email" 
                                placeholder="Email Anda" 
                                className="h-9 text-sm"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            <Button type="submit" size="sm" className="w-full" disabled={status === 'loading'}>
                                {status === 'loading' ? 'Menyimpan...' : 'Berlangganan'}
                            </Button>
                            {status === 'success' && (
                                <p className="text-xs text-green-600 mt-1">Terima kasih telah berlangganan!</p>
                            )}
                        </form>

                        <div className="mt-6 flex gap-4">
                            <a href="#" className="text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors">
                                <span className="sr-only">Instagram</span>
                                <Instagram className="h-4 w-4" />
                            </a>
                            <a href="#" className="text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors">
                                <span className="sr-only">WhatsApp</span>
                                <MessagesSquare className="h-4 w-4" />
                            </a>
                            <a href="#" className="text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors">
                                <span className="sr-only">Facebook</span>
                                <Facebook className="h-4 w-4" />
                            </a>
                            <a href="#" className="text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors">
                                <span className="sr-only">X (Twitter)</span>
                                <XIcon className="h-4 w-4" />
                            </a>
                        </div>
                    </div>
                </div>

                <div className="mt-12 border-t border-neutral-200/80 pt-8 dark:border-neutral-800">
                    <p className="text-center text-sm text-neutral-500 dark:text-neutral-400">
                        &copy; {new Date().getFullYear()} {name || 'Store'}. Semua hak dilindungi.
                    </p>
                </div>
            </div>
        </footer>
    );
}
