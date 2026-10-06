import React from 'react';
import { CheckCircle2, AlertTriangle, ArrowLeft, Phone, Calendar, Sparkles, Share2 } from 'lucide-react';
import { DptPublicResult, PilkadesConfig, TpsItem } from '../types/pilkades';
import { DEFAULT_MASCOT_GLAWU, DEFAULT_MASCOT_GLAWU_GUIDE } from '../data/logoPresets';

interface SearchResultProps {
  result: DptPublicResult | null;
  onReset: () => void;
  config: PilkadesConfig;
  onContactClick: () => void;
  watermarkSrc?: string;
  mascotSrc?: string;
  tpsList?: TpsItem[];
}

export const SearchResult: React.FC<SearchResultProps> = ({
  result,
  onReset,
  config,
  watermarkSrc,
  mascotSrc,
  tpsList
}) => {
  if (!result) return null;

  const matchingTps = tpsList?.find(
    t => t.tps.trim().toLowerCase() === String(result.tps || '').trim().toLowerCase() ||
         t.tps.replace(/\D/g, '') === String(result.tps || '').replace(/\D/g, '')
  );

  return (
    <section id="hasil-pencarian" className="py-10 bg-transparent border-b border-slate-800 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {result.found ? (
          /* ================= DATA DITEMUKAN ================= */
          <div className="relative bg-slate-900/95 backdrop-blur-2xl rounded-2xl sm:rounded-3xl border-2 border-emerald-500/50 shadow-[0_25px_60px_rgba(0,0,0,0.9)] overflow-hidden">
            {/* Watermark Pengaman Hasil Verifikasi Resmi */}
            {watermarkSrc && (
              <div 
                className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden opacity-[0.07] z-0"
                aria-hidden="true"
              >
                <img
                  src={watermarkSrc}
                  alt=""
                  referrerPolicy="no-referrer"
                  className="w-80 sm:w-96 object-contain mix-blend-screen filter contrast-125 select-none"
                />
              </div>
            )}

            {/* Header Badge */}
            <div className="relative z-10 bg-gradient-to-r from-emerald-900 via-teal-900 to-emerald-950 text-white p-5 sm:p-6 text-center sm:text-left flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-emerald-500/30">
              <div className="flex items-center justify-center sm:justify-start gap-3">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-400/40 backdrop-blur-xs flex items-center justify-center shrink-0 shadow-inner">
                  <CheckCircle2 className="w-7 h-7 text-emerald-300" />
                </div>
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-widest text-emerald-300 block font-mono">
                    STATUS VERIFIKASI RESMI DPS
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black tracking-tight font-serif">
                    DATA PEMILIH DITEMUKAN ✓
                  </h3>
                </div>
              </div>

              <div className="inline-block px-3 py-1 bg-emerald-500/20 border border-emerald-400/30 rounded-full text-xs font-mono font-bold text-emerald-200 text-center">
                DPS PILKADES GUNUNGJAYA 2026
              </div>
            </div>

            {/* Core Details */}
            <div className="p-6 sm:p-8 space-y-6 relative z-10">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Nama */}
                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-700/80">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    Nama Lengkap
                  </span>
                  <p className="text-xl font-bold text-white font-serif">
                    {result.nama}
                  </p>
                </div>

                {/* NIK Masked */}
                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-700/80">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    Nomor Induk Kependudukan (NIK)
                  </span>
                  <p className="text-xl font-bold font-mono text-amber-400">
                    {result.nik_masked}
                  </p>
                  <span className="text-[10px] text-slate-400">
                    *Sebagian digit disamarkan sesuai UU Perlindungan Data Pribadi
                  </span>
                </div>
              </div>

              {/* Dusun, RT/RW, TPS, Status */}
              <div className="bg-slate-950/80 rounded-2xl border border-slate-700/80 p-5 divide-y divide-slate-800">
                <div className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <span className="text-xs font-semibold text-slate-400">Alamat / Dusun:</span>
                  <span className="text-sm font-bold text-white">{result.dusun}</span>
                </div>

                <div className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <span className="text-xs font-semibold text-slate-400">RT / RW:</span>
                  <span className="text-sm font-bold text-white">
                    RT {result.rt} / RW {result.rw}
                  </span>
                </div>

                <div className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <span className="text-xs font-semibold text-slate-400">Tempat Pemungutan Suara (TPS):</span>
                  <div className="text-left sm:text-right">
                    <span className="text-base font-extrabold text-amber-300 bg-amber-950/80 px-3 py-1 rounded-lg border border-amber-500/40 inline-block w-fit">
                      {result.tps}
                    </span>
                    {matchingTps?.nama_lokasi && (
                      <span className="text-xs font-semibold text-white block mt-1">
                        📍 {matchingTps.nama_lokasi}
                      </span>
                    )}
                  </div>
                </div>

                <div className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <span className="text-xs font-semibold text-slate-400">Status Hak Pilih:</span>
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-300 bg-emerald-950/80 px-2.5 py-1 rounded-md border border-emerald-500/40 inline-block w-fit">
                    TERDAFTAR DALAM DPS (Daftar Pemilih Sementara)
                  </span>
                </div>
              </div>

              {/* Jadwal Pemungutan Suara Notice */}
              <div className="p-4 rounded-xl bg-slate-950 border border-blue-500/30 text-xs sm:text-sm text-slate-200 flex items-start gap-3">
                <Calendar className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold leading-relaxed">
                    Silakan datang ke TPS sesuai jadwal pemungutan suara dengan membawa dokumen identitas (e-KTP / KK) asli.
                  </p>
                  <p className="text-xs text-amber-300 mt-1 font-mono">
                    Jadwal Pemungutan Suara: <strong>{config.tanggal_pemungutan}</strong>
                  </p>
                </div>
              </div>

              {/* Sapaan Maskot GLAWU: PNG transparan tanpa bingkai kotak */}
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-950/80 via-slate-950 to-teal-950/70 border border-emerald-500/40 flex items-center gap-4">
                <div className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 flex items-center justify-center">
                  <img
                    src={mascotSrc || DEFAULT_MASCOT_GLAWU}
                    alt="Maskot Glawu"
                    className="w-full h-full object-contain filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.85)]"
                  />
                </div>
                <div className="text-left space-y-1">
                  <div className="flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-slate-950 text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-slate-950" />
                      PESAN DARI GLAWU
                    </span>
                    <span className="text-xs font-semibold text-emerald-300 font-serif">“Mantap Sedulur!”</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-200 font-medium leading-relaxed">
                    Data hak suaramu sudah tercatat di DPS (Daftar Pemilih Sementara). Jangan lupa hadir di <strong>{result.tps}</strong> pada hari pemungutan suara!
                  </p>
                </div>
              </div>

              {/* Action Buttons: Bersih & Terfokus tanpa salin alamat atau petunjuk arah */}
              <div className="pt-2 flex flex-col sm:flex-row flex-wrap items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={onReset}
                  className="w-full sm:w-auto px-5 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs sm:text-sm font-bold transition-colors flex items-center justify-center gap-2 shadow-md border border-slate-700 cursor-pointer min-h-[44px]"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>CEK NIK LAIN</span>
                </button>

                <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(
                      `Halo, saya telah mengecek DPS (Daftar Pemilih Sementara) Pilkades Desa Gunungjaya 2026. Nama: ${result.nama} terdaftar di ${result.tps}, Dusun: ${result.dusun}. Ayo cek hak pilihmu juga di portal resmi Pilkades Gunungjaya!`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto px-5 py-3 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black rounded-xl text-xs sm:text-sm transition-colors flex items-center justify-center gap-2 shadow-md min-h-[44px]"
                  >
                    <Share2 className="w-4 h-4 text-slate-950" />
                    <span>Bagikan ke WhatsApp</span>
                  </a>

                  <a
                    href={`https://wa.me/${(config.whatsapp_panitia || '').replace(/\D/g, '')}?text=${encodeURIComponent(
                      `Halo Panitia Pilkades Gunungjaya, saya ingin menanyakan tentang data DPS (Daftar Pemilih Sementara): ${result.nama} (${result.nik_masked})`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto px-4 py-3 bg-slate-950 hover:bg-slate-900 text-emerald-400 rounded-xl text-xs sm:text-sm font-semibold transition-colors flex items-center justify-center gap-1.5 border border-emerald-500/40 min-h-[44px]"
                  >
                    <Phone className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Tanya Panitia</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* ================= DATA TIDAK DITEMUKAN ================= */
          <div className="bg-slate-900/95 backdrop-blur-2xl rounded-2xl sm:rounded-3xl border-2 border-amber-500/50 shadow-[0_25px_60px_rgba(0,0,0,0.9)] overflow-hidden">
            {/* Header Badge */}
            <div className="bg-gradient-to-r from-amber-900 via-amber-950 to-orange-950 text-white p-5 sm:p-6 text-center sm:text-left flex items-center gap-4 border-b border-amber-500/40">
              <div className="w-12 h-12 rounded-full bg-amber-500/20 border border-amber-400/40 backdrop-blur-xs flex items-center justify-center shrink-0">
                <AlertTriangle className="w-7 h-7 text-amber-300" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-widest text-amber-300 block font-mono">
                  HASIL PENGECEKAN DPS
                </span>
                <h3 className="text-xl sm:text-2xl font-black tracking-tight font-serif text-white">
                  DATA TIDAK DITEMUKAN
                </h3>
              </div>
            </div>

            {/* Information */}
            <div className="p-6 sm:p-8 space-y-6">
              <div className="p-4 bg-amber-950/50 border border-amber-600/40 rounded-xl text-slate-200 text-sm leading-relaxed">
                <p className="font-semibold text-amber-300 mb-1">
                  NIK yang Anda masukkan belum ditemukan dalam database DPS (Daftar Pemilih Sementara) yang tersedia pada website ini.
                </p>
                <p className="text-slate-300 text-xs sm:text-sm">
                  Jika Anda adalah warga Desa Gunungjaya yang telah memenuhi syarat sebagai pemilih namun belum tercantum, silakan menghubungi Panitia Pemilihan Kepala Desa (P2KD) Gunungjaya untuk tanggapan masyarakat atas DPS.
                </p>
              </div>

              {/* Langkah Klarifikasi */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 font-mono">
                  Langkah yang Dapat Anda Lakukan:
                </h4>
                <ul className="space-y-2 text-xs sm:text-sm text-slate-300">
                  <li className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-800 text-amber-400 border border-amber-500/30 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                      1
                    </span>
                    <span>
                      Pastikan 16 digit NIK yang Anda masukkan sudah sesuai dengan yang tertera di e-KTP atau Kartu Keluarga asli.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-800 text-amber-400 border border-amber-500/30 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                      2
                    </span>
                    <span>
                      Pastikan Anda memenuhi syarat pemilih (penduduk Desa Gunungjaya, berusia minimal 17 tahun atau sudah/pernah kawin).
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-800 text-amber-400 border border-amber-500/30 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                      3
                    </span>
                    <span>
                      Hubungi Sekretariat Panitia Pemilihan Kepala Desa (P2KD) Gunungjaya dengan membawa e-KTP dan KK untuk konfirmasi dan pendaftaran ke daftar pemilih.
                    </span>
                  </li>
                </ul>
              </div>

              {/* Panduan Glawu untuk Data Belum Terdaftar: PNG transparan tanpa bingkai kotak */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-950/70 via-slate-950 to-orange-950/70 border border-amber-500/40 flex items-center gap-4">
                <div className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 flex items-center justify-center">
                  <img
                    src={DEFAULT_MASCOT_GLAWU_GUIDE}
                    alt="GLAWU Panduan"
                    className="w-full h-full object-contain filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.85)]"
                  />
                </div>
                <div className="text-left space-y-1">
                  <div className="flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                      💡 TIPS DARI GLAWU
                    </span>
                    <span className="text-xs font-semibold text-amber-300 font-serif">“Aja Kuwatir!”</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-200 font-medium leading-relaxed">
                    Tahapan saat ini masih <strong>DPS (Daftar Pemilih Sementara)</strong>, sehingga masih ada kesempatan perbaikan dan tanggapan masyarakat. Klik tombol <strong>Hubungi Panitia</strong> di bawah ini agar dibantu oleh petugas P2KD!
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={onReset}
                  className="w-full sm:w-auto px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-sm font-bold transition-colors flex items-center justify-center gap-2 shadow-md border border-slate-700 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>CEK NIK LAIN</span>
                </button>

                <a
                  href={`https://wa.me/${(config.whatsapp_panitia || '').replace(/\D/g, '')}?text=${encodeURIComponent(
                    'Halo Panitia Pilkades Gunungjaya, NIK saya tidak ditemukan dalam pengecekan DPS (Daftar Pemilih Sementara) online. Mohon bantuan konfirmasi data hak pilih saya.'
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-sm font-bold transition-colors flex items-center justify-center gap-2 shadow-md cursor-pointer min-h-[44px]"
                >
                  <Phone className="w-4 h-4" />
                  <span>HUBUNGI PANITIA VIA WHATSAPP</span>
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
