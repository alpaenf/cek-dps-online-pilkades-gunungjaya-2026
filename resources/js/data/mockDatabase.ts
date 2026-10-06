import { DptRecord, DptPublicResult, PilkadesConfig, TpsItem } from '../types/pilkades';

/**
 * Konfigurasi Default (Sinkron dengan Sheet PENGATURAN)
 */
export const DEFAULT_CONFIG: PilkadesConfig = {
  nama_kegiatan: 'Pemilihan Kepala Desa Gunungjaya Tahun 2026',
  desa: 'Gunungjaya',
  kecamatan: 'Belik',
  kabupaten: 'Pemalang',
  tahun: '2026',
  tanggal_pemungutan: 'Senin, 9 November 2026 (Pukul 07.00 - 13.00 WIB)',
  kontak_panitia: 'Panitia Pemilihan Kepala Desa (P2KD) Gunungjaya',
  whatsapp_panitia: '6285226123456',
  alamat_sekretariat: 'Sekretariat P2KD - Balai Desa Gunungjaya, Jl. Raya Gunungjaya No. 01, Kec. Belik, Kab. Pemalang, Jawa Tengah 52356',
  pengumuman: 'Pengecekan DPS Online telah dibuka. Pastikan NIK Anda terdaftar sebelum hari H!'
};

/**
 * Data TPS Desa Gunungjaya (Sinkron dengan Sheet TPS)
 * Total 5 TPS tersebar di 5 Dusun wilayah Desa Gunungjaya
 */
export const DEFAULT_TPS_LIST: TpsItem[] = [
  {
    tps: 'TPS 1',
    nama_lokasi: 'Pendopo Balai Desa Gunungjaya',
    alamat: 'Jl. Raya Gunungjaya No. 01',
    dusun: 'Dusun Krajan',
    rt: '01, 02, 03',
    rw: '01 & 02',
    keterangan: 'Mencakup pemilih wilayah Dusun Krajan bagian Barat & Pusat Desa'
  },
  {
    tps: 'TPS 2',
    nama_lokasi: 'Gedung SDN 01 Gunungjaya',
    alamat: 'Jl. Pendidikan No. 12',
    dusun: 'Dusun Gombong',
    rt: '01, 02, 03, 04',
    rw: '03',
    keterangan: 'Mencakup pemilih wilayah Dusun Gombong dan sekitarnya'
  },
  {
    tps: 'TPS 3',
    nama_lokasi: 'Gedung MDA Nurul Huda',
    alamat: 'Jl. Pesantren Dusun Soka',
    dusun: 'Dusun Soka',
    rt: '01, 02, 03',
    rw: '04',
    keterangan: 'Mencakup pemilih wilayah Dusun Soka RT 01 s/d RT 03'
  },
  {
    tps: 'TPS 4',
    nama_lokasi: 'Balai Pertemuan Warga Dusun Karanganyar',
    alamat: 'Jl. Lingkar Timur Karanganyar',
    dusun: 'Dusun Karanganyar',
    rt: '01, 02, 03, 04',
    rw: '05',
    keterangan: 'Mencakup pemilih wilayah Dusun Karanganyar'
  },
  {
    tps: 'TPS 5',
    nama_lokasi: 'Halaman Gedung Posyandu Watukumpul',
    alamat: 'Jl. Watukumpul Indah No. 05',
    dusun: 'Dusun Watukumpul',
    rt: '01, 02, 03',
    rw: '06',
    keterangan: 'Mencakup pemilih wilayah Dusun Watukumpul bagian Selatan'
  }
];

/**
 * Basis Data Dummy DPT (Sesuai Struktur Sheet DPT Google Sheets)
 * Menggunakan kode wilayah Kab. Pemalang (3327...)
 * CATATAN KEAMANAN: Hanya data contoh/dummy untuk pengembangan.
 */
