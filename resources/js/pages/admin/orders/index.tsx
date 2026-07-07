import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import { Package, Eye, Pencil, ShoppingBag, FileDown, FileText, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/StatusBadge';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';

type User = {
    id: number;
    name: string;
    email: string;
};

type Order = {
    id: number;
    order_number: string;
    user_id: number;
    user?: User;
    status: string;
    total_amount: number;
    created_at: string;
};

type Props = {
    orders: {
        data: Order[];
        links: any[];
    };
};



export default function OrdersIndex({ orders }: Props) {
    const [selectedOrders, setSelectedOrders] = useState<number[]>([]);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [orderToDelete, setOrderToDelete] = useState<number | null>(null);
    const [isBulkDelete, setIsBulkDelete] = useState(false);

    const handleStatusChange = (orderId: number, status: string) => {
        if (confirm(`Ubah status pesanan menjadi ${status}?`)) {
            router.put(`/admin/orders/${orderId}`, { status }, { preserveScroll: true });
        }
    };

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setSelectedOrders(orders.data.map(order => order.id));
        } else {
            setSelectedOrders([]);
        }
    };

    const handleSelectOrder = (id: number) => {
        if (selectedOrders.includes(id)) {
            setSelectedOrders(selectedOrders.filter(orderId => orderId !== id));
        } else {
            setSelectedOrders([...selectedOrders, id]);
        }
    };

    const confirmDelete = (id: number) => {
        setOrderToDelete(id);
        setIsBulkDelete(false);
        setIsDeleteDialogOpen(true);
    };

    const confirmBulkDelete = () => {
        setIsBulkDelete(true);
        setIsDeleteDialogOpen(true);
    };

    const handleDelete = () => {
        if (isBulkDelete && selectedOrders.length > 0) {
            router.delete('/admin/orders/bulk', {
                data: { ids: selectedOrders },
                preserveScroll: true,
                onSuccess: () => {
                    setSelectedOrders([]);
                    setIsDeleteDialogOpen(false);
                }
            });
        } else if (orderToDelete) {
            router.delete(`/admin/orders/${orderToDelete}`, {
                preserveScroll: true,
                onSuccess: () => {
                    setIsDeleteDialogOpen(false);
                }
            });
        }
    };

    return (
        <AdminLayout>
            <Head title="Kelola Pesanan" />

            <div className="mb-6 flex justify-between items-end">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
                        Pesanan
                    </h1>
                    <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                        Kelola semua pesanan pelanggan.
                    </p>
                </div>
                <div className="flex gap-2">
                    {selectedOrders.length > 0 && (
                        <Button 
                            variant="destructive" 
                            onClick={confirmBulkDelete}
                            className="gap-2"
                        >
                            <Trash2 className="h-4 w-4" />
                            Hapus ({selectedOrders.length})
                        </Button>
                    )}
                    <a href="/admin/orders/export/pdf" target="_blank" rel="noopener noreferrer">
                        <Button variant="outline" className="gap-2 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 dark:border-red-900/50 dark:hover:bg-red-900/20">
                            <FileText className="h-4 w-4" />
                            PDF
                        </Button>
                    </a>
                    <a href="/admin/orders/export/excel">
                        <Button variant="outline" className="gap-2 border-emerald-200 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 dark:border-emerald-900/50 dark:hover:bg-emerald-900/20">
                            <FileDown className="h-4 w-4" />
                            Excel
                        </Button>
                    </a>
                </div>
            </div>

            <div className="rounded-2xl border border-neutral-200/80 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900/50 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-neutral-50 text-neutral-500 dark:bg-neutral-800/50 dark:text-neutral-400 border-b border-neutral-200/80 dark:border-neutral-800">
                            <tr>
                                <th className="px-6 py-4 w-12 text-center">
                                    <input 
                                        type="checkbox" 
                                        className="rounded border-neutral-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:border-neutral-700 dark:bg-neutral-900 dark:checked:bg-indigo-600"
                                        checked={orders.data.length > 0 && selectedOrders.length === orders.data.length}
                                        onChange={handleSelectAll}
                                    />
                                </th>
                                <th className="px-6 py-4 font-medium">No. Pesanan</th>
                                <th className="px-6 py-4 font-medium">Tanggal</th>
                                <th className="px-6 py-4 font-medium">Pelanggan</th>
                                <th className="px-6 py-4 font-medium">Total</th>
                                <th className="px-6 py-4 font-medium">Status</th>
                                <th className="px-6 py-4 font-medium text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-200/80 dark:divide-neutral-800">
                            {orders.data.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-8 text-center text-neutral-500">
                                        <ShoppingBag className="mx-auto h-8 w-8 text-neutral-400 mb-2" />
                                        Belum ada pesanan masuk.
                                    </td>
                                </tr>
                            ) : (
                                orders.data.map((order) => (
                                    <tr key={order.id} className={`hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors ${selectedOrders.includes(order.id) ? 'bg-indigo-50/50 dark:bg-indigo-900/10' : ''}`}>
                                        <td className="px-6 py-4 text-center">
                                            <input 
                                                type="checkbox" 
                                                className="rounded border-neutral-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:border-neutral-700 dark:bg-neutral-900 dark:checked:bg-indigo-600"
                                                checked={selectedOrders.includes(order.id)}
                                                onChange={() => handleSelectOrder(order.id)}
                                            />
                                        </td>
                                        <td className="px-6 py-4 font-semibold text-neutral-900 dark:text-white">
                                            {order.order_number}
                                        </td>
                                        <td className="px-6 py-4 text-neutral-500">
                                            {new Date(order.created_at).toLocaleDateString('id-ID', {
                                                day: 'numeric',
                                                month: 'short',
                                                year: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </td>
                                        <td className="px-6 py-4 text-neutral-500">
                                            {order.user?.name || '-'}
                                        </td>
                                        <td className="px-6 py-4 font-medium text-neutral-900 dark:text-white">
                                            Rp {order.total_amount.toLocaleString('id-ID')}
                                        </td>
                                        <td className="px-6 py-4">
                                            <StatusBadge status={order.status} />
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2 items-center">
                                                <select
                                                    className="h-8 rounded-md border border-neutral-200 bg-white px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-300"
                                                    value={order.status}
                                                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                                >
                                                    <option value="pending">Pending</option>
                                                    <option value="diproses">Diproses</option>
                                                    <option value="dikirim">Dikirim</option>
                                                    <option value="selesai">Selesai</option>
                                                    <option value="dibatalkan">Dibatalkan</option>
                                                </select>
                                                <Link href={`/admin/orders/${order.id}`}>
                                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="Detail Pesanan">
                                                        <Eye className="h-4 w-4 text-neutral-500 hover:text-indigo-600" />
                                                    </Button>
                                                </Link>
                                                <Button 
                                                    variant="ghost" 
                                                    size="sm" 
                                                    className="h-8 w-8 p-0" 
                                                    title="Hapus Pesanan"
                                                    onClick={() => confirmDelete(order.id)}
                                                >
                                                    <Trash2 className="h-4 w-4 text-neutral-500 hover:text-red-600" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
                {/* Pagination Controls */}
                {orders.links && orders.links.length > 3 && (
                    <div className="flex items-center justify-center p-4 border-t border-neutral-200/80 dark:border-neutral-800">
                        <div className="flex flex-wrap gap-1">
                            {orders.links.map((link, i) => (
                                <button
                                    key={i}
                                    onClick={() => {
                                        if (link.url) router.get(link.url, {}, { preserveScroll: true });
                                    }}
                                    disabled={!link.url || link.active}
                                    className={`px-3 py-1 text-sm border rounded-md transition-colors ${
                                        link.active 
                                        ? 'bg-neutral-900 text-white border-neutral-900 dark:bg-white dark:text-neutral-900 dark:border-white' 
                                        : 'bg-white text-neutral-600 hover:bg-neutral-50 dark:bg-neutral-900 dark:text-neutral-400 dark:border-neutral-800'
                                    } ${!link.url ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Konfirmasi Hapus</DialogTitle>
                        <DialogDescription>
                            {isBulkDelete 
                                ? `Apakah Anda yakin ingin menghapus ${selectedOrders.length} pesanan yang dipilih? Tindakan ini tidak dapat dibatalkan.` 
                                : 'Apakah Anda yakin ingin menghapus pesanan ini? Tindakan ini tidak dapat dibatalkan.'}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                            Batal
                        </Button>
                        <Button variant="destructive" onClick={handleDelete}>
                            Hapus
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AdminLayout>
    );
}
