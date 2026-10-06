import React, { useState, useEffect } from 'react';
import { X, Save, RefreshCw, CheckCircle2, AlertCircle, Users, Database, Sparkles, RotateCcw } from 'lucide-react';
import { DpsRecapData, TpsItem } from '../types/pilkades';
import { DEFAULT_DPS_RECAP, applyTpsLocationsToRecap } from '../data/dpsRecapData';

interface RecapManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  recapData: DpsRecapData;
  tpsList: TpsItem[];
  appsScriptUrl?: string;
  onSaveRecap: (newRecap: DpsRecapData) => void;
  onResetRecap: () => void;
}

export const RecapManagerModal: React.FC<RecapManagerModalProps> = ({
  isOpen,
  onClose,
  recapData,
  tpsList,
  appsScriptUrl,
  onSaveRecap,
  onResetRecap
}) => {
  const [tpsStats, setTpsStats] = useState(recapData.tpsStats);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Sync state when modal opens or recapData changes
  useEffect(() => {
    if (isOpen) {
      const merged = applyTpsLocationsToRecap(recapData, tpsList);
      setTpsStats(merged.tpsStats);
      setSyncMessage(null);
      setErrorMessage(null);
    }
  }, [isOpen, recapData, tpsList]);

  if (!isOpen) return null;

  // Hitung total realtime
  const totalL = tpsStats.reduce((acc, curr) => acc + (Number(curr.lakiLaki) || 0), 0);
  const totalP = tpsStats.reduce((acc, curr) => acc + (Number(curr.perempuan) || 0), 0);
  const totalDps = totalL + totalP;

  const handleStatChange = (tpsKey: string, field: 'lakiLaki' | 'perempuan', valStr: string) => {
    const val = parseInt(valStr.replace(/\D/g, ''), 10) || 0;
    setTpsStats(prev =>
      prev.map(item => {
        if (item.tps === tpsKey) {
          const updated = {
            ...item,
            [field]: val
          };
          updated.total = updated.lakiLaki + updated.perempuan;
          return updated;
        }
        return item;
      })
    );
  };

  const handleFetchFromSpreadsheet = async () => {
    if (!appsScriptUrl) {
      setErrorMessage('Belum ada Link Spreadsheet atau Google Apps Script yang ditautkan. Buka "Pengaturan Sheets" untuk menautkannya.');
      return;
    }

    setIsSyncing(true);
    setSyncMessage(null);
    setErrorMessage(null);

    try {
      const isGas = appsScriptUrl.includes('/exec') || appsScriptUrl.includes('script.google.com');
      const isSheet = appsScriptUrl.includes('spreadsheets/d/');

      const res = await fetch('/api/get-dps-recap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gasUrl: isGas ? appsScriptUrl : undefined,
          spreadsheetUrl: isSheet ? appsScriptUrl : undefined
        })
      });

      if (!res.ok) {
        throw new Error(`Server merespons kode HTTP ${res.status}`);
      }

      const data = await res.json();
      if (data.success && data.recap) {
        setTpsStats(data.recap.tpsStats);
        setSyncMessage(`Berhasil menghitung langsung dari Spreadsheet: Total ${data.recap.totalDps.toLocaleString('id-ID')} pemilih (L: ${data.recap.totalLakiLaki.toLocaleString('id-ID')}, P: ${data.recap.totalPerempuan.toLocaleString('id-ID')})`);
      } else {
        setErrorMessage(data.message || 'Gagal menghitung rekap otomatis. Pastikan kolom Jenis Kelamin (L/P) dan TPS tersedia di spreadsheet.');
      }
    } catch (err: any) {
      setErrorMessage(`Kendala koneksi ke server spreadsheet: ${err.message || 'Error'}`);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleSave = () => {
    const newRecap: DpsRecapData = {
      totalDps,
      totalLakiLaki: totalL,
      totalPerempuan: totalP,
      tpsStats,
      lastUpdated: 'Diperbarui Administrator (' + new Date().toLocaleDateString('id-ID', { month: 'long', year: 'numeric' }) + ')'
    };
    onSaveRecap(newRecap);
    onClose();
  };

  const handleReset = () => {
    if (window.confirm('Kembalikan rincian Laki-laki & Perempuan ke standar resmi?')) {
      onResetRecap();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-amber-500/40 rounded-2xl sm:rounded-3xl shadow-[0_25px_70px_rgba(0,0,0,0.95)] max-w-3xl w-full max-h-[92vh] flex flex-col overflow-hidden text-slate-100">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-950 via-slate-950 to-slate-900 px-6 py-4.5 border-b border-amber-500/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/40 shadow-inner">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-white font-serif flex items-center gap-2">
                <span>Kelola & Koreksi Rekapitulasi DPS</span>
                <span className="text-[10px] bg-amber-500 text-slate-950 font-black px-2 py-0.5 rounded font-mono uppercase">
                  ADMIN
                </span>
              </h3>
              <p className="text-xs text-slate-300">
                Sesuaikan jumlah Laki-laki (L) dan Perempuan (P) per TPS sesuai data resmi desa.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition cursor-pointer"
            aria-label="Tutup"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1">
          {/* Quick Info & Spreadsheet Auto-Count */}
          <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="text-xs text-slate-300">
              <span className="font-bold text-amber-300 block mb-0.5">Sinkronisasi Otomatis dari Spreadsheet:</span>
              <span>Sistem dapat membaca dan menghitung langsung jumlah L & P dari baris data sheet pemilih.</span>
            </div>

            <button
              type="button"
              onClick={handleFetchFromSpreadsheet}
              disabled={isSyncing}
              className="px-3.5 py-2 bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-500/40 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shrink-0 cursor-pointer shadow-xs"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-emerald-400' : ''}`} />
              <span>{isSyncing ? 'Menghitung dari Sheet...' : 'Tarik Otomatis dari Sheet'}</span>
            </button>
          </div>

          {/* Toast Messages */}
          {syncMessage && (
            <div className="p-3 bg-emerald-950/80 border border-emerald-500 text-emerald-200 rounded-xl text-xs flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{syncMessage}</span>
            </div>
          )}

          {errorMessage && (
            <div className="p-3 bg-red-950/80 border border-red-500 text-red-200 rounded-xl text-xs flex items-center gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Form Per TPS (TPS 1 s/d TPS 5) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono">
                Rincian Pemilih Per TPS:
              </h4>
              <span className="text-[11px] text-slate-400 font-mono">5 TPS</span>
            </div>

            <div className="space-y-2.5">
              {tpsStats.map((item) => (
                <div
                  key={item.tps}
                  className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-slate-700 transition"
                >
                  <div className="sm:w-1/3">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="px-2 py-0.5 bg-amber-500 text-slate-950 font-black rounded font-mono text-xs">
                        {item.tps}
                      </span>
                      <span className="text-xs font-bold text-white font-serif">{item.lokasi}</span>
                    </div>
                    <span className="text-[11px] text-slate-400 font-mono block pl-1">
                      {item.dusun}
                    </span>
                  </div>

                  {/* Input L & P */}
                  <div className="flex items-center gap-3 sm:w-2/3 justify-end">
                    {/* Laki-laki */}
                    <div className="flex-1 sm:max-w-[130px]">
                      <label className="block text-[10px] font-mono font-bold text-sky-400 mb-1">
                        👨 Laki-laki (L):
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={item.lakiLaki}
                        onChange={(e) => handleStatChange(item.tps, 'lakiLaki', e.target.value)}
                        className="w-full bg-slate-900 border border-sky-500/40 rounded-lg px-3 py-1.5 text-xs font-mono font-bold text-sky-200 focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400"
                      />
                    </div>

                    {/* Perempuan */}
                    <div className="flex-1 sm:max-w-[130px]">
                      <label className="block text-[10px] font-mono font-bold text-rose-400 mb-1">
                        👩 Perempuan (P):
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={item.perempuan}
                        onChange={(e) => handleStatChange(item.tps, 'perempuan', e.target.value)}
                        className="w-full bg-slate-900 border border-rose-500/40 rounded-lg px-3 py-1.5 text-xs font-mono font-bold text-rose-200 focus:outline-none focus:border-rose-400 focus:ring-1 focus:ring-rose-400"
                      />
                    </div>

                    {/* Subtotal */}
                    <div className="text-right sm:min-w-[90px] pl-2 border-l border-slate-800">
                      <span className="block text-[10px] font-mono text-slate-400">Total TPS:</span>
                      <span className="text-sm font-black font-mono text-amber-300">
                        {(item.lakiLaki + item.perempuan).toLocaleString('id-ID')}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Real-time Calculation Summary Box */}
          <div className="bg-gradient-to-r from-amber-950/60 via-slate-950 to-slate-900 p-4 rounded-xl border border-amber-500/40 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase text-amber-300 font-mono flex items-center gap-1.5">
                <Database className="w-4 h-4 text-amber-400" />
                TOTAL HASIL PERHITUNGAN:
              </span>
              <div className="text-right">
                <span className="text-lg font-black font-mono text-amber-400">
                  {totalDps.toLocaleString('id-ID')}
                </span>
                <span className="text-xs text-amber-300 font-mono ml-1.5">Pemilih</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-2 border-t border-slate-800">
              <div className="flex items-center justify-between bg-slate-900/80 px-3 py-2 rounded-lg border border-sky-500/30">
                <span className="text-sky-300">👨 Total Laki-laki:</span>
                <strong className="text-white text-sm">{totalL.toLocaleString('id-ID')}</strong>
              </div>
              <div className="flex items-center justify-between bg-slate-900/80 px-3 py-2 rounded-lg border border-rose-500/30">
                <span className="text-rose-300">👩 Total Perempuan:</span>
                <strong className="text-white text-sm">{totalP.toLocaleString('id-ID')}</strong>
              </div>
            </div>

            {totalDps === 7794 ? (
              <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-mono pt-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Total tepat 7.794 sesuai data resmi DPS.</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-xs text-amber-400 font-mono pt-1">
                <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
                <span>Catatan: Total saat ini adalah {totalDps.toLocaleString('id-ID')} (Target DPS resmi: 7.794).</span>
              </div>
            )}
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="bg-slate-950 px-6 py-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleReset}
            className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white rounded-xl text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset ke Standar</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-semibold transition cursor-pointer"
            >
              Batal
            </button>

            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 rounded-xl text-xs font-black shadow-lg transition flex items-center gap-2 cursor-pointer"
            >
              <Save className="w-3.5 h-3.5 text-slate-950" />
              <span>Simpan Rekapitulasi</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
