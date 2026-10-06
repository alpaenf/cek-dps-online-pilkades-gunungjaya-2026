import React, { useState } from 'react';
import { FileText, Calendar, CheckCircle2, AlertCircle, Info, ArrowRight } from 'lucide-react';

export const PindahMemilihSection: React.FC = () => {
  const [selectedKondisi, setSelectedKondisi] = useState<'h30' | 'h7'>('h30');

  return (
    <section id="pindah-memilih" className="py-16 bg-white border-t border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10 text-center max-w-3xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-red-900 block mb-1">
            Layanan DPTb (Daftar Pemilih Tambahan)
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-serif text-stone-900 mb-3">
            Panduan Resmi Pengajuan Pindah Memilih
          </h2>
          <p className="text-stone-600 text-sm sm:text-base">
            Bagi pemilih yang telah terdaftar dalam DPT namun pada hari pemungutan suara tidak dapat menggunakan hak pilihnya di TPS asal karena alasan tertentu.
          </p>
        </div>

        {/* 3 Step Process Card */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="p-6 bg-stone-50 rounded-2xl border border-stone-200 flex flex-col justify-between">
            <div>
              <span className="w-8 h-8 rounded-lg bg-red-900 text-white text-sm font-bold flex items-center justify-center mb-4">
                01
              </span>
              <h3 className="text-base font-bold text-stone-900 mb-2">
                Pastikan Terdaftar di DPT
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                Gunakan formulir pencarian di atas untuk memastikan NIK Anda telah aktif terdaftar dalam DPT. Pindah memilih hanya berlaku bagi warga yang sudah ada dalam DPT.
              </p>
            </div>
            <div className="mt-4 pt-4 border-t border-stone-200 text-xs text-stone-500">
              Syarat Utama: KTP-el / KK
            </div>
          </div>

          <div className="p-6 bg-stone-50 rounded-2xl border border-stone-200 flex flex-col justify-between">
            <div>
              <span className="w-8 h-8 rounded-lg bg-red-900 text-white text-sm font-bold flex items-center justify-center mb-4">
                02
              </span>
              <h3 className="text-base font-bold text-stone-900 mb-2">
                Siapkan Dokumen Pendukung
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                Siapkan surat tugas dari pimpinan kerja, surat keterangan belajar dari universitas/sekolah, atau surat keterangan rawat inap dari rumah sakit/fasilitas medis.
              </p>
            </div>
            <div className="mt-4 pt-4 border-t border-stone-200 text-xs text-stone-500">
              Dokumen resmi bertanda tangan & stempel
            </div>
          </div>

          <div className="p-6 bg-stone-50 rounded-2xl border border-stone-200 flex flex-col justify-between">
            <div>
              <span className="w-8 h-8 rounded-lg bg-red-900 text-white text-sm font-bold flex items-center justify-center mb-4">
                03
              </span>
              <h3 className="text-base font-bold text-stone-900 mb-2">
                Datangi PPS / PPK / KPU Terdekat
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                Bawa berkas ke kantor kelurahan (PPS), kecamatan (PPK), atau KPU Kabupaten/Kota tujuan. Petugas akan menerbitkan <strong>Formulir Model A-Pindah Memilih</strong>.
              </p>
            </div>
            <div className="mt-4 pt-4 border-t border-stone-200 text-xs text-stone-500">
              Menerima alokasi TPS tujuan resmi
            </div>
          </div>
        </div>

        {/* 9 Legal Conditions with Tab Selector */}
        <div className="bg-stone-50 rounded-2xl border border-stone-200 p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-stone-200">
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-stone-900 font-serif">
                9 Alasan Sah Pindah Memilih Berdasarkan Peraturan KPU
              </h3>
              <p className="text-xs text-stone-500">
                Pahami batas waktu pelaporan agar permohonan pindah memilih Anda dapat diproses tepat waktu.
              </p>
            </div>

            <div className="flex items-center gap-1 p-1 bg-stone-200 rounded-lg shrink-0">
              <button
                type="button"
                onClick={() => setSelectedKondisi('h30')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                  selectedKondisi === 'h30'
                    ? 'bg-white text-red-950 shadow-xs'
                    : 'text-stone-700 hover:text-stone-950'
                }`}
              >
                Maksimal H-30 (Umum)
              </button>
              <button
                type="button"
                onClick={() => setSelectedKondisi('h7')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                  selectedKondisi === 'h7'
                    ? 'bg-white text-red-950 shadow-xs'
                    : 'text-stone-700 hover:text-stone-950'
                }`}
              >
                Maksimal H-7 (Kondisi Khusus)
              </button>
            </div>
          </div>

          {selectedKondisi === 'h30' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs text-stone-700">
              <div className="p-4 bg-white rounded-xl border border-stone-200">
                <span className="font-bold text-stone-900 block mb-1">1. Menjalankan Tugas Belajar</span>
                Pelajar / Mahasiswa yang menempuh pendidikan di luar daerah domisili e-KTP.
              </div>
              <div className="p-4 bg-white rounded-xl border border-stone-200">
                <span className="font-bold text-stone-900 block mb-1">2. Pindah Domisili</span>
                Pemilih yang berpindah alamat kependudukan ke kabupaten/kota lain.
              </div>
              <div className="p-4 bg-white rounded-xl border border-stone-200">
                <span className="font-bold text-stone-900 block mb-1">3. Bekerja di Luar Domisili</span>
                Karyawan/pekerja yang ditugaskan bekerja di luar wilayah tempat terdaftar.
              </div>
              <div className="p-4 bg-white rounded-xl border border-stone-200">
                <span className="font-bold text-stone-900 block mb-1">4. Menjalani Rehabilitasi Narkoba</span>
                Warga yang sedang menjalani program rehabilitasi di panti/fasilitas berizin.
              </div>
              <div className="p-4 bg-white rounded-xl border border-stone-200">
                <span className="font-bold text-stone-900 block mb-1">5. Penyandang Disabilitas di Panti</span>
                Pemilih disabilitas yang tinggal atau dirawat di panti sosial.
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-stone-700">
              <div className="p-4 bg-white rounded-xl border border-stone-200">
                <span className="font-bold text-stone-900 block mb-1">6. Bertugas Saat Hari Pemungutan</span>
                Petugas KPPS, saksi, pengawas, atau tenaga medis yang berdinas pada hari H pencoblosan.
              </div>
              <div className="p-4 bg-white rounded-xl border border-stone-200">
                <span className="font-bold text-stone-900 block mb-1">7. Rawat Inap Rumah Sakit</span>
                Pasien rawat inap di rumah sakit / klinik beserta keluarga pendamping.
              </div>
              <div className="p-4 bg-white rounded-xl border border-stone-200">
                <span className="font-bold text-stone-900 block mb-1">8. Tertimpa Bencana Alam</span>
                Pemilih di wilayah yang dilanda bencana alam darurat sehingga TPS asal relokasi.
              </div>
              <div className="p-4 bg-white rounded-xl border border-stone-200">
                <span className="font-bold text-stone-900 block mb-1">9. Menjalani Tahanan Lapas / Rutan</span>
                Warga binaan di rumah tahanan negara atau lembaga pemasyarakatan.
              </div>
            </div>
          )}

          {/* Important ballot paper entitlement notice */}
          <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start gap-3">
            <Info className="w-5 h-5 text-amber-800 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block mb-0.5">Catatan Hak Surat Suara Pindah Memilih:</span>
              Pemilih yang pindah memilih antar-provinsi hanya memperoleh 1 surat suara (Pemilu Presiden dan Wakil Presiden). Jika pindah dalam satu provinsi namun beda dapil DPR, akan mendapatkan surat suara Presiden dan DPD RI.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