export const MOCK_DPT_DATABASE: DptRecord[] = [
  {
    no: 1,
    nik: '3327091205850001',
    no_kk: '3327091001050011',
    nama: 'BUDI SANTOSO',
    tempat_lahir: 'Pemalang',
    tanggal_lahir: '12-05-1985',
    jenis_kelamin: 'L',
    alamat: 'Dusun Krajan',
    dusun: 'Dusun Krajan',
    rt: '01',
    rw: '02',
    tps: '1',
    status: 'TERDAFTAR DALAM DPS',
    keterangan: '-'
  },
  {
    no: 2,
    nik: '3327092304900002',
    no_kk: '3327091001050022',
    nama: 'SITI AMINAH',
    tempat_lahir: 'Pemalang',
    tanggal_lahir: '23-04-1990',
    jenis_kelamin: 'P',
    alamat: 'Dusun Gombong',
    dusun: 'Dusun Gombong',
    rt: '03',
    rw: '01',
    tps: '2',
    status: 'TERDAFTAR DALAM DPS',
    keterangan: '-'
  },
  {
    no: 3,
    nik: '3327091508820003',
    no_kk: '3327091001050033',
    nama: 'SLAMET RIYADI',
    tempat_lahir: 'Pemalang',
    tanggal_lahir: '15-08-1982',
    jenis_kelamin: 'L',
    alamat: 'Dusun Soka',
    dusun: 'Dusun Soka',
    rt: '02',
    rw: '03',
    tps: '3',
    status: 'TERDAFTAR DALAM DPS',
    keterangan: '-'
  },
  {
    no: 4,
    nik: '3327096510950004',
    no_kk: '3327091001050044',
    nama: 'SRI WAHYUNI',
    tempat_lahir: 'Pemalang',
    tanggal_lahir: '25-10-1995',
    jenis_kelamin: 'P',
    alamat: 'Dusun Karanganyar',
    dusun: 'Dusun Karanganyar',
    rt: '01',
    rw: '04',
    tps: '4',
    status: 'TERDAFTAR DALAM DPS',
    keterangan: '-'
  },
  {
    no: 5,
    nik: '3327090802780005',
    no_kk: '3327091001050055',
    nama: 'AHMAD FAUZI',
    tempat_lahir: 'Pemalang',
    tanggal_lahir: '08-02-1978',
    jenis_kelamin: 'L',
    alamat: 'Dusun Watukumpul',
    dusun: 'Dusun Watukumpul',
    rt: '04',
    rw: '02',
    tps: '5',
    status: 'TERDAFTAR DALAM DPS',
    keterangan: '-'
  },
  {
    no: 6,
    nik: '3327094207990006',
    no_kk: '3327091001050066',
    nama: 'DEWI LESTARI',
    tempat_lahir: 'Pemalang',
    tanggal_lahir: '02-07-1999',
    jenis_kelamin: 'P',
    alamat: 'Dusun Krajan',
    dusun: 'Dusun Krajan',
    rt: '02',
    rw: '02',
    tps: '1',
    status: 'TERDAFTAR DALAM DPS',
    keterangan: '-'
  },
  {
    no: 7,
    nik: '3327091411890007',
    no_kk: '3327091001050077',
    nama: 'AGUS PRASETYO',
    tempat_lahir: 'Pemalang',
    tanggal_lahir: '14-11-1989',
    jenis_kelamin: 'L',
    alamat: 'Dusun Gombong',
    dusun: 'Dusun Gombong',
    rt: '02',
    rw: '01',
    tps: '2',
    status: 'TERDAFTAR DALAM DPS',
    keterangan: '-'
  }
];

// Anti-abuse: Rate Limiter State (in-memory)
let recentSearchTimestamps: number[] = [];
const MAX_SEARCHES_PER_WINDOW = 5;
const WINDOW_DURATION_MS = 30000; // 30 detik

/**
 * Masking NIK: 4 digit awal + 8 bintang + 4 digit akhir
 * Contoh: 3327091205850001 -> 3327********0001
 */
