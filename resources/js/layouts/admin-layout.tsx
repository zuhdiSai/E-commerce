import { Link, usePage } from '@inertiajs/react';
import { 
    LayoutDashboard, Package, Tag, ShoppingCart, Users, 
    LogOut, ExternalLink, Menu, X, ShoppingBag, ChevronLeft, ChevronRight, Ticket, Mail
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';

type Props = {
    children: React.ReactNode;
};

export default function AdminLayout({ children }: Props) {
    const { auth, flash, unreadContactCount } = usePage<{
        auth: { user: { name: string; email: string; role: string } };
        flash: { type: string; message: string } | null;
        unreadContactCount: number;
    }>().props;
    
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);
    
    const currentUrl = usePage().url;

    // Show flash toast messages
    useEffect(() => {
        if (flash?.message) {
            if (flash.type === 'success') {
                toast.success(flash.message);
            } else if (flash.type === 'error') {
                toast.error(flash.message);
            } else {
                toast.info(flash.message);
            }
        }
    }, [flash]);

    // Handle mobile auto-close
    useEffect(() => {
        setSidebarOpen(false);
    }, [currentUrl]);

    const navigation = [
        { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
        { name: 'Kelola Produk', href: '/admin/products', icon: Package },
        { name: 'Kelola Pesanan', href: '/admin/orders', icon: ShoppingCart },
        { name: 'Kelola Pengguna', href: '/admin/users', icon: Users },
        { name: 'Kelola Voucher', href: '/admin/vouchers', icon: Ticket },
        { name: 'Pesan Kontak', href: '/admin/contact-messages', icon: Mail, badge: unreadContactCount },
    ];

    const NavItem = ({ item, isActive }: { item: any, isActive: boolean }) => {
        const linkContent = (
            <Link
                href={item.href}
                className={cn(
                    "group flex items-center rounded-xl transition-all duration-200",
                    isCollapsed ? "justify-center p-3" : "px-3 py-2.5 gap-3",
                    isActive 
                        ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400 font-semibold shadow-sm" 
                        : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white font-medium"
                )}
            >
                <item.icon className={cn(
                    "shrink-0 transition-all duration-200",
                    isCollapsed ? "h-6 w-6" : "h-5 w-5",
                    isActive 
                        ? "text-indigo-700 dark:text-indigo-400" 
                        : "text-neutral-400 group-hover:text-neutral-600 dark:text-neutral-500 dark:group-hover:text-neutral-300"
                )} />
                {!isCollapsed && <span>{item.name}</span>}
                {!isCollapsed && item.badge > 0 && (
                    <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 text-[10px] font-bold text-white">
                        {item.badge > 99 ? '99+' : item.badge}
                    </span>
                )}
                {!isCollapsed && isActive && !item.badge && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400" />
                )}
            </Link>
        );

        if (isCollapsed) {
            return (
                <Tooltip delayDuration={0}>
                    <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
                    <TooltipContent side="right" className="font-medium">{item.name}</TooltipContent>
                </Tooltip>
            );
        }

        return linkContent;
    };

    return (
        <TooltipProvider>
            <div className="flex h-screen bg-[#FAFAFA] dark:bg-[#09090B]">
                {/* Mobile sidebar backdrop */}
                {sidebarOpen && (
                    <div 
                        className="fixed inset-0 z-40 bg-neutral-900/50 backdrop-blur-sm lg:hidden transition-opacity"
                        onClick={() => setSidebarOpen(false)}
                    />
                )}

                {/* Sidebar */}
                <aside 
                    className={cn(
                        "fixed inset-y-0 left-0 z-50 transform flex-col border-r border-neutral-200/80 bg-white transition-all duration-300 ease-in-out lg:static lg:flex lg:translate-x-0 dark:border-neutral-800 dark:bg-[#09090B]",
                        sidebarOpen ? "flex translate-x-0 w-64" : "-translate-x-full lg:translate-x-0",
                        isCollapsed ? "lg:w-20" : "lg:w-64"
                    )}
                >
                    <div className={cn("flex h-16 shrink-0 items-center justify-between px-4", isCollapsed ? "lg:justify-center" : "px-6")}>
                        <Link href="/admin/dashboard" className={cn("flex items-center gap-3", isCollapsed && "lg:justify-center")}>
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 text-white shadow-md">
                                <ShoppingBag className="h-5 w-5" />
                            </div>
                            {!isCollapsed && (
                                <span className="font-bold tracking-tight text-neutral-900 dark:text-white text-lg">
                                    Admin Panel
                                </span>
                            )}
                        </Link>
                        <button 
                            onClick={() => setSidebarOpen(false)}
                            className="lg:hidden p-1.5 rounded-lg text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white transition-colors"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    <div className="flex flex-1 flex-col overflow-y-auto overflow-x-hidden py-6 px-3">
                        <nav className="flex-1 space-y-1.5">
                            {navigation.map((item) => {
                                const isActive = currentUrl.startsWith(item.href);
                                return <NavItem key={item.name} item={item} isActive={isActive} />;
                            })}
                        </nav>

                        <div className="mt-8 pt-6">
                            {!isCollapsed && (
                                <div className="mb-4 px-3">
                                    <div className="flex items-center gap-3">
                                        <div className="h-9 w-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold dark:bg-indigo-900/50 dark:text-indigo-300">
                                            {auth.user.name.charAt(0)}
                                        </div>
                                        <div className="overflow-hidden">
                                            <p className="text-sm font-semibold text-neutral-900 dark:text-white truncate">{auth.user.name}</p>
                                            <p className="truncate text-xs text-neutral-500 dark:text-neutral-400">{auth.user.email}</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                            
                            <div className="space-y-1.5">
                                <Link
                                    href="/admin/view-as-customer"
                                    className={cn(
                                        "group flex items-center rounded-xl transition-all duration-200 text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white font-medium",
                                        isCollapsed ? "justify-center p-3" : "px-3 py-2.5 gap-3"
                                    )}
                                >
                                    {isCollapsed ? (
                                        <Tooltip delayDuration={0}>
                                            <TooltipTrigger asChild>
                                                <div><ExternalLink className="h-6 w-6 shrink-0 text-neutral-400 group-hover:text-neutral-600 dark:text-neutral-500 dark:group-hover:text-neutral-300" /></div>
                                            </TooltipTrigger>
                                            <TooltipContent side="right" className="font-medium">Lihat sebagai Customer</TooltipContent>
                                        </Tooltip>
                                    ) : (
                                        <>
                                            <ExternalLink className="h-5 w-5 shrink-0 text-neutral-400 group-hover:text-neutral-600 dark:text-neutral-500 dark:group-hover:text-neutral-300" />
                                            <span>Lihat Customer</span>
                                        </>
                                    )}
                                </Link>
                                <Link
                                    href="/logout"
                                    method="post"
                                    as="button"
                                    className={cn(
                                        "group flex w-full items-center rounded-xl transition-all duration-200 text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-500 dark:hover:bg-red-950/30",
                                        isCollapsed ? "justify-center p-3" : "px-3 py-2.5 gap-3"
                                    )}
                                >
                                    {isCollapsed ? (
                                        <Tooltip delayDuration={0}>
                                            <TooltipTrigger asChild>
                                                <div><LogOut className="h-6 w-6 shrink-0" /></div>
                                            </TooltipTrigger>
                                            <TooltipContent side="right" className="font-medium text-red-600">Keluar</TooltipContent>
                                        </Tooltip>
                                    ) : (
                                        <>
                                            <LogOut className="h-5 w-5 shrink-0" />
                                            <span>Keluar</span>
                                        </>
                                    )}
                                </Link>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Main content */}
                <div className="flex flex-1 flex-col overflow-hidden">
                    <header className="flex h-16 shrink-0 items-center gap-4 border-b border-neutral-200/80 bg-white/80 backdrop-blur-md px-4 lg:px-8 dark:border-neutral-800 dark:bg-[#09090B]/80 sticky top-0 z-30">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="text-neutral-500 hover:text-neutral-900 lg:hidden p-2 rounded-lg hover:bg-neutral-100 dark:text-neutral-400 dark:hover:text-white dark:hover:bg-neutral-800 transition-colors"
                        >
                            <Menu className="h-6 w-6" />
                        </button>
                        
                        <button
                            onClick={() => setIsCollapsed(!isCollapsed)}
                            className="hidden lg:flex items-center justify-center text-neutral-500 hover:text-neutral-900 p-2 rounded-lg hover:bg-neutral-100 dark:text-neutral-400 dark:hover:text-white dark:hover:bg-neutral-800 transition-colors"
                        >
                            {isCollapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
                        </button>
                        
                        <div className="flex flex-1 items-center justify-end">
                            <Link href="/admin/view-as-customer">
                                <Button variant="outline" size="sm" className="hidden sm:flex gap-2 rounded-xl shadow-sm border-neutral-200 dark:border-neutral-700">
                                    <ExternalLink className="h-4 w-4" />
                                    Kunjungi Toko
                                </Button>
                            </Link>
                        </div>
                    </header>

                    <main className="flex-1 overflow-y-auto bg-[#FAFAFA] p-4 sm:p-6 lg:p-8 dark:bg-[#09090B]">
                        {children}
                    </main>
                </div>
            </div>
        </TooltipProvider>
    );
}
