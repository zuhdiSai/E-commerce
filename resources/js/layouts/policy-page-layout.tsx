import { Head, Link } from '@inertiajs/react';
import { ChevronRight, Menu } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

export type PolicySection = {
    id: string;
    title: string;
};

type Props = {
    title: string;
    lastUpdated: string;
    sections: PolicySection[];
    children: React.ReactNode;
};

export default function PolicyPageLayout({ title, lastUpdated, sections, children }: Props) {
    const [tocOpen, setTocOpen] = useState(false);

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-16">
            <Head title={title} />
            
            {/* Hero Section */}
            <div className="relative overflow-hidden bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
                <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#1e293b_1px,transparent_1px)] bg-size-[16px_16px] mask-[radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30"></div>
                <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 text-center">
                    <nav className="flex justify-center items-center text-sm font-medium text-slate-500 mb-6">
                        <Link href="/" className="hover:text-slate-900 dark:hover:text-white transition-colors">Beranda</Link>
                        <ChevronRight className="w-4 h-4 mx-2" />
                        <span className="text-slate-900 dark:text-white">{title}</span>
                    </nav>
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-4 tracking-tight">
                        {title}
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400">
                        Terakhir diperbarui: {lastUpdated}
                    </p>
                </div>
            </div>

            {/* Content Area */}
            <div className="mx-auto max-w-7xl px-4 mt-12 sm:px-6 lg:px-8">
                <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
                    
                    {/* Mobile TOC Toggle */}
                    <div className="lg:hidden w-full">
                        <Button 
                            variant="outline" 
                            className="w-full justify-between bg-white dark:bg-slate-950"
                            onClick={() => setTocOpen(!tocOpen)}
                        >
                            <span>Daftar Isi</span>
                            <Menu className="w-4 h-4 ml-2" />
                        </Button>
                        
                        {tocOpen && (
                            <div className="mt-4 p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-sm">
                                <ul className="space-y-3">
                                    {sections.map((section, index) => (
                                        <li key={section.id}>
                                            <a 
                                                href={`#${section.id}`}
                                                className="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white block transition-colors"
                                                onClick={() => setTocOpen(false)}
                                            >
                                                <span className="text-slate-400 mr-2">{index + 1}.</span>
                                                {section.title}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>

                    {/* Desktop TOC Sidebar */}
                    <div className="hidden lg:block w-72 shrink-0">
                        <div className="sticky top-24 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-6 shadow-sm">
                            <h3 className="font-semibold text-slate-900 dark:text-white mb-4 text-sm uppercase tracking-wider">Daftar Isi</h3>
                            <ul className="space-y-3">
                                {sections.map((section, index) => (
                                    <li key={section.id}>
                                        <a 
                                            href={`#${section.id}`}
                                            className="text-sm text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 block transition-colors"
                                        >
                                            <span className="text-slate-400 font-medium mr-2">{index + 1}.</span>
                                            {section.title}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1 bg-white dark:bg-slate-950 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 sm:p-10 lg:p-12 w-full">
                        <div className="text-slate-600 dark:text-slate-300 space-y-6 leading-relaxed">
                            {children}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
