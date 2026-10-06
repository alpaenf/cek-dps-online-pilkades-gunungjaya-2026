<?php

namespace App\Http\Controllers;

use App\Models\AppSetting;
use App\Models\CitizenReport;
use App\Models\SearchLog;
use App\Models\Tps;
use App\Models\Voter;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DpsSearchController extends Controller
{
    /**
     * Tampilkan Halaman Utama Cek DPS Online
     */
    public function index(): Response
    {
        $settings = AppSetting::pluck('value', 'key')->all();

        $config = [
            'nama_kegiatan' => $settings['nama_kegiatan'] ?? 'Pemilihan Kepala Desa Gunungjaya Tahun 2026',
            'desa' => $settings['desa'] ?? 'Gunungjaya',
            'kecamatan' => $settings['kecamatan'] ?? 'Belik',
            'kabupaten' => $settings['kabupaten'] ?? 'Pemalang',
            'tahun' => $settings['tahun'] ?? '2026',
            'tanggal_pemungutan' => $settings['tanggal_pemungutan'] ?? 'Senin, 9 November 2026 (Pukul 07.00 - 13.00 WIB)',
            'kontak_panitia' => $settings['kontak_panitia'] ?? 'Panitia Pemilihan Kepala Desa (P2KD) Gunungjaya',
            'whatsapp_panitia' => $settings['whatsapp_panitia'] ?? '6285226123456',
            'alamat_sekretariat' => $settings['alamat_sekretariat'] ?? 'Sekretariat P2KD - Balai Desa Gunungjaya',
            'pengumuman' => $settings['pengumuman'] ?? 'Pengecekan DPS Online telah dibuka. Pastikan NIK Anda terdaftar!',
        ];

        $tpsList = Tps::orderBy('nomor_tps')->get()->map(function ($item) {
            return [
                'tps' => $item->nomor_tps,
                'nama_lokasi' => $item->nama_lokasi,
                'alamat' => $item->alamat ?? '',
                'dusun' => $item->dusun,
                'rt' => $item->rt ?? '',
                'rw' => $item->rw ?? '',
                'keterangan' => $item->keterangan ?? '',
            ];
        });

        // Hitung Rekapitulasi Real-Time 100% Langsung dari Database MySQL (voters & tps)
        $voterCounts = Voter::where('status', '!=', 'TMS')
            ->selectRaw('tps_id, jenis_kelamin, count(*) as count')
            ->groupBy('tps_id', 'jenis_kelamin')
            ->get();

        $tpsCounts = [];
        $totalLakiLaki = 0;
        $totalPerempuan = 0;
        $totalDps = 0;

        foreach ($voterCounts as $row) {
            $tpsId = $row->tps_id ?? 0;
            $jk = strtoupper((string) $row->jenis_kelamin);
            $cnt = (int) $row->count;

            if (!isset($tpsCounts[$tpsId])) {
                $tpsCounts[$tpsId] = ['L' => 0, 'P' => 0];
            }

            if ($jk === 'L') {
                $tpsCounts[$tpsId]['L'] += $cnt;
                $totalLakiLaki += $cnt;
            } elseif ($jk === 'P') {
                $tpsCounts[$tpsId]['P'] += $cnt;
                $totalPerempuan += $cnt;
            }
            $totalDps += $cnt;
        }

        $allTps = Tps::orderBy('nomor_tps')->get();
        $tpsStats = $allTps->map(function ($tps) use ($tpsCounts) {
            $laki = $tpsCounts[$tps->id]['L'] ?? 0;
            $perempuan = $tpsCounts[$tps->id]['P'] ?? 0;
            return [
                'tps' => $tps->nomor_tps,
                'lokasi' => $tps->nama_lokasi,
                'dusun' => $tps->dusun,
                'lakiLaki' => $laki,
                'perempuan' => $perempuan,
                'total' => $laki + $perempuan,
            ];
        });

        $recapData = [
            'totalDps' => $totalDps,
            'totalLakiLaki' => $totalLakiLaki,
            'totalPerempuan' => $totalPerempuan,
            'lastUpdated' => now()->translatedFormat('d F Y, H:i') . ' WIB',
            'tpsStats' => $tpsStats,
        ];

        return Inertia::render('Home', [
            'config' => $config,
            'tpsList' => $tpsList,
            'recapData' => $recapData,
        ]);
    }

    /**
     * API / Web Pencarian NIK di MySQL
     */
    public function checkDps(Request $request): JsonResponse
    {
        $rawNik = $request->input('nik', '');
        $cleanNik = preg_replace('/\D/', '', (string) $rawNik);

        if (strlen($cleanNik) !== 16) {
            return response()->json([
                'found' => false,
                'error' => 'NIK harus terdiri dari 16 digit angka.',
            ], 400);
        }

        $voter = Voter::with('tps')->where('nik', $cleanNik)->first();

        // Audit Trail Pencarian
        $maskedNik = substr($cleanNik, 0, 4) . '********' . substr($cleanNik, 12);
        SearchLog::create([
            'nik_masked' => $maskedNik,
            'is_found' => (bool) $voter,
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
            'created_at' => now(),
        ]);

        if (! $voter) {
            return response()->json([
                'found' => false,
                'message' => 'Data NIK tidak ditemukan dalam DPS/DPT. Silakan ajukan tanggapan/sanggahan atau hubungi Panitia.',
            ]);
        }

        return response()->json([
            'found' => true,
            'nama' => $voter->nama,
            'nik_masked' => $voter->masked_nik,
            'dusun' => $voter->dusun,
            'rt' => $voter->rt,
            'rw' => $voter->rw,
            'tps' => $voter->tps ? $voter->tps->nomor_tps : "TPS {$voter->tps_id}",
            'nama_tps' => $voter->tps ? $voter->tps->nama_lokasi : '',
            'alamat_tps' => $voter->tps ? $voter->tps->alamat : '',
            'status' => $voter->status ?? 'TERDAFTAR DALAM DPS',
            'jenis_kelamin' => $voter->jenis_kelamin,
            'keterangan' => $voter->keterangan ?? '-',
        ]);
    }

    /**
     * Simpan Aduan / Sanggahan Warga
     */
    public function submitReport(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'nama' => 'required|string|max:150',
            'nik' => 'required|string|max:16',
            'whatsapp' => 'required|string|max:25',
            'kategori' => 'required|in:BELUM_TERDAFTAR,PINDAH_DOMISILI,MENINGGAL_DUNIA,DATA_GANDA,KOREKSI_DATA',
            'deskripsi' => 'required|string',
            'lampiran' => 'nullable|file|mimes:jpeg,png,jpg,pdf|max:4096',
        ]);

        $ticketNumber = 'P2KD-ADU-' . date('Y') . '-' . rand(10000, 99999);

        $filePath = null;
        if ($request->hasFile('lampiran')) {
            $filePath = $request->file('lampiran')->store('reports', 'public');
        }

        $report = CitizenReport::create([
            'ticket_number' => $ticketNumber,
            'nama' => $validated['nama'],
            'nik' => $validated['nik'],
            'whatsapp' => $validated['whatsapp'],
            'kategori' => $validated['kategori'],
            'deskripsi' => $validated['deskripsi'],
            'file_lampiran' => $filePath,
            'status' => 'PENDING',
        ]);

        return response()->json([
            'success' => true,
            'ticket_number' => $ticketNumber,
            'message' => 'Laporan tanggapan Anda berhasil diajukan kepada Panitia Pilkades Gunungjaya.',
        ]);
    }
}