export function maskNik(rawNik: string): string {
  if (rawNik.length !== 16) return rawNik;
  return rawNik.substring(0, 4) + '********' + rawNik.substring(12);
}

/**
 * Fungsi untuk menguji koneksi ke URL Google Apps Script Web App
 */
export async function testAppsScriptConnection(appsScriptUrl: string): Promise<{
  success: boolean;
  message: string;
  details?: string;
}> {
  const cleanUrl = appsScriptUrl.trim();
  if (!cleanUrl) {
    return { success: false, message: 'URL tidak boleh kosong.' };
  }

  // 1. Coba melalui Backend Proxy terlebih dahulu (Bypass CORS & Redirect)
  try {
    const proxyRes = await fetch('/api/test-gas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: cleanUrl })
    });

    if (proxyRes.ok) {
      const data = await proxyRes.json();
      return data;
    }
  } catch {
    // Fallback jika backend proxy tidak aktif
  }

  if (cleanUrl.includes('/edit')) {
    return {
      success: false,
      message: 'URL salah (URL Editor).',
      details: 'URL yang Anda masukkan adalah URL editor script (/edit). Gunakan URL hasil Deploy Web App yang berakhiran /exec.'
    };
  }

  if (!cleanUrl.startsWith('https://script.google.com/macros/s/')) {
    return {
      success: false,
      message: 'Format URL tidak sesuai.',
      details: 'URL harus diawali dengan https://script.google.com/macros/s/... dan berakhiran /exec'
    };
  }

  try {
    const url = new URL(cleanUrl);
    url.searchParams.set('action', 'check');
    url.searchParams.set('nik', '3327091205850001');

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 25000);

    const response = await fetch(url.toString(), {
      method: 'GET',
      mode: 'cors',
      redirect: 'follow',
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      return {
        success: false,
        message: `HTTP Error ${response.status}`,
        details: 'Server Google Apps Script mengembalikan status error. Periksa kembali izin deployment.'
      };
    }

    const data = await response.json();
    if (typeof data === 'object' && data !== null) {
      return {
        success: true,
        message: 'Koneksi Berhasil!',
        details: 'Google Apps Script merespons dengan format JSON yang valid.'
      };
    }

    return {
      success: false,
      message: 'Format data tidak sesuai.',
      details: 'Server merespons tetapi data bukan format JSON yang diharapkan.'
    };
  } catch (err: any) {
    if (err.name === 'AbortError' || String(err).toLowerCase().includes('aborted')) {
      return {
        success: false,
        message: 'Koneksi Timeout (Waktu Habis).',
        details: 'Google Apps Script membutuhkan waktu lebih dari 25 detik untuk merespons. Jika script baru saja dibuka, silakan ulangi beberapa saat lagi.'
      };
    }

    return {
      success: false,
      message: 'Gagal Menghubungi Web App (CORS / Izin Akses).',
      details: 'Penyebab utama: Pengaturan "Who has access" saat Deploy belum diatur ke "Anyone" (Siapa saja), atau deployment belum diselesaikan.'
    };
  }
}

/**
 * Fungsi query pencarian NIK (Anti-Abuse + Server-Side Proxy + Google Apps Script Web App Fetch + Fallback Simulator)
 */
