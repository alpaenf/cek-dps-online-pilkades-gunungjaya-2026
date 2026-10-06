import React from 'react';
import { BellRing, CalendarClock, Sparkles } from 'lucide-react';
import { PilkadesConfig } from '../types/pilkades';

interface AnnouncementBannerProps {
  config: PilkadesConfig;
}

export const AnnouncementBanner: React.FC<AnnouncementBannerProps> = ({ config }) => {
  return (
    <section className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 text-white py-3.5 px-4 sm:px-6 border-y border-amber-500/30 relative z-20 shadow-lg shadow-black/50">
      {/* Glossy top reflective highlight */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-amber-400/50 to-transparent" />

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shrink-0 shadow-inner">
            <BellRing className="w-4 h-4 text-amber-400 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block font-mono">
                PENGUMUMAN PANITIA PILKADES (P2KD)
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            </div>
            <p className="text-xs sm:text-sm font-medium text-slate-200">
              {config.pengumuman}
            </p>
          </div>
        </div>

        <div className="shrink-0 flex items-center gap-2 bg-slate-900/90 border border-amber-500/30 px-3 py-1.5 rounded-xl text-xs font-mono text-slate-200 shadow-inner">
          <CalendarClock className="w-3.5 h-3.5 text-amber-400" />
          <span>Pemungutan Suara: <strong className="text-amber-300">{config.tanggal_pemungutan}</strong></span>
        </div>
      </div>
    </section>
  );
};
