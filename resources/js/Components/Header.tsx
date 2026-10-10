import React, { useState } from 'react';
import { Menu, X, Search, MapPin, Share2 } from 'lucide-react';
import { getPhaseInfo } from '@/types/pilkades';

interface HeaderProps {
  onOpenSheetGuide?: () => void;
  onOpenLogoModal?: () => void;
  currentLogo: string;
  activePage: 'cek-dps' | 'informasi-tps';
  onSelectPage: (page: 'cek-dps' | 'informasi-tps') => void;
  isAdmin?: boolean;
  onOpenAdminModal?: () => void;
  onOpenMascotModal?: () => void;
  onOpenShareModal?: () => void;
  dataPhase?: string;
}

export const Header: React.FC<HeaderProps> = ({
  currentLogo,
  activePage,
  onSelectPage,
  onOpenShareModal,
  dataPhase,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const phase = getPhaseInfo(dataPhase);

  const handleNav = (page: 'cek-dps' | 'informasi-tps') => {
    onSelectPage(page);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-2xs">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Brand Logo & Title */}
          <div
            onClick={() => handleNav('cek-dps')}
            className="flex items-center gap-2.5 sm:gap-3.5 cursor-pointer min-w-0 group"
          >
            <div
              className="relative w-9 h-9 sm:w-11 sm:h-11 shrink-0 flex items-center justify-center rounded-xl bg-white p-1 border border-slate-200/90 shadow-2xs transition-transform duration-150 group-hover:scale-105"
              title="Logo Desa Gunungjaya"
            >
              <img
                src={currentLogo}
                alt="Logo Pilkades Gunungjaya"
                className="w-full h-full object-contain"
              />
            </div>

            <div className="flex flex-col justify-center min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <h1 className="text-[13px] sm:text-[15px] font-black text-slate-900 tracking-tight leading-tight truncate">
                  PILKADES GUNUNGJAYA 2026
                </h1>
              </div>
              <p className="text-[10px] sm:text-xs font-semibold text-slate-500 tracking-tight leading-tight mt-0.5 flex items-center gap-1.5">
                <span>Cek {phase.code} Online Resmi</span>
                <span className="inline-block w-1 h-1 rounded-full bg-slate-300"></span>
                <span className="text-[#58CC02] font-bold">Desa Gunungjaya</span>
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-2.5">
            <button
              onClick={() => handleNav('cek-dps')}
              className={`px-4 py-2.5 text-xs font-black uppercase tracking-wider rounded-2xl transition-all cursor-pointer flex items-center gap-2 ${
                activePage === 'cek-dps'
                  ? 'bg-[#58CC02] text-white border-b-4 border-[#46A302] shadow-sm'
                  : 'bg-white hover:bg-slate-100 text-slate-600 border-2 border-slate-200'
              }`}
            >
              <Search className="w-4 h-4" />
              <span>Cek {phase.code} Online</span>
            </button>

            <button
              onClick={() => handleNav('informasi-tps')}
              className={`px-4 py-2.5 text-xs font-black uppercase tracking-wider rounded-2xl transition-all cursor-pointer flex items-center gap-2 ${
                activePage === 'informasi-tps'
                  ? 'bg-[#1CB0F6] text-white border-b-4 border-[#1899D6] shadow-sm'
                  : 'bg-white hover:bg-slate-100 text-slate-600 border-2 border-slate-200'
              }`}
            >
              <MapPin className="w-4 h-4" />
              <span>Daftar TPS</span>
              <span className={`text-[10px] px-2 py-0.5 rounded-lg font-bold ${
                activePage === 'informasi-tps' ? 'bg-white text-[#1CB0F6]' : 'bg-slate-100 text-slate-600'
              }`}>
                5 TPS
              </span>
            </button>

            {onOpenShareModal && (
              <button
                type="button"
                onClick={onOpenShareModal}
                className="px-3.5 py-2.5 text-xs font-black uppercase tracking-wider rounded-2xl bg-white hover:bg-slate-100 text-slate-700 border-2 border-b-4 border-slate-200 transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
                title={`Bagikan Layanan Cek ${phase.code} ke Warga`}
              >
                <Share2 className="w-4 h-4 text-[#1CB0F6]" />
                <span>Bagikan</span>
              </button>
            )}
          </nav>

          {/* Mobile Action Buttons */}
          <div className="flex items-center gap-1.5 lg:hidden">
            {onOpenShareModal && (
              <button
                type="button"
                onClick={onOpenShareModal}
                className="p-2 rounded-xl text-slate-700 hover:text-[#1CB0F6] hover:bg-slate-100 border border-slate-200/90 active:scale-95 transition-all cursor-pointer"
                title="Bagikan Layanan"
                aria-label="Bagikan Layanan"
              >
                <Share2 className="w-4 h-4 text-[#1CB0F6]" />
              </button>
            )}

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-700 hover:bg-slate-100 border border-slate-200/90 cursor-pointer active:scale-95 transition-all"
              aria-label="Buka Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Segmented Switcher (Integrated into sticky header) */}
        <div className="lg:hidden pb-2.5 pt-0.5">
          <div className="grid grid-cols-2 p-1 bg-slate-100/90 rounded-2xl border border-slate-200/80 gap-1 shadow-inner">
            <button
              type="button"
              onClick={() => handleNav('cek-dps')}
              className={`py-2 px-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 min-h-[38px] cursor-pointer ${
                activePage === 'cek-dps'
                  ? 'bg-[#58CC02] text-white shadow-xs border-b-2 border-[#46A302]'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <Search className="w-3.5 h-3.5" />
              <span>Cek {phase.code}</span>
            </button>
            <button
              type="button"
              onClick={() => handleNav('informasi-tps')}
              className={`py-2 px-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 min-h-[38px] cursor-pointer ${
                activePage === 'informasi-tps'
                  ? 'bg-[#1CB0F6] text-white shadow-xs border-b-2 border-[#1899D6]'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>5 Lokasi TPS</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-5 space-y-2 shadow-lg animate-in slide-in-from-top-2 duration-150">
          <button
            onClick={() => handleNav('cek-dps')}
            className={`w-full py-3 px-4 rounded-2xl text-sm font-black uppercase tracking-wider flex items-center justify-between cursor-pointer ${
              activePage === 'cek-dps'
                ? 'bg-[#58CC02] text-white border-b-4 border-[#46A302]'
                : 'bg-slate-50 text-slate-700 border-2 border-slate-200'
            }`}
          >
            <span className="flex items-center gap-2">
              <Search className="w-4 h-4" />
              <span>Cek {phase.code} Online</span>
            </span>
          </button>

          <button
            onClick={() => handleNav('informasi-tps')}
            className={`w-full py-3 px-4 rounded-2xl text-sm font-black uppercase tracking-wider flex items-center justify-between cursor-pointer ${
              activePage === 'informasi-tps'
                ? 'bg-[#1CB0F6] text-white border-b-4 border-[#1899D6]'
                : 'bg-slate-50 text-slate-700 border-2 border-slate-200'
            }`}
          >
            <span className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span>Informasi 5 TPS</span>
            </span>
            <span className="text-xs bg-white text-[#1CB0F6] px-2 py-0.5 rounded-lg font-extrabold">
              5 TPS
            </span>
          </button>

          {onOpenShareModal && (
            <button
              onClick={() => { onOpenShareModal(); setMobileMenuOpen(false); }}
              className="w-full py-3 px-4 rounded-2xl text-sm font-black uppercase tracking-wider flex items-center justify-between cursor-pointer bg-slate-50 text-slate-700 border-2 border-slate-200"
            >
              <span className="flex items-center gap-2">
                <Share2 className="w-4 h-4 text-[#1CB0F6]" />
                <span>Bagikan Layanan</span>
              </span>
            </button>
          )}
        </div>
      )}
    </header>
  );
};

