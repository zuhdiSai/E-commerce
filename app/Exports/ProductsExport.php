<?php

namespace App\Exports;

use App\Models\Product;
use Illuminate\Contracts\View\View;
use Maatwebsite\Excel\Concerns\FromView;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;

class ProductsExport implements FromView, ShouldAutoSize
{
    public function view(): View
    {
        return view('exports.products', [
            'products' => Product::with('category')->latest()->get(),
        ]);
    }
}
