import React, { useState } from 'react';
import { MapPin, Users, Info, ArrowLeft } from 'lucide-react';
import { TpsItem, PilkadesConfig } from '../types/pilkades';

interface TpsInformationProps {
  tpsList: TpsItem[];
  config?: PilkadesConfig;
  onBackToCekDps?: () => void;
}

export const TpsInformation: React.FC<TpsInformationProps> = ({ tpsList, config, onBackToCekDps }) => {
  const [selectedTpsFilter, setSelectedTpsFilter] = useState<string>('all');

  const formatWilayahCakupan = (rt: string, rw: string) => {
    const cleanRt = (rt || '').trim();
    const cleanRw = (rw || '').trim();

    if (!cleanRt && !cleanRw) return '-';

    if (cleanRt.toLowerCase().includes('rw') || (!cleanRw && cleanRt)) {
      return cleanRt.toLowerCase().startsWith('rt') ? cleanRt : `RT ${cleanRt}`;
    }

    if (!cleanRt && cleanRw) {
      return cleanRw.toLowerCase().startsWith('rw') ? cleanRw : `RW ${cleanRw}`;
    }

    const rtLabel = cleanRt.toLowerCase().startsWith('rt') ? cleanRt : `RT ${cleanRt}`;
    const rwLabel = cleanRw.toLowerCase().startsWith('rw') ? cleanRw : `RW ${cleanRw}`;

    return `${rtLabel} / ${rwLabel}`;
  };

  const namaDesa = config?.desa || 'Gunungjaya';
  const namaKecamatan = config?.kecamatan || 'Belik';
  const namaKabupaten = config?.kabupaten || 'Pemalang';

  // Pastikan menampilkan TPS 1 - 5 sesuai data desa
  const filteredList = selectedTpsFilter === 'all'
    ? tpsList
    : tpsList.filter(item => item.tps === selectedTpsFilter);

  return (
    <section id="informasi-tps" className="py-10 sm:py-14 bg-gradient-to-b from-black/60 via-slate-950/70 to-black/85 backdrop-blur-xs border-b border-white/10 relative z-10 text-slate-100 min-h-[75vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Tombol Navigasi Kembali ke Halaman Cek DPS */}
        {onBackToCekDps && (
          <div className="mb-6">
            <button
              type="button"
              onClick={onBackToCekDps}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-900/90 hover:bg-slate-800 text-amber-300 hover:text-white border border-slate-700/80 rounded-xl text-xs sm:text-sm font-bold transition shadow-md cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Kembali ke Halaman Cek DPS</span>
            </button>
          </div>
        )}

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-amber-500/15 border border-amber-500/40 rounded-full shadow-md mb-3 text-xs font-bold text-amber-300">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span className="font-mono tracking-wider uppercase">LOKASI PEMUNGUTAN SUARA (TPS 1 - 5)</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-serif drop-shadow-md">
            Informasi TPS Desa {namaDesa}
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm mt-2 max-w-xl mx-auto">
            Daftar Tempat Pemungutan Suara (TPS 1 s/d TPS 5) Pilkades 2026 di wilayah {namaDesa}, Kec. {namaKecamatan}, Kab. {namaKabupaten} untuk tahapan Daftar Pemilih Sementara (DPS).
          </p>
        </div>

        {/* Mobile-Friendly Quick Filter Tabs (Scrollable on HP) */}
        <div className="mb-6 -mx-4 px-4 sm:mx-0 sm:px-0">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none sm:justify-center">
            <button
              type="button"
              onClick={() => setSelectedTpsFilter('all')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 min-h-[44px] cursor-pointer ${
                selectedTpsFilter === 'all'
                  ? 'bg-amber-500 text-slate-950 shadow-[0_0_15px_rgba(245,158,11,0.4)] font-black'
                  : 'bg-slate-900/90 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-700/80'
              }`}
            >
              <span>Semua TPS</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${selectedTpsFilter === 'all' ? 'bg-slate-950 text-amber-300' : 'bg-slate-800 text-slate-400'}`}>
                {tpsList.length}
              </span>
            </button>

            {tpsList.map((tps) => {
              const isSelected = selectedTpsFilter === tps.tps;
              return (
                <button
                  key={tps.tps}
                  type="button"
                  onClick={() => setSelectedTpsFilter(tps.tps)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1 min-h-[44px] cursor-pointer ${
                    isSelected
                      ? 'bg-amber-500 text-slate-950 shadow-[0_0_15px_rgba(245,158,11,0.4)] font-black'
                      : 'bg-slate-900/90 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-700/80'
                  }`}
                >
                  <span>{tps.tps}</span>
                  <span className="text-[10px] opacity-75 hidden sm:inline">({tps.dusun})</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* TPS Cards Grid (Hanya TPS 1 - 5) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredList.map((item) => (
            <div
              key={item.tps}
              id={`tps-card-${item.tps.toLowerCase().replace(/\s+/g, '-')}`}
              className="bg-gradient-to-b from-slate-900/95 via-slate-950/95 to-black/98 backdrop-blur-xl rounded-2xl sm:rounded-3xl border border-white/10 shadow-[0_15px_35px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.12)] hover:border-amber-400/50 hover:shadow-[0_20px_45px_rgba(0,0,0,0.9),0_0_20px_rgba(245,158,11,0.15)] transition-all duration-300 overflow-hidden flex flex-col justify-between group"
            >
              <div className="p-5 sm:p-6 space-y-4">
                {/* Top Badge Row */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-amber-500 text-slate-950 font-black text-xs sm:text-sm rounded-lg font-mono shadow-xs">
                      {item.tps}
                    </span>
                    <span className="text-[11px] font-bold text-amber-300 uppercase tracking-wider font-mono">
                      Dusun {item.dusun}
                    </span>
                  </div>

                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-mono font-semibold">
                    Terdaftar
                  </span>
                </div>

                {/* Location Title */}
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white font-serif leading-snug group-hover:text-amber-200 transition-colors">
                    {item.nama_lokasi}
                  </h3>
                </div>

                {/* Location details */}
                <div className="space-y-2.5 text-xs text-slate-300">
                  <div className="flex items-start gap-2.5 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
                    <MapPin className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <span className="text-slate-400 text-[10px] block">Alamat TPS:</span>
                      <span className="text-slate-200 font-medium">{item.alamat}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
                    <Users className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <span className="text-slate-400 text-[10px] block">Cakupan Wilayah:</span>
                      <span className="text-white font-semibold">{formatWilayahCakupan(item.rt, item.rw)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer status row */}
              <div className="bg-slate-950/90 px-5 sm:px-6 py-2.5 border-t border-slate-800 text-[11px] font-medium text-slate-400 flex items-center justify-between font-mono">
                <span>Waktu: 07.00 - 13.00 WIB</span>
                <span className="text-amber-400 font-semibold">Bawa KTP/C6</span>
              </div>
            </div>
          ))}
        </div>

        {/* Helper Notice */}
        <div className="mt-8 p-4 rounded-2xl bg-slate-900/90 border border-amber-500/30 flex items-start gap-3 text-xs text-slate-300 shadow-md">
          <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            Penetapan TPS warga didasarkan pada alamat KTP/KK yang tercantum pada Daftar Pemilih Sementara (DPS). Pastikan Anda datang ke lokasi TPS yang sesuai pada hari pemungutan suara sebelum pukul 13.00 WIB.
          </p>
        </div>
      </div>
    </section>
  );
};
