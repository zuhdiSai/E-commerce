<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Product;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CartController extends Controller
{
    /**
     * Display the cart page.
     */
    public function index(Request $request): Response
    {
        $cart = $request->user()->cart()->with('items.product.category')->first();

        $items = $cart ? $cart->items->map(function (CartItem $item) {
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
                    'category' => $item->product->category,
                ] : null,
            ];
        })->filter(fn ($item) => $item['product'] !== null)->values() : collect();

        return Inertia::render('cart/index', [
            'cartItems' => $items,
        ]);
    }

    /**
     * Add a product to the cart.
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:1',
        ]);

        $product = Product::findOrFail((int) $request->input('product_id'));

        if ($product->stock < $request->input('quantity')) {
            return back()->with('flash', [
                'type' => 'error',
                'message' => 'Stok tidak mencukupi.',
            ]);
        }

        $cart = $request->user()->cart ?? Cart::create(['user_id' => $request->user()->id]);

        $existingItem = $cart->items()->where('product_id', $product->id)->first();

        if ($existingItem) {
            $newQty = $existingItem->quantity + $request->input('quantity');
            if ($newQty > $product->stock) {
                return back()->with('flash', [
                    'type' => 'error',
                    'message' => 'Jumlah melebihi stok yang tersedia.',
                ]);
            }
            $existingItem->update(['quantity' => $newQty]);
        } else {
            $cart->items()->create([
                'product_id' => $product->id,
                'quantity' => $request->input('quantity'),
            ]);
        }

        return back()->with('flash', [
            'type' => 'success',
            'message' => "{$product->name} berhasil ditambahkan ke keranjang.",
        ]);
    }

    /**
     * Update item quantity.
     */
    public function update(Request $request, CartItem $cartItem): RedirectResponse
    {
        $request->validate([
            'quantity' => 'required|integer|min:1',
        ]);

        // Ensure the cart item belongs to the current user
        $cart = $request->user()->cart;
        if (! $cart || $cartItem->cart_id !== $cart->id) {
            abort(403);
        }

        if ($cartItem->product && $request->input('quantity') > $cartItem->product->stock) {
            return back()->with('flash', [
                'type' => 'error',
                'message' => 'Jumlah melebihi stok yang tersedia.',
            ]);
        }

        $cartItem->quantity = (int) $request->input('quantity');
        $cartItem->save();

        return back()->with('flash', [
            'type' => 'success',
            'message' => 'Jumlah berhasil diperbarui.',
        ]);
    }

    /**
     * Remove an item from the cart.
     */
    public function destroy(Request $request, CartItem $cartItem): RedirectResponse
    {
        $cart = $request->user()->cart;
        if (! $cart || $cartItem->cart_id !== $cart->id) {
            abort(403);
        }

        $name = $cartItem->product?->name ?? 'Produk';
        /** @var \Illuminate\Database\Eloquent\Model $cartItem */
        $cartItem->delete();

        return back()->with('flash', [
            'type' => 'success',
            'message' => "{$name} dihapus dari keranjang.",
        ]);
    }
}
