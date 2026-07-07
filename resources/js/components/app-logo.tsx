import { ShoppingBag } from 'lucide-react';

export default function AppLogo() {
    return (
        <>
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-neutral-900 text-white dark:bg-white dark:text-neutral-900">
                <ShoppingBag className="h-4 w-4" />
            </div>
            <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="mb-0.5 truncate leading-tight font-bold tracking-tight text-neutral-900 dark:text-white">
                    Store
                </span>
            </div>
        </>
    );
}
