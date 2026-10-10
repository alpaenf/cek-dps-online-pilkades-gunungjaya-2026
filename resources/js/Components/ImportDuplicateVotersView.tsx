import React, { useState } from 'react';
import {
  Copy,
  Search,
  Download,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  RefreshCw,
  Check,
  Filter,
  FileSpreadsheet,
  Info
} from 'lucide-react';
import * as XLSX from 'xlsx';

export interface ImportDuplicateVoterItem {
  id: number;
  row_number?: number;
  nik: string;
  nama: string;
  dusun?: string;
  rt?: string;
  rw?: string;
  tps_id?: number | null;
  tps_name?: string;
  first_seen_row_number?: number;
  first_seen_name?: string;
  first_seen_dusun?: string;
  first_seen_rt?: string;
  first_seen_rw?: string;
  first_seen_tps_name?: string;
  status_match?: string;
  created_at?: string;
  tps?: {
    id: number;
    nomor_tps: string;
    nama_lokasi: string;
    dusun: string;
  };
}

interface ImportDuplicateVotersViewProps {
  initialDuplicateVoters: ImportDuplicateVoterItem[];
  allTpsOptions: {
    id: number;
    nomor_tps: string;
    nama_lokasi: string;
    dusun: string;
  }[];
  onNavigateToDps: () => void;
  onCountChange?: (count: number) => void;
}

