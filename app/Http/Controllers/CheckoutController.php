<?php

namespace App\Http\Controllers;

use App\Models\Address;
use App\Models\Order;
use App\Models\Voucher;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class CheckoutController extends Controller
{
    /**
     * Display the checkout page.
     */
    public function index(Request $request): Response
    {
        $user = $request->user();
        $cart = $user->cart()->with('items.product')->first();

        if (! $cart || $cart->items->isEmpty()) {
            return redirect()->route('cart.index');
        }

        $items = $cart->items->map(function ($item) {
            return [
                'id' => $item->id,
                'quantity' => $item->quantity,
                'product' => $item->product ? [
                    'id' => $item->product->id,
                    'name' => $item->product->name,
                    'slug' => $item->product->slug,
                    'price' => $item->product->price,
                    'stock' => $item->product->stock,
                    'thumbnail' => $item->product->thumbnail,
                ] : null,
            ];
        })->filter(fn ($item) => $item['product'] !== null)->values();

        $addresses = $user->addresses()->orderByDesc('is_default')->get();

        return Inertia::render('checkout/index', [
            'cartItems' => $items,
            'addresses' => $addresses,
        ]);
    }

    /**
     * Validate and apply a voucher.
     */
    public function applyVoucher(Request $request)
    {
        $request->validate([
            'voucher_code' => 'required|string',
        ]);

        $user = $request->user();
        $cart = $user->cart()->with('items.product')->first();
        if (! $cart || $cart->items->isEmpty()) {
            return response()->json(['error' => 'Keranjang kosong.'], 400);
        }

        $subtotal = 0;
        foreach ($cart->items as $item) {
            if ($item->product) {
                $subtotal += $item->product->price * $item->quantity;
            }
        }

        $voucher = Voucher::where('code', strtoupper($request->voucher_code))
            ->where('is_active', true)
            ->first();

        if (! $voucher) {
            return response()->json(['error' => 'Voucher tidak valid atau tidak ditemukan.'], 400);
        }

        if ($voucher->start_date && now()->lt($voucher->start_date)) {
            return response()->json(['error' => 'Voucher belum berlaku.'], 400);
        }

        if ($voucher->end_date && now()->gt($voucher->end_date)) {
            return response()->json(['error' => 'Voucher sudah kadaluarsa.'], 400);
        }

        if ($voucher->usage_limit !== null && $voucher->used_count >= $voucher->usage_limit) {
            return response()->json(['error' => 'Kuota voucher sudah habis.'], 400);
        }

        if ($subtotal < $voucher->min_spend) {
            return response()->json(['error' => 'Minimal belanja tidak terpenuhi (Rp '.number_format($voucher->min_spend, 0, ',', '.').').'], 400);
        }

        $discount = 0;
        if ($voucher->type === 'fixed') {
            $discount = min($voucher->value, $subtotal);
        } else {
            $discount = min(intval($subtotal * ($voucher->value / 100)), $subtotal);
        }

        return response()->json([
            'message' => 'Voucher berhasil diterapkan!',
            'voucher_code' => $voucher->code,
            'discount_amount' => $discount,
            'new_total' => $subtotal - $discount,
        ]);
    }

    /**
     * Place the order.
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'address_id' => 'nullable|exists:addresses,id',
            'new_address' => 'required_without:address_id|nullable|array',
            'new_address.recipient_name' => 'required_with:new_address|string|max:255',
            'new_address.phone' => 'required_with:new_address|string|max:20',
            'new_address.address_line' => 'required_with:new_address|string|max:500',
            'new_address.city' => 'required_with:new_address|string|max:255',
            'new_address.province' => 'required_with:new_address|string|max:255',
            'new_address.postal_code' => 'required_with:new_address|string|max:10',
            'new_address.label' => 'nullable|string|max:50',
            'notes' => 'nullable|string|max:500',
            'voucher_code' => 'nullable|string',
            'payment_method' => 'required|string|in:cod,bank_transfer,ewallet,qris',
        ]);

        $user = $request->user();
        $cart = $user->cart()->with('items.product')->first();

        if (! $cart || $cart->items->isEmpty()) {
            return redirect()->route('cart.index')->with('flash', [
                'type' => 'error',
                'message' => 'Keranjang kosong.',
            ]);
        }

        // Resolve address
        $addressId = $request->input('address_id');

        if (! $addressId && $request->has('new_address')) {
            $newAddr = $request->input('new_address');
            $address = Address::create([
                'user_id' => $user->id,
                'label' => $newAddr['label'] ?? 'Rumah',
                'recipient_name' => $newAddr['recipient_name'],
                'phone' => $newAddr['phone'],
                'address_line' => $newAddr['address_line'],
                'city' => $newAddr['city'],
                'province' => $newAddr['province'],
                'postal_code' => $newAddr['postal_code'],
                'is_default' => $user->addresses()->count() === 1,
            ]);
            $addressId = $address->id;
        }

        // Verify address belongs to user
        if ($addressId) {
            $addressExists = $user->addresses()->where('id', $addressId)->exists();
            if (! $addressExists) {
                abort(403);
            }
        }

        // Calculate totals and create order in a transaction to prevent race conditions
        try {
            DB::beginTransaction();

            $subtotal = 0;
            $orderItemsData = [];

            foreach ($cart->items as $item) {
                // Lock the product row for update to prevent negative stock in race conditions
                $product = App\Models\Product::where('id', $item->product_id)->lockForUpdate()->first();

                if (! $product || $product->stock < $item->quantity) {
                    DB::rollBack();

                    return back()->with('flash', [
                        'type' => 'error',
                        'message' => "Stok {$item->product?->name} tidak mencukupi.",
                    ]);
                }

                $itemSubtotal = $product->price * $item->quantity;
                $subtotal += $itemSubtotal;

                $orderItemsData[] = [
                    'product_id' => $product->id,
                    'product_name' => $product->name,
                    'product_price' => $product->price,
                    'quantity' => $item->quantity,
                    'subtotal' => $itemSubtotal,
                ];
            }

            $discount = 0;
            $voucherCode = $request->input('voucher_code');
            $appliedVoucher = null;

            if ($voucherCode) {
                // Lock the voucher to prevent usage limit bypass
                $appliedVoucher = Voucher::where('code', strtoupper($voucherCode))
                    ->where('is_active', true)
                    ->lockForUpdate()
                    ->first();

                if ($appliedVoucher) {
                    // Re-validate voucher rules
                    $valid = true;
                    if ($appliedVoucher->start_date && now()->lt($appliedVoucher->start_date)) {
                        $valid = false;
                    }
                    if ($appliedVoucher->end_date && now()->gt($appliedVoucher->end_date)) {
                        $valid = false;
                    }
                    if ($appliedVoucher->usage_limit !== null && $appliedVoucher->used_count >= $appliedVoucher->usage_limit) {
                        $valid = false;
                    }
                    if ($subtotal < $appliedVoucher->min_spend) {
                        $valid = false;
                    }

                    if ($valid) {
                        if ($appliedVoucher->type === 'fixed') {
                            $discount = min($appliedVoucher->value, $subtotal);
                        } else {
                            $discount = min(intval($subtotal * ($appliedVoucher->value / 100)), $subtotal);
                        }
                    } else {
                        $appliedVoucher = null;
                        $voucherCode = null;
                    }
                } else {
                    $voucherCode = null;
                }
            }

            $totalAmount = max(0, $subtotal - $discount);

            $order = Order::create([
                'user_id' => $user->id,
                'address_id' => $addressId,
                'order_number' => 'ORD-'.strtoupper(Str::random(8)),
                'status' => 'pending',
                'total_amount' => $totalAmount,
                'notes' => $request->input('notes'),
                'voucher_code' => $voucherCode,
                'discount_amount' => $discount,
                'payment_method' => $request->input('payment_method'),
                'payment_status' => 'unpaid',
            ]);

            foreach ($orderItemsData as $itemData) {
                $order->items()->create($itemData);
            }

            // Reduce stock
            foreach ($orderItemsData as $itemData) {
                App\Models\Product::where('id', $itemData['product_id'])->decrement('stock', $itemData['quantity']);
            }

            // Increment voucher usage
            if ($appliedVoucher) {
                $appliedVoucher->increment('used_count');
            }

            // Clear cart
            $cart->items()->delete();

            DB::commit();

            return redirect()->route('checkout.success', $order->order_number)->with('flash', [
                'type' => 'success',
                'message' => 'Pesanan berhasil dibuat!',
            ]);
        } catch (\Exception $e) {
            DB::rollBack();

            return back()->with('flash', [
                'type' => 'error',
                'message' => 'Terjadi kesalahan saat memproses pesanan. Silakan coba lagi.',
            ]);
        }
    }

    /**
     * Display order success page.
     */
    public function success(Request $request, string $orderNumber): Response
    {
        $order = Order::where('order_number', $orderNumber)
            ->where('user_id', $request->user()->id)
            ->with(['items', 'address'])
            ->firstOrFail();

        return Inertia::render('checkout/success', [
            'order' => $order,
        ]);
    }
}
