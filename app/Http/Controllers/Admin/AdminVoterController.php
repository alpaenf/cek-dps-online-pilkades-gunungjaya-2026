<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Voter;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class AdminVoterController extends Controller
{
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'nik' => ['required', 'digits:16', 'unique:voters,nik'],
            'nama' => ['required', 'string', 'max:150'],
            'jenis_kelamin' => ['required', Rule::in(['L', 'P'])],
            'tps_id' => ['required', 'exists:tps,id'],
            'dusun' => ['nullable', 'string', 'max:100'],
            'rt' => ['nullable', 'string', 'max:10'],
            'rw' => ['nullable', 'string', 'max:10'],
            'tempat_lahir' => ['nullable', 'string', 'max:100'],
            'tanggal_lahir' => ['nullable', 'date'],
            'alamat' => ['nullable', 'string'],
            'no_kk' => ['nullable', 'digits:16'],
            'status' => ['nullable', Rule::in(['DPS', 'DPT', 'DPTb', 'DPK', 'TMS'])],
            'keterangan' => ['nullable', 'string'],
        ], [
            'nik.required' => 'Nomor NIK 16 digit wajib diisi.',
            'nik.digits' => 'NIK harus tepat 16 digit angka.',
            'nik.unique' => 'NIK sudah terdaftar dalam data pemilih.',
            'nama.required' => 'Nama lengkap pemilih wajib diisi.',
            'jenis_kelamin.required' => 'Pilih jenis kelamin (L atau P).',
            'tps_id.required' => 'Silakan pilih lokasi TPS untuk pemilih ini.',
            'tps_id.exists' => 'TPS yang dipilih tidak valid.',
        ]);

        if (empty($validated['status'])) {
            $validated['status'] = 'DPS';
        }

        Voter::create($validated);

        return redirect()->back()->with('success', "Pemilih {$validated['nama']} (NIK: {$validated['nik']}) berhasil ditambahkan ke DPS!");
    }

    public function update(Request $request, Voter $voter): RedirectResponse
    {
        $validated = $request->validate([
            'nik' => ['required', 'digits:16', Rule::unique('voters', 'nik')->ignore($voter->id)],
            'nama' => ['required', 'string', 'max:150'],
            'jenis_kelamin' => ['required', Rule::in(['L', 'P'])],
            'tps_id' => ['required', 'exists:tps,id'],
            'dusun' => ['nullable', 'string', 'max:100'],
            'rt' => ['nullable', 'string', 'max:10'],
            'rw' => ['nullable', 'string', 'max:10'],
            'tempat_lahir' => ['nullable', 'string', 'max:100'],
            'tanggal_lahir' => ['nullable', 'date'],
            'alamat' => ['nullable', 'string'],
            'no_kk' => ['nullable', 'digits:16'],
            'status' => ['nullable', Rule::in(['DPS', 'DPT', 'DPTb', 'DPK', 'TMS'])],
            'keterangan' => ['nullable', 'string'],
        ], [
            'nik.required' => 'Nomor NIK 16 digit wajib diisi.',
            'nik.digits' => 'NIK harus tepat 16 digit angka.',
            'nik.unique' => 'NIK sudah digunakan oleh pemilih lain.',
            'nama.required' => 'Nama lengkap pemilih wajib diisi.',
            'jenis_kelamin.required' => 'Pilih jenis kelamin.',
            'tps_id.required' => 'Pilih TPS untuk pemilih ini.',
        ]);

        $voter->update($validated);

        return redirect()->back()->with('success', "Data pemilih {$voter->nama} berhasil diperbarui!");
    }

    public function destroy(Voter $voter): RedirectResponse
    {
        $nama = $voter->nama;
        $voter->delete();

        return redirect()->back()->with('success', "Data pemilih {$nama} berhasil dihapus dari DPS.");
    }
}
