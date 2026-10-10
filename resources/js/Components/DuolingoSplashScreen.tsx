import React, { useState, useEffect } from 'react';
import { Sparkles, CheckCircle2, ShieldCheck, ArrowRight } from 'lucide-react';
import { DEFAULT_MASCOT_GLAWU } from '../data/logoPresets';
import { getPhaseInfo } from '../types/pilkades';

interface DuolingoSplashScreenProps {
  mascotSrc?: string;
  desa?: string;
  onComplete?: () => void;
  dataPhase?: string;
}

export const DuolingoSplashScreen: React.FC<DuolingoSplashScreenProps> = ({
  mascotSrc,
  desa = 'Gunungjaya',
  onComplete,
  dataPhase,
}) => {
  const phase = getPhaseInfo(dataPhase);
  // Hanya tampil sekali per sesi browser agar tidak memperlambat saat refresh
  const [isVisible, setIsVisible] = useState(() => {
    if (typeof window !== 'undefined') {
      return !sessionStorage.getItem('pilkades_splash_seen');
    }
    return true;
  });

  const [isExiting, setIsExiting] = useState(false);
  const [progress, setProgress] = useState(35);
  const [statusText, setStatusText] = useState('Menghubungkan database Pilkades...');

  useEffect(() => {
    if (!isVisible) return;

    // Stage 1: Progress cepat
    const t1 = setTimeout(() => {
      setProgress(75);
      setStatusText('Menyiapkan layanan DPS...');
    }, 150);

    // Stage 2: Selesai 100%
    const t2 = setTimeout(() => {
      setProgress(100);
      setStatusText('Sistem Siap! Sugeng Rawuh...');
    }, 380);

    // Stage 3: Langsung transisi keluar (Total ~0.65 detik)
    const t3 = setTimeout(() => {
      handleClose();
    }, 650);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [isVisible]);

  const handleClose = () => {
    try {
      sessionStorage.setItem('pilkades_splash_seen', '1');
    } catch {}
    setIsExiting(true);
    setTimeout(() => {
      setIsVisible(false);
      if (onComplete) onComplete();
    }, 280);
  };

  if (!isVisible) return null;

  return (
    <div
      role="dialog"
      aria-label="Splash Screen Pilkades Gunungjaya"
      aria-modal="true"
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-between p-6 sm:p-10 select-none bg-[#58CC02] text-white overflow-hidden transition-all duration-500 ${
        isExiting
          ? 'opacity-0 scale-105 pointer-events-none'
          : 'opacity-100 scale-100'
      }`}
    >
      {/* Background Duolingo Polka Dot Grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: 'radial-gradient(#ffffff 2px, transparent 2px)',
          backgroundSize: '24px 24px',
        }}
      />

      {/* Decorative Soft Glow Rings */}
      <div className="absolute w-[500px] h-[500px] rounded-full bg-white/10 blur-3xl pointer-events-none top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />

      {/* Top Bar: Event Badge & Skip Button */}
      <header className="w-full max-w-md mx-auto flex items-center justify-between relative z-10">
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-black/15 backdrop-blur-xs text-xs font-black uppercase tracking-wider text-white/95 border border-white/20">
          <Sparkles className="w-3.5 h-3.5 text-[#FFC800]" />
          <span>Pilkades {desa} 2026</span>
        </div>

        <button
          type="button"
          onClick={handleClose}
          className="px-3.5 py-1.5 rounded-2xl bg-white/20 hover:bg-white/30 text-white font-black text-xs uppercase tracking-wider transition-all flex items-center gap-1 border border-white/30 active:scale-95 cursor-pointer shadow-xs"
        >
          <span>Lewati</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </header>

      {/* Center Showcase: Mascot GLAWU with Duolingo Bounce & Speech Bubble */}
      <main className="flex-1 flex flex-col items-center justify-center relative z-10 my-4 text-center">
        {/* Duolingo Speech Bubble */}
        <div className="relative mb-5 bg-white text-slate-900 px-5 py-3 rounded-2xl border-2 border-b-4 border-black/10 shadow-lg duo-pop-in max-w-xs">
          <p className="text-xs sm:text-sm font-black leading-snug">
            Sugeng Rawuh Warga Desa {desa}! Ayo cek hak suara Anda!
          </p>
          {/* Bubble Pointer Arrow */}
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white rotate-45 border-r-2 border-b-4 border-black/10" />
        </div>

        {/* Mascot GLAWU with dynamic hopping animation */}
        <div className="flex flex-col items-center justify-center relative">
          <div className="relative">
            {/* Sparkle badge floating */}
            <div className="absolute -top-3 -right-2 bg-[#FFC800] text-amber-950 p-2 rounded-2xl border-2 border-[#E59B00] shadow-md duo-float z-20">
              <ShieldCheck className="w-4 h-4" />
            </div>

            <img
              src={mascotSrc || DEFAULT_MASCOT_GLAWU}
              alt="Maskot Pilkades GLAWU"
              className="w-36 sm:w-44 md:w-48 h-36 sm:h-44 md:h-48 object-contain duo-mascot-hop select-none filter drop-shadow-2xl"
            />
          </div>

          {/* Synchronized ground shadow */}
          <div className="w-24 sm:w-32 h-4 bg-black/25 rounded-full blur-[3px] duo-mascot-shadow -mt-2" />
        </div>

        {/* Headline */}
        <div className="mt-6 space-y-1.5">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight drop-shadow-md">
            CEK {phase.code} ONLINE
          </h1>
          <p className="text-xs sm:text-sm font-extrabold text-white/90">
            Layanan Resmi Pengecekan {phase.name}
          </p>
        </div>
      </main>

      {/* Bottom Progress Bar & Loading Indicator */}
      <footer className="w-full max-w-sm mx-auto space-y-3 relative z-10 text-center">
        {/* Tactile 3D Duolingo Capsule Progress Bar */}
        <div className="w-full h-5 bg-black/20 rounded-full p-1 border-2 border-b-4 border-black/30 shadow-inner overflow-hidden">
          <div
            className="h-full bg-[#FFC800] border-b-2 border-[#E59B00] rounded-full transition-all duration-500 ease-out duo-stripes"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Status text & percentage */}
        <div className="flex items-center justify-between text-xs font-black text-white/90 px-1">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-white animate-pulse" />
            <span className="truncate max-w-[220px]">{statusText}</span>
          </div>
          <span className="text-[#FFC800] tracking-wider">{progress}%</span>
        </div>
      </footer>
    </div>
  );
};
