import React, { useState } from 'react';
import { X, CheckCircle, Upload, AlertCircle, FileText, Copy, Check, Send } from 'lucide-react';
import { VoterRecord } from '../data/dptDatabase';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  prefillVoter?: VoterRecord | null;
  initialNik?: string;
}

export const ReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  onClose,
  prefillVoter,
  initialNik,
}) => {
  const [nama, setNama] = useState(prefillVoter?.name || '');
  const [nik, setNik] = useState(prefillVoter?.nik || initialNik || '');
  const [wa, setWa] = useState('');
  const [kategori, setKategori] = useState<'BELUM_TERDAFTAR' | 'PINDAH_DOMISILI' | 'MENINGGAL_DUNIA' | 'DATA_GANDA' | 'KOREKSI_DATA'>('BELUM_TERDAFTAR');
  const [deskripsi, setDeskripsi] = useState('');
  const [fileName, setFileName] = useState<string | null>(null);
  const [ticketId, setTicketId] = useState<string | null>(null);
  const [copiedTicket, setCopiedTicket] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      const randomNum = Math.floor(10000 + Math.random() * 90000);
      setTicketId(`KPU-ADU-2026-${randomNum}`);
    }, 700);
  };

  const handleCopyTicket = () => {
    if (ticketId && navigator.clipboard) {
      navigator.clipboard.writeText(ticketId);
      setCopiedTicket(true);
      setTimeout(() => setCopiedTicket(false), 2000);
    }
  };

  const handleReset = () => {
    setTicketId(null);
    setNama('');
    setNik('');
    setWa('');
    setDeskripsi('');
    setFileName(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-stone-200">
        {/* Header */}
        <div className="p-6 border-b border-stone-200 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur z-10">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-red-900 block mb-0.5">
              Kanal Pelayanan Resmi
            </span>
            <h3 className="text-xl font-bold text-stone-900 font-serif">
              Formulir Tanggapan & Aduan DPT KPU RI
            </h3>
          </div>
          <button
            onClick={handleReset}
            className="p-2 rounded-lg text-stone-500 hover:text-stone-900 hover:bg-stone-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {ticketId ? (
            /* Success State */
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h4 className="text-2xl font-bold text-stone-900 font-serif">
                Laporan Berhasil Diajukan
              </h4>
              <p className="text-sm text-stone-600 max-w-md mx-auto">
                Pengaduan Anda telah diteruskan secara otomatis ke Panitia Pemungutan Suara (PPS) dan KPU Kabupaten/Kota terkait untuk proses audit verifikasi faktual.
              </p>

              <div className="p-4 bg-stone-50 border border-stone-200 rounded-xl max-w-sm mx-auto my-4 text-left">
                <span className="text-xs font-bold uppercase tracking-wider text-stone-500 block mb-1">
                  Nomor Tiket Aduan Anda
                </span>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-lg font-mono font-bold text-red-950">{ticketId}</span>
                  <button
                    type="button"
                    onClick={handleCopyTicket}
                    className="p-1.5 rounded bg-white hover:bg-stone-100 border border-stone-300 text-xs font-semibold text-stone-700 transition-colors flex items-center gap-1"
                  >
                    {copiedTicket ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-700">Tersalin</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Salin</span>
                      </>
                    )}
                  </button>
                </div>
                <p className="text-[11px] text-stone-500 mt-2">
                  Simpan nomor ini untuk pengecekan berkala status aduan melalui layanan WhatsApp Helpdesk KPU RI.
                </p>
              </div>

              <div className="pt-4">
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-6 py-2.5 bg-red-900 hover:bg-red-800 text-white text-xs sm:text-sm font-semibold rounded-xl transition-colors"
                >
                  Selesai & Tutup
                </button>
              </div>
            </div>
          ) : (
            /* Form */
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <span>
                  Pastikan data yang dilaporkan disertai keterangan dan identitas yang valid untuk mempermudah petugas PPS dalam melakukan pencocokan dan penelitian data.
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Kategori Pengaduan / Tanggapan *
                </label>
                <select
                  value={kategori}
                  onChange={(e) => setKategori(e.target.value as any)}
                  className="w-full px-3 py-2.5 bg-stone-50 border border-stone-300 rounded-lg text-sm text-stone-900 focus:ring-2 focus:ring-red-900 focus:outline-none"
                >
                  <option value="BELUM_TERDAFTAR">Belum Terdaftar dalam DPT</option>
                  <option value="PINDAH_DOMISILI">Pindah Domisili / Pindah Tempat Tinggal</option>
                  <option value="KOREKSI_DATA">Kesalahan Penulisan Nama / NIK / TPS</option>
                  <option value="MENINGGAL_DUNIA">Pemilih Sudah Meninggal Dunia (TMS)</option>
                  <option value="DATA_GANDA">Terdaftar Ganda di Dua Lokasi TPS</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Nama Lengkap Pemilih *
                  </label>
                  <input
                    type="text"
                    required
                    value={nama}
                    onChange={(e) => setNama(e.target.value)}
                    placeholder="Sesuai KTP-el"
                    className="w-full px-3 py-2.5 bg-stone-50 border border-stone-300 rounded-lg text-sm text-stone-900 focus:ring-2 focus:ring-red-900 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    NIK Pemilih (16 Digit) *
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={16}
                    value={nik}
                    onChange={(e) => setNik(e.target.value.replace(/\D/g, ''))}
                    placeholder="Contoh: 3171..."
                    className="w-full px-3 py-2.5 bg-stone-50 border border-stone-300 rounded-lg text-sm font-mono text-stone-900 focus:ring-2 focus:ring-red-900 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Nomor WhatsApp Aktif *
                </label>
                <input
                  type="tel"
                  required
                  value={wa}
                  onChange={(e) => setWa(e.target.value)}
                  placeholder="Contoh: 081234567890 (Untuk konfirmasi petugas)"
                  className="w-full px-3 py-2.5 bg-stone-50 border border-stone-300 rounded-lg text-sm text-stone-900 focus:ring-2 focus:ring-red-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Uraian / Keterangan Lengkap *
                </label>
                <textarea
                  rows={3}
                  required
                  value={deskripsi}
                  onChange={(e) => setDeskripsi(e.target.value)}
                  placeholder="Jelaskan kendala Anda, misalnya alamat domisili sekarang, RT/RW tujuan, atau nomor TPS yang diharapkan..."
                  className="w-full px-3 py-2.5 bg-stone-50 border border-stone-300 rounded-lg text-sm text-stone-900 focus:ring-2 focus:ring-red-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Unggah Dokumen Pendukung (Foto KTP-el / Kartu Keluarga)
                </label>
                <div className="border-2 border-dashed border-stone-300 rounded-xl p-4 text-center bg-stone-50/50 hover:bg-stone-50 transition-colors cursor-pointer relative">
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setFileName(e.target.files[0].name);
                      }
                    }}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <Upload className="w-6 h-6 text-stone-400 mx-auto mb-1.5" />
                  <p className="text-xs font-medium text-stone-700">
                    {fileName ? (
                      <span className="text-red-900 font-semibold">{fileName}</span>
                    ) : (
                      'Klik untuk memilih file foto KTP-el / KK (JPG, PNG, atau PDF)'
                    )}
                  </p>
                  <p className="text-[11px] text-stone-500 mt-1">Maksimum ukuran file: 5 MB</p>
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-stone-200">
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-4 py-2.5 text-xs font-semibold text-stone-700 hover:text-stone-950 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 bg-red-900 hover:bg-red-800 disabled:bg-stone-400 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-sm transition-colors flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? 'Mengirim Aduan...' : 'Kirim Tanggapan ke KPU'}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
