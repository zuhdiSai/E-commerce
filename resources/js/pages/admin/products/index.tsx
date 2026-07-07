import { Head, router } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import { useState, useRef, useCallback, useEffect } from 'react';
import Cropper from 'react-easy-crop';
import getCroppedImg from '@/lib/cropImage';
import { Plus, Pencil, Trash2, Package, FolderTree, FileDown, FileText } from 'lucide-react';
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

type Category = {
    id: number;
    name: string;
    slug?: string;
    image?: string | null;
    products_count?: number;
};

type Product = {
    id: number;
    category_id: number;
    category?: Category;
    name: string;
    slug: string;
    description: string | null;
    price: number;
    stock: number;
    thumbnail: string | null;
    is_active: boolean;
    images?: { id: number; path: string; sort_order: number }[];
};

type Props = {
    products: {
        data: Product[];
        links: any[];
    };
    categories: Category[];
};

export default function ProductsIndex({ products, categories }: Props) {
    const [activeTab, setActiveTab] = useState<'products' | 'categories'>('products');

    // -- Product State --
    const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [productFormData, setProductFormData] = useState({
        name: '',
        category_id: '',
        description: '',
        price: '',
        stock: '',
        is_active: true,
        images: [] as File[],
    });
    const productFileInputRef = useRef<HTMLInputElement>(null);

    // -- Category State --
    const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [categoryFormData, setCategoryFormData] = useState({
        name: '',
        image: null as File | null,
    });
    const categoryFileInputRef = useRef<HTMLInputElement>(null);

    const [errors, setErrors] = useState<any>({});

    // -- Delete Confirmation State --
    const [imageToDelete, setImageToDelete] = useState<number | null>(null);

    // -- Crop State --
    const [filesToCrop, setFilesToCrop] = useState<File[]>([]);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    const [currentCropImageUrl, setCurrentCropImageUrl] = useState<string | null>(null);

    const onCropComplete = useCallback((croppedArea: any, croppedAreaPixels: any) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    useEffect(() => {
        if (filesToCrop.length > 0) {
            const url = URL.createObjectURL(filesToCrop[0]);
            setCurrentCropImageUrl(url);
            return () => URL.revokeObjectURL(url);
        } else {
            setCurrentCropImageUrl(null);
        }
    }, [filesToCrop]);

    const handleCropSave = async () => {
        if (!filesToCrop.length || !croppedAreaPixels || !currentCropImageUrl) return;
        try {
            const currentFile = filesToCrop[0];
            const croppedFile = await getCroppedImg(
                currentCropImageUrl,
                croppedAreaPixels,
                0,
                { horizontal: false, vertical: false },
                currentFile.name
            );
            if (croppedFile) {
                setProductFormData(prev => ({
                    ...prev,
                    images: [...prev.images, croppedFile]
                }));
            }
            setFilesToCrop(prev => prev.slice(1));
            setCrop({ x: 0, y: 0 });
            setZoom(1);
        } catch (e) {
            console.error(e);
            setFilesToCrop(prev => prev.slice(1));
        }
    };

    const handleCropCancel = () => {
        setFilesToCrop(prev => prev.slice(1));
        setCrop({ x: 0, y: 0 });
        setZoom(1);
    };

    // -- Product Handlers --
    const openCreateProductDialog = () => {
        setEditingProduct(null);
        setProductFormData({
            name: '',
            category_id: categories.length > 0 ? categories[0].id.toString() : '',
            description: '',
            price: '',
            stock: '',
            is_active: true,
            images: [],
        });
        setErrors({});
        if (productFileInputRef.current) productFileInputRef.current.value = '';
        setIsProductDialogOpen(true);
    };

    const openEditProductDialog = (product: Product) => {
        setEditingProduct(product);
        setProductFormData({
            name: product.name,
            category_id: product.category_id.toString(),
            description: product.description || '',
            price: product.price.toString(),
            stock: product.stock.toString(),
            is_active: product.is_active,
            images: [],
        });
        setErrors({});
        if (productFileInputRef.current) productFileInputRef.current.value = '';
        setIsProductDialogOpen(true);
    };

    const handleProductSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        const payload = new FormData();
        payload.append('name', productFormData.name);
        payload.append('category_id', productFormData.category_id);
        payload.append('description', productFormData.description);
        payload.append('price', productFormData.price);
        payload.append('stock', productFormData.stock);
        payload.append('is_active', productFormData.is_active ? '1' : '0');
        
        if (productFormData.images && productFormData.images.length > 0) {
            productFormData.images.forEach((file, index) => {
                payload.append(`images[${index}]`, file);
            });
        }

        if (editingProduct) {
            payload.append('_method', 'PUT');
            router.post(`/admin/products/${editingProduct.id}`, payload, {
                onSuccess: () => setIsProductDialogOpen(false),
                onError: (err) => setErrors(err),
            });
        } else {
            router.post('/admin/products', payload, {
                onSuccess: () => setIsProductDialogOpen(false),
                onError: (err) => setErrors(err),
            });
        }
    };

    const handleProductDelete = (id: number) => {
        if (confirm('Apakah Anda yakin ingin menghapus produk ini?')) {
            router.delete(`/admin/products/${id}`);
        }
    };

    const handleDeleteImage = (imageId: number) => {
        setImageToDelete(imageId);
    };

    const confirmDeleteImage = () => {
        if (!imageToDelete) return;
        router.delete(`/admin/products/images/${imageToDelete}`, {
            preserveScroll: true,
            preserveState: true,
            onSuccess: (page) => {
                const updatedProducts = page.props.products as any;
                const updated = updatedProducts.data.find((p: any) => p.id === editingProduct?.id);
                if (updated) setEditingProduct(updated);
                setImageToDelete(null);
            }
        });
    };

    const handleSetPrimaryImage = (productId: number, imageId: number) => {
        router.patch(`/admin/products/${productId}/primary-image`, { image_id: imageId }, {
            preserveScroll: true,
            preserveState: true,
            onSuccess: (page) => {
                const updatedProducts = page.props.products as any;
                const updated = updatedProducts.data.find((p: any) => p.id === productId);
                if (updated) setEditingProduct(updated);
            }
        });
    };

    // -- Category Handlers --
    const openCreateCategoryDialog = () => {
        setEditingCategory(null);
        setCategoryFormData({ name: '', image: null });
        setErrors({});
        if (categoryFileInputRef.current) categoryFileInputRef.current.value = '';
        setIsCategoryDialogOpen(true);
    };

    const openEditCategoryDialog = (category: Category) => {
        setEditingCategory(category);
        setCategoryFormData({ name: category.name, image: null });
        setErrors({});
        if (categoryFileInputRef.current) categoryFileInputRef.current.value = '';
        setIsCategoryDialogOpen(true);
    };

    const handleCategorySubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        const payload = new FormData();
        payload.append('name', categoryFormData.name);
        if (categoryFormData.image) {
            payload.append('image', categoryFormData.image);
        }

        if (editingCategory) {
            payload.append('_method', 'PUT');
            router.post(`/admin/categories/${editingCategory.id}`, payload, {
                onSuccess: () => setIsCategoryDialogOpen(false),
                onError: (err) => setErrors(err),
                preserveScroll: true,
            });
        } else {
            router.post('/admin/categories', payload, {
                onSuccess: () => setIsCategoryDialogOpen(false),
                onError: (err) => setErrors(err),
                preserveScroll: true,
            });
        }
    };

    const handleCategoryDelete = (category: Category) => {
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

    return (
        <AdminLayout>
            <Head title="Kelola Produk & Kategori" />

            <div className="mb-6">
                <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
                    Katalog
                </h1>
                <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                    Atur produk dan kategori toko Anda.
                </p>
            </div>

            {/* Custom Tabs */}
            <div className="mb-6 flex gap-4 border-b border-neutral-200 dark:border-neutral-800">
                <button
                    onClick={() => setActiveTab('products')}
                    className={`pb-3 text-sm font-medium transition-colors ${
                        activeTab === 'products'
                            ? 'border-b-2 border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400'
                            : 'text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-300'
                    }`}
                >
                    Produk
                </button>
                <button
                    onClick={() => setActiveTab('categories')}
                    className={`pb-3 text-sm font-medium transition-colors ${
                        activeTab === 'categories'
                            ? 'border-b-2 border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400'
                            : 'text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-300'
                    }`}
                >
                    Kategori
                </button>
            </div>

            {activeTab === 'products' && (
                <div className="space-y-4">
                    <div className="flex justify-end gap-2">
                        <a href="/admin/products/export/pdf" target="_blank" rel="noopener noreferrer">
                            <Button variant="outline" className="gap-2 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 dark:border-red-900/50 dark:hover:bg-red-900/20">
                                <FileText className="h-4 w-4" />
                                PDF
                            </Button>
                        </a>
                        <a href="/admin/products/export/excel">
                            <Button variant="outline" className="gap-2 border-emerald-200 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 dark:border-emerald-900/50 dark:hover:bg-emerald-900/20">
                                <FileDown className="h-4 w-4" />
                                Excel
                            </Button>
                        </a>
                        <Button onClick={openCreateProductDialog} className="gap-2">
                            <Plus className="h-4 w-4" />
                            Tambah Produk
                        </Button>
                    </div>

                    <div className="rounded-2xl border border-neutral-200/80 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900/50 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-neutral-50 text-neutral-500 dark:bg-neutral-800/50 dark:text-neutral-400 border-b border-neutral-200/80 dark:border-neutral-800">
                                    <tr>
                                        <th className="px-6 py-4 font-medium">Thumbnail</th>
                                        <th className="px-6 py-4 font-medium">Nama Produk</th>
                                        <th className="px-6 py-4 font-medium">Kategori</th>
                                        <th className="px-6 py-4 font-medium">Harga</th>
                                        <th className="px-6 py-4 font-medium">Stok</th>
                                        <th className="px-6 py-4 font-medium">Status</th>
                                        <th className="px-6 py-4 font-medium text-right">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-neutral-200/80 dark:divide-neutral-800">
                                    {products.data.length === 0 ? (
                                        <tr>
                                            <td colSpan={7} className="px-6 py-8 text-center text-neutral-500">
                                                <Package className="mx-auto h-8 w-8 text-neutral-400 mb-2" />
                                                Belum ada produk yang ditambahkan.
                                            </td>
                                        </tr>
                                    ) : (
                                        products.data.map((product) => (
                                            <tr key={product.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors">
                                                <td className="px-6 py-4">
                                                    {product.thumbnail ? (
                                                        <img src={`/storage/${product.thumbnail}`} alt={product.name} className="h-10 w-10 rounded-md object-cover" />
                                                    ) : (
                                                        <div className="h-10 w-10 rounded-md bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center text-neutral-400">
                                                            <Package className="h-5 w-5" />
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 font-semibold text-neutral-900 dark:text-white">
                                                    {product.name}
                                                </td>
                                                <td className="px-6 py-4 text-neutral-500">
                                                    {product.category?.name || '-'}
                                                </td>
                                                <td className="px-6 py-4 text-neutral-500">
                                                    Rp {product.price.toLocaleString('id-ID')}
                                                </td>
                                                <td className="px-6 py-4 text-neutral-500">
                                                    {product.stock}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <Badge variant={product.is_active ? 'default' : 'secondary'}>
                                                        {product.is_active ? 'Aktif' : 'Nonaktif'}
                                                    </Badge>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <Button variant="ghost" size="sm" onClick={() => openEditProductDialog(product)}>
                                                            <Pencil className="h-4 w-4 text-neutral-500 hover:text-indigo-600" />
                                                        </Button>
                                                        <Button variant="ghost" size="sm" onClick={() => handleProductDelete(product.id)}>
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
                        {products.links && products.links.length > 3 && (
                            <div className="flex items-center justify-center p-4 border-t border-neutral-200/80 dark:border-neutral-800">
                                <div className="flex flex-wrap gap-1">
                                    {products.links.map((link, i) => (
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
                </div>
            )}

            {activeTab === 'categories' && (
                <div className="space-y-4">
                    <div className="flex justify-end">
                        <Button onClick={openCreateCategoryDialog} className="gap-2">
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
                                                        <Button variant="ghost" size="sm" onClick={() => openEditCategoryDialog(category)}>
                                                            <Pencil className="h-4 w-4 text-neutral-500 hover:text-indigo-600" />
                                                        </Button>
                                                        <Button 
                                                            variant="ghost" 
                                                            size="sm" 
                                                            onClick={() => handleCategoryDelete(category)}
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
                </div>
            )}

            {/* Product Dialog */}
            <Dialog open={isProductDialogOpen} onOpenChange={setIsProductDialogOpen}>
                <DialogContent 
                    className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto"
                    onInteractOutside={(e) => e.preventDefault()}
                >
                    <DialogHeader>
                        <DialogTitle>{editingProduct ? 'Edit Produk' : 'Tambah Produk'}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleProductSubmit} className="space-y-4 pt-4">
                        <div className="space-y-2">
                            <Label htmlFor="product-name">Nama Produk</Label>
                            <Input 
                                id="product-name" 
                                value={productFormData.name}
                                onChange={e => setProductFormData({...productFormData, name: e.target.value})}
                                placeholder="Contoh: Sepatu Sneakers"
                                required 
                            />
                            {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="category_id">Kategori</Label>
                                <select 
                                    id="category_id"
                                    className="flex h-10 w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-800 dark:bg-neutral-950 dark:ring-offset-neutral-950 dark:focus-visible:ring-neutral-300"
                                    value={productFormData.category_id}
                                    onChange={e => setProductFormData({...productFormData, category_id: e.target.value})}
                                    required
                                >
                                    <option value="" disabled>Pilih Kategori</option>
                                    {categories.map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                                {errors.category_id && <p className="text-sm text-red-500">{errors.category_id}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="price">Harga (Rp)</Label>
                                <Input 
                                    id="price" 
                                    type="number"
                                    min="0"
                                    value={productFormData.price}
                                    onChange={e => setProductFormData({...productFormData, price: e.target.value})}
                                    placeholder="Contoh: 150000"
                                    required 
                                />
                                {errors.price && <p className="text-sm text-red-500">{errors.price}</p>}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label>Galeri Gambar</Label>
                                
                                {/* Existing Images Grid (Only in Edit Mode) */}
                                {editingProduct && editingProduct.images && editingProduct.images.length > 0 && (
                                    <div className="grid grid-cols-4 gap-4 mt-2 mb-4 p-4 rounded-xl border border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900/50">
                                        {editingProduct.images.map(image => {
                                            const isPrimary = image.path === editingProduct.thumbnail;
                                            return (
                                                <div key={image.id} className={`relative group aspect-square rounded-lg overflow-hidden border-2 transition-all ${isPrimary ? 'border-indigo-600 shadow-md scale-[1.02]' : 'border-transparent'}`}>
                                                    <img src={`/storage/${image.path}`} alt="Product" className="w-full h-full object-cover bg-white" />
                                                    
                                                    {isPrimary && (
                                                        <div className="absolute top-1 left-1 bg-indigo-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow-sm z-10">
                                                            UTAMA
                                                        </div>
                                                    )}

                                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 z-20">
                                                        {!isPrimary && (
                                                            <Button 
                                                                type="button"
                                                                size="sm"
                                                                className="h-6 px-2 text-[10px] bg-white text-neutral-900 hover:bg-neutral-100 w-[85%]"
                                                                onClick={() => handleSetPrimaryImage(editingProduct.id, image.id)}
                                                            >
                                                                Jadikan Utama
                                                            </Button>
                                                        )}
                                                        <Button 
                                                            type="button"
                                                            variant="destructive"
                                                            size="sm"
                                                            className="h-6 px-2 text-[10px] w-[85%]"
                                                            onClick={() => handleDeleteImage(image.id)}
                                                        >
                                                            <Trash2 className="h-3 w-3 mr-1" /> Hapus
                                                        </Button>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                )}

                                <div className="space-y-2">
                                    <Label htmlFor="product-images" className={editingProduct && editingProduct.images && editingProduct.images.length > 0 ? "mt-4 block" : ""}>
                                        Upload Gambar Baru (Bisa lebih dari satu)
                                    </Label>
                                    <div className="flex items-center space-x-4 rounded-md border border-input bg-transparent px-3 py-1 shadow-xs h-9">
                                        <span className={`flex-1 text-sm truncate ${productFormData.images.length > 0 ? 'text-neutral-900 dark:text-neutral-100' : 'text-red-500'}`}>
                                            {productFormData.images.length > 0 ? `${productFormData.images.length} file dipilih` : 'No file chosen'}
                                        </span>
                                        <Button type="button" variant="secondary" className="h-7 text-xs shrink-0" onClick={() => productFileInputRef.current?.click()}>
                                            Choose Files
                                        </Button>
                                    </div>
                                    <Input 
                                        id="product-images" 
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        multiple
                                        onChange={e => {
                                            if (e.target.files && e.target.files.length > 0) {
                                                setFilesToCrop(Array.from(e.target.files));
                                                setCrop({ x: 0, y: 0 });
                                                setZoom(1);
                                            }
                                            if (e.target) {
                                                e.target.value = '';
                                            }
                                        }}
                                        ref={productFileInputRef}
                                    />
                                    {/* Preview of newly selected files */}
                                    {productFormData.images.length > 0 && (
                                        <div className="mt-3">
                                            <Label className="text-xs text-neutral-500 mb-2 block">Preview File Baru yang Akan Diupload:</Label>
                                            <div className="grid grid-cols-5 gap-3">
                                                {productFormData.images.map((file, index) => (
                                                    <div key={index} className="relative group aspect-square rounded-lg border border-neutral-200 overflow-hidden shadow-sm">
                                                        <img src={URL.createObjectURL(file)} alt="Preview" className="w-full h-full object-cover" />
                                                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center">
                                                            <Button 
                                                                type="button"
                                                                variant="destructive"
                                                                size="sm"
                                                                className="h-7 w-7 p-0 rounded-full shadow-md"
                                                                onClick={() => {
                                                                    const newImages = [...productFormData.images];
                                                                    newImages.splice(index, 1);
                                                                    setProductFormData({...productFormData, images: newImages});
                                                                    if (newImages.length === 0 && productFileInputRef.current) {
                                                                        productFileInputRef.current.value = '';
                                                                    }
                                                                }}
                                                            >
                                                                <Trash2 className="h-3 w-3" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Deskripsi</Label>
                            <textarea 
                                id="description" 
                                className="flex min-h-[100px] w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-800 dark:bg-neutral-950 dark:ring-offset-neutral-950 dark:focus-visible:ring-neutral-300"
                                value={productFormData.description}
                                onChange={e => setProductFormData({...productFormData, description: e.target.value})}
                                placeholder="Deskripsi detail produk..."
                            />
                            {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
                        </div>

                        <div className="flex items-center space-x-2 pt-2">
                            <input 
                                type="checkbox"
                                id="is_active"
                                className="h-4 w-4 rounded border-gray-300 text-indigo-600"
                                checked={productFormData.is_active}
                                onChange={e => setProductFormData({...productFormData, is_active: e.target.checked})}
                            />
                            <Label htmlFor="is_active">Aktif (Tampilkan di Toko)</Label>
                        </div>

                        <DialogFooter className="mt-6 pt-4 border-t border-neutral-200 dark:border-neutral-800">
                            <Button type="button" variant="outline" onClick={() => setIsProductDialogOpen(false)}>
                                Batal
                            </Button>
                            <Button type="submit">
                                {editingProduct ? 'Simpan Perubahan' : 'Tambah Produk'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Crop Dialog */}
            <Dialog open={filesToCrop.length > 0} onOpenChange={(open) => { if (!open) setFilesToCrop([]) }}>
                <DialogContent 
                    className="sm:max-w-[500px]"
                    onInteractOutside={(e) => e.preventDefault()}
                >
                    <DialogHeader>
                        <DialogTitle>Crop Gambar ({filesToCrop.length} tersisa)</DialogTitle>
                    </DialogHeader>
                    {filesToCrop.length > 0 && currentCropImageUrl && (
                        <div className="space-y-4 pt-4">
                            <div className="relative h-[300px] w-full bg-neutral-900 rounded-md overflow-hidden">
                                <Cropper
                                    image={currentCropImageUrl}
                                    crop={crop}
                                    zoom={zoom}
                                    aspect={1}
                                    onCropChange={setCrop}
                                    onCropComplete={onCropComplete}
                                    onZoomChange={setZoom}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Zoom</Label>
                                <input
                                    type="range"
                                    value={zoom}
                                    min={1}
                                    max={3}
                                    step={0.1}
                                    aria-labelledby="Zoom"
                                    onChange={(e) => setZoom(Number(e.target.value))}
                                    className="w-full accent-indigo-600"
                                />
                            </div>
                            <DialogFooter className="mt-6 pt-4 border-t border-neutral-200 dark:border-neutral-800">
                                <Button type="button" variant="outline" onClick={handleCropCancel}>
                                    Lewati
                                </Button>
                                <Button type="button" onClick={handleCropSave}>
                                    Simpan Crop
                                </Button>
                            </DialogFooter>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* Category Dialog */}
            <Dialog open={isCategoryDialogOpen} onOpenChange={setIsCategoryDialogOpen}>
                <DialogContent 
                    className="sm:max-w-[425px]"
                    onInteractOutside={(e) => e.preventDefault()}
                >
                    <DialogHeader>
                        <DialogTitle>{editingCategory ? 'Edit Kategori' : 'Tambah Kategori'}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleCategorySubmit} className="space-y-4 pt-4">
                        <div className="space-y-2">
                            <Label htmlFor="category-name">Nama Kategori</Label>
                            <Input 
                                id="category-name" 
                                value={categoryFormData.name}
                                onChange={e => setCategoryFormData({...categoryFormData, name: e.target.value})}
                                placeholder="Contoh: Pakaian Pria"
                                required 
                            />
                            {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="category-image">Gambar Kategori (Opsional)</Label>
                            <div className="flex items-center space-x-4 rounded-md border border-input bg-transparent px-3 py-1 shadow-xs h-9">
                                <span className={`flex-1 text-sm truncate ${categoryFormData.image ? 'text-neutral-900 dark:text-neutral-100' : 'text-red-500'}`}>
                                    {categoryFormData.image ? categoryFormData.image.name : 'No file chosen'}
                                </span>
                                <Button type="button" variant="secondary" className="h-7 text-xs shrink-0" onClick={() => categoryFileInputRef.current?.click()}>
                                    Choose File
                                </Button>
                            </div>
                            <Input 
                                id="category-image" 
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={e => setCategoryFormData({...categoryFormData, image: e.target.files ? e.target.files[0] : null})}
                                ref={categoryFileInputRef}
                            />
                            {errors.image && <p className="text-sm text-red-500">{errors.image}</p>}
                            {editingCategory && editingCategory.image && !categoryFormData.image && (
                                <p className="text-xs text-neutral-500 mt-1">Biarkan kosong jika tidak ingin mengubah gambar saat ini.</p>
                            )}
                        </div>

                        <DialogFooter className="mt-6 pt-4 border-t border-neutral-200 dark:border-neutral-800">
                            <Button type="button" variant="outline" onClick={() => setIsCategoryDialogOpen(false)}>
                                Batal
                            </Button>
                            <Button type="submit">
                                {editingCategory ? 'Simpan Perubahan' : 'Tambah Kategori'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Image Delete Confirmation Dialog */}
            <Dialog open={imageToDelete !== null} onOpenChange={(open) => { if (!open) setImageToDelete(null) }}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Hapus Gambar</DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                        <p className="text-sm text-neutral-500 dark:text-neutral-400">
                            Yakin ingin menghapus gambar ini? Tindakan ini tidak dapat dibatalkan.
                        </p>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setImageToDelete(null)}>
                            Batal
                        </Button>
                        <Button variant="destructive" onClick={confirmDeleteImage}>
                            Hapus
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AdminLayout>
    );
}
