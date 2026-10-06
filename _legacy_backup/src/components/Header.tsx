import React, { useState } from 'react';
import { Menu, X, FileSpreadsheet, ImageIcon, Edit3, ShieldCheck } from 'lucide-react';

interface HeaderProps {
  onOpenSheetGuide: () => void;
  onOpenLogoModal: () => void;
  currentLogo: string;
  activePage: 'cek-dps' | 'informasi-tps';
  onSelectPage: (page: 'cek-dps' | 'informasi-tps') => void;
  isAdmin?: boolean;
  onOpenAdminModal?: () => void;
  onOpenMascotModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenSheetGuide,
  onOpenLogoModal,
  currentLogo,
  activePage,
  onSelectPage,
  isAdmin = false,
  onOpenAdminModal,
  onOpenMascotModal
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNav = (page: 'cek-dps' | 'informasi-tps') => {
    onSelectPage(page);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-xl border-b border-slate-800 shadow-2xl shadow-black/80 relative">
      {/* Glossy top reflective highlight */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-amber-400/40 to-transparent" />

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Brand with Village Logo */}
          <div className="flex items-center gap-3">
            <div
              onClick={isAdmin ? onOpenLogoModal : undefined}
              className={`relative w-11 h-11 sm:w-13 sm:h-13 shrink-0 flex items-center justify-center ${
                isAdmin ? 'cursor-pointer group' : ''
              }`}
              title={isAdmin ? 'Klik untuk mengubah/mengganti Logo Pilkades' : 'Logo Desa Gunungjaya'}
            >
              <img
                src={currentLogo}
                alt="Logo Pilkades Gunungjaya"
                className={`w-full h-full object-contain filter drop-shadow-[0_4px_10px_rgba(0,0,0,0.7)] ${
                  isAdmin ? 'group-hover:scale-105 transition-transform' : ''
                }`}
              />
              {isAdmin && (
                <div className="absolute inset-0 bg-slate-950/80 text-white opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-opacity rounded-full text-[9px] font-bold">
                  <Edit3 className="w-3.5 h-3.5 mb-0.5 text-amber-400" />
                  <span>Ganti</span>
                </div>
              )}
            </div>

            <div
              onClick={() => handleNav('cek-dps')}
              className="cursor-pointer"
            >
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-500/40">
                  Desa Gunungjaya 2026
                </span>
                {isAdmin && (
                  <span className="text-[9px] font-bold text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-500/40">
                    Admin
                  </span>
                )}
              </div>
              <h1 className="text-base sm:text-lg font-extrabold text-white tracking-tight leading-tight font-serif drop-shadow-sm">
                PEMILIHAN KEPALA DESA GUNUNGJAYA 2026
              </h1>
              <p className="text-xs font-semibold text-amber-400 tracking-wide font-mono">
                CEK DAFTAR PEMILIH SEMENTARA (DPS) ONLINE
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1.5 xl:gap-2">
            <button
              onClick={() => handleNav('cek-dps')}
              className={`px-4 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                activePage === 'cek-dps'
                  ? 'text-amber-300 bg-amber-500/15 border border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.3)] font-black'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60 border border-transparent'
              }`}
            >
              <span>🔍 Cek DPS</span>
            </button>
            <button
              onClick={() => handleNav('informasi-tps')}
              className={`px-4 py-2.5 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                activePage === 'informasi-tps'
                  ? 'text-amber-300 bg-amber-500/15 border border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.3)] font-black'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60 border border-transparent'
              }`}
            >
              <span>📍 Informasi TPS</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                activePage === 'informasi-tps' ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-400'
              }`}>
                TPS 1 - 5
              </span>
            </button>

            {/* Menu Khusus Administrator */}
            {isAdmin && (
              <>
                {onOpenMascotModal && (
                  <button
                    type="button"
                    onClick={onOpenMascotModal}
                    className="px-3 py-2 bg-gradient-to-r from-amber-500/20 to-amber-600/20 hover:from-amber-500/30 hover:to-amber-600/30 text-amber-300 border border-amber-500/50 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer ml-1"
                    title="Ubah Gambar Maskot Pilkades (Khusus Admin)"
                  >
                    <span>🦅</span>
                    <span>Ubah Maskot</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={onOpenLogoModal}
                  className="px-3 py-2 bg-slate-900 hover:bg-slate-850 text-amber-300 border border-amber-500/40 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                  title="Ganti atau upload logo Pilkades (Khusus Admin)"
                >
                  <ImageIcon className="w-3.5 h-3.5 text-amber-400" />
                  <span>Ubah Logo</span>
                </button>

                <button
                  type="button"
                  onClick={onOpenSheetGuide}
                  className="ml-1 px-3 py-2 bg-emerald-950/70 hover:bg-emerald-900/80 text-emerald-300 border border-emerald-500/40 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                  title="Integrasi Google Sheets & Google Apps Script (Khusus Admin)"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Database Sheets</span>
                </button>

                {onOpenAdminModal && (
                  <button
                    type="button"
                    onClick={onOpenAdminModal}
                    className="p-2 text-slate-400 hover:text-white hover:bg-slate-800/80 rounded-xl transition border border-slate-700/60 cursor-pointer"
                    title="Pengaturan Administrator"
                  >
                    <ShieldCheck className="w-4 h-4 text-amber-400" />
                  </button>
                )}
              </>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 lg:hidden">
            {isAdmin && (
              <>
                {onOpenMascotModal && (
                  <button
                    onClick={onOpenMascotModal}
                    className="p-2 text-amber-300 bg-amber-950/60 rounded-lg border border-amber-500/50 text-xs font-bold flex items-center gap-1 cursor-pointer"
                    title="Ubah Maskot (Admin)"
                  >
                    <span>🦅</span>
                  </button>
                )}
                <button
                  onClick={onOpenLogoModal}
                  className="p-2 text-amber-300 bg-slate-900 rounded-lg border border-amber-500/40 text-xs font-bold flex items-center gap-1 cursor-pointer"
                  title="Ganti Logo (Admin)"
                >
                  <ImageIcon className="w-4 h-4" />
                </button>
                <button
                  onClick={onOpenSheetGuide}
                  className="p-2 text-emerald-300 bg-emerald-950/80 rounded-lg border border-emerald-500/40 cursor-pointer"
                  title="Google Sheets (Admin)"
                >
                  <FileSpreadsheet className="w-4 h-4" />
                </button>
              </>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl text-slate-200 hover:bg-slate-800/80 border border-slate-700/60 cursor-pointer"
              aria-label="Buka Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6 text-white" /> : <Menu className="w-6 h-6 text-white" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-slate-800 space-y-2 bg-slate-950/95 backdrop-blur-xl rounded-b-2xl p-3 shadow-2xl">
            <button
              onClick={() => handleNav('cek-dps')}
              className={`w-full text-left px-4 py-3 text-sm font-bold rounded-xl flex items-center justify-between transition-colors cursor-pointer ${
                activePage === 'cek-dps'
                  ? 'text-amber-300 bg-amber-500/20 border border-amber-500/40'
                  : 'text-slate-200 hover:bg-slate-850 border border-slate-800'
              }`}
            >
              <span>🔍 Halaman Cek DPS Online</span>
              <span className="text-[10px] bg-amber-500 text-slate-950 font-black px-2 py-0.5 rounded uppercase">Fitur Utama</span>
            </button>
            <button
              onClick={() => handleNav('informasi-tps')}
              className={`w-full text-left px-4 py-3 text-sm font-bold rounded-xl flex items-center justify-between transition-colors cursor-pointer ${
                activePage === 'informasi-tps'
                  ? 'text-amber-300 bg-amber-500/20 border border-amber-500/40'
                  : 'text-slate-200 hover:bg-slate-850 border border-slate-800'
              }`}
            >
              <span>📍 Halaman Informasi TPS</span>
              <span className="text-[10px] bg-slate-800 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded font-mono font-bold">
                TPS 1 - 5
              </span>
            </button>

            {/* Menu Admin di Mobile */}
            {isAdmin && (
              <div className="pt-2 border-t border-slate-800 space-y-1">
                <span className="px-4 text-[10px] font-bold uppercase tracking-wider text-amber-400 block font-mono">
                  Menu Administrator
                </span>
                {onOpenMascotModal && (
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenMascotModal();
                    }}
                    className="w-full text-left px-4 py-2.5 text-sm font-semibold text-amber-300 bg-amber-950/60 hover:bg-amber-900/60 rounded-xl flex items-center gap-2 border border-amber-500/40 cursor-pointer"
                  >
                    <span className="text-base">🦅</span>
                    <span>Ubah Gambar Maskot Pilkades</span>
                  </button>
                )}
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenLogoModal();
                  }}
                  className="w-full text-left px-4 py-2.5 text-sm font-semibold text-amber-300 bg-slate-900 hover:bg-slate-850 rounded-xl flex items-center gap-2 border border-amber-500/30 cursor-pointer"
                >
                  <ImageIcon className="w-4 h-4 text-amber-400" />
                  <span>Ubah / Upload Logo Pilkades</span>
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenSheetGuide();
                  }}
                  className="w-full text-left px-4 py-2.5 text-sm font-semibold text-emerald-300 bg-emerald-950/60 hover:bg-emerald-900/60 rounded-xl flex items-center gap-2 border border-emerald-500/30 cursor-pointer"
                >
                  <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                  <span>Konfigurasi Google Sheets API</span>
                </button>
                {onOpenAdminModal && (
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenAdminModal();
                    }}
                    className="w-full text-left px-4 py-2.5 text-sm font-semibold text-slate-300 bg-slate-900 hover:bg-slate-850 rounded-xl flex items-center gap-2 border border-slate-700/60 cursor-pointer"
                  >
                    <ShieldCheck className="w-4 h-4 text-amber-400" />
                    <span>Pengaturan / Keluar Mode Admin</span>
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};
