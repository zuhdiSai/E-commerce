<?php

namespace App\Exports;

use App\Models\Order;
use Illuminate\Contracts\View\View;
use Maatwebsite\Excel\Concerns\FromView;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;

class OrdersExport implements FromView, ShouldAutoSize
{
    public function view(): View
    {
        return view('exports.orders', [
            'orders' => Order::with('user')->latest()->get(),
        ]);
    }
}
