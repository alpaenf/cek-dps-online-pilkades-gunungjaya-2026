import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { ShieldCheck, Lock, Mail, ArrowLeft, AlertCircle, CheckCircle2, Sparkles, Database } from 'lucide-react';
import { DEFAULT_VILLAGE_LOGO, DEFAULT_MASCOT_GLAWU } from '@/data/logoPresets';

interface LoginProps {
  status?: string;
  canResetPassword?: boolean;
}

export default function Login({ status }: LoginProps) {
  const { data, setData, post, processing, errors, reset } = useForm({
    email: 'admin@gunungjaya.desa.id',
    password: '',
    remember: true,
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route('login'), {
      onFinish: () => reset('password'),
    });
  };

  return (
    <div className="min-h-screen bg-[#F7F9FA] text-slate-800 flex flex-col justify-center py-6 sm:py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <Head title="Login Administrator - Pilkades Gunungjaya 2026" />

      {/* Top back navigation */}
      <div className="max-w-4xl w-full mx-auto mb-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-600 hover:text-slate-900 bg-white px-3.5 py-2 rounded-xl border-2 border-b-4 border-slate-200 hover:border-slate-300 transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Portal Cek DPS</span>
        </Link>
      </div>

      {/* Main Wide Card Container (Horizontal 2-Column Layout) */}
      <div className="max-w-4xl w-full mx-auto">
        <div className="bg-white border-2 border-b-4 border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8 items-center">
            
            {/* Kolom Kiri: Maskot GLAWU & Sambutan Panitia */}
            <div className="md:col-span-5 flex flex-col items-center justify-center p-5 bg-[#F7F9FA] border-2 border-slate-100 rounded-3xl text-center">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#E5F9D2] text-[#46A302] border border-[#58CC02]/40 rounded-xl text-[11px] font-black uppercase tracking-wider mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Maskot Resmi: GLAWU</span>
              </div>

              {/* Foto Maskot GLAWU */}
              <div className="w-44 sm:w-48 max-h-[220px] flex items-center justify-center py-1">
                <img
                  src={DEFAULT_MASCOT_GLAWU}
                  alt="Maskot Pilkades Gunungjaya: GLAWU"
                  className="w-full h-full object-contain select-none transition-transform duration-200 hover:scale-105"
                />
              </div>

              <div className="mt-3">
                <h2 className="text-base font-black text-slate-900 leading-snug">
                  Halo Panitia Pilkades!
                </h2>
                <p className="text-xs text-slate-500 font-medium mt-1 leading-relaxed">
                  Silakan masuk untuk mengelola data Lokasi TPS & Daftar Pemilih Sementara (DPS).
                </p>
              </div>

              <div className="mt-3 pt-3 border-t border-slate-200 w-full flex items-center justify-center gap-2 text-[11px] font-bold text-slate-600">
                <span className="flex items-center gap-1 text-[#46A302]">
                  <Database className="w-3 h-3" />
                  MySQL Aktif
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 text-[#1CB0F6]">
                  <ShieldCheck className="w-3 h-3" />
                  Akses Terlindungi
                </span>
              </div>
            </div>

            {/* Kolom Kanan: Formulir Login Administrator */}
            <div className="md:col-span-7 space-y-4">
              
              {/* Header Kolom Form */}
              <div className="flex items-center gap-3 pb-3 border-b-2 border-slate-100">
                <div className="w-12 h-12 flex items-center justify-center shrink-0">
                  <img
                    src={DEFAULT_VILLAGE_LOGO}
                    alt="Logo Pilkades Gunungjaya"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div>
                  <div className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-[#E5F9D2] text-[#46A302] border border-[#58CC02]/30 rounded-lg text-[10px] font-black uppercase tracking-wider mb-0.5">
                    <ShieldCheck className="w-3 h-3" />
                    <span>Akses Panitia P2KD</span>
                  </div>
                  <h1 className="text-xl font-black text-slate-900 tracking-tight leading-tight">
                    Portal Admin Pilkades
                  </h1>
                  <p className="text-xs text-slate-500 font-medium">
                    Desa Gunungjaya, Kec. Belik, Kab. Pemalang 2026
                  </p>
                </div>
              </div>

              {/* Flash status */}
              {status && (
                <div className="p-3 rounded-2xl bg-[#E5F9D2] border border-[#58CC02] text-[#46A302] text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{status}</span>
                </div>
              )}

              {/* Form Input */}
              <form onSubmit={submit} className="space-y-3.5">
                <div>
                  <label htmlFor="email" className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1">
                    Alamat Email Panitia
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      id="email"
                      type="email"
                      name="email"
                      value={data.email}
                      onChange={(e) => setData('email', e.target.value)}
                      placeholder="admin@gunungjaya.desa.id"
                      required
                      autoComplete="username"
                      className={`w-full pl-10 pr-4 py-2.5 bg-slate-50 border-2 rounded-2xl text-xs sm:text-sm font-bold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white transition-all ${
                        errors.email ? 'border-[#FF4B4B] bg-[#FFE5E5]' : 'border-slate-200 focus:border-[#58CC02]'
                      }`}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-xs font-bold text-[#EA2B2B] mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>{errors.email}</span>
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="password" className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1">
                    Kata Sandi (Password)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      id="password"
                      type="password"
                      name="password"
                      value={data.password}
                      onChange={(e) => setData('password', e.target.value)}
                      placeholder="••••••••"
                      required
                      autoComplete="current-password"
                      className={`w-full pl-10 pr-4 py-2.5 bg-slate-50 border-2 rounded-2xl text-xs sm:text-sm font-bold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white transition-all ${
                        errors.password ? 'border-[#FF4B4B] bg-[#FFE5E5]' : 'border-slate-200 focus:border-[#58CC02]'
                      }`}
                    />
                  </div>
                  {errors.password && (
                    <p className="text-xs font-bold text-[#EA2B2B] mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>{errors.password}</span>
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between pt-0.5">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name="remember"
                      checked={data.remember}
                      onChange={(e) => setData('remember', e.target.checked)}
                      className="w-4 h-4 text-[#58CC02] border-2 border-slate-300 rounded-lg focus:ring-0 focus:ring-offset-0"
                    />
                    <span className="ml-2 text-xs font-bold text-slate-600">Ingat sesi saya</span>
                  </label>
                </div>

                <div className="pt-1">
                  <button
                    type="submit"
                    disabled={processing}
                    className="w-full py-3 px-4 rounded-2xl bg-[#58CC02] hover:bg-[#4ebb02] text-white font-black text-xs sm:text-sm uppercase tracking-wider border-b-4 border-[#46A302] active:border-b-0 active:translate-y-1 transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>{processing ? 'Memverifikasi...' : 'Masuk Panel Admin'}</span>
                  </button>
                </div>
              </form>

              {/* Quick Info Box */}
              <div className="pt-2 border-t border-slate-100 text-center">
                <p className="text-[11px] font-semibold text-slate-400">
                  Akun bawaan: <span className="text-slate-700 font-bold">admin@gunungjaya.desa.id</span> | Sandi: <span className="text-slate-700 font-bold">password</span>
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
