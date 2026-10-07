import React, { useState } from 'react';
import { X, Sparkles, HelpCircle, ArrowUpRight, CheckCircle2, Calendar, FileText, Phone, MessageCircle } from 'lucide-react';
import { DEFAULT_MASCOT_GLAWU, DEFAULT_MASCOT_GLAWU_GUIDE } from '../data/logoPresets';
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

  return (
    <div className="fixed bottom-5 right-5 z-40 select-none print:hidden">
      {/* Popover Bubble */}
      {isOpen && (
        <div className="mb-3 w-80 sm:w-96 bg-slate-900/95 backdrop-blur-2xl rounded-3xl shadow-[0_25px_60px_rgba(0,0,0,0.95)] border-2 border-amber-500/50 overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-300 text-slate-100">
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 text-white p-4 relative border-b border-amber-500/30">
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 rounded-full overflow-hidden bg-slate-900 border-2 border-amber-400/50 p-0.5 shrink-0 shadow-md">
                <img
                  src={mascotSrc || DEFAULT_MASCOT_GLAWU}
                  alt="GLAWU"
                  className="w-full h-full object-contain"
                />
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-300 bg-amber-950/80 px-2 py-0.5 rounded-full border border-amber-500/30 font-mono">
                    Sahabat Pemilih
                  </span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                </div>
                <h4 className="text-base font-black text-white font-serif">
                  Halo, Aku GLAWU! 👋
                </h4>
                <p className="text-[11px] text-slate-300">
                  Maskot Pilkades Gunungjaya 2026
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="absolute top-3 right-3 text-slate-400 hover:text-white p-1 rounded-full hover:bg-slate-800 transition cursor-pointer"
              title="Tutup panduan"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body Content */}
          <div className="p-4 sm:p-5 max-h-[70vh] overflow-y-auto space-y-3.5 text-xs">
            <div className="p-3 bg-slate-950/90 rounded-2xl border border-slate-800 text-slate-300 leading-relaxed">
              <p className="font-medium">
                Ada yang bisa Glawu bantu untuk persiapan Pilkades Gunungjaya? Pilih panduan cepat di bawah ya:
              </p>
            </div>

            {/* Quick Actions */}
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => {
                  onScrollToSearch();
                  setIsOpen(false);
                }}
                className="w-full p-2.5 rounded-xl bg-slate-950/80 hover:bg-slate-850 text-white border border-slate-700/80 hover:border-amber-500/50 flex items-center justify-between text-left transition font-semibold cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <span className="text-base">🔍</span>
                  <span className="text-amber-300">Cek NIK di DPT Sekarang</span>
                </div>
                <ArrowUpRight className="w-4 h-4 text-amber-400" />
              </button>

              <button
                type="button"
                onClick={() => {
                  onScrollToTps();
                  setIsOpen(false);
                }}
                className="w-full p-2.5 rounded-xl bg-slate-950/80 hover:bg-slate-850 text-white border border-slate-700/80 hover:border-emerald-500/50 flex items-center justify-between text-left transition font-semibold cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <span className="text-base">📍</span>
                  <span className="text-emerald-300">Lihat Lokasi & Data TPS Desa</span>
                </div>
                <ArrowUpRight className="w-4 h-4 text-emerald-400" />
              </button>

              <button
                type="button"
                onClick={() => {
                  onScrollToMascot();
                  setIsOpen(false);
                }}
                className="w-full p-2.5 rounded-xl bg-slate-950/80 hover:bg-slate-850 text-white border border-slate-700/80 hover:border-sky-500/50 flex items-center justify-between text-left transition font-semibold cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <span className="text-base">🦅</span>
                  <span className="text-sky-300">Kenal Lebih Dekat dengan Glawu</span>
                </div>
                <ArrowUpRight className="w-4 h-4 text-sky-400" />
              </button>

              <button
                type="button"
                onClick={() => {
                  onScrollToContact();
                  setIsOpen(false);
                }}
                className="w-full p-2.5 rounded-xl bg-slate-950/80 hover:bg-slate-850 text-white border border-slate-700/80 hover:border-purple-500/50 flex items-center justify-between text-left transition font-semibold cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <span className="text-base">📞</span>
                  <span className="text-purple-300">Hubungi Sekretariat Panitia (P2KD)</span>
                </div>
                <ArrowUpRight className="w-4 h-4 text-purple-400" />
              </button>
            </div>

            {/* Quick reminder box */}
            <div className="p-3 bg-slate-950/90 rounded-2xl border border-slate-800 text-slate-300 space-y-1">
              <span className="font-bold text-amber-300 text-[11px] block font-mono">
                🗓️ Waktu Pemungutan Suara:
              </span>
              <p className="font-semibold text-white">
                {config.tanggal_pemungutan}
              </p>
              <p className="text-[10px] text-slate-400 font-mono">
                Pukul 07.00 - 13.00 WIB di TPS masing-masing RT/RW.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Floating Trigger Button with Mascot Avatar */}
      <button
        type="button"
        onClick={handleOpen}
        className="group relative flex items-center gap-2.5 bg-slate-900/90 hover:bg-slate-850 text-white pl-2 pr-4 py-2 rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.9)] border-2 border-amber-500/50 hover:border-amber-400 transition-all cursor-pointer transform hover:-translate-y-1 backdrop-blur-md"
        aria-label="Buka Panduan Glawu"
      >
        <div className="relative w-11 h-11 rounded-full overflow-hidden bg-slate-950 border border-amber-400/40 shadow-inner flex items-center justify-center">
          <img
            src={mascotSrc || DEFAULT_MASCOT_GLAWU}
            alt="Maskot Glawu"
            className="w-full h-full object-contain transform group-hover:scale-110 transition-transform"
          />
          {!hasInteracted && (
            <span className="absolute top-0 right-0 w-3 h-3 bg-amber-400 rounded-full border-2 border-slate-950 animate-ping" />
          )}
        </div>

        <div className="text-left">
          <div className="flex items-center gap-1">
            <span className="text-xs font-black text-amber-300 font-serif">
              GLAWU
            </span>
            <span className="text-[9px] bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold px-1.5 py-0.2 rounded-full font-mono">
              Maskot
            </span>
          </div>
          <span className="text-[10px] text-slate-400 block font-medium">
            Panduan Pemilih
          </span>
        </div>
      </button>
    </div>
  );
};
