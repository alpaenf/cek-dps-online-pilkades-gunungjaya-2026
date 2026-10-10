import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import { Users, CheckCircle2, ChevronDown, ChevronUp, MapPin, Database, Award, Edit3, BarChart3, User } from 'lucide-react';
import { DpsRecapData, TpsItem } from '../types/pilkades';
import { applyTpsLocationsToRecap } from '../data/dpsRecapData';

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
  recapData,
  tpsList,
  namaDesa = 'Gunungjaya',
  namaKecamatan = 'Belik',
  namaKabupaten = 'Pemalang',
  isAdmin = false,
  onOpenEditRecap
}) => {
  const [isTableExpanded, setIsTableExpanded] = useState(true);

  const emptyRecap: DpsRecapData = {
    totalDps: 0,
    totalLakiLaki: 0,
    totalPerempuan: 0,
    lastUpdated: 'Real-time Database',
    tpsStats: []
  };

  const currentRecap = applyTpsLocationsToRecap(recapData || emptyRecap, tpsList);

  const totalDps = currentRecap.totalDps;
  const totalL = currentRecap.totalLakiLaki;
  const totalP = currentRecap.totalPerempuan;

  const pctL = totalDps > 0 ? ((totalL / totalDps) * 100).toFixed(1) : '0';
  const pctP = totalDps > 0 ? ((totalP / totalDps) * 100).toFixed(1) : '0';

  return (
    <section className="mt-8 sm:mt-10 mb-6">
      <div className="bg-white border-2 border-b-4 border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-5 border-b-2 border-slate-100">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-xl bg-[#E5F9D2] text-[#46A302] border border-[#58CC02]/40 text-xs font-black uppercase tracking-wider flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5" />
                Rekapitulasi Resmi
              </span>
              <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-xl border border-slate-200">
                Tahapan DPS 2026
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Rekapitulasi Data Pemilih Sementara (DPS)
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
              Desa {namaDesa}, Kec. {namaKecamatan}, Kab. {namaKabupaten} • Tersebar di 5 TPS
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setIsTableExpanded(!isTableExpanded)}
              className="px-4 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-black border-2 border-b-4 border-slate-200 text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span>{isTableExpanded ? 'Tutup Rincian' : 'Rincian Per TPS'}</span>
              {isTableExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* 3 Main Stat Metric Cards (Duolingo Tactile 3D Cards) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          {/* 1. Total DPS */}
          <div className="bg-[#E5F9D2]/40 border-2 border-b-4 border-[#58CC02] p-5 rounded-3xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-black uppercase tracking-wider text-[#46A302]">
                Total DPS Terdaftar
              </span>
              <div className="w-9 h-9 rounded-2xl bg-[#58CC02] text-white flex items-center justify-center shadow-xs">
                <Users className="w-5 h-5" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-900 tracking-tight">
                {totalDps.toLocaleString('id-ID')}
              </span>
              <span className="text-xs font-bold text-[#46A302]">Jiwa</span>
            </div>
            <div className="mt-2.5 flex items-center gap-1.5 text-xs text-slate-600 font-medium">
              <CheckCircle2 className="w-4 h-4 text-[#58CC02] shrink-0" />
              <span>100% Hak Suara (5 Dusun)</span>
            </div>
          </div>

          {/* 2. Laki-laki */}
          <div className="bg-[#DDF4FF]/40 border-2 border-b-4 border-[#1CB0F6] p-5 rounded-3xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-black uppercase tracking-wider text-[#1899D6]">
                Pemilih Laki-Laki
              </span>
              <div className="w-9 h-9 rounded-2xl bg-[#1CB0F6] text-white flex items-center justify-center shadow-xs">
                <User className="w-5 h-5" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-900 tracking-tight">
                {totalL.toLocaleString('id-ID')}
              </span>
              <span className="text-xs font-bold text-[#1899D6]">({pctL}%)</span>
            </div>
            <div className="mt-3 w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
              <div className="bg-[#1CB0F6] h-full rounded-full transition-all duration-300" style={{ width: `${pctL}%` }} />
            </div>
          </div>

          {/* 3. Perempuan */}
          <div className="bg-[#FFEACC]/40 border-2 border-b-4 border-[#FF9600] p-5 rounded-3xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-black uppercase tracking-wider text-[#E07700]">
                Pemilih Perempuan
              </span>
              <div className="w-9 h-9 rounded-2xl bg-[#FF9600] text-white flex items-center justify-center shadow-xs">
                <User className="w-5 h-5" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-900 tracking-tight">
                {totalP.toLocaleString('id-ID')}
              </span>
              <span className="text-xs font-bold text-[#E07700]">({pctP}%)</span>
            </div>
            <div className="mt-3 w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
              <div className="bg-[#FF9600] h-full rounded-full transition-all duration-300" style={{ width: `${pctP}%` }} />
            </div>
          </div>
        </div>

        {/* Tabel Rincian Per TPS (TPS 1 s/d TPS 5) */}
        {isTableExpanded && (
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between">
              <h4 className="text-xs sm:text-sm font-black text-slate-700 uppercase tracking-wider flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-[#1CB0F6]" />
                <span>Rincian DPS Terdaftar Per Lokasi TPS</span>
              </h4>
              <span className="text-xs font-bold text-slate-400">Total 5 TPS</span>
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto rounded-2xl border-2 border-slate-200 bg-white">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-600 border-b-2 border-slate-200 uppercase text-[11px] font-black">
                    <th className="py-3.5 px-5">No. TPS</th>
                    <th className="py-3.5 px-5">Nama Lokasi TPS & Dusun</th>
                    <th className="py-3.5 px-5 text-center text-[#1899D6]">Laki-laki</th>
                    <th className="py-3.5 px-5 text-center text-[#E07700]">Perempuan</th>
                    <th className="py-3.5 px-5 text-right text-[#46A302]">Total DPS</th>
                    <th className="py-3.5 px-5 text-right text-slate-500">Proporsi</th>
                  </tr>
                </thead>
                <tbody className="divide-y-2 divide-slate-100">
                  {currentRecap.tpsStats.map((item) => {
                    const tpsPct = totalDps > 0 ? ((item.total / totalDps) * 100).toFixed(1) : '0';
                    return (
                      <tr key={item.tps} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-4 px-5">
                          <span className="px-3 py-1 bg-slate-100 text-slate-800 border-2 border-slate-200 rounded-xl font-black text-xs">
                            {item.tps}
                          </span>
                        </td>
                        <td className="py-4 px-5">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-[#1CB0F6] shrink-0" />
                            <span className="font-black text-slate-900 text-sm">{item.lokasi}</span>
                          </div>
                          <span className="text-slate-500 text-xs font-medium block pl-6 mt-0.5">
                            {item.dusun}
                          </span>
                        </td>
                        <td className="py-4 px-5 text-center font-extrabold text-slate-800">
                          {item.lakiLaki.toLocaleString('id-ID')}
                        </td>
                        <td className="py-4 px-5 text-center font-extrabold text-slate-800">
                          {item.perempuan.toLocaleString('id-ID')}
                        </td>
                        <td className="py-4 px-5 text-right font-black text-slate-900 text-sm">
                          {item.total.toLocaleString('id-ID')}
                        </td>
                        <td className="py-4 px-5 text-right font-bold text-slate-500">
                          {tpsPct}%
                        </td>
                      </tr>
                    );
                  })}
                  {/* Total Summary Row */}
                  <tr className="bg-slate-50 border-t-2 border-slate-300 text-slate-900 font-black">
                    <td colSpan={2} className="py-4 px-5 text-xs uppercase tracking-wider text-slate-700">
                      Total Rekapitulasi Desa {namaDesa}
                    </td>
                    <td className="py-4 px-5 text-center text-[#1899D6] font-black text-sm">
                      {totalL.toLocaleString('id-ID')}
                    </td>
                    <td className="py-4 px-5 text-center text-[#E07700] font-black text-sm">
                      {totalP.toLocaleString('id-ID')}
                    </td>
                    <td className="py-4 px-5 text-right text-[#46A302] font-black text-base">
                      {totalDps.toLocaleString('id-ID')}
                    </td>
                    <td className="py-4 px-5 text-right text-slate-700">
                      100%
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Mobile Card Grid View */}
            <div className="md:hidden space-y-3">
              {currentRecap.tpsStats.map((item) => (
                <div
                  key={item.tps}
                  className="bg-slate-50 p-4 rounded-2xl border-2 border-b-4 border-slate-200 space-y-2.5"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2.5">
                      <span className="px-2.5 py-1 bg-[#1CB0F6] text-white font-black rounded-xl text-xs shrink-0">
                        {item.tps}
                      </span>
                      <div>
                        <span className="text-xs font-black text-slate-900 block leading-snug">{item.lokasi}</span>
                        <span className="text-slate-500 text-[11px] mt-0.5 flex items-center gap-1 font-medium">
                          <MapPin className="w-3.5 h-3.5 text-[#1CB0F6] shrink-0" />
                          <span>{item.dusun}</span>
                        </span>
                      </div>
                    </div>
                    <span className="text-xs font-black text-[#46A302] bg-[#E5F9D2] px-2.5 py-1 rounded-xl border border-[#58CC02]/40 shrink-0">
                      {item.total.toLocaleString('id-ID')}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-2 border-t-2 border-slate-200 text-slate-600 font-medium">
                    <span className="text-slate-400 text-[11px] font-bold uppercase">Rincian:</span>
                    <div className="flex items-center gap-3">
                      <span className="text-[#1899D6] font-bold">L: {item.lakiLaki.toLocaleString('id-ID')}</span>
                      <span className="text-[#E07700] font-bold">P: {item.perempuan.toLocaleString('id-ID')}</span>
                    </div>
                  </div>
                </div>
              ))}

              {/* Mobile Total Card */}
              <div className="bg-[#E5F9D2]/60 p-4 rounded-2xl border-2 border-b-4 border-[#58CC02] text-slate-900 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase text-[#46A302]">
                    Total Keseluruhan (5 TPS)
                  </span>
                  <span className="text-base font-black text-slate-900">
                    {totalDps.toLocaleString('id-ID')} Jiwa
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs pt-2 border-t-2 border-[#58CC02]/20 font-bold text-slate-700">
                  <span>L: {totalL.toLocaleString('id-ID')} ({pctL}%)</span>
                  <span>P: {totalP.toLocaleString('id-ID')} ({pctP}%)</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer Note */}
        <div className="mt-6 pt-4 border-t-2 border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-[#58CC02] shrink-0" />
            <span>Rekapitulasi resmi Panitia Pemilihan Kepala Desa (P2KD) Gunungjaya Tahun 2026.</span>
          </div>
          <span className="font-bold text-slate-500">
            Diperbarui: {currentRecap.lastUpdated || 'Tahapan DPS 2026'}
          </span>
        </div>
      </div>
    </section>
  );
};
