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

  const speeches = config.mascot_speeches && config.mascot_speeches.length > 0
    ? config.mascot_speeches
    : [
      `“Sugeng rawuh sedulur sedaya! Aja lali cek ${phaseName}-mu ya, sak swaramu nemtokake masa depan Desa ${config.desa || 'Gunungjaya'}!”`,
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

  const defaultFilosofi = [
    {
      num: 1,
      title: 'Burung Biru Lereng Slamet',
      desc: 'Melambangkan kecerdasan, ketajaman visi, ketangguhan, dan suara lantang warga desa dalam menyuarakan aspirasi pembangunan bersama.',
      colorClass: 'text-[#1CB0F6] bg-[#1CB0F6]',
    },
    {
      num: 2,
      title: 'Blangkon & Surjan Lurik',
      desc: 'Wujud penghormatan terhadap adat istiadat Jawa Tengah, kesantunan bertutur kata, serta kerendahan hati dalam kepemimpinan desa.',
      colorClass: 'text-[#D97706] bg-[#FFC800]',
    },
    {
      num: 3,
      title: 'Sayap Mengajak & Surat Suara',
      desc: 'Simbol ajakan ramah agar warga aktif menggunakan hak pilihnya secara mandiri, berdaulat, dan bebas dari paksaan pihak manapun.',
      colorClass: 'text-[#46A302] bg-[#58CC02]',
    },
    {
      num: 4,
      title: 'Ekspresi Ceria & Ramah',
      desc: 'Menegaskan bahwa Pilkades adalah pesta rakyat yang membahagiakan, menjalin kerukunan antar RT/RW, dan merajut persatuan desa.',
      colorClass: 'text-[#9333EA] bg-[#CE82FF]',
    },
  ];

  const filosofiList = config.mascot_filosofi && config.mascot_filosofi.length >= 4
    ? config.mascot_filosofi.map((item, idx) => ({
        num: item.num || idx + 1,
        title: item.title,
        desc: item.desc,
        colorClass: defaultFilosofi[idx]?.colorClass || 'text-[#1CB0F6] bg-[#1CB0F6]',
      }))
    : defaultFilosofi;

  const defaultAjakan = [
    {
      num: 1,
      title: 'Cek NIK di DPT Secara Online Sekarang',
      desc: 'Jangan menunggu hari H. Pastikan namamu sudah tertera di Daftar Pemilih Tetap (DPT) dan ketahui nomor TPS tempatmu mencoblos.',
      color: 'bg-[#FFC800] text-slate-900',
    },
    {
      num: 2,
      title: 'Ketahui Visi, Misi, & Program Calon Kepala Desa',
      desc: `Pilihlah calon pemimpin yang memiliki komitmen tulus memajukan Desa ${config.desa || 'Gunungjaya'}, transparan dalam anggaran desa, dan mengayomi seluruh warga.`,
      color: 'bg-[#58CC02] text-white',
    },
    {
      num: 3,
      title: 'Tolak Segala Bentuk Politik Uang (Anti Money Politics)',
      desc: 'Jangan gadaikan masa depan desa selama 6 tahun hanya demi nominal sesaat. Pemimpin berintegritas lahir dari pemilih yang bermartabat.',
      color: 'bg-[#FF4B4B] text-white',
    },
    {
      num: 4,
      title: `Hadir Tepat Waktu di TPS (${votingTime})`,
      desc: 'Bawalah dokumen resmi (e-KTP asli / Surat Keterangan dan Surat Pemberitahuan/Model C6). Gunakan hak suaramu dan celupkan jari ke tinta!',
      color: 'bg-[#1CB0F6] text-white',
    },
  ];

  const ajakanList = config.mascot_ajakan && config.mascot_ajakan.length > 0
    ? config.mascot_ajakan.map((item, idx) => ({
        num: item.num || idx + 1,
        title: item.title,
        desc: item.desc,
        color: defaultAjakan[idx]?.color || 'bg-[#FFC800] text-slate-900',
      }))
    : defaultAjakan;

  return (
    <section id="maskot-glawu" className="py-12 sm:py-16 bg-[#F7F9FA] border-t-2 border-slate-200 text-slate-800 relative overflow-hidden">
      {/* Decorative ambient subtle lights */}
      <div className="absolute top-0 right-0 -mt-16 -mr-16 w-96 h-96 bg-amber-200/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -mb-16 -ml-16 w-96 h-96 bg-sky-200/30 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#FFF5D1] text-[#E59B00] border-2 border-[#FFC800]/50 rounded-2xl text-xs font-black tracking-wider uppercase shadow-xs mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#FFC800]" />
            <span>{config.mascot_badge || 'IKON SEMANGAT DEMOKRASI DESA'}</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
            {config.mascot_title || (
              <>Kenalkan, <span className="text-[#E59B00]">“GLAWU”</span> Maskot Resmi Pilkades {config.desa || 'Gunungjaya'} {config.tahun || '2026'}</>
            )}
          </h2>
          <p className="mt-3 text-slate-600 text-xs sm:text-base leading-relaxed font-medium">
            {config.mascot_desc || `Karakter sahabat pemilih yang ceria, berwibawa, dan sarat kearifan lokal. GLAWU hadir mengajak seluruh warga Desa ${config.desa || 'Gunungjaya'} mewujudkan Pilkades yang aman, damai, bermartabat, dan tanpa politik uang.`}
          </p>

          {/* Quick Edit Button */}
          {onOpenMascotModal && (
            <div className="mt-4 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={onOpenMascotModal}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#FFC800] hover:bg-[#e6b400] text-slate-900 font-black text-xs uppercase tracking-wider rounded-2xl border-b-4 border-[#E59B00] active:border-b-0 active:translate-y-1 shadow-sm transition cursor-pointer"
                title="Edit Redaksi, Filosofi, Slogan & Balon Dialog Maskot"
              >
                <Edit3 className="w-4 h-4" />
                <span>Edit Redaksi & Maskot</span>
              </button>
            </div>
          )}
        </div>

        {/* Main Grid: Visual Mascot on Left, Meaning & Interactive Tabs on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Col 1: Mascot Showcase Card (5 cols) */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="w-full max-w-md bg-white border-2 border-b-4 border-slate-200 rounded-3xl p-6 sm:p-7 shadow-sm relative overflow-hidden group">
              {/* Badge Corner */}
              <div className="absolute top-4 right-4 bg-[#FFC800] text-slate-900 text-[11px] font-black px-3 py-1 rounded-xl shadow-xs flex items-center gap-1.5 z-20 border border-[#E59B00]/40">
                <Award className="w-3.5 h-3.5" />
                <span>Maskot Resmi {config.tahun || '2026'}</span>
              </div>

              {/* Character Visual Frame */}
              <div className="relative rounded-2xl bg-gradient-to-b from-[#F0F9FF] to-[#E0F2FE] p-5 border-2 border-[#BAE6FD] flex flex-col items-center justify-center overflow-hidden">
                <img
                  src={mascotSrc || DEFAULT_MASCOT_GLAWU}
                  alt={`${config.mascot_name || 'GLAWU'} - Maskot Resmi Pilkades ${config.desa || 'Gunungjaya'}`}
                  className="w-56 sm:w-64 h-56 sm:h-64 object-contain drop-shadow-md transition-transform duration-300 group-hover:scale-105 select-none"
                />

                {/* Subtle ground shadow */}
                <div className="w-32 h-3 bg-sky-900/10 rounded-full blur-[2px] -mt-1 mb-2" />

                {/* Floating Tag */}
                <div className="bg-white/95 backdrop-blur-xs text-[#B45309] text-[11px] font-black px-3.5 py-1 rounded-xl shadow-xs whitespace-nowrap border-2 border-amber-200 flex items-center gap-1.5 uppercase tracking-wide">
                  <Sparkles className="w-3.5 h-3.5 text-[#FFC800]" /> {config.mascot_tag || 'Burung Khas Lereng Gn. Slamet'}
                </div>
              </div>

              {/* Dynamic Speech Bubble */}
              <div className="mt-5 p-4 rounded-2xl bg-[#F8FAFC] border-2 border-slate-200 text-slate-700 text-xs sm:text-sm relative shadow-xs">
                <div className="absolute -top-2 left-8 w-4 h-4 bg-[#F8FAFC] border-t-2 border-l-2 border-slate-200 transform rotate-45" />
                <div className="flex items-start gap-2.5">
                  <MessageSquareQuote className="w-5 h-5 text-[#1CB0F6] shrink-0 mt-0.5" />
                  <div className="space-y-2">
                    <p className="italic font-bold text-slate-800 leading-relaxed font-serif">
                      {activeSpeech}
                    </p>
                    <button
                      type="button"
                      onClick={handleRandomQuote}
                      className="text-[11px] font-black text-[#1CB0F6] hover:text-[#1899D6] flex items-center gap-1.5 cursor-pointer uppercase tracking-wider"
                    >
                      <RefreshCw className="w-3.5 h-3.5 text-[#1CB0F6]" />
                      <span>Ganti Nasehat {config.mascot_name || 'Glawu'}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Cheer Interaction */}
              <div className="mt-5 pt-4 border-t-2 border-slate-100 flex items-center justify-between">
                <div className="text-left">
                  <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider block">
                    Dukungan Warga
                  </span>
                  <span className="text-lg font-black text-slate-800">
                    {cheerCount} <span className="text-xs text-slate-500 font-bold">Semangat</span>
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleCheer}
                  disabled={hasCheered}
                  className={`px-4 py-2.5 rounded-2xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all shadow-sm cursor-pointer ${
                    hasCheered
                      ? 'bg-[#FFE5E5] text-[#FF4B4B] border-2 border-[#FF4B4B]/30 cursor-default'
                      : 'bg-[#FF4B4B] hover:bg-[#EA2B2B] text-white border-b-4 border-[#EA2B2B] active:border-b-0 active:translate-y-1'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${hasCheered ? 'fill-[#FF4B4B] text-[#FF4B4B]' : ''}`} />
                  <span>{hasCheered ? 'Dukungan Terkirim!' : `Dukung ${config.mascot_name || 'Glawu'}`}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Col 2: Tabs of Meaning, Values & Village Call to Action (7 cols) */}
          <div className="lg:col-span-7 space-y-5">
            {/* Tab navigation */}
            <div className="flex p-1.5 bg-slate-100 border-2 border-slate-200 rounded-2xl gap-1.5 shadow-inner">
              <button
                type="button"
                onClick={() => setActiveTab('filosofi')}
                className={`flex-1 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  activeTab === 'filosofi'
                    ? 'bg-[#FFC800] text-slate-900 border-b-4 border-[#E59B00] shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
                }`}
              >
                <Award className="w-4 h-4" />
                <span>Filosofi & Makna</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('pesan')}
                className={`flex-1 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  activeTab === 'pesan'
                    ? 'bg-[#58CC02] text-white border-b-4 border-[#46A302] shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
                }`}
              >
                <Megaphone className="w-4 h-4" />
                <span>4 Ajakan {config.mascot_name || 'Glawu'}</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('fakta')}
                className={`flex-1 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  activeTab === 'fakta'
                    ? 'bg-[#1CB0F6] text-white border-b-4 border-[#1899D6] shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
                }`}
              >
                <Shield className="w-4 h-4" />
                <span>Tata Nilai</span>
              </button>
            </div>

            {/* Tab 1: Filosofi & Karakter */}
            {activeTab === 'filosofi' && (
              <div className="bg-white border-2 border-b-4 border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-5 animate-in fade-in duration-200">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-[#FFF5D1] text-[#E59B00] border-2 border-[#FFC800]/50 flex items-center justify-center font-bold text-lg shadow-xs">
                    <Sparkles className="w-5 h-5 text-[#FFC800]" />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-black text-slate-900">
                      Makna Simbolik Maskot {config.mascot_name || 'GLAWU'}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-500 font-medium">
                      Representasi jati diri masyarakat Desa {config.desa || 'Gunungjaya'}, Kec. {config.kecamatan || 'Belik'}, Kab. {config.kabupaten || 'Pemalang'}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                  {filosofiList.map((item) => (
                    <div key={item.num} className="p-4 rounded-2xl bg-slate-50 border-2 border-slate-200 hover:border-slate-300 transition-colors">
                      <h4 className="text-xs font-black uppercase tracking-wider mb-1.5 flex items-center gap-1.5" style={{ color: item.num === 1 ? '#0284C7' : item.num === 2 ? '#D97706' : item.num === 3 ? '#16A34A' : '#9333EA' }}>
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.num === 1 ? '#0284C7' : item.num === 2 ? '#FFC800' : item.num === 3 ? '#22C55E' : '#A855F7' }} />
                        {item.title}
                      </h4>
                      <p className="text-xs text-slate-600 leading-relaxed font-medium">
                        {item.desc}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#FFF5D1] to-[#FFEACC] border-2 border-b-4 border-[#FFC800] flex flex-col sm:flex-row items-center justify-between gap-4 mt-4">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-[#D97706] block">
                      SLOGAN PILKADES {config.desa?.toUpperCase() || 'GUNUNGJAYA'} {config.tahun || '2026'}
                    </span>
                    <p className="text-sm sm:text-base font-black text-slate-900 mt-0.5">
                      {config.mascot_slogan || `“${config.desa || 'Gunungjaya'} Guyub Rukun, Sukseskan Pilkades Bersama ${config.mascot_name || 'Glawu'}!”`}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={onScrollToSearch}
                    className="px-4 py-2.5 bg-[#58CC02] hover:bg-[#4ebb02] text-white font-black rounded-2xl border-b-4 border-[#46A302] active:border-b-0 active:translate-y-1 text-xs uppercase tracking-wider whitespace-nowrap shadow-sm transition cursor-pointer"
                  >
                    Cek Status {phaseName} Anda →
                  </button>
                </div>
              </div>
            )}

            {/* Tab 2: 4 Ajakan Penting Maskot */}
            {activeTab === 'pesan' && (
              <div className="bg-white border-2 border-b-4 border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-5 animate-in fade-in duration-200">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-[#E5F9D2] text-[#46A302] border-2 border-[#58CC02]/50 flex items-center justify-center font-bold text-lg shadow-xs">
                    <Megaphone className="w-5 h-5 text-[#46A302]" />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-black text-slate-900">
                      4 Ajakan Penting {config.mascot_name || 'Glawu'} untuk Pemilih
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-500 font-medium">
                      Pedomani imbauan ini agar hak suaramu terlindungi dengan sah dan sempurna
                    </p>
                  </div>
                </div>

                <div className="space-y-3 pt-1">
                  {ajakanList.map((item, idx) => {
                    const badgeBg = idx === 0
                      ? 'bg-[#FFC800] text-slate-900'
                      : idx === 1
                      ? 'bg-[#58CC02] text-white'
                      : idx === 2
                      ? 'bg-[#FF4B4B] text-white'
                      : 'bg-[#1CB0F6] text-white';

                    return (
                      <div key={item.num} className="flex items-start gap-3.5 p-4 rounded-2xl bg-slate-50 border-2 border-slate-200 hover:border-slate-300 transition-colors">
                        <span className={`w-8 h-8 rounded-xl font-black text-xs flex items-center justify-center shrink-0 mt-0.5 shadow-xs ${badgeBg}`}>
                          {item.num}
                        </span>
                        <div>
                          <h4 className="text-xs sm:text-sm font-black text-slate-900">
                            {item.title}
                          </h4>
                          <p className="text-xs text-slate-600 mt-1 leading-relaxed font-medium">
                            {item.desc}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Tab 3: Tata Nilai Pilkades */}
            {activeTab === 'fakta' && (
              <div className="bg-white border-2 border-b-4 border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-5 animate-in fade-in duration-200">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-[#DDF4FF] text-[#1CB0F6] border-2 border-[#1CB0F6]/50 flex items-center justify-center font-bold text-lg shadow-xs">
                    <Shield className="w-5 h-5 text-[#1CB0F6]" />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-black text-slate-900">
                      Asas Pemilihan Pilkades {config.desa || 'Gunungjaya'}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-500 font-medium">
                      Standar integritas penyelenggaraan oleh Panitia P2KD Desa {config.desa || 'Gunungjaya'}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-1">
                  <div className="p-3.5 rounded-2xl bg-[#FFF5D1] text-center border-2 border-[#FFC800]/50">
                    <span className="text-sm font-black text-[#D97706] block">LURUS</span>
                    <span className="text-xs text-slate-600 font-medium">Langsung</span>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-[#E5F9D2] text-center border-2 border-[#58CC02]/50">
                    <span className="text-sm font-black text-[#46A302] block">UMUM</span>
                    <span className="text-xs text-slate-600 font-medium">Untuk Seluruh Warga</span>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-[#DDF4FF] text-center border-2 border-[#1CB0F6]/50">
                    <span className="text-sm font-black text-[#1899D6] block">BEBAS</span>
                    <span className="text-xs text-slate-600 font-medium">Tanpa Intervensi</span>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-[#F3E8FF] text-center border-2 border-[#CE82FF]/50">
                    <span className="text-sm font-black text-[#7E22CE] block">RAHASIA</span>
                    <span className="text-xs text-slate-600 font-medium">Kerahasiaan Terjamin</span>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-[#FFE5E5] text-center border-2 border-[#FF4B4B]/40">
                    <span className="text-sm font-black text-[#EA2B2B] block">JUJUR</span>
                    <span className="text-xs text-slate-600 font-medium">Transparan & Terbuka</span>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-[#CCFBF1] text-center border-2 border-[#5EEAD4]/60">
                    <span className="text-sm font-black text-[#0F766E] block">ADIL</span>
                    <span className="text-xs text-slate-600 font-medium">Perlakuan Setara</span>
                  </div>
                </div>

                <div className="p-4 bg-[#E5F9D2]/70 rounded-2xl border-2 border-[#58CC02]/40 text-xs text-[#2E6B01] flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#46A302] shrink-0 mt-0.5" />
                  <p className="font-medium leading-relaxed">
                    {config.tata_nilai_netralitas || `Panitia Pemilihan Kepala Desa (P2KD) ${config.desa || 'Gunungjaya'} netral, tidak berpihak kepada siapapun, dan mengabdi untuk kemaslahatan masyarakat desa.`}
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
