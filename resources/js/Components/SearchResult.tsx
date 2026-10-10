import React from 'react';
import { CheckCircle2, AlertTriangle, ArrowLeft, Phone, Calendar, Sparkles, Share2, MapPin, Info } from 'lucide-react';
import { DptPublicResult, PilkadesConfig, TpsItem, getPhaseInfo } from '../types/pilkades';
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
  mascotSrc,
  tpsList
}) => {
  if (!result) return null;

  const matchingTps = tpsList?.find(
    t => t.tps.trim().toLowerCase() === String(result.tps || '').trim().toLowerCase() ||
         t.tps.replace(/\D/g, '') === String(result.tps || '').replace(/\D/g, '')
  );
  const phase = getPhaseInfo(config.dataPhase);

  return (
    <section id="hasil-pencarian" className="py-8 bg-transparent animate-in fade-in slide-in-from-bottom-3 duration-200">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {result.found ? (
          /* ================= DATA DITEMUKAN (DUOLINGO GREEN THEME) ================= */
          <div className="bg-white border-2 border-b-4 border-slate-200 rounded-3xl overflow-hidden shadow-sm">
            {/* Header Badge */}
            <div className="bg-[#58CC02] border-b-4 border-[#46A302] text-white p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-white/20 border-2 border-white/30 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-7 h-7 text-white" />
                </div>
                <div>
                  <span className="text-[11px] font-black uppercase tracking-wider text-green-100 block">
                    Status Verifikasi Resmi
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black tracking-tight">
                    DATA PEMILIH DITEMUKAN
                  </h3>
                </div>
              </div>

              <div className="px-3.5 py-1.5 bg-white text-[#46A302] rounded-xl text-xs font-black uppercase tracking-wider text-center shrink-0 shadow-xs">
                DPS PILKADES 2026
              </div>
            </div>

            {/* Core Details */}
            <div className="p-6 sm:p-8 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* No DPT */}
                <div className="p-4 rounded-2xl bg-[#EBF7FD] border-2 border-b-4 border-[#1CB0F6]/40">
                  <span className="text-[11px] font-black uppercase tracking-wider text-[#1899D6] block mb-1">
                    Nomor DPT
                  </span>
                  <p className="text-2xl font-black font-mono text-slate-900">
                    No. {result.no_dpt ? String(result.no_dpt) : '-'}
                  </p>
                  <span className="text-[10px] text-slate-500 font-medium">
                    Nomor urut resmi pemilih di DPS
                  </span>
                </div>

                {/* Nama */}
                <div className="p-4 rounded-2xl bg-slate-50 border-2 border-b-4 border-slate-200">
                  <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 block mb-1">
                    Nama Lengkap
                  </span>
                  <p className="text-xl font-black text-slate-900 truncate">
                    {result.nama}
                  </p>
                  <span className="text-[10px] text-slate-400 font-medium">
                    Sesuai dokumen kependudukan
                  </span>
                </div>

                {/* NIK Masked */}
                <div className="p-4 rounded-2xl bg-slate-50 border-2 border-b-4 border-slate-200">
                  <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 block mb-1">
                    Nomor Induk Kependudukan (NIK)
                  </span>
                  <p className="text-lg font-black tracking-wider text-[#1CB0F6]">
                    {result.nik_masked}
                  </p>
                  <span className="text-[10px] text-slate-400 font-medium">
                    Digit tengah disamarkan untuk privasi
                  </span>
                </div>
              </div>

              {/* Dusun, RT/RW, TPS, Status */}
              <div className="bg-slate-50 rounded-2xl border-2 border-slate-200 p-5 divide-y-2 divide-slate-200">
                <div className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Nomor Urut DPT:</span>
                  <span className="text-sm font-black font-mono text-[#1899D6]">
                    No. {result.no_dpt ? String(result.no_dpt) : '-'}
                  </span>
                </div>

                <div className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Alamat / Dusun:</span>
                  <span className="text-sm font-black text-slate-900">{result.dusun}</span>
                </div>

                <div className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">RT / RW:</span>
                  <span className="text-sm font-black text-slate-900">
                    RT {result.rt} / RW {result.rw}
                  </span>
                </div>

                <div className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Tempat Pemungutan Suara (TPS):</span>
                  <div className="text-left sm:text-right">
                    <span className="text-sm font-black text-white bg-[#1CB0F6] px-3 py-1 rounded-xl border-b-2 border-[#1899D6] inline-block">
                      {result.tps}
                    </span>
                    {matchingTps?.nama_lokasi && (
                      <span className="text-xs font-bold text-slate-700 mt-1 flex items-center gap-1 sm:justify-end">
                        <MapPin className="w-3.5 h-3.5 text-[#1CB0F6]" />
                        <span>{matchingTps.nama_lokasi}</span>
                      </span>
                    )}
                  </div>
                </div>

                <div className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Status Hak Pilih:</span>
                  <span className="text-xs font-black uppercase tracking-wider text-[#46A302] bg-[#E5F9D2] px-3 py-1 rounded-xl border border-[#58CC02]/40 inline-block w-fit">
                    TERDAFTAR DALAM DPS
                  </span>
                </div>
              </div>

              {/* Jadwal Pemungutan Suara Notice */}
              <div className="p-4 rounded-2xl bg-[#DDF4FF] border-2 border-[#1CB0F6]/40 text-xs sm:text-sm text-slate-700 flex items-start gap-3">
                <Calendar className="w-5 h-5 text-[#1CB0F6] shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold leading-relaxed text-slate-800">
                    Harap datang ke lokasi TPS pada hari pemungutan suara 09 November 2026 dengan membawa Undangan dari Panitia dan E-KTP Asli atau EKTP IKD.
                  </p>
                  <p className="text-xs text-[#1899D6] font-bold mt-1">
                    Jadwal Pemungutan Suara: <strong>{config.tanggal_pemungutan}</strong>
                  </p>
                </div>
              </div>

              {/* Sapaan Maskot */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[#E5F9D2]/50 border-2 border-[#58CC02]/30 flex items-center gap-4">
                <div className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 flex items-center justify-center">
                  <img
                    src={mascotSrc || DEFAULT_MASCOT_GLAWU}
                    alt={`Maskot ${config.mascot_name || 'Glawu'}`}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="text-left space-y-1">
                  <div className="flex items-center gap-1.5">
                    <span className="px-2.5 py-0.5 rounded-lg bg-[#58CC02] text-white text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      Pesan Dari {config.mascot_name || 'Glawu'}
                    </span>
                    <span className="text-xs font-bold text-[#46A302]">Mantap Sedulur!</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed">
                    Data hak suara Anda sudah tercatat di DPS. Jangan lupa hadir di <strong>{result.tps}</strong> pada hari pemilihan nanti!
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={onReset}
                  className="w-full sm:w-auto px-5 py-3.5 bg-white hover:bg-slate-50 text-slate-700 font-black rounded-2xl text-xs sm:text-sm uppercase tracking-wider transition-all border-2 border-b-4 border-slate-200 active:border-b-2 active:translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Cek NIK Lain</span>
                </button>

                <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(
                      `Halo, saya telah mengecek data DPS Pilkades Desa Gunungjaya 2026. Nama: ${result.nama} (No. DPT: ${result.no_dpt ? `#${result.no_dpt}` : '-'}) terdaftar di ${result.tps}, Dusun: ${result.dusun}. Ayo cek hak pilih Anda di portal resmi Pilkades Gunungjaya!`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto px-5 py-3.5 bg-[#58CC02] hover:bg-[#50b802] text-white font-black rounded-2xl text-xs sm:text-sm uppercase tracking-wider transition-all border-b-4 border-[#46A302] active:border-b-0 active:translate-y-1 flex items-center justify-center gap-2 shadow-sm"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>Bagikan ke WhatsApp</span>
                  </a>

                  <a
                    href={`https://wa.me/${(config.whatsapp_panitia || '').replace(/\D/g, '')}?text=${encodeURIComponent(
                      `Halo Panitia Pilkades Gunungjaya, saya ingin bertanya seputar data DPS: ${result.nama} (${result.nik_masked})`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto px-4 py-3.5 bg-[#1CB0F6] hover:bg-[#189ddb] text-white font-black rounded-2xl text-xs sm:text-sm uppercase tracking-wider transition-all border-b-4 border-[#1899D6] active:border-b-0 active:translate-y-1 flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <Phone className="w-4 h-4" />
                    <span>Tanya Panitia</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* ================= DATA TIDAK DITEMUKAN (DUOLINGO YELLOW / RED THEME) ================= */
          <div className="bg-white border-2 border-b-4 border-slate-200 rounded-3xl overflow-hidden shadow-sm">
            {/* Header Badge */}
            <div className="bg-[#FF9600] border-b-4 border-[#E07700] text-white p-5 sm:p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white/20 border-2 border-white/30 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-7 h-7 text-white" />
              </div>
              <div>
                <span className="text-[11px] font-black uppercase tracking-wider text-amber-100 block">
                  Hasil Pengecekan DPS
                </span>
                <h3 className="text-xl sm:text-2xl font-black tracking-tight">
                  DATA BELUM DITEMUKAN
                </h3>
              </div>
            </div>

            {/* Information */}
            <div className="p-6 sm:p-8 space-y-6">
              <div className="p-4 bg-[#FFF5D1] border-2 border-[#FFC800] rounded-2xl text-slate-800 text-sm leading-relaxed font-medium">
                <p className="font-extrabold text-[#E07700] mb-1">
                  NIK yang Anda masukkan belum tercatat dalam database DPS pada portal ini.
                </p>
                <p className="text-xs sm:text-sm text-slate-700">
                  Apabila Anda adalah warga Desa Gunungjaya yang memenuhi syarat sebagai pemilih namun belum terdaftar, Anda dapat mengajukan tanggapan masyarakat ke Panitia Pilkades.
                </p>
              </div>

              {/* Langkah Klarifikasi */}
              <div className="space-y-3">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-500">
                  Langkah yang Perlu Dilakukan:
                </h4>
                <ul className="space-y-2.5 text-xs sm:text-sm text-slate-700">
                  <li className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="w-6 h-6 rounded-lg bg-[#1CB0F6] text-white font-black text-xs flex items-center justify-center shrink-0">
                      1
                    </span>
                    <span>
                      Pastikan 16 digit NIK yang Anda masukkan sudah sama persis dengan e-KTP atau Kartu Keluarga asli.
                    </span>
                  </li>
                  <li className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="w-6 h-6 rounded-lg bg-[#58CC02] text-white font-black text-xs flex items-center justify-center shrink-0">
                      2
                    </span>
                    <span>
                      Pastikan syarat pemilih terpenuhi: warga Desa Gunungjaya, berusia minimal 17 tahun atau sudah/pernah kawin.
                    </span>
                  </li>
                  <li className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="w-6 h-6 rounded-lg bg-[#FF9600] text-white font-black text-xs flex items-center justify-center shrink-0">
                      3
                    </span>
                    <span>
                      Hubungi Sekretariat Panitia (P2KD) Gunungjaya dengan membawa e-KTP dan KK agar dimasukkan ke dalam daftar pemilih.
                    </span>
                  </li>
                </ul>
              </div>

              {/* Panduan Maskot */}
              <div className="p-4 rounded-2xl bg-[#DDF4FF] border-2 border-[#1CB0F6]/40 flex items-center gap-4">
                <div className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 flex items-center justify-center">
                  <img
                    src={mascotSrc || DEFAULT_MASCOT_GLAWU}
                    alt={`${config.mascot_name || 'GLAWU'} Panduan`}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="text-left space-y-1">
                  <div className="flex items-center gap-1.5">
                    <span className="px-2.5 py-0.5 rounded-lg bg-[#1CB0F6] text-white text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                      <Info className="w-3 h-3" />
                      Tips Dari {config.mascot_name || 'Glawu'}
                    </span>
                    <span className="text-xs font-bold text-[#1899D6]">Aja Kuwatir!</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed">
                    Tahapan data saat ini adalah <strong>{phase.fullName}</strong>{phase.code === 'DPS' ? ', sehingga masih terbuka masa tanggapan dan sanggahan masyarakat' : ''}. Silakan klik tombol di bawah untuk melapor kepada panitia!
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={onReset}
                  className="w-full sm:w-auto px-6 py-3.5 bg-white hover:bg-slate-50 text-slate-700 font-black rounded-2xl text-xs sm:text-sm uppercase tracking-wider transition-all border-2 border-b-4 border-slate-200 active:border-b-2 active:translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Cek NIK Lain</span>
                </button>

                <a
                  href={`https://wa.me/${(config.whatsapp_panitia || '').replace(/\D/g, '')}?text=${encodeURIComponent(
                    'Halo Panitia Pilkades Gunungjaya, NIK saya tidak ditemukan dalam pengecekan DPS online. Mohon bantuan konfirmasi data hak pilih saya.'
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-6 py-3.5 bg-[#58CC02] hover:bg-[#50b802] text-white font-black rounded-2xl text-xs sm:text-sm uppercase tracking-wider transition-all border-b-4 border-[#46A302] active:border-b-0 active:translate-y-1 flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                >
                  <Phone className="w-4 h-4" />
                  <span>Hubungi Panitia WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
