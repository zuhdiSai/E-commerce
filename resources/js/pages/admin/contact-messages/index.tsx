import { Head, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';
import AdminLayout from '@/layouts/admin-layout';
import { Mail, MailOpen, Search, Trash2, X, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog';

type ContactMessage = {
    id: number;
    name: string;
    email: string;
    phone: string | null;
    subject: string;
    message: string;
    is_read: boolean;
    created_at: string;
};

type Props = {
    messages: {
        data: ContactMessage[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        links: { url: string | null; label: string; active: boolean }[];
    };
    filters: {
        status?: string;
        search?: string;
    };
};

export default function ContactMessagesIndex({ messages, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/admin/contact-messages', { search, status: filters.status }, { preserveState: true });
    };

    const handleFilter = (status: string) => {
        router.get('/admin/contact-messages', { status: status || undefined, search: filters.search }, { preserveState: true });
    };

    const handleView = async (msg: ContactMessage) => {
        setSelectedMessage(msg);
        setDialogOpen(true);
        
        if (!msg.is_read) {
            try {
                const response = await fetch(`/admin/contact-messages/${msg.id}`, {
                    headers: { 'Accept': 'application/json' },
                });
                if (response.ok) {
                    msg.is_read = true;
                }
            } catch { /* silently fail */ }
        }
    };

    const handleDelete = (id: number) => {
        if (confirm('Hapus pesan ini?')) {
            router.delete(`/admin/contact-messages/${id}`, { preserveScroll: true });
            setDialogOpen(false);
        }
    };

    return (
        <AdminLayout>
            <Head title="Pesan Kontak" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Pesan Kontak</h1>
                        <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                            {messages.total} pesan total
                        </p>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex gap-2">
                        <Button
                            variant={!filters.status ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => handleFilter('')}
                        >
                            Semua
                        </Button>
                        <Button
                            variant={filters.status === 'unread' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => handleFilter('unread')}
                        >
                            Belum Dibaca
                        </Button>
                        <Button
                            variant={filters.status === 'read' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => handleFilter('read')}
                        >
                            Sudah Dibaca
                        </Button>
                    </div>
                    <form onSubmit={handleSearch} className="relative w-full sm:w-72">
                        <Input
                            type="search"
                            placeholder="Cari nama, email, subjek..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-10"
                        />
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                    </form>
                </div>

                {/* Table */}
                <div className="rounded-xl border border-neutral-200/80 bg-white overflow-hidden dark:border-neutral-800 dark:bg-neutral-900/50">
                    {messages.data.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 text-center">
                            <Mail className="mb-4 h-12 w-12 text-neutral-300 dark:text-neutral-600" />
                            <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">Belum ada pesan</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="border-b border-neutral-200/80 bg-neutral-50/80 dark:border-neutral-800 dark:bg-neutral-900">
                                    <tr>
                                        <th className="px-4 py-3 text-left font-medium text-neutral-500 dark:text-neutral-400">Status</th>
                                        <th className="px-4 py-3 text-left font-medium text-neutral-500 dark:text-neutral-400">Pengirim</th>
                                        <th className="px-4 py-3 text-left font-medium text-neutral-500 dark:text-neutral-400 hidden sm:table-cell">Subjek</th>
                                        <th className="px-4 py-3 text-left font-medium text-neutral-500 dark:text-neutral-400 hidden md:table-cell">Waktu</th>
                                        <th className="px-4 py-3 text-right font-medium text-neutral-500 dark:text-neutral-400">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-neutral-200/80 dark:divide-neutral-800">
                                    {messages.data.map((msg) => (
                                        <tr
                                            key={msg.id}
                                            className={`cursor-pointer transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-800/50 ${!msg.is_read ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''}`}
                                            onClick={() => handleView(msg)}
                                        >
                                            <td className="px-4 py-3">
                                                {msg.is_read ? (
                                                    <MailOpen className="h-4 w-4 text-neutral-400" />
                                                ) : (
                                                    <div className="relative">
                                                        <Mail className="h-4 w-4 text-blue-500" />
                                                        <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-blue-500" />
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-4 py-3">
                                                <p className={`font-medium text-neutral-900 dark:text-white ${!msg.is_read ? 'font-semibold' : ''}`}>
                                                    {msg.name}
                                                </p>
                                                <p className="text-xs text-neutral-500 dark:text-neutral-400">{msg.email}</p>
                                            </td>
                                            <td className="px-4 py-3 hidden sm:table-cell">
                                                <p className={`text-neutral-700 dark:text-neutral-300 ${!msg.is_read ? 'font-semibold' : ''}`}>
                                                    {msg.subject}
                                                </p>
                                            </td>
                                            <td className="px-4 py-3 hidden md:table-cell text-neutral-500 dark:text-neutral-400 text-xs">
                                                {formatDistanceToNow(new Date(msg.created_at), { addSuffix: true, locale: idLocale })}
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <div className="flex items-center justify-end gap-1">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8"
                                                        onClick={(e) => { e.stopPropagation(); handleView(msg); }}
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-red-500 hover:text-red-600"
                                                        onClick={(e) => { e.stopPropagation(); handleDelete(msg.id); }}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Pagination */}
                    {messages.last_page > 1 && (
                        <div className="flex items-center justify-center gap-1 border-t border-neutral-200/80 px-4 py-3 dark:border-neutral-800">
                            {messages.links.map((link, idx) => (
                                <Button
                                    key={idx}
                                    variant={link.active ? 'default' : 'ghost'}
                                    size="sm"
                                    className="h-8 min-w-8"
                                    disabled={!link.url}
                                    onClick={() => link.url && router.get(link.url, {}, { preserveState: true })}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Message Detail Dialog */}
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle>{selectedMessage?.subject}</DialogTitle>
                        <DialogDescription>
                            Dari {selectedMessage?.name} ({selectedMessage?.email})
                        </DialogDescription>
                    </DialogHeader>
                    {selectedMessage && (
                        <div className="space-y-4">
                            <div className="flex flex-wrap gap-2 text-xs text-neutral-500 dark:text-neutral-400">
                                {selectedMessage.phone && (
                                    <Badge variant="outline">Tel: {selectedMessage.phone}</Badge>
                                )}
                                <Badge variant="outline">
                                    {formatDistanceToNow(new Date(selectedMessage.created_at), { addSuffix: true, locale: idLocale })}
                                </Badge>
                                <Badge variant={selectedMessage.is_read ? 'secondary' : 'default'}>
                                    {selectedMessage.is_read ? 'Sudah Dibaca' : 'Belum Dibaca'}
                                </Badge>
                            </div>
                            <div className="rounded-xl bg-neutral-50 p-4 text-sm leading-relaxed text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 whitespace-pre-wrap">
                                {selectedMessage.message}
                            </div>
                            <div className="flex gap-2 justify-end">
                                <Button variant="outline" size="sm" onClick={() => setDialogOpen(false)}>
                                    Tutup
                                </Button>
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => handleDelete(selectedMessage.id)}
                                >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Hapus
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </AdminLayout>
    );
}
