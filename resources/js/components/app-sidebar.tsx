import { Link } from '@inertiajs/react';
import { User, Lock, MapPin, Package, Home } from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import type { NavItem } from '@/types';

const mainNavItems: NavItem[] = [
    {
        title: 'Kembali ke Beranda',
        href: '/',
        icon: Home,
    },
    {
        title: 'Informasi Akun',
        href: '/profile?tab=account',
        icon: User,
    },
    {
        title: 'Kata Sandi',
        href: '/profile?tab=password',
        icon: Lock,
    },
    {
        title: 'Buku Alamat',
        href: '/profile?tab=addresses',
        icon: MapPin,
    },
    {
        title: 'Riwayat Pesanan',
        href: '/profile?tab=orders',
        icon: Package,
    },
];


export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
