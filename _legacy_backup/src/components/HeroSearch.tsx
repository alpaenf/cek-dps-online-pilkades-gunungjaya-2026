import React, { useState } from 'react';
import { Search, AlertCircle, Loader2, CheckCircle2, ShieldCheck, Edit3, Sparkles, X } from 'lucide-react';
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
  watermarkSrc,
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

    // Reset error pesan ketika user mengetik
    if (validationError) setValidationError(null);
    if (onClearError) onClearError();

    // Otomatis menghapus spasi
    const noSpaces = rawVal.replace(/\s+/g, '');

    // Cek jika mengandung huruf / karakter selain angka
    if (/[^\d]/.test(noSpaces)) {
      setValidationError('NIK hanya boleh berisi angka.');
      const digitsOnly = noSpaces.replace(/\D/g, '');
      setNikInput(digitsOnly.slice(0, 16));
      return;
    }

    // Maksimal 16 karakter
    const digitsOnly = noSpaces.slice(0, 16);
    setNikInput(digitsOnly);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const cleaned = nikInput.trim();

    // Validasi 1: Kosong
    if (!cleaned) {
      setValidationError('Masukkan 16 digit NIK sesuai KTP/KK.');
      return;
    }

    // Validasi 2: Hanya angka
    if (!/^\d+$/.test(cleaned)) {
      setValidationError('NIK hanya boleh berisi angka.');
      return;
    }

    // Validasi 3: Minimal 16 digit sebelum pencarian
    if (cleaned.length < 16) {
      setValidationError('NIK harus terdiri dari 16 digit.');
      return;
    }

    setValidationError(null);
    onSearch(cleaned);
  };

  return (
    <section id="hero-cek-dpt" className="relative py-8 sm:py-14 bg-gradient-to-b from-black/50 via-slate-950/65 to-black/80 backdrop-blur-xs border-b border-white/10 overflow-hidden text-slate-100">
      {/* Anchor for DPS */}
      <span id="hero-cek-dps" className="sr-only" />

      {/* Background Ambient Radial Light Ray */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-25"
        style={{
          background: 'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(245, 158, 11, 0.22) 0%, rgba(59, 130, 246, 0.15) 30%, transparent 70%)'
        }}
      />

      {/* Background Watermark Accent in Hero */}
      {watermarkSrc && (
        <div 
          className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden opacity-[0.08]"
          aria-hidden="true"
        >
          <img
            src={watermarkSrc}
            alt=""
            referrerPolicy="no-referrer"
            className="w-[360px] sm:w-[520px] md:w-[620px] object-contain mix-blend-screen filter contrast-125 select-none"
          />
        </div>
      )}

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Showcase Area: Maskot Besar di Kiri, Identitas & Keterangan Maskot di Kanan */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-10 items-center mb-8 sm:mb-10">
          {/* KOLOM KIRI: Maskot GLAWU Format PNG Transparan Ukuran Lebih Besar & Elegan */}
          <div className="md:col-span-5 lg:col-span-5 flex flex-col items-center justify-center relative">
            <div
              onClick={isAdmin && onOpenMascotModal ? onOpenMascotModal : undefined}
              className={`relative flex items-center justify-center ${
                isAdmin && onOpenMascotModal ? 'group cursor-pointer' : ''
              }`}
              title={isAdmin ? 'Klik untuk mengganti gambar Maskot (Khusus Admin)' : 'Maskot Resmi Pilkades Gunungjaya: GLAWU'}
            >
              {/* Subtle warm glow behind mascot for elegant presence */}
              <div className="absolute inset-0 bg-gradient-to-t from-amber-500/25 via-amber-400/15 to-transparent rounded-full blur-3xl scale-95 pointer-events-none" />

              {/* Maskot PNG Transparan (Latar Belakang Dihapus, Tanpa Kotak Background) */}
              <img
                src={mascotSrc || DEFAULT_MASCOT_GLAWU}
                alt="Maskot Resmi Pilkades: GLAWU"
                className={`w-52 sm:w-64 md:w-72 lg:w-80 max-h-[380px] object-contain filter drop-shadow-[0_20px_35px_rgba(0,0,0,0.9)] drop-shadow-[0_0_20px_rgba(245,158,11,0.25)] select-none transition-transform duration-300 ${
                  isAdmin && onOpenMascotModal ? 'group-hover:scale-105' : 'hover:scale-102'
                }`}
              />

              {isAdmin && onOpenMascotModal && (
                <div className="absolute bottom-2 right-4 bg-amber-500 hover:bg-amber-400 text-slate-950 px-2.5 py-1 rounded-full shadow-lg border border-white text-[10px] font-bold flex items-center gap-1 transition-all">
                  <Edit3 className="w-3 h-3" />
                  <span>Ganti Maskot</span>
                </div>
              )}
            </div>
          </div>

          {/* KOLOM KANAN: Keterangan Maskot & Identitas Pilkades Gunungjaya */}
          <div className="md:col-span-7 lg:col-span-7 space-y-4 text-center md:text-left">
            {/* Logo Pilkades PNG Transparan & Judul Lembaga */}
            <div className="flex flex-col md:flex-row items-center md:items-start gap-3.5">
              <div
                onClick={isAdmin ? onOpenLogoModal : undefined}
                className={`relative shrink-0 flex items-center justify-center ${
                  isAdmin ? 'group cursor-pointer' : ''
                }`}
                title={isAdmin ? 'Klik untuk mengganti logo Pilkades (Khusus Admin)' : 'Logo Resmi Pilkades'}
              >
                {/* Logo PNG Transparan Tanpa Kotak Border */}
                <img
                  src={currentLogo}
                  alt="Logo Pilkades Gunungjaya"
                  className={`w-14 h-14 sm:w-16 sm:h-16 object-contain filter drop-shadow-[0_6px_14px_rgba(0,0,0,0.85)] ${
                    isAdmin ? 'group-hover:scale-105 transition-transform' : ''
                  }`}
                />
                {isAdmin && (
                  <div className="absolute -bottom-1 -right-1 bg-amber-500 text-slate-950 rounded-full p-1 shadow-xs border border-white text-[8px] font-bold">
                    <Edit3 className="w-2.5 h-2.5" />
                  </div>
                )}
              </div>

              <div>
                <span className="text-[11px] uppercase tracking-widest font-extrabold text-amber-400 font-mono block">
                  PANITIA PEMILIHAN KEPALA DESA (P2KD)
                </span>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight font-serif drop-shadow-md">
                  PILKADES GUNUNGJAYA <span className="text-amber-400">2026</span>
                </h1>
                <p className="text-xs text-slate-400 font-medium">
                  Kecamatan Belik • Kabupaten Pemalang • Jawa Tengah
                </p>
              </div>
            </div>

            {/* Keterangan Maskot Resmi */}
            <div className="bg-gradient-to-r from-slate-900/95 via-slate-950/90 to-slate-900/90 p-5 sm:p-6 rounded-2xl border border-amber-500/30 shadow-xl space-y-3">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500 text-slate-950 text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shadow-xs">
                  <Sparkles className="w-3 h-3 text-slate-950" />
                  MASKOT RESMI: GLAWU
                </span>
                <span className="text-xs font-semibold text-amber-300 font-serif">
                  “Gunungjaya Guyub Rukun”
                </span>
              </div>

              <h2 className="text-base sm:text-lg font-bold text-white font-serif leading-snug">
                Tahapan Daftar Pemilih Sementara (DPS)
              </h2>

              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-normal">
                <span className="font-bold text-amber-300">“Sugeng rawuh sedulur warga Desa Gunungjaya!”</span> Saya <strong>GLAWU</strong>, maskot resmi Pilkades Gunungjaya 2026. Masukkan 16 digit NIK Anda pada kolom pencarian di bawah untuk memeriksa apakah hak suara Anda sudah terdaftar dalam <strong>Daftar Pemilih Sementara (DPS)</strong>!
              </p>

              <div className="pt-1 flex flex-wrap gap-2 justify-center md:justify-start text-[11px] font-mono text-slate-300">
                <span className="px-2.5 py-1 rounded-lg bg-slate-950/80 border border-slate-700/80 text-amber-300">
                  ✓ Cek Hak Pilih DPS Online
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-slate-950/80 border border-slate-700/80 text-emerald-300">
                  ✓ Perlindungan Privasi NIK
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-slate-950/80 border border-slate-700/80 text-sky-300">
                  ✓ Transparan & Akurat
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Dedicated Main Search Box (Glossy Black Obsidian Card) */}
        <div className="bg-gradient-to-b from-slate-900/95 via-slate-950/95 to-black/98 backdrop-blur-2xl rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-[0_30px_70px_rgba(0,0,0,0.95),inset_0_1px_1px_rgba(255,255,255,0.22)] border border-white/15 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-500 via-yellow-300 to-amber-600 shadow-[0_0_18px_rgba(245,158,11,0.6)]" />
          {/* Subtle glossy diagonal light reflection */}
          <div className="absolute -top-32 -left-32 w-72 h-72 bg-gradient-to-br from-white/10 to-transparent rounded-full blur-2xl pointer-events-none" />

          <div className="mb-5 text-center sm:text-left">
            <h3 className="text-base sm:text-lg font-bold text-white font-serif">
              SUDAH TERDAFTAR SEBAGAI PEMILIH?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300">
              Cek data Daftar Pemilih Sementara (DPS) Pilkades Desa Gunungjaya secara online.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="nik-input"
                className="block text-xs sm:text-sm font-bold text-slate-200 mb-2 flex items-center justify-between"
              >
                <span>Masukkan NIK 16 Digit</span>
                <span className="text-xs font-mono font-medium text-amber-400">
                  {nikInput.length}/16 Digit
                </span>
              </label>

              <div className="relative">
                <input
                  id="nik-input"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={nikInput}
                  onChange={handleInputChange}
                  placeholder="Masukkan 16 digit NIK"
                  disabled={isLoading}
                  maxLength={16}
                  className={`w-full pl-4 pr-20 sm:pl-5 sm:pr-24 py-3.5 sm:py-4 text-lg sm:text-xl font-mono tracking-wider font-semibold rounded-xl border-2 transition-all duration-200 focus:outline-none ${
                    validationError || errorMessage
                      ? 'border-red-500 bg-red-950/40 text-red-200 focus:ring-4 focus:ring-red-900/40'
                      : nikInput.length === 16
                      ? 'border-emerald-500 bg-emerald-950/40 text-white focus:ring-4 focus:ring-emerald-500/20'
                      : 'border-slate-700 bg-slate-950/90 text-white focus:border-amber-400 focus:bg-black focus:ring-4 focus:ring-amber-500/20 placeholder:text-slate-500'
                  }`}
                  aria-describedby="nik-helper"
                />

                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                  {nikInput.length > 0 && !isLoading && (
                    <button
                      type="button"
                      onClick={() => {
                        setNikInput('');
                        setValidationError(null);
                        if (onClearError) onClearError();
                      }}
                      className="p-1.5 text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 rounded-lg transition-colors cursor-pointer min-w-[32px] min-h-[32px] flex items-center justify-center"
                      title="Hapus NIK"
                      aria-label="Hapus NIK"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}

                  {nikInput.length === 16 && !validationError && (
                    <div className="text-emerald-400 p-1 flex items-center gap-1 text-xs font-semibold" title="16 Digit Lengkap">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                  )}
                </div>
              </div>

              {/* Error Alert Display */}
              {(validationError || errorMessage) && (
                <div className="mt-2.5 p-3.5 rounded-xl bg-red-950/70 border border-red-800 text-xs sm:text-sm text-red-200 animate-in fade-in space-y-2.5">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                    <span className="font-medium leading-relaxed">{validationError || errorMessage}</span>
                  </div>

                  {errorMessage && errorMessage.includes('Google Sheets') && isAdmin && (
                    <div className="pt-1.5 border-t border-red-800/80 flex flex-wrap items-center gap-2 text-xs">
                      {onOpenSheetGuide && (
                        <button
                          type="button"
                          onClick={onOpenSheetGuide}
                          className="px-3 py-1.5 bg-red-800 hover:bg-red-700 text-white rounded-lg font-bold transition-colors shadow-2xs"
                        >
                          🛠️ Buka Panduan Solusi & Tes URL
                        </button>
                      )}
                      {onSwitchToDemo && (
                        <button
                          type="button"
                          onClick={onSwitchToDemo}
                          className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 rounded-lg font-semibold transition-colors shadow-2xs"
                        >
                          🔄 Beralih ke Mode Demo (Simulasi)
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}

              <p id="nik-helper" className="text-xs text-slate-400 mt-2">
                Masukkan 16 digit NIK sesuai e-KTP / Kartu Keluarga untuk mengetahui status pendaftaran DPS Anda.
              </p>
            </div>

            {/* Action Button: Glowing Amber / Gold Glossy Style */}
            <div>
              <button
                type="submit"
                disabled={isLoading || nikInput.length === 0}
                className={`w-full py-3.5 sm:py-4 px-6 rounded-xl font-black text-sm sm:text-base shadow-xl flex items-center justify-center gap-2.5 transition-all duration-200 ${
                  isLoading
                    ? 'bg-amber-900/60 text-amber-200 cursor-not-allowed border border-amber-700/40'
                    : nikInput.length === 16
                    ? 'bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 shadow-[0_0_25px_rgba(245,158,11,0.4)] active:scale-[0.99] cursor-pointer'
                    : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 cursor-pointer'
                }`}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin text-slate-950" />
                    <span className="text-slate-950 font-bold">Sedang memeriksa DPS...</span>
                  </>
                ) : (
                  <>
                    <Search className="w-5 h-5 text-slate-950" />
                    <span>🔍 CEK DATA SAYA (DPS)</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Security & Privacy Assurance Notice */}
        <div className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-400">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Keamanan Data Pribadi: NIK ter-masking otomatis demi perlindungan privasi warga.</span>
        </div>

        {/* Rekapitulasi Keseluruhan Data DPS Pemilih (Laki-laki, Perempuan, & Per TPS 1 - 5) */}
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
