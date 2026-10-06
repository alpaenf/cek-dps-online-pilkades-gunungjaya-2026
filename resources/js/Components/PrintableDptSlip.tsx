import React from 'react';
import { X, Printer, ShieldCheck, QrCode } from 'lucide-react';
import { VoterRecord } from '../data/dptDatabase';
import crestImg from '../assets/images/kpu_official_crest_1790172519882.jpg';

interface PrintableDptSlipProps {
  voter: VoterRecord | null;
  onClose: () => void;
}

export const PrintableDptSlip: React.FC<PrintableDptSlipProps> = ({ voter, onClose }) => {
  if (!voter) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[95vh] overflow-y-auto shadow-2xl border border-stone-200">
        {/* Modal Controls (Hidden in Print) */}
        <div className="no-print p-4 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div className="flex items-center gap-2 text-xs font-semibold text-stone-700">
            <Printer className="w-4 h-4 text-red-900" />
            <span>Pratinjau Kartu Bukti Terdaftar DPT KPU RI</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-1.5 bg-red-900 hover:bg-red-800 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak / Simpan PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-stone-500 hover:text-stone-900 hover:bg-stone-200 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Paper Card Container */}
        <div className="p-8 print-card bg-white text-stone-900">
          {/* Official Letterhead Header */}
          <div className="flex items-center justify-between pb-6 border-b-2 border-stone-900">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-lg overflow-hidden border border-stone-200 flex items-center justify-center bg-stone-50 shrink-0">
                <img
                  src={crestImg}
                  alt="Lambang KPU RI"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h4 className="text-xs uppercase font-extrabold tracking-widest text-red-900 font-sans">
                  KOMISI PEMILIHAN UMUM REPUBLIK INDONESIA
                </h4>
                <h2 className="text-lg sm:text-xl font-bold font-serif text-stone-900">
                  BUKTI TERDAFTAR DAFTAR PEMILIH TETAP (DPT)
                </h2>
                <p className="text-xs text-stone-500 font-mono">
                  SISTEM INFORMASI DATA PEMILIH (SIDALIH) NASIONAL
                </p>
              </div>
            </div>

            {/* Official QR Code Box */}
            <div className="hidden sm:flex flex-col items-center justify-center p-2 border border-stone-300 rounded-lg bg-stone-50 text-center shrink-0">
              <QrCode className="w-12 h-12 text-stone-800 mb-1" />
              <span className="text-[10px] font-mono text-stone-500">VERIFIKASI RESMI</span>
            </div>
          </div>

          {/* Registration Number Strip */}
          <div className="py-4 my-4 bg-stone-50 border-y border-stone-200 flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
            <div>
              <span className="text-stone-500">Nomor Registrasi DPT: </span>
              <span className="font-bold text-stone-900">{voter.id}</span>
            </div>
            <div>
              <span className="text-stone-500">Tanggal Sinkronisasi: </span>
              <span className="font-semibold text-stone-900">{voter.updatedAt}</span>
            </div>
          </div>

          {/* Core Voter Info Table */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-3.5 bg-stone-50/70 border border-stone-200 rounded-lg">
                <span className="text-[11px] uppercase tracking-wider text-stone-500 font-bold block mb-1">
                  Nama Lengkap Pemilih
                </span>
                <p className="text-base font-bold text-stone-900 font-serif">
                  {voter.name}
                </p>
                <p className="text-xs text-stone-600 font-mono mt-1">
                  NIK: {voter.nik}
                </p>
              </div>

              <div className="p-3.5 bg-red-50/50 border border-red-200 rounded-lg">
                <span className="text-[11px] uppercase tracking-wider text-red-900 font-bold block mb-1">
                  Tempat Pemungutan Suara (TPS)
                </span>
                <p className="text-xl font-extrabold text-red-950 font-serif">
                  {voter.tpsNumber}
                </p>
                <p className="text-xs font-semibold text-stone-800">
                  {voter.tpsName}
                </p>
              </div>
            </div>

            {/* Address Details */}
            <table className="w-full text-xs text-stone-800 border-collapse border border-stone-200">
              <tbody>
                <tr className="border-b border-stone-200">
                  <td className="py-2 px-3 font-semibold bg-stone-50 w-1/3 border-r border-stone-200">Alamat TPS</td>
                  <td className="py-2 px-3">{voter.tpsAddress}</td>
                </tr>
                <tr className="border-b border-stone-200">
                  <td className="py-2 px-3 font-semibold bg-stone-50 border-r border-stone-200">Rukun Tetangga / Rukun Warga</td>
                  <td className="py-2 px-3">RT {voter.rt} / RW {voter.rw}</td>
                </tr>
                <tr className="border-b border-stone-200">
                  <td className="py-2 px-3 font-semibold bg-stone-50 border-r border-stone-200">Kelurahan / Desa</td>
                  <td className="py-2 px-3">{voter.kelurahan}</td>
                </tr>
                <tr className="border-b border-stone-200">
                  <td className="py-2 px-3 font-semibold bg-stone-50 border-r border-stone-200">Kecamatan</td>
                  <td className="py-2 px-3">{voter.kecamatan}</td>
                </tr>
                <tr className="border-b border-stone-200">
                  <td className="py-2 px-3 font-semibold bg-stone-50 border-r border-stone-200">Kabupaten / Kota</td>
                  <td className="py-2 px-3">{voter.kabupatenKota}</td>
                </tr>
                <tr className="border-b border-stone-200">
                  <td className="py-2 px-3 font-semibold bg-stone-50 border-r border-stone-200">Provinsi & Kode Pos</td>
                  <td className="py-2 px-3">{voter.provinsi} ({voter.kodePos})</td>
                </tr>
                <tr className="border-b border-stone-200">
                  <td className="py-2 px-3 font-semibold bg-stone-50 border-r border-stone-200">Daerah Pemilihan DPR RI</td>
                  <td className="py-2 px-3 font-bold">{voter.dapilDprRi}</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-semibold bg-stone-50 border-r border-stone-200">Daerah Pemilihan DPRD Prov</td>
                  <td className="py-2 px-3 font-bold">{voter.dapilDprdProv}</td>
                </tr>
              </tbody>
            </table>

            {/* Note & Official Stamp Simulation */}
            <div className="pt-4 flex items-center justify-between text-xs text-stone-500">
              <div className="max-w-md">
                <p className="font-semibold text-stone-700 mb-1">Catatan Penting Pemilih:</p>
                <ul className="list-disc pl-4 space-y-0.5 text-[11px]">
                  <li>Bawa e-KTP / Suket asli dan Formulir C.Pemberitahuan ke TPS.</li>
                  <li>Pemungutan suara berlangsung pukul 07.00 - 13.00 waktu setempat.</li>
                  <li>Surat bukti ini adalah dokumen sah verifikasi daring DPT KPU RI.</li>
                </ul>
              </div>

              <div className="text-center p-3 border border-emerald-600/30 rounded-lg bg-emerald-50/50">
                <ShieldCheck className="w-8 h-8 text-emerald-700 mx-auto mb-1" />
                <span className="text-[10px] font-bold text-emerald-900 block uppercase">
                  TERVERIFIKASI SAH
                </span>
                <span className="text-[9px] text-emerald-700">KPU REPUBLIK INDONESIA</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer actions (no-print) */}
        <div className="no-print p-4 border-t border-stone-200 bg-stone-50 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-stone-700 hover:text-stone-950 transition-colors"
          >
            Tutup
          </button>
          <button
            onClick={handlePrint}
            className="px-5 py-2.5 bg-red-900 hover:bg-red-800 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-sm transition-colors flex items-center gap-2"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak Dokumen Ini</span>
          </button>
        </div>
      </div>
    </div>
  );
};
