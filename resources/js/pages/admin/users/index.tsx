import { Head, usePage, router } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import { Shield, User as UserIcon, Eye, Pencil, Trash2, FileDown, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type UserData = {
    id: number;
    name: string;
    email: string;
    role: string;
    created_at: string;
};

type Props = {
    users: UserData[];
};

export default function AdminUsers({ users }: Props) {
    const { auth } = usePage<{ auth: { user: UserData } }>().props;
    const currentUser = auth.user;

    const [viewUser, setViewUser] = useState<UserData | null>(null);
    const [editUser, setEditUser] = useState<UserData | null>(null);
    const [formData, setFormData] = useState({ name: '', email: '' });
    const [errors, setErrors] = useState<any>({});

    const openEdit = (user: UserData) => {
        setEditUser(user);
        setFormData({ name: user.name, email: user.email });
        setErrors({});
    };

    const handleEditSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editUser) return;
        
        router.put(`/admin/users/${editUser.id}`, formData, {
            onSuccess: () => setEditUser(null),
            onError: (err) => setErrors(err),
            preserveScroll: true,
        });
    };

    const handleDelete = (userId: number) => {
        if (confirm('Apakah Anda yakin ingin menghapus pengguna ini?')) {
            router.delete(`/admin/users/${userId}`, {
                preserveScroll: true,
            });
        }
    };

    const handleRoleChange = (userId: number, currentRole: string) => {
        const newRole = currentRole === 'admin' ? 'customer' : 'admin';
        const confirmMessage = newRole === 'admin' 
            ? 'Jadikan pengguna ini sebagai Admin?' 
            : 'Turunkan pengguna ini menjadi Customer biasa?';
            
        if (confirm(confirmMessage)) {
            router.patch(`/admin/users/${userId}/role`, { role: newRole }, {
                preserveScroll: true,
            });
        }
    };

    const formatDate = (dateString: string) => {
        return new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium' }).format(new Date(dateString));
    };

    return (
        <AdminLayout>
            <Head title="Kelola Pengguna" />

            <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
                        Kelola Pengguna
                    </h1>
                    <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                        Atur peran (role) pengguna dan kelola akses mereka ke sistem.
                    </p>
                </div>
                <div className="flex gap-2">
                    <a href="/admin/users/export/pdf" target="_blank" rel="noopener noreferrer">
                        <Button variant="outline" className="gap-2 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 dark:border-red-900/50 dark:hover:bg-red-900/20">
                            <FileText className="h-4 w-4" />
                            PDF
                        </Button>
                    </a>
                    <a href="/admin/users/export/excel">
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
                        <thead className="bg-neutral-50 border-b border-neutral-200/80 dark:bg-neutral-900/80 dark:border-neutral-800">
                            <tr>
                                <th className="px-6 py-4 font-medium text-neutral-900 dark:text-white">Nama</th>
                                <th className="px-6 py-4 font-medium text-neutral-900 dark:text-white">Email</th>
                                <th className="px-6 py-4 font-medium text-neutral-900 dark:text-white">Bergabung Sejak</th>
                                <th className="px-6 py-4 font-medium text-neutral-900 dark:text-white">Peran (Role)</th>
                                <th className="px-6 py-4 text-right font-medium text-neutral-900 dark:text-white">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-200/80 dark:divide-neutral-800">
                            {users.map((user) => {
                                const isSelf = currentUser.id === user.id;
                                return (
                                    <tr key={user.id} className="transition-colors hover:bg-neutral-50/50 dark:hover:bg-neutral-900/30">
                                        <td className="px-6 py-4 font-medium text-neutral-900 dark:text-neutral-200">
                                            {user.name}
                                            {isSelf && (
                                                <span className="ml-2 rounded-full bg-indigo-100 px-2 py-0.5 text-[10px] font-medium text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-400">
                                                    Anda
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-neutral-500 dark:text-neutral-400">{user.email}</td>
                                        <td className="px-6 py-4 text-neutral-500 dark:text-neutral-400">{formatDate(user.created_at)}</td>
                                        <td className="px-6 py-4">
                                            <span className={cn(
                                                "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
                                                user.role === 'admin' 
                                                    ? "bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-400" 
                                                    : "bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-400"
                                            )}>
                                                {user.role === 'admin' ? <Shield className="h-3.5 w-3.5" /> : <UserIcon className="h-3.5 w-3.5" />}
                                                {user.role === 'admin' ? 'Admin' : 'Customer'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                <Button variant="ghost" size="sm" onClick={() => setViewUser(user)} title="Lihat">
                                                    <Eye className="h-4 w-4 text-neutral-500 hover:text-blue-600" />
                                                </Button>
                                                <Button variant="ghost" size="sm" onClick={() => openEdit(user)} title="Edit">
                                                    <Pencil className="h-4 w-4 text-neutral-500 hover:text-indigo-600" />
                                                </Button>
                                                <Button 
                                                    variant="outline" 
                                                    size="sm"
                                                    onClick={() => handleRoleChange(user.id, user.role)}
                                                    disabled={isSelf}
                                                    className={cn(
                                                        "h-8 text-xs ml-1",
                                                        user.role === 'admin' ? "hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20" : ""
                                                    )}
                                                >
                                                    {user.role === 'admin' ? 'Turunkan ke Customer' : 'Jadikan Admin'}
                                                </Button>
                                                <Button variant="ghost" size="sm" onClick={() => handleDelete(user.id)} disabled={isSelf} title="Hapus">
                                                    <Trash2 className="h-4 w-4 text-neutral-500 hover:text-red-600" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* View Modal */}
            <Dialog open={!!viewUser} onOpenChange={(open) => !open && setViewUser(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Detail Pengguna</DialogTitle>
                    </DialogHeader>
                    {viewUser && (
                        <div className="space-y-4 pt-4">
                            <div>
                                <Label className="text-neutral-500">Nama Lengkap</Label>
                                <p className="font-medium text-neutral-900 dark:text-white">{viewUser.name}</p>
                            </div>
                            <div>
                                <Label className="text-neutral-500">Email</Label>
                                <p className="font-medium text-neutral-900 dark:text-white">{viewUser.email}</p>
                            </div>
                            <div>
                                <Label className="text-neutral-500">Peran (Role)</Label>
                                <p className="font-medium text-neutral-900 dark:text-white capitalize">{viewUser.role}</p>
                            </div>
                            <div>
                                <Label className="text-neutral-500">Bergabung Sejak</Label>
                                <p className="font-medium text-neutral-900 dark:text-white">{formatDate(viewUser.created_at)}</p>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* Edit Modal */}
            <Dialog open={!!editUser} onOpenChange={(open) => !open && setEditUser(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Pengguna</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleEditSubmit} className="space-y-4 pt-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Nama Lengkap</Label>
                            <Input 
                                id="name" 
                                value={formData.name}
                                onChange={e => setFormData({...formData, name: e.target.value})}
                                required 
                            />
                            {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input 
                                id="email" 
                                type="email"
                                value={formData.email}
                                onChange={e => setFormData({...formData, email: e.target.value})}
                                required 
                            />
                            {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                        </div>
                        <DialogFooter className="mt-6">
                            <Button type="button" variant="outline" onClick={() => setEditUser(null)}>
                                Batal
                            </Button>
                            <Button type="submit">
                                Simpan Perubahan
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </AdminLayout>
    );
}
