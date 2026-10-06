import React from 'react';
import { Clock, CheckSquare, Shield, HelpCircle, Layers } from 'lucide-react';

export const VoterGuideSection: React.FC = () => {
  return (
    <section id="voter-guide" className="py-16 bg-stone-50 border-t border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10 text-center max-w-3xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-red-900 block mb-1">
            Edukasi Pemilih
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-serif text-stone-900 mb-3">
            Tata Cara & Alur Pemungutan Suara di TPS
          </h2>
          <p className="text-stone-600 text-sm sm:text-base">
            Ketahui panduan resmi tata cara pemungutan suara di TPS, jenis dokumen yang wajib dibawa, serta pengenalan 5 jenis warna surat suara.
          </p>
        </div>

        {/* 5 Surat Suara Visual Grid */}
        <div className="mb-12">
          <h3 className="text-lg font-bold text-stone-900 font-serif mb-4 flex items-center gap-2">
            <Layers className="w-5 h-5 text-red-900" />
            <span>Mengenal 5 Warna Surat Suara Pemilu</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Abu-abu: Presiden */}
            <div className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-xs">
              <div className="h-3 bg-stone-400" />
              <div className="p-4">
                <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block mb-1">
                  Surat Suara Abu-Abu
                </span>
                <h4 className="text-sm font-bold text-stone-900 mb-1">
                  Presiden & Wakil Presiden
                </h4>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Memuat foto, nomor urut, serta visi-misi pasangan calon Presiden & Wakil Presiden RI.
                </p>
              </div>
            </div>

            {/* Kuning: DPR RI */}
            <div className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-xs">
              <div className="h-3 bg-amber-400" />
              <div className="p-4">
                <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider block mb-1">
                  Surat Suara Kuning
                </span>
                <h4 className="text-sm font-bold text-stone-900 mb-1">
                  DPR RI
                </h4>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Memuat nomor urut, logo partai politik, dan daftar calon anggota DPR Republik Indonesia.
                </p>
              </div>
            </div>

            {/* Merah: DPD RI */}
            <div className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-xs">
              <div className="h-3 bg-red-700" />
              <div className="p-4">
                <span className="text-[11px] font-bold text-red-800 uppercase tracking-wider block mb-1">
                  Surat Suara Merah
                </span>
                <h4 className="text-sm font-bold text-stone-900 mb-1">
                  DPD RI
                </h4>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Memuat foto perseorangan calon anggota Dewan Perwakilan Daerah (DPD) perwakilan provinsi.
                </p>
              </div>
            </div>

            {/* Biru: DPRD Provinsi */}
            <div className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-xs">
              <div className="h-3 bg-blue-600" />
              <div className="p-4">
                <span className="text-[11px] font-bold text-blue-700 uppercase tracking-wider block mb-1">
                  Surat Suara Biru
                </span>
                <h4 className="text-sm font-bold text-stone-900 mb-1">
                  DPRD Provinsi
                </h4>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Memuat partai politik dan daftar nama calon anggota DPRD tingkat Provinsi.
                </p>
              </div>
            </div>

            {/* Hijau: DPRD Kab/Kota */}
            <div className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-xs">
              <div className="h-3 bg-emerald-600" />
              <div className="p-4">
                <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider block mb-1">
                  Surat Suara Hijau
                </span>
                <h4 className="text-sm font-bold text-stone-900 mb-1">
                  DPRD Kabupaten / Kota
                </h4>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Memuat partai politik dan calon anggota DPRD Kabupaten atau Kota (kecuali DKI Jakarta).
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Step by step inside TPS */}
        <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8">
          <h3 className="text-lg sm:text-xl font-bold text-stone-900 font-serif mb-6">
            Alur Langkah Pencoblosan di Tempat Pemungutan Suara (TPS)
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="flex gap-4">
              <span className="w-8 h-8 rounded-full bg-red-100 text-red-900 text-xs font-bold flex items-center justify-center shrink-0">
                1
              </span>
              <div>
                <h4 className="text-sm font-bold text-stone-900 mb-1">
                  Kedatangan & Registrasi
                </h4>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Tunjukkan formulir C.Pemberitahuan dan e-KTP kepada petugas KPPS 4 dan 5 di meja pintu masuk untuk diverifikasi dalam daftar hadir.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <span className="w-8 h-8 rounded-full bg-red-100 text-red-900 text-xs font-bold flex items-center justify-center shrink-0">
                2
              </span>
              <div>
                <h4 className="text-sm font-bold text-stone-900 mb-1">
                  Menunggu Panggilan KPPS
                </h4>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Duduk tertib di kursi antrean yang telah disediakan hingga nama Anda dipanggil oleh Ketua KPPS (KPPS 1).
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <span className="w-8 h-8 rounded-full bg-red-100 text-red-900 text-xs font-bold flex items-center justify-center shrink-0">
                3
              </span>
              <div>
                <h4 className="text-sm font-bold text-stone-900 mb-1">
                  Menerima Surat Suara
                </h4>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Buka surat suara di depan Ketua KPPS untuk memastikan surat suara dalam keadaan bersih dan tidak rusak sebelum dibawa ke bilik.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <span className="w-8 h-8 rounded-full bg-red-100 text-red-900 text-xs font-bold flex items-center justify-center shrink-0">
                4
              </span>
              <div>
                <h4 className="text-sm font-bold text-stone-900 mb-1">
                  Mencoblos di Bilik Suara
                </h4>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Gunakan alat coblos (paku dengan bantalan) yang disediakan. Coblos 1 kali pada nomor, foto, atau nama calon pilihan Anda.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <span className="w-8 h-8 rounded-full bg-red-100 text-red-900 text-xs font-bold flex items-center justify-center shrink-0">
                5
              </span>
              <div>
                <h4 className="text-sm font-bold text-stone-900 mb-1">
                  Memasukkan ke Kotak Suara
                </h4>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Lipat kembali surat suara sesuai lipatan semula, lalu masukkan ke dalam kotak suara yang sesuai dengan warnanya (dipandu KPPS 6).
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <span className="w-8 h-8 rounded-full bg-red-100 text-red-900 text-xs font-bold flex items-center justify-center shrink-0">
                6
              </span>
              <div>
                <h4 className="text-sm font-bold text-stone-900 mb-1">
                  Celup Tinta Pemilu
                </h4>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Celupkan salah satu jari tangan hingga mengenai kuku ke botol tinta ungu sebagai bukti sah telah menggunakan hak pilih.
                </p>
              </div>
            </div>
          </div>

          {/* Time Schedules */}
          <div className="mt-8 pt-6 border-t border-stone-200 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
              <span className="font-bold text-stone-900 block mb-1">Pemilih DPT (Terdaftar Tetap)</span>
              <p className="text-stone-600 font-mono">Pukul 07.00 - 13.00 Waktu Setempat</p>
            </div>
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
              <span className="font-bold text-stone-900 block mb-1">Pemilih DPTb (Pindah Memilih)</span>
              <p className="text-stone-600 font-mono">Pukul 11.00 - 13.00 Waktu Setempat</p>
            </div>
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
              <span className="font-bold text-stone-900 block mb-1">Pemilih DPK (Daftar Khusus e-KTP)</span>
              <p className="text-stone-600 font-mono">Pukul 12.00 - 13.00 Waktu Setempat</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
