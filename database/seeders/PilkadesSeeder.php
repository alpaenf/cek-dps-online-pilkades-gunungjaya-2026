<?php

namespace Database\Seeders;

use App\Models\AppSetting;
use App\Models\Tps;
use App\Models\User;
use App\Models\Voter;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class PilkadesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Akun Admin Panitia Pilkades
        User::updateOrCreate(
            ['email' => 'admin@gunungjaya.desa.id'],
            [
                'name' => 'Panitia Pilkades Gunungjaya',
                'password' => Hash::make('password'),
                'role' => 'admin',
            ]
        );

        // 2. Pengaturan Pilkades
        $settings = [
            'nama_kegiatan' => 'Pemilihan Kepala Desa Gunungjaya Tahun 2026',
            'desa' => 'Gunungjaya',
            'kecamatan' => 'Belik',
            'kabupaten' => 'Pemalang',
            'tahun' => '2026',
            'tanggal_pemungutan' => 'Senin, 9 November 2026 (Pukul 07.00 - 13.00 WIB)',
            'kontak_panitia' => 'Panitia Pemilihan Kepala Desa (P2KD) Gunungjaya',
            'whatsapp_panitia' => '6285226123456',
            'alamat_sekretariat' => 'Sekretariat P2KD - Balai Desa Gunungjaya, Jl. Raya Gunungjaya No. 01, Kec. Belik, Kab. Pemalang, Jawa Tengah 52356',
            'pengumuman' => 'Pengecekan DPS Online telah dibuka. Pastikan NIK Anda terdaftar sebelum hari H pemilihan!',
            'is_announcement_active' => '1',
        ];

        foreach ($settings as $key => $val) {
            AppSetting::updateOrCreate(
                ['key' => $key],
                ['value' => $val, 'type' => 'text']
            );
        }

        // 3. Data TPS Desa Gunungjaya
        $tpsList = [
            [
                'nomor_tps' => 'TPS 1',
                'nama_lokasi' => 'Pendopo Balai Desa Gunungjaya',
                'alamat' => 'Jl. Raya Gunungjaya No. 01',
                'dusun' => 'Dusun Krajan',
                'rt' => '01, 02, 03',
                'rw' => '01 & 02',
                'latitude' => -7.16543210,
                'longitude' => 109.34567890,
                'keterangan' => 'Mencakup pemilih wilayah Dusun Krajan bagian Barat & Pusat Desa',
            ],
            [
                'nomor_tps' => 'TPS 2',
                'nama_lokasi' => 'Gedung SDN 01 Gunungjaya',
                'alamat' => 'Jl. Pendidikan No. 12',
                'dusun' => 'Dusun Gombong',
                'rt' => '01, 02, 03, 04',
                'rw' => '03',
                'latitude' => -7.16781230,
                'longitude' => 109.34891230,
                'keterangan' => 'Mencakup pemilih wilayah Dusun Gombong dan sekitarnya',
            ],
            [
                'nomor_tps' => 'TPS 3',
                'nama_lokasi' => 'Gedung MDA Nurul Huda',
                'alamat' => 'Jl. Pesantren Dusun Soka',
                'dusun' => 'Dusun Soka',
                'rt' => '01, 02, 03',
                'rw' => '04',
                'latitude' => -7.17012340,
                'longitude' => 109.35123450,
                'keterangan' => 'Mencakup pemilih wilayah Dusun Soka RT 01 s/d RT 03',
            ],
            [
                'nomor_tps' => 'TPS 4',
                'nama_lokasi' => 'Balai Pertemuan Warga Dusun Karanganyar',
                'alamat' => 'Jl. Lingkar Timur Karanganyar',
                'dusun' => 'Dusun Karanganyar',
                'rt' => '01, 02, 03, 04',
                'rw' => '05',
                'latitude' => -7.17234560,
                'longitude' => 109.35456780,
                'keterangan' => 'Mencakup pemilih wilayah Dusun Karanganyar',
            ],
            [
                'nomor_tps' => 'TPS 5',
                'nama_lokasi' => 'Halaman Gedung Posyandu Watukumpul',
                'alamat' => 'Jl. Posyandu Dusun Watukumpul',
                'dusun' => 'Dusun Watukumpul',
                'rt' => '01, 02, 03',
                'rw' => '06',
                'latitude' => -7.17456780,
                'longitude' => 109.35789010,
                'keterangan' => 'Mencakup pemilih wilayah Dusun Watukumpul bagian Selatan',
            ],
        ];

        $tpsModelMap = [];
        foreach ($tpsList as $tpsData) {
            $tps = Tps::updateOrCreate(
                ['nomor_tps' => $tpsData['nomor_tps']],
                $tpsData
            );
            $tpsModelMap[$tpsData['nomor_tps']] = $tps->id;
        }

        // 4. Data Pemilih Contoh (DPT / DPS)
        $sampleVoters = [
            [
                'no_urut' => 1,
                'nik' => '3327091205850001',
                'no_kk' => '3327091001050011',
                'nama' => 'BUDI SANTOSO',
                'tempat_lahir' => 'Pemalang',
                'tanggal_lahir' => '1985-05-12',
                'jenis_kelamin' => 'L',
                'alamat' => 'Dusun Krajan RT 01 / RW 02',
                'dusun' => 'Dusun Krajan',
                'rt' => '01',
                'rw' => '02',
                'tps_id' => $tpsModelMap['TPS 1'] ?? null,
                'status' => 'DPS',
                'keterangan' => 'Terdaftar Resmi',
            ],
            [
                'no_urut' => 2,
                'nik' => '3327092304900002',
                'no_kk' => '3327091001050022',
                'nama' => 'SITI AMINAH',
                'tempat_lahir' => 'Pemalang',
                'tanggal_lahir' => '1990-04-23',
                'jenis_kelamin' => 'P',
                'alamat' => 'Dusun Gombong RT 03 / RW 01',
                'dusun' => 'Dusun Gombong',
                'rt' => '03',
                'rw' => '01',
                'tps_id' => $tpsModelMap['TPS 2'] ?? null,
                'status' => 'DPS',
                'keterangan' => 'Terdaftar Resmi',
            ],
            [
                'no_urut' => 3,
                'nik' => '3327091508820003',
                'no_kk' => '3327091001050033',
                'nama' => 'SLAMET RIYADI',
                'tempat_lahir' => 'Pemalang',
                'tanggal_lahir' => '1982-08-15',
                'jenis_kelamin' => 'L',
                'alamat' => 'Dusun Soka RT 02 / RW 03',
                'dusun' => 'Dusun Soka',
                'rt' => '02',
                'rw' => '03',
                'tps_id' => $tpsModelMap['TPS 3'] ?? null,
                'status' => 'DPS',
                'keterangan' => 'Terdaftar Resmi',
            ],
            [
                'no_urut' => 4,
                'nik' => '3327096510950004',
                'no_kk' => '3327091001050044',
                'nama' => 'SRI WAHYUNI',
                'tempat_lahir' => 'Pemalang',
                'tanggal_lahir' => '1995-10-25',
                'jenis_kelamin' => 'P',
                'alamat' => 'Dusun Karanganyar RT 01 / RW 04',
                'dusun' => 'Dusun Karanganyar',
                'rt' => '01',
                'rw' => '04',
                'tps_id' => $tpsModelMap['TPS 4'] ?? null,
                'status' => 'DPS',
                'keterangan' => 'Terdaftar Resmi',
            ],
            [
                'no_urut' => 5,
                'nik' => '3327090802780005',
                'no_kk' => '3327091001050055',
                'nama' => 'AHMAD FAUZI',
                'tempat_lahir' => 'Pemalang',
                'tanggal_lahir' => '1978-02-08',
                'jenis_kelamin' => 'L',
                'alamat' => 'Dusun Watukumpul RT 04 / RW 02',
                'dusun' => 'Dusun Watukumpul',
                'rt' => '04',
                'rw' => '02',
                'tps_id' => $tpsModelMap['TPS 5'] ?? null,
                'status' => 'DPS',
                'keterangan' => 'Terdaftar Resmi',
            ],
            [
                'no_urut' => 6,
                'nik' => '3327094207990006',
                'no_kk' => '3327091001050066',
                'nama' => 'DEWI LESTARI',
                'tempat_lahir' => 'Pemalang',
                'tanggal_lahir' => '1999-07-02',
                'jenis_kelamin' => 'P',
                'alamat' => 'Dusun Krajan RT 02 / RW 02',
                'dusun' => 'Dusun Krajan',
                'rt' => '02',
                'rw' => '02',
                'tps_id' => $tpsModelMap['TPS 1'] ?? null,
                'status' => 'DPS',
                'keterangan' => 'Terdaftar Resmi',
            ],
            [
                'no_urut' => 7,
                'nik' => '3327091411890007',
                'no_kk' => '3327091001050077',
                'nama' => 'AGUS PRASETYO',
                'tempat_lahir' => 'Pemalang',
                'tanggal_lahir' => '1989-11-14',
                'jenis_kelamin' => 'L',
                'alamat' => 'Dusun Gombong RT 02 / RW 01',
                'dusun' => 'Dusun Gombong',
                'rt' => '02',
                'rw' => '01',
                'tps_id' => $tpsModelMap['TPS 2'] ?? null,
                'status' => 'DPS',
                'keterangan' => 'Terdaftar Resmi',
            ],
        ];

        foreach ($sampleVoters as $voterData) {
            Voter::updateOrCreate(
                ['nik' => $voterData['nik']],
                $voterData
            );
        }
    }
}
