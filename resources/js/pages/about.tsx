import { Head, Link } from '@inertiajs/react';
import { ArrowRight, ShieldCheck, Truck, BadgeCheck, Headset, Users, Target, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';

type StoreInfo = {
    name: string;
    description: string;
    about: {
        founded: string;
        short: string;
        story: string;
        mission: string;
    };
};

type Props = {
    storeInfo: StoreInfo;
};

export default function About({ storeInfo }: Props) {
    const values = [
        {
            icon: BadgeCheck,
            title: 'Produk 100% Original',
            description: 'Semua produk yang kami jual dijamin keasliannya dan bergaransi resmi.',
            color: 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400',
        },
        {
            icon: Truck,
            title: 'Pengiriman Cepat',
            description: 'Kami bekerja sama dengan jasa pengiriman terpercaya untuk memastikan paket sampai tepat waktu.',
            color: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400',
        },
        {
            icon: ShieldCheck,
            title: 'Harga Terjangkau',
            description: 'Kami berkomitmen menawarkan harga terbaik tanpa mengorbankan kualitas produk.',
            color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
        },
        {
            icon: Headset,
            title: 'Layanan Ramah',
            description: 'Tim customer service kami siap membantu Anda dengan responsif dan ramah setiap hari.',
            color: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
        },
    ];

    const team = [
        { name: 'Ahmad Fauzan', role: 'Founder & CEO', initials: 'AF' },
        { name: 'Siti Nurhaliza', role: 'Head of Operations', initials: 'SN' },
        { name: 'Budi Santoso', role: 'Lead Developer', initials: 'BS' },
    ];

    return (
        <>
            <Head title="Tentang Kami" />

            {/* Hero */}
            <section className="relative bg-neutral-900 text-white">
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
                <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32 text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
                        Tentang Kami
                    </h1>
                    <p className="mx-auto mt-6 max-w-2xl text-lg text-neutral-300">
                        {storeInfo.about.short}
                    </p>
                </div>
            </section>

            {/* Story */}
            <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 items-center">
                    <div>
                        <span className="inline-flex items-center rounded-full bg-neutral-100 px-3 py-1 text-xs font-semibold text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
                            Sejak {storeInfo.about.founded}
                        </span>
                        <h2 className="mt-4 text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl dark:text-white">
                            Cerita Kami
                        </h2>
                        <p className="mt-4 text-neutral-600 leading-relaxed dark:text-neutral-400">
                            {storeInfo.about.story}
                        </p>
                        <p className="mt-4 text-neutral-600 leading-relaxed dark:text-neutral-400">
                            {storeInfo.about.mission}
                        </p>
                    </div>
                    <div className="grid grid-cols-2 gap-3 sm:gap-6">
                        <div className="flex flex-col items-center justify-center rounded-2xl border border-neutral-200/80 bg-white p-4 sm:p-6 text-center dark:border-neutral-800 dark:bg-neutral-900/50">
                            <Users className="mb-3 h-6 w-6 sm:h-8 sm:w-8 text-neutral-400" />
                            <p className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white">1000+</p>
                            <p className="mt-1 text-[10px] sm:text-xs text-neutral-500">Pelanggan Puas</p>
                        </div>
                        <div className="flex flex-col items-center justify-center rounded-2xl border border-neutral-200/80 bg-white p-4 sm:p-6 text-center dark:border-neutral-800 dark:bg-neutral-900/50">
                            <Target className="mb-3 h-6 w-6 sm:h-8 sm:w-8 text-neutral-400" />
                            <p className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white">500+</p>
                            <p className="mt-1 text-[10px] sm:text-xs text-neutral-500">Produk Tersedia</p>
                        </div>
                        <div className="flex flex-col items-center justify-center rounded-2xl border border-neutral-200/80 bg-white p-4 sm:p-6 text-center dark:border-neutral-800 dark:bg-neutral-900/50">
                            <Truck className="mb-3 h-6 w-6 sm:h-8 sm:w-8 text-neutral-400" />
                            <p className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white">5000+</p>
                            <p className="mt-1 text-[10px] sm:text-xs text-neutral-500">Pesanan Terkirim</p>
                        </div>
                        <div className="flex flex-col items-center justify-center rounded-2xl border border-neutral-200/80 bg-white p-4 sm:p-6 text-center dark:border-neutral-800 dark:bg-neutral-900/50">
                            <Heart className="mb-3 h-6 w-6 sm:h-8 sm:w-8 text-neutral-400" />
                            <p className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white">99%</p>
                            <p className="mt-1 text-[10px] sm:text-xs text-neutral-500">Tingkat Kepuasan</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Values */}
            <section className="border-t border-neutral-200/80 bg-neutral-50 dark:border-neutral-800 dark:bg-[#09090B]">
                <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl dark:text-white">
                            Mengapa Memilih Kami?
                        </h2>
                        <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
                            Keunggulan yang membedakan kami dari yang lain
                        </p>
                    </div>
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {values.map((item) => (
                            <div
                                key={item.title}
                                className="flex flex-col items-center rounded-2xl border border-neutral-200/80 bg-white p-8 text-center transition-all hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900/50"
                            >
                                <div className={`mb-5 flex h-14 w-14 items-center justify-center rounded-full ${item.color}`}>
                                    <item.icon className="h-7 w-7" />
                                </div>
                                <h3 className="text-base font-semibold text-neutral-900 dark:text-white">{item.title}</h3>
                                <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">{item.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Team */}
            <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl dark:text-white">
                        Tim Kami
                    </h2>
                    <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
                        Orang-orang di balik layar yang membuat segalanya berjalan
                    </p>
                </div>
                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 max-w-3xl mx-auto">
                    {team.map((member) => (
                        <div
                            key={member.name}
                            className="flex flex-col items-center rounded-2xl border border-neutral-200/80 bg-white p-8 text-center transition-all hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900/50"
                        >
                            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-neutral-200 to-neutral-100 text-2xl font-bold text-neutral-500 dark:from-neutral-700 dark:to-neutral-800 dark:text-neutral-400">
                                {member.initials}
                            </div>
                            <h3 className="text-base font-semibold text-neutral-900 dark:text-white">{member.name}</h3>
                            <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">{member.role}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA */}
            <section className="border-t border-neutral-200/80 bg-neutral-900 dark:border-neutral-800">
                <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                        Siap Berbelanja?
                    </h2>
                    <p className="mx-auto mt-3 max-w-lg text-neutral-400">
                        Jelajahi koleksi lengkap kami dan temukan produk yang sesuai dengan kebutuhan Anda.
                    </p>
                    <div className="mt-8">
                        <Link href="/products">
                            <Button size="lg" className="h-12 rounded-xl bg-white text-neutral-900 hover:bg-neutral-200 px-8 text-base font-semibold">
                                Jelajahi Produk Kami
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>
        </>
    );
}
