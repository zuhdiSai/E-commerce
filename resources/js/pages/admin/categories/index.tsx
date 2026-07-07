import { Head, router } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import { useState, useRef } from 'react';
import { Plus, Pencil, Trash2, FolderTree } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';

type Category = {
    id: number;
    name: string;
    slug: string;
    image: string | null;
    products_count?: number;
};

type Props = {
    categories: Category[];
};

export default function CategoriesIndex({ categories }: Props) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        image: null as File | null,
    });
    const [errors, setErrors] = useState<any>({});
    const fileInputRef = useRef<HTMLInputElement>(null);

    const openCreateDialog = () => {
        setEditingCategory(null);
        setFormData({
            name: '',
            image: null,
        });
        setErrors({});
        if (fileInputRef.current) fileInputRef.current.value = '';
        setIsDialogOpen(true);
    };

    const openEditDialog = (category: Category) => {
        setEditingCategory(category);
        setFormData({
            name: category.name,
            image: null,
        });
        setErrors({});
        if (fileInputRef.current) fileInputRef.current.value = '';
        setIsDialogOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        const payload = new FormData();
        payload.append('name', formData.name);
        
        if (formData.image) {
            payload.append('image', formData.image);
        }

        if (editingCategory) {
            payload.append('_method', 'PUT'); // Method spoofing for file uploads
            router.post(`/admin/categories/${editingCategory.id}`, payload, {
                onSuccess: () => setIsDialogOpen(false),
                onError: (err) => setErrors(err),
                preserveScroll: true,
            });
        } else {
            router.post('/admin/categories', payload, {
                onSuccess: () => setIsDialogOpen(false),
                onError: (err) => setErrors(err),
                preserveScroll: true,
            });
        }
    };

    const handleDelete = (category: Category) => {
        if (category.products_count && category.products_count > 0) {
            alert('Tidak dapat menghapus kategori ini karena masih memiliki produk.');
            return;
        }

        if (confirm('Apakah Anda yakin ingin menghapus kategori ini?')) {
            router.delete(`/admin/categories/${category.id}`, {
                preserveScroll: true,
            });
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFormData({ ...formData, image: e.target.files[0] });
        } else {
            setFormData({ ...formData, image: null });
        }
    };

    return (
        <AdminLayout>
            <Head title="Kelola Kategori" />

            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
                        Kelola Kategori
                    </h1>
                    <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                        Atur struktur kategori untuk produk toko Anda.
                    </p>
                </div>
                <Button onClick={openCreateDialog} className="gap-2">
                    <Plus className="h-4 w-4" />
                    Tambah Kategori
                </Button>
            </div>

            <div className="rounded-2xl border border-neutral-200/80 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900/50 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-neutral-50 text-neutral-500 dark:bg-neutral-800/50 dark:text-neutral-400 border-b border-neutral-200/80 dark:border-neutral-800">
                            <tr>
                                <th className="px-6 py-4 font-medium">Gambar</th>
                                <th className="px-6 py-4 font-medium">Nama Kategori</th>
                                <th className="px-6 py-4 font-medium">Slug</th>
                                <th className="px-6 py-4 font-medium">Jumlah Produk</th>
                                <th className="px-6 py-4 font-medium text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-200/80 dark:divide-neutral-800">
                            {categories.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-neutral-500">
                                        <FolderTree className="mx-auto h-8 w-8 text-neutral-400 mb-2" />
                                        Belum ada kategori yang ditambahkan.
                                    </td>
                                </tr>
                            ) : (
                                categories.map((category) => (
                                    <tr key={category.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors">
                                        <td className="px-6 py-4">
                                            {category.image ? (
                                                <img src={`/storage/${category.image}`} alt={category.name} className="h-10 w-10 rounded-md object-cover" />
                                            ) : (
                                                <div className="h-10 w-10 rounded-md bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center text-neutral-400">
                                                    <FolderTree className="h-5 w-5" />
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 font-semibold text-neutral-900 dark:text-white">
                                            {category.name}
                                        </td>
                                        <td className="px-6 py-4 text-neutral-500">
                                            {category.slug}
                                        </td>
                                        <td className="px-6 py-4 text-neutral-500">
                                            {category.products_count || 0} Produk
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button variant="ghost" size="sm" onClick={() => openEditDialog(category)}>
                                                    <Pencil className="h-4 w-4 text-neutral-500 hover:text-indigo-600" />
                                                </Button>
                                                <Button 
                                                    variant="ghost" 
                                                    size="sm" 
                                                    onClick={() => handleDelete(category)}
                                                    className={category.products_count && category.products_count > 0 ? 'opacity-50 cursor-not-allowed' : ''}
                                                    title={category.products_count && category.products_count > 0 ? 'Tidak bisa dihapus (memiliki produk)' : 'Hapus Kategori'}
                                                >
                                                    <Trash2 className={`h-4 w-4 ${category.products_count && category.products_count > 0 ? 'text-neutral-400' : 'text-neutral-500 hover:text-red-600'}`} />
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
                        <DialogTitle>{editingCategory ? 'Edit Kategori' : 'Tambah Kategori'}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Nama Kategori</Label>
                            <Input 
                                id="name" 
                                value={formData.name}
                                onChange={e => setFormData({...formData, name: e.target.value})}
                                placeholder="Contoh: Pakaian Pria"
                                required 
                            />
                            {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="image">Gambar Kategori (Opsional)</Label>
                            <Input 
                                id="image" 
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                ref={fileInputRef}
                            />
                            {errors.image && <p className="text-sm text-red-500">{errors.image}</p>}
                            {editingCategory && editingCategory.image && !formData.image && (
                                <p className="text-xs text-neutral-500 mt-1">Biarkan kosong jika tidak ingin mengubah gambar saat ini.</p>
                            )}
                        </div>

                        <DialogFooter className="mt-6 pt-4 border-t border-neutral-200 dark:border-neutral-800">
                            <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                                Batal
                            </Button>
                            <Button type="submit">
                                {editingCategory ? 'Simpan Perubahan' : 'Tambah Kategori'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </AdminLayout>
    );
}
