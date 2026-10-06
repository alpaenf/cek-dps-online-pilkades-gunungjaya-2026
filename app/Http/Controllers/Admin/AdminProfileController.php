<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AppSetting;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class AdminProfileController extends Controller
{
    public function edit(Request $request): Response
    {
        $user = $request->user();
        $whatsappPanitia = AppSetting::get('whatsapp_panitia', '6285226123456');

        return Inertia::render('Admin/Profile', [
            'adminUser' => [
                'name' => $user->name,
                'email' => $user->email,
            ],
            'whatsappPanitia' => (string) $whatsappPanitia,
            'status' => session('status'),
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $user = $request->user();

        $validated = $request->validate([
            'email' => [
                'required',
                'string',
                'email',
                'max:255',
                Rule::unique('users', 'email')->ignore($user->id),
            ],
            'whatsapp_panitia' => [
                'required',
                'string',
                'min:9',
                'max:20',
            ],
            'current_password' => [
                'nullable',
                'required_with:new_password',
                'current_password',
            ],
            'new_password' => [
                'nullable',
                'string',
                'min:8',
                'confirmed',
            ],
        ], [
            'email.required' => 'Alamat email wajib diisi.',
            'email.email' => 'Format email tidak valid.',
            'email.unique' => 'Alamat email sudah digunakan oleh pengguna lain.',
            'whatsapp_panitia.required' => 'Nomor WhatsApp wajib diisi.',
            'whatsapp_panitia.min' => 'Nomor WhatsApp minimal 9 digit angka.',
            'current_password.required_with' => 'Masukkan kata sandi saat ini untuk mengubah kata sandi.',
            'current_password.current_password' => 'Kata sandi saat ini tidak cocok.',
            'new_password.min' => 'Kata sandi baru minimal 8 karakter.',
            'new_password.confirmed' => 'Konfirmasi kata sandi baru tidak cocok.',
        ]);

        // 1. Update Email
        $user->email = $validated['email'];

        // 2. Update Password jika pengguna mengisinya
        if (! empty($validated['new_password'])) {
            $user->password = Hash::make($validated['new_password']);
        }

        $user->save();

        // 3. Update Nomor WhatsApp di AppSetting (database)
        $cleanPhone = preg_replace('/\D/', '', $validated['whatsapp_panitia']);
        AppSetting::set('whatsapp_panitia', $cleanPhone, 'text', 'Nomor WhatsApp Resmi Panitia Pilkades');

        return redirect()->route('admin.profile.edit')->with('success', 'Pengaturan nomor WhatsApp, email, dan password berhasil disimpan!');
    }
}
