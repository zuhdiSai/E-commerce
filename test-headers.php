<?php

use App\Http\Controllers\Admin\ProductController;
use Illuminate\Contracts\Console\Kernel;
use Illuminate\Http\Request;

require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Kernel::class);
$kernel->bootstrap();

$request = Request::create('/admin/products/export/pdf', 'GET');
// We need to bypass auth or just test the method directly.
$controller = new ProductController;
$response = $controller->export('pdf');
echo "Headers:\n";
foreach ($response->headers->all() as $name => $values) {
    echo $name.': '.implode(', ', $values)."\n";
}
