<table>
    <tr>
        <th colspan="4" style="font-size: 16px; font-weight: bold;">Laporan Ringkasan Dashboard</th>
    </tr>
    <tr>
        <th colspan="4">Periode Laporan: {{ \Carbon\Carbon::parse($stats['start_date'])->translatedFormat('d F Y') }} – {{ \Carbon\Carbon::parse($stats['end_date'])->translatedFormat('d F Y') }}</th>
    </tr>
    <tr>
        <th colspan="4">Tanggal Cetak: {{ \Carbon\Carbon::now()->translatedFormat('d F Y H:i') }}</th>
    </tr>
    <tr><td colspan="4"></td></tr>
    
    <tr>
        <th colspan="4" style="font-weight: bold;">Statistik Umum</th>
    </tr>
    <tr>
        <th style="font-weight: bold; background-color: #f2f2f2;">Total Pengguna</th>
        <th style="font-weight: bold; background-color: #f2f2f2;">Total Produk</th>
        <th style="font-weight: bold; background-color: #f2f2f2;">Total Pesanan</th>
        <th style="font-weight: bold; background-color: #f2f2f2;">Total Pendapatan</th>
    </tr>
    <tr>
        <td>{{ $stats['total_users'] }}</td>
        <td>{{ $stats['total_products'] }}</td>
        <td>{{ $stats['total_orders'] }}</td>
        <td>{{ $stats['total_revenue'] }}</td>
    </tr>
    
    <tr><td colspan="4"></td></tr>

    <tr>
        <th colspan="2" style="font-weight: bold;">Ringkasan Status Pesanan</th>
    </tr>
    <tr>
        <th style="font-weight: bold; background-color: #f2f2f2;">Status</th>
        <th style="font-weight: bold; background-color: #f2f2f2;">Jumlah Pesanan</th>
    </tr>
    <tr>
        <td>Selesai</td>
        <td>{{ $stats['order_summary']['selesai'] ?? 0 }}</td>
    </tr>
    <tr>
        <td>Dikirim</td>
        <td>{{ $stats['order_summary']['dikirim'] ?? 0 }}</td>
    </tr>
    <tr>
        <td>Diproses</td>
        <td>{{ $stats['order_summary']['diproses'] ?? 0 }}</td>
    </tr>
    <tr>
        <td>Pending</td>
        <td>{{ $stats['order_summary']['pending'] ?? 0 }}</td>
    </tr>
    @if(isset($stats['order_summary']['dibatalkan']) && $stats['order_summary']['dibatalkan'] > 0)
    <tr>
        <td>Dibatalkan</td>
        <td>{{ $stats['order_summary']['dibatalkan'] }}</td>
    </tr>
    @endif
    
    <tr><td colspan="4"></td></tr>

    <tr>
        <th colspan="4" style="font-weight: bold;">Produk Terlaris (Top 5)</th>
    </tr>
    <tr>
        <th style="font-weight: bold; background-color: #f2f2f2;">No</th>
        <th style="font-weight: bold; background-color: #f2f2f2;">Nama Produk</th>
        <th style="font-weight: bold; background-color: #f2f2f2;">Jumlah Terjual</th>
        <th style="font-weight: bold; background-color: #f2f2f2;">Total Revenue</th>
    </tr>
    @foreach($stats['top_products'] as $index => $product)
    <tr>
        <td>{{ $index + 1 }}</td>
        <td>{{ $product->name }}</td>
        <td>{{ $product->total_sold }}</td>
        <td>{{ $product->total_revenue }}</td>
    </tr>
    @endforeach
    @if($stats['top_products']->isEmpty())
    <tr>
        <td colspan="4">Belum ada data produk terjual pada periode ini.</td>
    </tr>
    @endif

    <tr><td colspan="4"></td></tr>

    <tr>
        <th colspan="6" style="font-weight: bold;">Rincian Pesanan</th>
    </tr>
    <tr>
        <th style="font-weight: bold; background-color: #f2f2f2;">No</th>
        <th style="font-weight: bold; background-color: #f2f2f2;">No. Pesanan</th>
        <th style="font-weight: bold; background-color: #f2f2f2;">Tanggal</th>
        <th style="font-weight: bold; background-color: #f2f2f2;">Pelanggan</th>
        <th style="font-weight: bold; background-color: #f2f2f2;">Total (Rp)</th>
        <th style="font-weight: bold; background-color: #f2f2f2;">Status</th>
    </tr>
    @php $grandTotal = 0; @endphp
    @foreach($stats['recent_orders'] as $index => $order)
    @php $grandTotal += $order->total_amount; @endphp
    <tr>
        <td>{{ $index + 1 }}</td>
        <td>{{ $order->order_number }}</td>
        <td>{{ \Carbon\Carbon::parse($order->created_at)->format('d-m-Y H:i') }}</td>
        <td>{{ $order->user ? $order->user->name : '-' }}</td>
        <td>{{ $order->total_amount }}</td>
        <td>{{ ucfirst($order->status) }}</td>
    </tr>
    @endforeach
    
    @if($stats['recent_orders']->isEmpty())
    <tr>
        <td colspan="6">Belum ada pesanan terbaru pada periode ini.</td>
    </tr>
    @else
    <tr>
        <td colspan="4" style="text-align:right; font-weight: bold;">Total Keseluruhan</td>
        <td style="font-weight: bold;">{{ $grandTotal }}</td>
        <td></td>
    </tr>
    @endif
</table>
