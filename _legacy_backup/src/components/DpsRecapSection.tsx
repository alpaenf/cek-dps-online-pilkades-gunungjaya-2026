import React, { useState } from 'react';
import { Users, CheckCircle2, ChevronDown, ChevronUp, MapPin, Database, Award, Edit3 } from 'lucide-react';
import { DpsRecapData, TpsItem } from '../types/pilkades';
import { DEFAULT_DPS_RECAP, applyTpsLocationsToRecap } from '../data/dpsRecapData';

interface DpsRecapSectionProps {
  recapData?: DpsRecapData;
  tpsList?: TpsItem[];
  namaDesa?: string;
  namaKecamatan?: string;
  namaKabupaten?: string;
  isAdmin?: boolean;
  onOpenEditRecap?: () => void;
}

export const DpsRecapSection: React.FC<DpsRecapSectionProps> = ({
  recapData = DEFAULT_DPS_RECAP,
  tpsList,
  namaDesa = 'Gunungjaya',
  namaKecamatan = 'Belik',
  namaKabupaten = 'Pemalang',
  isAdmin = false,
  onOpenEditRecap
}) => {
  const [isTableExpanded, setIsTableExpanded] = useState(true);

  // Ambil nama TPS & Dusun langsung dari Data Lokasi TPS (tpsList)
  const currentRecap = applyTpsLocationsToRecap(recapData || DEFAULT_DPS_RECAP, tpsList);

  const totalDps = currentRecap.totalDps;
  const totalL = currentRecap.totalLakiLaki;
  const totalP = currentRecap.totalPerempuan;

  const pctL = totalDps > 0 ? ((totalL / totalDps) * 100).toFixed(1) : '50.1';
  const pctP = totalDps > 0 ? ((totalP / totalDps) * 100).toFixed(1) : '49.9';

  return (
    <section className="mt-8 sm:mt-12 mb-6">
      <div className="bg-gradient-to-b from-slate-900/95 via-slate-950/98 to-black/98 backdrop-blur-2xl rounded-2xl sm:rounded-3xl p-5 sm:p-7 shadow-[0_25px_60px_rgba(0,0,0,0.95),inset_0_1px_1px_rgba(255,255,255,0.18)] border border-white/15 relative overflow-hidden">
        {/* Glow Accent Top Bar */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-500 via-yellow-400 to-emerald-500 shadow-[0_0_18px_rgba(245,158,11,0.5)]" />

        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500 text-slate-950 text-[10px] font-black uppercase tracking-wider font-mono flex items-center gap-1 shadow-xs">
                <Database className="w-3 h-3 text-slate-950" />
                DATABASE RESMI PILKADES
              </span>
              <span className="text-[10px] font-mono font-semibold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30">
                TAHAPAN DPS 2026
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-black text-white font-serif tracking-tight flex items-center gap-2">
              <span>Rekapitulasi Data Pemilih Sementara (DPS)</span>
            </h3>
            <p className="text-xs text-slate-300 mt-0.5">
              Desa {namaDesa}, Kec. {namaKecamatan}, Kab. {namaKabupaten} • Tersebar di 5 TPS
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            {isAdmin && onOpenEditRecap && (
              <button
                type="button"
                onClick={onOpenEditRecap}
                className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black transition flex items-center gap-1.5 shadow-md cursor-pointer"
                title="Koreksi rincian Laki-laki & Perempuan DPS"
              >
                <Edit3 className="w-3.5 h-3.5 text-slate-950" />
                <span>Koreksi Angka DPS</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setIsTableExpanded(!isTableExpanded)}
              className="px-3.5 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/80 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
            >
              <span>{isTableExpanded ? 'Sembunyikan Rincian' : 'Lihat Rincian Per TPS'}</span>
              {isTableExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* 3 Main Stat Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4 mb-6">
          {/* 1. Total DPS (7.794 Jiwa) */}
          <div className="bg-gradient-to-br from-amber-950/50 via-slate-950/90 to-slate-900/90 p-4 sm:p-5 rounded-2xl border border-amber-500/40 shadow-lg relative overflow-hidden group">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-300 font-mono">
                TOTAL DPS TERDAFTAR
              </span>
              <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center border border-amber-500/40 shadow-inner">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-black text-white font-mono tracking-tight">
                {totalDps.toLocaleString('id-ID')}
              </span>
              <span className="text-xs font-bold text-amber-400">Jiwa / Pemilih</span>
            </div>
            <div className="mt-2 flex items-center gap-1.5 text-[11px] text-slate-300 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>100% Hak Suara Resmi (5 Dusun)</span>
            </div>
          </div>

          {/* 2. Laki-laki (3.908) */}
          <div className="bg-gradient-to-br from-sky-950/50 via-slate-950/90 to-slate-900/90 p-4 sm:p-5 rounded-2xl border border-sky-500/35 shadow-lg relative overflow-hidden group">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-sky-300 font-mono">
                PEMILIH LAKI-LAKI (L)
              </span>
              <div className="w-8 h-8 rounded-xl bg-sky-500/20 text-sky-300 flex items-center justify-center border border-sky-500/40 shadow-inner">
                <span className="text-xs font-black">👨 L</span>
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-black text-white font-mono tracking-tight">
                {totalL.toLocaleString('id-ID')}
              </span>
              <span className="text-xs font-bold text-sky-400">({pctL}%)</span>
            </div>
            {/* Progress bar */}
            <div className="mt-2.5 w-full bg-slate-900 rounded-full h-1.5 overflow-hidden border border-slate-800">
              <div className="bg-sky-400 h-full rounded-full transition-all duration-500" style={{ width: `${pctL}%` }} />
            </div>
          </div>

          {/* 3. Perempuan (3.886) */}
          <div className="bg-gradient-to-br from-rose-950/50 via-slate-950/90 to-slate-900/90 p-4 sm:p-5 rounded-2xl border border-rose-500/35 shadow-lg relative overflow-hidden group">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-300 font-mono">
                PEMILIH PEREMPUAN (P)
              </span>
              <div className="w-8 h-8 rounded-xl bg-rose-500/20 text-rose-300 flex items-center justify-center border border-rose-500/40 shadow-inner">
                <span className="text-xs font-black">👩 P</span>
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-black text-white font-mono tracking-tight">
                {totalP.toLocaleString('id-ID')}
              </span>
              <span className="text-xs font-bold text-rose-400">({pctP}%)</span>
            </div>
            {/* Progress bar */}
            <div className="mt-2.5 w-full bg-slate-900 rounded-full h-1.5 overflow-hidden border border-slate-800">
              <div className="bg-rose-400 h-full rounded-full transition-all duration-500" style={{ width: `${pctP}%` }} />
            </div>
          </div>
        </div>

        {/* Tabel / Kartu Rincian Per TPS (TPS 1 s/d TPS 5) */}
        {isTableExpanded && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <h4 className="text-xs sm:text-sm font-bold text-slate-200 uppercase tracking-wider font-mono flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-amber-400" />
                <span>Rincian DPS Terdaftar Per TPS (Nama Diambil dari Data Lokasi TPS):</span>
              </h4>
              <span className="text-[11px] text-amber-300 font-mono">5 Tempat Pemungutan Suara</span>
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/90 shadow-md">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-900/90 text-slate-300 border-b border-slate-800 font-mono uppercase text-[11px]">
                    <th className="py-3 px-4 font-bold">No. TPS</th>
                    <th className="py-3 px-4 font-bold">Nama Lokasi TPS & Dusun (Data Lokasi)</th>
                    <th className="py-3 px-4 text-center font-bold text-sky-400">Laki-laki (L)</th>
                    <th className="py-3 px-4 text-center font-bold text-rose-400">Perempuan (P)</th>
                    <th className="py-3 px-4 text-right font-bold text-amber-300">Total DPS</th>
                    <th className="py-3 px-4 text-right font-bold text-slate-400">Proporsi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-850">
                  {currentRecap.tpsStats.map((item) => {
                    const tpsPct = totalDps > 0 ? ((item.total / totalDps) * 100).toFixed(1) : '0';
                    return (
                      <tr key={item.tps} className="hover:bg-slate-900/50 transition-colors">
                        <td className="py-3.5 px-4 font-bold font-mono">
                          <span className="px-2.5 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-lg">
                            {item.tps}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                            <span className="font-bold text-white text-sm block">{item.lokasi}</span>
                          </div>
                          <span className="text-slate-400 text-[11px] font-mono block pl-5.5 mt-0.5">
                            {item.dusun}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-center font-mono font-bold text-sky-300">
                          {item.lakiLaki.toLocaleString('id-ID')}
                        </td>
                        <td className="py-3.5 px-4 text-center font-mono font-bold text-rose-300">
                          {item.perempuan.toLocaleString('id-ID')}
                        </td>
                        <td className="py-3.5 px-4 text-right font-mono font-black text-amber-300 text-sm">
                          {item.total.toLocaleString('id-ID')}
                        </td>
                        <td className="py-3.5 px-4 text-right font-mono text-slate-400">
                          {tpsPct}%
                        </td>
                      </tr>
                    );
                  })}
                  {/* Total Summary Row */}
                  <tr className="bg-slate-900/90 border-t-2 border-amber-500/40 text-white font-bold font-mono">
                    <td colSpan={2} className="py-3.5 px-4 text-xs font-black uppercase text-amber-300">
                      TOTAL REKAPITULASI DESA GUNUNGJAYA
                    </td>
                    <td className="py-3.5 px-4 text-center text-sky-300 font-black text-sm">
                      {totalL.toLocaleString('id-ID')}
                    </td>
                    <td className="py-3.5 px-4 text-center text-rose-300 font-black text-sm">
                      {totalP.toLocaleString('id-ID')}
                    </td>
                    <td className="py-3.5 px-4 text-right text-amber-400 font-black text-base">
                      {totalDps.toLocaleString('id-ID')}
                    </td>
                    <td className="py-3.5 px-4 text-right text-emerald-400 font-black">
                      100%
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Mobile Card-Based Grid View */}
            <div className="md:hidden space-y-2.5">
              {currentRecap.tpsStats.map((item) => (
                <div
                  key={item.tps}
                  className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 space-y-2 shadow-xs"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2">
                      <span className="px-2.5 py-0.5 bg-amber-500 text-slate-950 font-black rounded font-mono text-xs shrink-0 mt-0.5">
                        {item.tps}
                      </span>
                      <div>
                        <span className="text-xs font-bold text-white font-serif block leading-snug">{item.lokasi}</span>
                        <span className="text-slate-400 text-[11px] font-mono mt-0.5 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-amber-400 shrink-0" />
                          <span>{item.dusun}</span>
                        </span>
                      </div>
                    </div>
                    <span className="text-xs font-black font-mono text-amber-300 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-500/40 shrink-0">
                      {item.total.toLocaleString('id-ID')}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-900 text-slate-300 font-mono">
                    <span className="text-slate-400 text-[10px]">Data Pemilih:</span>
                    <div className="flex items-center gap-3">
                      <span className="text-sky-300">👨 L: <strong>{item.lakiLaki.toLocaleString('id-ID')}</strong></span>
                      <span className="text-rose-300">👩 P: <strong>{item.perempuan.toLocaleString('id-ID')}</strong></span>
                    </div>
                  </div>
                </div>
              ))}

              {/* Mobile Total Card */}
              <div className="bg-gradient-to-r from-amber-950/70 via-slate-950 to-slate-900 p-3.5 rounded-xl border-2 border-amber-500/50 text-white space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase text-amber-300 font-mono">
                    TOTAL KESELURUHAN (5 TPS)
                  </span>
                  <span className="text-base font-black font-mono text-amber-400">
                    {totalDps.toLocaleString('id-ID')}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs font-mono pt-1 border-t border-slate-800">
                  <span className="text-sky-300">Total Laki-laki: <strong>{totalL.toLocaleString('id-ID')}</strong> ({pctL}%)</span>
                  <span className="text-rose-300">Total Perempuan: <strong>{totalP.toLocaleString('id-ID')}</strong> ({pctP}%)</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer Note */}
        <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-400 font-sans">
          <div className="flex items-center gap-1.5 text-center sm:text-left">
            <Award className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>Rekapitulasi resmi Panitia Pemilihan Kepala Desa (P2KD) Gunungjaya Tahun 2026.</span>
          </div>
          <span className="font-mono text-amber-300/80 text-[10px]">
            Diperbarui: {currentRecap.lastUpdated || 'Tahapan DPS 2026'}
          </span>
        </div>
      </div>
    </section>
  );
};
