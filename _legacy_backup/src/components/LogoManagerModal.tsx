import React, { useState, useRef } from 'react';
import { X, Upload, Check, Image as ImageIcon, Link as LinkIcon, RotateCcw, Sparkles, CheckCircle2, AlertCircle, Layers, Eye, Award } from 'lucide-react';
import { LOGO_PRESETS, DEFAULT_VILLAGE_LOGO, DEFAULT_WATERMARK, DEFAULT_MASCOT_GLAWU, DEFAULT_MASCOT_GLAWU_GUIDE, DEFAULT_BLACK_BANNER, DEFAULT_GLOSSY_BG, LogoPreset } from '../data/logoPresets';

interface LogoManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLogo: string;
  onSelectLogo: (logoUrl: string) => void;
  watermarkSrc?: string;
  watermarkOpacity?: number;
  onUpdateWatermark?: (src: string, opacity: number) => void;
}

export const LogoManagerModal: React.FC<LogoManagerModalProps> = ({
  isOpen,
  onClose,
  currentLogo,
  onSelectLogo,
  watermarkSrc = DEFAULT_WATERMARK,
  watermarkOpacity = 0.045,
  onUpdateWatermark
}) => {
  const [activeTab, setActiveTab] = useState<'presets' | 'upload' | 'url' | 'watermark' | 'mascot'>('presets');
  const [customUrlInput, setCustomUrlInput] = useState('');
  const [previewError, setPreviewError] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);
  const [currentWatermark, setCurrentWatermark] = useState<string>(watermarkSrc);
  const [currentOpacity, setCurrentOpacity] = useState<number>(watermarkOpacity);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const watermarkInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const showSuccess = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => {
      setSuccessToast(null);
      onClose();
    }, 1200);
  };

  // Handler memilih preset
  const handleSelectPreset = (preset: LogoPreset) => {
    onSelectLogo(preset.src);
    showSuccess(`Logo berhasil diubah ke: ${preset.name}`);
  };

  // Handler upload file dari HP/Laptop
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPreviewError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    // Validasi tipe file gambar
    if (!file.type.startsWith('image/')) {
      setPreviewError('Format file tidak didukung. Harap pilih gambar (PNG, JPG, JPEG, SVG, WebP).');
      return;
    }

    // Maksimal 4MB
    if (file.size > 4 * 1024 * 1024) {
      setPreviewError('Ukuran file terlalu besar (maksimal 4 MB).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        onSelectLogo(result);
        showSuccess('Logo kustom berhasil diunggah dan disimpan!');
      }
    };
    reader.onerror = () => {
      setPreviewError('Gagal membaca file gambar. Silakan coba file lain.');
    };
    reader.readAsDataURL(file);
  };

  // Handler URL eksternal
  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPreviewError(null);
    const trimmed = customUrlInput.trim();
    if (!trimmed) {
      setPreviewError('Masukkan URL gambar yang valid.');
      return;
    }

    if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://') && !trimmed.startsWith('data:image/')) {
      setPreviewError('URL harus diawali dengan http:// atau https://');
      return;
    }

    onSelectLogo(trimmed);
    showSuccess('Logo dari URL eksternal berhasil diterapkan!');
  };

  // Handler Reset ke Default
  const handleResetDefault = () => {
    onSelectLogo(DEFAULT_VILLAGE_LOGO);
    showSuccess('Logo berhasil dikembalikan ke default resmi!');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[92vh] overflow-hidden shadow-2xl border border-slate-200 flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-900 flex items-center justify-center shrink-0">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 font-serif">
                Kelola & Ganti Logo Pilkades Gunungjaya
              </h3>
              <p className="text-xs text-slate-500">
                Pilih desain resmi yang tersedia atau unggah logo khas desa Anda sendiri
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Active Logo Bar */}
        <div className="px-6 py-3.5 bg-blue-50/60 border-b border-blue-100 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white border border-blue-200 p-1 shadow-2xs shrink-0 flex items-center justify-center overflow-hidden">
              <img
                src={currentLogo}
                alt="Logo Aktif Saat Ini"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-800 block">
                LOGO AKTIF SAAT INI
              </span>
              <p className="text-xs font-semibold text-slate-800">
                Tampil di Header, Formulir Pencarian, dan Footer portal.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleResetDefault}
            className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shrink-0 shadow-2xs"
            title="Kembalikan ke logo default"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset Default</span>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-100/70 px-4 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('presets')}
            className={`py-3 px-3.5 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'presets'
                ? 'border-blue-900 text-blue-950 font-bold bg-white rounded-t-lg'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>1. Pilihan Desain Logo Resmi</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('upload')}
            className={`py-3 px-3.5 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'upload'
                ? 'border-blue-900 text-blue-950 font-bold bg-white rounded-t-lg'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Upload className="w-3.5 h-3.5 text-blue-800" />
            <span>2. Upload File Sendiri</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('url')}
            className={`py-3 px-3.5 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'url'
                ? 'border-blue-900 text-blue-950 font-bold bg-white rounded-t-lg'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <LinkIcon className="w-3.5 h-3.5 text-slate-600" />
            <span>3. Tautan URL Gambar</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('watermark')}
            className={`py-3 px-3.5 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'watermark'
                ? 'border-blue-900 text-blue-950 font-bold bg-white rounded-t-lg'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-blue-800" />
            <span className="font-bold">4. Watermark Background</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('mascot')}
            className={`py-3 px-3.5 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'mascot'
                ? 'border-blue-900 text-blue-950 font-bold bg-white rounded-t-lg'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <span className="text-sm">🦅</span>
            <span className="font-bold">5. Maskot Glawu</span>
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto flex-1 text-xs sm:text-sm text-slate-700">
          {/* Toast Notifikasi */}
          {successToast && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-semibold flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>{successToast}</span>
            </div>
          )}

          {previewError && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 font-medium flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
              <span>{previewError}</span>
            </div>
          )}

          {/* TAB 1: PRESETS */}
          {activeTab === 'presets' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-500">
                Pilih salah satu logo resmi Pilkades Desa Gunungjaya di bawah ini:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                {LOGO_PRESETS.map((preset) => {
                  const isSelected = currentLogo === preset.src;
                  return (
                    <div
                      key={preset.id}
                      onClick={() => handleSelectPreset(preset)}
                      className={`cursor-pointer rounded-xl border-2 p-3.5 transition-all duration-150 flex flex-col justify-between group ${
                        isSelected
                          ? 'border-blue-900 bg-blue-50/50 shadow-md ring-2 ring-blue-900/20'
                          : 'border-slate-200 bg-white hover:border-blue-400 hover:shadow-xs'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                            {preset.badge}
                          </span>
                          {isSelected && (
                            <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                              <Check className="w-3 h-3" /> Dipakai
                            </span>
                          )}
                        </div>

                        <div className="aspect-square w-full rounded-lg bg-slate-50 border border-slate-200/80 p-2 flex items-center justify-center overflow-hidden mb-3 group-hover:scale-102 transition-transform">
                          <img
                            src={preset.src}
                            alt={preset.name}
                            className="w-full h-full object-contain"
                          />
                        </div>

                        <h4 className="font-bold text-slate-900 text-xs leading-snug">
                          {preset.name}
                        </h4>
                        <p className="text-[11px] text-slate-500 mt-1 leading-normal">
                          {preset.description}
                        </p>
                      </div>

                      <button
                        type="button"
                        className={`w-full mt-3 py-1.5 px-3 rounded-lg text-xs font-bold transition-colors ${
                          isSelected
                            ? 'bg-blue-900 text-white'
                            : 'bg-slate-100 hover:bg-blue-50 hover:text-blue-900 text-slate-700'
                        }`}
                      >
                        {isSelected ? '✓ Logo Terpilih' : 'Gunakan Logo Ini'}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: UPLOAD FILE */}
          {activeTab === 'upload' && (
            <div className="space-y-4">
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-300 hover:border-blue-700 hover:bg-blue-50/30 rounded-2xl p-8 text-center cursor-pointer transition-all duration-200"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/jpg,image/svg+xml,image/webp"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <div className="w-14 h-14 mx-auto rounded-2xl bg-blue-100 text-blue-900 flex items-center justify-center mb-3">
                  <Upload className="w-7 h-7" />
                </div>
                <h4 className="text-sm font-bold text-slate-900 mb-1">
                  Klik untuk Memilih File Logo dari Perangkat Anda
                </h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Mendukung format PNG, JPG, JPEG, SVG, atau WebP (Maksimal 4 MB). Logo akan otomatis tersimpan di peramban.
                </p>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-1">
                <span className="font-bold text-slate-800 block">Tips Logo Berkualitas:</span>
                <p>• Gunakan logo berlatar belakang transparan (PNG) atau berlatar putih bersih.</p>
                <p>• Rasio aspek persegi (1:1) memberikan hasil tampilan paling rapi di header & kartu TPS.</p>
              </div>
            </div>
          )}

          {/* TAB 3: URL EKSTERNAL */}
          {activeTab === 'url' && (
            <form onSubmit={handleUrlSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Tautan / URL Gambar Logo Langsung
                </label>
                <input
                  type="url"
                  value={customUrlInput}
                  onChange={(e) => setCustomUrlInput(e.target.value)}
                  placeholder="https://contoh.com/logo-desa-gunungjaya.png"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:bg-white"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  Pastikan tautan dapat diakses secara publik dan langsung mengarah ke file gambar.
                </p>
              </div>

              <button
                type="submit"
                className="px-5 py-2.5 bg-blue-900 hover:bg-blue-950 text-white rounded-xl text-xs font-bold transition-colors"
              >
                Terapkan Logo dari URL
              </button>
            </form>
          )}

          {/* TAB 4: WATERMARK BACKGROUND WEBSITE */}
          {activeTab === 'watermark' && (
            <div className="space-y-5">
              <div>
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-blue-900" />
                  <span>Pengaturan Watermark Latar Belakang Website</span>
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Jadikan lambang / logo resmi sebagai cap watermark transparan di latar belakang seluruh halaman website.
                </p>
              </div>

              {/* Live Preview Box */}
              <div className="p-4 rounded-2xl bg-slate-100 border border-slate-300 relative overflow-hidden">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-2">
                  Simulasi Tampilan Watermark di Website:
                </span>
                
                <div className="relative h-44 rounded-xl bg-white border border-slate-200 p-4 flex flex-col justify-between overflow-hidden shadow-inner">
                  {/* The Simulated Watermark */}
                  {currentOpacity > 0 && (
                    <div 
                      className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden"
                      aria-hidden="true"
                    >
                      <img
                        src={currentWatermark}
                        alt="Watermark Preview"
                        className="w-48 h-48 object-contain mix-blend-multiply filter contrast-125"
                        style={{ opacity: currentOpacity * 2.2 }} // visually amplified slightly in small preview box for clarity
                      />
                    </div>
                  )}

                  <div className="relative z-10 flex items-center justify-between border-b border-slate-100 pb-2">
                    <span className="text-xs font-bold text-blue-900">PILKADES GUNUNGJAYA 2026</span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                      Hasil Simulasi NIK
                    </span>
                  </div>

                  <div className="relative z-10 space-y-1 my-auto">
                    <div className="w-3/4 h-3 bg-slate-200/90 rounded" />
                    <div className="w-1/2 h-2.5 bg-slate-200/80 rounded" />
                    <div className="w-2/3 h-2.5 bg-slate-200/70 rounded" />
                  </div>

                  <div className="relative z-10 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-100 pt-2">
                    <span>Intensitas: {Math.round(currentOpacity * 1000) / 10}%</span>
                    <span className="font-semibold text-slate-600">
                      {currentOpacity === 0 ? 'Watermark Dinonaktifkan' : 'Watermark Aktif'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Watermark Source Selection */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-800">
                  1. Pilih Gambar Sumber Watermark
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {/* Preset 1: Official Emblem */}
                  <button
                    type="button"
                    onClick={() => {
                      setCurrentWatermark(DEFAULT_WATERMARK);
                      if (onUpdateWatermark) onUpdateWatermark(DEFAULT_WATERMARK, currentOpacity);
                      showSuccess('Watermark dialihkan ke Emblem Segel Resmi');
                    }}
                    className={`p-3 rounded-xl border text-left flex items-center gap-3 transition-colors ${
                      currentWatermark === DEFAULT_WATERMARK
                        ? 'border-blue-900 bg-blue-50/70 text-blue-950 font-bold ring-1 ring-blue-900'
                        : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <img
                      src={DEFAULT_WATERMARK}
                      alt="Emblem Resmi"
                      className="w-9 h-9 object-contain rounded-lg border border-slate-200 bg-white p-0.5 shrink-0"
                    />
                    <div>
                      <span className="text-xs block font-bold">Emblem Resmi</span>
                      <span className="text-[10px] text-slate-500">Watermark standar desa</span>
                    </div>
                  </button>

                  {/* Preset 2: Current Logo */}
                  <button
                    type="button"
                    onClick={() => {
                      setCurrentWatermark(DEFAULT_BLACK_BANNER);
                      if (onUpdateWatermark) onUpdateWatermark(DEFAULT_BLACK_BANNER, currentOpacity);
                      showSuccess('Watermark disetel ke Banner Hitam Resmi!');
                    }}
                    className={`p-3 rounded-xl border text-left flex items-center gap-3 transition-colors ${
                      currentWatermark === DEFAULT_BLACK_BANNER
                        ? 'border-blue-900 bg-blue-50/70 text-blue-950 font-bold ring-1 ring-blue-900'
                        : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <img
                      src={DEFAULT_BLACK_BANNER}
                      alt="Banner Hitam"
                      className="w-9 h-9 object-cover rounded-lg border border-slate-200 bg-black p-0.5 shrink-0"
                    />
                    <div>
                      <span className="text-xs block font-bold">Banner Hitam Resmi</span>
                      <span className="text-[10px] text-slate-500">Golput Bukan Solusi</span>
                    </div>
                  </button>

                  {/* Preset 3: Glossy Black Wallpaper */}
                  <button
                    type="button"
                    onClick={() => {
                      setCurrentWatermark(DEFAULT_GLOSSY_BG);
                      if (onUpdateWatermark) onUpdateWatermark(DEFAULT_GLOSSY_BG, currentOpacity);
                      showSuccess('Background disetel ke Gradasi Hitam Mengkilap!');
                    }}
                    className={`p-3 rounded-xl border text-left flex items-center gap-3 transition-colors ${
                      currentWatermark === DEFAULT_GLOSSY_BG
                        ? 'border-amber-600 bg-amber-50/70 text-amber-950 font-bold ring-1 ring-amber-600'
                        : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <img
                      src={DEFAULT_GLOSSY_BG}
                      alt="Gradasi Hitam Mengkilap"
                      className="w-9 h-9 object-cover rounded-lg border border-slate-200 bg-black p-0.5 shrink-0"
                    />
                    <div>
                      <span className="text-xs block font-bold">Gradasi Hitam Mengkilap</span>
                      <span className="text-[10px] text-slate-500">Tema Obsidian Mengkilap</span>
                    </div>
                  </button>

                  {/* Preset 3: Upload Custom */}
                  <div>
                    <input
                      ref={watermarkInputRef}
                      type="file"
                      accept="image/png,image/jpeg,image/jpg,image/svg+xml,image/webp"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        if (!file.type.startsWith('image/')) {
                          setPreviewError('Harap pilih file gambar.');
                          return;
                        }
                        const reader = new FileReader();
                        reader.onload = (ev) => {
                          const res = ev.target?.result as string;
                          if (res) {
                            setCurrentWatermark(res);
                            if (onUpdateWatermark) onUpdateWatermark(res, currentOpacity);
                            showSuccess('Gambar watermark kustom berhasil diterapkan!');
                          }
                        };
                        reader.readAsDataURL(file);
                      }}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => watermarkInputRef.current?.click()}
                      className="w-full h-full p-3 rounded-xl border border-dashed border-slate-300 hover:border-blue-900 hover:bg-blue-50/40 text-left flex items-center gap-3 transition-colors"
                    >
                      <div className="w-9 h-9 rounded-lg bg-blue-100 text-blue-900 flex items-center justify-center shrink-0">
                        <Upload className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-xs block font-bold text-slate-800">Upload Kustom</span>
                        <span className="text-[10px] text-slate-500">Pilih dari HP/laptop</span>
                      </div>
                    </button>
                  </div>
                </div>
              </div>

              {/* Watermark Opacity Slider / Presets */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-800">
                  2. Ketebalan / Transparansi Watermark
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { label: 'Sangat Halus (2.5%)', val: 0.025 },
                    { label: 'Standar (4.5%)', val: 0.045 },
                    { label: 'Jelas (7.5%)', val: 0.075 },
                    { label: 'Matikan (0%)', val: 0.0 }
                  ].map((preset) => {
                    const isSelected = Math.abs(currentOpacity - preset.val) < 0.005;
                    return (
                      <button
                        key={preset.label}
                        type="button"
                        onClick={() => {
                          setCurrentOpacity(preset.val);
                          if (onUpdateWatermark) onUpdateWatermark(currentWatermark, preset.val);
                          showSuccess(`Tingkat watermark diubah: ${preset.label}`);
                        }}
                        className={`p-2.5 rounded-xl border text-center text-xs font-semibold transition-all ${
                          isSelected
                            ? 'border-blue-900 bg-blue-900 text-white shadow-xs'
                            : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        {preset.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-xs flex items-start gap-2">
                <span className="font-bold shrink-0">💡 Info:</span>
                <span>
                  Watermark background dirancang tidak menghalangi tombol, formulir, atau teks apa pun, dan otomatis tampil saat dicetak.
                </span>
              </div>
            </div>
          )}

          {/* TAB 5: MASKOT PILKADES GLAWU */}
          {activeTab === 'mascot' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="p-4 bg-sky-50 border border-sky-200 rounded-2xl flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-sky-600 text-white flex items-center justify-center shrink-0 text-xl font-bold">
                  🦅
                </div>
                <div>
                  <h4 className="font-bold text-sky-950 text-sm">
                    Maskot Resmi Pilkades Gunungjaya: GLAWU
                  </h4>
                  <p className="text-xs text-sky-800 mt-0.5 leading-relaxed">
                    Karakter burung biru lereng Gunung Slamet berbusana tradisional Blangkon dan Lurik Surjan Jawa Tengah. Menjadi simbol persaudaraan, kearifan lokal, dan penegak demokrasi jujur adil di Desa Gunungjaya 2026.
                  </p>
                </div>
              </div>

              {/* Tampilan Pose Maskot */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-white border border-slate-200 text-center space-y-2 shadow-2xs">
                  <div className="h-44 bg-gradient-to-b from-sky-50 to-white rounded-xl p-2 flex items-center justify-center overflow-hidden border border-sky-100">
                    <img
                      src={DEFAULT_MASCOT_GLAWU}
                      alt="GLAWU Menyapa"
                      className="max-h-full object-contain drop-shadow-md"
                    />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 text-xs block">Pose Utama: Menyapa & Mengajak</span>
                    <span className="text-[11px] text-slate-500">Ditampilkan pada Hero Cek DPS (Daftar Pemilih Sementara)</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-slate-200 text-center space-y-2 shadow-2xs">
                  <div className="h-44 bg-gradient-to-b from-sky-50 to-white rounded-xl p-2 flex items-center justify-center overflow-hidden border border-sky-100">
                    <img
                      src={DEFAULT_MASCOT_GLAWU_GUIDE}
                      alt="GLAWU Panduan"
                      className="max-h-full object-contain drop-shadow-md"
                    />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 text-xs block">Pose Panduan: Kaca Pembesar & DPS</span>
                    <span className="text-[11px] text-slate-500">Ditampilkan pada Hasil Verifikasi DPS</span>
                  </div>
                </div>
              </div>

              {/* Referensi Penempatan di Website */}
              <div className="space-y-2.5">
                <h5 className="font-bold text-slate-800 text-xs uppercase tracking-wider">
                  Referensi Penempatan Aktif di Halaman Website:
                </h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <strong className="text-blue-900 block">1. Hero Section (Atas Formulir NIK)</strong>
                    <span className="text-slate-600 text-[11px]">Sapaan ramah dan ajakan memeriksa DPS langsung di samping maskot utama.</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <strong className="text-emerald-900 block">2. Hasil Cek DPS (Valid & Tidak Ditemukan)</strong>
                    <span className="text-slate-600 text-[11px]">Memberikan apresiasi saat terdaftar dan panduan solutif saat belum terdaftar.</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <strong className="text-indigo-900 block">3. Bagian Khusus Profil Maskot</strong>
                    <span className="text-slate-600 text-[11px]">Menjelaskan filosofi, adat Jawa (blangkon/lurik), dan 4 ajakan penting Glawu.</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <strong className="text-amber-900 block">4. Sahabat Pemilih Mengambang (Floating)</strong>
                    <span className="text-slate-600 text-[11px]">Widget interaktif di pojok kanan bawah dengan navigasi cepat bagi warga.</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <span className="text-[11px] text-slate-500">
            Perubahan logo langsung terlihat di seluruh tampilan aplikasi.
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
