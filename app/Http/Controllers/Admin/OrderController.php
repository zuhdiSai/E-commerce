<?php

namespace App\Http\Controllers\Admin;

use App\Exports\OrdersExport;
use App\Http\Controllers\Controller;
use App\Models\Order;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;
use Maatwebsite\Excel\Facades\Excel;

class OrderController extends Controller
{
    /**
     * Display a listing of the orders.
     */
    public function index(Request $request): Response
    {
        $orders = Order::with('user')->latest()->paginate(10);

        return Inertia::render('admin/orders/index', [
            'orders' => $orders,
        ]);
    }

    /**
     * Display the specified order.
     */
    public function show(Order $order): Response
    {
        $order->load(['user', 'address', 'items.product']);

        return Inertia::render('admin/orders/show', [
            'order' => $order,
        ]);
    }

    /**
     * Update the specified order in storage.
     */
    public function update(Request $request, Order $order)
    {
        $validated = $request->validate([
            'status' => ['required', Rule::in(['pending', 'diproses', 'dikirim', 'selesai', 'dibatalkan'])],
        ]);

        $order->update([
            'status' => $validated['status'],
        ]);

        return back()->with('flash', [
            'type' => 'success',
            'message' => 'Status pesanan berhasil diperbarui.',
        ]);
    }

    /**
     * Export orders to PDF or Excel.
     */
    public function export($format)
    {
        if ($format === 'excel') {
            return Excel::download(new OrdersExport, 'orders.xlsx');
        }

        if ($format === 'pdf') {
            $orders = Order::with('user')->latest()->get();
            $pdf = Pdf::loadView('exports.orders', compact('orders'));

            return $pdf->stream('orders.pdf');
        }

        abort(404);
    }

    /**
     * Remove the specified order from storage.
     */
    public function destroy(Order $order): RedirectResponse
    {
        $order->delete();

        return back()->with('flash', [
            'type' => 'success',
            'message' => 'Pesanan berhasil dihapus.',
        ]);
    }

    /**
     * Remove the specified orders from storage.
     */
    public function bulkDestroy(Request $request): RedirectResponse
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'integer|exists:orders,id',
        ]);

        Order::whereIn('id', $request->ids)->delete();

        return back()->with('flash', [
            'type' => 'success',
            'message' => 'Pesanan yang dipilih berhasil dihapus.',
        ]);
    }
}
