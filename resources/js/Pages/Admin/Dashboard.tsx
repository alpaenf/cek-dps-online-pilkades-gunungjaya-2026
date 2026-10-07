import React, { useState } from 'react';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import {
  Users,
  MapPin,
  Plus,
  Search,
  Filter,
  Edit3,
  Trash2,
  X,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  LogOut,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Database,
  User,
  Info,
  FileSpreadsheet,
  Download,
  Sparkles,
  MessageSquareQuote,
  Megaphone,
  Save,
  RotateCcw
} from 'lucide-react';
import { DEFAULT_VILLAGE_LOGO, DEFAULT_MASCOT_GLAWU } from '@/data/logoPresets';
import { PageProps } from '@/types';
import { ImportVoterModal } from '@/Components/ImportVoterModal';

export interface MascotSettings {
  mascot_title: string;
  mascot_desc: string;
  mascot_slogan: string;
  mascot_speeches: string;
  ajakan_1_title: string;
  ajakan_1_desc: string;
  ajakan_2_title: string;
  ajakan_2_desc: string;
  ajakan_3_title: string;
  ajakan_3_desc: string;
  ajakan_4_title: string;
  ajakan_4_desc: string;
  data_phase?: string;
  pengumuman?: string;
}

interface TpsItem {
  id: number;
  nomor_tps: string;
  nama_lokasi: string;
  dusun: string;
  alamat?: string;
  rt?: string;
  rw?: string;
  latitude?: number;
  longitude?: number;
  keterangan?: string;
  total_voters?: number;
  total_laki_laki?: number;
  total_perempuan?: number;
}

interface VoterItem {
  id: number;
  tps_id: number;
  no_urut?: number;
  nik: string;
  nama: string;
  jenis_kelamin: 'L' | 'P';
  dusun?: string;
  rt?: string;
  rw?: string;
  tempat_lahir?: string;
  tanggal_lahir?: string;
  alamat?: string;
  status?: string;
  keterangan?: string;
  tps?: {
    id: number;
    nomor_tps: string;
    nama_lokasi: string;
    dusun: string;
  };
}

interface PaginatedVoters {
  data: VoterItem[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  links: {
    url: string | null;
    label: string;
    active: boolean;
  }[];
}

interface AdminDashboardProps {
  stats: {
    totalTps: number;
    totalDps: number;
    totalL: number;
    totalP: number;
  };
  tpsList: TpsItem[];
  voters: PaginatedVoters;
  allTpsOptions: {
    id: number;
    nomor_tps: string;
    nama_lokasi: string;
    dusun: string;
  }[];
  filters: {
    search: string;
    tps_id: string;
    gender: string;
    tab?: string;
  };
  config: {
    desa: string;
    kecamatan: string;
    kabupaten: string;
    tahun: string;
  };
  mascotSettings?: MascotSettings;
}

export default function AdminDashboard({
  stats,
  tpsList,
  voters,
  allTpsOptions,
  filters,
  config,
  mascotSettings,
}: AdminDashboardProps) {
  const { flash } = usePage<PageProps>().props;
  const queryParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
  const initialTab = (queryParams?.get('tab') as 'dps' | 'tps' | 'redaksi') || (filters.tab === 'redaksi' ? 'redaksi' : (filters.tab === 'tps' ? 'tps' : 'dps'));
  const [activeTab, setActiveTab] = useState<'dps' | 'tps' | 'redaksi'>(initialTab);

  // Redaksi & Mascot Form
  const mascotForm = useForm<MascotSettings>({
    mascot_title: mascotSettings?.mascot_title || 'Kenalkan, “GLAWU” Maskot Resmi Pilkades Gunungjaya 2026',
    mascot_desc: mascotSettings?.mascot_desc || 'Karakter sahabat pemilih yang ceria, berwibawa, dan sarat kearifan lokal. GLAWU hadir mengajak seluruh warga Desa Gunungjaya mewujudkan Pilkades yang aman, damai, bermartabat, dan tanpa politik uang.',
    mascot_slogan: mascotSettings?.mascot_slogan || '“Gunungjaya Guyub Rukun, Sukseskan Pilkades Bersama Glawu!”',
    mascot_speeches: mascotSettings?.mascot_speeches || [
      '“Sugeng rawuh sedulur sedaya! Aja lali cek DPS-mu ya, sak swaramu nemtokake masa depan Desa Gunungjaya!”',
      '“Beda pilihan kuwi lumrah lan wajar, sing penting paseduluran lan keguyuban tetep dijaga!”',
      '“Tolak Serangan Fajar & Politik Uang! Pilih pemimpin nganggo ati nurani sing resik.”',
      '“Tanggal pencoblosan teka gasik neng TPS jam 07.00 - 13.00 WIB, nggawa e-KTP ya Lur!”'
    ].join('\n'),
    ajakan_1_title: mascotSettings?.ajakan_1_title || 'Cek NIK di DPT Secara Online Sekarang',
    ajakan_1_desc: mascotSettings?.ajakan_1_desc || 'Jangan menunggu hari H. Pastikan namamu sudah tertera di Daftar Pemilih Tetap (DPT) dan ketahui nomor TPS tempatmu mencoblos.',
    ajakan_2_title: mascotSettings?.ajakan_2_title || 'Ketahui Visi, Misi, & Program Calon Kepala Desa',
    ajakan_2_desc: mascotSettings?.ajakan_2_desc || 'Pilihlah calon pemimpin yang memiliki komitmen tulus memajukan Desa Gunungjaya, transparan dalam anggaran desa, dan mengayomi seluruh warga.',
    ajakan_3_title: mascotSettings?.ajakan_3_title || 'Tolak Segala Bentuk Politik Uang (Anti Money Politics)',
    ajakan_3_desc: mascotSettings?.ajakan_3_desc || 'Jangan gadaikan masa depan desa selama 6 tahun hanya demi nominal sesaat. Pemimpin berintegritas lahir dari pemilih yang bermartabat.',
    ajakan_4_title: mascotSettings?.ajakan_4_title || 'Hadir Tepat Waktu di TPS (07.00 - 13.00 WIB)',
    ajakan_4_desc: mascotSettings?.ajakan_4_desc || 'Bawalah dokumen resmi (e-KTP asli / Surat Keterangan dan Surat Pemberitahuan/Model C6). Gunakan hak suaramu dan celupkan jari ke tinta!',
    data_phase: mascotSettings?.data_phase || 'DPS',
    pengumuman: mascotSettings?.pengumuman || 'Pengecekan DPS Online telah dibuka. Pastikan NIK Anda terdaftar!',
  });

  const [previewSpeechIndex, setPreviewSpeechIndex] = useState(0);

  const previewSpeeches = mascotForm.data.mascot_speeches
    .split('\n')
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  const currentPreviewSpeech = previewSpeeches.length > 0
    ? previewSpeeches[previewSpeechIndex % previewSpeeches.length]
    : '“Belum ada ucapan yang diisi.”';

  const handleNextPreviewSpeech = () => {
    if (previewSpeeches.length > 0) {
      setPreviewSpeechIndex((prev) => (prev + 1) % previewSpeeches.length);
    }
  };

  const handleResetMascotDefaults = () => {
    if (confirm('Kembalikan redaksi dan pesan maskot ke teks bawaan pabrik (default)?')) {
      mascotForm.setData({
        mascot_title: 'Kenalkan, “GLAWU” Maskot Resmi Pilkades Gunungjaya 2026',
        mascot_desc: 'Karakter sahabat pemilih yang ceria, berwibawa, dan sarat kearifan lokal. GLAWU hadir mengajak seluruh warga Desa Gunungjaya mewujudkan Pilkades yang aman, damai, bermartabat, dan tanpa politik uang.',
        mascot_slogan: '“Gunungjaya Guyub Rukun, Sukseskan Pilkades Bersama Glawu!”',
        mascot_speeches: [
          '“Sugeng rawuh sedulur sedaya! Aja lali cek DPS-mu ya, sak swaramu nemtokake masa depan Desa Gunungjaya!”',
          '“Beda pilihan kuwi lumrah lan wajar, sing penting paseduluran lan keguyuban tetep dijaga!”',
          '“Tolak Serangan Fajar & Politik Uang! Pilih pemimpin nganggo ati nurani sing resik.”',
          '“Tanggal pencoblosan teka gasik neng TPS jam 07.00 - 13.00 WIB, nggawa e-KTP ya Lur!”'
        ].join('\n'),
        ajakan_1_title: 'Cek NIK di DPT Secara Online Sekarang',
        ajakan_1_desc: 'Jangan menunggu hari H. Pastikan namamu sudah tertera di Daftar Pemilih Tetap (DPT) dan ketahui nomor TPS tempatmu mencoblos.',
        ajakan_2_title: 'Ketahui Visi, Misi, & Program Calon Kepala Desa',
        ajakan_2_desc: 'Pilihlah calon pemimpin yang memiliki komitmen tulus memajukan Desa Gunungjaya, transparan dalam anggaran desa, dan mengayomi seluruh warga.',
        ajakan_3_title: 'Tolak Segala Bentuk Politik Uang (Anti Money Politics)',
        ajakan_3_desc: 'Jangan gadaikan masa depan desa selama 6 tahun hanya demi nominal sesaat. Pemimpin berintegritas lahir dari pemilih yang bermartabat.',
        ajakan_4_title: 'Hadir Tepat Waktu di TPS (07.00 - 13.00 WIB)',
        ajakan_4_desc: 'Bawalah dokumen resmi (e-KTP asli / Surat Keterangan dan Surat Pemberitahuan/Model C6). Gunakan hak suaramu dan celupkan jari ke tinta!',
        data_phase: 'DPS',
        pengumuman: 'Pengecekan DPS Online telah dibuka. Pastikan NIK Anda terdaftar!',
      });
    }
  };

  const handleMascotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mascotForm.post(route('admin.settings.mascot'), {
      preserveScroll: true,
    });
  };

