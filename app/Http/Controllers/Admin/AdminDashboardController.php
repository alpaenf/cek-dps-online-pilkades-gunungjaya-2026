<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AppSetting;
use App\Models\ImportDuplicateVoter;
use App\Models\PendingSkippedVoter;
use App\Models\Tps;
use App\Models\Voter;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AdminDashboardController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->input('search');
        $tpsFilter = $request->input('tps_id');
        $genderFilter = $request->input('gender');
        $activeTab = $request->input('tab', 'dps'); // 'dps', 'tps', 'redaksi', 'terlewat', 'ganda'

        // Statistik Utama Real-Time dari Database
        $totalTps = Tps::count();
        $totalDps = Voter::count();
        $totalL = Voter::where('jenis_kelamin', 'L')->count();
        $totalP = Voter::where('jenis_kelamin', 'P')->count();

        // Data Pemilih Terlewat / Draf Belum Lengkap
        $pendingSkippedVoters = PendingSkippedVoter::with('tps:id,nomor_tps,nama_lokasi,dusun')
            ->orderBy('row_number', 'asc')
            ->get();
        $pendingSkippedCount = $pendingSkippedVoters->count();

        // Data NIK Ganda Hasil Import Terakhir
        $importDuplicateVoters = ImportDuplicateVoter::with('tps:id,nomor_tps,nama_lokasi,dusun')
            ->orderBy('row_number', 'asc')
            ->get();
        $importDuplicateCount = $importDuplicateVoters->count();

        // Daftar TPS dengan agregasi pemilih
        $tpsList = Tps::withCount([
            'voters as total_voters',
            'voters as total_laki_laki' => fn ($q) => $q->where('jenis_kelamin', 'L'),
            'voters as total_perempuan' => fn ($q) => $q->where('jenis_kelamin', 'P'),
        ])->orderBy('nomor_tps')->get();

        // Query Daftar Pemilih Sementara (DPS)
        $votersQuery = Voter::with('tps:id,nomor_tps,nama_lokasi,dusun');

        if ($search) {
            $votersQuery->where(function ($q) use ($search) {
                $q->where('nama', 'like', "%{$search}%")
                    ->orWhere('nik', 'like', "%{$search}%")
                    ->orWhere('dusun', 'like', "%{$search}%");
            });
        }

        if ($tpsFilter && $tpsFilter !== 'all') {
            $votersQuery->where('tps_id', $tpsFilter);
        }

        if ($genderFilter && $genderFilter !== 'all') {
            $votersQuery->where('jenis_kelamin', $genderFilter);
        }

        $voters = $votersQuery->orderBy('id', 'desc')->paginate(15)->withQueryString();

        $allTpsOptions = Tps::select('id', 'nomor_tps', 'nama_lokasi', 'dusun')
            ->orderBy('nomor_tps')
            ->get();

        $desa = AppSetting::get('desa', 'Gunungjaya');
        $kecamatan = AppSetting::get('kecamatan', 'Belik');
        $kabupaten = AppSetting::get('kabupaten', 'Pemalang');
        $tahun = AppSetting::get('tahun', '2026');

        $allSettings = AppSetting::pluck('value', 'key')->all();
        $speeches = ! empty($allSettings['mascot_speeches'])
            ? json_decode($allSettings['mascot_speeches'], true)
            : null;
        if (! is_array($speeches) || empty($speeches)) {
            $speeches = [
                '“Sugeng rawuh sedulur sedaya! Aja lali cek DPS-mu ya, sak swaramu nemtokake masa depan Desa Gunungjaya!”',
                '“Beda pilihan kuwi lumrah lan wajar, sing penting paseduluran lan keguyuban tetep dijaga!”',
                '“Tolak Serangan Fajar & Politik Uang! Pilih pemimpin nganggo ati nurani sing resik.”',
                '“Tanggal pencoblosan teka gasik neng TPS jam 07.00 - 13.00 WIB, nggawa e-KTP ya Lur!”',
            ];
        }

        $mascotSettings = [
            'mascot_badge' => $allSettings['mascot_badge'] ?? 'IKON SEMANGAT DEMOKRASI DESA',
            'mascot_tag' => $allSettings['mascot_tag'] ?? 'Burung Khas Lereng Gn. Slamet',
            'mascot_title' => $allSettings['mascot_title'] ?? 'Kenalkan, “GLAWU” Maskot Resmi Pilkades Gunungjaya 2026',
            'mascot_desc' => $allSettings['mascot_desc'] ?? 'Karakter sahabat pemilih yang ceria, berwibawa, dan sarat kearifan lokal. GLAWU hadir mengajak seluruh warga Desa Gunungjaya mewujudkan Pilkades yang aman, damai, bermartabat, dan tanpa politik uang.',
            'mascot_slogan' => $allSettings['mascot_slogan'] ?? '“Gunungjaya Guyub Rukun, Sukseskan Pilkades Bersama Glawu!”',
            'mascot_speeches' => implode("\n", $speeches),
            'filosofi_1_title' => $allSettings['filosofi_1_title'] ?? 'Burung Biru Lereng Slamet',
            'filosofi_1_desc' => $allSettings['filosofi_1_desc'] ?? 'Melambangkan kecerdasan, ketajaman visi, ketangguhan, dan suara lantang warga desa dalam menyuarakan aspirasi pembangunan bersama.',
            'filosofi_2_title' => $allSettings['filosofi_2_title'] ?? 'Blangkon & Surjan Lurik',
            'filosofi_2_desc' => $allSettings['filosofi_2_desc'] ?? 'Wujud penghormatan terhadap adat istiadat Jawa Tengah, kesantunan bertutur kata, serta kerendahan hati dalam kepemimpinan desa.',
            'filosofi_3_title' => $allSettings['filosofi_3_title'] ?? 'Sayap Mengajak & Surat Suara',
            'filosofi_3_desc' => $allSettings['filosofi_3_desc'] ?? 'Simbol ajakan ramah agar warga aktif menggunakan hak pilihnya secara mandiri, berdaulat, dan bebas dari paksaan pihak manapun.',
            'filosofi_4_title' => $allSettings['filosofi_4_title'] ?? 'Ekspresi Ceria & Ramah',
            'filosofi_4_desc' => $allSettings['filosofi_4_desc'] ?? 'Menegaskan bahwa Pilkades adalah pesta rakyat yang membahagiakan, menjalin kerukunan antar RT/RW, dan merajut persatuan desa.',
            'ajakan_1_title' => $allSettings['ajakan_1_title'] ?? 'Cek NIK di DPT Secara Online Sekarang',
            'ajakan_1_desc' => $allSettings['ajakan_1_desc'] ?? 'Jangan menunggu hari H. Pastikan namamu sudah tertera di Daftar Pemilih Tetap (DPT) dan ketahui nomor TPS tempatmu mencoblos.',
            'ajakan_2_title' => $allSettings['ajakan_2_title'] ?? 'Ketahui Visi, Misi, & Program Calon Kepala Desa',
            'ajakan_2_desc' => $allSettings['ajakan_2_desc'] ?? 'Pilihlah calon pemimpin yang memiliki komitmen tulus memajukan Desa Gunungjaya, transparan dalam anggaran desa, dan mengayomi seluruh warga.',
            'ajakan_3_title' => $allSettings['ajakan_3_title'] ?? 'Tolak Segala Bentuk Politik Uang (Anti Money Politics)',
            'ajakan_3_desc' => $allSettings['ajakan_3_desc'] ?? 'Jangan gadaikan masa depan desa selama 6 tahun hanya demi nominal sesaat. Pemimpin berintegritas lahir dari pemilih yang bermartabat.',
            'ajakan_4_title' => $allSettings['ajakan_4_title'] ?? 'Hadir Tepat Waktu di TPS (07.00 - 13.00 WIB)',
            'ajakan_4_desc' => $allSettings['ajakan_4_desc'] ?? 'Bawalah dokumen resmi (e-KTP asli / Surat Keterangan dan Surat Pemberitahuan/Model C6). Gunakan hak suaramu dan celupkan jari ke tinta!',
            'tata_nilai_netralitas' => $allSettings['tata_nilai_netralitas'] ?? 'Panitia Pemilihan Kepala Desa (P2KD) Gunungjaya netral, tidak berpihak kepada siapapun, dan mengabdi untuk kemaslahatan masyarakat desa.',
            'data_phase' => $allSettings['data_phase'] ?? 'DPS',
            'pengumuman' => $allSettings['pengumuman'] ?? 'Pengecekan DPS Online telah dibuka. Pastikan NIK Anda terdaftar!',
        ];

        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'totalTps' => $totalTps,
                'totalDps' => $totalDps,
                'totalL' => $totalL,
                'totalP' => $totalP,
            ],
            'tpsList' => $tpsList,
            'voters' => $voters,
            'allTpsOptions' => $allTpsOptions,
            'pendingSkippedVoters' => $pendingSkippedVoters,
            'pendingSkippedCount' => $pendingSkippedCount,
            'importDuplicateVoters' => $importDuplicateVoters,
            'importDuplicateCount' => $importDuplicateCount,
            'filters' => [
                'search' => $search ?? '',
                'tps_id' => $tpsFilter ?? 'all',
                'gender' => $genderFilter ?? 'all',
                'tab' => $activeTab,
            ],
            'config' => [
                'desa' => $desa,
                'kecamatan' => $kecamatan,
                'kabupaten' => $kabupaten,
                'tahun' => $tahun,
            ],
            'mascotSettings' => $mascotSettings,
        ]);
    }

    public function updateMascotSettings(Request $request)
    {
        $validated = $request->validate([
            'mascot_title' => 'required|string|max:255',
            'mascot_badge' => 'nullable|string|max:255',
            'mascot_tag' => 'nullable|string|max:255',
            'mascot_desc' => 'required|string|max:1500',
            'mascot_slogan' => 'required|string|max:255',
            'mascot_speeches' => 'required|string',
            'filosofi_1_title' => 'nullable|string|max:255',
            'filosofi_1_desc' => 'nullable|string|max:1000',
            'filosofi_2_title' => 'nullable|string|max:255',
            'filosofi_2_desc' => 'nullable|string|max:1000',
            'filosofi_3_title' => 'nullable|string|max:255',
            'filosofi_3_desc' => 'nullable|string|max:1000',
            'filosofi_4_title' => 'nullable|string|max:255',
            'filosofi_4_desc' => 'nullable|string|max:1000',
            'ajakan_1_title' => 'required|string|max:255',
            'ajakan_1_desc' => 'required|string|max:1000',
            'ajakan_2_title' => 'required|string|max:255',
            'ajakan_2_desc' => 'required|string|max:1000',
            'ajakan_3_title' => 'required|string|max:255',
            'ajakan_3_desc' => 'required|string|max:1000',
            'ajakan_4_title' => 'required|string|max:255',
            'ajakan_4_desc' => 'required|string|max:1000',
            'tata_nilai_netralitas' => 'nullable|string|max:1000',
            'data_phase' => 'nullable|string|max:50',
            'pengumuman' => 'nullable|string|max:500',
            'redirect_to' => 'nullable|string|in:home,admin',
        ]);

        // Parsing kalimat ucapan Glawu per baris
        $speeches = array_values(array_filter(
            array_map('trim', explode("\n", $validated['mascot_speeches'])),
            fn ($line) => ! empty($line)
        ));

        if (empty($speeches)) {
            $speeches = ['“Sugeng rawuh sedulur sedaya! Aja lali cek DPS-mu ya!”'];
        }

        AppSetting::set('mascot_title', $validated['mascot_title'], 'text', 'Judul Section Maskot Glawu');
        if (isset($validated['mascot_badge'])) {
            AppSetting::set('mascot_badge', $validated['mascot_badge'], 'text', 'Badge Ikon Maskot');
        }
        if (isset($validated['mascot_tag'])) {
            AppSetting::set('mascot_tag', $validated['mascot_tag'], 'text', 'Tag Deskripsi Maskot');
        }
        AppSetting::set('mascot_desc', $validated['mascot_desc'], 'text', 'Deskripsi Karakter Maskot Glawu');
        AppSetting::set('mascot_slogan', $validated['mascot_slogan'], 'text', 'Slogan Resmi Pilkades');
        AppSetting::set('mascot_speeches', json_encode($speeches, JSON_UNESCAPED_UNICODE), 'json', 'Daftar Ucapan / Balon Dialog Maskot Glawu');

        if (isset($validated['filosofi_1_title'])) {
            AppSetting::set('filosofi_1_title', $validated['filosofi_1_title'], 'text', 'Judul Makna Filosofi 1');
            AppSetting::set('filosofi_1_desc', $validated['filosofi_1_desc'] ?? '', 'text', 'Deskripsi Makna Filosofi 1');
        }
        if (isset($validated['filosofi_2_title'])) {
            AppSetting::set('filosofi_2_title', $validated['filosofi_2_title'], 'text', 'Judul Makna Filosofi 2');
            AppSetting::set('filosofi_2_desc', $validated['filosofi_2_desc'] ?? '', 'text', 'Deskripsi Makna Filosofi 2');
        }
        if (isset($validated['filosofi_3_title'])) {
            AppSetting::set('filosofi_3_title', $validated['filosofi_3_title'], 'text', 'Judul Makna Filosofi 3');
            AppSetting::set('filosofi_3_desc', $validated['filosofi_3_desc'] ?? '', 'text', 'Deskripsi Makna Filosofi 3');
        }
        if (isset($validated['filosofi_4_title'])) {
            AppSetting::set('filosofi_4_title', $validated['filosofi_4_title'], 'text', 'Judul Makna Filosofi 4');
            AppSetting::set('filosofi_4_desc', $validated['filosofi_4_desc'] ?? '', 'text', 'Deskripsi Makna Filosofi 4');
        }

        AppSetting::set('ajakan_1_title', $validated['ajakan_1_title'], 'text', 'Judul Ajakan 1 Glawu');
        AppSetting::set('ajakan_1_desc', $validated['ajakan_1_desc'], 'text', 'Deskripsi Ajakan 1 Glawu');
        AppSetting::set('ajakan_2_title', $validated['ajakan_2_title'], 'text', 'Judul Ajakan 2 Glawu');
        AppSetting::set('ajakan_2_desc', $validated['ajakan_2_desc'], 'text', 'Deskripsi Ajakan 2 Glawu');
        AppSetting::set('ajakan_3_title', $validated['ajakan_3_title'], 'text', 'Judul Ajakan 3 Glawu');
        AppSetting::set('ajakan_3_desc', $validated['ajakan_3_desc'], 'text', 'Deskripsi Ajakan 3 Glawu');
        AppSetting::set('ajakan_4_title', $validated['ajakan_4_title'], 'text', 'Judul Ajakan 4 Glawu');
        AppSetting::set('ajakan_4_desc', $validated['ajakan_4_desc'], 'text', 'Deskripsi Ajakan 4 Glawu');

        if (isset($validated['tata_nilai_netralitas'])) {
            AppSetting::set('tata_nilai_netralitas', $validated['tata_nilai_netralitas'], 'text', 'Pernyataan Netralitas P2KD');
        }

        if (isset($validated['data_phase'])) {
            AppSetting::set('data_phase', $validated['data_phase'], 'text', 'Fase Data Pemilih (DPS / DPT / dll)');
        }
        if (isset($validated['pengumuman'])) {
            AppSetting::set('pengumuman', $validated['pengumuman'], 'text', 'Pengumuman Berjalan');
        }

        if (($validated['redirect_to'] ?? '') === 'home') {
            return redirect()->route('home')->with('success', 'Redaksi dan Maskot GLAWU berhasil diperbarui!');
        }

        return redirect()->route('admin.dashboard', ['tab' => 'redaksi'])
            ->with('success', 'Redaksi dan Pesan Maskot GLAWU berhasil disimpan!');
    }
}
