import React from 'react';
import { Calendar, CheckSquare, Award, FileText, Vote, ShieldCheck, MapPin } from 'lucide-react';
import { PilkadesConfig } from '../types/pilkades';

interface AboutPilkadesProps {
  config: PilkadesConfig;
}

export const AboutPilkades: React.FC<AboutPilkadesProps> = ({ config }) => {
  return (
    <section id="tentang-pilkades" className="py-14 sm:py-20 bg-gradient-to-b from-black/55 via-slate-950/60 to-black/75 backdrop-blur-xs border-b border-white/10 text-slate-100 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-300 bg-amber-950/70 px-3.5 py-1 rounded-full border border-amber-500/40 inline-block mb-2 font-mono">
            INFORMASI KEGIATAN DESA
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-serif">
            Tentang Pilkades Desa Gunungjaya 2026
          </h2>
          <p className="text-slate-300 text-sm sm:text-base mt-2">
            Pelaksanaan demokrasi desa untuk memilih Kepala Desa Gunungjaya periode kepemimpinan berikutnya secara langsung, umum, bebas, rahasia, jujur, dan adil.
          </p>
        </div>

        {/* Info Grid Bento */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          <div className="p-5 bg-slate-900/90 backdrop-blur-xl rounded-2xl border border-slate-800 shadow-md">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1 font-mono">
              Desa & Kecamatan
            </span>
            <p className="text-base font-bold text-white font-serif">
              Desa {config.desa}
            </p>
            <p className="text-xs text-slate-400 mt-0.5">
              Kec. {config.kecamatan}, Kab. {config.kabupaten}
            </p>
          </div>

          <div className="p-5 bg-slate-900/90 backdrop-blur-xl rounded-2xl border border-slate-800 shadow-md">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1 font-mono">
              Tahun Pelaksanaan
            </span>
            <p className="text-base font-bold text-amber-400 font-mono">
              Tahun {config.tahun}
            </p>
            <p className="text-xs text-slate-400 mt-0.5">
              Serentak Tingkat Kabupaten
            </p>
          </div>

          <div className="p-5 bg-slate-900/90 backdrop-blur-xl rounded-2xl border border-slate-800 shadow-md">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1 font-mono">
              Hari Pemungutan Suara
            </span>
            <p className="text-base font-bold text-emerald-400">
              {config.tanggal_pemungutan.split('(')[0]}
            </p>
            <p className="text-xs text-slate-400 mt-0.5 font-mono">
              Pukul 07.00 - 13.00 WIB
            </p>
          </div>

          <div className="p-5 bg-slate-900/90 backdrop-blur-xl rounded-2xl border border-slate-800 shadow-md">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1 font-mono">
              Penyelenggara Teknis
            </span>
            <p className="text-base font-bold text-white">
              P2KD Gunungjaya
            </p>
            <p className="text-xs text-slate-400 mt-0.5">
              Panitia Pemilihan Kepala Desa
            </p>
          </div>
        </div>

        {/* 2-Column: Tahapan Pilkades & Syarat Pemilih */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Tahapan Pilkades */}
          <div className="bg-slate-900/90 backdrop-blur-xl rounded-2xl border border-slate-800 p-6 sm:p-8 shadow-xl">
            <h3 className="text-lg font-bold text-white font-serif mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-amber-400" />
              <span>Tahapan Pelaksanaan Pilkades 2026</span>
            </h3>

            <div className="space-y-4">
              <div className="flex gap-3">
                <span className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 text-xs font-black flex items-center justify-center shrink-0 mt-0.5 font-mono">
                  1
                </span>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-white">
                    Penyusunan & Pemutakhiran Daftar Pemilih (DPS ke DPT)
                  </h4>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Pencocokan dan penelitian faktual pemilih oleh panitia pendaftaran desa hingga penetapan DPT resmi.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <span className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 text-xs font-black flex items-center justify-center shrink-0 mt-0.5 font-mono">
                  2
                </span>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-white">
                    Pendaftaran & Penelitian Berkas Bakal Calon
                  </h4>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Penerimaan pendaftaran bakal calon Kepala Desa dan verifikasi kelengkapan administrasi calon.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <span className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 text-xs font-black flex items-center justify-center shrink-0 mt-0.5 font-mono">
                  3
                </span>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-white">
                    Penetapan Calon & Pengundian Nomor Urut
                  </h4>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Rapat pleno terbuka penetapan Calon Kepala Desa yang berhak dipilih dan masa kampanye damai.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <span className="w-6 h-6 rounded-full bg-emerald-500 text-slate-950 text-xs font-black flex items-center justify-center shrink-0 mt-0.5 font-mono">
                  4
                </span>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-emerald-400">
                    Hari Pemungutan & Penghitungan Suara di TPS
                  </h4>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Pemberian suara di 5 TPS, pembukaan kotak suara, dan penghitungan hasil suara oleh KPPS.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Syarat Pemilih DPT */}
          <div className="bg-slate-900/90 backdrop-blur-xl rounded-2xl border border-slate-800 p-6 sm:p-8 shadow-xl">
            <h3 className="text-lg font-bold text-white font-serif mb-4 flex items-center gap-2">
              <CheckSquare className="w-5 h-5 text-emerald-400" />
              <span>Syarat Pemilih yang Berhak Terdaftar di DPT</span>
            </h3>

            <ul className="space-y-3 text-xs sm:text-sm text-slate-300">
              <li className="flex items-start gap-2.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0 mt-2" />
                <span>
                  Warga Negara Indonesia (WNI) yang berdomisili sah di wilayah Desa Gunungjaya.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0 mt-2" />
                <span>
                  Telah genap berumur 17 (tujuh belas) tahun pada hari pemungutan suara atau sudah/pernah menikah.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0 mt-2" />
                <span>
                  Telah bertempat tinggal di Desa Gunungjaya sekurang-kurangnya 6 (enam) bulan secara berturut-turut dibuktikan dengan e-KTP dan Kartu Keluarga.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0 mt-2" />
                <span>
                  Tidak sedang dicabut hak pilihnya berdasarkan putusan pengadilan yang telah mempunyai kekuatan hukum tetap.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0 mt-2" />
                <span>
                  Bukan merupakan anggota aktif Tentara Nasional Indonesia (TNI) atau Kepolisian Republik Indonesia (Polri).
                </span>
              </li>
            </ul>

            <div className="mt-6 p-4 rounded-xl bg-slate-950/90 border border-slate-700/80 text-xs text-slate-300">
              <span className="font-bold text-amber-300 block mb-1">Dokumen Wajib Dibawa ke TPS:</span>
              1. Formulir Model C.Pemberitahuan (Surat Undangan Pemilih dari Panitia)<br />
              2. e-KTP asli atau Surat Keterangan (Suket) dari Disdukcapil Kab. Pemalang
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
