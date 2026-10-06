import React from 'react';
import { ShieldCheck, MapPin, Phone, FileSpreadsheet, Heart, ImageIcon, Lock } from 'lucide-react';
import { PilkadesConfig } from '../types/pilkades';

interface FooterProps {
  config: PilkadesConfig;
  onOpenSheetGuide: () => void;
  currentLogo: string;
  onOpenLogoModal: () => void;
  isAdmin?: boolean;
  onOpenAdminModal?: () => void;
  onSelectPage?: (page: 'cek-dps' | 'informasi-tps') => void;
}

export const Footer: React.FC<FooterProps> = ({
  config,
  onOpenSheetGuide,
  currentLogo,
  onOpenLogoModal,
  isAdmin = false,
  onOpenAdminModal,
  onSelectPage
}) => {
  const handleNavClick = (page: 'cek-dps' | 'informasi-tps') => {
    if (onSelectPage) {
      onSelectPage(page);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-gradient-to-b from-black/85 via-slate-950/95 to-black text-slate-300 pt-12 pb-24 sm:pb-12 border-t border-white/10 relative z-10 shadow-[0_-20px_50px_rgba(0,0,0,0.9)]">
      {/* Glossy top reflective highlight */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-amber-400/50 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-10 border-b border-slate-800">
          {/* Identity Column */}
          <div className="md:col-span-6 space-y-4">
            <div className="flex items-center gap-3">
              <div
                onClick={isAdmin ? onOpenLogoModal : undefined}
                className={`w-12 h-12 flex items-center justify-center shrink-0 ${
                  isAdmin ? 'cursor-pointer hover:scale-105 transition-all' : ''
                }`}
                title={isAdmin ? 'Klik untuk mengubah logo Pilkades (Admin)' : 'Logo Desa Gunungjaya'}
              >
                <img
                  src={currentLogo}
                  alt="Logo Pilkades Gunungjaya"
                  className="w-full h-full object-contain filter drop-shadow-[0_4px_10px_rgba(0,0,0,0.7)]"
                />
              </div>
              <div>
                <span className="text-xs uppercase font-extrabold tracking-wider text-amber-400 block font-mono">
                  PANITIA PEMILIHAN KEPALA DESA (P2KD)
                </span>
                <h3 className="text-base font-bold text-white font-serif">
                  DESA GUNUNGJAYA TAHUN 2026
                </h3>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed max-w-md">
              Portal Resmi Pengecekan Daftar Pemilih Sementara (DPS) Pemilihan Kepala Desa Gunungjaya, Kecamatan Belik, Kabupaten Pemalang.
            </p>
          </div>

          {/* Navigasi Halaman Terpisah */}
          <div className="md:col-span-3 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-white block mb-3 font-mono">
              Halaman Utama
            </span>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  type="button"
                  onClick={() => handleNavClick('cek-dps')}
                  className="text-amber-400 hover:text-amber-300 transition-colors font-medium flex items-center gap-1.5 cursor-pointer text-left"
                >
                  <span>🔍</span>
                  <span>Halaman Cek DPS Online</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleNavClick('informasi-tps')}
                  className="text-slate-300 hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer text-left"
                >
                  <span>📍</span>
                  <span>Halaman Informasi TPS (1 - 5)</span>
                </button>
              </li>

              {/* Menu Khusus Admin */}
              {isAdmin && (
                <>
                  <li className="pt-2 border-t border-slate-800">
                    <button
                      type="button"
                      onClick={onOpenLogoModal}
                      className="text-amber-400 hover:text-amber-300 font-medium transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <ImageIcon className="w-3.5 h-3.5 text-amber-400" />
                      <span>Ubah / Upload Logo</span>
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={onOpenSheetGuide}
                      className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Database Google Sheets</span>
                    </button>
                  </li>
                </>
              )}
            </ul>
          </div>

          {/* Sekretariat Info & Kontak (Tetap Tampil di Semua Halaman) */}
          <div className="md:col-span-3 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-white block mb-3 font-mono">
              Sekretariat P2KD
            </span>
            <p className="text-xs text-slate-400 leading-relaxed">
              {config.alamat_sekretariat}
            </p>
            <div className="pt-2">
              <a
                href={`https://wa.me/${(config.whatsapp_panitia || '').replace(/\D/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-300 text-xs font-semibold transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-emerald-400" />
                <span>WhatsApp: {config.whatsapp_panitia}</span>
              </a>
            </div>
            <div className="pt-2">
              <span className="inline-block px-2.5 py-1 bg-slate-900 text-amber-300 rounded-lg text-[11px] font-mono border border-amber-500/30">
                Pilkades Bersih, Guyub & Damai
              </span>
            </div>
          </div>
        </div>

        {/* Bottom copyright & Discreet Admin Access Link */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <p>© 2026 Panitia Pemilihan Kepala Desa (P2KD) Gunungjaya, Kec. Belik, Kab. Pemalang.</p>
          <div className="flex items-center gap-3">
            {onOpenAdminModal && (
              <button
                type="button"
                onClick={onOpenAdminModal}
                className={`flex items-center gap-1.5 transition-colors px-2 py-1 rounded text-[11px] cursor-pointer ${
                  isAdmin
                    ? 'text-amber-400 bg-amber-950/60 hover:bg-amber-900/60 border border-amber-500/40 font-semibold'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
                title={isAdmin ? 'Buka Panel Admin / Logout' : 'Akses Khusus Administrator Website'}
              >
                <Lock className="w-3 h-3" />
                <span>{isAdmin ? '🛡️ Mode Admin Aktif (Keluar / Pengaturan)' : 'Akses Admin'}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};
