import React, { useState } from 'react';
import { ChevronDown, Phone, Mail, MessageSquare, HelpCircle, ShieldCheck } from 'lucide-react';

interface FaqItem {
  q: string;
  a: string;
}

const FAQ_LIST: FaqItem[] = [
  {
    q: 'Bagaimana jika NIK saya tidak ditemukan dalam DPT Online?',
    a: 'Jika NIK tidak terdaftar, pertama pastikan kembali 16 digit angka yang Anda masukkan sesuai e-KTP atau Kartu Keluarga. Anda dapat melaporkan langsung melalui tombol "Lapor Belum Terdaftar" di portal ini atau datang langsung ke kantor Kelurahan/Desa menemui Panitia Pemungutan Suara (PPS). Selain itu, pada hari pemungutan suara, Anda tetap dapat mencoblos pada pukul 12.00 - 13.00 sebagai pemilih DPK (Daftar Pemilih Khusus) dengan menunjukkan e-KTP asli sesuai domisili.'
  },
  {
    q: 'Apakah bisa mencoblos jika e-KTP hilang atau belum dicetak?',
    a: 'Bisa. Pemilih dapat menggunakan Surat Keterangan Perekaman e-KTP (Suket) resmi yang diterbitkan oleh Dinas Kependudukan dan Pencatatan Sipil (Disdukcapil) setempat, atau menunjukkan Identitas Kependudukan Digital (IKD) aktif pada aplikasi resmi Kemendagri.'
  },
  {
    q: 'Dokumen apa saja yang harus dibawa saat datang ke TPS?',
    a: 'Pemilih yang terdaftar di DPT wajib membawa dua dokumen: (1) Formulir Model C.Pemberitahuan-KPU yang dibagikan oleh petugas KPPS sebelum hari pemungutan, dan (2) Kartu Tanda Penduduk Elektronik (e-KTP) asli atau Suket resmi.'
  },
  {
    q: 'Mengapa sebagian nama dan NIK disamarkan (sensor bintang)?',
    a: 'Penyensoran sebagian karakter nama dan digit NIK dilakukan untuk memenuhi amanat Undang-Undang Nomor 27 Tahun 2022 tentang Perlindungan Data Pribadi (UU PDP). Hal ini mencegah penyalahgunaan data kependudukan oleh pihak ketiga yang tidak bertanggung jawab.'
  },
  {
    q: 'Bagaimana fasilitas bagi pemilih disabilitas dan lansia di TPS?',
    a: 'KPU memastikan setiap TPS dibangun di lokasi yang datar dan mudah diakses kursi roda (bebas tangga curam). Tersedia surat suara bertulisan huruf Braille khusus Pemilu Presiden dan DPD bagi tuna netra, serta pemilih disabilitas berhak didampingi oleh keluarga atau petugas KPPS dengan mengisi Formulir Model C.Pendamping-KPU.'
  },
  {
    q: 'Kapan batas waktu pengurusan Formulir Pindah Memilih (A-Surat Pindah)?',
    a: 'Batas waktu pengurusan pindah memilih untuk alasan umum (tugas belajar, bekerja, pindah domisili) adalah paling lambat H-30 sebelum pemungutan suara. Sedangkan untuk 4 kondisi khusus (sakit/rawat inap, tertimpa bencana alam, tahanan rutan, dan bertugas saat hari pencoblosan) dapat dilayani hingga H-7 sebelum hari pemungutan suara.'
  }
];

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleAccordion = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq-section" className="py-16 bg-white border-t border-stone-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10 text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-red-900 block mb-1">
            Pertanyaan Umum & Bantuan
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-serif text-stone-900 mb-3">
            Pusat Informasi & Bantuan Pemilih
          </h2>
          <p className="text-stone-600 text-sm sm:text-base">
            Jawaban lengkap atas pertanyaan yang sering diajukan seputar data pemilih, hak suara, dan layanan kepemiluan KPU RI.
          </p>
        </div>

        {/* Accordions */}
        <div className="space-y-3 mb-12">
          {FAQ_LIST.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="border border-stone-200 rounded-xl overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => toggleAccordion(idx)}
                  className="w-full text-left p-5 bg-stone-50/50 hover:bg-stone-50 flex items-center justify-between gap-4 transition-colors"
                >
                  <span className="text-sm sm:text-base font-semibold text-stone-900">
                    {item.q}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-stone-500 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-red-900' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="p-5 bg-white border-t border-stone-200 text-xs sm:text-sm text-stone-600 leading-relaxed">
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Helpdesk Contact Banner */}
        <div className="bg-stone-50 rounded-2xl border border-stone-200 p-6 sm:p-8">
          <div className="text-center sm:text-left mb-6">
            <h3 className="text-lg font-bold text-stone-900 font-serif mb-1">
              Butuh Pendampingan Langsung dari Petugas KPU?
            </h3>
            <p className="text-xs sm:text-sm text-stone-600">
              Tim Helpdesk KPU RI siap melayani pengaduan dan verifikasi data pemilih setiap hari kerja (08.00 - 17.00 WIB).
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-4 bg-white rounded-xl border border-stone-200 flex items-center gap-3">
              <Phone className="w-5 h-5 text-red-900 shrink-0" />
              <div>
                <span className="text-stone-500 block">Call Center KPU</span>
                <span className="font-bold text-stone-900 font-mono">(021) 3193-7223</span>
              </div>
            </div>

            <div className="p-4 bg-white rounded-xl border border-stone-200 flex items-center gap-3">
              <MessageSquare className="w-5 h-5 text-emerald-700 shrink-0" />
              <div>
                <span className="text-stone-500 block">WhatsApp Helpdesk</span>
                <span className="font-bold text-stone-900 font-mono">0811-2024-KPU</span>
              </div>
            </div>

            <div className="p-4 bg-white rounded-xl border border-stone-200 flex items-center gap-3">
              <Mail className="w-5 h-5 text-amber-700 shrink-0" />
              <div>
                <span className="text-stone-500 block">Email Layanan DPT</span>
                <span className="font-bold text-stone-900 font-mono">dptonline@kpu.go.id</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
