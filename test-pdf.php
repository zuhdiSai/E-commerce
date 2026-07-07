<?php

use App\Models\Product;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Contracts\Console\Kernel;

require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Kernel::class);
$kernel->bootstrap();

try {
    $products = Product::with('category')->latest()->get();
    $pdf = Pdf::loadView('exports.products', compact('products'));
    file_put_contents('test-output.pdf', $pdf->output());
    echo 'PDF generated successfully. Size: '.filesize('test-output.pdf');
} catch (Exception $e) {
    echo 'Error: '.$e->getMessage();
}
