import { Head, router } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import { useState } from 'react';
import { Plus, Pencil, Trash2, Ticket } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';

type Voucher = {
    id: number;
    code: string;
    type: 'percentage' | 'fixed';
    value: number;
    min_spend: number;
    start_date: string | null;
    end_date: string | null;
    usage_limit: number | null;
    used_count: number;
    is_active: boolean;
};

export default function VouchersIndex({ vouchers }: { vouchers: Voucher[] }) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingVoucher, setEditingVoucher] = useState<Voucher | null>(null);
    const [formData, setFormData] = useState({
        code: '',
        type: 'fixed',
        value: '',
        min_spend: '',
        start_date: '',
        end_date: '',
        usage_limit: '',
        is_active: true,
    });
    const [errors, setErrors] = useState<any>({});

    const openCreateDialog = () => {
        setEditingVoucher(null);
        setFormData({
            code: '',
            type: 'fixed',
            value: '',
            min_spend: '',
            start_date: '',
            end_date: '',
            usage_limit: '',
            is_active: true,
        });
        setErrors({});
        setIsDialogOpen(true);
    };

    const openEditDialog = (voucher: Voucher) => {
        setEditingVoucher(voucher);
        setFormData({
            code: voucher.code,
            type: voucher.type,
            value: voucher.value.toString(),
            min_spend: voucher.min_spend.toString(),
            start_date: voucher.start_date ? voucher.start_date.split('T')[0] : '',
            end_date: voucher.end_date ? voucher.end_date.split('T')[0] : '',
            usage_limit: voucher.usage_limit ? voucher.usage_limit.toString() : '',
            is_active: voucher.is_active,
        });
        setErrors({});
        setIsDialogOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        const payload = {
            ...formData,
            is_active: formData.is_active ? 1 : 0,
        };

        if (editingVoucher) {
            router.put(`/admin/vouchers/${editingVoucher.id}`, payload, {
                onSuccess: () => setIsDialogOpen(false),
                onError: (err) => setErrors(err),
            });
        } else {
            router.post('/admin/vouchers', payload, {
                onSuccess: () => setIsDialogOpen(false),
                onError: (err) => setErrors(err),
            });
        }
    };

    const handleDelete = (id: number) => {
        if (confirm('Apakah Anda yakin ingin menghapus voucher ini?')) {
            router.delete(`/admin/vouchers/${id}`);
        }
    };

    return (
        <AdminLayout>
            <Head title="Kelola Voucher" />

            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
                        Kelola Voucher
                    </h1>
                    <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                        Atur kode promo dan diskon untuk pelanggan.
                    </p>
                </div>
                <Button onClick={openCreateDialog} className="gap-2">
                    <Plus className="h-4 w-4" />
                    Tambah Voucher
                </Button>
            </div>

            <div className="rounded-2xl border border-neutral-200/80 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900/50 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-neutral-50 text-neutral-500 dark:bg-neutral-800/50 dark:text-neutral-400">
                            <tr>
                                <th className="px-6 py-4 font-medium">Kode</th>
                                <th className="px-6 py-4 font-medium">Nilai Diskon</th>
                                <th className="px-6 py-4 font-medium">Min. Belanja</th>
                                <th className="px-6 py-4 font-medium">Kuota Terpakai</th>
                                <th className="px-6 py-4 font-medium">Status</th>
                                <th className="px-6 py-4 font-medium text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-200/80 dark:divide-neutral-800">
                            {vouchers.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-neutral-500">
                                        <Ticket className="mx-auto h-8 w-8 text-neutral-400 mb-2" />
                                        Belum ada voucher yang dibuat.
                                    </td>
                                </tr>
                            ) : (
                                vouchers.map((voucher) => (
                                    <tr key={voucher.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors">
                                        <td className="px-6 py-4 font-semibold text-neutral-900 dark:text-white">
                                            {voucher.code}
                                        </td>
                                        <td className="px-6 py-4">
                                            {voucher.type === 'percentage' 
                                                ? `${voucher.value}%` 
                                                : `Rp ${voucher.value.toLocaleString('id-ID')}`}
                                        </td>
                                        <td className="px-6 py-4 text-neutral-500">
                                            Rp {voucher.min_spend.toLocaleString('id-ID')}
                                        </td>
                                        <td className="px-6 py-4">
                                            {voucher.used_count} / {voucher.usage_limit || '∞'}
                                        </td>
                                        <td className="px-6 py-4">
                                            <Badge variant={voucher.is_active ? 'default' : 'secondary'}>
                                                {voucher.is_active ? 'Aktif' : 'Nonaktif'}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button variant="ghost" size="sm" onClick={() => openEditDialog(voucher)}>
                                                    <Pencil className="h-4 w-4 text-neutral-500 hover:text-indigo-600" />
                                                </Button>
                                                <Button variant="ghost" size="sm" onClick={() => handleDelete(voucher.id)}>
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
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>{editingVoucher ? 'Edit Voucher' : 'Tambah Voucher'}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                        <div className="space-y-2">
                            <Label htmlFor="code">Kode Voucher</Label>
                            <Input 
                                id="code" 
                                value={formData.code}
                                onChange={e => setFormData({...formData, code: e.target.value.toUpperCase()})}
                                placeholder="Misal: PROMO2026"
                                required 
                            />
                            {errors.code && <p className="text-sm text-red-500">{errors.code}</p>}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="type">Tipe Diskon</Label>
                                <select 
                                    id="type"
                                    className="flex h-10 w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-800 dark:bg-neutral-950 dark:ring-offset-neutral-950 dark:focus-visible:ring-neutral-300"
                                    value={formData.type}
                                    onChange={e => setFormData({...formData, type: e.target.value as any})}
                                >
                                    <option value="fixed">Nominal (Rp)</option>
                                    <option value="percentage">Persentase (%)</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="value">Nilai</Label>
                                <Input 
                                    id="value" 
                                    type="number"
                                    value={formData.value}
                                    onChange={e => setFormData({...formData, value: e.target.value})}
                                    placeholder={formData.type === 'percentage' ? 'Misal: 10' : 'Misal: 50000'}
                                    required 
                                />
                                {errors.value && <p className="text-sm text-red-500">{errors.value}</p>}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="min_spend">Minimal Belanja (Rp)</Label>
                            <Input 
                                id="min_spend" 
                                type="number"
                                value={formData.min_spend}
                                onChange={e => setFormData({...formData, min_spend: e.target.value})}
                                placeholder="Opsional (0 = tanpa minimal)"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="start_date">Tanggal Mulai</Label>
                                <Input 
                                    id="start_date" 
                                    type="date"
                                    value={formData.start_date}
                                    onChange={e => setFormData({...formData, start_date: e.target.value})}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="end_date">Tanggal Berakhir</Label>
                                <Input 
                                    id="end_date" 
                                    type="date"
                                    value={formData.end_date}
                                    onChange={e => setFormData({...formData, end_date: e.target.value})}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="usage_limit">Batas Kuota</Label>
                                <Input 
                                    id="usage_limit" 
                                    type="number"
                                    value={formData.usage_limit}
                                    onChange={e => setFormData({...formData, usage_limit: e.target.value})}
                                    placeholder="Kosongkan jika unlimited"
                                />
                            </div>
                            <div className="flex items-center space-x-2 pt-8">
                                <input 
                                    type="checkbox"
                                    id="is_active"
                                    className="h-4 w-4 rounded border-gray-300 text-indigo-600"
                                    checked={formData.is_active}
                                    onChange={e => setFormData({...formData, is_active: e.target.checked})}
                                />
                                <Label htmlFor="is_active">Aktif</Label>
                            </div>
                        </div>

                        <DialogFooter className="mt-6">
                            <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                                Batal
                            </Button>
                            <Button type="submit">
                                {editingVoucher ? 'Simpan Perubahan' : 'Buat Voucher'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </AdminLayout>
    );
}
