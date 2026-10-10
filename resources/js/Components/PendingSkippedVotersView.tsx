import React, { useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Trash2,
  Save,
  Search,
  Download,
  RotateCcw,
  Sparkles,
  ArrowRight,
  User,
  MapPin,
  Calendar,
  AlertCircle,
  RefreshCw,
  Eye,
  Check
} from 'lucide-react';
import * as XLSX from 'xlsx';

export interface PendingSkippedVoterItem {
  id: number;
  row_number?: number;
  nik?: string;
  nama?: string;
  jenis_kelamin: 'L' | 'P';
  tempat_lahir?: string;
  tanggal_lahir?: string;
  dusun?: string;
  rt?: string;
  rw?: string;
  tps_id?: number | null;
  tps_name?: string;
  status?: string;
  keterangan?: string;
  reason?: string;
  tps?: {
    id: number;
    nomor_tps: string;
    nama_lokasi: string;
    dusun: string;
  };
}

interface PendingSkippedVotersViewProps {
  initialPendingVoters: PendingSkippedVoterItem[];
  allTpsOptions: {
    id: number;
    nomor_tps: string;
    nama_lokasi: string;
    dusun: string;
  }[];
  onNavigateToDps: () => void;
  onCountChange?: (count: number) => void;
}

export const PendingSkippedVotersView: React.FC<PendingSkippedVotersViewProps> = ({
  initialPendingVoters,
  allTpsOptions,
  onNavigateToDps,
  onCountChange,
}) => {
  const [items, setItems] = useState<PendingSkippedVoterItem[]>(initialPendingVoters);
  const [searchQuery, setSearchQuery] = useState('');
  const [savingId, setSavingId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [successSavedIds, setSuccessSavedIds] = useState<number[]>([]);
  const [errorMessages, setErrorMessages] = useState<{ [id: number]: string }>({});
  const [isClearingAll, setIsClearingAll] = useState(false);

  // Filter items based on search query
  const filteredItems = items.filter((item) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      (item.nama && item.nama.toLowerCase().includes(q)) ||
      (item.nik && item.nik.toLowerCase().includes(q)) ||
      (item.dusun && item.dusun.toLowerCase().includes(q)) ||
      (item.reason && item.reason.toLowerCase().includes(q)) ||
      (item.row_number && String(item.row_number).includes(q))
    );
  });

  const updateItemField = (id: number, field: keyof PendingSkippedVoterItem, value: any) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return { ...item, [field]: value };
        }
        return item;
      })
    );
    // Hapus error jika ada perubahan
    if (errorMessages[id]) {
      setErrorMessages((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
    }
  };

  /**
   * Simpan satu baris data terlewat ke DPS permanen
   */
  const handleSaveItem = async (item: PendingSkippedVoterItem) => {
    const cleanNik = String(item.nik || '').replace(/\D/g, '');
    if (cleanNik.length !== 16) {
      setErrorMessages((prev) => ({
        ...prev,
        [item.id]: `NIK harus tepat 16 digit angka (saat ini ${cleanNik.length} digit).`,
      }));
      return;
    }

    if (!item.nama || !item.nama.trim() || item.nama === '(kosong)') {
      setErrorMessages((prev) => ({
        ...prev,
        [item.id]: 'Nama lengkap pemilih wajib diisi.',
      }));
      return;
    }

    const matchedTpsId = item.tps_id || allTpsOptions[0]?.id;
    if (!matchedTpsId) {
      setErrorMessages((prev) => ({
        ...prev,
        [item.id]: 'Pilih lokasi TPS yang valid.',
      }));
      return;
    }

    setSavingId(item.id);
    setErrorMessages((prev) => {
      const next = { ...prev };
      delete next[item.id];
      return next;
    });

    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';

    try {
      const response = await fetch(`/admin/voters/pending-save/${item.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-CSRF-TOKEN': csrfToken,
          'X-Requested-With': 'XMLHttpRequest',
        },
        body: JSON.stringify({
          nik: cleanNik,
          nama: item.nama.trim(),
          jenis_kelamin: item.jenis_kelamin || 'L',
          tps_id: matchedTpsId,
          dusun: item.dusun || '',
          rt: item.rt || '',
          rw: item.rw || '',
          tempat_lahir: item.tempat_lahir || '',
          tanggal_lahir: item.tanggal_lahir || '',
          keterangan: item.keterangan || '',
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Gagal menyimpan pemilih ke DPS.');
      }

      // Mainkan efek sukses pada kartu
      setSuccessSavedIds((prev) => [...prev, item.id]);
      setSavingId(null);

      setTimeout(() => {
        setItems((prev) => {
          const updated = prev.filter((i) => i.id !== item.id);
          if (onCountChange) onCountChange(updated.length);
          return updated;
        });
      }, 700);
    } catch (err: any) {
      setSavingId(null);
      setErrorMessages((prev) => ({
        ...prev,
        [item.id]: err.message || 'Terjadi kesalahan saat menyimpan.',
      }));
    }
  };

  /**
   * Hapus / batalkan draft satu kartu
   */
  const handleDeleteItem = async (item: PendingSkippedVoterItem) => {
    if (!confirm(`Hapus kartu data pemilih ${item.nama || 'Baris #' + item.row_number} dari daftar terlewat?`)) {
      return;
    }

    setDeletingId(item.id);
    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';

    try {
      const response = await fetch(`/admin/voters/pending-delete/${item.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-CSRF-TOKEN': csrfToken,
          'X-Requested-With': 'XMLHttpRequest',
        },
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Gagal menghapus data.');
      }

      setItems((prev) => {
        const updated = prev.filter((i) => i.id !== item.id);
        if (onCountChange) onCountChange(updated.length);
        return updated;
      });
      setDeletingId(null);
    } catch (err: any) {
      setDeletingId(null);
      alert(err.message || 'Gagal menghapus data.');
    }
  };

  /**
   * Bersihkan semua draft data terlewat
   */
  const handleClearAll = async () => {
    if (
      !confirm(
        `PERINGATAN: Apakah Anda yakin ingin membersihkan dan menghapus SELURUH ${items.length} data pemilih terlewat ini? Tindakan ini tidak dapat dibatalkan.`
      )
    ) {
      return;
    }

    setIsClearingAll(true);
    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';

    try {
      const response = await fetch('/admin/voters/pending-clear-all', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-CSRF-TOKEN': csrfToken,
          'X-Requested-With': 'XMLHttpRequest',
        },
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Gagal membersihkan data.');
      }

      setItems([]);
      if (onCountChange) onCountChange(0);
      setIsClearingAll(false);
    } catch (err: any) {
      setIsClearingAll(false);
      alert(err.message || 'Gagal membersihkan data.');
    }
  };

  /**
   * Unduh seluruh data terlewat ke Excel (.xlsx)
   */
  const handleExportExcel = () => {
    if (items.length === 0) return;

    const exportRows = items.map((r, idx) => ({
      'No': idx + 1,
      'Baris Excel Asli': r.row_number ? `Baris #${r.row_number}` : '-',
      'NIK Terdeteksi': r.nik || '',
      'Nama Pemilih': r.nama || '',
      'Jenis Kelamin': r.jenis_kelamin || 'L',
      'TPS Tujuan': r.tps ? `TPS ${r.tps.nomor_tps} - ${r.tps.dusun}` : (r.tps_name || 'TPS 1'),
      'Dusun': r.dusun || '',
      'RT': r.rt || '',
      'RW': r.rw || '',
      'Tempat Lahir': r.tempat_lahir || '',
      'Tanggal Lahir': r.tanggal_lahir || '',
      'Alasan Dilewati': r.reason || 'Data tidak lengkap',
    }));

    const ws = XLSX.utils.json_to_sheet(exportRows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Data Terlewat');

    const fileName = `Daftar_Pemilih_Terlewat_Pilkades_Gunungjaya_${new Date().toISOString().slice(0, 10)}.xlsx`;
    XLSX.writeFile(wb, fileName);
  };

  // TAMPILAN JIKA TIDAK ADA DATA TERLEWAT (SUDAH BERSIH / SELESAI)
  if (items.length === 0) {
    return (
      <div className="bg-white border-2 border-b-4 border-slate-200 rounded-3xl p-8 sm:p-12 text-center space-y-5 shadow-xs animate-in fade-in duration-200">
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#E5F9D2] border-2 border-[#58CC02] text-[#58CC02] flex items-center justify-center mx-auto shadow-sm animate-bounce">
          <Check className="w-9 h-9 sm:w-11 sm:h-11 stroke-[3]" />
        </div>

        <div className="space-y-2 max-w-lg mx-auto">
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Tidak Ada Data Pemilih yang Terlewat!
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 font-bold leading-relaxed">
            Semua data dari file Excel telah berhasil diproses dan disimpan ke Daftar Pemilih Sementara (DPS).
          </p>
        </div>

        <div className="pt-2">
          <button
            type="button"
            onClick={onNavigateToDps}
            className="px-6 py-3.5 rounded-2xl bg-[#58CC02] hover:bg-[#4ebb02] text-white font-black text-xs sm:text-sm uppercase tracking-wider border-b-4 border-[#46A302] active:border-b-0 active:translate-y-1 transition-all shadow-md inline-flex items-center gap-2 cursor-pointer"
          >
            <span>Buka Daftar Pemilih (DPS)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5 min-w-0">
      
      {/* Banner & Header Penjelasan */}
      <div className="bg-amber-50 border-2 border-b-4 border-amber-300 rounded-3xl p-4 sm:p-6 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3.5 min-w-0">
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-[#FF9600] text-white flex items-center justify-center shadow-xs shrink-0">
            <AlertTriangle className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div className="min-w-0 space-y-0.5">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base sm:text-lg font-black text-amber-950 uppercase tracking-tight">
                Data Pemilih Terlewat ({items.length} Orang)
              </h2>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-200 text-amber-900 font-black text-[10px] uppercase tracking-wider">
                Perlu Dilengkapi
              </span>
            </div>
            <p className="text-xs sm:text-sm text-amber-900/80 font-bold leading-relaxed">
              Lengkapi NIK / Nama yang kurang langsung pada kartu di bawah. Data otomatis masuk ke DPS dan kartu menghilang saat Anda klik <strong>Simpan</strong>.
            </p>
          </div>
        </div>

        {/* Action Toolbar */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleExportExcel}
            className="px-4 py-2.5 rounded-2xl bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs uppercase tracking-wider border-2 border-slate-200 hover:border-slate-300 active:translate-y-0.5 shadow-2xs transition flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-amber-600" />
            <span>Unduh Excel ({items.length})</span>
          </button>

          <button
            type="button"
            onClick={handleClearAll}
            disabled={isClearingAll}
            className="px-4 py-2.5 rounded-2xl bg-[#FFE5E5] hover:bg-[#ffd1d1] text-[#EA2B2B] font-black text-xs uppercase tracking-wider border-2 border-[#EA2B2B]/30 hover:border-[#EA2B2B] active:translate-y-0.5 shadow-2xs transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Bersihkan Semua</span>
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 sm:p-4 rounded-2xl border-2 border-slate-200 shadow-2xs">
        <div className="relative w-full sm:max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari berdasarkan nama, NIK, dusun, atau nomor baris..."
            className="w-full pl-9 pr-4 py-2 text-xs font-bold text-slate-800 bg-slate-50 border-2 border-slate-200 rounded-xl focus:bg-white focus:border-[#58CC02] focus:ring-0 transition"
          />
        </div>

        <span className="text-xs font-black text-slate-500 self-end sm:self-auto">
          Menampilkan {filteredItems.length} dari {items.length} kartu terlewat
        </span>
      </div>

      {/* Grid of Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredItems.map((item) => {
          const rawNik = String(item.nik || '').replace(/\D/g, '');
          const isNikValid = rawNik.length === 16;
          const isSaved = successSavedIds.includes(item.id);
          const isSaving = savingId === item.id;
          const isDeleting = deletingId === item.id;
          const errorMsg = errorMessages[item.id];

          if (isSaved) {
            return (
              <div
                key={item.id}
                className="bg-[#E5F9D2] border-2 border-[#58CC02] rounded-3xl p-6 text-center space-y-3 shadow-sm transition-all animate-out fade-out zoom-out-95 duration-500"
              >
                <div className="w-10 h-10 rounded-full bg-[#58CC02] text-white flex items-center justify-center mx-auto shadow-xs">
                  <Check className="w-6 h-6 stroke-[3]" />
                </div>
                <div>
                  <h4 className="font-black text-slate-900 text-sm uppercase">{item.nama}</h4>
                  <p className="text-[11px] font-bold text-[#2E6B01] mt-0.5">
                    Berhasil tersimpan ke Daftar Pemilih Sementara (DPS)!
                  </p>
                </div>
              </div>
            );
          }

          return (
            <div
              key={item.id}
              className="bg-white border-2 border-b-4 border-slate-200 hover:border-amber-300 rounded-3xl p-4 sm:p-5 shadow-xs flex flex-col justify-between transition-all group"
            >
              <div className="space-y-3.5">
                
                {/* Header Kartu: Baris Excel, Alasan & Tombol Hapus */}
                <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-2.5">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="px-2.5 py-1 rounded-xl bg-amber-100 text-amber-900 font-black text-[10px] uppercase tracking-wider">
                      Baris #{item.row_number || '-'}
                    </span>
                    <span className="px-2 py-0.5 rounded-lg bg-slate-100 text-slate-600 font-bold text-[10px]">
                      Excel Draft
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDeleteItem(item)}
                    disabled={isDeleting || isSaving}
                    className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-red-50 text-slate-400 hover:text-red-600 flex items-center justify-center transition cursor-pointer"
                    title="Hapus / Abaikan data ini"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Info Alasan Terlewat */}
                <div className="p-2.5 rounded-xl bg-amber-50/80 border border-amber-200 text-amber-900 text-[11px] font-bold flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span className="leading-snug">{item.reason || 'Data pemilih belum lengkap'}</span>
                </div>

                {/* Error Banner jika ada kesalahan simpan */}
                {errorMsg && (
                  <div className="p-2.5 rounded-xl bg-red-100 border border-red-300 text-red-700 text-[11px] font-black leading-snug">
                    {errorMsg}
                  </div>
                )}

                {/* Form Fields In-Card */}
                <div className="space-y-2.5 text-left">
                  
                  {/* Field NIK */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] font-black uppercase tracking-wider text-slate-700">
                        Nomor NIK (16 Digit):
                      </label>
                      <span
                        className={`text-[9px] font-black px-1.5 py-0.5 rounded-md ${
                          isNikValid
                            ? 'bg-[#E5F9D2] text-[#46A302]'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {rawNik.length} / 16
                      </span>
                    </div>
                    <input
                      type="text"
                      maxLength={16}
                      value={item.nik || ''}
                      onChange={(e) => updateItemField(item.id, 'nik', e.target.value.replace(/\D/g, '').slice(0, 16))}
                      placeholder="Masukkan 16 digit NIK..."
                      className={`w-full px-3 py-2 text-xs font-mono font-bold rounded-xl border-2 transition ${
                        isNikValid
                          ? 'border-[#58CC02] bg-[#58CC02]/5 text-slate-900'
                          : 'border-amber-300 bg-amber-50/30 text-amber-950 focus:border-amber-500'
                      }`}
                    />
                  </div>

                  {/* Field Nama */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-wider text-slate-700">
                      Nama Lengkap:
                    </label>
                    <input
                      type="text"
                      value={item.nama === '(kosong)' ? '' : (item.nama || '')}
                      onChange={(e) => updateItemField(item.id, 'nama', e.target.value)}
                      placeholder="Nama lengkap pemilih..."
                      className="w-full px-3 py-2 text-xs font-bold uppercase rounded-xl border-2 border-slate-200 focus:border-[#58CC02] focus:ring-0 text-slate-900"
                    />
                  </div>

                  {/* Field JK & TPS */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase tracking-wider text-slate-700">
                        Jenis Kelamin:
                      </label>
                      <select
                        value={item.jenis_kelamin || 'L'}
                        onChange={(e) => updateItemField(item.id, 'jenis_kelamin', e.target.value)}
                        className="w-full px-2.5 py-2 text-xs font-bold rounded-xl border-2 border-slate-200 bg-white"
                      >
                        <option value="L">LAKI-LAKI (L)</option>
                        <option value="P">PEREMPUAN (P)</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase tracking-wider text-slate-700">
                        Lokasi TPS:
                      </label>
                      <select
                        value={item.tps_id || (allTpsOptions[0]?.id || '')}
                        onChange={(e) => updateItemField(item.id, 'tps_id', Number(e.target.value))}
                        className="w-full px-2.5 py-2 text-xs font-bold rounded-xl border-2 border-slate-200 bg-white"
                      >
                        {allTpsOptions.map((tps) => (
                          <option key={tps.id} value={tps.id}>
                            TPS {tps.nomor_tps} - {tps.dusun}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Dusun, RT, RW */}
                  <div className="grid grid-cols-3 gap-1.5">
                    <div className="space-y-0.5">
                      <label className="text-[9px] font-black uppercase text-slate-500">Dusun:</label>
                      <input
                        type="text"
                        value={item.dusun || ''}
                        onChange={(e) => updateItemField(item.id, 'dusun', e.target.value)}
                        placeholder="Dusun..."
                        className="w-full px-2 py-1.5 text-xs font-bold uppercase rounded-lg border-2 border-slate-200"
                      />
                    </div>
                    <div className="space-y-0.5">
                      <label className="text-[9px] font-black uppercase text-slate-500">RT:</label>
                      <input
                        type="text"
                        value={item.rt || ''}
                        onChange={(e) => updateItemField(item.id, 'rt', e.target.value)}
                        placeholder="001"
                        className="w-full px-2 py-1.5 text-xs font-bold rounded-lg border-2 border-slate-200"
                      />
                    </div>
                    <div className="space-y-0.5">
                      <label className="text-[9px] font-black uppercase text-slate-500">RW:</label>
                      <input
                        type="text"
                        value={item.rw || ''}
                        onChange={(e) => updateItemField(item.id, 'rw', e.target.value)}
                        placeholder="001"
                        className="w-full px-2 py-1.5 text-xs font-bold rounded-lg border-2 border-slate-200"
                      />
                    </div>
                  </div>

                </div>
              </div>

              {/* Card Footer Action: Simpan ke DPS */}
              <div className="pt-4 mt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => handleSaveItem(item)}
                  disabled={isSaving || isDeleting}
                  className="w-full py-2.5 px-4 rounded-2xl bg-[#58CC02] hover:bg-[#4ebb02] text-white font-black text-xs uppercase tracking-wider border-b-4 border-[#46A302] active:border-b-0 active:translate-y-1 shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {isSaving ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Menyimpan ke DPS...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-3.5 h-3.5" />
                      <span>Simpan ke DPS</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
