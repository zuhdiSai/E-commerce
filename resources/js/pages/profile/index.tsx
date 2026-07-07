import { Head, usePage, useForm, Link, router } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';
import { 
    User, Lock, MapPin, Package, LogOut, CheckCircle2, 
    Plus, Trash2, Edit, ChevronRight, SearchX, Upload
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import type { Address, OrderData } from '@/types';

type UserProp = {
    id: number;
    name: string;
    email: string;
    phone: string | null;
    avatar: string | null;
};

type Props = {
    addresses: Address[];
    orders: OrderData[];
};

export default function ProfileIndex({ addresses, orders }: Props) {
    const page = usePage<{ auth: { user: UserProp } }>();
    const user = page.props.auth.user;
    const url = page.url;
    
    const [activeTab, setActiveTab] = useState<'account' | 'password' | 'addresses' | 'orders'>('account');
    
    useEffect(() => {
        if (url.includes('?tab=')) {
            const urlParams = new URLSearchParams(url.substring(url.indexOf('?')));
            const tab = urlParams.get('tab') as 'account' | 'password' | 'addresses' | 'orders';
            if (tab && ['account', 'password', 'addresses', 'orders'].includes(tab)) {
                setActiveTab(tab);
            }
        } else if (url === '/profile' || url === '/profile/') {
            setActiveTab('account');
        }
    }, [url]);
    
    // -- Avatar State --
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(
        user.avatar ? `/storage/${user.avatar}` : null
    );
    const [isUploading, setIsUploading] = useState(false);

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 2 * 1024 * 1024) {
            alert('Ukuran file maksimal 2MB');
            return;
        }

        const previewUrl = URL.createObjectURL(file);
        setAvatarPreview(previewUrl);
        setIsUploading(true);

        router.post('/profile/avatar', {
            _method: 'post',
            avatar: file,
        }, {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                setIsUploading(false);
                // toast is handled by layout flash messages
            },
            onError: (errors) => {
                setIsUploading(false);
                alert(errors.avatar || 'Terjadi kesalahan saat mengunggah foto.');
                setAvatarPreview(user.avatar ? `/storage/${user.avatar}` : null);
            }
        });
    };

    const handleRemoveAvatar = () => {
        if (!confirm('Hapus foto profil?')) return;
        
        router.delete('/profile/avatar', {
            preserveScroll: true,
            onSuccess: () => {
                setAvatarPreview(null);
            }
        });
    };
    
    // -- Account Info Form --
    const infoForm = useForm({
        name: user.name,
        email: user.email,
        phone: user.phone || '',
    });
    
    const submitInfo = (e: React.FormEvent) => {
        e.preventDefault();
        infoForm.patch('/profile/info', {
            preserveScroll: true,
        });
    };

    // -- Password Form --
    const pwdForm = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const submitPassword = (e: React.FormEvent) => {
        e.preventDefault();
        pwdForm.patch('/profile/password', {
            preserveScroll: true,
            onSuccess: () => pwdForm.reset(),
        });
    };

    // -- Address Form State --
    const [isAddingAddress, setIsAddingAddress] = useState(false);
    const [editingAddressId, setEditingAddressId] = useState<number | null>(null);
    const addrForm = useForm({
        label: '',
        recipient_name: '',
        phone: '',
        address_line: '',
        city: '',
        province: '',
        postal_code: '',
        is_default: false,
    });

    const openAddAddress = () => {
        addrForm.reset();
        setEditingAddressId(null);
        setIsAddingAddress(true);
    };

    const openEditAddress = (address: Address) => {
        addrForm.setData({
            label: address.label,
            recipient_name: address.recipient_name,
            phone: address.phone,
            address_line: address.address_line,
            city: address.city,
            province: address.province,
            postal_code: address.postal_code,
            is_default: address.is_default,
        });
        setEditingAddressId(address.id);
        setIsAddingAddress(true);
    };

    const submitAddress = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingAddressId) {
            addrForm.put(`/profile/addresses/${editingAddressId}`, {
                preserveScroll: true,
                onSuccess: () => setIsAddingAddress(false),
            });
        } else {
            addrForm.post('/profile/addresses', {
                preserveScroll: true,
                onSuccess: () => setIsAddingAddress(false),
            });
        }
    };

    const deleteAddress = (id: number) => {
        if (confirm('Apakah Anda yakin ingin menghapus alamat ini?')) {
            router.delete(`/profile/addresses/${id}`, { preserveScroll: true });
        }
    };



    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);
    };

    const formatDate = (dateString: string) => {
        return new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(dateString));
    };

    // Get initials for avatar
    const getInitials = (name: string) => {
        return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    };

    return (
        <>
            <Head title="Profil Saya" />

            <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl dark:text-white">
                        Profil Saya
                    </h1>
                </div>

                <div className="flex flex-col gap-8">
                    {/* Main Content Area */}
                    <div className="w-full">
                        {/* === ACCOUNT TAB === */}
                        {activeTab === 'account' && (
                            <div className="rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-sm sm:p-8 dark:border-neutral-800 dark:bg-neutral-900/50">
                                <h2 className="mb-6 text-xl font-semibold text-neutral-900 dark:text-white">Informasi Akun</h2>
                                
                                <div className="mb-8 flex items-center gap-6">
                                    <div className="relative flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-full bg-neutral-900 text-3xl font-bold text-white shadow-inner dark:bg-white dark:text-neutral-900">
                                        {avatarPreview ? (
                                            <img src={avatarPreview} alt={user.name} className="h-full w-full object-cover" />
                                        ) : (
                                            getInitials(user.name)
                                        )}
                                    </div>
                                    <div>
                                        <input 
                                            type="file" 
                                            ref={fileInputRef} 
                                            className="hidden" 
                                            accept="image/jpeg, image/png, image/jpg" 
                                            onChange={handleAvatarChange} 
                                        />
                                        <div className="flex gap-2">
                                            <Button 
                                                type="button"
                                                variant="outline" 
                                                size="sm" 
                                                className="gap-2"
                                                onClick={() => fileInputRef.current?.click()}
                                                disabled={isUploading}
                                            >
                                                <Upload className="h-4 w-4" />
                                                {isUploading ? 'Mengunggah...' : 'Ubah Foto'}
                                            </Button>
                                            {user.avatar && (
                                                <Button 
                                                    type="button"
                                                    variant="ghost" 
                                                    size="sm"
                                                    onClick={handleRemoveAvatar}
                                                    className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
                                                >
                                                    Hapus
                                                </Button>
                                            )}
                                        </div>
                                        <p className="mt-2 text-xs text-neutral-500 dark:text-neutral-400">
                                            Format JPG atau PNG. Maks 2MB.
                                        </p>
                                    </div>
                                </div>

                                <form onSubmit={submitInfo} className="space-y-6">
                                    <div className="grid gap-6 sm:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label htmlFor="name">Nama Lengkap</Label>
                                            <Input
                                                id="name"
                                                value={infoForm.data.name}
                                                onChange={e => infoForm.setData('name', e.target.value)}
                                                required
                                            />
                                            {infoForm.errors.name && <p className="text-sm text-red-500">{infoForm.errors.name}</p>}
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="email">Alamat Email</Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                value={infoForm.data.email}
                                                onChange={e => infoForm.setData('email', e.target.value)}
                                                required
                                            />
                                            {infoForm.errors.email && <p className="text-sm text-red-500">{infoForm.errors.email}</p>}
                                        </div>
                                        <div className="space-y-2 sm:col-span-1">
                                            <Label htmlFor="phone">Nomor Telepon</Label>
                                            <Input
                                                id="phone"
                                                value={infoForm.data.phone}
                                                onChange={e => infoForm.setData('phone', e.target.value)}
                                                placeholder="Contoh: 08123456789"
                                            />
                                            {infoForm.errors.phone && <p className="text-sm text-red-500">{infoForm.errors.phone}</p>}
                                        </div>
                                    </div>
                                    <div className="flex justify-end pt-4">
                                        <Button type="submit" disabled={infoForm.processing} className="w-full sm:w-auto">
                                            {infoForm.processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                                        </Button>
                                    </div>
                                </form>
                            </div>
                        )}

                        {/* === PASSWORD TAB === */}
                        {activeTab === 'password' && (
                            <div className="rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-sm sm:p-8 dark:border-neutral-800 dark:bg-neutral-900/50">
                                <h2 className="mb-6 text-xl font-semibold text-neutral-900 dark:text-white">Ubah Kata Sandi</h2>
                                
                                <form onSubmit={submitPassword} className="space-y-6">
                                    <div className="space-y-2 sm:max-w-md">
                                        <Label htmlFor="current_password">Kata Sandi Saat Ini</Label>
                                        <Input
                                            id="current_password"
                                            type="password"
                                            value={pwdForm.data.current_password}
                                            onChange={e => pwdForm.setData('current_password', e.target.value)}
                                            required
                                        />
                                        {pwdForm.errors.current_password && <p className="text-sm text-red-500">{pwdForm.errors.current_password}</p>}
                                    </div>
                                    <div className="grid gap-6 sm:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label htmlFor="password">Kata Sandi Baru</Label>
                                            <Input
                                                id="password"
                                                type="password"
                                                value={pwdForm.data.password}
                                                onChange={e => pwdForm.setData('password', e.target.value)}
                                                required
                                            />
                                            {pwdForm.errors.password && <p className="text-sm text-red-500">{pwdForm.errors.password}</p>}
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="password_confirmation">Konfirmasi Kata Sandi Baru</Label>
                                            <Input
                                                id="password_confirmation"
                                                type="password"
                                                value={pwdForm.data.password_confirmation}
                                                onChange={e => pwdForm.setData('password_confirmation', e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="flex justify-end pt-4">
                                        <Button type="submit" disabled={pwdForm.processing} className="w-full sm:w-auto">
                                            {pwdForm.processing ? 'Menyimpan...' : 'Perbarui Kata Sandi'}
                                        </Button>
                                    </div>
                                </form>
                            </div>
                        )}

                        {/* === ADDRESSES TAB === */}
                        {activeTab === 'addresses' && (
                            <div className="rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-sm sm:p-8 dark:border-neutral-800 dark:bg-neutral-900/50">
                                <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                    <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">Buku Alamat</h2>
                                    {!isAddingAddress && (
                                        <Button onClick={openAddAddress} size="sm" className="gap-2 shrink-0">
                                            <Plus className="h-4 w-4" />
                                            Tambah Alamat
                                        </Button>
                                    )}
                                </div>

                                {isAddingAddress ? (
                                    <form onSubmit={submitAddress} className="rounded-xl border border-neutral-200/80 bg-neutral-50/50 p-6 dark:border-neutral-800 dark:bg-neutral-900/30 space-y-6">
                                        <h3 className="font-semibold text-neutral-900 dark:text-white">
                                            {editingAddressId ? 'Edit Alamat' : 'Alamat Baru'}
                                        </h3>
                                        <div className="grid gap-6 sm:grid-cols-2">
                                            <div className="space-y-2">
                                                <Label htmlFor="recipient_name">Nama Penerima</Label>
                                                <Input id="recipient_name" required value={addrForm.data.recipient_name} onChange={e => addrForm.setData('recipient_name', e.target.value)} />
                                                {addrForm.errors.recipient_name && <p className="text-sm text-red-500">{addrForm.errors.recipient_name}</p>}
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="phone">Nomor Telepon</Label>
                                                <Input id="phone" required value={addrForm.data.phone} onChange={e => addrForm.setData('phone', e.target.value)} />
                                                {addrForm.errors.phone && <p className="text-sm text-red-500">{addrForm.errors.phone}</p>}
                                            </div>
                                            <div className="space-y-2 sm:col-span-2">
                                                <Label htmlFor="address_line">Alamat Lengkap</Label>
                                                <Input id="address_line" required value={addrForm.data.address_line} onChange={e => addrForm.setData('address_line', e.target.value)} />
                                                {addrForm.errors.address_line && <p className="text-sm text-red-500">{addrForm.errors.address_line}</p>}
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="city">Kota/Kabupaten</Label>
                                                <Input id="city" required value={addrForm.data.city} onChange={e => addrForm.setData('city', e.target.value)} />
                                                {addrForm.errors.city && <p className="text-sm text-red-500">{addrForm.errors.city}</p>}
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="province">Provinsi</Label>
                                                <Input id="province" required value={addrForm.data.province} onChange={e => addrForm.setData('province', e.target.value)} />
                                                {addrForm.errors.province && <p className="text-sm text-red-500">{addrForm.errors.province}</p>}
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="postal_code">Kode Pos</Label>
                                                <Input id="postal_code" required value={addrForm.data.postal_code} onChange={e => addrForm.setData('postal_code', e.target.value)} />
                                                {addrForm.errors.postal_code && <p className="text-sm text-red-500">{addrForm.errors.postal_code}</p>}
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="label">Label (opsional)</Label>
                                                <Input id="label" placeholder="Rumah, Kantor" value={addrForm.data.label} onChange={e => addrForm.setData('label', e.target.value)} />
                                                {addrForm.errors.label && <p className="text-sm text-red-500">{addrForm.errors.label}</p>}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 mt-4">
                                            <input 
                                                type="checkbox" 
                                                id="is_default" 
                                                className="h-4 w-4 rounded border-gray-300"
                                                checked={addrForm.data.is_default}
                                                onChange={e => addrForm.setData('is_default', e.target.checked)}
                                            />
                                            <Label htmlFor="is_default">Jadikan sebagai alamat utama</Label>
                                        </div>
                                        <div className="flex gap-3 justify-end pt-4 border-t border-neutral-200 dark:border-neutral-800">
                                            <Button type="button" variant="ghost" onClick={() => setIsAddingAddress(false)}>Batal</Button>
                                            <Button type="submit" disabled={addrForm.processing}>Simpan Alamat</Button>
                                        </div>
                                    </form>
                                ) : (
                                    <div className="space-y-4">
                                        {addresses.length === 0 ? (
                                            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-neutral-300 py-12 dark:border-neutral-700">
                                                <MapPin className="mb-4 h-10 w-10 text-neutral-300 dark:text-neutral-600" />
                                                <p className="text-sm text-neutral-500 dark:text-neutral-400">Belum ada alamat tersimpan.</p>
                                            </div>
                                        ) : (
                                            addresses.map(address => (
                                                <div key={address.id} className="relative rounded-xl border border-neutral-200/80 p-5 dark:border-neutral-800">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <span className="font-semibold text-neutral-900 dark:text-white">{address.label}</span>
                                                        {address.is_default && (
                                                            <span className="rounded bg-neutral-900 px-2 py-0.5 text-[10px] font-medium text-white dark:bg-white dark:text-neutral-900">
                                                                Utama
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="text-sm text-neutral-600 dark:text-neutral-400 space-y-1">
                                                        <p className="font-medium text-neutral-900 dark:text-neutral-200">{address.recipient_name} ({address.phone})</p>
                                                        <p>{address.address_line}</p>
                                                        <p>{address.city}, {address.province} {address.postal_code}</p>
                                                    </div>
                                                    <div className="absolute top-5 right-5 flex gap-2">
                                                        <button onClick={() => openEditAddress(address)} className="text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors">
                                                            <Edit className="h-4 w-4" />
                                                        </button>
                                                        <button onClick={() => deleteAddress(address.id)} className="text-neutral-400 hover:text-red-500 transition-colors">
                                                            <Trash2 className="h-4 w-4" />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* === ORDERS TAB === */}
                        {activeTab === 'orders' && (
                            <div className="rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-sm sm:p-8 dark:border-neutral-800 dark:bg-neutral-900/50">
                                <h2 className="mb-6 text-xl font-semibold text-neutral-900 dark:text-white">Riwayat Pesanan</h2>
                                
                                {orders.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-neutral-300 py-16 dark:border-neutral-700">
                                        <SearchX className="mb-4 h-12 w-12 text-neutral-300 dark:text-neutral-600" />
                                        <h3 className="mb-1 font-semibold text-neutral-900 dark:text-white">Belum ada pesanan</h3>
                                        <p className="mb-6 text-sm text-neutral-500 dark:text-neutral-400">Anda belum pernah melakukan pemesanan.</p>
                                        <Link href="/products">
                                            <Button>Mulai Belanja</Button>
                                        </Link>
                                    </div>
                                ) : (
                                    <div className="overflow-hidden rounded-xl border border-neutral-200/80 dark:border-neutral-800">
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-left text-sm">
                                                <thead className="bg-neutral-50 dark:bg-neutral-900/50">
                                                    <tr>
                                                        <th className="px-4 py-3 font-medium text-neutral-900 dark:text-white">No. Order</th>
                                                        <th className="px-4 py-3 font-medium text-neutral-900 dark:text-white">Tanggal</th>
                                                        <th className="px-4 py-3 font-medium text-neutral-900 dark:text-white">Total</th>
                                                        <th className="px-4 py-3 font-medium text-neutral-900 dark:text-white">Status</th>
                                                        <th className="px-4 py-3"></th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-neutral-200/80 dark:divide-neutral-800">
                                                    {orders.map((order) => (
                                                        <tr key={order.id} className="transition-colors hover:bg-neutral-50/50 dark:hover:bg-neutral-900/30">
                                                            <td className="px-4 py-4 font-medium text-neutral-900 dark:text-neutral-200">{order.order_number}</td>
                                                            <td className="px-4 py-4 text-neutral-500 dark:text-neutral-400">{formatDate(order.created_at)}</td>
                                                            <td className="px-4 py-4 font-medium text-neutral-900 dark:text-neutral-200">{formatPrice(order.total_amount)}</td>
                                                            <td className="px-4 py-4">
                                                                <span className={cn(
                                                                    "inline-flex items-center rounded-full px-2 py-1 text-xs font-medium",
                                                                    order.status === 'pending' ? "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400" :
                                                                    order.status === 'processing' ? "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400" :
                                                                    order.status === 'completed' ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400" :
                                                                    "bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-400"
                                                                )}>
                                                                    {order.status === 'pending' ? 'Menunggu' :
                                                                     order.status === 'processing' ? 'Diproses' :
                                                                     order.status === 'completed' ? 'Selesai' : order.status}
                                                                </span>
                                                            </td>
                                                            <td className="px-4 py-4 text-right">
                                                                <Link href={`/orders/${order.id}`}>
                                                                    <Button variant="ghost" size="sm" className="h-8">
                                                                        Detail <ChevronRight className="ml-1 h-4 w-4" />
                                                                    </Button>
                                                                </Link>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
