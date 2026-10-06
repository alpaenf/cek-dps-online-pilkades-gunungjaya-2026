import React, { useState } from 'react';
import { MessageSquare, MapPin, Phone, Send, CheckCircle2, ShieldCheck, Mail, Clock } from 'lucide-react';
import { PilkadesConfig } from '../types/pilkades';

interface ContactPanitiaProps {
  config: PilkadesConfig;
}

export const ContactPanitia: React.FC<ContactPanitiaProps> = ({ config }) => {
  const [nama, setNama] = useState('');
  const [nik, setNik] = useState('');
  const [pesan, setPesan] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);

  // Buat link WA langsung dengan nomor WhatsApp yang bersumber dari config (Google Sheets)
  const cleanPhone = config.whatsapp_panitia.replace(/\D/g, '');
  const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
    `Halo Panitia Pilkades Gunungjaya, saya ingin menanyakan status DPT / konfirmasi data pemilih.`
  )}`;

  const handleSendKlarifikasi = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    setTimeout(() => {
      setSubmitting(false);
      setSentSuccess(true);
      const detailWa = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
        `Halo Panitia Pilkades Gunungjaya,%0ANama: ${nama}%0ANIK: ${nik}%0AKeterangan: ${pesan}`
      )}`;
      // Safe navigation compliant with iFrame environment
      window.location.href = detailWa;
    }, 400);
  };

  return (
    <section id="hubungi-panitia" className="py-14 sm:py-20 bg-gradient-to-b from-black/60 via-slate-950/65 to-black/85 backdrop-blur-xs border-b border-white/10 text-slate-100 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-300 bg-amber-950/70 px-3.5 py-1 rounded-full border border-amber-500/40 inline-block mb-2 font-mono">
            LAYANAN PENGADUAN & INFORMASI
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-serif">
            Hubungi Panitia Pemilihan Kepala Desa Gunungjaya
          </h2>
          <p className="text-slate-300 text-sm sm:text-base mt-2">
            Jika NIK Anda belum terdaftar dalam DPT, terjadi kekeliruan data, atau membutuhkan pendampingan, silakan hubungi Sekretariat P2KD Gunungjaya.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Kolom Kiri: Informasi Sekretariat & Tombol WA Resmi */}
          <div className="lg:col-span-5 bg-slate-900/90 backdrop-blur-xl rounded-3xl border border-slate-800 p-6 sm:p-8 space-y-6 shadow-xl">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400 block mb-1 font-mono">
                SEKRETARIAT RESMI P2KD
              </span>
              <h3 className="text-xl font-bold text-white font-serif">
                {config.kontak_panitia}
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Kecamatan Belik · Kabupaten Pemalang · Jawa Tengah
              </p>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-slate-300">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-white block">Alamat Sekretariat:</span>
                  <p className="text-slate-400 leading-relaxed">{config.alamat_sekretariat}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-white block">WhatsApp Panitia:</span>
                  <p className="font-mono text-amber-300 font-bold">{config.whatsapp_panitia}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-white block">Jam Pelayanan Sekretariat:</span>
                  <p className="text-slate-400">Senin - Minggu: 08.00 - 16.00 WIB</p>
                </div>
              </div>
            </div>

            {/* Tombol CHAT WHATSAPP Langsung */}
            <div className="pt-2">
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-sm font-bold shadow-lg shadow-emerald-950/50 hover:shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <MessageSquare className="w-5 h-5" />
                <span>CHAT WHATSAPP</span>
              </a>
              <span className="text-[11px] text-slate-400 text-center block mt-2 font-mono">
                Nomor terhubung langsung ke kontak resmi panitia ({config.whatsapp_panitia})
              </span>
            </div>
          </div>

          {/* Kolom Kanan: Form Konfirmasi / Aduan Cepat */}
          <div className="lg:col-span-7 bg-slate-900/90 backdrop-blur-xl rounded-3xl border border-slate-800 p-6 sm:p-8 shadow-xl">
            <h3 className="text-lg font-bold text-white font-serif mb-2">
              Formulir Klarifikasi / Pengecekan Data Pemilih
            </h3>
            <p className="text-xs text-slate-400 mb-6">
              Kirimkan data Anda untuk dikonfirmasi langsung ke panitia via WhatsApp resmi.
            </p>

            {sentSuccess ? (
              <div className="p-6 bg-emerald-950/80 border border-emerald-500/40 rounded-2xl text-center space-y-3">
                <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                <h4 className="text-base font-bold text-white font-serif">
                  Pesan Telah Diteruskan ke WhatsApp Panitia
                </h4>
                <p className="text-xs text-slate-300 max-w-md mx-auto">
                  Silakan lanjutkan pengiriman pesan pada aplikasi WhatsApp yang terbuka untuk berinteraksi dengan petugas panitia.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSentSuccess(false);
                    setNama('');
                    setNik('');
                    setPesan('');
                  }}
                  className="px-4 py-2 bg-emerald-700 text-white text-xs font-bold rounded-xl hover:bg-emerald-600 transition cursor-pointer"
                >
                  Kirim Pesan Lain
                </button>
              </div>
            ) : (
              <form onSubmit={handleSendKlarifikasi} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      Nama Lengkap *
                    </label>
                    <input
                      type="text"
                      required
                      value={nama}
                      onChange={(e) => setNama(e.target.value)}
                      placeholder="Contoh: Budi Santoso"
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs sm:text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      16 Digit NIK *
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={16}
                      value={nik}
                      onChange={(e) => setNik(e.target.value.replace(/\D/g, ''))}
                      placeholder="Contoh: 3327..."
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs sm:text-sm font-mono text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Uraian Pertanyaan / Keterangan Masalah *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={pesan}
                    onChange={(e) => setPesan(e.target.value)}
                    placeholder="Contoh: NIK saya tidak ditemukan saat pengecekan online, padahal saya berdomisili di Dusun Krajan RT 01 / RW 02..."
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs sm:text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3 px-5 bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 rounded-xl text-xs sm:text-sm font-black shadow-lg shadow-amber-950/60 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Send className="w-4 h-4 text-slate-950" />
                    <span>{submitting ? 'Memproses...' : 'Kirim Konfirmasi ke WhatsApp Panitia'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
