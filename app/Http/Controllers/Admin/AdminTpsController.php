<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Tps;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class AdminTpsController extends Controller
{
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'nomor_tps' => ['required', 'string', 'max:20', 'unique:tps,nomor_tps'],
            'nama_lokasi' => ['required', 'string', 'max:150'],
            'dusun' => ['required', 'string', 'max:100'],
            'alamat' => ['nullable', 'string'],
            'rt' => ['nullable', 'string', 'max:30'],
            'rw' => ['nullable', 'string', 'max:30'],
            'latitude' => ['nullable', 'numeric'],
            'longitude' => ['nullable', 'numeric'],
            'keterangan' => ['nullable', 'string'],
        ], [
            'nomor_tps.required' => 'Nomor TPS wajib diisi.',
            'nomor_tps.unique' => 'Nomor TPS sudah terdaftar sebelumnya.',
            'nama_lokasi.required' => 'Nama lokasi TPS wajib diisi.',
            'dusun.required' => 'Wilayah dusun wajib diisi.',
        ]);

        Tps::create($validated);

        return redirect()->back()->with('success', "Lokasi {$validated['nomor_tps']} berhasil ditambahkan!");
    }

    public function update(Request $request, Tps $tps): RedirectResponse
    {
        $validated = $request->validate([
            'nomor_tps' => ['required', 'string', 'max:20', 'unique:tps,nomor_tps,' . $tps->id],
            'nama_lokasi' => ['required', 'string', 'max:150'],
            'dusun' => ['required', 'string', 'max:100'],
            'alamat' => ['nullable', 'string'],
            'rt' => ['nullable', 'string', 'max:30'],
            'rw' => ['nullable', 'string', 'max:30'],
            'latitude' => ['nullable', 'numeric'],
            'longitude' => ['nullable', 'numeric'],
            'keterangan' => ['nullable', 'string'],
        ], [
            'nomor_tps.required' => 'Nomor TPS wajib diisi.',
            'nomor_tps.unique' => 'Nomor TPS sudah digunakan.',
            'nama_lokasi.required' => 'Nama lokasi TPS wajib diisi.',
            'dusun.required' => 'Wilayah dusun wajib diisi.',
        ]);

        $tps->update($validated);

        return redirect()->back()->with('success', "Data {$tps->nomor_tps} berhasil diperbarui!");
    }

    public function destroy(Tps $tps): RedirectResponse
    {
        $nomorTps = $tps->nomor_tps;
        $voterCount = $tps->voters()->count();

        // Jika TPS memiliki data pemilih, lepaskan relasi tps_id pemilih terlebih dahulu
        if ($voterCount > 0) {
            $tps->voters()->update(['tps_id' => null]);
        }

        $tps->delete();

        return redirect()->back()->with('success', "{$nomorTps} berhasil dihapus ({$voterCount} data pemilih dialihkan tanpa TPS).");
    }
}
