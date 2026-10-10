import React, { useState } from 'react';
import { X, Sparkles, ArrowUpRight, Calendar, Phone, Search, MapPin } from 'lucide-react';
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
    <div className="fixed bottom-3 right-3 sm:bottom-5 sm:right-5 z-40 select-none print:hidden">
      {/* Popover Bubble Card (Compact 50% Size) */}
      {isOpen && (
        <div className="mb-2 w-64 sm:w-72 bg-white rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.16)] border-2 border-b-4 border-slate-200 overflow-hidden animate-in fade-in slide-in-from-bottom-3 duration-200 text-slate-800">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#FFC800] via-[#FFD633] to-[#FFC800] text-slate-900 p-2.5 px-3 relative border-b-2 border-[#E59B00]/40 flex items-center justify-between">
            <div className="flex items-center gap-2 min-w-0 pr-4">
              <div className="relative w-8 h-8 rounded-full overflow-hidden bg-white border border-[#E59B00]/50 p-0.5 shrink-0 shadow-2xs">
                <img
                  src={mascotSrc || DEFAULT_MASCOT_GLAWU}
                  alt={mascotName}
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-1">
                  <span className="text-[8px] font-black uppercase text-amber-950 bg-amber-200/90 px-1.5 py-0.2 rounded-full border border-amber-400/60 leading-none">
                    Sahabat Pemilih
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                </div>
                <h4 className="text-xs font-black text-slate-900 flex items-center gap-1 mt-0.5 truncate leading-tight">
                  <span>Halo, Aku {mascotName}!</span>
                  <Sparkles className="w-3 h-3 text-amber-700 shrink-0" />
                </h4>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-slate-700 hover:text-slate-950 p-1 rounded-lg hover:bg-black/10 transition cursor-pointer shrink-0"
              title="Tutup panduan"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body Content */}
          <div className="p-2.5 space-y-1.5 text-[11px]">
            <div className="p-2 bg-amber-50/90 rounded-xl border border-amber-200/80 text-amber-950 leading-snug font-medium text-[10px]">
              <p>
                Ada yang bisa {mascotName} bantu? Pilih panduan cepat di bawah:
              </p>
            </div>

            {/* Quick Actions */}
            <div className="space-y-1.5">
              <button
                type="button"
                onClick={() => {
                  onScrollToSearch();
                  setIsOpen(false);
                }}
                className="w-full p-2 rounded-xl bg-[#E5F9D2]/70 hover:bg-[#E5F9D2] text-[#2E6B01] border border-b-2 border-[#58CC02]/50 hover:border-[#58CC02] active:border-b active:translate-y-0.5 flex items-center justify-between text-left transition font-black cursor-pointer group shadow-2xs"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-5 h-5 rounded-lg bg-[#58CC02] text-white flex items-center justify-center shrink-0 shadow-2xs">
                    <Search className="w-3 h-3" />
                  </div>
                  <span className="text-[11px] font-black text-[#2E6B01] truncate">Cek NIK di DPT</span>
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#46A302] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform shrink-0" />
              </button>

              <button
                type="button"
                onClick={() => {
                  onScrollToTps();
                  setIsOpen(false);
                }}
                className="w-full p-2 rounded-xl bg-[#DDF4FF]/70 hover:bg-[#DDF4FF] text-[#0369A1] border border-b-2 border-[#1CB0F6]/50 hover:border-[#1CB0F6] active:border-b active:translate-y-0.5 flex items-center justify-between text-left transition font-black cursor-pointer group shadow-2xs"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-5 h-5 rounded-lg bg-[#1CB0F6] text-white flex items-center justify-center shrink-0 shadow-2xs">
                    <MapPin className="w-3 h-3" />
                  </div>
                  <span className="text-[11px] font-black text-[#0369A1] truncate">Lokasi & Data TPS</span>
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#0284C7] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform shrink-0" />
              </button>

              <button
                type="button"
                onClick={() => {
                  onScrollToMascot();
                  setIsOpen(false);
                }}
                className="w-full p-2 rounded-xl bg-[#FFF5D1]/80 hover:bg-[#FFF5D1] text-[#9A3412] border border-b-2 border-[#FFC800]/60 hover:border-[#FFC800] active:border-b active:translate-y-0.5 flex items-center justify-between text-left transition font-black cursor-pointer group shadow-2xs"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-5 h-5 rounded-lg bg-[#FFC800] text-slate-900 flex items-center justify-center shrink-0 shadow-2xs">
                    <Sparkles className="w-3 h-3 text-amber-800" />
                  </div>
                  <span className="text-[11px] font-black text-[#9A3412] truncate">Kenal {mascotName}</span>
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#D97706] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform shrink-0" />
              </button>

              <button
                type="button"
                onClick={() => {
                  onScrollToContact();
                  setIsOpen(false);
                }}
                className="w-full p-2 rounded-xl bg-[#F3E8FF]/70 hover:bg-[#F3E8FF] text-[#6B21A8] border border-b-2 border-[#CE82FF]/60 hover:border-[#CE82FF] active:border-b active:translate-y-0.5 flex items-center justify-between text-left transition font-black cursor-pointer group shadow-2xs"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-5 h-5 rounded-lg bg-[#A855F7] text-white flex items-center justify-center shrink-0 shadow-2xs">
                    <Phone className="w-3 h-3" />
                  </div>
                  <span className="text-[11px] font-black text-[#6B21A8] truncate">Kontak Panitia P2KD</span>
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#7E22CE] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform shrink-0" />
              </button>
            </div>

            {/* Quick reminder box */}
            <div className="p-2 bg-slate-50 rounded-xl border border-slate-200 text-slate-700 space-y-0.5">
              <span className="flex items-center gap-1 font-black text-[#D97706] text-[9px] uppercase tracking-wider">
                <Calendar className="w-3 h-3 text-[#FFC800]" />
                Pemungutan Suara:
              </span>
              <p className="font-black text-slate-900 text-[10px] leading-tight">
                {config.tanggal_pemungutan}
              </p>
              <p className="text-[9px] text-slate-500 font-medium">
                Pukul {config.votingHours || '07.00 - 13.00 WIB'} di TPS masing-masing.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Floating Trigger Button with Mascot Avatar */}
      <button
        type="button"
        onClick={handleOpen}
        className="group relative flex items-center gap-2 bg-white hover:bg-amber-50 text-slate-900 pl-1.5 pr-3 py-1.5 rounded-full shadow-[0_6px_20px_rgba(0,0,0,0.12)] border-2 border-b-3 border-amber-400 hover:border-amber-500 transition-all cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0 active:border-b"
        aria-label={`Buka Panduan ${mascotName}`}
      >
        <div className="relative w-8 h-8 rounded-full overflow-hidden bg-gradient-to-b from-amber-100 to-amber-200 border border-amber-300 p-0.5 shadow-inner flex items-center justify-center">
          <img
            src={mascotSrc || DEFAULT_MASCOT_GLAWU}
            alt={`Maskot ${mascotName}`}
            className="w-full h-full object-contain transform group-hover:scale-110 transition-transform"
          />
          {!hasInteracted && (
            <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white animate-ping" />
          )}
        </div>

        <div className="text-left">
          <div className="flex items-center gap-1">
            <span className="text-[11px] font-black text-slate-900 uppercase">
              {mascotName}
            </span>
            <span className="text-[8px] bg-[#FFC800]/30 text-[#B45309] border border-[#FFC800] font-black px-1 py-0.2 rounded-full leading-none">
              Maskot
            </span>
          </div>
          <span className="text-[9px] text-slate-500 block font-bold leading-none mt-0.5">
            Panduan Pemilih
          </span>
        </div>
      </button>
    </div>
  );
};
