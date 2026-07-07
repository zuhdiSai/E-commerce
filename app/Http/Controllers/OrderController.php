<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class OrderController extends Controller
{
    /**
     * Display the specified order.
     */
    public function show(Request $request, Order $order): Response
    {
        // Ensure user owns the order
        if ($order->user_id !== $request->user()->id) {
            abort(403);
        }

        // Load relationships needed for the view
        $order->load(['items', 'address']);

        return Inertia::render('orders/show', [
            'order' => $order,
        ]);
    }
}
