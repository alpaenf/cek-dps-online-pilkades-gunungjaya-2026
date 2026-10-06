import React from 'react';
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
  Info
} from 'lucide-react';
import { DEFAULT_VILLAGE_LOGO } from '@/data/logoPresets';
import { PageProps } from '@/types';

interface AdminProfileProps {
  adminUser: {
    name: string;
    email: string;
  };
  whatsappPanitia: string;
  status?: string;
}

export default function AdminProfile({
  adminUser,
  whatsappPanitia
}: AdminProfileProps) {
  const { flash } = usePage<PageProps>().props;

  const { data, setData, patch, processing, errors, recentlySuccessful, reset } = useForm({
    email: adminUser.email,
    whatsapp_panitia: whatsappPanitia,
    current_password: '',
    new_password: '',
    new_password_confirmation: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    patch(route('admin.profile.update'), {
      onSuccess: () => {
        reset('current_password', 'new_password', 'new_password_confirmation');
      },
    });
  };

  return (
    <div className="min-h-screen bg-[#F7F9FA] text-slate-800 pb-16 font-sans">
      <Head title="Pengaturan Profil & Kontak - Panel Admin Pilkades" />

      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-white border-b-2 border-slate-200 shadow-xs">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo & Portal Identity */}
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 flex items-center justify-center shrink-0">
                <img
                  src={DEFAULT_VILLAGE_LOGO}
                  alt="Logo Pilkades Gunungjaya"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase tracking-wider text-[#1CB0F6] bg-[#DDF4FF] px-2 py-0.5 rounded-lg border border-[#1CB0F6]/30">
                    PANEL ADMINISTRATOR
                  </span>
                  <span className="text-[10px] font-black uppercase tracking-wider text-[#58CC02] bg-[#E5F9D2] px-2 py-0.5 rounded-lg border border-[#58CC02]/30">
                    PROFIL & KONTAK
                  </span>
                </div>
                <h1 className="text-base sm:text-lg font-black text-slate-900 tracking-tight leading-tight">
                  PENGATURAN PROFIL
                </h1>
                <p className="text-xs font-semibold text-slate-500">
                  Ubah Nomor WhatsApp, Email, & Password Admin
                </p>
              </div>
            </div>

            {/* Actions: Back to Dashboard & Logout */}
            <div className="flex items-center gap-2 sm:gap-3">
              <Link
                href={route('admin.dashboard')}
                className="px-3.5 py-2 rounded-2xl bg-white hover:bg-slate-50 text-slate-700 font-black text-xs uppercase tracking-wider border-2 border-b-4 border-slate-200 hover:border-slate-300 transition-all flex items-center gap-1.5 cursor-pointer"
                title="Kembali ke Dashboard Utama"
              >
                <ArrowLeft className="w-4 h-4 text-[#1CB0F6]" />
                <span className="hidden sm:inline">Dashboard Utama</span>
              </Link>

              <button
                type="button"
                onClick={() => router.post(route('logout'))}
                className="px-3.5 py-2 rounded-2xl bg-[#FF4B4B] hover:bg-[#e03d3d] text-white font-black text-xs uppercase tracking-wider border-b-4 border-[#EA2B2B] active:border-b-0 active:translate-y-1 transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                title="Keluar dari sesi administrator"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6">
        
        {/* Flash Notifications */}
        {(flash?.success || recentlySuccessful) && (
          <div className="p-4 rounded-2xl bg-[#E5F9D2] border-2 border-[#58CC02] text-[#46A302] font-black text-sm flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              <span>{flash?.success || 'Pengaturan nomor WhatsApp, email, dan password berhasil disimpan!'}</span>
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
      </main>
    </div>
  );
}
