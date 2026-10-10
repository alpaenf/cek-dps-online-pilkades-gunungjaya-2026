import React, { useState } from 'react';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import {
  ShieldCheck,
  Phone,
  Mail,
  Lock,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  LogOut,
  Save,
  MessageCircle,
  KeyRound,
  Info,
  Trash2,
  AlertTriangle,
  X,
  Database,
  Copy,
  ClipboardList,
  ShieldAlert,
  Eye,
  EyeOff
} from 'lucide-react';
import { DEFAULT_VILLAGE_LOGO } from '@/data/logoPresets';
import { PageProps } from '@/types';

interface AdminProfileProps {
  adminUser: {
    name: string;
    email: string;
  };
  whatsappPanitia: string;
  statsSummary?: {
    totalDps: number;
    totalDuplicates: number;
    totalPending: number;
    totalAll: number;
  };
  status?: string;
}

export default function AdminProfile({
  adminUser,
  whatsappPanitia,
  statsSummary = { totalDps: 0, totalDuplicates: 0, totalPending: 0, totalAll: 0 }
}: AdminProfileProps) {
  const { flash } = usePage<PageProps>().props;

  // Form Profil & Password Admin
  const { data, setData, patch, processing, errors, recentlySuccessful, reset } = useForm({
    email: adminUser.email,
    whatsapp_panitia: whatsappPanitia,
    current_password: '',
    new_password: '',
    new_password_confirmation: '',
  });

  // Form Reset Data Pemilih
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const resetVoterForm = useForm({
    password: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    patch(route('admin.profile.update'), {
      onSuccess: () => {
        reset('current_password', 'new_password', 'new_password_confirmation');
      },
    });
  };

  const handleOpenResetModal = () => {
    resetVoterForm.reset();
    resetVoterForm.clearErrors();
    setIsResetModalOpen(true);
  };

  const handleCloseResetModal = () => {
    if (resetVoterForm.processing) return;
    setIsResetModalOpen(false);
    resetVoterForm.reset();
    resetVoterForm.clearErrors();
  };

  const handleConfirmResetData = (e: React.FormEvent) => {
    e.preventDefault();
    resetVoterForm.post(route('admin.voters.resetAll'), {
      onSuccess: () => {
        setIsResetModalOpen(false);
        resetVoterForm.reset();
      },
    });
  };

  return (
    <div className="min-h-screen bg-[#F7F9FA] text-slate-800 pb-16 font-sans">
      <Head title="Pengaturan Profil & Kontak - Panel Admin Pilkades" />

      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b-2 border-slate-200 shadow-2xs">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-12 sm:h-14">
            {/* Logo & Portal Identity */}
            <div className="flex items-center gap-2 sm:gap-3 min-w-0 mr-2">
              <div className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center shrink-0">
                <img
                  src={DEFAULT_VILLAGE_LOGO}
                  alt="Logo Pilkades Gunungjaya"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 leading-none">
                  <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-wider text-[#1CB0F6] bg-[#DDF4FF] px-1.5 py-0.5 rounded-md border border-[#1CB0F6]/30 leading-none shrink-0">
                    PANEL ADMIN
                  </span>
                  <span className="hidden xs:inline-flex text-[8px] sm:text-[9px] font-bold uppercase tracking-wider text-[#58CC02] bg-[#E5F9D2] px-1.5 py-0.5 rounded-md border border-[#58CC02]/30 leading-none shrink-0">
                    PROFIL
                  </span>
                </div>
                <h1 className="text-[11px] sm:text-sm font-black text-slate-900 tracking-tight leading-tight truncate mt-0.5">
                  PENGATURAN PROFIL
                </h1>
                <p className="hidden md:block text-[11px] font-semibold text-slate-500 truncate leading-none mt-0.5">
                  Ubah WhatsApp, Email, Password, & Manajemen Database
                </p>
              </div>
            </div>

            {/* Actions: Back to Dashboard & Logout */}
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              <Link
                href={route('admin.dashboard')}
                className="h-8 sm:h-9 px-2.5 sm:px-3 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-black text-xs uppercase tracking-wider border border-b-2 sm:border-2 sm:border-b-3 border-slate-200 hover:border-slate-300 active:translate-y-0.5 transition-all flex items-center justify-center gap-1.5 cursor-pointer shrink-0 shadow-2xs"
                title="Kembali ke Dashboard Utama"
              >
                <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#1CB0F6]" />
                <span className="hidden sm:inline">Dashboard</span>
              </Link>

              <button
                type="button"
                onClick={() => router.post(route('logout'))}
                className="h-8 sm:h-9 px-2.5 sm:px-3 rounded-xl bg-[#FF4B4B] hover:bg-[#e03d3d] text-white font-black text-xs uppercase tracking-wider border-b-2 sm:border-b-3 border-[#EA2B2B] active:border-b-0 active:translate-y-0.5 transition-all flex items-center justify-center gap-1.5 cursor-pointer shrink-0 shadow-2xs"
                title="Keluar dari sesi administrator"
              >
                <LogOut className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Keluar</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 space-y-6">
        
        {/* Flash Notifications */}
        {(flash?.success || recentlySuccessful) && (
          <div className="p-4 rounded-2xl bg-[#E5F9D2] border-2 border-[#58CC02] text-[#46A302] font-black text-sm flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              <span>{flash?.success || 'Pengaturan berhasil disimpan!'}</span>
            </div>
          </div>
        )}

        {flash?.error && (
          <div className="p-4 rounded-2xl bg-[#FFE5E5] border-2 border-[#FF4B4B] text-[#EA2B2B] font-black text-sm flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{flash.error}</span>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Card 1: Nomor WhatsApp yang Bisa Dihubungi */}
          <div className="bg-white border-2 border-b-4 border-slate-200 rounded-3xl p-6 sm:p-8 space-y-4 shadow-sm">
            <div className="flex items-center gap-3 pb-3 border-b-2 border-slate-100">
              <div className="w-10 h-10 rounded-2xl bg-[#E5F9D2] text-[#46A302] flex items-center justify-center shrink-0 border border-[#58CC02]/30">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-black text-slate-900 tracking-tight">
                  Nomor WhatsApp Panitia (Bisa Dihubungi)
                </h2>
                <p className="text-xs text-slate-500 font-medium">
                  Nomor ini akan terhubung langsung ke tombol WhatsApp di portal publik Cek DPS.
                </p>
              </div>
            </div>

            <div>
              <label htmlFor="whatsapp_panitia" className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">
                Nomor WhatsApp Panitia *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Phone className="w-4 h-4 text-[#58CC02]" />
                </div>
                <input
                  id="whatsapp_panitia"
                  type="text"
                  value={data.whatsapp_panitia}
                  onChange={(e) => setData('whatsapp_panitia', e.target.value)}
                  placeholder="Contoh: 085226123456 atau 6285226123456"
                  required
                  className={`w-full pl-10 pr-4 py-3 bg-slate-50 border-2 rounded-2xl text-sm font-bold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white transition-all ${
                    errors.whatsapp_panitia ? 'border-[#FF4B4B] bg-[#FFE5E5]' : 'border-slate-200 focus:border-[#58CC02]'
                  }`}
                />
              </div>
              {errors.whatsapp_panitia && (
                <p className="text-xs font-bold text-[#EA2B2B] mt-1.5 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{errors.whatsapp_panitia}</span>
                </p>
              )}
              <p className="text-[11px] text-slate-400 font-semibold mt-1.5 flex items-center gap-1">
                <Info className="w-3.5 h-3.5 text-slate-400" />
                <span>Format dapat menggunakan awalan 08... atau 628... (sistem otomatis menghubungkannya ke API WhatsApp).</span>
              </p>
            </div>
          </div>

          {/* Card 2: Email Administrator */}
          <div className="bg-white border-2 border-b-4 border-slate-200 rounded-3xl p-6 sm:p-8 space-y-4 shadow-sm">
            <div className="flex items-center gap-3 pb-3 border-b-2 border-slate-100">
              <div className="w-10 h-10 rounded-2xl bg-[#DDF4FF] text-[#1899D6] flex items-center justify-center shrink-0 border border-[#1CB0F6]/30">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-black text-slate-900 tracking-tight">
                  Alamat Email Administrator
                </h2>
                <p className="text-xs text-slate-500 font-medium">
                  Email yang digunakan untuk masuk ke halaman login panel admin.
                </p>
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">
                Email Akun Admin *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4 text-[#1CB0F6]" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={data.email}
                  onChange={(e) => setData('email', e.target.value)}
                  placeholder="admin@gunungjaya.desa.id"
                  required
                  autoComplete="username"
                  className={`w-full pl-10 pr-4 py-3 bg-slate-50 border-2 rounded-2xl text-sm font-bold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white transition-all ${
                    errors.email ? 'border-[#FF4B4B] bg-[#FFE5E5]' : 'border-slate-200 focus:border-[#1CB0F6]'
                  }`}
                />
              </div>
              {errors.email && (
                <p className="text-xs font-bold text-[#EA2B2B] mt-1.5 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{errors.email}</span>
                </p>
              )}
            </div>
          </div>

          {/* Card 3: Ganti Password */}
          <div className="bg-white border-2 border-b-4 border-slate-200 rounded-3xl p-6 sm:p-8 space-y-4 shadow-sm">
            <div className="flex items-center gap-3 pb-3 border-b-2 border-slate-100">
              <div className="w-10 h-10 rounded-2xl bg-[#FFEACC] text-[#E07700] flex items-center justify-center shrink-0 border border-[#FF9600]/30">
                <KeyRound className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-black text-slate-900 tracking-tight">
                  Ubah Kata Sandi (Password)
                </h2>
                <p className="text-xs text-slate-500 font-medium">
                  Kosongkan kolom ini jika Anda tidak bermaksud mengganti kata sandi.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label htmlFor="current_password" className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">
                  Kata Sandi Saat Ini
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    id="current_password"
                    type="password"
                    value={data.current_password}
                    onChange={(e) => setData('current_password', e.target.value)}
                    placeholder="Masukkan kata sandi lama Anda"
                    autoComplete="current-password"
                    className={`w-full pl-10 pr-4 py-3 bg-slate-50 border-2 rounded-2xl text-sm font-bold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white transition-all ${
                      errors.current_password ? 'border-[#FF4B4B] bg-[#FFE5E5]' : 'border-slate-200 focus:border-[#FF9600]'
                    }`}
                  />
                </div>
                {errors.current_password && (
                  <p className="text-xs font-bold text-[#EA2B2B] mt-1.5 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{errors.current_password}</span>
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="new_password" className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">
                    Kata Sandi Baru (Min. 8 Karakter)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      id="new_password"
                      type="password"
                      value={data.new_password}
                      onChange={(e) => setData('new_password', e.target.value)}
                      placeholder="Minimal 8 karakter"
                      autoComplete="new-password"
                      className={`w-full pl-10 pr-4 py-3 bg-slate-50 border-2 rounded-2xl text-sm font-bold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white transition-all ${
                        errors.new_password ? 'border-[#FF4B4B] bg-[#FFE5E5]' : 'border-slate-200 focus:border-[#FF9600]'
                      }`}
                    />
                  </div>
                  {errors.new_password && (
                    <p className="text-xs font-bold text-[#EA2B2B] mt-1.5 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>{errors.new_password}</span>
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="new_password_confirmation" className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">
                    Konfirmasi Kata Sandi Baru
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      id="new_password_confirmation"
                      type="password"
                      value={data.new_password_confirmation}
                      onChange={(e) => setData('new_password_confirmation', e.target.value)}
                      placeholder="Ketik ulang kata sandi baru"
                      autoComplete="new-password"
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-2xl text-sm font-bold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#FF9600] focus:bg-white transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Button Bar */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <Link
              href={route('admin.dashboard')}
              className="px-5 py-3 rounded-2xl bg-white hover:bg-slate-100 text-slate-700 font-bold border-2 border-slate-200 text-xs sm:text-sm uppercase tracking-wider cursor-pointer transition-all"
            >
              Batal
            </Link>

            <button
              type="submit"
              disabled={processing}
              className="px-6 py-3 rounded-2xl bg-[#58CC02] hover:bg-[#4ebb02] text-white font-black text-xs sm:text-sm uppercase tracking-wider border-b-4 border-[#46A302] active:border-b-0 active:translate-y-1 transition-all shadow-sm flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{processing ? 'Menyimpan...' : 'Simpan Perubahan Profil'}</span>
            </button>
          </div>
        </form>

        {/* ========================================================================= */}
        {/* CARD 4: ZONA BAHAYA - RESET & HAPUS SEMUA DATA PEMILIH (DPS / EXCEL) */}
        {/* ========================================================================= */}
        <div className="bg-white border-2 border-b-4 border-rose-200 rounded-3xl p-6 sm:p-8 space-y-5 shadow-sm">
          <div className="flex items-start justify-between gap-4 pb-4 border-b-2 border-rose-100 flex-wrap sm:flex-nowrap">
            <div className="flex items-start gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-[#FFE5E5] text-[#FF4B4B] flex items-center justify-center shrink-0 border border-rose-200">
                <Trash2 className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                    Zona Bahaya: Reset Seluruh Data Pemilih
                  </h2>
                  <span className="px-2 py-0.5 rounded-md bg-rose-100 text-[#EA2B2B] text-[10px] font-black uppercase tracking-wider">
                    Danger Zone
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1 leading-relaxed">
                  Kosongkan atau hapus semua data pemilih (DPS), riwayat data ganda, dan data terlewat untuk mengembalikan status database ke <strong>0 data bersih</strong>. Anda dapat meng-import file Excel baru setelah direset.
                </p>
              </div>
            </div>
          </div>

          {/* Mini Status Card Data Saat Ini */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-2xl bg-slate-50 border-2 border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                  Data DPS Aktif
                </span>
                <span className="text-lg font-black text-slate-800">
                  {statsSummary.totalDps.toLocaleString('id-ID')} orang
                </span>
              </div>
              <div className="w-8 h-8 rounded-xl bg-green-100 text-[#58CC02] flex items-center justify-center">
                <Database className="w-4 h-4" />
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border-2 border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                  Riwayat Data Ganda
                </span>
                <span className="text-lg font-black text-slate-800">
                  {statsSummary.totalDuplicates.toLocaleString('id-ID')} NIK
                </span>
              </div>
              <div className="w-8 h-8 rounded-xl bg-sky-100 text-[#1CB0F6] flex items-center justify-center">
                <Copy className="w-4 h-4" />
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border-2 border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                  Data Terlewat (Draf)
                </span>
                <span className="text-lg font-black text-slate-800">
                  {statsSummary.totalPending.toLocaleString('id-ID')} orang
                </span>
              </div>
              <div className="w-8 h-8 rounded-xl bg-amber-100 text-[#FF9600] flex items-center justify-center">
                <ClipboardList className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Alert Security Warning & Reset Button */}
          <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-rose-50/70 border border-rose-200">
            <div className="flex items-center gap-2.5 text-xs text-rose-900 font-bold">
              <ShieldAlert className="w-5 h-5 text-[#EA2B2B] shrink-0" />
              <span>Memerlukan verifikasi password email akun admin ({adminUser.email}) sebelum eksekusi.</span>
            </div>

            <button
              type="button"
              onClick={handleOpenResetModal}
              className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-[#FF4B4B] hover:bg-[#e03d3d] text-white font-black text-xs uppercase tracking-wider border-b-4 border-[#EA2B2B] active:border-b-0 active:translate-y-1 transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer shrink-0"
            >
              <Trash2 className="w-4 h-4" />
              <span>Reset & Hapus Seluruh Data ({statsSummary.totalAll.toLocaleString('id-ID')})</span>
            </button>
          </div>
        </div>
      </main>

      {/* ========================================================================= */}
      {/* MODAL KONFIRMASI RESET DATA PEMILIH DENGAN PASSWORD ADMIN */}
      {/* ========================================================================= */}
      {isResetModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="relative w-full max-w-lg bg-white rounded-3xl border-2 border-b-4 border-rose-300 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150">
            
            {/* Header Modal */}
            <div className="p-5 sm:p-6 bg-gradient-to-r from-rose-500 to-red-600 text-white flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-white/20 border border-white/30 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-rose-200 block">
                    Konfirmasi Keamanan Tinggi
                  </span>
                  <h3 className="text-lg sm:text-xl font-black tracking-tight">
                    Reset Seluruh Data Pemilih?
                  </h3>
                </div>
              </div>

              <button
                type="button"
                onClick={handleCloseResetModal}
                disabled={resetVoterForm.processing}
                className="p-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-white transition-colors cursor-pointer disabled:opacity-50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form Konfirmasi Password */}
            <form onSubmit={handleConfirmResetData} className="p-5 sm:p-7 space-y-5">
              
              {/* Alert Peringatan Hapus */}
              <div className="p-4 rounded-2xl bg-[#FFE5E5] border-2 border-[#FF4B4B]/30 text-xs sm:text-sm text-[#EA2B2B] font-bold space-y-2">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                  <p className="leading-relaxed">
                    <strong>PERHATIAN:</strong> Tindakan ini bersifat permanen dan tidak dapat dibatalkan.
                  </p>
                </div>
                <ul className="list-disc pl-7 space-y-1 text-xs text-rose-900 font-semibold">
                  <li><strong>{statsSummary.totalDps.toLocaleString('id-ID')} Data DPS</strong> akan dihapus bersih (menjadi 0).</li>
                  <li><strong>{statsSummary.totalDuplicates.toLocaleString('id-ID')} Data NIK Ganda</strong> akan dihapus.</li>
                  <li><strong>{statsSummary.totalPending.toLocaleString('id-ID')} Data Terlewat</strong> akan dibersihkan.</li>
                  <li>Data master Lokasi TPS & akun Administrator tetap aman (tidak terhapus).</li>
                </ul>
              </div>

              {/* Input Password Akun */}
              <div>
                <label htmlFor="reset_password" className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">
                  Masukkan Password Akun Admin ({adminUser.email}) *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4 text-[#FF4B4B]" />
                  </div>
                  <input
                    id="reset_password"
                    type={showPassword ? 'text' : 'password'}
                    value={resetVoterForm.data.password}
                    onChange={(e) => resetVoterForm.setData('password', e.target.value)}
                    placeholder="Ketik kata sandi akun admin Anda"
                    required
                    autoFocus
                    disabled={resetVoterForm.processing}
                    className={`w-full pl-10 pr-12 py-3.5 bg-slate-50 border-2 rounded-2xl text-sm font-bold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white transition-all ${
                      resetVoterForm.errors.password ? 'border-[#FF4B4B] bg-[#FFE5E5]' : 'border-slate-200 focus:border-[#FF4B4B]'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {resetVoterForm.errors.password && (
                  <p className="text-xs font-bold text-[#EA2B2B] mt-1.5 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{resetVoterForm.errors.password}</span>
                  </p>
                )}
                <p className="text-[11px] text-slate-400 font-medium mt-1">
                  Verifikasi keamanan untuk memastikan hanya admin resmi yang dapat mereset data.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t-2 border-slate-100">
                <button
                  type="button"
                  onClick={handleCloseResetModal}
                  disabled={resetVoterForm.processing}
                  className="px-5 py-3 rounded-2xl bg-white hover:bg-slate-100 text-slate-700 font-bold border-2 border-slate-200 text-xs uppercase tracking-wider cursor-pointer transition-all disabled:opacity-50"
                >
                  Batal
                </button>

                <button
                  type="submit"
                  disabled={resetVoterForm.processing || !resetVoterForm.data.password}
                  className="px-6 py-3 rounded-2xl bg-[#FF4B4B] hover:bg-[#e03d3d] text-white font-black text-xs uppercase tracking-wider border-b-4 border-[#EA2B2B] active:border-b-0 active:translate-y-1 transition-all shadow-sm flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>{resetVoterForm.processing ? 'Sedang Mereset Data...' : `Ya, Hapus Semua (${statsSummary.totalAll.toLocaleString('id-ID')}) Data`}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
