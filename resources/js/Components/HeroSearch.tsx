import React, { useState } from 'react';
import { Search, AlertCircle, Loader2, CheckCircle2, ShieldCheck, Edit3, Sparkles, X, RefreshCw, Wrench, Database } from 'lucide-react';
import { DEFAULT_MASCOT_GLAWU } from '../data/logoPresets';
import { DpsRecapSection } from './DpsRecapSection';
import { PilkadesConfig, DpsRecapData, TpsItem } from '../types/pilkades';
import { DEFAULT_DPS_RECAP } from '../data/dpsRecapData';

interface HeroSearchProps {
  onSearch: (nik: string) => void;
  isLoading: boolean;
  errorMessage?: string;
  onClearError?: () => void;
  currentLogo: string;
  onOpenLogoModal: () => void;
  onOpenSheetGuide?: () => void;
  onSwitchToDemo?: () => void;
  isAdmin?: boolean;
  watermarkSrc?: string;
  onScrollToMascot?: () => void;
  mascotSrc?: string;
  onOpenMascotModal?: () => void;
  config?: PilkadesConfig;
  recapData?: DpsRecapData;
  tpsList?: TpsItem[];
  onOpenEditRecap?: () => void;
}

export const HeroSearch: React.FC<HeroSearchProps> = ({
  onSearch,
  isLoading,
  errorMessage,
  onClearError,
  currentLogo,
  onOpenLogoModal,
  onOpenSheetGuide,
  onSwitchToDemo,
  isAdmin = false,
  mascotSrc,
  onOpenMascotModal,
  config,
  recapData,
  tpsList,
  onOpenEditRecap
}) => {
  const [nikInput, setNikInput] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value;

    if (validationError) setValidationError(null);
    if (onClearError) onClearError();

    const noSpaces = rawVal.replace(/\s+/g, '');

    if (/[^\d]/.test(noSpaces)) {
      setValidationError('NIK hanya boleh berisi angka.');
      const digitsOnly = noSpaces.replace(/\D/g, '');
      setNikInput(digitsOnly.slice(0, 16));
      return;
    }

    const digitsOnly = noSpaces.slice(0, 16);
    setNikInput(digitsOnly);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const cleaned = nikInput.trim();

    if (!cleaned) {
      setValidationError('Masukkan 16 digit NIK sesuai KTP/KK.');
      return;
    }

    if (!/^\d+$/.test(cleaned)) {
      setValidationError('NIK hanya boleh berisi angka.');
      return;
    }

    if (cleaned.length < 16) {
      setValidationError('NIK harus terdiri dari 16 digit.');
      return;
    }

    setValidationError(null);
    onSearch(cleaned);
  };

  return (
    <section id="hero-cek-dpt" className="relative py-6 sm:py-10 bg-[#F7F9FA] text-slate-800">
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
        
        {/* Showcase Header: Maskot GLAWU & Speech Bubble */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 sm:gap-8 items-center">
          
          {/* Kolom Kiri: Maskot GLAWU */}
          <div className="md:col-span-5 flex flex-col items-center justify-center relative">
            <div className="relative flex flex-col items-center justify-center">
              <img
                src={mascotSrc || DEFAULT_MASCOT_GLAWU}
                alt={`Maskot Pilkades: ${config?.mascot_name || 'GLAWU'}`}
                width={520}
                height={780}
                loading="eager"
                decoding="async"
                className="w-36 sm:w-48 md:w-60 max-h-[190px] sm:max-h-[240px] md:max-h-[300px] object-contain select-none transition-transform duration-200 hover:scale-105 drop-shadow-md"
              />

              {/* Subtle ground shadow to anchor the mascot */}
              <div className="w-24 sm:w-36 h-3 bg-slate-400/25 rounded-full blur-[2px] -mt-1" />
            </div>
          </div>

          {/* Kolom Kanan: Speech Bubble & Keterangan */}
          <div className="md:col-span-7 space-y-3 sm:space-y-4 text-center md:text-left">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
              <span className="px-3 py-1 rounded-xl bg-[#E5F9D2] text-[#46A302] border-2 border-[#58CC02] text-xs font-black uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Maskot Resmi Pilkades</span>
              </span>
              <span className="text-xs font-extrabold text-[#1CB0F6] uppercase tracking-wider bg-[#DDF4FF] px-2.5 py-1 rounded-xl border border-[#1CB0F6]/30">
                Desa {config?.desa || 'Gunungjaya'}
              </span>
            </div>

            <div className="relative bg-white border-2 border-b-4 border-slate-200 rounded-3xl p-4 sm:p-6 shadow-xs">
              <h2 className="text-base sm:text-xl font-black text-slate-900 leading-snug">
                Sugeng Rawuh Warga Desa {config?.desa || 'Gunungjaya'}!
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1.5 sm:mt-2 leading-relaxed font-medium">
                Saya <strong>{config?.mascot_name || 'GLAWU'}</strong>, maskot resmi Pilkades {config?.desa || 'Gunungjaya'} {config?.tahun || '2026'}. Masukkan <strong>16 digit NIK</strong> Anda untuk memeriksa hak suara dalam <strong>Daftar Pemilih Sementara ({config?.dataPhase || 'DPS'})</strong>.
              </p>

              <div className="mt-3 sm:mt-4 pt-3 border-t border-slate-100 flex flex-wrap gap-2 justify-center md:justify-start text-xs font-bold text-slate-600">
                <span className="px-2.5 py-1 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-1 text-[#46A302] text-[11px] sm:text-xs">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Database MySQL Pilkades
                </span>
                <span className="px-2.5 py-1 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-1 text-[#1CB0F6] text-[11px] sm:text-xs">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Privasi NIK Terlindungi
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Dedicated Main Search Box (Duolingo Style Chunky White Card) */}
        <div className="bg-white border-2 border-b-4 border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm">
          <div className="mb-6 text-center sm:text-left">
            <h3 className="text-lg sm:text-xl font-black text-slate-900 uppercase tracking-tight">
              Pengecekan NIK Pemilih
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
              Ketikkan nomor NIK yang tertera pada KTP-el atau Kartu Keluarga Anda.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label
                  htmlFor="nik-input"
                  className="text-xs sm:text-sm font-black text-slate-700 uppercase tracking-wider"
                >
                  Nomor Induk Kependudukan (NIK)
                </label>
                <span className={`text-xs font-black px-2.5 py-0.5 rounded-lg border ${
                  nikInput.length === 16
                    ? 'bg-[#E5F9D2] text-[#46A302] border-[#58CC02]'
                    : 'bg-slate-100 text-slate-500 border-slate-200'
                }`}>
                  {nikInput.length} / 16 Digit
                </span>
              </div>

              <div className="relative">
                <input
                  id="nik-input"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={nikInput}
                  onChange={handleInputChange}
                  placeholder="Contoh: 3327091205850001"
                  disabled={isLoading}
                  maxLength={16}
                  className={`w-full pl-5 pr-20 py-4 text-lg sm:text-xl tracking-wider font-extrabold rounded-2xl border-2 border-b-4 transition-all duration-150 focus:outline-none ${
                    validationError || errorMessage
                      ? 'border-[#FF4B4B] border-b-[#EA2B2B] bg-[#FFE5E5] text-[#EA2B2B]'
                      : nikInput.length === 16
                      ? 'border-[#58CC02] border-b-[#46A302] bg-[#E5F9D2]/30 text-slate-900 focus:bg-white'
                      : 'border-slate-200 border-b-slate-300 bg-slate-50 text-slate-900 focus:border-[#58CC02] focus:border-b-[#46A302] focus:bg-white placeholder:text-slate-400'
                  }`}
                  aria-describedby="nik-helper"
                />

                <div className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                  {nikInput.length > 0 && !isLoading && (
                    <button
                      type="button"
                      onClick={() => {
                        setNikInput('');
                        setValidationError(null);
                        if (onClearError) onClearError();
                      }}
                      className="p-1.5 text-slate-400 hover:text-slate-700 bg-slate-200 hover:bg-slate-300 rounded-xl transition-colors cursor-pointer"
                      title="Hapus NIK"
                      aria-label="Hapus NIK"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}

                  {nikInput.length === 16 && !validationError && (
                    <div className="text-[#58CC02] p-1 flex items-center gap-1 text-xs font-bold" title="16 Digit Lengkap">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                  )}
                </div>
              </div>

              {/* Error Alert Display */}
              {(validationError || errorMessage) && (
                <div className="mt-3 p-4 rounded-2xl bg-[#FFE5E5] border-2 border-[#FF4B4B] text-xs sm:text-sm text-[#EA2B2B] font-bold space-y-2">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{validationError || errorMessage}</span>
                  </div>

                  {errorMessage && errorMessage.includes('Google Sheets') && isAdmin && (
                    <div className="pt-2 border-t border-[#FF4B4B]/30 flex flex-wrap items-center gap-2 text-xs">
                      {onOpenSheetGuide && (
                        <button
                          type="button"
                          onClick={onOpenSheetGuide}
                          className="px-3 py-1.5 bg-[#FF4B4B] hover:bg-[#e03d3d] text-white rounded-xl font-bold flex items-center gap-1.5"
                        >
                          <Wrench className="w-3.5 h-3.5" />
                          <span>Panduan Solusi</span>
                        </button>
                      )}
                      {onSwitchToDemo && (
                        <button
                          type="button"
                          onClick={onSwitchToDemo}
                          className="px-3 py-1.5 bg-white text-slate-700 border-2 border-slate-200 rounded-xl font-bold flex items-center gap-1.5"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                          <span>Mode Demo</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}

              <p id="nik-helper" className="text-xs text-slate-400 font-medium mt-2">
                Data NIK Anda dijaga kerahasiaannya dan hanya digunakan untuk pencarian DPS Pilkades.
              </p>
            </div>

            {/* Action Button: Duolingo Tactile 3D Green Button */}
            <div>
              <button
                type="submit"
                disabled={isLoading || nikInput.length === 0}
                className={`w-full py-4 px-6 rounded-2xl font-black text-sm sm:text-base uppercase tracking-wider flex items-center justify-center gap-2.5 transition-all duration-100 ${
                  isLoading
                    ? 'bg-slate-300 text-slate-500 border-b-4 border-slate-400 cursor-not-allowed'
                    : 'bg-[#58CC02] hover:bg-[#50b802] text-white border-b-4 border-[#46A302] active:border-b-0 active:translate-y-1 shadow-sm cursor-pointer'
                }`}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Sedang Memeriksa Database...</span>
                  </>
                ) : (
                  <>
                    <Search className="w-5 h-5" />
                    <span>Cek Data Saya</span>
                  </>
                )}
              </button>
            </div>

            {/* Duolingo Mascot GLAWU Loading Animation */}
            {isLoading && (
              <div className="mt-6 pt-6 border-t-2 border-slate-100 animate-in fade-in zoom-in-95 duration-200">
                <div className="bg-[#F0FDF4] border-2 border-b-4 border-[#86EFAC] rounded-3xl p-5 sm:p-6 shadow-xs relative overflow-hidden">
                  {/* Background Soft Glow Accent */}
                  <div className="absolute -top-12 -right-12 w-32 h-32 bg-[#DCFCE7]/70 rounded-full blur-2xl pointer-events-none" />

                  <div className="flex flex-col sm:flex-row items-center gap-5 sm:gap-6 relative z-10">
                    
                    {/* Maskot GLAWU Melompat Lucu dengan Bayangan Dinamis */}
                    <div className="flex flex-col items-center justify-center shrink-0">
                      <div className="relative">
                        {/* Sparkle badge floating */}
                        <div className="absolute -top-2 -right-2 bg-[#FFC800] text-amber-950 p-1.5 rounded-full border-2 border-[#E59B00] shadow-sm duo-float z-10" title="GLAWU Aktif">
                          <Sparkles className="w-3.5 h-3.5" />
                        </div>

                        <img
                          src={mascotSrc || DEFAULT_MASCOT_GLAWU}
                          alt="Maskot GLAWU Sedang Mencari Data"
                          className="w-24 sm:w-28 h-24 sm:h-28 object-contain duo-mascot-hop select-none filter drop-shadow-md"
                        />
                      </div>
                      {/* Bayangan di tanah yang mengembang & menyusut seirama lompatan */}
                      <div className="w-16 sm:w-20 h-3 bg-emerald-950/20 rounded-full blur-[2px] duo-mascot-shadow -mt-1" />
                    </div>

                    {/* Speech / Status ala Duolingo */}
                    <div className="flex-1 text-center sm:text-left space-y-3 w-full">
                      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                        <span className="px-3 py-1 rounded-xl bg-[#DCFCE7] text-[#15803D] border border-[#86EFAC] text-xs font-black uppercase tracking-wider flex items-center gap-1.5">
                          <Database className="w-3.5 h-3.5 animate-pulse" />
                          <span>Mencari di Database Pilkades</span>
                        </span>
                        <span className="px-2.5 py-0.5 rounded-lg bg-white border border-[#86EFAC] text-[#15803D] text-[11px] font-black uppercase tracking-wider flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-ping" />
                          <span>5 TPS Online</span>
                        </span>
                      </div>

                      <div>
                        <h4 className="text-base sm:text-lg font-black text-slate-900 leading-snug">
                          GLAWU Sedang Mencari Data Anda...
                        </h4>
                        <p className="text-xs sm:text-sm text-slate-600 font-semibold mt-0.5">
                          Mencocokkan NIK <span className="font-black text-[#15803D] tracking-wider bg-white px-2 py-0.5 rounded-lg border border-[#86EFAC]">{nikInput}</span> dengan Daftar Pemilih Sementara (DPS)...
                        </p>
                      </div>

                      {/* Duolingo Candy-Striped Green Progress Bar */}
                      <div className="w-full bg-slate-200/90 rounded-full h-3.5 overflow-hidden border border-slate-300 relative shadow-inner">
                        <div className="h-full bg-[#58CC02] duo-stripes rounded-full w-full" />
                      </div>

                      {/* Bouncing Dots status */}
                      <div className="flex items-center justify-center sm:justify-start gap-2 text-xs font-bold text-slate-500">
                        <span>Mohon tunggu sebentar</span>
                        <span className="inline-flex gap-1 items-center">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#58CC02] inline-block animate-bounce [animation-delay:-0.3s]" />
                          <span className="w-1.5 h-1.5 rounded-full bg-[#58CC02] inline-block animate-bounce [animation-delay:-0.15s]" />
                          <span className="w-1.5 h-1.5 rounded-full bg-[#58CC02] inline-block animate-bounce" />
                        </span>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Security & Privacy Notice */}
        <div className="flex items-center justify-center gap-2 text-xs font-semibold text-slate-500">
          <ShieldCheck className="w-4 h-4 text-[#58CC02]" />
          <span>Keamanan Data Pribadi: NIK ter-masking otomatis demi perlindungan privasi warga.</span>
        </div>

        {/* Rekapitulasi Keseluruhan Data DPS Pemilih */}
        <DpsRecapSection
          recapData={recapData || DEFAULT_DPS_RECAP}
          tpsList={tpsList}
          namaDesa={config?.desa}
          namaKecamatan={config?.kecamatan}
          namaKabupaten={config?.kabupaten}
          isAdmin={isAdmin}
          onOpenEditRecap={onOpenEditRecap}
        />
      </div>
    </section>
  );
};