  // Search & Filter state for voters
  const [searchQuery, setSearchQuery] = useState(filters.search || '');
  const [selectedTpsFilter, setSelectedTpsFilter] = useState(filters.tps_id || 'all');
  const [selectedGenderFilter, setSelectedGenderFilter] = useState(filters.gender || 'all');

  // Modal States - TPS
  const [isTpsModalOpen, setIsTpsModalOpen] = useState(false);
  const [editingTps, setEditingTps] = useState<TpsItem | null>(null);
  const [deletingTps, setDeletingTps] = useState<TpsItem | null>(null);

  // Modal States - Voter
  const [isVoterModalOpen, setIsVoterModalOpen] = useState(false);
  const [editingVoter, setEditingVoter] = useState<VoterItem | null>(null);
  const [deletingVoter, setDeletingVoter] = useState<VoterItem | null>(null);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  // Form TPS
  const tpsForm = useForm({
    nomor_tps: '',
    nama_lokasi: '',
    dusun: '',
    alamat: '',
    rt: '',
    rw: '',
    keterangan: '',
  });

  // Form Voter
  const voterForm = useForm({
    nik: '',
    nama: '',
    jenis_kelamin: 'L',
    tps_id: allTpsOptions[0]?.id || '',
    dusun: '',
    rt: '',
    rw: '',
    tempat_lahir: '',
    tanggal_lahir: '',
    status: 'DPS',
    keterangan: '',
  });

  // Apply filters to voters list
  const applyVoterFilters = (search = searchQuery, tps = selectedTpsFilter, gender = selectedGenderFilter) => {
    router.get(
      route('admin.dashboard'),
      {
        tab: 'dps',
        search: search || undefined,
        tps_id: tps !== 'all' ? tps : undefined,
        gender: gender !== 'all' ? gender : undefined,
      },
      { preserveState: true, replace: true }
    );
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    applyVoterFilters();
  };

  // Open TPS Modal
  const openCreateTps = () => {
    setEditingTps(null);
    tpsForm.reset();
    tpsForm.clearErrors();
    setIsTpsModalOpen(true);
  };

  const openEditTps = (item: TpsItem) => {
    setEditingTps(item);
    tpsForm.setData({
      nomor_tps: item.nomor_tps,
      nama_lokasi: item.nama_lokasi,
      dusun: item.dusun,
      alamat: item.alamat || '',
      rt: item.rt || '',
      rw: item.rw || '',
      keterangan: item.keterangan || '',
    });
    tpsForm.clearErrors();
    setIsTpsModalOpen(true);
  };

