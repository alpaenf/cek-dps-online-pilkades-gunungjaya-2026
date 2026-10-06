import React, { useState } from 'react';
import {
  CheckCircle,
  MapPin,
  Printer,
  Share2,
  AlertCircle,
  Eye,
  EyeOff,
  Navigation,
  FileCheck,
  Check,
  ShieldCheck,
  Building,
  UserCheck
} from 'lucide-react';
import { VoterRecord } from '../data/dptDatabase';

interface VoterResultCardProps {
  voter: VoterRecord;
  onOpenMap: (voter: VoterRecord) => void;
  onOpenPrintSlip: (voter: VoterRecord) => void;
  onOpenReportModal: (voter?: VoterRecord) => void;
  onResetSearch: () => void;
}

export const VoterResultCard: React.FC<VoterResultCardProps> = ({
  voter,
  onOpenMap,
  onOpenPrintSlip,
  onOpenReportModal,
  onResetSearch,
}) => {
  const [showFullDetails, setShowFullDetails] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);

  // Mask name: e.g. "IR. BUDI SANTOSO" -> "IR. B*** S******"
  const maskName = (name: string) => {
    return name
      .split(' ')
      .map(part => {
        if (part.length <= 2) return part;
        return part[0] + '*'.repeat(Math.min(5, part.length - 1));
      })
      .join(' ');
  };

  // Mask NIK: e.g. "3171021508920004" -> "317102******0004"
  const maskNik = (nik: string) => {
    if (nik.length < 16) return nik;
    return `${nik.slice(0, 6)}******${nik.slice(12)}`;
  };

  const handleShare = () => {
    const text = `Verifikasi DPT KPU RI:\nNama: ${voter.name}\nStatus: Terdaftar dalam DPT\nTPS: ${voter.tpsNumber}\nLokasi: ${voter.tpsName}, ${voter.tpsAddress}\nKelurahan: ${voter.kelurahan}, Kecamatan: ${voter.kecamatan}, ${voter.kabupatenKota}, ${voter.provinsi}.\nCek DPT Anda di Portal Resmi KPU!`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2500);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 animate-in fade-in duration-300">
      <div className="bg-white rounded-2xl border-2 border-red-950/20 shadow-md overflow-hidden">
        {/* Certificate Header Bar */}
        <div className="bg-gradient-to-r from-red-950 via-red-900 to-stone-900 px-6 sm:px-8 py-5 text-white flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300">
              <CheckCircle className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs uppercase tracking-widest text-emerald-300 font-semibold block">
                Hasil Pencarian Data Pemilih
              </span>
              <h2 className="text-xl sm:text-2xl font-bold font-serif">
                Terdaftar Dalam Daftar Pemilih Tetap (DPT)
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono bg-white/10 px-3 py-1.5 rounded-lg border border-white/15">
            <span className="text-stone-300">ID Registrasi:</span>
            <span className="font-semibold text-amber-200">{voter.id}</span>
          </div>
        </div>

        {/* Primary Content Grid */}
        <div className="p-6 sm:p-8">
          {/* Main Top Spotlight: TPS Card & Voter Name */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-8 border-b border-stone-200">
            {/* Left Col: Voter Identity */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">
                  Data Identitas Pemilih
                </span>
                <button
                  type="button"
                  onClick={() => setShowFullDetails(!showFullDetails)}
                  className="flex items-center gap-1.5 text-xs text-red-900 font-semibold hover:underline"
                >
                  {showFullDetails ? (
                    <>
                      <EyeOff className="w-3.5 h-3.5" />
                      <span>Sembunyikan Privasi</span>
                    </>
                  ) : (
                    <>
                      <Eye className="w-3.5 h-3.5" />
                      <span>Tampilkan Nama Penuh</span>
                    </>
                  )}
                </button>
              </div>

              <div>
                <h3 className="text-2xl sm:text-3xl font-bold text-stone-900 font-serif">
                  {showFullDetails ? voter.name : maskName(voter.name)}
                </h3>
                <div className="flex flex-wrap items-center gap-3 text-sm text-stone-600 mt-2 font-mono">
                  <span>NIK: {showFullDetails ? voter.nik : maskNik(voter.nik)}</span>
                  {voter.passportNumber && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span>Paspor: {voter.passportNumber}</span>
                    </>
                  )}
                  <span aria-hidden="true">·</span>
                  <span>{voter.gender === 'L' ? 'Laki-Laki' : 'Perempuan'}</span>
                  <span aria-hidden="true">·</span>
                  <span>{voter.age} Tahun</span>
                </div>
              </div>

              {/* Status Chips */}
              <div className="flex flex-wrap items-center gap-2 pt-2 text-xs">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-800 font-medium rounded-md border border-emerald-200">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                  Hak Pilih Sah & Aktif
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-stone-100 text-stone-800 font-medium rounded-md border border-stone-200">
                  <UserCheck className="w-3.5 h-3.5 text-stone-700" />
                  Kategori: {voter.kategoriPemilih}
                </span>
                {voter.disabilityStatus && voter.disabilityStatus !== 'Tidak Ada' && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-900 font-medium rounded-md border border-amber-200">
                    Akses Khusus: {voter.disabilityStatus}
                  </span>
                )}
              </div>
            </div>

            {/* Right Col: Prominent TPS Badge Box */}
            <div className="lg:col-span-5 bg-red-50/70 border border-red-200 rounded-xl p-5 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-red-900 block mb-1">
                  Tempat Pemungutan Suara (TPS)
                </span>
                <div className="text-4xl font-extrabold text-red-950 font-serif tracking-tight mb-2">
                  {voter.tpsNumber}
                </div>
                <p className="text-sm font-semibold text-stone-900 mb-1">
                  {voter.tpsName}
                </p>
                <p className="text-xs text-stone-600 leading-relaxed">
                  {voter.tpsAddress}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-red-200/60 flex items-center justify-between">
                <span className="text-xs text-stone-500 font-mono">
                  Waktu Pemungutan: 07.00 - 13.00
                </span>
                <button
                  type="button"
                  onClick={() => onOpenMap(voter)}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-red-900 hover:text-red-950 transition-colors"
                >
                  <Navigation className="w-3.5 h-3.5 text-red-800" />
                  <span>Lihat di Peta</span>
                </button>
              </div>
            </div>
          </div>

          {/* Detailed Administrative Breakdown */}
          <div className="py-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 border-b border-stone-200">
            <div>
              <span className="text-xs font-semibold text-stone-500 block mb-1">
                Kelurahan / Desa & RT/RW
              </span>
              <p className="text-sm font-semibold text-stone-900">
                {voter.kelurahan}
              </p>
              <p className="text-xs text-stone-600 font-mono">
                RT {voter.rt} / RW {voter.rw}
              </p>
            </div>

            <div>
              <span className="text-xs font-semibold text-stone-500 block mb-1">
                Kecamatan / Distrik
              </span>
              <p className="text-sm font-semibold text-stone-900">
                {voter.kecamatan}
              </p>
              <p className="text-xs text-stone-600 font-mono">
                Kode Pos: {voter.kodePos}
              </p>
            </div>

            <div>
              <span className="text-xs font-semibold text-stone-500 block mb-1">
                Kabupaten / Kota & Provinsi
              </span>
              <p className="text-sm font-semibold text-stone-900">
                {voter.kabupatenKota}
              </p>
              <p className="text-xs text-stone-600">
                {voter.provinsi}
              </p>
            </div>

            <div>
              <span className="text-xs font-semibold text-stone-500 block mb-1">
                Daerah Pemilihan (Dapil)
              </span>
              <p className="text-sm font-semibold text-stone-900">
                DPR RI: {voter.dapilDprRi}
              </p>
              <p className="text-xs text-stone-600">
                DPRD Prov: {voter.dapilDprdProv}
              </p>
            </div>
          </div>

          {/* Action Ribbon */}
          <div className="pt-6 flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => onOpenMap(voter)}
                className="px-4 py-2.5 bg-red-900 hover:bg-red-800 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-sm transition-colors flex items-center gap-2"
              >
                <MapPin className="w-4 h-4" />
                <span>Petunjuk Rute ke TPS</span>
              </button>

              <button
                type="button"
                onClick={() => onOpenPrintSlip(voter)}
                className="px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs sm:text-sm font-semibold rounded-xl border border-stone-300 transition-colors flex items-center gap-2"
              >
                <Printer className="w-4 h-4 text-stone-700" />
                <span>Unduh / Cetak Bukti DPT</span>
              </button>

              <button
                type="button"
                onClick={handleShare}
                className="px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs sm:text-sm font-semibold rounded-xl border border-stone-300 transition-colors flex items-center gap-2"
              >
                {copiedShare ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span className="text-emerald-700">Tersalin ke Clipboard!</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-4 h-4 text-stone-700" />
                    <span>Bagikan Data TPS</span>
                  </>
                )}
              </button>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => onOpenReportModal(voter)}
                className="text-xs font-semibold text-stone-600 hover:text-red-900 flex items-center gap-1.5 transition-colors"
              >
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Data Keliru? Ajukan Koreksi</span>
              </button>

              <button
                type="button"
                onClick={onResetSearch}
                className="text-xs font-semibold text-stone-500 hover:text-stone-900 underline transition-colors"
              >
                Pencarian Baru
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
