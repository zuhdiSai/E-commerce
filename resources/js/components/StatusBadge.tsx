import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
    status: string;
    className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
    let colorClass = 'bg-neutral-100 text-neutral-700 dark:bg-neutral-900/30 dark:text-neutral-400';

    switch (status.toLowerCase()) {
        case 'pending':
            colorClass = 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-400';
            break;
        case 'diproses':
            colorClass = 'bg-amber-100 text-amber-700 hover:bg-amber-100 dark:bg-amber-900/30 dark:text-amber-400';
            break;
        case 'dikirim':
            colorClass = 'bg-blue-100 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400';
            break;
        case 'selesai':
            colorClass = 'bg-green-100 text-green-700 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-400';
            break;
        case 'dibatalkan':
            colorClass = 'bg-red-100 text-red-700 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-400';
            break;
    }

    return (
        <Badge variant="secondary" className={cn(colorClass, 'capitalize rounded-full px-2.5 py-0.5 text-xs font-medium border-transparent', className)}>
            {status}
        </Badge>
    );
}