export async function executeDptCheck(
  nikInput: string,
  appsScriptUrl?: string
): Promise<{ result?: DptPublicResult; error?: string; isNetworkIssue?: boolean }> {
  const cleanedNik = nikInput.replace(/\D/g, '').trim();

  // Validasi ketat NIK
  if (!cleanedNik) {
    return { error: 'NIK tidak boleh kosong.' };
  }
  if (!/^\d+$/.test(cleanedNik)) {
    return { error: 'NIK hanya boleh berisi angka.' };
  }
  if (cleanedNik.length !== 16) {
    return { error: 'NIK harus terdiri dari 16 digit.' };
  }

  // Anti-abuse: Rate Limiter
  const now = Date.now();
  recentSearchTimestamps = recentSearchTimestamps.filter(
    (t) => now - t < WINDOW_DURATION_MS
  );

  if (recentSearchTimestamps.length >= MAX_SEARCHES_PER_WINDOW) {
    return {
      error: 'Terlalu banyak permintaan. Silakan coba kembali beberapa saat lagi.'
    };
  }

  recentSearchTimestamps.push(now);

  // 1. PRIORITAS UTAMA: Database MySQL Laravel (Cepat < 10ms)
  try {
    const laravelRes = await fetch('/api/check-dps', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      },
      body: JSON.stringify({ nik: cleanedNik })
    });
    if (laravelRes.ok) {
      const data = await laravelRes.json();
      return { result: data as DptPublicResult };
    }
  } catch (err) {
    console.warn('MySQL API error, attempting fallback...', err);
  }

  const trimmedUrl = (appsScriptUrl || '').trim();

  // JIKA ADA URL (Google Apps Script atau Google Sheet Link)
  if (trimmedUrl) {
    // 1. Solusi Terbaik: Hubungi lewat Backend Proxy Server
    try {
      const proxyRes = await fetch('/api/check-dpt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nik: cleanedNik,
          gasUrl: trimmedUrl.startsWith('https://script.google.com') ? trimmedUrl : undefined,
          spreadsheetUrl: trimmedUrl.includes('docs.google.com/spreadsheets') ? trimmedUrl : undefined
        })
      });

      const proxyData = await proxyRes.json();

      if (proxyRes.ok) {
        return { result: proxyData as DptPublicResult };
      } else {
        return {
          error: proxyData.error || 'Terjadi kesalahan saat memproses data dari Google Spreadsheet.',
          isNetworkIssue: true
        };
      }
    } catch {
      // Jika backend proxy tidak merespons, coba direct fetch browser
    }

    // 2. Direct Browser Fetch Fallback (jika backend tidak aktif)
    if (trimmedUrl.startsWith('https://script.google.com')) {
      if (trimmedUrl.includes('/edit')) {
        return {
          error: 'URL Google Apps Script yang tersimpan masih berupa URL Editor (/edit). Harap deploy sebagai Web App dan gunakan URL berakhiran /exec.',
          isNetworkIssue: true
        };
      }

      try {
        const url = new URL(trimmedUrl);
        url.searchParams.set('action', 'check');
        url.searchParams.set('nik', cleanedNik);

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 25000);

        const response = await fetch(url.toString(), {
          method: 'GET',
          mode: 'cors',
          redirect: 'follow',
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (response.ok) {
          const data = await response.json();
          return { result: data as DptPublicResult };
        } else {
          return {
            error: `Server Google Apps Script mengembalikan kode respon HTTP ${response.status}. Pastikan hak akses diatur ke "Anyone".`,
            isNetworkIssue: true
          };
        }
      } catch {
        return {
          error: 'Data sedang tidak dapat diakses dari server Google Sheets. Kemungkinan pengaturan akses Web App belum diatur ke "Anyone" (Siapa saja) atau terhalang browser CORS.',
          isNetworkIssue: true
        };
      }
    }
  }

  // 3. Mode Simulasi respons server Google Apps Script (Option A Fallback)
  await new Promise((res) => setTimeout(res, 500));

  const foundRow = MOCK_DPT_DATABASE.find((item) => item.nik === cleanedNik);

  if (foundRow) {
    const publicResult: DptPublicResult = {
      found: true,
      nama: foundRow.nama,
      nik_masked: maskNik(foundRow.nik),
      dusun: foundRow.dusun,
      rt: foundRow.rt.padStart(2, '0'),
      rw: foundRow.rw.padStart(2, '0'),
      tps: `TPS ${foundRow.tps}`,
      status: foundRow.status
    };
    return { result: publicResult };
  }

  return {
    result: {
      found: false,
      message: 'Data Anda belum ditemukan dalam database DPS yang tersedia pada website ini.'
    }
  };
}
