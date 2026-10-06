<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Tps;
use App\Models\Voter;
use App\Models\AppSetting;
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
        $activeTab = $request->input('tab', 'dps'); // 'dps' or 'tps'

        // Statistik Utama Real-Time dari Database
        $totalTps = Tps::count();
        $totalDps = Voter::count();
        $totalL = Voter::where('jenis_kelamin', 'L')->count();
        $totalP = Voter::where('jenis_kelamin', 'P')->count();

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
        ]);
    }
}
