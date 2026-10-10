import React, { useState } from 'react';
import { X, Sparkles, HelpCircle, ArrowUpRight, Calendar, Phone, Search, MapPin } from 'lucide-react';
import { DEFAULT_MASCOT_GLAWU } from '../data/logoPresets';
import { PilkadesConfig } from '../types/pilkades';

interface FloatingGlawuAssistantProps {
  config: PilkadesConfig;
  onScrollToSearch: () => void;
  onScrollToTps: () => void;
  onScrollToContact: () => void;
  onScrollToMascot: () => void;
  mascotSrc?: string;
}

export const FloatingGlawuAssistant: React.FC<FloatingGlawuAssistantProps> = ({
  config,
  onScrollToSearch,
  onScrollToTps,
  onScrollToContact,
  onScrollToMascot,
  mascotSrc
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  const handleOpen = () => {
    setIsOpen(!isOpen);
    setHasInteracted(true);
  };

  const mascotName = config.mascot_name || 'Glawu';

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 select-none print:hidden">
      {/* Popover Bubble Card */}
      {isOpen && (
        <div className="mb-3 w-[calc(100vw-2rem)] max-w-sm sm:w-96 bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.18)] border-2 border-b-4 border-slate-200 overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-300 text-slate-800">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#FFC800] via-[#FFD633] to-[#FFC800] text-slate-900 p-4 relative border-b-2 border-[#E59B00]/40">
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 rounded-full overflow-hidden bg-white border-2 border-[#E59B00]/50 p-0.5 shrink-0 shadow-sm">
                <img
                  src={mascotSrc || DEFAULT_MASCOT_GLAWU}
                  alt={mascotName}
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="pr-6">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-black uppercase tracking-wider text-amber-950 bg-amber-200/90 px-2 py-0.5 rounded-full border border-amber-400/60">
                    Sahabat Pemilih
                  </span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                </div>
                <h4 className="text-base font-black text-slate-900 flex items-center gap-1.5 mt-0.5">
                  <span>Halo, Aku {mascotName}!</span>
                  <Sparkles className="w-4 h-4 text-amber-700" />
                </h4>
                <p className="text-[11px] text-slate-700 font-medium">
                  Maskot Pilkades {config.desa || 'Gunungjaya'} {config.tahun || '2026'}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="absolute top-3 right-3 text-slate-700 hover:text-slate-950 p-1.5 rounded-full hover:bg-black/10 transition cursor-pointer"
              title="Tutup panduan"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body Content */}
          <div className="p-4 sm:p-5 max-h-[70vh] overflow-y-auto space-y-3 text-xs">
            <div className="p-3 bg-amber-50/80 rounded-2xl border-2 border-amber-200/80 text-amber-950 leading-relaxed font-medium">
              <p>
                Ada yang bisa {mascotName} bantu untuk persiapan Pilkades {config.desa || 'Gunungjaya'}? Pilih panduan cepat di bawah ya:
              </p>
            </div>

            {/* Quick Actions in Duolingo-Pilkades Theme */}
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => {
                  onScrollToSearch();
                  setIsOpen(false);
                }}
                className="w-full p-2.5 sm:p-3 rounded-2xl bg-[#E5F9D2]/70 hover:bg-[#E5F9D2] text-[#2E6B01] border-2 border-b-3 border-[#58CC02]/50 hover:border-[#58CC02] active:border-b-2 active:translate-y-0.5 flex items-center justify-between text-left transition font-black cursor-pointer group shadow-xs"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-xl bg-[#58CC02] text-white flex items-center justify-center shrink-0 shadow-xs">
                    <Search className="w-4 h-4" />
                  </div>
                  <span className="text-xs sm:text-sm font-black text-[#2E6B01]">Cek NIK di DPT Sekarang</span>
                </div>
                <ArrowUpRight className="w-4 h-4 text-[#46A302] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </button>

              <button
                type="button"
                onClick={() => {
                  onScrollToTps();
                  setIsOpen(false);
                }}
                className="w-full p-2.5 sm:p-3 rounded-2xl bg-[#DDF4FF]/70 hover:bg-[#DDF4FF] text-[#0369A1] border-2 border-b-3 border-[#1CB0F6]/50 hover:border-[#1CB0F6] active:border-b-2 active:translate-y-0.5 flex items-center justify-between text-left transition font-black cursor-pointer group shadow-xs"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-xl bg-[#1CB0F6] text-white flex items-center justify-center shrink-0 shadow-xs">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <span className="text-xs sm:text-sm font-black text-[#0369A1]">Lihat Lokasi & Data TPS Desa</span>
                </div>
                <ArrowUpRight className="w-4 h-4 text-[#0284C7] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </button>

              <button
                type="button"
                onClick={() => {
                  onScrollToMascot();
                  setIsOpen(false);
                }}
                className="w-full p-2.5 sm:p-3 rounded-2xl bg-[#FFF5D1]/80 hover:bg-[#FFF5D1] text-[#9A3412] border-2 border-b-3 border-[#FFC800]/60 hover:border-[#FFC800] active:border-b-2 active:translate-y-0.5 flex items-center justify-between text-left transition font-black cursor-pointer group shadow-xs"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-xl bg-[#FFC800] text-slate-900 flex items-center justify-center shrink-0 shadow-xs">
                    <Sparkles className="w-4 h-4 text-amber-800" />
                  </div>
                  <span className="text-xs sm:text-sm font-black text-[#9A3412]">Kenal Lebih Dekat {mascotName}</span>
                </div>
                <ArrowUpRight className="w-4 h-4 text-[#D97706] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </button>

              <button
                type="button"
                onClick={() => {
                  onScrollToContact();
                  setIsOpen(false);
                }}
                className="w-full p-2.5 sm:p-3 rounded-2xl bg-[#F3E8FF]/70 hover:bg-[#F3E8FF] text-[#6B21A8] border-2 border-b-3 border-[#CE82FF]/60 hover:border-[#CE82FF] active:border-b-2 active:translate-y-0.5 flex items-center justify-between text-left transition font-black cursor-pointer group shadow-xs"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-xl bg-[#A855F7] text-white flex items-center justify-center shrink-0 shadow-xs">
                    <Phone className="w-4 h-4" />
                  </div>
                  <span className="text-xs sm:text-sm font-black text-[#6B21A8]">Hubungi Sekretariat Panitia (P2KD)</span>
                </div>
                <ArrowUpRight className="w-4 h-4 text-[#7E22CE] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </button>
            </div>

            {/* Quick reminder box */}
            <div className="p-3.5 bg-slate-50 rounded-2xl border-2 border-slate-200 text-slate-700 space-y-1">
              <span className="flex items-center gap-1.5 font-black text-[#D97706] text-[10px] sm:text-[11px] uppercase tracking-wider">
                <Calendar className="w-3.5 h-3.5 text-[#FFC800]" />
                Waktu Pemungutan Suara:
              </span>
              <p className="font-black text-slate-900 text-xs sm:text-sm">
                {config.tanggal_pemungutan}
              </p>
              <p className="text-[11px] text-slate-500 font-medium">
                Pukul {config.votingHours || '07.00 - 13.00 WIB'} di TPS masing-masing RT/RW.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Floating Trigger Button with Mascot Avatar */}
      <button
        type="button"
        onClick={handleOpen}
        className="group relative flex items-center gap-2.5 bg-white hover:bg-amber-50 text-slate-900 pl-2 pr-4 py-2 rounded-full shadow-[0_8px_25px_rgba(0,0,0,0.15)] border-2 border-b-4 border-amber-400 hover:border-amber-500 transition-all cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0 active:border-b-2"
        aria-label={`Buka Panduan ${mascotName}`}
      >
        <div className="relative w-11 h-11 rounded-full overflow-hidden bg-gradient-to-b from-amber-100 to-amber-200 border-2 border-amber-300 p-0.5 shadow-inner flex items-center justify-center">
          <img
            src={mascotSrc || DEFAULT_MASCOT_GLAWU}
            alt={`Maskot ${mascotName}`}
            className="w-full h-full object-contain transform group-hover:scale-110 transition-transform"
          />
          {!hasInteracted && (
            <span className="absolute top-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white animate-ping" />
          )}
        </div>

        <div className="text-left">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-black text-slate-900 uppercase">
              {mascotName}
            </span>
            <span className="text-[9px] bg-[#FFC800]/30 text-[#B45309] border border-[#FFC800] font-black px-1.5 py-0.2 rounded-full">
              Maskot
            </span>
          </div>
          <span className="text-[10px] text-slate-500 block font-bold">
            Panduan Pemilih
          </span>
        </div>
      </button>
    </div>
  );
};
