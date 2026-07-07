<?php

namespace App\Exports;

use Illuminate\Contracts\View\View;
use Maatwebsite\Excel\Concerns\FromView;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;

class DashboardExport implements FromView, ShouldAutoSize
{
    protected $stats;

    public function __construct(array $stats)
    {
        $this->stats = $stats;
    }

    public function view(): View
    {
        return view('exports.dashboard_excel', ['stats' => $this->stats]);
    }
}
