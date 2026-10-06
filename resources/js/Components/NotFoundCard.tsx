import React from 'react';
import { AlertTriangle, FileText, UserPlus, HelpCircle, ArrowRight } from 'lucide-react';

interface NotFoundCardProps {
  searchedQuery: string;
  reason?: string;
  onOpenReportModal: () => void;
  onResetSearch: () => void;
}

export const NotFoundCard: React.FC<NotFoundCardProps> = ({
  searchedQuery,
  reason,
  onOpenReportModal,
  onResetSearch,
}) => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 animate-in fade-in duration-300">
      <div className="bg-white rounded-2xl border border-red-200 shadow-sm overflow-hidden">
        {/* Warning Banner */}
        <div className="bg-red-50 border-b border-red-100 p-6 flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-red-100 border border-red-200 flex items-center justify-center text-red-700 shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-red-900 block mb-1">
              Hasil Verifikasi KPU RI
            </span>
            <h3 className="text-xl font-bold text-stone-900 font-serif mb-1">
              Data Pemilih Tidak Ditemukan Dalam DPT
            </h3>
            <p className="text-sm text-stone-600">
              Pencarian untuk NIK / Identitas <span className="font-mono font-semibold text-stone-900">{searchedQuery}</span> belum tercatat dalam salinan Daftar Pemilih Tetap (DPT) saat ini.
            </p>
            {reason && (
              <p className="text-xs text-red-800 mt-2 font-medium bg-white/80 px-3 py-1.5 rounded-lg border border-red-200 inline-block">
                Keterangan: {reason}
              </p>
            )}
          </div>
        </div>

        {/* Actionable Guidance */}
        <div className="p-6 sm:p-8">
          <h4 className="text-sm font-bold uppercase tracking-wider text-stone-800 mb-4">
            Jangan Khawatir, Hak Suara Anda Tetap Dilindungi Undang-Undang:
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="p-4 bg-stone-50 rounded-xl border border-stone-200">
              <span className="w-6 h-6 rounded-full bg-red-900 text-white text-xs font-bold flex items-center justify-center mb-3">
                1
              </span>
              <h5 className="text-sm font-semibold text-stone-900 mb-1">Periksa Ulang NIK</h5>
              <p className="text-xs text-stone-600 leading-relaxed">
                Pastikan 16 digit angka yang Anda masukkan persis sesuai dengan yang tertera di e-KTP atau Kartu Keluarga (KK) terbaru.
              </p>
            </div>

            <div className="p-4 bg-stone-50 rounded-xl border border-stone-200">
              <span className="w-6 h-6 rounded-full bg-red-900 text-white text-xs font-bold flex items-center justify-center mb-3">
                2
              </span>
              <h5 className="text-sm font-semibold text-stone-900 mb-1">Datangi Kantor Kelurahan</h5>
              <p className="text-xs text-stone-600 leading-relaxed">
                Kunjungi Panitia Pemungutan Suara (PPS) di kantor kelurahan/desa domisili Anda dengan membawa e-KTP dan Kartu Keluarga asli.
              </p>
            </div>

            <div className="p-4 bg-stone-50 rounded-xl border border-stone-200">
              <span className="w-6 h-6 rounded-full bg-red-900 text-white text-xs font-bold flex items-center justify-center mb-3">
                3
              </span>
              <h5 className="text-sm font-semibold text-stone-900 mb-1">Gunakan Jalur DPK</h5>
              <p className="text-xs text-stone-600 leading-relaxed">
                Pemilih yang belum terdaftar di DPT tetap berhak mencoblos di TPS domisili pada pukul 12.00 - 13.00 dengan menunjukkan e-KTP asli.
              </p>
            </div>
          </div>

          {/* CTA Row */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-stone-200">
            <button
              type="button"
              onClick={onOpenReportModal}
              className="px-5 py-3 bg-red-900 hover:bg-red-800 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-sm transition-colors flex items-center gap-2"
            >
              <UserPlus className="w-4 h-4" />
              <span>Lapor Belum Terdaftar Secara Online</span>
            </button>

            <button
              type="button"
              onClick={onResetSearch}
              className="text-xs font-semibold text-stone-600 hover:text-stone-900 underline transition-colors"
            >
              Coba Cari Ulang dengan NIK Lain
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
