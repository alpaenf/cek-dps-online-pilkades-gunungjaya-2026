import React, { useState } from 'react';
import { MapPin, Users, Info, ArrowLeft, Clock, CheckCircle2 } from 'lucide-react';
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

  const filteredList = selectedTpsFilter === 'all'
    ? tpsList
    : tpsList.filter(item => item.tps === selectedTpsFilter);

  return (
    <section id="informasi-tps" className="py-8 sm:py-12 bg-[#F7F9FA] text-slate-800 min-h-[75vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Tombol Navigasi Kembali ke Halaman Cek DPS */}
        {onBackToCekDps && (
          <div>
            <button
              type="button"
              onClick={onBackToCekDps}
              className="inline-flex items-center gap-2 px-5 py-3 bg-white hover:bg-slate-50 text-slate-700 border-2 border-b-4 border-slate-200 active:border-b-2 active:translate-y-0.5 rounded-2xl text-xs sm:text-sm font-black uppercase tracking-wider transition-all cursor-pointer shadow-xs"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Kembali ke Cek DPS</span>
            </button>
          </div>
        )}

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-[#DDF4FF] border border-[#1CB0F6]/40 rounded-xl mb-3 text-xs font-black uppercase tracking-wider text-[#1899D6]">
            <MapPin className="w-3.5 h-3.5" />
            <span>Lokasi Pemungutan Suara (TPS 1 - 5)</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Daftar TPS Desa {namaDesa}
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm mt-2 max-w-xl mx-auto font-medium">
            Wilayah pemilihan Desa {namaDesa}, Kec. {namaKecamatan}, Kab. {namaKabupaten} terbagi ke dalam 5 TPS resmi.
          </p>
        </div>

        {/* Quick Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none sm:justify-center">
          <button
            type="button"
            onClick={() => setSelectedTpsFilter('all')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
              selectedTpsFilter === 'all'
                ? 'bg-[#1CB0F6] text-white border-b-4 border-[#1899D6] shadow-sm'
                : 'bg-white hover:bg-slate-100 text-slate-600 border-2 border-slate-200'
            }`}
          >
            <span>Semua TPS</span>
            <span className={`text-[10px] px-2 py-0.5 rounded-lg font-black ${
              selectedTpsFilter === 'all' ? 'bg-white text-[#1CB0F6]' : 'bg-slate-100 text-slate-600'
            }`}>
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
                className={`px-4 py-2.5 rounded-2xl text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                  isSelected
                    ? 'bg-[#1CB0F6] text-white border-b-4 border-[#1899D6] shadow-sm'
                    : 'bg-white hover:bg-slate-100 text-slate-600 border-2 border-slate-200'
                }`}
              >
                <span>{tps.tps}</span>
                <span className="text-[10px] opacity-75 hidden sm:inline">({tps.dusun})</span>
              </button>
            );
          })}
        </div>

        {/* TPS Cards Grid (5 TPS) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {filteredList.map((item) => (
            <div
              key={item.tps}
              className="bg-white border-2 border-b-4 border-slate-200 hover:border-[#1CB0F6] hover:border-b-[#1899D6] rounded-3xl p-6 shadow-sm transition-all duration-150 flex flex-col justify-between"
            >
              <div className="space-y-4">
                {/* Top Badge Row */}
                <div className="flex items-center justify-between gap-2">
                  <span className="px-3 py-1 bg-[#1CB0F6] text-white font-black text-xs rounded-xl shadow-xs">
                    {item.tps}
                  </span>
                  <span className="text-xs font-bold text-[#46A302] bg-[#E5F9D2] px-2.5 py-0.5 rounded-lg border border-[#58CC02]/30 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    Terverifikasi
                  </span>
                </div>

                {/* Location Title */}
                <div>
                  <h3 className="text-base sm:text-lg font-black text-slate-900 leading-snug">
                    {item.nama_lokasi}
                  </h3>
                  <span className="text-xs font-bold text-[#1899D6] uppercase tracking-wider block mt-1">
                    {item.dusun}
                  </span>
                </div>

                {/* Details */}
                <div className="space-y-2.5 text-xs">
                  <div className="flex items-start gap-2.5 bg-slate-50 p-3 rounded-2xl border border-slate-200">
                    <MapPin className="w-4 h-4 text-[#FF4B4B] shrink-0 mt-0.5" />
                    <div>
                      <span className="text-slate-400 font-bold uppercase text-[10px] block">Alamat TPS:</span>
                      <span className="text-slate-700 font-medium leading-relaxed">{item.alamat}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 bg-slate-50 p-3 rounded-2xl border border-slate-200">
                    <Users className="w-4 h-4 text-[#58CC02] shrink-0 mt-0.5" />
                    <div>
                      <span className="text-slate-400 font-bold uppercase text-[10px] block">Cakupan Wilayah:</span>
                      <span className="text-slate-800 font-bold">{formatWilayahCakupan(item.rt, item.rw)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="mt-5 pt-3.5 border-t-2 border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-400">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  07.00 - 13.00 WIB
                </span>
                <span className="text-[#58CC02] font-black uppercase tracking-wider text-[11px]">
                  Bawa KTP-el
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Notice */}
        <div className="p-4 rounded-2xl bg-white border-2 border-b-4 border-slate-200 flex items-start gap-3 text-xs text-slate-600 font-medium shadow-xs">
          <Info className="w-5 h-5 text-[#1CB0F6] shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            Penetapan lokasi TPS warga didasarkan pada data alamat kependudukan yang tercantum pada Daftar Pemilih Sementara (DPS). Pastikan Anda hadir di lokasi TPS yang tepat sebelum pukul 13.00 WIB.
          </p>
        </div>
      </div>
    </section>
  );
};
