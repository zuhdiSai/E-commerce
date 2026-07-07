<?php

use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\ContactMessageController;
use App\Http\Controllers\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Admin\UserController as AdminUserController;
use App\Http\Controllers\Admin\VoucherController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\PageController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ProfileController;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/', [HomeController::class, 'index'])->name('home');

// Public pages
Route::get('/tentang-kami', [PageController::class, 'about'])->name('about');
Route::get('/kebijakan-privasi', [PageController::class, 'privacyPolicy'])->name('policies.privacy');
Route::get('/syarat-ketentuan', [PageController::class, 'termsConditions'])->name('policies.terms');
Route::get('/pengembalian-barang', [PageController::class, 'returnPolicy'])->name('policies.returns');
Route::get('/kontak', [ContactController::class, 'index'])->name('contact');
Route::post('/kontak', [ContactController::class, 'store'])->name('contact.store')->middleware('throttle:5,1');

// Product catalog (public)
Route::get('/products', [ProductController::class, 'index'])->name('products.index');
Route::get('/products/{slug}', [ProductController::class, 'show'])->name('products.show');

// Protected routes (requires login)
Route::middleware(['auth'])->group(function () {
    Route::get('dashboard', function (Request $request) {
        /** @var User $user */
        $user = $request->user();
        if ($user->isAdmin()) {
            return redirect()->route('admin.dashboard');
        }

        return redirect()->route('profile.index');
    })->name('dashboard');

    // Admin Routes
    Route::middleware(['admin'])->prefix('admin')->name('admin.')->group(function () {
        Route::get('/dashboard', [AdminDashboardController::class, 'index'])->name('dashboard');
        Route::get('/users/export/{format}', [AdminUserController::class, 'export'])->name('users.export');
        Route::get('/users', [AdminUserController::class, 'index'])->name('users.index');
        Route::put('/users/{user}', [AdminUserController::class, 'update'])->name('users.update');
        Route::delete('/users/{user}', [AdminUserController::class, 'destroy'])->name('users.destroy');
        Route::patch('/users/{user}/role', [AdminUserController::class, 'updateRole'])->name('users.role.update');
        Route::resource('vouchers', VoucherController::class)->except(['create', 'show', 'edit']);

        Route::get('/view-as-customer', function () {
            session(['view_as_customer' => true]);

            return redirect('/');
        })->name('view-as-customer.enter');

        Route::get('/exit-view-as-customer', function () {
            session()->forget('view_as_customer');

            return redirect()->route('admin.dashboard');
        })->name('view-as-customer.exit');

        Route::get('/dashboard/export/{format}', [AdminDashboardController::class, 'export'])->name('dashboard.export');

        Route::get('/products/export/{format}', [App\Http\Controllers\Admin\ProductController::class, 'export'])->name('products.export');
        Route::delete('/products/images/{image}', [App\Http\Controllers\Admin\ProductController::class, 'destroyImage'])->name('products.images.destroy');
        Route::patch('/products/{product}/primary-image', [App\Http\Controllers\Admin\ProductController::class, 'setPrimaryImage'])->name('products.primary-image.update');
        Route::resource('products', App\Http\Controllers\Admin\ProductController::class)->except(['show', 'create', 'edit']);

        Route::resource('categories', CategoryController::class)->except(['show', 'create', 'edit']);

        Route::get('/orders/export/{format}', [App\Http\Controllers\Admin\OrderController::class, 'export'])->name('orders.export');
        Route::delete('/orders/bulk', [App\Http\Controllers\Admin\OrderController::class, 'bulkDestroy'])->name('orders.bulk-destroy');
        Route::resource('orders', App\Http\Controllers\Admin\OrderController::class)->only(['index', 'show', 'update', 'destroy']);

        Route::resource('contact-messages', ContactMessageController::class)->only(['index', 'show', 'destroy']);
    });

    // Cart
    Route::get('/cart', [CartController::class, 'index'])->name('cart.index');
    Route::post('/cart', [CartController::class, 'store'])->name('cart.store');
    Route::patch('/cart/{cartItem}', [CartController::class, 'update'])->name('cart.update');
    Route::delete('/cart/{cartItem}', [CartController::class, 'destroy'])->name('cart.destroy');

    // Checkout
    Route::get('/checkout', [CheckoutController::class, 'index'])->name('checkout.index');
    Route::post('/checkout', [CheckoutController::class, 'store'])->name('checkout.store')->middleware('throttle:30,1');
    Route::post('/checkout/voucher/apply', [CheckoutController::class, 'applyVoucher'])->name('checkout.voucher.apply');
    Route::get('/order/success/{order_number}', [CheckoutController::class, 'success'])->name('checkout.success');

    // Profile & Addresses
    Route::get('/profile', [ProfileController::class, 'index'])->name('profile.index');
    Route::patch('/profile/info', [ProfileController::class, 'updateInfo'])->name('profile.updateInfo');
    Route::patch('/profile/password', [ProfileController::class, 'updatePassword'])->name('profile.updatePassword');
    Route::post('/profile/avatar', [ProfileController::class, 'updateAvatar'])->name('profile.avatar.update');
    Route::delete('/profile/avatar', [ProfileController::class, 'destroyAvatar'])->name('profile.avatar.destroy');
    Route::post('/profile/addresses', [ProfileController::class, 'storeAddress'])->name('profile.addresses.store');
    Route::put('/profile/addresses/{address}', [ProfileController::class, 'updateAddress'])->name('profile.addresses.update');
    Route::delete('/profile/addresses/{address}', [ProfileController::class, 'destroyAddress'])->name('profile.addresses.destroy');

    // Orders
    Route::get('/orders/{order}', [OrderController::class, 'show'])->name('orders.show');
});

require __DIR__.'/settings.php';
