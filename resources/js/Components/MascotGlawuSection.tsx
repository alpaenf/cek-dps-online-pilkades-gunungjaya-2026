import React, { useState } from 'react';
import { Heart, Sparkles, Shield, CheckCircle2, Award, Megaphone, Share2, HelpCircle, ChevronRight, MessageSquareQuote, Edit3, RefreshCw } from 'lucide-react';
import { DEFAULT_MASCOT_GLAWU, DEFAULT_MASCOT_GLAWU_GUIDE } from '../data/logoPresets';
import { PilkadesConfig } from '../types/pilkades';

interface MascotGlawuSectionProps {
  config: PilkadesConfig;
  onScrollToSearch: () => void;
  mascotSrc?: string;
  isAdmin?: boolean;
  onOpenMascotModal?: () => void;
}

export const MascotGlawuSection: React.FC<MascotGlawuSectionProps> = ({
  config,
  onScrollToSearch,
  mascotSrc,
  isAdmin = false,
  onOpenMascotModal
}) => {
  const [activeTab, setActiveTab] = useState<'filosofi' | 'pesan' | 'fakta'>('filosofi');
  const [cheerCount, setCheerCount] = useState(148);
  const [hasCheered, setHasCheered] = useState(false);

  const phaseName = config.dataPhase || 'DPS';
  const votingTime = config.votingHours || '07.00 - 13.00 WIB';

  const speeches = [
    `“Sugeng rawuh sedulur sedaya! Aja lali cek ${phaseName}-mu ya, sak swaramu nemtokake masa depan Desa Gunungjaya!”`,
    '“Beda pilihan kuwi lumrah lan wajar, sing penting paseduluran lan keguyuban tetep dijaga!”',
    '“Tolak Serangan Fajar & Politik Uang! Pilih pemimpin nganggo ati nurani sing resik.”',
    `“Tanggal pencoblosan teka gasik neng TPS jam ${votingTime}, nggawa e-KTP ya Lur!”`
  ];

  const [activeSpeech, setActiveSpeech] = useState(speeches[0]);

  const handleCheer = () => {
    if (!hasCheered) {
      setCheerCount(prev => prev + 1);
      setHasCheered(true);
    }
  };

  const handleRandomQuote = () => {
    const nextIdx = Math.floor(Math.random() * speeches.length);
    setActiveSpeech(speeches[nextIdx]);
  };

  return (
    <section id="maskot-glawu" className="py-14 sm:py-20 bg-gradient-to-b from-black/60 via-slate-950/60 to-black/75 backdrop-blur-xs border-b border-white/10 relative overflow-hidden text-slate-100">
      {/* Decorative ambient glossy lights */}
      <div className="absolute top-0 right-0 -mt-16 -mr-16 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -mb-16 -ml-16 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-amber-950/70 text-amber-300 border border-amber-500/40 rounded-full text-xs font-extrabold tracking-wide uppercase shadow-md mb-3 font-mono">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" style={{ animationDuration: '4s' }} />
            <span>IKON SEMANGAT DEMOKRASI DESA</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight font-serif">
            Kenalkan, <span className="text-amber-400">“GLAWU”</span> Maskot Resmi Pilkades Gunungjaya 2026
          </h2>
          <p className="mt-3 text-slate-300 text-sm sm:text-base leading-relaxed">
            Karakter sahabat pemilih yang ceria, berwibawa, dan sarat kearifan lokal. GLAWU hadir mengajak seluruh warga Desa Gunungjaya mewujudkan Pilkades yang aman, damai, bermartabat, dan tanpa politik uang.
          </p>
        </div>

        {/* Main Grid: Visual Mascot on Left, Meaning & Interactive Tabs on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Col 1: Mascot Showcase Card (5 cols) */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="w-full max-w-md bg-gradient-to-b from-slate-900/90 via-slate-950/90 to-black/95 backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-[0_25px_60px_rgba(0,0,0,0.9),inset_0_1px_1px_rgba(255,255,255,0.18)] border border-white/15 relative overflow-hidden group">
              {/* Badge Corner */}
              <div className="absolute top-4 right-4 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 text-[11px] font-black px-3 py-1 rounded-full shadow-md flex items-center gap-1.5 z-20">
                <Award className="w-3.5 h-3.5" />
                <span>Maskot Resmi 2026</span>
              </div>

              {/* Character Visual Frame */}
              <div className="relative rounded-2xl bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 p-4 border border-sky-500/30 flex items-center justify-center overflow-hidden">
                <img
                  src={mascotSrc || DEFAULT_MASCOT_GLAWU}
                  alt="GLAWU - Maskot Resmi Pilkades Gunungjaya"
                  className="w-64 sm:w-72 h-64 sm:h-72 object-contain drop-shadow-[0_15px_25px_rgba(0,0,0,0.8)] transition-transform duration-500 group-hover:scale-105"
                />

                {/* Floating Tag */}
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/90 backdrop-blur-xs text-amber-300 text-xs font-semibold px-4 py-1.5 rounded-full shadow-md whitespace-nowrap border border-amber-500/40 font-mono flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Burung Khas Lereng Gunung Slamet
                </div>
              </div>

              {/* Dynamic Speech Bubble */}
              <div className="mt-5 p-4 rounded-2xl bg-slate-950/90 border border-sky-500/30 text-slate-200 text-xs sm:text-sm relative">
                <div className="absolute -top-2 left-8 w-4 h-4 bg-slate-950 border-t border-l border-sky-500/30 transform rotate-45" />
                <div className="flex items-start gap-2.5">
                  <MessageSquareQuote className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
                  <div className="space-y-2">
                    <p className="italic font-medium text-slate-200 leading-relaxed font-serif">
                      {activeSpeech}
                    </p>
                    <button
                      type="button"
                      onClick={handleRandomQuote}
                      className="text-[11px] font-bold text-amber-400 hover:text-amber-300 underline flex items-center gap-1.5 cursor-pointer font-mono"
                    >
                      <RefreshCw className="w-3 h-3 text-amber-400" />
                      <span>Ganti Nasehat Glawu</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Cheer Interaction */}
              <div className="mt-5 pt-4 border-t border-slate-800 flex items-center justify-between">
                <div className="text-left">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block font-mono">
                    Dukungan Warga
                  </span>
                  <span className="text-base font-extrabold text-amber-400 font-mono">
                    {cheerCount} Semangat
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleCheer}
                  disabled={hasCheered}
                  className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-md ${
                    hasCheered
                      ? 'bg-rose-950/70 text-rose-300 border border-rose-500/40 cursor-default'
                      : 'bg-rose-600 hover:bg-rose-500 text-white cursor-pointer active:scale-95'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${hasCheered ? 'fill-rose-400 text-rose-400' : ''}`} />
                  <span>{hasCheered ? 'Dukungan Terkirim!' : 'Dukung Glawu'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Col 2: Tabs of Meaning, Values & Village Call to Action (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Tab navigation */}
            <div className="flex p-1.5 bg-slate-950/90 border border-slate-800 rounded-2xl shadow-inner gap-1">
              <button
                type="button"
                onClick={() => setActiveTab('filosofi')}
                className={`flex-1 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                  activeTab === 'filosofi'
                    ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                    : 'text-slate-300 hover:text-white hover:bg-slate-850'
                }`}
              >
                <Award className="w-4 h-4" />
                <span>Filosofi & Makna</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('pesan')}
                className={`flex-1 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                  activeTab === 'pesan'
                    ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                    : 'text-slate-300 hover:text-white hover:bg-slate-850'
                }`}
              >
                <Megaphone className="w-4 h-4" />
                <span>4 Ajakan Glawu</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('fakta')}
                className={`flex-1 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                  activeTab === 'fakta'
                    ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                    : 'text-slate-300 hover:text-white hover:bg-slate-850'
                }`}
              >
                <Shield className="w-4 h-4" />
                <span>Tata Nilai Pilkades</span>
              </button>
            </div>

            {/* Tab 1: Filosofi & Karakter */}
            {activeTab === 'filosofi' && (
              <div className="bg-slate-900/90 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-slate-700/80 shadow-2xl space-y-4 animate-in fade-in">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center justify-center font-bold text-lg">
                    <Sparkles className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white font-serif">
                      Makna Simbolik Maskot GLAWU
                    </h3>
                    <p className="text-xs text-slate-400">
                      Representasi jati diri masyarakat Desa Gunungjaya, Kecamatan Belik, Kabupaten Pemalang
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                  <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800">
                    <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider mb-1 flex items-center gap-1.5 font-mono">
                      <span className="w-2 h-2 rounded-full bg-amber-400" />
                      Burung Biru Lereng Slamet
                    </h4>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Melambangkan kecerdasan, ketajaman visi, ketangguhan, dan suara lantang warga desa dalam menyuarakan aspirasi pembangunan bersama.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800">
                    <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider mb-1 flex items-center gap-1.5 font-mono">
                      <span className="w-2 h-2 rounded-full bg-amber-400" />
                      Blangkon & Surjan Lurik
                    </h4>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Wujud penghormatan terhadap adat istiadat Jawa Tengah, kesantunan bertutur kata, serta kerendahan hati dalam kepemimpinan desa.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800">
                    <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider mb-1 flex items-center gap-1.5 font-mono">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      Sayap Mengajak & Surat Suara
                    </h4>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Simbol ajakan ramah agar warga aktif menggunakan hak pilihnya secara mandiri, berdaulat, dan bebas dari paksaan pihak manapun.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800">
                    <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider mb-1 flex items-center gap-1.5 font-mono">
                      <span className="w-2 h-2 rounded-full bg-sky-400" />
                      Ekspresi Ceria & Ramah
                    </h4>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Menegaskan bahwa Pilkades adalah pesta rakyat yang membahagiakan, menjalin kerukunan antar RT/RW, dan merajut persatuan desa.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-950 to-slate-900 border border-amber-500/40 text-white flex flex-col sm:flex-row items-center justify-between gap-3 mt-4">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400 block font-mono">
                      SLOGAN PILKADES GUNUNGJAYA 2026
                    </span>
                    <p className="text-sm font-bold font-serif text-white">
                      “Gunungjaya Guyub Rukun, Sukseskan Pilkades Bersama Glawu!”
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={onScrollToSearch}
                    className="px-4 py-2 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black rounded-xl text-xs whitespace-nowrap shadow-md transition cursor-pointer"
                  >
                    Cek Status DPT Anda →
                  </button>
                </div>
              </div>
            )}

            {/* Tab 2: 4 Ajakan Penting Glawu */}
            {activeTab === 'pesan' && (
              <div className="bg-slate-900/90 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-slate-700/80 shadow-2xl space-y-4 animate-in fade-in">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center justify-center font-bold text-lg">
                    <Megaphone className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white font-serif">
                      4 Ajakan Penting Glawu untuk Pemilih
                    </h3>
                    <p className="text-xs text-slate-400">
                      Pedomani imbauan ini agar hak suaramu terlindungi dengan sah dan sempurna
                    </p>
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800">
                    <span className="w-7 h-7 rounded-xl bg-amber-500 text-slate-950 font-mono font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                      1
                    </span>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-white">
                        Cek NIK di DPT Secara Online Sekarang
                      </h4>
                      <p className="text-xs text-slate-300 mt-0.5">
                        Jangan menunggu hari H. Pastikan namamu sudah tertera di Daftar Pemilih Tetap (DPT) dan ketahui nomor TPS tempatmu mencoblos.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800">
                    <span className="w-7 h-7 rounded-xl bg-emerald-500 text-slate-950 font-mono font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                      2
                    </span>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-white">
                        Ketahui Visi, Misi, & Program Calon Kepala Desa
                      </h4>
                      <p className="text-xs text-slate-300 mt-0.5">
                        Pilihlah calon pemimpin yang memiliki komitmen tulus memajukan Desa Gunungjaya, transparan dalam anggaran desa, dan mengayomi seluruh warga.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800">
                    <span className="w-7 h-7 rounded-xl bg-rose-500 text-white font-mono font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                      3
                    </span>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-white">
                        Tolak Segala Bentuk Politik Uang (Anti Money Politics)
                      </h4>
                      <p className="text-xs text-slate-300 mt-0.5">
                        Jangan gadaikan masa depan desa selama 6 tahun hanya demi nominal sesaat. Pemimpin berintegritas lahir dari pemilih yang bermartabat.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800">
                    <span className="w-7 h-7 rounded-xl bg-purple-500 text-white font-mono font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                      4
                    </span>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-white">
                        Hadir Tepat Waktu di TPS (07.00 - 13.00 WIB)
                      </h4>
                      <p className="text-xs text-slate-300 mt-0.5">
                        Bawalah dokumen resmi (e-KTP asli / Surat Keterangan dan Surat Pemberitahuan/Model C6). Gunakan hak suaramu dan celupkan jari ke tinta!
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 3: Tata Nilai Pilkades */}
            {activeTab === 'fakta' && (
              <div className="bg-slate-900/90 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-slate-700/80 shadow-2xl space-y-4 animate-in fade-in">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center justify-center font-bold text-lg">
                    <Shield className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white font-serif">
                      Asas Pemilihan Pilkades Gunungjaya
                    </h3>
                    <p className="text-xs text-slate-400">
                      Standar integritas penyelenggaraan oleh Panitia P2KD Desa Gunungjaya
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                  <div className="p-3 rounded-xl bg-slate-950/80 text-center border border-slate-800">
                    <span className="text-sm font-black text-amber-400 block font-mono">LURUS</span>
                    <span className="text-[11px] text-slate-400">Langsung</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950/80 text-center border border-slate-800">
                    <span className="text-sm font-black text-amber-400 block font-mono">UMUM</span>
                    <span className="text-[11px] text-slate-400">Untuk Seluruh Warga</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950/80 text-center border border-slate-800">
                    <span className="text-sm font-black text-amber-400 block font-mono">BEBAS</span>
                    <span className="text-[11px] text-slate-400">Tanpa Intervensi</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950/80 text-center border border-slate-800">
                    <span className="text-sm font-black text-amber-400 block font-mono">RAHASIA</span>
                    <span className="text-[11px] text-slate-400">Kerahasiaan Terjamin</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950/80 text-center border border-slate-800">
                    <span className="text-sm font-black text-amber-400 block font-mono">JUJUR</span>
                    <span className="text-[11px] text-slate-400">Transparan & Terbuka</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950/80 text-center border border-slate-800">
                    <span className="text-sm font-black text-amber-400 block font-mono">ADIL</span>
                    <span className="text-[11px] text-slate-400">Perlakuan Setara</span>
                  </div>
                </div>

                <div className="p-4 bg-emerald-950/60 rounded-2xl border border-emerald-500/40 text-xs text-emerald-200 flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <p>
                    Panitia Pemilihan Kepala Desa (P2KD) Gunungjaya netral, tidak berpihak kepada siapapun, dan mengabdi untuk kemaslahatan masyarakat desa.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
