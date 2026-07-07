<?php

namespace App\Http\Controllers\Admin;

use App\Exports\UsersExport;
use App\Http\Controllers\Controller;
use App\Models\User;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Maatwebsite\Excel\Facades\Excel;

class UserController extends Controller
{
    /**
     * Display a listing of the users.
     */
    public function index(): Response
    {
        $users = User::latest()->get();

        return Inertia::render('admin/users/index', [
            'users' => $users,
        ]);
    }

    /**
     * Update the role of the specified user.
     */
    public function updateRole(Request $request, User $user)
    {
        $validated = $request->validate([
            'role' => 'required|in:admin,customer',
        ]);

        // Prevent admin from changing their own role
        if ($user->id === $request->user()->id) {
            return back()->with('flash', [
                'type' => 'error',
                'message' => 'Anda tidak dapat mengubah role akun Anda sendiri.',
            ]);
        }

        $user->update([
            'role' => $validated['role'],
        ]);

        return back()->with('flash', [
            'type' => 'success',
            'message' => 'Role pengguna berhasil diperbarui.',
        ]);
    }

    /**
     * Update the specified user's basic info.
     */
    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,'.$user->id,
        ]);

        $user->update($validated);

        return back()->with('flash', [
            'type' => 'success',
            'message' => 'Data pengguna berhasil diperbarui.',
        ]);
    }

    /**
     * Remove the specified user.
     */
    public function destroy(Request $request, User $user)
    {
        if ($user->id === $request->user()->id) {
            return back()->with('flash', [
                'type' => 'error',
                'message' => 'Anda tidak dapat menghapus akun Anda sendiri.',
            ]);
        }

        $user->delete();

        return back()->with('flash', [
            'type' => 'success',
            'message' => 'Pengguna berhasil dihapus.',
        ]);
    }

    /**
     * Export users to PDF or Excel.
     */
    public function export($format)
    {
        if ($format === 'excel') {
            return Excel::download(new UsersExport, 'users.xlsx');
        }

        if ($format === 'pdf') {
            $users = User::latest()->get();
            $pdf = Pdf::loadView('exports.users', compact('users'));

            return $pdf->stream('users.pdf');
        }

        abort(404);
    }
}
