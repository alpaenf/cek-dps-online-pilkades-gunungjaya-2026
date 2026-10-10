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
            'dataPhase' => $settings['data_phase'] ?? 'DPS',
            'votingHours' => $settings['voting_hours'] ?? '07.00 - 13.00 WIB',
            'mascot_badge' => $settings['mascot_badge'] ?? 'IKON SEMANGAT DEMOKRASI DESA',
            'mascot_tag' => $settings['mascot_tag'] ?? 'Burung Khas Lereng Gn. Slamet',
            'mascot_title' => $settings['mascot_title'] ?? 'Kenalkan, “GLAWU” Maskot Resmi Pilkades Gunungjaya 2026',
            'mascot_desc' => $settings['mascot_desc'] ?? 'Karakter sahabat pemilih yang ceria, berwibawa, dan sarat kearifan lokal. GLAWU hadir mengajak seluruh warga Desa Gunungjaya mewujudkan Pilkades yang aman, damai, bermartabat, dan tanpa politik uang.',
            'mascot_slogan' => $settings['mascot_slogan'] ?? '“Gunungjaya Guyub Rukun, Sukseskan Pilkades Bersama Glawu!”',
            'mascot_speeches' => ! empty($settings['mascot_speeches']) ? json_decode($settings['mascot_speeches'], true) : [
                '“Sugeng rawuh sedulur sedaya! Aja lali cek DPS-mu ya, sak swaramu nemtokake masa depan Desa Gunungjaya!”',
                '“Beda pilihan kuwi lumrah lan wajar, sing penting paseduluran lan keguyuban tetep dijaga!”',
                '“Tolak Serangan Fajar & Politik Uang! Pilih pemimpin nganggo ati nurani sing resik.”',
                '“Tanggal pencoblosan teka gasik neng TPS jam 07.00 - 13.00 WIB, nggawa e-KTP ya Lur!”',
            ],
            'mascot_filosofi' => [
                [
                    'num' => 1,
                    'title' => $settings['filosofi_1_title'] ?? 'Burung Biru Lereng Slamet',
                    'desc' => $settings['filosofi_1_desc'] ?? 'Melambangkan kecerdasan, ketajaman visi, ketangguhan, dan suara lantang warga desa dalam menyuarakan aspirasi pembangunan bersama.',
                ],
                [
                    'num' => 2,
                    'title' => $settings['filosofi_2_title'] ?? 'Blangkon & Surjan Lurik',
                    'desc' => $settings['filosofi_2_desc'] ?? 'Wujud penghormatan terhadap adat istiadat Jawa Tengah, kesantunan bertutur kata, serta kerendahan hati dalam kepemimpinan desa.',
                ],
                [
                    'num' => 3,
                    'title' => $settings['filosofi_3_title'] ?? 'Sayap Mengajak & Surat Suara',
                    'desc' => $settings['filosofi_3_desc'] ?? 'Simbol ajakan ramah agar warga aktif menggunakan hak pilihnya secara mandiri, berdaulat, dan bebas dari paksaan pihak manapun.',
                ],
                [
                    'num' => 4,
                    'title' => $settings['filosofi_4_title'] ?? 'Ekspresi Ceria & Ramah',
                    'desc' => $settings['filosofi_4_desc'] ?? 'Menegaskan bahwa Pilkades adalah pesta rakyat yang membahagiakan, menjalin kerukunan antar RT/RW, dan merajut persatuan desa.',
                ],
            ],
            'mascot_ajakan' => [
                [
                    'num' => 1,
                    'title' => $settings['ajakan_1_title'] ?? 'Cek NIK di DPT Secara Online Sekarang',
                    'desc' => $settings['ajakan_1_desc'] ?? 'Jangan menunggu hari H. Pastikan namamu sudah tertera di Daftar Pemilih Tetap (DPT) dan ketahui nomor TPS tempatmu mencoblos.',
                ],
                [
                    'num' => 2,
                    'title' => $settings['ajakan_2_title'] ?? 'Ketahui Visi, Misi, & Program Calon Kepala Desa',
                    'desc' => $settings['ajakan_2_desc'] ?? 'Pilihlah calon pemimpin yang memiliki komitmen tulus memajukan Desa Gunungjaya, transparan dalam anggaran desa, dan mengayomi seluruh warga.',
                ],
                [
                    'num' => 3,
                    'title' => $settings['ajakan_3_title'] ?? 'Tolak Segala Bentuk Politik Uang (Anti Money Politics)',
                    'desc' => $settings['ajakan_3_desc'] ?? 'Jangan gadaikan masa depan desa selama 6 tahun hanya demi nominal sesaat. Pemimpin berintegritas lahir dari pemilih yang bermartabat.',
                ],
                [
                    'num' => 4,
                    'title' => $settings['ajakan_4_title'] ?? 'Hadir Tepat Waktu di TPS (07.00 - 13.00 WIB)',
                    'desc' => $settings['ajakan_4_desc'] ?? 'Bawalah dokumen resmi (e-KTP asli / Surat Keterangan dan Surat Pemberitahuan/Model C6). Gunakan hak suaramu dan celupkan jari ke tinta!',
                ],
            ],
            'tata_nilai_netralitas' => $settings['tata_nilai_netralitas'] ?? 'Panitia Pemilihan Kepala Desa (P2KD) Gunungjaya netral, tidak berpihak kepada siapapun, dan mengabdi untuk kemaslahatan masyarakat desa.',
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

            if (! isset($tpsCounts[$tpsId])) {
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
            'lastUpdated' => now()->translatedFormat('d F Y, H:i').' WIB',
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
        $maskedNik = substr($cleanNik, 0, 4).'********'.substr($cleanNik, 12);
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

        $ticketNumber = 'P2KD-ADU-'.date('Y').'-'.rand(10000, 99999);

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
