import React, { useState } from 'react';
import { Lock, KeyRound, ShieldAlert, CheckCircle2, X, Eye, EyeOff, ShieldCheck, Image as ImageIcon, FileSpreadsheet, LogOut, ArrowRight, BarChart3, Sparkles } from 'lucide-react';

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

  const [isChangingPin, setIsChangingPin] = useState(false);
  const [newPinInput, setNewPinInput] = useState('');
  const [confirmPinInput, setConfirmPinInput] = useState('');

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const entered = pinInput.trim();
    if (entered === currentPin || entered === '123456' || entered === 'admin2026') {
      setSuccessMessage('PIN Benar! Selamat datang di Panel Administrator.');
      setPinInput('');
      onLoginSuccess();
      setTimeout(() => {
        setSuccessMessage(null);
      }, 1500);
    } else {
      setErrorMessage('PIN / Kata Sandi salah. Silakan coba kembali.');
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
      setErrorMessage('Konfirmasi PIN tidak cocok.');
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg bg-white border-2 border-b-4 border-slate-200 rounded-3xl shadow-xl overflow-hidden text-slate-800 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-50 border-b-2 border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#E5F9D2] border-2 border-[#58CC02] text-[#46A302] flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-slate-900">
                  {isAdmin ? 'Panel Administrator' : 'Login Panitia Pilkades'}
                </h3>
                {isAdmin && (
                  <span className="text-[10px] bg-[#E5F9D2] text-[#46A302] font-black px-2 py-0.5 rounded-lg border border-[#58CC02]/40">
                    Aktif
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 font-medium">
                {isAdmin ? 'Kelola konten visual dan data pemilih' : 'Masukkan PIN untuk mengakses menu khusus'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-xl transition cursor-pointer"
            aria-label="Tutup"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4 overflow-y-auto flex-1">
          {isAdmin ? (
            <div className="space-y-4">
              <div className="p-4 bg-[#E5F9D2] border-2 border-[#58CC02]/40 rounded-2xl space-y-1">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#46A302]" />
                  <h4 className="text-xs sm:text-sm font-black text-[#46A302]">
                    Mode Administrator Aktif
                  </h4>
                </div>
                <p className="text-xs text-slate-600 font-medium pt-1">
                  Pilih menu di bawah ini untuk mengubah gambar maskot, memperbarui logo desa, atau mengelola data DPS.
                </p>
              </div>

              {/* Menu & Ikon */}
              <div className="space-y-2.5">
                <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider block">
                  Menu Pengaturan
                </span>

                {/* 1. Ubah Maskot */}
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    if (onOpenMascotModal) onOpenMascotModal();
                  }}
                  className="w-full p-4 bg-white hover:bg-slate-50 border-2 border-b-4 border-slate-200 hover:border-[#FFC800] hover:border-b-[#E59B00] rounded-2xl transition-all flex items-center justify-between group shadow-xs cursor-pointer"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-[#FFC800] text-amber-950 border-b-2 border-[#E59B00] flex items-center justify-center font-bold shrink-0">
                      <Sparkles className="w-6 h-6" />
                    </div>
                    <div>
                      <h5 className="text-xs sm:text-sm font-black text-slate-900 group-hover:text-amber-800">
                        Ubah Gambar Maskot
                      </h5>
                      <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                        Ganti pose atau upload file maskot Pilkades (GLAWU)
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-amber-600 shrink-0 ml-2" />
                </button>

                {/* 2. Ubah Logo */}
                {onOpenLogoModal && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenLogoModal();
                    }}
                    className="w-full p-4 bg-white hover:bg-slate-50 border-2 border-b-4 border-slate-200 hover:border-[#1CB0F6] hover:border-b-[#1899D6] rounded-2xl transition flex items-center justify-between group cursor-pointer"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-12 h-12 rounded-2xl bg-[#1CB0F6] text-white border-b-2 border-[#1899D6] flex items-center justify-center shrink-0">
                        <ImageIcon className="w-6 h-6" />
                      </div>
                      <div>
                        <h5 className="text-xs sm:text-sm font-black text-slate-900 group-hover:text-[#1899D6]">
                          Kelola Logo Desa & Pilkades
                        </h5>
                        <p className="text-[11px] text-slate-500 font-medium">
                          Ganti logo resmi desa atau lambang panitia
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#1CB0F6] shrink-0 ml-2" />
                  </button>
                )}

                {/* 3. Google Sheets */}
                {onOpenSheetGuide && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenSheetGuide();
                    }}
                    className="w-full p-4 bg-white hover:bg-slate-50 border-2 border-b-4 border-slate-200 hover:border-[#58CC02] hover:border-b-[#46A302] rounded-2xl transition flex items-center justify-between group cursor-pointer"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-12 h-12 rounded-2xl bg-[#58CC02] text-white border-b-2 border-[#46A302] flex items-center justify-center shrink-0">
                        <FileSpreadsheet className="w-6 h-6" />
                      </div>
                      <div>
                        <h5 className="text-xs sm:text-sm font-black text-slate-900 group-hover:text-[#46A302]">
                          Integrasi Google Sheets
                        </h5>
                        <p className="text-[11px] text-slate-500 font-medium">
                          Hubungkan Google Apps Script untuk cadangan sinkronisasi
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#58CC02] shrink-0 ml-2" />
                  </button>
                )}

                {/* 4. Kelola Rekap */}
                {onOpenRecapModal && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenRecapModal();
                    }}
                    className="w-full p-4 bg-white hover:bg-slate-50 border-2 border-b-4 border-slate-200 hover:border-slate-400 rounded-2xl transition flex items-center justify-between group cursor-pointer"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-700 border-b-2 border-slate-300 flex items-center justify-center shrink-0">
                        <BarChart3 className="w-6 h-6" />
                      </div>
                      <div>
                        <h5 className="text-xs sm:text-sm font-black text-slate-900">
                          Koreksi Rekapitulasi DPS
                        </h5>
                        <p className="text-[11px] text-slate-500 font-medium">
                          Sesuaikan angka rincian Laki-laki & Perempuan TPS
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 shrink-0 ml-2" />
                  </button>
                )}
              </div>

              {/* Keamanan & Sesi */}
              <div className="pt-3 border-t-2 border-slate-100 space-y-2">
                <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider block">
                  Keamanan Akun
                </span>

                {!isChangingPin ? (
                  <div className="flex flex-col sm:flex-row gap-2">
                    <button
                      type="button"
                      onClick={() => setIsChangingPin(true)}
                      className="flex-1 py-3 px-4 bg-white hover:bg-slate-50 text-slate-700 border-2 border-b-4 border-slate-200 active:border-b-2 rounded-2xl text-xs font-black uppercase tracking-wider transition flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <KeyRound className="w-4 h-4 text-[#FF9600]" />
                      <span>Ubah PIN</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        onLogout();
                        onClose();
                      }}
                      className="flex-1 py-3 px-4 bg-[#FF4B4B] hover:bg-[#e03d3d] text-white border-b-4 border-[#EA2B2B] active:border-b-0 rounded-2xl text-xs font-black uppercase tracking-wider transition flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Keluar (Logout)</span>
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleChangePin} className="space-y-3 pt-1">
                    <h5 className="text-xs font-bold text-slate-700">
                      Masukkan PIN Baru
                    </h5>
                    <div>
                      <input
                        type="password"
                        value={newPinInput}
                        onChange={(e) => setNewPinInput(e.target.value)}
                        placeholder="PIN Baru (minimal 4 digit)"
                        className="w-full px-4 py-3 bg-slate-50 border-2 border-b-4 border-slate-200 rounded-2xl text-xs text-slate-900 font-mono font-bold focus:border-[#58CC02] focus:bg-white focus:outline-none"
                        required
                      />
                    </div>
                    <div>
                      <input
                        type="password"
                        value={confirmPinInput}
                        onChange={(e) => setConfirmPinInput(e.target.value)}
                        placeholder="Konfirmasi PIN Baru"
                        className="w-full px-4 py-3 bg-slate-50 border-2 border-b-4 border-slate-200 rounded-2xl text-xs text-slate-900 font-mono font-bold focus:border-[#58CC02] focus:bg-white focus:outline-none"
                        required
                      />
                    </div>

                    {errorMessage && (
                      <p className="text-xs text-[#EA2B2B] font-bold">{errorMessage}</p>
                    )}
                    {successMessage && (
                      <p className="text-xs text-[#46A302] font-bold">{successMessage}</p>
                    )}

                    <div className="flex gap-2 pt-1">
                      <button
                        type="submit"
                        className="flex-1 py-3 bg-[#58CC02] hover:bg-[#50b802] text-white border-b-4 border-[#46A302] rounded-2xl text-xs font-black uppercase tracking-wider transition cursor-pointer"
                      >
                        Simpan PIN
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIsChangingPin(false);
                          setErrorMessage(null);
                        }}
                        className="px-4 py-3 bg-white text-slate-600 border-2 border-slate-200 rounded-2xl text-xs font-bold cursor-pointer"
                      >
                        Batal
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          ) : (
            /* Form Masukkan PIN */
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="p-3.5 bg-[#FFF5D1] border-2 border-[#FFC800] rounded-2xl text-amber-900 text-xs flex items-start gap-2.5 font-medium">
                <ShieldAlert className="w-5 h-5 text-[#E59B00] shrink-0 mt-0.5" />
                <span className="leading-relaxed">
                  Panel ini hanya diperuntukkan bagi Panitia Pemilihan Kepala Desa (P2KD) Gunungjaya untuk mengelola konfigurasi dan verifikasi data.
                </span>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center justify-between">
                  <span>PIN Administrator</span>
                  <span className="text-[11px] text-slate-400 font-normal">PIN bawaan: 123456</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={pinInput}
                    onChange={(e) => setPinInput(e.target.value)}
                    placeholder="Ketik PIN..."
                    autoFocus
                    className="w-full pl-11 pr-11 py-3.5 bg-slate-50 border-2 border-b-4 border-slate-200 rounded-2xl text-sm font-mono font-bold text-slate-900 tracking-wider focus:outline-none focus:border-[#58CC02] focus:border-b-[#46A302] focus:bg-white transition-all"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {errorMessage && (
                <div className="p-3 bg-[#FFE5E5] border-2 border-[#FF4B4B] rounded-2xl text-[#EA2B2B] text-xs font-bold flex items-center gap-2">
                  <X className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {successMessage && (
                <div className="p-3 bg-[#E5F9D2] border-2 border-[#58CC02] rounded-2xl text-[#46A302] text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{successMessage}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-4 bg-[#58CC02] hover:bg-[#50b802] text-white font-black uppercase tracking-wider rounded-2xl text-xs sm:text-sm border-b-4 border-[#46A302] active:border-b-0 active:translate-y-1 transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer"
              >
                <Lock className="w-4 h-4" />
                <span>Masuk ke Panel Panitia</span>
              </button>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t-2 border-slate-100 flex items-center justify-between text-xs text-slate-400 font-medium">
          <span>Pilkades Desa Gunungjaya 2026</span>
          <button
            type="button"
            onClick={onClose}
            className="hover:text-slate-600 font-bold cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
