<?php

namespace App\Http\Controllers;

use App\Models\Address;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Display the user's profile page.
     */
    public function index(Request $request): Response
    {
        $user = $request->user();

        $addresses = $user->addresses()->latest()->get();
        $orders = $user->orders()->latest()->get();

        return Inertia::render('profile/index', [
            'addresses' => $addresses,
            'orders' => $orders,
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function updateInfo(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'lowercase', 'email', 'max:255', Rule::unique('users')->ignore($user->id)],
            'phone' => ['nullable', 'string', 'max:20'],
        ]);

        $user->fill($validated);

        if ($user->isDirty('email')) {
            $user->email_verified_at = null;
        }

        $user->save();

        return back()->with('flash', [
            'type' => 'success',
            'message' => 'Informasi profil berhasil diperbarui.',
        ]);
    }

    /**
     * Update the user's password.
     */
    public function updatePassword(Request $request)
    {
        $validated = $request->validate([
            'current_password' => ['required', 'current_password'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
        ]);

        $request->user()->update([
            'password' => Hash::make($validated['password']),
        ]);

        return back()->with('flash', [
            'type' => 'success',
            'message' => 'Kata sandi berhasil diperbarui.',
        ]);
    }

    /**
     * Store a new address.
     */
    public function storeAddress(Request $request)
    {
        $validated = $request->validate([
            'label' => 'required|string|max:100',
            'recipient_name' => 'required|string|max:255',
            'phone' => 'required|string|max:20',
            'address_line' => 'required|string',
            'city' => 'required|string|max:100',
            'province' => 'required|string|max:100',
            'postal_code' => 'required|string|max:20',
            'is_default' => 'boolean',
        ]);

        $user = $request->user();

        if ($validated['is_default'] ?? false) {
            $user->addresses()->update(['is_default' => false]);
        } else {
            // If this is their first address, make it default automatically
            if ($user->addresses()->count() === 0) {
                $validated['is_default'] = true;
            }
        }

        $user->addresses()->create($validated);

        return back()->with('flash', [
            'type' => 'success',
            'message' => 'Alamat baru berhasil ditambahkan.',
        ]);
    }

    /**
     * Update an existing address.
     */
    public function updateAddress(Request $request, Address $address)
    {
        // Ensure user owns the address
        if ($address->user_id !== $request->user()->id) {
            abort(403);
        }

        $validated = $request->validate([
            'label' => 'required|string|max:100',
            'recipient_name' => 'required|string|max:255',
            'phone' => 'required|string|max:20',
            'address_line' => 'required|string',
            'city' => 'required|string|max:100',
            'province' => 'required|string|max:100',
            'postal_code' => 'required|string|max:20',
            'is_default' => 'boolean',
        ]);

        if ($validated['is_default'] ?? false) {
            $request->user()->addresses()->where('id', '!=', $address->id)->update(['is_default' => false]);
        }

        $address->update($validated);

        return back()->with('flash', [
            'type' => 'success',
            'message' => 'Alamat berhasil diperbarui.',
        ]);
    }

    /**
     * Delete an address.
     */
    public function destroyAddress(Request $request, Address $address)
    {
        if ($address->user_id !== $request->user()->id) {
            abort(403);
        }

        $address->delete();

        return back()->with('flash', [
            'type' => 'success',
            'message' => 'Alamat berhasil dihapus.',
        ]);
    }

    /**
     * Update the user's avatar.
     */
    public function updateAvatar(Request $request)
    {
        $request->validate([
            'avatar' => ['required', 'image', 'mimes:jpg,jpeg,png', 'max:2048'],
        ]);

        $user = $request->user();

        if ($user->avatar) {
            Storage::disk('public')->delete($user->avatar);
        }

        $path = $request->file('avatar')->store('avatars', 'public');

        $user->update(['avatar' => $path]);

        return back()->with('flash', [
            'type' => 'success',
            'message' => 'Foto profil berhasil diperbarui.',
        ]);
    }

    /**
     * Remove the user's avatar.
     */
    public function destroyAvatar(Request $request)
    {
        $user = $request->user();

        if ($user->avatar) {
            Storage::disk('public')->delete($user->avatar);
            $user->update(['avatar' => null]);
        }

        return back()->with('flash', [
            'type' => 'success',
            'message' => 'Foto profil berhasil dihapus.',
        ]);
    }
}
