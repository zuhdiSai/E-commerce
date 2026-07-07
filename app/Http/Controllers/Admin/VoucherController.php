<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Voucher;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class VoucherController extends Controller
{
    public function index(): Response
    {
        $vouchers = Voucher::latest()->get();

        return Inertia::render('admin/vouchers/index', [
            'vouchers' => $vouchers,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'code' => 'required|string|unique:vouchers,code|max:255',
            'type' => 'required|in:percentage,fixed',
            'value' => 'required|integer|min:1',
            'min_spend' => 'nullable|integer|min:0',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'usage_limit' => 'nullable|integer|min:1',
            'is_active' => 'boolean',
        ]);

        $validated['code'] = strtoupper($validated['code']);
        $validated['min_spend'] = $validated['min_spend'] ?? 0;

        Voucher::create($validated);

        return back()->with('flash', [
            'type' => 'success',
            'message' => 'Voucher berhasil ditambahkan.',
        ]);
    }

    public function update(Request $request, Voucher $voucher): RedirectResponse
    {
        $validated = $request->validate([
            'code' => 'required|string|max:255|unique:vouchers,code,'.$voucher->id,
            'type' => 'required|in:percentage,fixed',
            'value' => 'required|integer|min:1',
            'min_spend' => 'nullable|integer|min:0',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'usage_limit' => 'nullable|integer|min:1',
            'is_active' => 'boolean',
        ]);

        $validated['code'] = strtoupper($validated['code']);
        $validated['min_spend'] = $validated['min_spend'] ?? 0;

        $voucher->update($validated);

        return back()->with('flash', [
            'type' => 'success',
            'message' => 'Voucher berhasil diperbarui.',
        ]);
    }

    public function destroy(Voucher $voucher): RedirectResponse
    {
        $voucher->delete();

        return back()->with('flash', [
            'type' => 'success',
            'message' => 'Voucher berhasil dihapus.',
        ]);
    }
}
