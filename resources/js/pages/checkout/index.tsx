import { Head, router } from '@inertiajs/react';
import { CreditCard, MapPin, Package, ShieldCheck, ArrowRight, CheckCircle2, Ticket, X, Wallet, Building2, QrCode, Truck } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import type { CartItemData, Address } from '@/types';

type Props = {
    cartItems: CartItemData[];
    addresses: Address[];
};

function formatPrice(price: number): string {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(price);
}

export default function CheckoutIndex({ cartItems, addresses }: Props) {
    const defaultAddressId = addresses.find(a => a.is_default)?.id || (addresses.length > 0 ? addresses[0].id : null);
    
    const [selectedAddressId, setSelectedAddressId] = useState<number | null>(defaultAddressId);
    const [isCreatingAddress, setIsCreatingAddress] = useState(addresses.length === 0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const [newAddress, setNewAddress] = useState({
        recipient_name: '',
        phone: '',
        label: 'Rumah',
        address_line: '',
        city: '',
        province: '',
        postal_code: '',
    });
    
    const [notes, setNotes] = useState('');
    
    // Payment Method
    const [paymentMethod, setPaymentMethod] = useState('bank_transfer');

    // Voucher States
    const [voucherInput, setVoucherInput] = useState('');
    const [isApplyingVoucher, setIsApplyingVoucher] = useState(false);
    const [voucherError, setVoucherError] = useState('');
    const [voucherSuccess, setVoucherSuccess] = useState('');
    const [appliedVoucher, setAppliedVoucher] = useState<{code: string, discount_amount: number} | null>(null);

    const subtotal = cartItems.reduce((acc, item) => {
        return acc + (item.product ? item.product.price * item.quantity : 0);
    }, 0);
    
    // Flat shipping fee for demo purposes
    const shippingFee = 25000;
    const discountAmount = appliedVoucher?.discount_amount || 0;
    const total = Math.max(0, subtotal - discountAmount) + shippingFee;

    const applyVoucher = async () => {
        if (!voucherInput.trim()) return;
        setIsApplyingVoucher(true);
        setVoucherError('');
        setVoucherSuccess('');

        try {
            // Get CSRF token from meta tag if available
            const token = document.head.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';
            
            const response = await fetch('/checkout/voucher/apply', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': token
                },
                body: JSON.stringify({ voucher_code: voucherInput })
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'Terjadi kesalahan saat memvalidasi voucher.');
            }
            
            setAppliedVoucher({
                code: data.voucher_code,
                discount_amount: data.discount_amount
            });
            setVoucherSuccess(data.message);
            setVoucherInput('');
        } catch (error: any) {
            setVoucherError(error.message || 'Terjadi kesalahan sistem.');
        } finally {
            setIsApplyingVoucher(false);
        }
    };

    const removeVoucher = () => {
        setAppliedVoucher(null);
        setVoucherSuccess('');
        setVoucherError('');
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        setIsSubmitting(true);
        
        const payload = isCreatingAddress 
            ? { new_address: newAddress, notes, voucher_code: appliedVoucher?.code, payment_method: paymentMethod } 
            : { address_id: selectedAddressId, notes, voucher_code: appliedVoucher?.code, payment_method: paymentMethod };
            
        router.post('/checkout', payload, {
            preserveState: true,
            onError: () => setIsSubmitting(false),
        });
    };

    return (
        <>
            <Head title="Checkout" />

            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl dark:text-white">
                        Checkout
                    </h1>
                </div>

                <div className="grid gap-8 lg:grid-cols-12 lg:items-start lg:gap-12">
                    {/* Left Column: Form */}
                    <div className="lg:col-span-8">
                        <form id="checkout-form" onSubmit={handleSubmit} className="space-y-8">
                            {/* Address Section */}
                            <section className="rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900/50">
                                <div className="mb-6 flex items-center gap-2 border-b border-neutral-100 pb-4 dark:border-neutral-800">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-800">
                                        <MapPin className="h-4 w-4 text-neutral-600 dark:text-neutral-400" />
                                    </div>
                                    <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">
                                        Alamat Pengiriman
                                    </h2>
                                </div>

                                {addresses.length > 0 && (
                                    <div className="mb-6 space-y-4">
                                        <div className="flex items-center justify-between">
                                            <Label className="text-base font-medium">Pilih Alamat</Label>
                                            <Button 
                                                type="button" 
                                                variant="ghost" 
                                                size="sm"
                                                onClick={() => setIsCreatingAddress(!isCreatingAddress)}
                                            >
                                                {isCreatingAddress ? 'Gunakan Alamat Tersimpan' : '+ Alamat Baru'}
                                            </Button>
                                        </div>

                                        {!isCreatingAddress && (
                                            <div className="grid gap-4 sm:grid-cols-2">
                                                {addresses.map((address) => (
                                                    <div 
                                                        key={address.id}
                                                        onClick={() => setSelectedAddressId(address.id)}
                                                        className={cn(
                                                            "relative cursor-pointer rounded-xl border p-4 transition-all hover:border-neutral-400 dark:hover:border-neutral-500",
                                                            selectedAddressId === address.id 
                                                                ? "border-neutral-900 bg-neutral-50 ring-1 ring-neutral-900 dark:border-white dark:bg-neutral-800/50 dark:ring-white" 
                                                                : "border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-900/30"
                                                        )}
                                                    >
                                                        {selectedAddressId === address.id && (
                                                            <div className="absolute top-4 right-4 text-neutral-900 dark:text-white">
                                                                <CheckCircle2 className="h-5 w-5" />
                                                            </div>
                                                        )}
                                                        <div className="flex items-center gap-2">
                                                            <span className="font-semibold text-neutral-900 dark:text-white">
                                                                {address.label}
                                                            </span>
                                                            {address.is_default && (
                                                                <span className="rounded-md bg-neutral-100 px-2 py-0.5 text-[10px] font-medium text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400">
                                                                    Utama
                                                                </span>
                                                            )}
                                                        </div>
                                                        <div className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
                                                            <p className="font-medium text-neutral-900 dark:text-neutral-200">{address.recipient_name}</p>
                                                            <p className="mt-1">{address.phone}</p>
                                                            <p className="mt-2 line-clamp-2">{address.address_line}</p>
                                                            <p>{address.city}, {address.province} {address.postal_code}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}

                                {isCreatingAddress && (
                                    <div className="grid gap-6 sm:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label htmlFor="recipient_name">Nama Penerima</Label>
                                            <Input 
                                                id="recipient_name" 
                                                required={isCreatingAddress}
                                                value={newAddress.recipient_name}
                                                onChange={e => setNewAddress({...newAddress, recipient_name: e.target.value})}
                                                placeholder="Budi Santoso"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="phone">Nomor Telepon</Label>
                                            <Input 
                                                id="phone" 
                                                required={isCreatingAddress}
                                                value={newAddress.phone}
                                                onChange={e => setNewAddress({...newAddress, phone: e.target.value})}
                                                placeholder="08123456789"
                                            />
                                        </div>
                                        <div className="space-y-2 sm:col-span-2">
                                            <Label htmlFor="address_line">Alamat Lengkap</Label>
                                            <Input 
                                                id="address_line" 
                                                required={isCreatingAddress}
                                                value={newAddress.address_line}
                                                onChange={e => setNewAddress({...newAddress, address_line: e.target.value})}
                                                placeholder="Jl. Merdeka No. 123, RT 01/RW 02"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="city">Kota/Kabupaten</Label>
                                            <Input 
                                                id="city" 
                                                required={isCreatingAddress}
                                                value={newAddress.city}
                                                onChange={e => setNewAddress({...newAddress, city: e.target.value})}
                                                placeholder="Jakarta Selatan"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="province">Provinsi</Label>
                                            <Input 
                                                id="province" 
                                                required={isCreatingAddress}
                                                value={newAddress.province}
                                                onChange={e => setNewAddress({...newAddress, province: e.target.value})}
                                                placeholder="DKI Jakarta"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="postal_code">Kode Pos</Label>
                                            <Input 
                                                id="postal_code" 
                                                required={isCreatingAddress}
                                                value={newAddress.postal_code}
                                                onChange={e => setNewAddress({...newAddress, postal_code: e.target.value})}
                                                placeholder="12345"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="label">Label Alamat (Opsional)</Label>
                                            <Input 
                                                id="label" 
                                                value={newAddress.label}
                                                onChange={e => setNewAddress({...newAddress, label: e.target.value})}
                                                placeholder="Rumah, Kantor, dll"
                                            />
                                        </div>
                                    </div>
                                )}
                            </section>

                            {/* Payment Method Section */}
                            <section className="rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900/50">
                                <div className="mb-6 flex items-center gap-2 border-b border-neutral-100 pb-4 dark:border-neutral-800">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-800">
                                        <CreditCard className="h-4 w-4 text-neutral-600 dark:text-neutral-400" />
                                    </div>
                                    <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">
                                        Metode Pembayaran
                                    </h2>
                                </div>
                                
                                <div className="grid gap-4 sm:grid-cols-2">
                                    {/* Bank Transfer */}
                                    <div 
                                        onClick={() => setPaymentMethod('bank_transfer')}
                                        className={cn(
                                            "relative cursor-pointer rounded-xl border p-4 transition-all hover:border-neutral-400",
                                            paymentMethod === 'bank_transfer' 
                                                ? "border-neutral-900 bg-neutral-50 ring-1 ring-neutral-900 dark:border-white dark:bg-neutral-800/50 dark:ring-white" 
                                                : "border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-900/30"
                                        )}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
                                                <Building2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-semibold text-neutral-900 dark:text-white">Transfer Bank</h3>
                                                <p className="text-xs text-neutral-500 dark:text-neutral-400">Verifikasi manual</p>
                                            </div>
                                            {paymentMethod === 'bank_transfer' && (
                                                <CheckCircle2 className="h-5 w-5 text-neutral-900 dark:text-white" />
                                            )}
                                        </div>
                                    </div>

                                    {/* E-Wallet */}
                                    <div 
                                        onClick={() => setPaymentMethod('ewallet')}
                                        className={cn(
                                            "relative cursor-pointer rounded-xl border p-4 transition-all hover:border-neutral-400",
                                            paymentMethod === 'ewallet' 
                                                ? "border-neutral-900 bg-neutral-50 ring-1 ring-neutral-900 dark:border-white dark:bg-neutral-800/50 dark:ring-white" 
                                                : "border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-900/30"
                                        )}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/30">
                                                <Wallet className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-semibold text-neutral-900 dark:text-white">E-Wallet</h3>
                                                <p className="text-xs text-neutral-500 dark:text-neutral-400">OVO, Dana, Gopay</p>
                                            </div>
                                            {paymentMethod === 'ewallet' && (
                                                <CheckCircle2 className="h-5 w-5 text-neutral-900 dark:text-white" />
                                            )}
                                        </div>
                                    </div>

                                    {/* QRIS */}
                                    <div 
                                        onClick={() => setPaymentMethod('qris')}
                                        className={cn(
                                            "relative cursor-pointer rounded-xl border p-4 transition-all hover:border-neutral-400",
                                            paymentMethod === 'qris' 
                                                ? "border-neutral-900 bg-neutral-50 ring-1 ring-neutral-900 dark:border-white dark:bg-neutral-800/50 dark:ring-white" 
                                                : "border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-900/30"
                                        )}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-pink-100 dark:bg-pink-900/30">
                                                <QrCode className="h-5 w-5 text-pink-600 dark:text-pink-400" />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-semibold text-neutral-900 dark:text-white">QRIS</h3>
                                                <p className="text-xs text-neutral-500 dark:text-neutral-400">Scan QR Code</p>
                                            </div>
                                            {paymentMethod === 'qris' && (
                                                <CheckCircle2 className="h-5 w-5 text-neutral-900 dark:text-white" />
                                            )}
                                        </div>
                                    </div>

                                    {/* COD */}
                                    <div 
                                        onClick={() => setPaymentMethod('cod')}
                                        className={cn(
                                            "relative cursor-pointer rounded-xl border p-4 transition-all hover:border-neutral-400",
                                            paymentMethod === 'cod' 
                                                ? "border-neutral-900 bg-neutral-50 ring-1 ring-neutral-900 dark:border-white dark:bg-neutral-800/50 dark:ring-white" 
                                                : "border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-900/30"
                                        )}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
                                                <Truck className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-semibold text-neutral-900 dark:text-white">Cash on Delivery</h3>
                                                <p className="text-xs text-neutral-500 dark:text-neutral-400">Bayar saat sampai</p>
                                            </div>
                                            {paymentMethod === 'cod' && (
                                                <CheckCircle2 className="h-5 w-5 text-neutral-900 dark:text-white" />
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Additional Info Section */}
                            <section className="rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900/50">
                                <div className="mb-6 flex items-center gap-2 border-b border-neutral-100 pb-4 dark:border-neutral-800">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-800">
                                        <Package className="h-4 w-4 text-neutral-600 dark:text-neutral-400" />
                                    </div>
                                    <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">
                                        Opsi Pesanan
                                    </h2>
                                </div>
                                
                                <div className="space-y-2">
                                    <Label htmlFor="notes">Catatan untuk Penjual (Opsional)</Label>
                                    <Input 
                                        id="notes" 
                                        value={notes}
                                        onChange={e => setNotes(e.target.value)}
                                        placeholder="Contoh: Tolong packing dengan aman ya."
                                    />
                                </div>
                            </section>
                        </form>
                    </div>

                    {/* Right Column: Order Summary */}
                    <div className="lg:col-span-4">
                        <div className="sticky top-24 rounded-2xl border border-neutral-200/80 bg-neutral-50/50 p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900/30">
                            <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">
                                Ringkasan Pesanan
                            </h2>
                            
                            {/* Items preview */}
                            <div className="mt-6 flex flex-col gap-4 border-b border-neutral-200/80 pb-6 dark:border-neutral-800">
                                {cartItems.map(item => item.product && (
                                    <div key={item.id} className="flex items-start gap-4">
                                        <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-neutral-200/50 bg-neutral-100 dark:border-neutral-700/50 dark:bg-neutral-800">
                                            {item.product.thumbnail ? (
                                                <img
                                                    src={item.product.thumbnail}
                                                    alt={item.product.name}
                                                    className="h-full w-full object-cover"
                                                />
                                            ) : (
                                                <div className="flex h-full w-full items-center justify-center">
                                                    <Package className="h-6 w-6 text-neutral-300 dark:text-neutral-600" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 space-y-1">
                                            <h4 className="line-clamp-2 text-sm font-medium text-neutral-900 dark:text-neutral-100">
                                                {item.product.name}
                                            </h4>
                                            <p className="text-xs text-neutral-500 dark:text-neutral-400">
                                                {item.quantity} x {formatPrice(item.product.price)}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            
                            {/* Voucher Section */}
                            <div className="mt-6 border-b border-neutral-200/80 pb-6 dark:border-neutral-800">
                                <Label className="flex items-center gap-2 mb-2 text-neutral-900 dark:text-white">
                                    <Ticket className="h-4 w-4" />
                                    Kode Voucher
                                </Label>
                                
                                {appliedVoucher ? (
                                    <div className="flex items-center justify-between rounded-lg border border-green-200 bg-green-50 p-3 dark:border-green-900/50 dark:bg-green-900/20">
                                        <div className="flex items-center gap-2">
                                            <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-500" />
                                            <div>
                                                <p className="text-sm font-medium text-green-900 dark:text-green-300">
                                                    {appliedVoucher.code} diterapkan
                                                </p>
                                                <p className="text-xs text-green-700 dark:text-green-400">
                                                    Potongan: -{formatPrice(appliedVoucher.discount_amount)}
                                                </p>
                                            </div>
                                        </div>
                                        <Button variant="ghost" size="sm" onClick={removeVoucher} className="h-8 w-8 p-0 text-green-700 hover:bg-green-200/50 hover:text-green-900 dark:text-green-400 dark:hover:bg-green-800/50">
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="flex gap-2">
                                        <Input 
                                            value={voucherInput}
                                            onChange={(e) => setVoucherInput(e.target.value.toUpperCase())}
                                            placeholder="Masukkan kode voucher"
                                            className="uppercase"
                                        />
                                        <Button 
                                            type="button" 
                                            variant="secondary" 
                                            onClick={applyVoucher}
                                            disabled={isApplyingVoucher || !voucherInput.trim()}
                                        >
                                            Terapkan
                                        </Button>
                                    </div>
                                )}
                                
                                {voucherError && (
                                    <p className="mt-2 text-sm text-red-600 dark:text-red-400">{voucherError}</p>
                                )}
                            </div>

                            <dl className="mt-6 space-y-4 text-sm text-neutral-600 dark:text-neutral-400">
                                <div className="flex items-center justify-between">
                                    <dt>Subtotal Produk</dt>
                                    <dd className="font-medium text-neutral-900 dark:text-white">
                                        {formatPrice(subtotal)}
                                    </dd>
                                </div>
                                {appliedVoucher && (
                                    <div className="flex items-center justify-between text-green-600 dark:text-green-400">
                                        <dt>Diskon Voucher</dt>
                                        <dd className="font-medium">
                                            -{formatPrice(appliedVoucher.discount_amount)}
                                        </dd>
                                    </div>
                                )}
                                <div className="flex items-center justify-between">
                                    <dt>Biaya Pengiriman</dt>
                                    <dd className="font-medium text-neutral-900 dark:text-white">
                                        {formatPrice(shippingFee)}
                                    </dd>
                                </div>
                                <div className="flex items-center justify-between border-t border-neutral-200/80 pt-4 dark:border-neutral-800">
                                    <dt className="text-base font-bold text-neutral-900 dark:text-white">
                                        Total Pembayaran
                                    </dt>
                                    <dd className="text-xl font-bold text-neutral-900 dark:text-white">
                                        {formatPrice(total)}
                                    </dd>
                                </div>
                            </dl>

                            <div className="mt-8 space-y-4">
                                <Button
                                    type="submit"
                                    form="checkout-form"
                                    size="lg"
                                    disabled={isSubmitting || (!isCreatingAddress && !selectedAddressId)}
                                    className="h-12 w-full rounded-xl text-base font-semibold shadow-md transition-all hover:shadow-lg"
                                >
                                    <ShieldCheck className="mr-2 h-5 w-5" />
                                    {isSubmitting ? 'Memproses...' : 'Buat Pesanan'}
                                </Button>
                                
                                <p className="text-center text-xs text-neutral-500 dark:text-neutral-400">
                                    Dengan membuat pesanan, Anda menyetujui Syarat & Ketentuan kami.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
