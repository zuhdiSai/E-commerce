<?php

namespace Database\Seeders;

use App\Models\Address;
use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Category;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class EcommerceSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database with e-commerce data.
     */
    public function run(): void
    {
        // ─── Categories ─────────────────────────────────────────────
        $categoriesData = [
            'Kaos & T-Shirt',
            'Jaket & Hoodie',
            'Celana',
            'Sepatu & Sneakers',
            'Elektronik & Gadget',
        ];

        $categories = collect($categoriesData)->map(function (string $name) {
            return Category::create([
                'name' => $name,
                'slug' => Str::slug($name),
            ]);
        });

        // ─── Products ───────────────────────────────────────────────
        /** @var array<string, array{category: string, items: list<array{name: string, price: int, stock: int, desc: string}>}> */
        $productsByCategory = [
            'Kaos & T-Shirt' => [
                ['name' => 'Kaos Polos Cotton Combed 30s', 'price' => 89_000, 'stock' => 150, 'desc' => 'Kaos polos premium bahan cotton combed 30s, lembut dan adem. Cocok untuk daily wear maupun custom printing. Tersedia dalam berbagai ukuran S hingga XXL.'],
                ['name' => 'T-Shirt Oversize Street Style', 'price' => 129_000, 'stock' => 85, 'desc' => 'T-shirt oversize dengan desain street style kekinian. Bahan tebal 24s yang tidak mudah melar. Potongan boxy fit untuk tampilan kasual yang trendy.'],
                ['name' => 'Kaos Henley Lengan Panjang', 'price' => 149_000, 'stock' => 60, 'desc' => 'Kaos henley dengan 3 kancing dan lengan panjang. Material katun bambu yang breathable dan ramah lingkungan. Pas untuk gaya semi-formal santai.'],
                ['name' => 'Kaos Raglan Baseball Dua Warna', 'price' => 99_000, 'stock' => 120, 'desc' => 'Kaos raglan baseball klasik dengan kombinasi dua warna. Bahan cotton combed yang nyaman dipakai seharian. Desain timeless yang tidak pernah ketinggalan zaman.'],
            ],
            'Jaket & Hoodie' => [
                ['name' => 'Hoodie Fleece Premium Unisex', 'price' => 259_000, 'stock' => 45, 'desc' => 'Hoodie fleece tebal dengan kualitas premium. Bahan lembut di dalam, hangat untuk cuaca dingin. Dilengkapi kantong kanguru dan tali hoodie adjustable.'],
                ['name' => 'Jaket Bomber Parasut Anti Air', 'price' => 349_000, 'stock' => 30, 'desc' => 'Jaket bomber dengan bahan parasut water-resistant. Cocok untuk riding maupun hangout. Dilengkapi inner mesh untuk sirkulasi udara yang baik.'],
                ['name' => 'Windbreaker Packable Ultralight', 'price' => 199_000, 'stock' => 70, 'desc' => 'Windbreaker super ringan yang bisa dilipat menjadi saku sendiri. Ideal untuk travelling dan aktivitas outdoor. Tahan angin dan gerimis ringan.'],
                ['name' => 'Varsity Jacket Wool Blend', 'price' => 459_000, 'stock' => 25, 'desc' => 'Varsity jacket bergaya American classic. Badan dari wool blend, lengan dari PU leather. Snap button premium dengan bordir logo eksklusif.'],
            ],
            'Celana' => [
                ['name' => 'Celana Chino Slim Fit', 'price' => 189_000, 'stock' => 90, 'desc' => 'Celana chino slim fit dari bahan twill stretch yang nyaman. Potongan modern dengan sedikit stretch untuk kebebasan gerak. Cocok untuk kerja maupun casual.'],
                ['name' => 'Jogger Pants Training Sport', 'price' => 159_000, 'stock' => 100, 'desc' => 'Jogger pants untuk olahraga dan casual. Bahan dryfit yang cepat kering dan menyerap keringat. Elastic waistband dengan tali dan rib di ankle.'],
                ['name' => 'Cargo Pants Tactical 6 Pocket', 'price' => 229_000, 'stock' => 55, 'desc' => 'Cargo pants dengan 6 kantong fungsional. Bahan ripstop yang kuat dan tahan lama. Desain tactical modern untuk gaya adventure dan daily wear.'],
                ['name' => 'Celana Pendek Boardshort Pantai', 'price' => 129_000, 'stock' => 80, 'desc' => 'Celana pendek boardshort untuk pantai dan aktivitas air. Quick-dry fabric dengan mesh inner. Motif tropical yang fresh dan eye-catching.'],
            ],
            'Sepatu & Sneakers' => [
                ['name' => 'Sneakers Canvas Classic Low', 'price' => 299_000, 'stock' => 65, 'desc' => 'Sneakers canvas klasik dengan desain low-top timeless. Sol rubber vulkanisir yang tahan lama. Ringan dan nyaman untuk pemakaian sehari-hari.'],
                ['name' => 'Running Shoes Mesh Breathable', 'price' => 449_000, 'stock' => 40, 'desc' => 'Sepatu lari dengan upper mesh breathable dan teknologi cushioning di midsole. Outsole karet dengan pola grip multidirectional. Ultra ringan hanya 230 gram.'],
                ['name' => 'Slip On Suede Casual', 'price' => 249_000, 'stock' => 50, 'desc' => 'Sepatu slip on dari bahan suede sintetis berkualitas. Tanpa tali untuk kemudahan pemakaian. Insole memory foam yang empuk untuk kenyamanan ekstra.'],
                ['name' => 'Boots Chelsea Kulit Sintetis', 'price' => 389_000, 'stock' => 35, 'desc' => 'Boots Chelsea dengan bahan kulit sintetis premium. Elastic side panel untuk kemudahan pakai-lepas. Sol karet anti-slip dengan heel 3cm untuk postur lebih baik.'],
            ],
            'Elektronik & Gadget' => [
                ['name' => 'TWS Earbuds Bluetooth 5.3 ANC', 'price' => 349_000, 'stock' => 80, 'desc' => 'True wireless earbuds dengan Bluetooth 5.3 dan Active Noise Cancelling. Battery life hingga 30 jam dengan charging case. IPX5 waterproof untuk olahraga.'],
                ['name' => 'Smartwatch Fitness Tracker AMOLED', 'price' => 599_000, 'stock' => 45, 'desc' => 'Smartwatch dengan layar AMOLED 1.4 inci yang tajam. Fitur lengkap: heart rate, SpO2, sleep tracking, 100+ sport modes. Battery tahan hingga 7 hari.'],
                ['name' => 'Power Bank 10000mAh Fast Charging', 'price' => 199_000, 'stock' => 120, 'desc' => 'Power bank kapasitas 10000mAh dengan fast charging 22.5W. Desain slim dan ringan mudah dibawa. Dual output USB-A dan USB-C, LED indicator sisa daya.'],
                ['name' => 'Mechanical Keyboard TKL RGB', 'price' => 459_000, 'stock' => 35, 'desc' => 'Mechanical keyboard tenkeyless (TKL) 87 keys. Switch hot-swappable dengan RGB per-key backlight. Keycaps PBT doubleshot, koneksi USB-C detachable cable.'],
            ],
        ];

        $products = collect();
        foreach ($productsByCategory as $categoryName => $items) {
            $category = $categories->firstWhere('name', $categoryName);

            foreach ($items as $item) {
                $product = Product::create([
                    'category_id' => $category->id,
                    'name' => $item['name'],
                    'slug' => Str::slug($item['name']),
                    'description' => $item['desc'],
                    'price' => $item['price'],
                    'stock' => $item['stock'],
                    'is_active' => true,
                ]);

                // Create 2-4 gallery images per product
                $imageCount = rand(2, 4);
                for ($i = 0; $i < $imageCount; $i++) {
                    ProductImage::create([
                        'product_id' => $product->id,
                        'path' => 'products/'.$product->slug.'-'.($i + 1).'.jpg',
                        'sort_order' => $i,
                    ]);
                }

                $products->push($product);
            }
        }

        // ─── Users with Addresses ───────────────────────────────────
        $users = User::factory(5)->create();

        $users->each(function (User $user) {
            // Each user gets 1-2 addresses
            Address::factory()
                ->for($user)
                ->default()
                ->create();

            if (rand(0, 1)) {
                Address::factory()
                    ->for($user)
                    ->create(['label' => 'Kantor']);
            }
        });

        // ─── Carts with Items ───────────────────────────────────────
        $users->take(3)->each(function (User $user) use ($products) {
            $cart = Cart::create(['user_id' => $user->id]);

            $cartProducts = $products->random(rand(1, 4));
            foreach ($cartProducts as $product) {
                CartItem::create([
                    'cart_id' => $cart->id,
                    'product_id' => $product->id,
                    'quantity' => rand(1, 3),
                ]);
            }
        });

        // ─── Orders with Items ──────────────────────────────────────
        $statuses = ['pending', 'diproses', 'dikirim', 'selesai', 'dibatalkan'];

        $users->each(function (User $user) use ($products, $statuses) {
            $orderCount = rand(1, 3);
            $address = $user->addresses()->first();

            for ($i = 0; $i < $orderCount; $i++) {
                $order = Order::create([
                    'user_id' => $user->id,
                    'address_id' => $address?->id,
                    'order_number' => 'ORD-'.strtoupper(Str::random(8)),
                    'status' => $statuses[array_rand($statuses)],
                    'total_amount' => 0,
                ]);

                $orderProducts = $products->random(rand(1, 3));
                $totalAmount = 0;

                foreach ($orderProducts as $product) {
                    $quantity = rand(1, 2);
                    $subtotal = $product->price * $quantity;
                    $totalAmount += $subtotal;

                    OrderItem::create([
                        'order_id' => $order->id,
                        'product_id' => $product->id,
                        'product_name' => $product->name, // snapshot
                        'product_price' => $product->price, // snapshot
                        'quantity' => $quantity,
                        'subtotal' => $subtotal,
                    ]);
                }

                $order->update(['total_amount' => $totalAmount]);
            }
        });
    }
}
