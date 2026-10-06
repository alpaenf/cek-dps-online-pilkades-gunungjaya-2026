import React, { useState } from 'react';
import { Menu, X, FileSpreadsheet, ImageIcon, Edit3, ShieldCheck, Search, MapPin, Sparkles, Share2 } from 'lucide-react';

interface HeaderProps {
  onOpenSheetGuide: () => void;
  onOpenLogoModal: () => void;
  currentLogo: string;
  activePage: 'cek-dps' | 'informasi-tps';
  onSelectPage: (page: 'cek-dps' | 'informasi-tps') => void;
  isAdmin?: boolean;
  onOpenAdminModal?: () => void;
  onOpenMascotModal?: () => void;
  onOpenShareModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenSheetGuide,
  onOpenLogoModal,
  currentLogo,
  activePage,
  onSelectPage,
  isAdmin = false,
  onOpenAdminModal,
  onOpenMascotModal,
  onOpenShareModal
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNav = (page: 'cek-dps' | 'informasi-tps') => {
    onSelectPage(page);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b-2 border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo & Title */}
          <div className="flex items-center gap-3.5">
            <div
              onClick={isAdmin ? onOpenLogoModal : undefined}
              className={`relative w-12 h-12 sm:w-14 sm:h-14 shrink-0 flex items-center justify-center ${
                isAdmin ? 'cursor-pointer group' : ''
              }`}
              title={isAdmin ? 'Ganti Logo Pilkades' : 'Logo Desa Gunungjaya'}
            >
              <img
                src={currentLogo}
                alt="Logo Pilkades Gunungjaya"
                className="w-full h-full object-contain transition-transform group-hover:scale-105"
              />
              {isAdmin && (
                <div className="absolute inset-0 bg-slate-900/60 text-white opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-opacity rounded-xl text-[9px] font-bold backdrop-blur-xs">
                  <Edit3 className="w-3.5 h-3.5 mb-0.5 text-[#58CC02]" />
                  <span>Ubah</span>
                </div>
              )}
            </div>

            <div
              onClick={() => handleNav('cek-dps')}
              className="cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#58CC02] bg-[#E5F9D2] px-2.5 py-0.5 rounded-lg border border-[#58CC02]/30">
                  Pilkades 2026
                </span>
                {isAdmin && (
                  <span className="text-[10px] font-bold text-[#1CB0F6] bg-[#DDF4FF] px-2 py-0.5 rounded-lg border border-[#1CB0F6]/30">
                    Mode Admin
                  </span>
                )}
              </div>
              <h1 className="text-base sm:text-lg font-black text-slate-900 tracking-tight leading-tight">
                PILKADES GUNUNGJAYA 2026
              </h1>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                Cek DPS Online Desa Gunungjaya
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
              <span>Cek DPS Online</span>
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
                title="Bagikan Layanan Cek DPS ke Warga"
              >
                <Share2 className="w-4 h-4 text-[#1CB0F6]" />
                <span>Bagikan</span>
              </button>
            )}

            {/* Menu Khusus Administrator */}
            {isAdmin && (
              <div className="flex items-center gap-2 ml-2 pl-3 border-l-2 border-slate-200">
                {onOpenMascotModal && (
                  <button
                    type="button"
                    onClick={onOpenMascotModal}
                    className="px-3 py-2 bg-[#FFC800] hover:bg-[#e6b400] text-amber-950 font-bold border-b-4 border-[#E59B00] rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                    title="Ubah Gambar Maskot Pilkades"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Maskot</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={onOpenLogoModal}
                  className="px-3 py-2 bg-white hover:bg-slate-50 text-slate-700 font-bold border-2 border-b-4 border-slate-200 rounded-xl text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                  title="Ganti Logo Pilkades"
                >
                  <ImageIcon className="w-3.5 h-3.5 text-slate-600" />
                  <span>Logo</span>
                </button>

                <button
                  type="button"
                  onClick={onOpenSheetGuide}
                  className="px-3 py-2 bg-[#E5F9D2] hover:bg-[#d7ffb8] text-[#46A302] font-bold border-2 border-b-4 border-[#58CC02] rounded-xl text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                  title="Pengaturan Google Sheets"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                  <span>Sheets</span>
                </button>

                <a
                  href="/admin/dashboard"
                  className="px-3 py-2 bg-[#E5F9D2] hover:bg-[#d8f9ba] text-[#46A302] rounded-xl transition border-2 border-b-4 border-[#58CC02] text-xs font-black flex items-center gap-1.5 cursor-pointer shadow-2xs"
                  title="Panel Admin (CRUD TPS & DPS)"
                >
                  <ShieldCheck className="w-4 h-4 text-[#58CC02]" />
                  <span>Panel Admin</span>
                </a>
              </div>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 lg:hidden">
            {isAdmin && (
              <>
                {onOpenMascotModal && (
                  <button
                    onClick={onOpenMascotModal}
                    className="p-2 text-amber-950 bg-[#FFC800] rounded-xl border-b-2 border-[#E59B00] font-bold flex items-center gap-1 cursor-pointer"
                    title="Ubah Maskot"
                  >
                    <Sparkles className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={onOpenLogoModal}
                  className="p-2 text-slate-700 bg-white rounded-xl border-2 border-slate-200 font-bold flex items-center gap-1 cursor-pointer"
                  title="Ganti Logo"
                >
                  <ImageIcon className="w-4 h-4" />
                </button>
              </>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-2xl text-slate-700 hover:bg-slate-100 border-2 border-slate-200 cursor-pointer"
              aria-label="Buka Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t-2 border-slate-200 bg-white px-4 pt-3 pb-5 space-y-2">
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
              <span>Cek DPS Online</span>
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

          {isAdmin && (
            <div className="pt-3 border-t-2 border-slate-200 space-y-2">
              <p className="text-xs font-extrabold uppercase text-slate-400 px-1">Menu Panitia</p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => { onOpenLogoModal(); setMobileMenuOpen(false); }}
                  className="py-2.5 px-3 bg-white text-slate-700 font-bold border-2 border-slate-200 rounded-xl text-xs flex items-center justify-center gap-1.5"
                >
                  <ImageIcon className="w-4 h-4 text-[#1CB0F6]" />
                  <span>Logo</span>
                </button>
                <button
                  onClick={() => { onOpenSheetGuide(); setMobileMenuOpen(false); }}
                  className="py-2.5 px-3 bg-white text-slate-700 font-bold border-2 border-slate-200 rounded-xl text-xs flex items-center justify-center gap-1.5"
                >
                  <FileSpreadsheet className="w-4 h-4 text-[#58CC02]" />
                  <span>Sheets</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
