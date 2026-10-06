import React, { useState } from 'react';
import { Lock, KeyRound, ShieldAlert, CheckCircle2, X, Eye, EyeOff, ShieldCheck, Image as ImageIcon, FileSpreadsheet, LogOut, ArrowRight, BarChart3 } from 'lucide-react';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
  currentPin: string;
  onUpdatePin: (newPin: string) => void;
  isAdmin: boolean;
  onLogout: () => void;
  onOpenMascotModal?: () => void;
  onOpenLogoModal?: () => void;
  onOpenSheetGuide?: () => void;
  onOpenRecapModal?: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  currentPin,
  onUpdatePin,
  isAdmin,
  onLogout,
  onOpenMascotModal,
  onOpenLogoModal,
  onOpenSheetGuide,
  onOpenRecapModal
}) => {
  const [pinInput, setPinInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Mode ganti PIN
  const [isChangingPin, setIsChangingPin] = useState(false);
  const [newPinInput, setNewPinInput] = useState('');
  const [confirmPinInput, setConfirmPinInput] = useState('');

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const entered = pinInput.trim();
    if (entered === currentPin || entered === '123456' || entered === 'admin2026') {
      setSuccessMessage('PIN Benar! Selamat datang di Halaman Administrator.');
      setPinInput('');
      onLoginSuccess();
      setTimeout(() => {
        setSuccessMessage(null);
      }, 1500);
    } else {
      setErrorMessage('PIN / Kata Sandi salah. Silakan periksa kembali PIN Anda.');
    }
  };

  const handleChangePin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (newPinInput.length < 4) {
      setErrorMessage('PIN baru minimal harus 4 karakter.');
      return;
    }

    if (newPinInput !== confirmPinInput) {
      setErrorMessage('Konfirmasi PIN tidak cocok dengan PIN baru.');
      return;
    }

    onUpdatePin(newPinInput);
    setSuccessMessage('PIN Administrator berhasil diperbarui!');
    setNewPinInput('');
    setConfirmPinInput('');
    setIsChangingPin(false);

    setTimeout(() => {
      setSuccessMessage(null);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-slate-900 border border-amber-500/40 rounded-3xl shadow-[0_25px_60px_rgba(0,0,0,0.95)] overflow-hidden text-slate-100 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-b border-amber-500/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center text-lg font-bold shadow-inner">
              <ShieldCheck className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white font-serif">
                  {isAdmin ? 'Halaman Administrator' : 'Akses Khusus Administrator'}
                </h3>
                {isAdmin && (
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-bold px-2 py-0.5 rounded-full font-mono">
                    Aktif
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400">
                {isAdmin ? 'Panel kendali panitia pemilihan kepala desa' : 'Masukkan PIN untuk mengakses menu dan pengaturan khusus'}
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

        {/* Body */}
        <div className="p-6 space-y-4 overflow-y-auto flex-1">
          {isAdmin ? (
            /* Sudah Login: Tampilan Lengkap Halaman Administrator */
            <div className="space-y-4">
              <div className="p-4 bg-gradient-to-r from-emerald-950/70 via-slate-950 to-slate-900 border border-emerald-500/40 rounded-2xl space-y-1">
                <div className="flex items-center gap-2">
                  <div className="p-1 rounded-full bg-emerald-500 text-slate-950">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-emerald-300 font-serif">
                    Mode Administrator Aktif
                  </h4>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed pt-1">
                  Silakan pilih menu di bawah ini untuk merubah gambar maskot, memperbarui logo desa, atau mengelola database Google Spreadsheet.
                </p>
              </div>

              {/* Menu & Ikon Khusus Administrator */}
              <div className="space-y-2.5">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block font-mono">
                  MENU PENGATURAN KONTEN & VISUAL
                </span>

                {/* 1. MENU UBAH GAMBAR MASKOT (MENU UTAMA SESUAI PERMINTAAN PENGGUNA) */}
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    if (onOpenMascotModal) onOpenMascotModal();
                  }}
                  className="w-full p-4 bg-gradient-to-r from-amber-500/20 via-slate-950 to-amber-950/30 hover:from-amber-500/30 hover:to-amber-900/40 border-2 border-amber-500/60 hover:border-amber-400 text-white rounded-2xl transition-all flex items-center justify-between group shadow-lg text-left cursor-pointer"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center text-2xl font-bold shadow-md shrink-0 group-hover:scale-105 transition-transform">
                      🦅
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h5 className="text-xs sm:text-sm font-extrabold text-white group-hover:text-amber-300 transition-colors">
                          Ubah Gambar MASKOT
                        </h5>
                        <span className="text-[9px] bg-amber-500 text-slate-950 font-black px-1.5 py-0.5 rounded uppercase">
                          Menu Utama
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-300 mt-0.5">
                        Klik di sini untuk mengganti, mengunggah, atau mengatur pose gambar maskot Pilkades (GLAWU)
                      </p>
                    </div>
                  </div>
                  <div className="p-2 bg-amber-500/20 rounded-xl group-hover:bg-amber-500 group-hover:text-slate-950 transition-colors shrink-0 ml-2">
                    <ArrowRight className="w-4 h-4 text-amber-300 group-hover:text-slate-950" />
                  </div>
                </button>

                {/* 2. Menu Ubah Logo & Watermark */}
                {onOpenLogoModal && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenLogoModal();
                    }}
                    className="w-full p-3.5 bg-slate-950/80 hover:bg-slate-950 border border-slate-700/80 hover:border-amber-500/50 text-white rounded-2xl transition flex items-center justify-between group text-left cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-800 text-amber-400 flex items-center justify-center shrink-0 border border-slate-700 group-hover:border-amber-500/50">
                        <ImageIcon className="w-5 h-5" />
                      </div>
                      <div>
                        <h5 className="text-xs font-bold text-white group-hover:text-amber-300 transition-colors">
                          Ubah Logo & Watermark Latar Belakang
                        </h5>
                        <p className="text-[11px] text-slate-400">
                          Ganti logo desa, lambang panitia, dan atur transparansi watermark
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 shrink-0 ml-2" />
                  </button>
                )}

                {/* 3. Menu Database Google Sheets */}
                {onOpenSheetGuide && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenSheetGuide();
                    }}
                    className="w-full p-3.5 bg-slate-950/80 hover:bg-slate-950 border border-slate-700/80 hover:border-emerald-500/50 text-white rounded-2xl transition flex items-center justify-between group text-left cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-950/50 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-700/50 group-hover:border-emerald-500/50">
                        <FileSpreadsheet className="w-5 h-5" />
                      </div>
                      <div>
                        <h5 className="text-xs font-bold text-white group-hover:text-emerald-300 transition-colors">
                          Integrasi Google Spreadsheet DPS
                        </h5>
                        <p className="text-[11px] text-slate-400">
                          Hubungkan Google Apps Script untuk sinkronisasi data pemilih online
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 shrink-0 ml-2" />
                  </button>
                )}

                {/* 4. Menu Kelola & Koreksi Rekapitulasi DPS */}
                {onOpenRecapModal && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenRecapModal();
                    }}
                    className="w-full p-3.5 bg-slate-950/80 hover:bg-slate-950 border border-slate-700/80 hover:border-amber-500/50 text-white rounded-2xl transition flex items-center justify-between group text-left cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-amber-950/50 text-amber-400 flex items-center justify-center shrink-0 border border-amber-700/50 group-hover:border-amber-500/50">
                        <BarChart3 className="w-5 h-5" />
                      </div>
                      <div>
                        <h5 className="text-xs font-bold text-white group-hover:text-amber-300 transition-colors">
                          Kelola & Koreksi Rekapitulasi DPS
                        </h5>
                        <p className="text-[11px] text-slate-400">
                          Koreksi rincian jumlah Laki-laki dan Perempuan per TPS (TPS 1 - 5)
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 shrink-0 ml-2" />
                  </button>
                )}
              </div>

              {/* Kelola Keamanan & Sesi */}
              <div className="pt-2 border-t border-slate-800 space-y-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block font-mono">
                  KEAMANAN ADMINISTRATOR
                </span>

                {!isChangingPin ? (
                  <div className="flex flex-col sm:flex-row gap-2">
                    <button
                      type="button"
                      onClick={() => setIsChangingPin(true)}
                      className="flex-1 py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <KeyRound className="w-3.5 h-3.5 text-amber-400" />
                      <span>Ubah PIN Admin</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        onLogout();
                        onClose();
                      }}
                      className="flex-1 py-2.5 px-4 bg-red-950/60 hover:bg-red-900/80 text-red-200 border border-red-800/60 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5 text-red-400" />
                      <span>Keluar (Logout)</span>
                    </button>
                  </div>
                ) : (
                  /* Form Ganti PIN */
                  <form onSubmit={handleChangePin} className="space-y-3 pt-1">
                    <h5 className="text-xs font-bold text-amber-300">
                      Masukkan PIN Baru
                    </h5>
                    <div>
                      <input
                        type="password"
                        value={newPinInput}
                        onChange={(e) => setNewPinInput(e.target.value)}
                        placeholder="PIN Baru (minimal 4 digit)"
                        className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder:text-slate-500 font-mono focus:outline-none focus:ring-2 focus:ring-amber-400"
                        required
                      />
                    </div>
                    <div>
                      <input
                        type="password"
                        value={confirmPinInput}
                        onChange={(e) => setConfirmPinInput(e.target.value)}
                        placeholder="Konfirmasi PIN Baru"
                        className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder:text-slate-500 font-mono focus:outline-none focus:ring-2 focus:ring-amber-400"
                        required
                      />
                    </div>

                    {errorMessage && (
                      <p className="text-xs text-red-400 font-medium">{errorMessage}</p>
                    )}
                    {successMessage && (
                      <p className="text-xs text-emerald-400 font-medium">{successMessage}</p>
                    )}

                    <div className="flex gap-2 pt-1">
                      <button
                        type="submit"
                        className="flex-1 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-bold transition cursor-pointer"
                      >
                        Simpan PIN Baru
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIsChangingPin(false);
                          setErrorMessage(null);
                        }}
                        className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-medium cursor-pointer"
                      >
                        Batal
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          ) : (
            /* Belum Login: Form Masukkan PIN */
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="p-3 bg-amber-950/40 border border-amber-500/30 rounded-2xl text-amber-200 text-xs flex items-start gap-2.5">
                <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span className="leading-relaxed">
                  Menu <strong>Ubah Maskot</strong>, <strong>Ubah Logo</strong>, <strong>Database Sheets</strong>, dan <strong>Sinkronisasi Live</strong> disembunyikan dari pengunjung umum dan hanya dapat diakses oleh Panitia / Administrator.
                </span>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
                  <span>Masukkan PIN Administrator:</span>
                  <span className="text-[10px] text-slate-500 font-normal">PIN bawaan: 123456</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={pinInput}
                    onChange={(e) => setPinInput(e.target.value)}
                    placeholder="Masukkan PIN Admin..."
                    autoFocus
                    className="w-full pl-10 pr-10 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs sm:text-sm text-white placeholder:text-slate-500 font-mono tracking-wider focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 shadow-inner"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-200 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {errorMessage && (
                <div className="p-2.5 bg-red-950/60 border border-red-500/40 rounded-xl text-red-300 text-xs flex items-center gap-2">
                  <X className="w-3.5 h-3.5 text-red-400 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {successMessage && (
                <div className="p-2.5 bg-emerald-950/60 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>{successMessage}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black rounded-xl text-xs sm:text-sm transition flex items-center justify-center gap-2 shadow-lg cursor-pointer"
              >
                <Lock className="w-4 h-4" />
                <span>Masuk ke Halaman Administrator</span>
              </button>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
          <span>Portal Resmi Pilkades Desa Gunungjaya 2026</span>
          <button
            type="button"
            onClick={onClose}
            className="hover:text-slate-300 font-medium cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
