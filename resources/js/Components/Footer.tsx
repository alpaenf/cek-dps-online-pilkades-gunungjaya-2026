import React from 'react';
import { MapPin, Phone, FileSpreadsheet, ImageIcon, Lock, Search, ShieldCheck } from 'lucide-react';
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
    <footer className="bg-white border-t-2 border-slate-200 text-slate-600 pt-12 pb-24 sm:pb-12 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-8 border-b-2 border-slate-100">
          
          {/* Identity Column */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div
                onClick={isAdmin ? onOpenLogoModal : undefined}
                className={`w-12 h-12 flex items-center justify-center shrink-0 ${
                  isAdmin ? 'cursor-pointer hover:scale-105 transition-all' : ''
                }`}
                title={isAdmin ? 'Ganti Logo Pilkades' : 'Logo Desa Gunungjaya'}
              >
                <img
                  src={currentLogo}
                  alt="Logo Pilkades Gunungjaya"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <span className="text-[11px] uppercase font-black tracking-wider text-[#58CC02] block">
                  P2KD Desa Gunungjaya
                </span>
                <h3 className="text-base font-black text-slate-900 leading-snug">
                  PILKADES GUNUNGJAYA 2026
                </h3>
              </div>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed font-medium">
              Layanan resmi pengecekan Daftar Pemilih Sementara (DPS) & DPT Pemilihan Kepala Desa Gunungjaya, Kecamatan Belik, Kabupaten Pemalang.
            </p>
          </div>

          {/* Navigation Links */}
          <div className="md:col-span-3 space-y-3">
            <span className="text-xs font-black uppercase tracking-wider text-slate-900 block">
              Menu Utama
            </span>
            <ul className="space-y-2 text-xs font-bold">
              <li>
                <button
                  type="button"
                  onClick={() => handleNavClick('cek-dps')}
                  className="text-slate-600 hover:text-[#58CC02] transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <Search className="w-3.5 h-3.5 text-[#58CC02]" />
                  <span>Cek DPS Online</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleNavClick('informasi-tps')}
                  className="text-slate-600 hover:text-[#1CB0F6] transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <MapPin className="w-3.5 h-3.5 text-[#1CB0F6]" />
                  <span>Daftar TPS 1 s/d 5</span>
                </button>
              </li>

              {isAdmin && (
                <>
                  <li className="pt-2 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={onOpenLogoModal}
                      className="text-slate-600 hover:text-slate-900 transition-colors flex items-center gap-2 cursor-pointer"
                    >
                      <ImageIcon className="w-3.5 h-3.5 text-slate-500" />
                      <span>Kelola Logo</span>
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={onOpenSheetGuide}
                      className="text-[#46A302] hover:text-[#58CC02] transition-colors flex items-center gap-2 cursor-pointer"
                    >
                      <FileSpreadsheet className="w-3.5 h-3.5" />
                      <span>Pengaturan Google Sheets</span>
                    </button>
                  </li>
                </>
              )}
            </ul>
          </div>

          {/* Sekretariat Info & Kontak */}
          <div className="md:col-span-4 space-y-3">
            <span className="text-xs font-black uppercase tracking-wider text-slate-900 block">
              Sekretariat P2KD
            </span>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">
              {config.alamat_sekretariat}
            </p>
            <div className="pt-1">
              <a
                href={`https://wa.me/${(config.whatsapp_panitia || '').replace(/\D/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#58CC02] hover:bg-[#50b802] text-white border-b-4 border-[#46A302] text-xs font-black uppercase tracking-wider transition-all"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>WhatsApp: {config.whatsapp_panitia}</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400 font-medium">
          <p>© 2026 Panitia Pemilihan Kepala Desa (P2KD) Gunungjaya, Kec. Belik, Kab. Pemalang.</p>
          <div className="text-[11px] text-slate-400 font-semibold">
            Portal Resmi Pengecekan DPS Online
          </div>
        </div>
      </div>
    </footer>
  );
};
