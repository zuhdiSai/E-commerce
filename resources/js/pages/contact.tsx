import { Head, useForm } from '@inertiajs/react';
import { MapPin, Phone, Mail, Clock, MessageCircle, Instagram, Facebook, MessagesSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

function XIcon({ className }: { className?: string }) {
    return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
    );
}

type StoreInfo = {
    name: string;
    address: string;
    phone: string;
    whatsapp: string;
    email: string;
    hours: string;
    social: {
        instagram: string;
        facebook: string;
        twitter: string;
    };
};

type Props = {
    storeInfo: StoreInfo;
};

export default function Contact({ storeInfo }: Props) {
    const { data, setData, post, processing, errors, reset, wasSuccessful } = useForm({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/kontak', {
            onSuccess: () => reset(),
        });
    };

    const contactItems = [
        {
            icon: MapPin,
            label: 'Alamat',
            value: storeInfo.address,
            href: null,
        },
        {
            icon: Phone,
            label: 'Telepon',
            value: storeInfo.phone,
            href: `tel:${storeInfo.phone}`,
        },
        {
            icon: MessageCircle,
            label: 'WhatsApp',
            value: storeInfo.phone,
            href: `https://wa.me/${storeInfo.whatsapp}`,
        },
        {
            icon: Mail,
            label: 'Email',
            value: storeInfo.email,
            href: `mailto:${storeInfo.email}`,
        },
        {
            icon: Clock,
            label: 'Jam Operasional',
            value: storeInfo.hours,
            href: null,
        },
    ];

    return (
        <>
            <Head title="Kontak" />

            {/* Hero */}
            <section className="relative bg-neutral-900 text-white">
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
                <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32 text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
                        Hubungi Kami
                    </h1>
                    <p className="mx-auto mt-6 max-w-2xl text-lg text-neutral-300">
                        Punya pertanyaan atau masukan? Kami senang mendengar dari Anda.
                    </p>
                </div>
            </section>

            {/* Content */}
            <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-12 lg:grid-cols-5">

                    {/* Left: Contact Info */}
                    <div className="lg:col-span-2">
                        <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
                            Informasi Kontak
                        </h2>
                        <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
                            Jangan ragu untuk menghubungi kami melalui salah satu cara berikut.
                        </p>

                        <div className="mt-8 space-y-6">
                            {contactItems.map((item) => (
                                <div key={item.label} className="flex gap-4">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400">
                                        <item.icon className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-medium text-neutral-400 dark:text-neutral-500">{item.label}</p>
                                        {item.href ? (
                                            <a
                                                href={item.href}
                                                target={item.href.startsWith('https') ? '_blank' : undefined}
                                                rel={item.href.startsWith('https') ? 'noopener noreferrer' : undefined}
                                                className="text-sm font-medium text-neutral-900 hover:text-neutral-600 transition-colors dark:text-white dark:hover:text-neutral-300"
                                            >
                                                {item.value}
                                            </a>
                                        ) : (
                                            <p className="text-sm font-medium text-neutral-900 dark:text-white">{item.value}</p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Social Media */}
                        <div className="mt-10">
                            <p className="text-xs font-medium text-neutral-400 dark:text-neutral-500 mb-3">Ikuti Kami</p>
                            <div className="flex gap-3">
                                <a href={storeInfo.social.instagram} target="_blank" rel="noopener noreferrer" className="flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-100 text-neutral-500 hover:bg-neutral-200 hover:text-neutral-900 transition-colors dark:bg-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-white">
                                    <Instagram className="h-4 w-4" />
                                </a>
                                <a href={storeInfo.social.facebook} target="_blank" rel="noopener noreferrer" className="flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-100 text-neutral-500 hover:bg-neutral-200 hover:text-neutral-900 transition-colors dark:bg-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-white">
                                    <Facebook className="h-4 w-4" />
                                </a>
                                <a href={storeInfo.social.twitter} target="_blank" rel="noopener noreferrer" className="flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-100 text-neutral-500 hover:bg-neutral-200 hover:text-neutral-900 transition-colors dark:bg-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-white">
                                    <XIcon className="h-4 w-4" />
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Right: Contact Form */}
                    <div className="lg:col-span-3">
                        <div className="rounded-2xl border border-neutral-200/80 bg-white p-6 sm:p-8 dark:border-neutral-800 dark:bg-neutral-900/50">
                            <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
                                Kirim Pesan
                            </h2>
                            <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                                Isi formulir di bawah dan kami akan merespons sesegera mungkin.
                            </p>

                            {wasSuccessful && (
                                <div className="mt-4 rounded-xl bg-green-50 border border-green-200 p-4 dark:bg-green-900/20 dark:border-green-800">
                                    <p className="text-sm font-medium text-green-800 dark:text-green-400">
                                        ✓ Pesan Anda berhasil dikirim! Kami akan segera merespons.
                                    </p>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                                    <div>
                                        <Label htmlFor="name">Nama <span className="text-red-500">*</span></Label>
                                        <Input
                                            id="name"
                                            type="text"
                                            placeholder="Nama lengkap"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            className="mt-1.5"
                                            required
                                        />
                                        {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
                                    </div>
                                    <div>
                                        <Label htmlFor="email">Email <span className="text-red-500">*</span></Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="email@contoh.com"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            className="mt-1.5"
                                            required
                                        />
                                        {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                                    <div>
                                        <Label htmlFor="phone">Nomor Telepon <span className="text-neutral-400 text-xs">(opsional)</span></Label>
                                        <Input
                                            id="phone"
                                            type="tel"
                                            placeholder="08xxxxxxxxxx"
                                            value={data.phone}
                                            onChange={(e) => setData('phone', e.target.value)}
                                            className="mt-1.5"
                                        />
                                        {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone}</p>}
                                    </div>
                                    <div>
                                        <Label htmlFor="subject">Subjek <span className="text-red-500">*</span></Label>
                                        <Input
                                            id="subject"
                                            type="text"
                                            placeholder="Topik pesan"
                                            value={data.subject}
                                            onChange={(e) => setData('subject', e.target.value)}
                                            className="mt-1.5"
                                            required
                                        />
                                        {errors.subject && <p className="mt-1 text-xs text-red-500">{errors.subject}</p>}
                                    </div>
                                </div>

                                <div>
                                    <Label htmlFor="message">Pesan <span className="text-red-500">*</span></Label>
                                    <textarea
                                        id="message"
                                        rows={5}
                                        placeholder="Tuliskan pesan Anda di sini (minimal 10 karakter)..."
                                        value={data.message}
                                        onChange={(e) => setData('message', e.target.value)}
                                        className="mt-1.5 flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                                        required
                                        minLength={10}
                                    />
                                    {errors.message && <p className="mt-1 text-xs text-red-500">{errors.message}</p>}
                                </div>

                                <Button type="submit" size="lg" className="w-full sm:w-auto px-8" disabled={processing}>
                                    {processing ? 'Mengirim...' : 'Kirim Pesan'}
                                </Button>
                            </form>
                        </div>
                    </div>

                </div>
            </section>
        </>
    );
}
