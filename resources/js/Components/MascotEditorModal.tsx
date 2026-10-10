import React, { useState, useEffect } from 'react';
import { useForm, Link } from '@inertiajs/react';
import { X, Sparkles, MessageSquareQuote, Award, Megaphone, Shield, Save, CheckCircle2, Lock, Edit3, RefreshCw } from 'lucide-react';
import { PilkadesConfig } from '../types/pilkades';

interface MascotEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: PilkadesConfig;
  isAdmin?: boolean;
}

export const MascotEditorModal: React.FC<MascotEditorModalProps> = ({
  isOpen,
  onClose,
  config,
  isAdmin = false,
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'sapaan' | 'identitas' | 'filosofi' | 'ajakan' | 'tatanilai'>('sapaan');

  const speechesText = (config.mascot_speeches && config.mascot_speeches.length > 0)
    ? config.mascot_speeches.join('\n')
    : [
        `“Sugeng rawuh sedulur sedaya! Aja lali cek ${config.dataPhase || 'DPS'}-mu ya, sak swaramu nemtokake masa depan Desa ${config.desa || 'Gunungjaya'}!”`,
        '“Beda pilihan kuwi lumrah lan wajar, sing penting paseduluran lan keguyuban tetep dijaga!”',
        '“Tolak Serangan Fajar & Politik Uang! Pilih pemimpin nganggo ati nurani sing resik.”',
        `“Tanggal pencoblosan teka gasik neng TPS jam ${config.votingHours || '07.00 - 13.00 WIB'}, nggawa e-KTP ya Lur!”`
      ].join('\n');

  const filosofiList = config.mascot_filosofi && config.mascot_filosofi.length >= 4
    ? config.mascot_filosofi
    : [
        { num: 1, title: 'Burung Biru Lereng Slamet', desc: 'Melambangkan kecerdasan, ketajaman visi, ketangguhan, dan suara lantang warga desa dalam menyuarakan aspirasi pembangunan bersama.' },
        { num: 2, title: 'Blangkon & Surjan Lurik', desc: 'Wujud penghormatan terhadap adat istiadat Jawa Tengah, kesantunan bertutur kata, serta kerendahan hati dalam kepemimpinan desa.' },
        { num: 3, title: 'Sayap Mengajak & Surat Suara', desc: 'Simbol ajakan ramah agar warga aktif menggunakan hak pilihnya secara mandiri, berdaulat, dan bebas dari paksaan pihak manapun.' },
        { num: 4, title: 'Ekspresi Ceria & Ramah', desc: 'Menegaskan bahwa Pilkades adalah pesta rakyat yang membahagiakan, menjalin kerukunan antar RT/RW, dan merajut persatuan desa.' },
      ];

  const ajakanList = config.mascot_ajakan && config.mascot_ajakan.length >= 4
    ? config.mascot_ajakan
    : [
        { num: 1, title: 'Cek NIK di DPT Secara Online Sekarang', desc: 'Jangan menunggu hari H. Pastikan namamu sudah tertera di Daftar Pemilih Tetap (DPT) dan ketahui nomor TPS tempatmu mencoblos.' },
        { num: 2, title: 'Ketahui Visi, Misi, & Program Calon Kepala Desa', desc: `Pilihlah calon pemimpin yang memiliki komitmen tulus memajukan Desa ${config.desa || 'Gunungjaya'}, transparan dalam anggaran desa, dan mengayomi seluruh warga.` },
        { num: 3, title: 'Tolak Segala Bentuk Politik Uang (Anti Money Politics)', desc: 'Jangan gadaikan masa depan desa selama 6 tahun hanya demi nominal sesaat. Pemimpin berintegritas lahir dari pemilih yang bermartabat.' },
        { num: 4, title: `Hadir Tepat Waktu di TPS (${config.votingHours || '07.00 - 13.00 WIB'})`, desc: 'Bawalah dokumen resmi (e-KTP asli / Surat Keterangan dan Surat Pemberitahuan/Model C6). Gunakan hak suaramu dan celupkan jari ke tinta!' },
      ];

  const { data, setData, post, processing, errors, reset } = useForm({
    mascot_title: config.mascot_title || `Kenalkan, “GLAWU” Maskot Resmi Pilkades ${config.desa || 'Gunungjaya'} ${config.tahun || '2026'}`,
    mascot_badge: config.mascot_badge || 'IKON SEMANGAT DEMOKRASI DESA',
    mascot_tag: config.mascot_tag || 'Burung Khas Lereng Gn. Slamet',
    mascot_desc: config.mascot_desc || `Karakter sahabat pemilih yang ceria, berwibawa, dan sarat kearifan lokal. GLAWU hadir mengajak seluruh warga Desa ${config.desa || 'Gunungjaya'} mewujudkan Pilkades yang aman, damai, bermartabat, dan tanpa politik uang.`,
    mascot_slogan: config.mascot_slogan || `“${config.desa || 'Gunungjaya'} Guyub Rukun, Sukseskan Pilkades Bersama Glawu!”`,
    mascot_speeches: speechesText,
    filosofi_1_title: filosofiList[0]?.title || 'Burung Biru Lereng Slamet',
    filosofi_1_desc: filosofiList[0]?.desc || 'Melambangkan kecerdasan, ketajaman visi, ketangguhan, dan suara lantang warga desa dalam menyuarakan aspirasi pembangunan bersama.',
    filosofi_2_title: filosofiList[1]?.title || 'Blangkon & Surjan Lurik',
    filosofi_2_desc: filosofiList[1]?.desc || 'Wujud penghormatan terhadap adat istiadat Jawa Tengah, kesantunan bertutur kata, serta kerendahan hati dalam kepemimpinan desa.',
    filosofi_3_title: filosofiList[2]?.title || 'Sayap Mengajak & Surat Suara',
    filosofi_3_desc: filosofiList[2]?.desc || 'Simbol ajakan ramah agar warga aktif menggunakan hak pilihnya secara mandiri, berdaulat, dan bebas dari paksaan pihak manapun.',
    filosofi_4_title: filosofiList[3]?.title || 'Ekspresi Ceria & Ramah',
    filosofi_4_desc: filosofiList[3]?.desc || 'Menegaskan bahwa Pilkades adalah pesta rakyat yang membahagiakan, menjalin kerukunan antar RT/RW, dan merajut persatuan desa.',
    ajakan_1_title: ajakanList[0]?.title || 'Cek NIK di DPT Secara Online Sekarang',
    ajakan_1_desc: ajakanList[0]?.desc || 'Jangan menunggu hari H. Pastikan namamu sudah tertera di Daftar Pemilih Tetap (DPT) dan ketahui nomor TPS tempatmu mencoblos.',
    ajakan_2_title: ajakanList[1]?.title || 'Ketahui Visi, Misi, & Program Calon Kepala Desa',
    ajakan_2_desc: ajakanList[1]?.desc || `Pilihlah calon pemimpin yang memiliki komitmen tulus memajukan Desa ${config.desa || 'Gunungjaya'}, transparan dalam anggaran desa, dan mengayomi seluruh warga.`,
    ajakan_3_title: ajakanList[2]?.title || 'Tolak Segala Bentuk Politik Uang (Anti Money Politics)',
    ajakan_3_desc: ajakanList[2]?.desc || 'Jangan gadaikan masa depan desa selama 6 tahun hanya demi nominal sesaat. Pemimpin berintegritas lahir dari pemilih yang bermartabat.',
    ajakan_4_title: ajakanList[3]?.title || `Hadir Tepat Waktu di TPS (${config.votingHours || '07.00 - 13.00 WIB'})`,
    ajakan_4_desc: ajakanList[3]?.desc || 'Bawalah dokumen resmi (e-KTP asli / Surat Keterangan dan Surat Pemberitahuan/Model C6). Gunakan hak suaramu dan celupkan jari ke tinta!',
    tata_nilai_netralitas: config.tata_nilai_netralitas || `Panitia Pemilihan Kepala Desa (P2KD) ${config.desa || 'Gunungjaya'} netral, tidak berpihak kepada siapapun, dan mengabdi untuk kemaslahatan masyarakat desa.`,
    redirect_to: 'home',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post('/admin/settings/mascot', {
      onSuccess: () => {
        onClose();
      },
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white border-2 border-b-4 border-slate-200 rounded-3xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Modal */}
        <div className="p-4 sm:p-6 border-b-2 border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#FFF5D1] text-[#E59B00] border-2 border-[#FFC800]/50 flex items-center justify-center shadow-xs">
              <Edit3 className="w-5 h-5 text-[#E59B00]" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-slate-900">
                Pengaturan Redaksi & Maskot Si Glawu
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Sesuaikan teks, filosofi, sapaan, dan ajakan yang tampil pada section maskot
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-2xl bg-white hover:bg-slate-100 border-2 border-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        {!isAdmin ? (
          /* Locked State for Non-Admin */
          <div className="p-8 sm:p-12 text-center space-y-5 flex-1 overflow-y-auto">
            <div className="w-16 h-16 rounded-3xl bg-amber-100 border-2 border-amber-300 text-amber-600 flex items-center justify-center mx-auto shadow-sm">
              <Lock className="w-8 h-8" />
            </div>
            <div className="max-w-md mx-auto space-y-2">
              <h4 className="text-lg font-black text-slate-900">
                Hak Akses Administrator Diperlukan
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                Untuk mengubah redaksi judul, narasi filosofi, sapaan balon dialog, dan tata nilai Maskot Si Glawu, silakan masuk menggunakan akun Administrator P2KD.
              </p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href="/admin/login"
                className="w-full sm:w-auto px-6 py-3 bg-[#58CC02] hover:bg-[#4ebb02] text-white font-black text-xs uppercase tracking-wider rounded-2xl border-b-4 border-[#46A302] active:border-b-0 active:translate-y-1 shadow-sm transition"
              >
                Masuk ke Panel Admin →
              </a>
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-black text-xs uppercase tracking-wider rounded-2xl border-2 border-slate-200 cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        ) : (
          /* Editable Form for Admin */
          <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-hidden">
            {/* Tab navigation inside modal */}
            <div className="flex border-b-2 border-slate-100 bg-slate-50 px-4 sm:px-6 pt-2 gap-1 overflow-x-auto scrollbar-none">
              <button
                type="button"
                onClick={() => setActiveTab('sapaan')}
                className={`py-2.5 px-3.5 rounded-t-xl text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'sapaan'
                    ? 'bg-white text-purple-700 border-2 border-b-0 border-slate-200 shadow-xs -mb-[2px] z-10'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <MessageSquareQuote className="w-3.5 h-3.5" />
                <span>Balon Sapaan</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('identitas')}
                className={`py-2.5 px-3.5 rounded-t-xl text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'identitas'
                    ? 'bg-white text-[#E59B00] border-2 border-b-0 border-slate-200 shadow-xs -mb-[2px] z-10'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Identitas & Slogan</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('filosofi')}
                className={`py-2.5 px-3.5 rounded-t-xl text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'filosofi'
                    ? 'bg-white text-[#1CB0F6] border-2 border-b-0 border-slate-200 shadow-xs -mb-[2px] z-10'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <Award className="w-3.5 h-3.5" />
                <span>4 Filosofi Makna</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('ajakan')}
                className={`py-2.5 px-3.5 rounded-t-xl text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'ajakan'
                    ? 'bg-white text-[#58CC02] border-2 border-b-0 border-slate-200 shadow-xs -mb-[2px] z-10'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <Megaphone className="w-3.5 h-3.5" />
                <span>4 Ajakan Glawu</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('tatanilai')}
                className={`py-2.5 px-3.5 rounded-t-xl text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'tatanilai'
                    ? 'bg-white text-rose-600 border-2 border-b-0 border-slate-200 shadow-xs -mb-[2px] z-10'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Netralitas P2KD</span>
              </button>
            </div>

            {/* Tab Panels Content */}
            <div className="p-4 sm:p-6 flex-1 overflow-y-auto space-y-4">
              {/* TAB 1: Balon Sapaan */}
              {activeTab === 'sapaan' && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <div className="p-3.5 rounded-2xl bg-purple-50 border-2 border-purple-200 text-xs text-purple-900 font-medium leading-relaxed">
                    💡 <strong>Tips Balon Sapaan:</strong> Tuliskan <strong>1 baris per kalimat</strong>. Kalimat-kalimat ini akan berganti secara dinamis saat warga menekan tombol <em>Ganti Nasehat Glawu</em>.
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-black uppercase tracking-wider text-slate-700">
                      Daftar Kalimat Sapaan Glawu (Tekan Enter untuk baris baru):
                    </label>
                    <textarea
                      rows={6}
                      value={data.mascot_speeches}
                      onChange={(e) => setData('mascot_speeches', e.target.value)}
                      placeholder="Tuliskan ucapan Glawu di sini..."
                      className="w-full px-4 py-3 rounded-2xl border-2 border-slate-200 focus:border-purple-500 focus:ring-0 text-slate-800 text-xs sm:text-sm leading-relaxed"
                      required
                    />
                    {errors.mascot_speeches && (
                      <p className="text-xs font-bold text-red-500">{errors.mascot_speeches}</p>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 2: Identitas & Slogan */}
              {activeTab === 'identitas' && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-black uppercase tracking-wider text-slate-700">
                        Badge Atas (Pill Tagline):
                      </label>
                      <input
                        type="text"
                        value={data.mascot_badge}
                        onChange={(e) => setData('mascot_badge', e.target.value)}
                        placeholder="Contoh: IKON SEMANGAT DEMOKRASI DESA"
                        className="w-full px-4 py-2.5 rounded-2xl border-2 border-slate-200 focus:border-[#FFC800] focus:ring-0 text-slate-900 font-bold text-xs"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-black uppercase tracking-wider text-slate-700">
                        Tag Khusus Maskot (Di Bawah Gambar):
                      </label>
                      <input
                        type="text"
                        value={data.mascot_tag}
                        onChange={(e) => setData('mascot_tag', e.target.value)}
                        placeholder="Contoh: Burung Khas Lereng Gn. Slamet"
                        className="w-full px-4 py-2.5 rounded-2xl border-2 border-slate-200 focus:border-[#FFC800] focus:ring-0 text-slate-900 font-bold text-xs"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-black uppercase tracking-wider text-slate-700">
                      Judul Section Maskot:
                    </label>
                    <input
                      type="text"
                      value={data.mascot_title}
                      onChange={(e) => setData('mascot_title', e.target.value)}
                      placeholder="Contoh: Kenalkan, “GLAWU” Maskot Resmi Pilkades..."
                      className="w-full px-4 py-2.5 rounded-2xl border-2 border-slate-200 focus:border-[#FFC800] focus:ring-0 text-slate-900 font-black text-sm"
                      required
                    />
                    {errors.mascot_title && (
                      <p className="text-xs font-bold text-red-500">{errors.mascot_title}</p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-black uppercase tracking-wider text-slate-700">
                      Slogan Resmi Pilkades:
                    </label>
                    <input
                      type="text"
                      value={data.mascot_slogan}
                      onChange={(e) => setData('mascot_slogan', e.target.value)}
                      placeholder="Contoh: “Gunungjaya Guyub Rukun, Sukseskan Pilkades Bersama Glawu!”"
                      className="w-full px-4 py-2.5 rounded-2xl border-2 border-slate-200 focus:border-[#FFC800] focus:ring-0 text-slate-900 font-bold text-xs"
                      required
                    />
                    {errors.mascot_slogan && (
                      <p className="text-xs font-bold text-red-500">{errors.mascot_slogan}</p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-black uppercase tracking-wider text-slate-700">
                      Deskripsi Karakter Maskot:
                    </label>
                    <textarea
                      rows={3}
                      value={data.mascot_desc}
                      onChange={(e) => setData('mascot_desc', e.target.value)}
                      placeholder="Jelaskan karakter Si Glawu dan nilai yang dibawanya..."
                      className="w-full px-4 py-2.5 rounded-2xl border-2 border-slate-200 focus:border-[#FFC800] focus:ring-0 text-slate-800 text-xs leading-relaxed"
                      required
                    />
                    {errors.mascot_desc && (
                      <p className="text-xs font-bold text-red-500">{errors.mascot_desc}</p>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 3: 4 Makna Filosofi */}
              {activeTab === 'filosofi' && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <p className="text-xs text-slate-500 font-medium">
                    Edit 4 kartu penjelasan filosofi dan makna simbolik yang ada pada Tab 1 halaman publik:
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Filosofi 1 */}
                    <div className="p-4 rounded-2xl bg-slate-50 border-2 border-slate-200 space-y-2">
                      <span className="text-[11px] font-black text-[#1CB0F6] uppercase tracking-wider block">
                        Simbolik 1 (Burung Slamet)
                      </span>
                      <input
                        type="text"
                        value={data.filosofi_1_title}
                        onChange={(e) => setData('filosofi_1_title', e.target.value)}
                        placeholder="Judul simbolik 1"
                        className="w-full px-3 py-2 rounded-xl border-2 border-slate-200 text-xs font-bold bg-white"
                      />
                      <textarea
                        rows={2}
                        value={data.filosofi_1_desc}
                        onChange={(e) => setData('filosofi_1_desc', e.target.value)}
                        placeholder="Deskripsi makna simbolik 1"
                        className="w-full px-3 py-2 rounded-xl border-2 border-slate-200 text-xs bg-white"
                      />
                    </div>

                    {/* Filosofi 2 */}
                    <div className="p-4 rounded-2xl bg-slate-50 border-2 border-slate-200 space-y-2">
                      <span className="text-[11px] font-black text-[#D97706] uppercase tracking-wider block">
                        Simbolik 2 (Blangkon & Surjan)
                      </span>
                      <input
                        type="text"
                        value={data.filosofi_2_title}
                        onChange={(e) => setData('filosofi_2_title', e.target.value)}
                        placeholder="Judul simbolik 2"
                        className="w-full px-3 py-2 rounded-xl border-2 border-slate-200 text-xs font-bold bg-white"
                      />
                      <textarea
                        rows={2}
                        value={data.filosofi_2_desc}
                        onChange={(e) => setData('filosofi_2_desc', e.target.value)}
                        placeholder="Deskripsi makna simbolik 2"
                        className="w-full px-3 py-2 rounded-xl border-2 border-slate-200 text-xs bg-white"
                      />
                    </div>

                    {/* Filosofi 3 */}
                    <div className="p-4 rounded-2xl bg-slate-50 border-2 border-slate-200 space-y-2">
                      <span className="text-[11px] font-black text-[#46A302] uppercase tracking-wider block">
                        Simbolik 3 (Sayap & Surat Suara)
                      </span>
                      <input
                        type="text"
                        value={data.filosofi_3_title}
                        onChange={(e) => setData('filosofi_3_title', e.target.value)}
                        placeholder="Judul simbolik 3"
                        className="w-full px-3 py-2 rounded-xl border-2 border-slate-200 text-xs font-bold bg-white"
                      />
                      <textarea
                        rows={2}
                        value={data.filosofi_3_desc}
                        onChange={(e) => setData('filosofi_3_desc', e.target.value)}
                        placeholder="Deskripsi makna simbolik 3"
                        className="w-full px-3 py-2 rounded-xl border-2 border-slate-200 text-xs bg-white"
                      />
                    </div>

                    {/* Filosofi 4 */}
                    <div className="p-4 rounded-2xl bg-slate-50 border-2 border-slate-200 space-y-2">
                      <span className="text-[11px] font-black text-[#9333EA] uppercase tracking-wider block">
                        Simbolik 4 (Ekspresi Ceria & Ramah)
                      </span>
                      <input
                        type="text"
                        value={data.filosofi_4_title}
                        onChange={(e) => setData('filosofi_4_title', e.target.value)}
                        placeholder="Judul simbolik 4"
                        className="w-full px-3 py-2 rounded-xl border-2 border-slate-200 text-xs font-bold bg-white"
                      />
                      <textarea
                        rows={2}
                        value={data.filosofi_4_desc}
                        onChange={(e) => setData('filosofi_4_desc', e.target.value)}
                        placeholder="Deskripsi makna simbolik 4"
                        className="w-full px-3 py-2 rounded-xl border-2 border-slate-200 text-xs bg-white"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: 4 Ajakan Glawu */}
              {activeTab === 'ajakan' && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <p className="text-xs text-slate-500 font-medium">
                    Edit 4 poin ajakan dan himbauan edukasi pemilih yang tampil pada Tab 2:
                  </p>

                  <div className="space-y-3">
                    {/* Ajakan 1 */}
                    <div className="p-3.5 rounded-2xl bg-slate-50 border-2 border-slate-200 space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-md bg-[#FFC800] text-slate-900 font-black text-[11px] flex items-center justify-center">1</span>
                        <span className="text-xs font-black text-slate-800">Ajakan Poin 1</span>
                      </div>
                      <input
                        type="text"
                        value={data.ajakan_1_title}
                        onChange={(e) => setData('ajakan_1_title', e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border-2 border-slate-200 text-xs font-bold bg-white"
                        required
                      />
                      <textarea
                        rows={2}
                        value={data.ajakan_1_desc}
                        onChange={(e) => setData('ajakan_1_desc', e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border-2 border-slate-200 text-xs bg-white"
                        required
                      />
                    </div>

                    {/* Ajakan 2 */}
                    <div className="p-3.5 rounded-2xl bg-slate-50 border-2 border-slate-200 space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-md bg-[#58CC02] text-white font-black text-[11px] flex items-center justify-center">2</span>
                        <span className="text-xs font-black text-slate-800">Ajakan Poin 2</span>
                      </div>
                      <input
                        type="text"
                        value={data.ajakan_2_title}
                        onChange={(e) => setData('ajakan_2_title', e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border-2 border-slate-200 text-xs font-bold bg-white"
                        required
                      />
                      <textarea
                        rows={2}
                        value={data.ajakan_2_desc}
                        onChange={(e) => setData('ajakan_2_desc', e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border-2 border-slate-200 text-xs bg-white"
                        required
                      />
                    </div>

                    {/* Ajakan 3 */}
                    <div className="p-3.5 rounded-2xl bg-slate-50 border-2 border-slate-200 space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-md bg-[#FF4B4B] text-white font-black text-[11px] flex items-center justify-center">3</span>
                        <span className="text-xs font-black text-slate-800">Ajakan Poin 3 (Anti Money Politics)</span>
                      </div>
                      <input
                        type="text"
                        value={data.ajakan_3_title}
                        onChange={(e) => setData('ajakan_3_title', e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border-2 border-slate-200 text-xs font-bold bg-white"
                        required
                      />
                      <textarea
                        rows={2}
                        value={data.ajakan_3_desc}
                        onChange={(e) => setData('ajakan_3_desc', e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border-2 border-slate-200 text-xs bg-white"
                        required
                      />
                    </div>

                    {/* Ajakan 4 */}
                    <div className="p-3.5 rounded-2xl bg-slate-50 border-2 border-slate-200 space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-md bg-[#1CB0F6] text-white font-black text-[11px] flex items-center justify-center">4</span>
                        <span className="text-xs font-black text-slate-800">Ajakan Poin 4</span>
                      </div>
                      <input
                        type="text"
                        value={data.ajakan_4_title}
                        onChange={(e) => setData('ajakan_4_title', e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border-2 border-slate-200 text-xs font-bold bg-white"
                        required
                      />
                      <textarea
                        rows={2}
                        value={data.ajakan_4_desc}
                        onChange={(e) => setData('ajakan_4_desc', e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border-2 border-slate-200 text-xs bg-white"
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 5: Netralitas P2KD */}
              {activeTab === 'tatanilai' && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-black uppercase tracking-wider text-slate-700">
                      Teks Komitmen Netralitas Panitia P2KD (Tampil di Tab 3):
                    </label>
                    <textarea
                      rows={4}
                      value={data.tata_nilai_netralitas}
                      onChange={(e) => setData('tata_nilai_netralitas', e.target.value)}
                      placeholder="Contoh: Panitia Pemilihan Kepala Desa (P2KD) Gunungjaya netral..."
                      className="w-full px-4 py-3 rounded-2xl border-2 border-slate-200 focus:border-[#58CC02] focus:ring-0 text-slate-800 text-xs leading-relaxed"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Footer Modal Actions */}
            <div className="p-4 sm:p-5 border-t-2 border-slate-100 bg-slate-50 flex items-center justify-between gap-3">
              <span className="text-xs text-slate-400 font-medium hidden sm:inline">
                * Perubahan akan langsung tersimpan di database MySQL.
              </span>

              <div className="flex items-center gap-2 ml-auto">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-2xl bg-white hover:bg-slate-100 text-slate-700 font-black text-xs uppercase tracking-wider border-2 border-slate-200 transition cursor-pointer"
                >
                  Batal
                </button>

                <button
                  type="submit"
                  disabled={processing}
                  className="px-6 py-2.5 rounded-2xl bg-[#58CC02] hover:bg-[#4ebb02] text-white font-black text-xs uppercase tracking-wider border-b-4 border-[#46A302] active:border-b-0 active:translate-y-1 shadow-sm transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{processing ? 'Menyimpan...' : 'Simpan Perubahan'}</span>
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