export const ImportDuplicateVotersView: React.FC<ImportDuplicateVotersViewProps> = ({
  initialDuplicateVoters,
  allTpsOptions,
  onNavigateToDps,
  onCountChange,
}) => {
  const [items, setItems] = useState<ImportDuplicateVoterItem[]>(initialDuplicateVoters);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTpsFilter, setSelectedTpsFilter] = useState('all');
  const [selectedMatchFilter, setSelectedMatchFilter] = useState<'all' | 'IDENTIK' | 'BEDA_NAMA'>('all');
  const [isClearingAll, setIsClearingAll] = useState(false);

  // Perhitungan statistik
  const totalCount = items.length;
  const identikCount = items.filter(
    (item) =>
      item.status_match === 'IDENTIK' ||
      (item.nama && item.first_seen_name && item.nama.trim().toUpperCase() === item.first_seen_name.trim().toUpperCase())
  ).length;
  const bedaNamaCount = totalCount - identikCount;

  // Filter items
  const filteredItems = items.filter((item) => {
    const q = searchQuery.toLowerCase().trim();
    const isExact =
      item.status_match === 'IDENTIK' ||
      (item.nama && item.first_seen_name && item.nama.trim().toUpperCase() === item.first_seen_name.trim().toUpperCase());

    // Filter Match
    if (selectedMatchFilter === 'IDENTIK' && !isExact) return false;
    if (selectedMatchFilter === 'BEDA_NAMA' && isExact) return false;

    // Filter TPS
    if (selectedTpsFilter !== 'all') {
      const matchTps =
        String(item.tps_id) === selectedTpsFilter ||
        String(item.tps?.nomor_tps) === selectedTpsFilter ||
        String(item.tps_name).includes(selectedTpsFilter);
      if (!matchTps) return false;
    }

    // Search query
    if (!q) return true;
    return (
      (item.nama && item.nama.toLowerCase().includes(q)) ||
      (item.nik && item.nik.toLowerCase().includes(q)) ||
      (item.first_seen_name && item.first_seen_name.toLowerCase().includes(q)) ||
      (item.dusun && item.dusun.toLowerCase().includes(q)) ||
      (item.first_seen_dusun && item.first_seen_dusun.toLowerCase().includes(q)) ||
      (item.row_number && String(item.row_number).includes(q)) ||
      (item.first_seen_row_number && String(item.first_seen_row_number).includes(q))
    );
  });

  // Export Excel
  const handleDownloadExcel = () => {
    if (items.length === 0) return;

    const reportData = items.map((r, idx) => {
      const isExact =
        r.status_match === 'IDENTIK' ||
        (r.nama && r.first_seen_name && r.nama.trim().toUpperCase() === r.first_seen_name.trim().toUpperCase());

      return {
        'No': idx + 1,
        'Pasangan Baris Kembar': `Baris #${r.first_seen_row_number || '-'} ⟷ Baris #${r.row_number || '-'}`,
        'NIK (16 Digit)': r.nik,
        'Baris Asal (Pertama)': `Baris #${r.first_seen_row_number || '-'}`,
        'Nama di Baris Asal': r.first_seen_name || '-',
        'TPS Baris Asal': r.first_seen_tps_name || (r.tps?.nomor_tps ? `TPS ${r.tps.nomor_tps}` : '-'),
        'Alamat Baris Asal': `${r.first_seen_dusun || '-'} ${r.first_seen_rt ? `RT ${r.first_seen_rt}` : ''} ${r.first_seen_rw ? `RW ${r.first_seen_rw}` : ''}`.trim(),
        'Baris Ganda (Duplikat)': `Baris #${r.row_number || '-'}`,
        'Nama di Baris Ganda': r.nama,
        'TPS Baris Ganda': r.tps_name || (r.tps?.nomor_tps ? `TPS ${r.tps.nomor_tps}` : '-'),
        'Alamat Baris Ganda': `${r.dusun || '-'} ${r.rt ? `RT ${r.rt}` : ''} ${r.rw ? `RW ${r.rw}` : ''}`.trim(),
        'Status Analisis': isExact ? '100% Identik' : 'Beda Nama (Diperbarui)',
        'Penanganan Sistem': 'Data NIK ganda disinkronkan otomatis tanpa duplikat di DPS',
      };
    });

    const ws = XLSX.utils.json_to_sheet(reportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Data Ganda');

    ws['!cols'] = [
      { wch: 6 },
      { wch: 25 },
      { wch: 22 },
      { wch: 22 },
      { wch: 28 },
      { wch: 15 },
      { wch: 30 },
      { wch: 22 },
      { wch: 28 },
      { wch: 15 },
      { wch: 30 },
      { wch: 25 },
      { wch: 45 },
    ];

    XLSX.writeFile(wb, `Laporan_Data_Ganda_Import_DPS_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  // Bersihkan seluruh riwayat data ganda
  const handleClearAll = async () => {
    if (!confirm('Apakah Anda yakin ingin membersihkan riwayat data ganda ini? Data DPS utama tidak akan terhapus.')) {
      return;
    }

    setIsClearingAll(true);
    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';

    try {
      const response = await fetch('/admin/voters/duplicates-clear-all', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-CSRF-TOKEN': csrfToken,
          'X-Requested-With': 'XMLHttpRequest',
        },
      });

      if (!response.ok) {
        throw new Error('Gagal membersihkan data ganda.');
      }

      setItems([]);
      onCountChange?.(0);
      onNavigateToDps();
    } catch (err: any) {
      alert(err.message || 'Terjadi kesalahan.');
    } finally {
      setIsClearingAll(false);
    }
  };

  return (
    <div className="bg-white border-2 border-b-4 border-slate-200 rounded-3xl p-4 sm:p-8 space-y-6 shadow-sm">
      {/* Header View */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b-2 border-slate-100">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-[#1CB0F6] text-white flex items-center justify-center shrink-0 shadow-sm border-b-2 border-[#1899D6]">
            <Copy className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Rekonsiliasi Data NIK Ganda
              </h2>
              <span className="px-2.5 py-0.5 rounded-full bg-[#EBF7FD] border border-[#1CB0F6]/40 text-[#1899D6] font-black text-xs">
                Hasil Import Excel Terakhir
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5 leading-relaxed">
              Daftar baris pemilih yang memiliki NIK sama dengan baris sebelumnya di dalam berkas Excel.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
          <button
            type="button"
            onClick={handleDownloadExcel}
            disabled={items.length === 0}
            className="px-3.5 py-2.5 rounded-2xl bg-white hover:bg-slate-50 text-[#1899D6] font-black text-xs uppercase tracking-wider border-2 border-[#1CB0F6]/40 active:translate-y-0.5 transition-all shadow-xs cursor-pointer inline-flex items-center gap-2 disabled:opacity-50"
          >
            <Download className="w-4 h-4 text-[#1CB0F6]" />
            <span>Unduh Excel ({items.length})</span>
          </button>

          <button
            type="button"
            onClick={handleClearAll}
            disabled={items.length === 0 || isClearingAll}
            className="px-3.5 py-2.5 rounded-2xl bg-white hover:bg-rose-50 text-[#EA2B2B] font-black text-xs uppercase tracking-wider border-2 border-rose-200 active:translate-y-0.5 transition-all shadow-xs cursor-pointer inline-flex items-center gap-2 disabled:opacity-50"
          >
            <Trash2 className="w-4 h-4 text-[#EA2B2B]" />
            <span>Bersihkan Riwayat</span>
          </button>

          <button
            type="button"
            onClick={onNavigateToDps}
            className="px-4 py-2.5 rounded-2xl bg-[#58CC02] hover:bg-[#4ebb02] text-white font-black text-xs uppercase tracking-wider border-b-4 border-[#46A302] active:border-b-0 active:translate-y-1 transition-all shadow-xs cursor-pointer inline-flex items-center gap-2"
          >
            <ArrowRight className="w-4 h-4" />
            <span>Lihat Data DPS</span>
          </button>
        </div>
      </div>

      {/* Grid Statistik Data Ganda */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-[#EBF7FD] border-2 border-[#1CB0F6]/40 rounded-2xl p-4 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-[#1899D6] block">
              Total Baris NIK Ganda
            </span>
            <span className="text-2xl font-black text-[#1899D6] mt-0.5 block">
              {totalCount.toLocaleString('id-ID')}
            </span>
            <span className="text-[11px] text-slate-600 font-medium">Disinkronkan otomatis</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-white text-[#1899D6] flex items-center justify-center font-black shadow-xs">
            <Copy className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-emerald-50 border-2 border-emerald-300 rounded-2xl p-4 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 block">
              100% Identik (Nama & NIK Sama)
            </span>
            <span className="text-2xl font-black text-emerald-700 mt-0.5 block">
              {identikCount.toLocaleString('id-ID')}
            </span>
            <span className="text-[11px] text-emerald-700 font-medium">Duplikat nama & NIK persis</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-white text-emerald-600 flex items-center justify-center font-black shadow-xs">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-4 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-amber-800 block">
              Beda Nama pada NIK Sama
            </span>
            <span className="text-2xl font-black text-amber-700 mt-0.5 block">
              {bedaNamaCount.toLocaleString('id-ID')}
            </span>
            <span className="text-[11px] text-amber-700 font-medium">Data terbaru menimpa data lama</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-white text-amber-600 flex items-center justify-center font-black shadow-xs">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Info Penjelasan */}
      <div className="p-3.5 rounded-2xl bg-slate-50 border-2 border-slate-200 flex items-start gap-3">
        <Info className="w-4 h-4 text-[#1CB0F6] shrink-0 mt-0.5" />
        <p className="text-xs text-slate-600 leading-relaxed font-medium">
          <strong>Catatan Sistem:</strong> Baris-baris di bawah ini terdeteksi memiliki NIK kembar di file Excel. 
          Sistem secara cerdas memperbarui data pemilih yang bersangkutan sehingga <strong>tidak ada NIK ganda di tabel DPS</strong>. 
          Tabel di bawah memudahkan panitia untuk membandingkan baris asal dengan baris gandanya.
        </p>
      </div>

      {/* Filter & Pencarian */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
        <div className="sm:col-span-6 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari NIK, Nama Pemilih, Dusun, atau Nomor Baris..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-2 border-slate-200 rounded-2xl text-xs sm:text-sm font-bold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#1CB0F6] focus:bg-white"
          />
        </div>

        <div className="sm:col-span-3">
          <select
            value={selectedTpsFilter}
            onChange={(e) => setSelectedTpsFilter(e.target.value)}
            className="w-full py-2.5 px-3 bg-slate-50 border-2 border-slate-200 rounded-2xl text-xs font-bold text-slate-800 focus:outline-none focus:border-[#1CB0F6]"
          >
            <option value="all">Semua Lokasi TPS</option>
            {allTpsOptions.map((tps) => (
              <option key={tps.id} value={String(tps.nomor_tps)}>
                TPS {tps.nomor_tps} - {tps.nama_lokasi}
              </option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-3">
          <select
            value={selectedMatchFilter}
            onChange={(e) => setSelectedMatchFilter(e.target.value as any)}
            className="w-full py-2.5 px-3 bg-slate-50 border-2 border-slate-200 rounded-2xl text-xs font-bold text-slate-800 focus:outline-none focus:border-[#1CB0F6]"
          >
            <option value="all">Semua Status Analisis</option>
            <option value="IDENTIK">100% Identik Saja</option>
            <option value="BEDA_NAMA">Beda Nama Saja</option>
          </select>
        </div>
      </div>

      {/* Tabel Komparasi Baris Ganda */}
      {items.length === 0 ? (
        <div className="p-12 text-center bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto font-black">
            <Check className="w-6 h-6 stroke-[3]" />
          </div>
          <h3 className="text-base font-black text-slate-800">
            Tidak Ada Riwayat Data NIK Ganda
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Seluruh data pemilih yang diimpor dari file Excel terakhir memiliki NIK unik atau riwayat telah dibersihkan.
          </p>
        </div>
      ) : (
        <div className="border-2 border-slate-200 rounded-2xl overflow-hidden shadow-xs">
          <div className="bg-slate-100 px-4 py-2.5 border-b-2 border-slate-200 flex items-center justify-between">
            <span className="text-xs font-black uppercase text-slate-700 tracking-wider">
              Menampilkan {filteredItems.length} dari {items.length} Baris NIK Ganda
            </span>
            <span className="text-[10px] font-bold text-slate-400">
              (Baris Asal ⟷ Baris Duplikat)
            </span>
          </div>

          <div className="overflow-x-auto max-h-[600px]">
            <table className="w-full text-left text-xs min-w-[760px]">
              <thead className="bg-sky-100/90 text-sky-950 font-black text-[10px] uppercase sticky top-0 border-b border-sky-200 z-10">
                <tr>
                  <th className="py-3 px-3.5 whitespace-nowrap">Pasangan Baris Kembar</th>
                  <th className="py-3 px-3.5 whitespace-nowrap">NIK (16 Digit)</th>
                  <th className="py-3 px-3.5">Data Baris Asal (Pertama)</th>
                  <th className="py-3 px-3.5">Data Baris Ganda (Duplikat)</th>
                  <th className="py-3 px-3.5 text-center whitespace-nowrap">Status Analisis</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sky-100 bg-white font-medium">
                {filteredItems.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-400 font-bold">
                      Tidak ada data yang sesuai dengan pencarian / filter.
                    </td>
                  </tr>
                ) : (
                  filteredItems.map((r, idx) => {
                    const isExactSameName =
                      r.status_match === 'IDENTIK' ||
                      (r.nama &&
                        r.first_seen_name &&
                        r.nama.trim().toUpperCase() === r.first_seen_name.trim().toUpperCase());

                    return (
                      <tr key={idx} className="hover:bg-sky-50/70 transition-colors">
                        {/* Pasangan Baris Kembar */}
                        <td className="py-3.5 px-3.5 whitespace-nowrap align-middle">
                          <div className="flex items-center gap-1.5 font-black text-xs">
                            <span className="px-2.5 py-1 rounded-lg bg-sky-100 text-[#1899D6] border border-sky-200 shadow-2xs">
                              Baris #{r.first_seen_row_number || '-'}
                            </span>
                            <span className="text-slate-400 font-black">⟷</span>
                            <span className="px-2.5 py-1 rounded-lg bg-amber-100 text-amber-800 border border-amber-200 shadow-2xs">
                              Baris #{r.row_number || '-'}
                            </span>
                          </div>
                          <span className="text-[10px] text-slate-500 font-bold block mt-1">
                            Baris #{r.row_number} kembar dengan Baris #{r.first_seen_row_number}
                          </span>
                        </td>

                        {/* NIK */}
                        <td className="py-3.5 px-3.5 whitespace-nowrap font-mono align-middle">
                          <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 font-bold text-xs border border-slate-200 block text-center">
                            {r.nik}
                          </span>
                        </td>

                        {/* Data Baris Asal */}
                        <td className="py-3.5 px-3.5 align-middle">
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full bg-[#1CB0F6] shrink-0"></span>
                              <span className="font-black text-slate-900 uppercase text-xs">
                                {r.first_seen_name || '-'}
                              </span>
                            </div>
                            <div className="text-[11px] text-slate-500 font-medium pl-3.5 flex items-center gap-2 flex-wrap">
                              <span className="font-bold text-[#1899D6]">
                                {r.first_seen_tps_name || (r.tps?.nomor_tps ? `TPS ${r.tps.nomor_tps}` : '-')}
                              </span>
                              <span>•</span>
                              <span>
                                {r.first_seen_dusun || '-'} {r.first_seen_rt ? `RT ${r.first_seen_rt}` : ''} {r.first_seen_rw ? `RW ${r.first_seen_rw}` : ''}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Data Baris Ganda */}
                        <td className="py-3.5 px-3.5 align-middle">
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0"></span>
                              <span className="font-black text-slate-900 uppercase text-xs">
                                {r.nama}
                              </span>
                            </div>
                            <div className="text-[11px] text-slate-500 font-medium pl-3.5 flex items-center gap-2 flex-wrap">
                              <span className="font-bold text-amber-700">
                                {r.tps_name || (r.tps?.nomor_tps ? `TPS ${r.tps.nomor_tps}` : '-')}
                              </span>
                              <span>•</span>
                              <span>
                                {r.dusun || '-'} {r.rt ? `RT ${r.rt}` : ''} {r.rw ? `RW ${r.rw}` : ''}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Status Analisis */}
                        <td className="py-3.5 px-3.5 text-center whitespace-nowrap align-middle">
                          {isExactSameName ? (
                            <span className="px-2.5 py-1 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 font-black text-[10px] uppercase inline-flex items-center gap-1">
                              <Check className="w-3.5 h-3.5 stroke-[3]" />
                              <span>100% Identik</span>
                            </span>
                          ) : (
                            <span
                              className="px-2.5 py-1 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 font-black text-[10px] uppercase inline-flex items-center gap-1"
                              title="Data baris ganda telah memperbarui data baris pertama"
                            >
                              <AlertTriangle className="w-3.5 h-3.5 stroke-[2.5]" />
                              <span>Beda Nama (Diperbarui)</span>
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