  const submitTps = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingTps) {
      tpsForm.put(route('admin.tps.update', editingTps.id), {
        onSuccess: () => {
          setIsTpsModalOpen(false);
          tpsForm.reset();
        },
      });
    } else {
      tpsForm.post(route('admin.tps.store'), {
        onSuccess: () => {
          setIsTpsModalOpen(false);
          tpsForm.reset();
        },
      });
    }
  };

  const confirmDeleteTps = () => {
    if (!deletingTps) return;
    router.delete(route('admin.tps.destroy', deletingTps.id), {
      onSuccess: () => setDeletingTps(null),
    });
  };

  // Open Voter Modal
  const openCreateVoter = () => {
    setEditingVoter(null);
    voterForm.reset();
    voterForm.setData({
      nik: '',
      nama: '',
      jenis_kelamin: 'L',
      tps_id: allTpsOptions[0]?.id || '',
      dusun: '',
      rt: '',
      rw: '',
      tempat_lahir: '',
      tanggal_lahir: '',
      status: 'DPS',
      keterangan: '',
    });
    voterForm.clearErrors();
    setIsVoterModalOpen(true);
  };

  const openEditVoter = (voter: VoterItem) => {
    setEditingVoter(voter);
    voterForm.setData({
      nik: voter.nik,
      nama: voter.nama,
      jenis_kelamin: voter.jenis_kelamin,
      tps_id: voter.tps_id,
      dusun: voter.dusun || '',
      rt: voter.rt || '',
      rw: voter.rw || '',
      tempat_lahir: voter.tempat_lahir || '',
      tanggal_lahir: voter.tanggal_lahir ? voter.tanggal_lahir.substring(0, 10) : '',
      status: voter.status || 'DPS',
      keterangan: voter.keterangan || '',
    });
    voterForm.clearErrors();
    setIsVoterModalOpen(true);
  };

  const submitVoter = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingVoter) {
      voterForm.put(route('admin.voters.update', editingVoter.id), {
        onSuccess: () => {
          setIsVoterModalOpen(false);
          voterForm.reset();
        },
      });
    } else {
      voterForm.post(route('admin.voters.store'), {
        onSuccess: () => {
          setIsVoterModalOpen(false);
          voterForm.reset();
        },
      });
    }
  };

  const confirmDeleteVoter = () => {
    if (!deletingVoter) return;
    router.delete(route('admin.voters.destroy', deletingVoter.id), {
      onSuccess: () => setDeletingVoter(null),
    });
  };

  const pctL = stats.totalDps > 0 ? ((stats.totalL / stats.totalDps) * 100).toFixed(1) : '0';
  const pctP = stats.totalDps > 0 ? ((stats.totalP / stats.totalDps) * 100).toFixed(1) : '0';

  return (
    <div className="min-h-screen bg-[#F7F9FA] text-slate-800 pb-16">
      <Head title="Panel Administrasi Pilkades Gunungjaya 2026" />

      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b-2 border-slate-200 shadow-2xs">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-12 sm:h-14">
            {/* Logo & Portal Identity */}
            <div className="flex items-center gap-2 sm:gap-3 min-w-0 mr-2">
              <div className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center shrink-0">
                <img
                  src={DEFAULT_VILLAGE_LOGO}
                  alt="Logo Pilkades Gunungjaya"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 leading-none">
                  <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-wider text-[#1CB0F6] bg-[#DDF4FF] px-1.5 py-0.5 rounded-md border border-[#1CB0F6]/30 leading-none shrink-0">
                    PANEL ADMIN
                  </span>
                  <span className="hidden xs:inline-flex text-[8px] sm:text-[9px] font-bold uppercase tracking-wider text-[#58CC02] bg-[#E5F9D2] px-1.5 py-0.5 rounded-md border border-[#58CC02]/30 leading-none shrink-0">
                    PILKADES 2026
                  </span>
                </div>
                <h1 className="text-[11px] sm:text-sm font-black text-slate-900 tracking-tight leading-tight truncate mt-0.5">
                  P2KD DESA GUNUNGJAYA 2026
                </h1>
                <p className="hidden md:block text-[11px] font-semibold text-slate-500 truncate leading-none mt-0.5">
                  Kelola Data Lokasi TPS & Daftar Pemilih Sementara (DPS)
                </p>
              </div>
            </div>

            {/* Actions: View Public & Logout */}
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              <Link
                href={route('admin.profile.edit')}
                className="h-8 sm:h-9 px-2 sm:px-3 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-black text-xs uppercase tracking-wider border border-b-2 sm:border-2 sm:border-b-3 border-slate-200 hover:border-slate-300 active:translate-y-0.5 transition-all flex items-center justify-center gap-1.5 cursor-pointer shrink-0 shadow-2xs"
                title="Pengaturan Profil, WhatsApp & Password"
              >
                <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#58CC02]" />
                <span className="hidden sm:inline">Profil</span>
              </Link>

              <Link
                href="/"
                target="_blank"
                className="h-8 sm:h-9 px-2 sm:px-3 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-black text-xs uppercase tracking-wider border border-b-2 sm:border-2 sm:border-b-3 border-slate-200 hover:border-slate-300 active:translate-y-0.5 transition-all flex items-center justify-center gap-1.5 cursor-pointer shrink-0 shadow-2xs"
                title="Buka Website Publik Cek DPS"
              >
                <ExternalLink className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#1CB0F6]" />
                <span className="hidden sm:inline">Portal</span>
              </Link>

              <button
                type="button"
                onClick={() => router.post(route('logout'))}
                className="h-8 sm:h-9 px-2 sm:px-3 rounded-xl bg-[#FF4B4B] hover:bg-[#e03d3d] text-white font-black text-xs uppercase tracking-wider border-b-2 sm:border-b-3 border-[#EA2B2B] active:border-b-0 active:translate-y-0.5 transition-all flex items-center justify-center gap-1.5 cursor-pointer shrink-0 shadow-2xs"
                title="Keluar dari sesi administrator"
              >
                <LogOut className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Keluar</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 space-y-6">
        
        {/* Flash Notifications */}
        {flash?.success && (
          <div className="p-4 rounded-2xl bg-[#E5F9D2] border-2 border-[#58CC02] text-[#46A302] font-black text-sm flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              <span>{flash.success}</span>
            </div>
          </div>
        )}

        {flash?.error && (
          <div className="p-4 rounded-2xl bg-[#FFE5E5] border-2 border-[#FF4B4B] text-[#EA2B2B] font-black text-sm flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{flash.error}</span>
            </div>
          </div>
        )}

        {/* 4 Duolingo Tactile Overview Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total DPS */}
          <div className="bg-white border-2 border-b-4 border-slate-200 rounded-3xl p-5 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-black uppercase tracking-wider text-slate-500">
                Total Pemilih (DPS)
              </span>
              <div className="w-8 h-8 rounded-xl bg-[#58CC02] text-white flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {stats.totalDps.toLocaleString('id-ID')}
            </div>
            <span className="text-[11px] font-bold text-[#46A302] mt-1 block">
              100% Hak Suara Sementara
            </span>
          </div>

          {/* Laki-laki */}
          <div className="bg-white border-2 border-b-4 border-slate-200 rounded-3xl p-5 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-black uppercase tracking-wider text-[#1899D6]">
                Pemilih Laki-Laki
              </span>
              <div className="w-8 h-8 rounded-xl bg-[#1CB0F6] text-white flex items-center justify-center">
                <User className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {stats.totalL.toLocaleString('id-ID')}
            </div>
            <span className="text-[11px] font-bold text-[#1899D6] mt-1 block">
              {pctL}% dari total pemilih
            </span>
          </div>

          {/* Perempuan */}
          <div className="bg-white border-2 border-b-4 border-slate-200 rounded-3xl p-5 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-black uppercase tracking-wider text-[#E07700]">
                Pemilih Perempuan
              </span>
              <div className="w-8 h-8 rounded-xl bg-[#FF9600] text-white flex items-center justify-center">
                <User className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {stats.totalP.toLocaleString('id-ID')}
            </div>
            <span className="text-[11px] font-bold text-[#E07700] mt-1 block">
              {pctP}% dari total pemilih
            </span>
          </div>

          {/* Total TPS */}
          <div className="bg-white border-2 border-b-4 border-slate-200 rounded-3xl p-5 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-black uppercase tracking-wider text-slate-500">
                Lokasi TPS
              </span>
              <div className="w-8 h-8 rounded-xl bg-[#FFC800] text-amber-950 flex items-center justify-center">
                <MapPin className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {stats.totalTps}
            </div>
            <span className="text-[11px] font-bold text-slate-500 mt-1 block">
              Tersebar di wilayah dusun
            </span>
          </div>
        </div>

        {/* Tab Switcher: DPS vs TPS vs Redaksi & Maskot */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 border-b-2 border-slate-200 pb-3">
          <button
            type="button"
            onClick={() => setActiveTab('dps')}
            className={`w-full px-4 sm:px-5 py-3 rounded-2xl text-xs sm:text-sm font-black uppercase tracking-wider transition-all flex items-center justify-between sm:justify-center gap-2 cursor-pointer ${
              activeTab === 'dps'
                ? 'bg-[#58CC02] text-white border-b-4 border-[#46A302] shadow-sm'
                : 'bg-white hover:bg-slate-100 text-slate-600 border-2 border-slate-200'
            }`}
          >
            <span className="flex items-center gap-2">
              <Database className="w-4 h-4 shrink-0" />
              <span>Daftar Pemilih (DPS)</span>
            </span>
            <span className={`text-[10px] px-2 py-0.5 rounded-lg font-black shrink-0 ${
              activeTab === 'dps' ? 'bg-white text-[#58CC02]' : 'bg-slate-100 text-slate-600'
            }`}>
              {stats.totalDps.toLocaleString('id-ID')}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('tps')}
            className={`w-full px-4 sm:px-5 py-3 rounded-2xl text-xs sm:text-sm font-black uppercase tracking-wider transition-all flex items-center justify-between sm:justify-center gap-2 cursor-pointer ${
              activeTab === 'tps'
                ? 'bg-[#1CB0F6] text-white border-b-4 border-[#1899D6] shadow-sm'
                : 'bg-white hover:bg-slate-100 text-slate-600 border-2 border-slate-200'
            }`}
          >
            <span className="flex items-center gap-2">
              <MapPin className="w-4 h-4 shrink-0" />
              <span>Lokasi TPS</span>
            </span>
            <span className={`text-[10px] px-2 py-0.5 rounded-lg font-black shrink-0 ${
              activeTab === 'tps' ? 'bg-white text-[#1CB0F6]' : 'bg-slate-100 text-slate-600'
            }`}>
              {stats.totalTps} TPS
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('redaksi')}
            className={`w-full px-4 sm:px-5 py-3 rounded-2xl text-xs sm:text-sm font-black uppercase tracking-wider transition-all flex items-center justify-between sm:justify-center gap-2 cursor-pointer ${
              activeTab === 'redaksi'
                ? 'bg-[#9333EA] text-white border-b-4 border-[#7E22CE] shadow-sm'
                : 'bg-white hover:bg-slate-100 text-slate-600 border-2 border-slate-200'
            }`}
          >
            <span className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 shrink-0 text-amber-300" />
              <span>Redaksi & Maskot</span>
            </span>
            <span className={`text-[10px] px-2 py-0.5 rounded-lg font-black shrink-0 ${
              activeTab === 'redaksi' ? 'bg-white text-[#9333EA]' : 'bg-purple-100 text-purple-700'
            }`}>
              Si Glawu ✨
            </span>
          </button>
        </div>

        {/* TAB 1: KELOLA DAFTAR PEMILIH SEMENTARA (DPS) */}
        {activeTab === 'dps' && (
          <div className="bg-white border-2 border-b-4 border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
            
            {/* Header DPS & Action */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b-2 border-slate-100">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  Daftar Pemilih Sementara (DPS)
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
                  Tambah, perbarui, dan sesuaikan data pemilih Pilkades Gunungjaya.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2.5 self-start sm:self-auto">
                <a
                  href="/admin/voters/template-excel"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2.5 rounded-2xl bg-white hover:bg-slate-100 text-[#1CB0F6] font-black text-xs uppercase tracking-wider border-2 border-[#1CB0F6]/30 hover:border-[#1CB0F6] active:translate-y-0.5 transition-all flex items-center gap-2 shadow-xs cursor-pointer"
                  title="Unduh format template Excel sesuai formulir panitia"
                >
                  <Download className="w-4 h-4" />
                  <span>Format Excel</span>
                </a>

                <button
                  type="button"
                  onClick={() => setIsImportModalOpen(true)}
                  className="px-3.5 py-2.5 rounded-2xl bg-[#1CB0F6] hover:bg-[#189ddb] text-white font-black text-xs uppercase tracking-wider border-b-4 border-[#1899D6] active:border-b-0 active:translate-y-1 transition-all flex items-center gap-2 shadow-xs cursor-pointer"
                >
                  <FileSpreadsheet className="w-4 h-4" />
                  <span>Import Excel DPS</span>
                </button>

                <button
                  type="button"
                  onClick={openCreateVoter}
                  className="px-4 py-2.5 rounded-2xl bg-[#58CC02] hover:bg-[#4ebb02] text-white font-black text-xs uppercase tracking-wider border-b-4 border-[#46A302] active:border-b-0 active:translate-y-1 transition-all flex items-center gap-2 shadow-xs cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Tambah Manual</span>
                </button>
              </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
              {/* Search input */}
              <form onSubmit={handleSearchSubmit} className="md:col-span-6 flex gap-2">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Cari NIK, Nama Pemilih, atau Dusun..."
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-2 border-slate-200 rounded-2xl text-xs sm:text-sm font-bold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#58CC02] focus:bg-white"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-900 text-white font-black text-xs uppercase tracking-wider cursor-pointer"
                >
                  Cari
                </button>
              </form>

              {/* Filter TPS */}
              <div className="md:col-span-3">
                <select
                  value={selectedTpsFilter}
                  onChange={(e) => {
                    setSelectedTpsFilter(e.target.value);
                    applyVoterFilters(searchQuery, e.target.value, selectedGenderFilter);
                  }}
                  className="w-full py-2.5 px-3 bg-slate-50 border-2 border-slate-200 rounded-2xl text-xs font-bold text-slate-800 focus:outline-none focus:border-[#58CC02]"
                >
                  <option value="all">Semua Lokasi TPS</option>
                  {allTpsOptions.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.nomor_tps} - {t.nama_lokasi}
                    </option>
                  ))}
                </select>
              </div>

              {/* Filter Gender */}
              <div className="md:col-span-3">
                <select
                  value={selectedGenderFilter}
                  onChange={(e) => {
                    setSelectedGenderFilter(e.target.value);
                    applyVoterFilters(searchQuery, selectedTpsFilter, e.target.value);
                  }}
                  className="w-full py-2.5 px-3 bg-slate-50 border-2 border-slate-200 rounded-2xl text-xs font-bold text-slate-800 focus:outline-none focus:border-[#58CC02]"
                >
                  <option value="all">Semua Jenis Kelamin (L/P)</option>
                  <option value="L">Laki-Laki (L)</option>
                  <option value="P">Perempuan (P)</option>
                </select>
              </div>
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto rounded-2xl border-2 border-slate-200">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-600 border-b-2 border-slate-200 uppercase text-[11px] font-black">
                    <th className="py-3.5 px-4">NIK & Pemilih</th>
                    <th className="py-3.5 px-3 text-center">L/P</th>
                    <th className="py-3.5 px-4">Alamat / Dusun</th>
                    <th className="py-3.5 px-4">Lokasi TPS</th>
                    <th className="py-3.5 px-3 text-center">Status</th>
                    <th className="py-3.5 px-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y-2 divide-slate-100">
                  {voters.data.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-400 font-bold">
                        Tidak ada data pemilih yang sesuai dengan pencarian atau filter.
                      </td>
                    </tr>
                  ) : (
                    voters.data.map((voter) => (
                      <tr key={voter.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 px-4">
                          <span className="font-black text-slate-900 text-sm block">
                            {voter.nama}
                          </span>
                          <span className="text-xs font-extrabold text-[#1CB0F6] tracking-wider">
                            {voter.nik}
                          </span>
                        </td>
                        <td className="py-3.5 px-3 text-center">
                          <span className={`px-2 py-0.5 rounded-lg text-xs font-black ${
                            voter.jenis_kelamin === 'L'
                              ? 'bg-[#DDF4FF] text-[#1899D6] border border-[#1CB0F6]/30'
                              : 'bg-[#FFEACC] text-[#E07700] border border-[#FF9600]/30'
                          }`}>
                            {voter.jenis_kelamin === 'L' ? 'L' : 'P'}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="font-bold text-slate-800 block">
                            {voter.dusun || 'Desa Gunungjaya'}
                          </span>
                          <span className="text-[11px] text-slate-400 font-medium">
                            RT {voter.rt || '-'} / RW {voter.rw || '-'}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="px-2.5 py-1 bg-[#1CB0F6] text-white font-black text-xs rounded-xl inline-block">
                            {voter.tps?.nomor_tps || 'TPS Belum Ditentukan'}
                          </span>
                          <span className="text-[11px] text-slate-500 font-medium block mt-0.5">
                            {voter.tps?.nama_lokasi}
                          </span>
                        </td>
                        <td className="py-3.5 px-3 text-center">
                          <span className="px-2 py-0.5 rounded-lg bg-[#E5F9D2] text-[#46A302] border border-[#58CC02]/30 text-[11px] font-black uppercase">
                            {voter.status || 'DPS'}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => openEditVoter(voter)}
                              className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer"
                              title="Edit Data Pemilih"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeletingVoter(voter)}
                              className="p-1.5 rounded-xl bg-[#FFE5E5] hover:bg-[#ffd1d1] text-[#EA2B2B] transition cursor-pointer"
                              title="Hapus Pemilih"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile Card Grid View */}
            <div className="md:hidden space-y-3">
              {voters.data.length === 0 ? (
                <div className="p-6 text-center text-slate-400 font-bold bg-slate-50 rounded-2xl border-2 border-slate-200">
                  Tidak ada data pemilih yang sesuai filter.
                </div>
              ) : (
                voters.data.map((voter) => (
                  <div
                    key={voter.id}
                    className="p-4 bg-slate-50 border-2 border-b-4 border-slate-200 rounded-2xl space-y-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="font-black text-slate-900 text-sm block">
                          {voter.nama}
                        </span>
                        <span className="text-xs font-black text-[#1CB0F6] tracking-wider block">
                          {voter.nik}
                        </span>
                      </div>
                      <span className={`px-2.5 py-1 rounded-xl text-xs font-black ${
                        voter.jenis_kelamin === 'L'
                          ? 'bg-[#DDF4FF] text-[#1899D6] border border-[#1CB0F6]/30'
                          : 'bg-[#FFEACC] text-[#E07700] border border-[#FF9600]/30'
                      }`}>
                        {voter.jenis_kelamin === 'L' ? 'Laki-Laki' : 'Perempuan'}
                      </span>
                    </div>

                    <div className="text-xs space-y-1 text-slate-600 font-medium pt-2 border-t border-slate-200">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Dusun / RT-RW:</span>
                        <span className="font-bold text-slate-800">{voter.dusun || '-'} (RT {voter.rt || '-'}/RW {voter.rw || '-'})</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Lokasi TPS:</span>
                        <span className="px-2 py-0.5 bg-[#1CB0F6] text-white rounded-lg font-black text-[11px]">
                          {voter.tps?.nomor_tps || 'TPS Belum Ditentukan'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                      <span className="px-2 py-0.5 rounded-lg bg-[#E5F9D2] text-[#46A302] border border-[#58CC02]/30 text-[10px] font-black uppercase">
                        {voter.status || 'DPS'}
                      </span>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => openEditVoter(voter)}
                          className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1 cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeletingVoter(voter)}
                          className="px-3 py-1.5 rounded-xl bg-[#FFE5E5] text-[#EA2B2B] font-bold text-xs flex items-center gap-1 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Hapus</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Pagination */}
            {voters.links && voters.links.length > 3 && (
              <div className="flex flex-wrap items-center justify-between gap-3 pt-3">
                <span className="text-xs text-slate-500 font-bold">
                  Menampilkan {voters.data.length} dari {voters.total.toLocaleString('id-ID')} pemilih
                </span>
                <div className="flex items-center gap-1">
                  {voters.links.map((link, idx) => {
                    const label = link.label.replace('&laquo;', '«').replace('&raquo;', '»');
                    if (!link.url) {
                      return (
                        <span
                          key={idx}
                          className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-300 bg-slate-50"
                        >
                          {label}
                        </span>
                      );
                    }
                    return (
                      <Link
                        key={idx}
                        href={link.url}
                        preserveState
                        className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
                          link.active
                            ? 'bg-[#58CC02] text-white border-b-2 border-[#46A302]'
                            : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                        }`}
                      >
                        {label}
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: KELOLA LOKASI TPS */}
        {activeTab === 'tps' && (
          <div className="bg-white border-2 border-b-4 border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
            
            {/* Header TPS & Action */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b-2 border-slate-100">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  Lokasi Tempat Pemungutan Suara (TPS)
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
                  Atur daftar TPS, nama gedung/lokasi, alamat dusun, dan wilayah pemilih.
                </p>
              </div>

              <button
                type="button"
                onClick={openCreateTps}
                className="px-4 py-2.5 rounded-2xl bg-[#1CB0F6] hover:bg-[#189ddb] text-white font-black text-xs uppercase tracking-wider border-b-4 border-[#1899D6] active:border-b-0 active:translate-y-1 transition-all flex items-center gap-2 shadow-xs cursor-pointer self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah Lokasi TPS Baru</span>
              </button>
            </div>

            {/* TPS Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {tpsList.map((tps) => (
                <div
                  key={tps.id}
                  className="bg-slate-50 border-2 border-b-4 border-slate-200 rounded-3xl p-5 space-y-4 hover:border-[#1CB0F6] transition-all"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <span className="px-3 py-1 rounded-xl bg-[#1CB0F6] text-white font-black text-xs">
                        {tps.nomor_tps}
                      </span>
                      <span className="text-xs font-black uppercase text-slate-500">
                        {tps.dusun}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => openEditTps(tps)}
                        className="p-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                        title="Edit Lokasi TPS"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeletingTps(tps)}
                        className="p-1.5 rounded-xl bg-[#FFE5E5] text-[#EA2B2B] hover:bg-[#ffd1d1] transition cursor-pointer"
                        title="Hapus TPS"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-base font-black text-slate-900 leading-snug">
                      {tps.nama_lokasi}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium mt-1">
                      {tps.alamat || `Wilayah Dusun ${tps.dusun}`}
                    </p>
                    {(tps.rt || tps.rw) && (
                      <span className="text-[11px] font-bold text-slate-400 mt-0.5 block">
                        Cakupan: RT {tps.rt || '-'} / RW {tps.rw || '-'}
                      </span>
                    )}
                  </div>

                  {/* Voter Count Stats on this TPS */}
                  <div className="pt-3 border-t-2 border-slate-200 grid grid-cols-3 gap-2 text-center">
                    <div className="bg-white p-2 rounded-xl border border-slate-200">
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Laki-Laki</span>
                      <span className="text-xs font-black text-[#1899D6]">
                        {(tps.total_laki_laki ?? 0).toLocaleString('id-ID')}
                      </span>
                    </div>
                    <div className="bg-white p-2 rounded-xl border border-slate-200">
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Perempuan</span>
                      <span className="text-xs font-black text-[#E07700]">
                        {(tps.total_perempuan ?? 0).toLocaleString('id-ID')}
                      </span>
                    </div>
                    <div className="bg-white p-2 rounded-xl border border-slate-200">
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Total</span>
                      <span className="text-xs font-black text-[#46A302]">
                        {(tps.total_voters ?? 0).toLocaleString('id-ID')}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: PENGATURAN REDAKSI & MASKOT SI GLAWU */}
        {activeTab === 'redaksi' && (
          <div className="space-y-6">
            {/* Header Redaksi */}
            <div className="bg-white border-2 border-b-4 border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-purple-100 text-[#9333EA] flex items-center justify-center border-2 border-purple-200 shrink-0 shadow-xs">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                      <span>Pengaturan Redaksi & Maskot Si Glawu</span>
                      <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-700 font-black">
                        Admin Live Editor
                      </span>
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
                      Ubah sapaan dialog, slogan, judul maskot, serta 4 poin himbauan warga yang langsung tampil di portal publik.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    href="/#maskot"
                    target="_blank"
                    className="px-4 py-2 rounded-2xl bg-purple-50 hover:bg-purple-100 text-[#9333EA] font-black text-xs uppercase tracking-wider border-2 border-purple-200 active:translate-y-0.5 transition-all flex items-center gap-2 cursor-pointer shadow-2xs"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Lihat di Beranda</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Live Interactive Preview Card of Glawu speaking */}
            <div className="bg-gradient-to-br from-purple-50 via-white to-amber-50/40 border-2 border-b-4 border-purple-200 rounded-3xl p-6 sm:p-8 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-purple-800 text-xs font-black uppercase tracking-wider">
                  <MessageSquareQuote className="w-4 h-4 text-purple-600" />
                  <span>Pratinjau Langsung Balon Bicara Si Glawu</span>
                </div>
                <button
                  type="button"
                  onClick={handleNextPreviewSpeech}
                  className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-black text-xs transition cursor-pointer shadow-2xs flex items-center gap-1.5"
                  title="Klik untuk melihat kalimat berikutnya"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Uji Putar Ucapan ({previewSpeeches.length} baris)</span>
                </button>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-6 bg-white/80 p-5 rounded-2xl border-2 border-purple-100">
                <img
                  src={DEFAULT_MASCOT_GLAWU}
                  alt="Maskot Glawu"
                  className="w-24 h-24 sm:w-28 sm:h-28 object-contain shrink-0 drop-shadow-md animate-bounce-subtle"
                />
                <div className="flex-1 space-y-2 text-center sm:text-left">
                  <div className="inline-block relative bg-white border-2 border-b-4 border-purple-300 rounded-2xl p-4 shadow-sm text-slate-800 font-bold text-sm sm:text-base leading-relaxed">
                    <span className="text-purple-600 font-black mr-2">“Glawu:”</span>
                    {currentPreviewSpeech}
                  </div>
                  <p className="text-[11px] text-slate-500 font-medium">
                    * Kalimat di atas diambil langsung dari baris yang Anda ketik di kolom ucapan di bawah.
                  </p>
                </div>
              </div>
            </div>

            {/* Form Settings Redaksi */}
            <form onSubmit={handleMascotSubmit} className="space-y-6">
              
              {/* SECTION 1: Kalimat Sapaan Si Glawu (Rotasi Balon Dialog) */}
              <div className="bg-white border-2 border-b-4 border-slate-200 rounded-3xl p-6 sm:p-8 space-y-4 shadow-sm">
                <div className="flex items-center gap-2.5 pb-3 border-b-2 border-slate-100">
                  <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-black text-sm">
                    1
                  </div>
                  <div>
                    <h3 className="text-base font-black text-slate-900">
                      Kalimat Sapaan Si Glawu (Rotasi Balon Dialog)
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">
                      Tuliskan <strong>1 kalimat per baris</strong>. Balon dialog Si Glawu akan menampilkan dan merotasi kalimat-kalimat ini secara bergantian.
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-black uppercase text-slate-700 tracking-wider">
                    Daftar Ucapan / Sapaan (1 Baris = 1 Balon Dialog):
                  </label>
                  <textarea
                    rows={6}
                    value={mascotForm.data.mascot_speeches}
                    onChange={(e) => mascotForm.setData('mascot_speeches', e.target.value)}
                    placeholder="Tuliskan ucapan Glawu di sini, tekan Enter untuk kalimat berikutnya..."
                    className="w-full px-4 py-3 rounded-2xl border-2 border-slate-200 focus:border-[#9333EA] focus:ring-0 text-slate-900 font-medium text-sm leading-relaxed transition shadow-2xs resize-y"
                    required
                  />
                  {mascotForm.errors.mascot_speeches && (
                    <p className="text-xs font-bold text-red-500">{mascotForm.errors.mascot_speeches}</p>
                  )}
                  <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
                    <span>💡 Tips: Gunakan bahasa santai, ajakan damai, atau bahasa Banyumasan khas desa agar ramah warga.</span>
                    <span className="font-bold text-purple-700">
                      {previewSpeeches.length} baris terdeteksi
                    </span>
                  </div>
                </div>
              </div>

              {/* SECTION 2: Identitas & Slogan Maskot */}
              <div className="bg-white border-2 border-b-4 border-slate-200 rounded-3xl p-6 sm:p-8 space-y-4 shadow-sm">
                <div className="flex items-center gap-2.5 pb-3 border-b-2 border-slate-100">
                  <div className="w-8 h-8 rounded-xl bg-[#1CB0F6]/15 text-[#1CB0F6] flex items-center justify-center font-black text-sm">
                    2
                  </div>
                  <div>
                    <h3 className="text-base font-black text-slate-900">
                      Identitas & Slogan Utama Maskot
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">
                      Judul dan deskripsi profil Si Glawu yang tampil pada kartu pengenalan maskot.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-black uppercase text-slate-700 tracking-wider">
                      Judul Maskot:
                    </label>
                    <input
                      type="text"
                      value={mascotForm.data.mascot_title}
                      onChange={(e) => mascotForm.setData('mascot_title', e.target.value)}
                      placeholder="Contoh: Kenalkan, “GLAWU” Maskot Resmi Pilkades..."
                      className="w-full px-4 py-3 rounded-2xl border-2 border-slate-200 focus:border-[#9333EA] focus:ring-0 text-slate-900 font-bold text-sm transition shadow-2xs"
                      required
                    />
                    {mascotForm.errors.mascot_title && (
                      <p className="text-xs font-bold text-red-500">{mascotForm.errors.mascot_title}</p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-black uppercase text-slate-700 tracking-wider">
                      Slogan Utama Pilkades:
                    </label>
                    <input
                      type="text"
                      value={mascotForm.data.mascot_slogan}
                      onChange={(e) => mascotForm.setData('mascot_slogan', e.target.value)}
                      placeholder="Contoh: “Gunungjaya Guyub Rukun, Sukseskan Pilkades Bersama Glawu!”"
                      className="w-full px-4 py-3 rounded-2xl border-2 border-slate-200 focus:border-[#9333EA] focus:ring-0 text-slate-900 font-bold text-sm transition shadow-2xs"
                      required
                    />
                    {mascotForm.errors.mascot_slogan && (
                      <p className="text-xs font-bold text-red-500">{mascotForm.errors.mascot_slogan}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-black uppercase text-slate-700 tracking-wider">
                    Deskripsi Karakter & Filosofi Maskot:
                  </label>
                  <textarea
                    rows={3}
                    value={mascotForm.data.mascot_desc}
                    onChange={(e) => mascotForm.setData('mascot_desc', e.target.value)}
                    placeholder="Jelaskan karakter Si Glawu dan nilai yang dibawanya..."
                    className="w-full px-4 py-3 rounded-2xl border-2 border-slate-200 focus:border-[#9333EA] focus:ring-0 text-slate-900 font-medium text-sm leading-relaxed transition shadow-2xs"
                    required
                  />
                  {mascotForm.errors.mascot_desc && (
                    <p className="text-xs font-bold text-red-500">{mascotForm.errors.mascot_desc}</p>
                  )}
                </div>
              </div>

              {/* SECTION 3: 4 Poin Ajakan / Himbauan Warga */}
              <div className="bg-white border-2 border-b-4 border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
                <div className="flex items-center gap-2.5 pb-3 border-b-2 border-slate-100">
                  <div className="w-8 h-8 rounded-xl bg-[#FF9600]/15 text-[#E07700] flex items-center justify-center font-black text-sm">
                    3
                  </div>
                  <div>
                    <h3 className="text-base font-black text-slate-900">
                      4 Pesan Edukasi & Himbauan Warga
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">
                      4 kartu edukasi pemilih yang tampil di samping gambar Si Glawu pada halaman publik.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Ajakan 1 */}
                  <div className="bg-slate-50 border-2 border-b-4 border-slate-200 rounded-2xl p-4 space-y-3">
                    <div className="flex items-center gap-2 text-slate-700 font-black text-xs uppercase tracking-wider">
                      <span className="w-6 h-6 rounded-lg bg-[#58CC02] text-white flex items-center justify-center text-xs">
                        1
                      </span>
                      <span>Poin Ajakan 1</span>
                    </div>
                    <div>
                      <input
                        type="text"
                        value={mascotForm.data.ajakan_1_title}
                        onChange={(e) => mascotForm.setData('ajakan_1_title', e.target.value)}
                        placeholder="Judul ajakan 1"
                        className="w-full px-3.5 py-2 rounded-xl border-2 border-slate-200 focus:border-[#9333EA] focus:ring-0 text-slate-900 font-bold text-xs mb-2 bg-white"
                        required
                      />
                      <textarea
                        rows={2}
                        value={mascotForm.data.ajakan_1_desc}
                        onChange={(e) => mascotForm.setData('ajakan_1_desc', e.target.value)}
                        placeholder="Uraian pesan ajakan 1"
                        className="w-full px-3.5 py-2 rounded-xl border-2 border-slate-200 focus:border-[#9333EA] focus:ring-0 text-slate-800 text-xs bg-white"
                        required
                      />
                    </div>
                  </div>

                  {/* Ajakan 2 */}
                  <div className="bg-slate-50 border-2 border-b-4 border-slate-200 rounded-2xl p-4 space-y-3">
                    <div className="flex items-center gap-2 text-slate-700 font-black text-xs uppercase tracking-wider">
                      <span className="w-6 h-6 rounded-lg bg-[#1CB0F6] text-white flex items-center justify-center text-xs">
                        2
                      </span>
                      <span>Poin Ajakan 2</span>
                    </div>
                    <div>
                      <input
                        type="text"
                        value={mascotForm.data.ajakan_2_title}
                        onChange={(e) => mascotForm.setData('ajakan_2_title', e.target.value)}
                        placeholder="Judul ajakan 2"
                        className="w-full px-3.5 py-2 rounded-xl border-2 border-slate-200 focus:border-[#9333EA] focus:ring-0 text-slate-900 font-bold text-xs mb-2 bg-white"
                        required
                      />
                      <textarea
                        rows={2}
                        value={mascotForm.data.ajakan_2_desc}
                        onChange={(e) => mascotForm.setData('ajakan_2_desc', e.target.value)}
                        placeholder="Uraian pesan ajakan 2"
                        className="w-full px-3.5 py-2 rounded-xl border-2 border-slate-200 focus:border-[#9333EA] focus:ring-0 text-slate-800 text-xs bg-white"
                        required
                      />
                    </div>
                  </div>

                  {/* Ajakan 3 */}
                  <div className="bg-slate-50 border-2 border-b-4 border-slate-200 rounded-2xl p-4 space-y-3">
                    <div className="flex items-center gap-2 text-slate-700 font-black text-xs uppercase tracking-wider">
                      <span className="w-6 h-6 rounded-lg bg-[#FF4B4B] text-white flex items-center justify-center text-xs">
                        3
                      </span>
                      <span>Poin Ajakan 3 (Anti Money Politics)</span>
                    </div>
                    <div>
                      <input
                        type="text"
                        value={mascotForm.data.ajakan_3_title}
                        onChange={(e) => mascotForm.setData('ajakan_3_title', e.target.value)}
                        placeholder="Judul ajakan 3"
                        className="w-full px-3.5 py-2 rounded-xl border-2 border-slate-200 focus:border-[#9333EA] focus:ring-0 text-slate-900 font-bold text-xs mb-2 bg-white"
                        required
                      />
                      <textarea
                        rows={2}
                        value={mascotForm.data.ajakan_3_desc}
                        onChange={(e) => mascotForm.setData('ajakan_3_desc', e.target.value)}
                        placeholder="Uraian pesan ajakan 3"
                        className="w-full px-3.5 py-2 rounded-xl border-2 border-slate-200 focus:border-[#9333EA] focus:ring-0 text-slate-800 text-xs bg-white"
                        required
                      />
                    </div>
                  </div>

                  {/* Ajakan 4 */}
                  <div className="bg-slate-50 border-2 border-b-4 border-slate-200 rounded-2xl p-4 space-y-3">
                    <div className="flex items-center gap-2 text-slate-700 font-black text-xs uppercase tracking-wider">
                      <span className="w-6 h-6 rounded-lg bg-[#FF9600] text-white flex items-center justify-center text-xs">
                        4
                      </span>
                      <span>Poin Ajakan 4</span>
                    </div>
                    <div>
                      <input
                        type="text"
                        value={mascotForm.data.ajakan_4_title}
                        onChange={(e) => mascotForm.setData('ajakan_4_title', e.target.value)}
                        placeholder="Judul ajakan 4"
                        className="w-full px-3.5 py-2 rounded-xl border-2 border-slate-200 focus:border-[#9333EA] focus:ring-0 text-slate-900 font-bold text-xs mb-2 bg-white"
                        required
                      />
                      <textarea
                        rows={2}
                        value={mascotForm.data.ajakan_4_desc}
                        onChange={(e) => mascotForm.setData('ajakan_4_desc', e.target.value)}
                        placeholder="Uraian pesan ajakan 4"
                        className="w-full px-3.5 py-2 rounded-xl border-2 border-slate-200 focus:border-[#9333EA] focus:ring-0 text-slate-800 text-xs bg-white"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 4: Pengaturan Tambahan (Tahapan Data & Pengumuman) */}
              <div className="bg-white border-2 border-b-4 border-slate-200 rounded-3xl p-6 sm:p-8 space-y-4 shadow-sm">
                <div className="flex items-center gap-2.5 pb-3 border-b-2 border-slate-100">
                  <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-black text-sm">
                    4
                  </div>
                  <div>
                    <h3 className="text-base font-black text-slate-900">
                      Tahapan Data & Pengumuman Berjalan
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">
                      Status tahapan daftar pemilih dan teks banner pengumuman di portal publik.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-black uppercase text-slate-700 tracking-wider">
                      Fase / Tahapan Data:
                    </label>
                    <select
                      value={mascotForm.data.data_phase || 'DPS'}
                      onChange={(e) => mascotForm.setData('data_phase', e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl border-2 border-slate-200 focus:border-[#9333EA] focus:ring-0 text-slate-900 font-bold text-sm bg-white cursor-pointer shadow-2xs"
                    >
                      <option value="DPS">DPS (Daftar Pemilih Sementara)</option>
                      <option value="DPSHP">DPSHP (Hasil Perbaikan)</option>
                      <option value="DPT">DPT (Daftar Pemilih Tetap)</option>
                      <option value="DPTb">DPTb (Pemilih Tambahan)</option>
                    </select>
                  </div>

                  <div className="md:col-span-2 space-y-1.5">
                    <label className="block text-xs font-black uppercase text-slate-700 tracking-wider">
                      Teks Pengumuman / Marquee:
                    </label>
                    <input
                      type="text"
                      value={mascotForm.data.pengumuman || ''}
                      onChange={(e) => mascotForm.setData('pengumuman', e.target.value)}
                      placeholder="Contoh: Pengecekan DPS Online telah dibuka..."
                      className="w-full px-4 py-3 rounded-2xl border-2 border-slate-200 focus:border-[#9333EA] focus:ring-0 text-slate-900 font-medium text-sm transition shadow-2xs"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons: Save & Reset */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                <button
                  type="button"
                  onClick={handleResetMascotDefaults}
                  className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-white hover:bg-slate-100 text-slate-600 font-black text-xs uppercase tracking-wider border-2 border-slate-200 active:translate-y-0.5 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
                >
                  <RotateCcw className="w-4 h-4 text-slate-400" />
                  <span>Kembalikan ke Teks Bawaan</span>
                </button>

                <button
                  type="submit"
                  disabled={mascotForm.processing}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-[#9333EA] hover:bg-[#7E22CE] text-white font-black text-sm uppercase tracking-wider border-b-4 border-[#6B21A8] active:border-b-0 active:translate-y-1 transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer disabled:opacity-50"
                >
                  <Save className="w-5 h-5 text-amber-300" />
                  <span>{mascotForm.processing ? 'Menyimpan...' : 'Simpan Semua Perubahan Redaksi'}</span>
                </button>
              </div>

            </form>
          </div>
        )}
      </main>

      {/* MODAL: TAMBAH / EDIT TPS */}
      {isTpsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white border-2 border-b-4 border-slate-200 rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b-2 border-slate-100">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[#1CB0F6]" />
                <h3 className="text-lg font-black text-slate-900">
                  {editingTps ? `Edit ${editingTps.nomor_tps}` : 'Tambah Lokasi TPS Baru'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsTpsModalOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={submitTps} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-black uppercase text-slate-700 mb-1">
                    Nomor TPS *
                  </label>
                  <input
                    type="text"
                    value={tpsForm.data.nomor_tps}
                    onChange={(e) => tpsForm.setData('nomor_tps', e.target.value)}
                    placeholder="Contoh: TPS 06"
                    required
                    className="w-full px-3 py-2 bg-slate-50 border-2 border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-[#1CB0F6]"
                  />
                  {tpsForm.errors.nomor_tps && (
                    <span className="text-[10px] text-[#EA2B2B] font-bold block mt-1">
                      {tpsForm.errors.nomor_tps}
                    </span>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-black uppercase text-slate-700 mb-1">
                    Wilayah Dusun *
                  </label>
                  <input
                    type="text"
                    value={tpsForm.data.dusun}
                    onChange={(e) => tpsForm.setData('dusun', e.target.value)}
                    placeholder="Contoh: Dusun Krajan"
                    required
                    className="w-full px-3 py-2 bg-slate-50 border-2 border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-[#1CB0F6]"
                  />
                  {tpsForm.errors.dusun && (
                    <span className="text-[10px] text-[#EA2B2B] font-bold block mt-1">
                      {tpsForm.errors.dusun}
                    </span>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-slate-700 mb-1">
                  Nama Tempat / Gedung TPS *
                </label>
                <input
                  type="text"
                  value={tpsForm.data.nama_lokasi}
                  onChange={(e) => tpsForm.setData('nama_lokasi', e.target.value)}
                  placeholder="Contoh: Gedung MDA Nurul Huda"
                  required
                  className="w-full px-3 py-2 bg-slate-50 border-2 border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-[#1CB0F6]"
                />
                {tpsForm.errors.nama_lokasi && (
                  <span className="text-[10px] text-[#EA2B2B] font-bold block mt-1">
                    {tpsForm.errors.nama_lokasi}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-black uppercase text-slate-700 mb-1">
                    Cakupan RT
                  </label>
                  <input
                    type="text"
                    value={tpsForm.data.rt}
                    onChange={(e) => tpsForm.setData('rt', e.target.value)}
                    placeholder="Contoh: 01, 02, 03"
                    className="w-full px-3 py-2 bg-slate-50 border-2 border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-[#1CB0F6]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black uppercase text-slate-700 mb-1">
                    Cakupan RW
                  </label>
                  <input
                    type="text"
                    value={tpsForm.data.rw}
                    onChange={(e) => tpsForm.setData('rw', e.target.value)}
                    placeholder="Contoh: 01"
                    className="w-full px-3 py-2 bg-slate-50 border-2 border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-[#1CB0F6]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-slate-700 mb-1">
                  Alamat Lengkap / Patokan
                </label>
                <textarea
                  rows={2}
                  value={tpsForm.data.alamat}
                  onChange={(e) => tpsForm.setData('alamat', e.target.value)}
                  placeholder="Jalan, nomor rumah, atau dekat fasilitas umum..."
                  className="w-full px-3 py-2 bg-slate-50 border-2 border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-[#1CB0F6]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsTpsModalOpen(false)}
                  className="px-4 py-2.5 rounded-2xl bg-white hover:bg-slate-100 text-slate-700 font-bold border-2 border-slate-200 text-xs uppercase tracking-wider cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={tpsForm.processing}
                  className="px-5 py-2.5 rounded-2xl bg-[#1CB0F6] hover:bg-[#189ddb] text-white font-black text-xs uppercase tracking-wider border-b-4 border-[#1899D6] active:border-b-0 active:translate-y-1 transition-all cursor-pointer disabled:opacity-50"
                >
                  {tpsForm.processing ? 'Menyimpan...' : editingTps ? 'Simpan Perubahan' : 'Tambah TPS'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: KONFIRMASI HAPUS TPS */}
      {deletingTps && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white border-2 border-b-4 border-slate-200 rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-xl">
            <div className="w-12 h-12 rounded-2xl bg-[#FFE5E5] text-[#EA2B2B] flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div className="text-center">
              <h3 className="text-base font-black text-slate-900">
                Hapus {deletingTps.nomor_tps}?
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-1">
                Lokasi <strong>{deletingTps.nama_lokasi}</strong> akan dihapus. Pemilih pada TPS ini akan berstatus tanpa TPS.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeletingTps(null)}
                className="py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs uppercase cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={confirmDeleteTps}
                className="py-2.5 rounded-2xl bg-[#FF4B4B] hover:bg-[#e03d3d] text-white font-black text-xs uppercase border-b-4 border-[#EA2B2B] active:border-b-0 active:translate-y-1 transition-all cursor-pointer"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: TAMBAH / EDIT PEMILIH DPS */}
      {isVoterModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white border-2 border-b-4 border-slate-200 rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-5 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b-2 border-slate-100">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-[#58CC02]" />
                <h3 className="text-lg font-black text-slate-900">
                  {editingVoter ? 'Edit Data Pemilih DPS' : 'Tambah Pemilih Baru ke DPS'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsVoterModalOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={submitVoter} className="space-y-4">
              <div>
                <label className="block text-xs font-black uppercase text-slate-700 mb-1">
                  Nomor Induk Kependudukan (NIK 16 Digit) *
                </label>
                <input
                  type="text"
                  maxLength={16}
                  value={voterForm.data.nik}
                  onChange={(e) => voterForm.setData('nik', e.target.value.replace(/\D/g, ''))}
                  placeholder="332709xxxxxxxxxx"
                  required
                  className="w-full px-3 py-2 bg-slate-50 border-2 border-slate-200 rounded-xl text-xs font-extrabold tracking-wider text-slate-900 focus:outline-none focus:border-[#58CC02]"
                />
                {voterForm.errors.nik && (
                  <span className="text-[10px] text-[#EA2B2B] font-bold block mt-1">
                    {voterForm.errors.nik}
                  </span>
                )}
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-slate-700 mb-1">
                  Nama Lengkap Pemilih *
                </label>
                <input
                  type="text"
                  value={voterForm.data.nama}
                  onChange={(e) => voterForm.setData('nama', e.target.value)}
                  placeholder="Nama sesuai KTP-el / KK"
                  required
                  className="w-full px-3 py-2 bg-slate-50 border-2 border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-[#58CC02]"
                />
                {voterForm.errors.nama && (
                  <span className="text-[10px] text-[#EA2B2B] font-bold block mt-1">
                    {voterForm.errors.nama}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-black uppercase text-slate-700 mb-1">
                    Jenis Kelamin *
                  </label>
                  <select
                    value={voterForm.data.jenis_kelamin}
                    onChange={(e) => voterForm.setData('jenis_kelamin', e.target.value as 'L' | 'P')}
                    required
                    className="w-full px-3 py-2 bg-slate-50 border-2 border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-[#58CC02]"
                  >
                    <option value="L">Laki-Laki (L)</option>
                    <option value="P">Perempuan (P)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-black uppercase text-slate-700 mb-1">
                    Alokasi TPS *
                  </label>
                  <select
                    value={voterForm.data.tps_id}
                    onChange={(e) => voterForm.setData('tps_id', Number(e.target.value))}
                    required
                    className="w-full px-3 py-2 bg-slate-50 border-2 border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-[#58CC02]"
                  >
                    {allTpsOptions.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.nomor_tps} - {t.nama_lokasi}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-black uppercase text-slate-700 mb-1">
                    Dusun
                  </label>
                  <input
                    type="text"
                    value={voterForm.data.dusun}
                    onChange={(e) => voterForm.setData('dusun', e.target.value)}
                    placeholder="Contoh: Krajan"
                    className="w-full px-3 py-2 bg-slate-50 border-2 border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-[#58CC02]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black uppercase text-slate-700 mb-1">
                    RT
                  </label>
                  <input
                    type="text"
                    value={voterForm.data.rt}
                    onChange={(e) => voterForm.setData('rt', e.target.value)}
                    placeholder="01"
                    className="w-full px-3 py-2 bg-slate-50 border-2 border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-[#58CC02]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black uppercase text-slate-700 mb-1">
                    RW
                  </label>
                  <input
                    type="text"
                    value={voterForm.data.rw}
                    onChange={(e) => voterForm.setData('rw', e.target.value)}
                    placeholder="01"
                    className="w-full px-3 py-2 bg-slate-50 border-2 border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-[#58CC02]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-black uppercase text-slate-700 mb-1">
                    Tempat Lahir
                  </label>
                  <input
                    type="text"
                    value={voterForm.data.tempat_lahir}
                    onChange={(e) => voterForm.setData('tempat_lahir', e.target.value)}
                    placeholder="Pemalang"
                    className="w-full px-3 py-2 bg-slate-50 border-2 border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-[#58CC02]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black uppercase text-slate-700 mb-1">
                    Tanggal Lahir
                  </label>
                  <input
                    type="date"
                    value={voterForm.data.tanggal_lahir}
                    onChange={(e) => voterForm.setData('tanggal_lahir', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border-2 border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-[#58CC02]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t-2 border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsVoterModalOpen(false)}
                  className="px-4 py-2.5 rounded-2xl bg-white hover:bg-slate-100 text-slate-700 font-bold border-2 border-slate-200 text-xs uppercase tracking-wider cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={voterForm.processing}
                  className="px-5 py-2.5 rounded-2xl bg-[#58CC02] hover:bg-[#4ebb02] text-white font-black text-xs uppercase tracking-wider border-b-4 border-[#46A302] active:border-b-0 active:translate-y-1 transition-all cursor-pointer disabled:opacity-50"
                >
                  {voterForm.processing ? 'Menyimpan...' : editingVoter ? 'Simpan Pemilih' : 'Tambahkan ke DPS'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: KONFIRMASI HAPUS PEMILIH */}
      {deletingVoter && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white border-2 border-b-4 border-slate-200 rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-xl">
            <div className="w-12 h-12 rounded-2xl bg-[#FFE5E5] text-[#EA2B2B] flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div className="text-center">
              <h3 className="text-base font-black text-slate-900">
                Hapus Pemilih dari DPS?
              </h3>
              <p className="text-xs text-slate-600 font-semibold mt-1">
                <strong>{deletingVoter.nama}</strong> (NIK: {deletingVoter.nik})
              </p>
              <p className="text-[11px] text-slate-400 mt-1">
                Data akan dihapus permanen dari daftar pemilih sementara Pilkades 2026.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeletingVoter(null)}
                className="py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs uppercase cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={confirmDeleteVoter}
                className="py-2.5 rounded-2xl bg-[#FF4B4B] hover:bg-[#e03d3d] text-white font-black text-xs uppercase border-b-4 border-[#EA2B2B] active:border-b-0 active:translate-y-1 transition-all cursor-pointer"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: IMPORT EXCEL DPS */}
      <ImportVoterModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        allTpsOptions={allTpsOptions}
      />
    </div>
  );
}
