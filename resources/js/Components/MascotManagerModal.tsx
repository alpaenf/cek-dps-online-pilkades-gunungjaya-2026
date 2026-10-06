import React, { useState, useRef } from 'react';
import { X, Upload, Check, Link as LinkIcon, RotateCcw, Sparkles, CheckCircle2, AlertCircle, Image as ImageIcon } from 'lucide-react';
import { DEFAULT_MASCOT_GLAWU, DEFAULT_MASCOT_GLAWU_GUIDE } from '../data/logoPresets';

interface MascotManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentMascot: string;
  onUpdateMascot: (mascotUrl: string) => void;
  onResetMascot: () => void;
}

export const MascotManagerModal: React.FC<MascotManagerModalProps> = ({
  isOpen,
  onClose,
  currentMascot,
  onUpdateMascot,
  onResetMascot
}) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'url' | 'presets'>('upload');
  const [previewSrc, setPreviewSrc] = useState<string>(currentMascot);
  const [urlInput, setUrlInput] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const showSuccess = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => {
      setSuccessToast(null);
      onClose();
    }, 1200);
  };

  // Upload handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMessage(null);
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMessage('Format file tidak didukung. Harap pilih gambar (PNG, JPG, JPEG, SVG, WebP).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage('Ukuran file maksimal 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        setPreviewSrc(result);
      }
    };
    reader.onerror = () => {
      setErrorMessage('Gagal membaca file gambar.');
    };
    reader.readAsDataURL(file);
  };

  // URL apply handler
  const handleApplyUrl = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    const cleanUrl = urlInput.trim();
    if (!cleanUrl) {
      setErrorMessage('Harap masukkan URL gambar yang valid.');
      return;
    }

    if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://') && !cleanUrl.startsWith('data:image/')) {
      setErrorMessage('URL harus diawali dengan http:// atau https://');
      return;
    }

    setPreviewSrc(cleanUrl);
  };

  // Save changes
  const handleSave = () => {
    if (!previewSrc) {
      setErrorMessage('Tidak ada gambar maskot yang dipilih.');
      return;
    }
    onUpdateMascot(previewSrc);
    showSuccess('Gambar Maskot Pilkades berhasil diperbarui!');
  };

  // Reset to default
  const handleResetToDefault = () => {
    onResetMascot();
    setPreviewSrc(DEFAULT_MASCOT_GLAWU);
    showSuccess('Maskot dikembalikan ke Maskot Asli GLAWU.');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-amber-500/40 rounded-3xl shadow-[0_25px_60px_rgba(0,0,0,0.95)] overflow-hidden text-slate-100 flex flex-col max-h-[92vh]">
        {/* Toast Notifikasi */}
        {successToast && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-emerald-600 text-white px-5 py-2.5 rounded-full text-xs font-bold shadow-lg flex items-center gap-2 animate-bounce">
            <CheckCircle2 className="w-4 h-4" />
            <span>{successToast}</span>
          </div>
        )}

        {/* Modal Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-b border-amber-500/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-300 flex items-center justify-center text-xl font-bold shadow-inner">
              🦅
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-white font-serif">
                  Pengaturan Gambar Maskot Pilkades
                </h3>
                <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold px-2 py-0.5 rounded-full font-mono">
                  Admin
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Ganti atau sesuaikan karakter maskot resmi yang tampil di seluruh portal
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition cursor-pointer"
            aria-label="Tutup"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Preview Area */}
          <div className="bg-slate-950/80 rounded-2xl p-4 sm:p-5 border border-slate-800 flex flex-col sm:flex-row items-center gap-5">
            <div className="relative w-36 h-36 sm:w-40 sm:h-40 rounded-2xl bg-gradient-to-b from-slate-900 to-black p-3 border-2 border-amber-500/40 flex items-center justify-center shrink-0 shadow-xl overflow-hidden group">
              <img
                src={previewSrc}
                alt="Preview Maskot"
                className="max-h-full max-w-full object-contain filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)] transition-transform duration-300 group-hover:scale-105"
                onError={() => {
                  setErrorMessage('Gagal memuat preview gambar. Pastikan URL atau file valid.');
                }}
              />
              <span className="absolute bottom-2 right-2 bg-amber-500 text-slate-950 text-[9px] font-bold px-1.5 py-0.5 rounded-md">
                Pratinjau
              </span>
            </div>

            <div className="flex-1 space-y-2 text-center sm:text-left">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-950/60 border border-amber-500/30 rounded-full text-[11px] text-amber-300 font-mono">
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>Maskot Aktif Saat Ini</span>
              </div>
              <h4 className="text-sm sm:text-base font-bold text-white font-serif">
                Karakter Maskot Pilkades Gunungjaya
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Gambar maskot ini akan menggantikan visual maskot pada kotak pencarian DPS (Daftar Pemilih Sementara) dan kartu hasil verifikasi resmi.
              </p>
              <div className="pt-1 flex flex-wrap gap-2 justify-center sm:justify-start">
                <button
                  type="button"
                  onClick={handleResetToDefault}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
                  title="Kembalikan ke Maskot Resmi Glawu Asli"
                >
                  <RotateCcw className="w-3 h-3 text-slate-400" />
                  <span>Reset ke Maskot Asli (GLAWU)</span>
                </button>
              </div>
            </div>
          </div>

          {/* Tab Selector */}
          <div className="flex p-1 bg-slate-950 border border-slate-800 rounded-2xl gap-1">
            <button
              type="button"
              onClick={() => {
                setActiveTab('upload');
                setErrorMessage(null);
              }}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                activeTab === 'upload'
                  ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                  : 'text-slate-400 hover:text-white hover:bg-slate-850'
              }`}
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Unggah Gambar (File)</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('url');
                setErrorMessage(null);
              }}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                activeTab === 'url'
                  ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                  : 'text-slate-400 hover:text-white hover:bg-slate-850'
              }`}
            >
              <LinkIcon className="w-3.5 h-3.5" />
              <span>Tautan / Link URL</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('presets');
                setErrorMessage(null);
              }}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                activeTab === 'presets'
                  ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                  : 'text-slate-400 hover:text-white hover:bg-slate-850'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>Pilihan Preset Resmi</span>
            </button>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="p-3 bg-red-950/70 border border-red-500/40 rounded-xl text-red-200 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Tab 1: Upload File */}
          {activeTab === 'upload' && (
            <div className="space-y-4">
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-amber-500/40 hover:border-amber-400/80 bg-slate-950/60 hover:bg-slate-950 rounded-2xl p-6 text-center cursor-pointer transition flex flex-col items-center justify-center space-y-2 group"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/jpg,image/webp,image/svg+xml"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 group-hover:bg-amber-500/20 text-amber-400 flex items-center justify-center transition border border-amber-500/30">
                  <Upload className="w-6 h-6" />
                </div>
                <div className="space-y-0.5">
                  <p className="text-xs sm:text-sm font-bold text-white">
                    Klik untuk memilih gambar maskot baru dari perangkat Anda
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Mendukung format PNG transparan, JPG, WebP, SVG (Maks. 5MB)
                  </p>
                </div>
              </div>
              <p className="text-[11px] text-slate-400 italic">
                * Tips: Untuk hasil paling rapi, gunakan gambar maskot dengan latar belakang transparan (PNG).
              </p>
            </div>
          )}

          {/* Tab 2: URL */}
          {activeTab === 'url' && (
            <form onSubmit={handleApplyUrl} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 block">
                  Alamat URL Gambar Maskot:
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    placeholder="https://contoh-desa.id/images/maskot-baru.png"
                    className="flex-1 px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs whitespace-nowrap transition cursor-pointer"
                  >
                    Tinjau URL
                  </button>
                </div>
              </div>
              <p className="text-[11px] text-slate-400">
                Masukkan tautan langsung ke gambar (Direct Image URL) yang dapat diakses publik.
              </p>
            </form>
          )}

          {/* Tab 3: Presets */}
          {activeTab === 'presets' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-300">
                Pilih dari pose maskot resmi Pilkades Gunungjaya yang telah disediakan:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Preset 1: GLAWU Menyapa */}
                <div
                  onClick={() => {
                    setPreviewSrc(DEFAULT_MASCOT_GLAWU);
                    setErrorMessage(null);
                  }}
                  className={`p-4 rounded-2xl border cursor-pointer transition flex flex-col items-center gap-3 ${
                    previewSrc === DEFAULT_MASCOT_GLAWU
                      ? 'bg-amber-950/40 border-amber-400 ring-2 ring-amber-400/30'
                      : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="h-32 w-full flex items-center justify-center p-2 bg-slate-900/90 rounded-xl overflow-hidden border border-slate-800">
                    <img
                      src={DEFAULT_MASCOT_GLAWU}
                      alt="GLAWU Menyapa"
                      className="max-h-full object-contain"
                    />
                  </div>
                  <div className="text-center">
                    <span className="text-xs font-bold text-white block">Pose Utama: Menyapa & Mengajak</span>
                    <span className="text-[10px] text-amber-300 font-mono">GLAWU Maskot Resmi Default</span>
                  </div>
                </div>

                {/* Preset 2: GLAWU Panduan */}
                <div
                  onClick={() => {
                    setPreviewSrc(DEFAULT_MASCOT_GLAWU_GUIDE);
                    setErrorMessage(null);
                  }}
                  className={`p-4 rounded-2xl border cursor-pointer transition flex flex-col items-center gap-3 ${
                    previewSrc === DEFAULT_MASCOT_GLAWU_GUIDE
                      ? 'bg-amber-950/40 border-amber-400 ring-2 ring-amber-400/30'
                      : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="h-32 w-full flex items-center justify-center p-2 bg-slate-900/90 rounded-xl overflow-hidden border border-slate-800">
                    <img
                      src={DEFAULT_MASCOT_GLAWU_GUIDE}
                      alt="GLAWU Panduan"
                      className="max-h-full object-contain"
                    />
                  </div>
                  <div className="text-center">
                    <span className="text-xs font-bold text-white block">Pose Panduan: Kaca Pembesar</span>
                    <span className="text-[10px] text-sky-300 font-mono">Pose Edukasi Pemilih Cerdas</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition cursor-pointer"
          >
            Batal
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black rounded-xl text-xs flex items-center gap-2 shadow-lg transition cursor-pointer"
          >
            <Check className="w-4 h-4" />
            <span>Simpan & Terapkan Maskot</span>
          </button>
        </div>
      </div>
    </div>
  );
};
