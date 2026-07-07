import { Link, usePage } from '@inertiajs/react';
import { ShoppingBag, ShoppingCart, User, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

import { Footer } from '@/components/footer';
import { StoreHeader } from '@/components/store-header';

type Props = {
    children: React.ReactNode;
};

export default function StorefrontLayout({ children }: Props) {
    const { auth, cartCount, flash, viewing_as_customer } = usePage<{
        auth: { user: { name: string; role: string } | null };
        cartCount: number;
        flash: { type: string; message: string } | null;
        viewing_as_customer?: boolean;
    }>().props;
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

    return (
        <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#09090B]">
            <StoreHeader />

            {/* Main Content */}
            <main>{children}</main>

            <Footer />
        </div>
    );
}
