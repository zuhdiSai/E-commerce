<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Laporan Dashboard</title>
    <style>
        body { font-family: 'DejaVu Sans', sans-serif; font-size: 12px; margin-bottom: 50px; }
        table { width: 100%; border-collapse: collapse; margin-top: 10px; margin-bottom: 20px; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; font-weight: bold; }
        .no-border, .no-border td { border: none; }
        h2, h3 { text-align: center; }
        h3 { text-align: left; background: #f8f9fa; padding: 5px; border-left: 4px solid #4f46e5; margin-top: 25px; }
        .header-table { width: 100%; margin-bottom: 20px; border-bottom: 2px solid #333; padding-bottom: 10px; border: none; }
        .header-table td { border: none; padding: 0; }
        .logo-box { width: 80px; height: 80px; background: #e5e7eb; text-align: center; line-height: 80px; font-weight: bold; font-size: 14px; color: #6b7280; }
        .shop-info { padding-left: 15px; }
        .shop-name { font-size: 20px; font-weight: bold; margin: 0 0 5px 0; }
        .shop-contact { font-size: 12px; color: #555; margin: 0; }
        
        .status-selesai { color: #16a34a; font-weight: bold; }
        .status-dikirim { color: #2563eb; font-weight: bold; }
        .status-diproses { color: #d97706; font-weight: bold; }
        .status-pending { color: #6b7280; font-weight: bold; }
        .status-dibatalkan { color: #dc2626; font-weight: bold; }
        
        .total-row td { font-weight: bold; border-top: 2px solid #333; }
        
        @page { margin: 50px 50px 80px 50px; }
        footer { position: fixed; bottom: -50px; left: 0px; right: 0px; height: 30px; font-size: 10px; color: #666; text-align: center; border-top: 1px solid #ddd; padding-top: 10px; }
        .page-number:before { content: "Halaman " counter(page); }
        
        .avoid-break { page-break-inside: avoid; }
    </style>
</head>
<body>
    <footer>
        <span class="page-number"></span><br>
        Laporan ini digenerate otomatis oleh sistem {{ config('app.name', 'Toko Online') }}
    </footer>

    <table class="header-table no-border">
        <tr>
            <td width="90">
                <div class="logo-box">LOGO</div>
            </td>
            <td class="shop-info">
                <h1 class="shop-name">{{ config('app.name', 'Toko Online Kita') }}</h1>
                <p class="shop-contact">Jl. Contoh Alamat No. 123, Kota<br>Email: admin@tokokita.com | Telp: 08123456789</p>
            </td>
        </tr>
    </table>

    <h2>Laporan Ringkasan Dashboard</h2>
    <p style="text-align:center;">
        <strong>Periode Laporan:</strong> {{ \Carbon\Carbon::parse($stats['start_date'])->translatedFormat('d F Y') }} – {{ \Carbon\Carbon::parse($stats['end_date'])->translatedFormat('d F Y') }}<br>
        <span style="font-size: 10px; color: #666;">Tanggal Cetak: {{ \Carbon\Carbon::now()->translatedFormat('d F Y H:i') }}</span>
    </p>
    
    <div class="avoid-break">
        <h3>Statistik Umum</h3>
        <table>
            <thead>
                <tr>
                    <th>Total Pengguna</th>
                    <th>Total Produk</th>
                    <th>Total Pesanan</th>
                    <th>Total Pendapatan</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>{{ $stats['total_users'] }}</td>
                    <td>{{ $stats['total_products'] }}</td>
                    <td>{{ $stats['total_orders'] }}</td>
                    <td>Rp {{ number_format($stats['total_revenue'], 0, ',', '.') }}</td>
                </tr>
            </tbody>
        </table>
    </div>

    <div class="avoid-break">
        <h3>Ringkasan Status Pesanan</h3>
        <table style="width: 50%;">
            <thead>
                <tr>
                    <th>Status</th>
                    <th>Jumlah Pesanan</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td><span class="status-selesai">Selesai</span></td>
                    <td>{{ $stats['order_summary']['selesai'] ?? 0 }} pesanan</td>
                </tr>
                <tr>
                    <td><span class="status-dikirim">Dikirim</span></td>
                    <td>{{ $stats['order_summary']['dikirim'] ?? 0 }} pesanan</td>
                </tr>
                <tr>
                    <td><span class="status-diproses">Diproses</span></td>
                    <td>{{ $stats['order_summary']['diproses'] ?? 0 }} pesanan</td>
                </tr>
                <tr>
                    <td><span class="status-pending">Pending</span></td>
                    <td>{{ $stats['order_summary']['pending'] ?? 0 }} pesanan</td>
                </tr>
                @if(isset($stats['order_summary']['dibatalkan']) && $stats['order_summary']['dibatalkan'] > 0)
                <tr>
                    <td><span class="status-dibatalkan">Dibatalkan</span></td>
                    <td>{{ $stats['order_summary']['dibatalkan'] }} pesanan</td>
                </tr>
                @endif
            </tbody>
        </table>
    </div>

    <div class="avoid-break">
        <h3>Produk Terlaris (Top 5)</h3>
        <table>
            <thead>
                <tr>
                    <th>No</th>
                    <th>Nama Produk</th>
                    <th>Jumlah Terjual</th>
                    <th>Total Revenue</th>
                </tr>
            </thead>
            <tbody>
                @foreach($stats['top_products'] as $index => $product)
                <tr>
                    <td>{{ $index + 1 }}</td>
                    <td>{{ $product->name }}</td>
                    <td>{{ $product->total_sold }}</td>
                    <td>Rp {{ number_format($product->total_revenue, 0, ',', '.') }}</td>
                </tr>
                @endforeach
                @if($stats['top_products']->isEmpty())
                <tr>
                    <td colspan="4" style="text-align:center;">Belum ada data produk terjual pada periode ini.</td>
                </tr>
                @endif
            </tbody>
        </table>
    </div>

    <div>
        <h3>Rincian Pesanan</h3>
        <table>
            <thead>
                <tr>
                    <th>No</th>
                    <th>No. Pesanan</th>
                    <th>Tanggal</th>
                    <th>Pelanggan</th>
                    <th>Total (Rp)</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                @php $grandTotal = 0; @endphp
                @foreach($stats['recent_orders'] as $index => $order)
                @php $grandTotal += $order->total_amount; @endphp
                <tr>
                    <td>{{ $index + 1 }}</td>
                    <td>{{ $order->order_number }}</td>
                    <td>{{ \Carbon\Carbon::parse($order->created_at)->format('d-m-Y H:i') }}</td>
                    <td>{{ $order->user ? $order->user->name : '-' }}</td>
                    <td>{{ number_format($order->total_amount, 0, ',', '.') }}</td>
                    <td class="status-{{ strtolower($order->status) }}">{{ ucfirst($order->status) }}</td>
                </tr>
                @endforeach
                
                @if($stats['recent_orders']->isEmpty())
                <tr>
                    <td colspan="6" style="text-align:center;">Belum ada pesanan terbaru pada periode ini.</td>
                </tr>
                @else
                <tr class="total-row">
                    <td colspan="4" style="text-align:right;">Total Keseluruhan</td>
                    <td>{{ number_format($grandTotal, 0, ',', '.') }}</td>
                    <td></td>
                </tr>
                @endif
            </tbody>
        </table>
    </div>
</body>
</html>
