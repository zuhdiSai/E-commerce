<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Informasi Toko
    |--------------------------------------------------------------------------
    |
    | Data terpusat informasi toko yang digunakan di seluruh aplikasi:
    | halaman Kontak, Footer, PDF laporan, dll.
    |
    */

    'name' => env('APP_NAME', 'Store'),

    'description' => 'Destinasi belanja fashion dan gaya hidup terpercaya. Temukan produk berkualitas dengan harga terbaik untuk kebutuhan Anda sehari-hari.',

    'address' => env('STORE_ADDRESS', 'Jl. Contoh Alamat No. 123, Jakarta Selatan, DKI Jakarta 12345'),

    'phone' => env('STORE_PHONE', '+6281234567890'),

    'whatsapp' => env('STORE_WHATSAPP', '6281234567890'),

    'email' => env('STORE_EMAIL', 'info@store.com'),

    'hours' => env('STORE_HOURS', 'Senin - Sabtu, 09:00 - 17:00 WIB'),

    'social' => [
        'instagram' => env('STORE_INSTAGRAM', '#'),
        'facebook' => env('STORE_FACEBOOK', '#'),
        'twitter' => env('STORE_TWITTER', '#'),
    ],

    'about' => [
        'founded' => '2024',
        'short' => 'Kami adalah toko online yang berkomitmen menyediakan produk-produk berkualitas tinggi dengan harga yang terjangkau untuk semua kalangan.',
        'story' => 'Berawal dari kecintaan terhadap dunia fashion dan gaya hidup, kami mendirikan toko ini pada tahun 2024 dengan satu misi sederhana: membuat produk berkualitas mudah dijangkau oleh semua orang. Dari garasi kecil, kami terus berkembang berkat kepercayaan pelanggan yang luar biasa.',
        'mission' => 'Misi kami adalah menjadi destinasi belanja online terpercaya yang mengutamakan kualitas produk, pelayanan prima, dan pengalaman berbelanja yang menyenangkan. Kami percaya bahwa setiap orang berhak mendapatkan produk terbaik tanpa harus mengorbankan anggaran.',
    ],

];
