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
  RotateCcw,
  ClipboardList,
  Copy,
  AlertTriangle,
  Upload,
  Image as ImageIcon,
  Lightbulb
} from 'lucide-react';
import { DEFAULT_VILLAGE_LOGO, DEFAULT_MASCOT_GLAWU } from '@/data/logoPresets';
import { PageProps } from '@/types';
import { ImportVoterModal } from '@/Components/ImportVoterModal';
import { PendingSkippedVotersView, PendingSkippedVoterItem } from '@/Components/PendingSkippedVotersView';
import { ImportDuplicateVotersView, ImportDuplicateVoterItem } from '@/Components/ImportDuplicateVotersView';

export interface MascotSettings {
  mascot_name?: string;
  mascot_image?: string | null;
  mascot_image_file?: File | null;
  mascot_image_reset?: boolean;
  mascot_title: string;
  mascot_badge?: string;
  mascot_tag?: string;
  mascot_desc: string;
  mascot_slogan: string;
  mascot_speeches: string;
  filosofi_1_title?: string;
  filosofi_1_desc?: string;
  filosofi_2_title?: string;
  filosofi_2_desc?: string;
  filosofi_3_title?: string;
  filosofi_3_desc?: string;
  filosofi_4_title?: string;
  filosofi_4_desc?: string;
  ajakan_1_title: string;
  ajakan_1_desc: string;
  ajakan_2_title: string;
  ajakan_2_desc: string;
  ajakan_3_title: string;
  ajakan_3_desc: string;
  ajakan_4_title: string;
  ajakan_4_desc: string;
  tata_nilai_netralitas?: string;
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
  pendingSkippedVoters: PendingSkippedVoterItem[];
  pendingSkippedCount: number;
  importDuplicateVoters: ImportDuplicateVoterItem[];
  importDuplicateCount: number;
  lastImportHeaderCount?: number;
  lastImportTotalRows?: number;
}

export default function AdminDashboard({
  stats,
  tpsList,
  voters,
  allTpsOptions,
  filters,
  config,
  mascotSettings,
  pendingSkippedVoters,
  pendingSkippedCount,
  importDuplicateVoters,
  importDuplicateCount,
  lastImportHeaderCount = 0,
  lastImportTotalRows = 0,
}: AdminDashboardProps) {
  const { flash } = usePage<PageProps>().props;
  const queryParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
  const initialTab = (queryParams?.get('tab') as 'dps' | 'tps' | 'redaksi' | 'terlewat' | 'ganda') || (filters.tab === 'ganda' ? 'ganda' : (filters.tab === 'redaksi' ? 'redaksi' : (filters.tab === 'tps' ? 'tps' : (filters.tab === 'terlewat' ? 'terlewat' : 'dps'))));
  const [activeTab, setActiveTab] = useState<'dps' | 'tps' | 'redaksi' | 'terlewat' | 'ganda'>(initialTab);
  const [pendingCount, setPendingCount] = useState(pendingSkippedCount);
  const [duplicateCount, setDuplicateCount] = useState(importDuplicateCount);
  const [headerCount, setHeaderCount] = useState(
    lastImportHeaderCount > 0 && lastImportHeaderCount <= 10
      ? lastImportHeaderCount
      : (stats.totalDps > 0 ? 1 : 0)
  );

  // Redaksi & Mascot Form
  const [mascotPreviewUrl, setMascotPreviewUrl] = useState<string>(
    mascotSettings?.mascot_image || DEFAULT_MASCOT_GLAWU
  );
  const mascotFileInputRef = React.useRef<HTMLInputElement>(null);

  const mascotForm = useForm<MascotSettings>({
    mascot_name: mascotSettings?.mascot_name || 'Si Glawu',
    mascot_image: mascotSettings?.mascot_image || null,
    mascot_image_file: null,
    mascot_image_reset: false,
    mascot_title: mascotSettings?.mascot_title || 'Kenalkan, “GLAWU” Maskot Resmi Pilkades Gunungjaya 2026',
    mascot_badge: mascotSettings?.mascot_badge || 'IKON SEMANGAT DEMOKRASI DESA',
    mascot_tag: mascotSettings?.mascot_tag || 'Burung Khas Lereng Gn. Slamet',
    mascot_desc: mascotSettings?.mascot_desc || 'Karakter sahabat pemilih yang ceria, berwibawa, dan sarat kearifan lokal. GLAWU hadir mengajak seluruh warga Desa Gunungjaya mewujudkan Pilkades yang aman, damai, bermartabat, dan tanpa politik uang.',
    mascot_slogan: mascotSettings?.mascot_slogan || '“Gunungjaya Guyub Rukun, Sukseskan Pilkades Bersama Glawu!”',
    mascot_speeches: mascotSettings?.mascot_speeches || [
      '“Sugeng rawuh sedulur sedaya! Aja lali cek DPS-mu ya, sak swaramu nemtokake masa depan Desa Gunungjaya!”',
      '“Beda pilihan kuwi lumrah lan wajar, sing penting paseduluran lan keguyuban tetep dijaga!”',
      '“Tolak Serangan Fajar & Politik Uang! Pilih pemimpin nganggo ati nurani sing resik.”',
      '“Tanggal pencoblosan teka gasik neng TPS jam 07.00 - 13.00 WIB, nggawa e-KTP ya Lur!”'
    ].join('\n'),
    filosofi_1_title: mascotSettings?.filosofi_1_title || 'Burung Biru Lereng Slamet',
    filosofi_1_desc: mascotSettings?.filosofi_1_desc || 'Melambangkan kecerdasan, ketajaman visi, ketangguhan, dan suara lantang warga desa dalam menyuarakan aspirasi pembangunan bersama.',
    filosofi_2_title: mascotSettings?.filosofi_2_title || 'Blangkon & Surjan Lurik',
    filosofi_2_desc: mascotSettings?.filosofi_2_desc || 'Wujud penghormatan terhadap adat istiadat Jawa Tengah, kesantunan bertutur kata, serta kerendahan hati dalam kepemimpinan desa.',
    filosofi_3_title: mascotSettings?.filosofi_3_title || 'Sayap Mengajak & Surat Suara',
    filosofi_3_desc: mascotSettings?.filosofi_3_desc || 'Simbol ajakan ramah agar warga aktif menggunakan hak pilihnya secara mandiri, berdaulat, dan bebas dari paksaan pihak manapun.',
    filosofi_4_title: mascotSettings?.filosofi_4_title || 'Ekspresi Ceria & Ramah',
    filosofi_4_desc: mascotSettings?.filosofi_4_desc || 'Menegaskan bahwa Pilkades adalah pesta rakyat yang membahagiakan, menjalin kerukunan antar RT/RW, dan merajut persatuan desa.',
    ajakan_1_title: mascotSettings?.ajakan_1_title || 'Cek NIK di DPT Secara Online Sekarang',
    ajakan_1_desc: mascotSettings?.ajakan_1_desc || 'Jangan menunggu hari H. Pastikan namamu sudah tertera di Daftar Pemilih Tetap (DPT) dan ketahui nomor TPS tempatmu mencoblos.',
    ajakan_2_title: mascotSettings?.ajakan_2_title || 'Ketahui Visi, Misi, & Program Calon Kepala Desa',
    ajakan_2_desc: mascotSettings?.ajakan_2_desc || 'Pilihlah calon pemimpin yang memiliki komitmen tulus memajukan Desa Gunungjaya, transparan dalam anggaran desa, dan mengayomi seluruh warga.',
    ajakan_3_title: mascotSettings?.ajakan_3_title || 'Tolak Segala Bentuk Politik Uang (Anti Money Politics)',
    ajakan_3_desc: mascotSettings?.ajakan_3_desc || 'Jangan gadaikan masa depan desa selama 6 tahun hanya demi nominal sesaat. Pemimpin berintegritas lahir dari pemilih yang bermartabat.',
    ajakan_4_title: mascotSettings?.ajakan_4_title || 'Hadir Tepat Waktu di TPS (07.00 - 13.00 WIB)',
    ajakan_4_desc: mascotSettings?.ajakan_4_desc || 'Bawalah dokumen resmi (e-KTP asli / Surat Keterangan dan Surat Pemberitahuan/Model C6). Gunakan hak suaramu dan celupkan jari ke tinta!',
    tata_nilai_netralitas: mascotSettings?.tata_nilai_netralitas || 'Panitia Pemilihan Kepala Desa (P2KD) Gunungjaya netral, tidak berpihak kepada siapapun, dan mengabdi untuk kemaslahatan masyarakat desa.',
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

  const handleMascotImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Format file tidak didukung. Harap pilih file gambar (PNG, JPG, JPEG, SVG, WebP).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Ukuran file maksimal 5MB.');
      return;
    }

    mascotForm.setData((prev) => ({
      ...prev,
      mascot_image: null,
      mascot_image_file: file,
      mascot_image_reset: false,
    }));

    const preview = URL.createObjectURL(file);
    setMascotPreviewUrl(preview);
  };

  const handleResetMascotImage = () => {
    mascotForm.setData((prev) => ({
      ...prev,
      mascot_image: null,
      mascot_image_file: null,
      mascot_image_reset: true,
    }));
    setMascotPreviewUrl(DEFAULT_MASCOT_GLAWU);
    if (mascotFileInputRef.current) {
      mascotFileInputRef.current.value = '';
    }
  };

  const handleResetMascotDefaults = () => {
    if (confirm('Kembalikan redaksi dan pesan maskot ke teks bawaan pabrik (default)?')) {
      handleResetMascotImage();
      mascotForm.setData({
        mascot_name: 'Si Glawu',
        mascot_image: null,
        mascot_image_file: null,
        mascot_image_reset: true,
        mascot_title: 'Kenalkan, “GLAWU” Maskot Resmi Pilkades Gunungjaya 2026',
        mascot_badge: 'IKON SEMANGAT DEMOKRASI DESA',
        mascot_tag: 'Burung Khas Lereng Gn. Slamet',
        mascot_desc: 'Karakter sahabat pemilih yang ceria, berwibawa, dan sarat kearifan lokal. GLAWU hadir mengajak seluruh warga Desa Gunungjaya mewujudkan Pilkades yang aman, damai, bermartabat, dan tanpa politik uang.',
        mascot_slogan: '“Gunungjaya Guyub Rukun, Sukseskan Pilkades Bersama Glawu!”',
        mascot_speeches: [
          '“Sugeng rawuh sedulur sedaya! Aja lali cek DPS-mu ya, sak swaramu nemtokake masa depan Desa Gunungjaya!”',
          '“Beda pilihan kuwi lumrah lan wajar, sing penting paseduluran lan keguyuban tetep dijaga!”',
          '“Tolak Serangan Fajar & Politik Uang! Pilih pemimpin nganggo ati nurani sing resik.”',
          '“Tanggal pencoblosan teka gasik neng TPS jam 07.00 - 13.00 WIB, nggawa e-KTP ya Lur!”'
        ].join('\n'),
        filosofi_1_title: 'Burung Biru Lereng Slamet',
        filosofi_1_desc: 'Melambangkan kecerdasan, ketajaman visi, ketangguhan, dan suara lantang warga desa dalam menyuarakan aspirasi pembangunan bersama.',
        filosofi_2_title: 'Blangkon & Surjan Lurik',
        filosofi_2_desc: 'Wujud penghormatan terhadap adat istiadat Jawa Tengah, kesantunan bertutur kata, serta kerendahan hati dalam kepemimpinan desa.',
        filosofi_3_title: 'Sayap Mengajak & Surat Suara',
        filosofi_3_desc: 'Simbol ajakan ramah agar warga aktif menggunakan hak pilihnya secara mandiri, berdaulat, dan bebas dari paksaan pihak manapun.',
        filosofi_4_title: 'Ekspresi Ceria & Ramah',
        filosofi_4_desc: 'Menegaskan bahwa Pilkades adalah pesta rakyat yang membahagiakan, menjalin kerukunan antar RT/RW, dan merajut persatuan desa.',
        ajakan_1_title: 'Cek NIK di DPT Secara Online Sekarang',
        ajakan_1_desc: 'Jangan menunggu hari H. Pastikan namamu sudah tertera di Daftar Pemilih Tetap (DPT) dan ketahui nomor TPS tempatmu mencoblos.',
        ajakan_2_title: 'Ketahui Visi, Misi, & Program Calon Kepala Desa',
        ajakan_2_desc: 'Pilihlah calon pemimpin yang memiliki komitmen tulus memajukan Desa Gunungjaya, transparan dalam anggaran desa, dan mengayomi seluruh warga.',
        ajakan_3_title: 'Tolak Segala Bentuk Politik Uang (Anti Money Politics)',
        ajakan_3_desc: 'Jangan gadaikan masa depan desa selama 6 tahun hanya demi nominal sesaat. Pemimpin berintegritas lahir dari pemilih yang bermartabat.',
        ajakan_4_title: 'Hadir Tepat Waktu di TPS (07.00 - 13.00 WIB)',
        ajakan_4_desc: 'Bawalah dokumen resmi (e-KTP asli / Surat Keterangan dan Surat Pemberitahuan/Model C6). Gunakan hak suaramu dan celupkan jari ke tinta!',
        tata_nilai_netralitas: 'Panitia Pemilihan Kepala Desa (P2KD) Gunungjaya netral, tidak berpihak kepada siapapun, dan mengabdi untuk kemaslahatan masyarakat desa.',
        data_phase: 'DPS',
        pengumuman: 'Pengecekan DPS Online telah dibuka. Pastikan NIK Anda terdaftar!',
      });
    }
  };

  const handleMascotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mascotForm.post(route('admin.settings.mascot'), {
      forceFormData: true,
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
    no_urut: '' as number | string,
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
      no_urut: '',
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
      no_urut: voter.no_urut ?? '',
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

        {/* Audit Rekonsiliasi Import Excel & Stat Cards */}
        {(() => {
          const totalRawExcelRows = stats.totalDps + duplicateCount + pendingCount + headerCount;
          const pctBersih = totalRawExcelRows > 0 ? ((stats.totalDps / totalRawExcelRows) * 100).toFixed(1) : '100';
          const pctHeader = totalRawExcelRows > 0 ? ((headerCount / totalRawExcelRows) * 100).toFixed(1) : '0';
          const pctGanda = totalRawExcelRows > 0 ? ((duplicateCount / totalRawExcelRows) * 100).toFixed(1) : '0';
          const pctTerlewat = totalRawExcelRows > 0 ? ((pendingCount / totalRawExcelRows) * 100).toFixed(1) : '0';

          return (
            <div className="space-y-4">
              {/* Row 1: 5 Kotak Rekonsiliasi Data Import Excel */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] sm:text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                    <FileSpreadsheet className="w-3.5 h-3.5 text-[#6366F1]" />
                    <span>Rekonsiliasi & Audit Data Import Excel</span>
                  </span>
                  <span className="hidden sm:inline-flex text-[11px] font-bold text-slate-400">
                    Total Baris ({totalRawExcelRows.toLocaleString('id-ID')}) = Header ({headerCount.toLocaleString('id-ID')}) + Bersih ({stats.totalDps.toLocaleString('id-ID')}) + Ganda ({duplicateCount.toLocaleString('id-ID')}) + Terlewat ({pendingCount.toLocaleString('id-ID')})
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
                  {/* Kotak 1: Total Baris File Excel */}
                  <div className="bg-white border-2 border-b-4 border-indigo-200 rounded-3xl p-3.5 sm:p-5 shadow-xs hover:border-indigo-300 transition-all">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-indigo-600">
                        Total Baris File
                      </span>
                      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-[#6366F1] text-white flex items-center justify-center shrink-0">
                        <FileSpreadsheet className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </div>
                    </div>
                    <div className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 tracking-tight">
                      {totalRawExcelRows.toLocaleString('id-ID')}
                    </div>
                    <span className="text-[10px] sm:text-[11px] font-bold text-indigo-600 mt-1 block truncate">
                      Sampai baris data terakhir
                    </span>
                  </div>

                  {/* Kotak 2: Header / Judul Kolom */}
                  <div className="bg-white border-2 border-b-4 border-purple-200 rounded-3xl p-3.5 sm:p-5 shadow-xs hover:border-purple-300 transition-all">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-purple-700">
                        Header / Judul
                      </span>
                      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-[#7E22CE] text-white flex items-center justify-center shrink-0">
                        <Info className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </div>
                    </div>
                    <div className="text-xl sm:text-2xl lg:text-3xl font-black text-purple-700 tracking-tight">
                      {headerCount.toLocaleString('id-ID')}
                    </div>
                    <span className="text-[10px] sm:text-[11px] font-bold text-purple-600 mt-1 block truncate">
                      Dilewati Otomatis
                    </span>
                  </div>

                  {/* Kotak 3: Total Data Bersih (DPS) */}
                  <div className="bg-white border-2 border-b-4 border-green-200 rounded-3xl p-3.5 sm:p-5 shadow-xs hover:border-[#58CC02] transition-all">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-[#46A302]">
                        Total Data Bersih (DPS)
                      </span>
                      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-[#58CC02] text-white flex items-center justify-center shrink-0">
                        <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </div>
                    </div>
                    <div className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 tracking-tight">
                      {stats.totalDps.toLocaleString('id-ID')}
                    </div>
                    <span className="text-[10px] sm:text-[11px] font-bold text-[#46A302] mt-1 block truncate">
                      {pctBersih}% Hak Suara Masuk DPS
                    </span>
                  </div>

                  {/* Kotak 4: Total Data Ganda */}
                  <div className="bg-white border-2 border-b-4 border-sky-200 rounded-3xl p-3.5 sm:p-5 shadow-xs hover:border-[#1CB0F6] transition-all">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-[#1899D6]">
                        Total Data Ganda
                      </span>
                      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-[#1CB0F6] text-white flex items-center justify-center shrink-0">
                        <Copy className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </div>
                    </div>
                    <div className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 tracking-tight">
                      {duplicateCount.toLocaleString('id-ID')}
                    </div>
                    <span className="text-[10px] sm:text-[11px] font-bold text-[#1899D6] mt-1 block truncate">
                      {pctGanda}% NIK Duplikat Dilewati
                    </span>
                  </div>

                  {/* Kotak 5: Total Data Terlewat */}
                  <div className="bg-white border-2 border-b-4 border-amber-200 rounded-3xl p-3.5 sm:p-5 shadow-xs hover:border-[#FF9600] transition-all col-span-2 sm:col-span-1">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-[#E07700]">
                        Total Data Terlewat
                      </span>
                      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-[#FF9600] text-white flex items-center justify-center shrink-0">
                        <AlertTriangle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </div>
                    </div>
                    <div className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 tracking-tight">
                      {pendingCount.toLocaleString('id-ID')}
                    </div>
                    <span className="text-[10px] sm:text-[11px] font-bold text-[#E07700] mt-1 block truncate">
                      {pctTerlewat}% Data Belum Lengkap
                    </span>
                  </div>
                </div>
              </div>

              {/* Row 2: Rincian Demografi DPS & TPS */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                {/* Laki-laki */}
                <div className="bg-white border-2 border-b-4 border-slate-200 rounded-2xl p-4 shadow-xs flex items-center justify-between">
                  <div>
                    <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-slate-500 block">
                      Pemilih Laki-Laki (DPS)
                    </span>
                    <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-0.5">
                      {stats.totalL.toLocaleString('id-ID')}
                    </div>
                    <span className="text-[10px] sm:text-[11px] font-bold text-[#1899D6]">
                      {pctL}% dari total DPS
                    </span>
                  </div>
                  <div className="w-9 h-9 rounded-xl bg-sky-100 text-[#1CB0F6] flex items-center justify-center shrink-0">
                    <User className="w-4 h-4" />
                  </div>
                </div>

                {/* Perempuan */}
                <div className="bg-white border-2 border-b-4 border-slate-200 rounded-2xl p-4 shadow-xs flex items-center justify-between">
                  <div>
                    <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-slate-500 block">
                      Pemilih Perempuan (DPS)
                    </span>
                    <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-0.5">
                      {stats.totalP.toLocaleString('id-ID')}
                    </div>
                    <span className="text-[10px] sm:text-[11px] font-bold text-[#E07700]">
                      {pctP}% dari total DPS
                    </span>
                  </div>
                  <div className="w-9 h-9 rounded-xl bg-amber-100 text-[#FF9600] flex items-center justify-center shrink-0">
                    <User className="w-4 h-4" />
                  </div>
                </div>

                {/* Total TPS */}
                <div className="bg-white border-2 border-b-4 border-slate-200 rounded-2xl p-4 shadow-xs flex items-center justify-between">
                  <div>
                    <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-slate-500 block">
                      Sebaran Lokasi TPS
                    </span>
                    <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-0.5">
                      {stats.totalTps} TPS
                    </div>
                    <span className="text-[10px] sm:text-[11px] font-bold text-slate-500">
                      Tersebar di wilayah dusun
                    </span>
                  </div>
                  <div className="w-9 h-9 rounded-xl bg-amber-100 text-[#FFC800] flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4 text-amber-700" />
                  </div>
                </div>
              </div>
            </div>
          );
        })()}

        {/* Tab Switcher: DPS vs TPS vs Redaksi & Maskot vs Data Ganda (+ Data Terlewat jika ada) */}
        {(() => {
          const totalVisibleTabs = 4 + (pendingCount > 0 ? 1 : 0);
          return (
            <div className={`grid gap-2.5 sm:gap-3 border-b-2 border-slate-200 pb-4 ${
              totalVisibleTabs === 5
                ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-5'
                : 'grid-cols-2 sm:grid-cols-2 lg:grid-cols-4'
            }`}>
              {/* Tab 1: DATA DPS */}
              <button
                type="button"
                onClick={() => setActiveTab('dps')}
                className={`w-full min-h-[64px] sm:min-h-[72px] p-2.5 sm:p-3.5 rounded-2xl transition-all flex flex-col justify-between gap-1.5 cursor-pointer active:translate-y-0.5 text-left ${
                  activeTab === 'dps'
                    ? 'bg-[#58CC02] text-white border-2 border-b-4 border-[#46A302] shadow-sm'
                    : 'bg-white hover:bg-slate-50 text-slate-700 border-2 border-b-4 border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between w-full gap-1">
                  <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${
                    activeTab === 'dps' ? 'bg-white/20 text-white' : 'bg-green-100 text-[#58CC02]'
                  }`}>
                    <Database className="w-3.5 h-3.5 shrink-0" />
                  </div>
                  <span className={`text-[10px] sm:text-[11px] px-2 py-0.5 rounded-md font-black shrink-0 whitespace-nowrap ${
                    activeTab === 'dps' ? 'bg-white text-[#58CC02]' : 'bg-slate-100 text-slate-700'
                  }`}>
                    {stats.totalDps.toLocaleString('id-ID')}
                  </span>
                </div>
                <span className="font-black text-xs sm:text-sm uppercase tracking-wider block truncate">
                  Data DPS
                </span>
              </button>

              {/* Tab 2: LOKASI TPS */}
              <button
                type="button"
                onClick={() => setActiveTab('tps')}
                className={`w-full min-h-[64px] sm:min-h-[72px] p-2.5 sm:p-3.5 rounded-2xl transition-all flex flex-col justify-between gap-1.5 cursor-pointer active:translate-y-0.5 text-left ${
                  activeTab === 'tps'
                    ? 'bg-[#1CB0F6] text-white border-2 border-b-4 border-[#1899D6] shadow-sm'
                    : 'bg-white hover:bg-slate-50 text-slate-700 border-2 border-b-4 border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between w-full gap-1">
                  <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${
                    activeTab === 'tps' ? 'bg-white/20 text-white' : 'bg-sky-100 text-[#1CB0F6]'
                  }`}>
                    <MapPin className="w-3.5 h-3.5 shrink-0" />
                  </div>
                  <span className={`text-[10px] sm:text-[11px] px-2 py-0.5 rounded-md font-black shrink-0 whitespace-nowrap ${
                    activeTab === 'tps' ? 'bg-white text-[#1CB0F6]' : 'bg-slate-100 text-slate-700'
                  }`}>
                    {stats.totalTps} TPS
                  </span>
                </div>
                <span className="font-black text-xs sm:text-sm uppercase tracking-wider block truncate">
                  Lokasi TPS
                </span>
              </button>

              {/* Tab 3: REDAKSI & MASKOT */}
              <button
                type="button"
                onClick={() => setActiveTab('redaksi')}
                className={`w-full min-h-[64px] sm:min-h-[72px] p-2.5 sm:p-3.5 rounded-2xl transition-all flex flex-col justify-between gap-1.5 cursor-pointer active:translate-y-0.5 text-left ${
                  activeTab === 'redaksi'
                    ? 'bg-[#9333EA] text-white border-2 border-b-4 border-[#7E22CE] shadow-sm'
                    : 'bg-white hover:bg-slate-50 text-slate-700 border-2 border-b-4 border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between w-full gap-1">
                  <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${
                    activeTab === 'redaksi' ? 'bg-white/20 text-white' : 'bg-purple-100 text-[#9333EA]'
                  }`}>
                    <Sparkles className="w-3.5 h-3.5 shrink-0 text-amber-300" />
                  </div>
                  <span className={`text-[10px] sm:text-[11px] px-2 py-0.5 rounded-md font-black shrink-0 whitespace-nowrap flex items-center gap-1 ${
                    activeTab === 'redaksi' ? 'bg-white text-[#9333EA]' : 'bg-purple-100 text-purple-700'
                  }`}>
                    <span>Si Glawu</span>
                    <Sparkles className="w-3 h-3 text-amber-500 shrink-0" />
                  </span>
                </div>
                <span className="font-black text-xs sm:text-sm uppercase tracking-wider block truncate">
                  Redaksi
                </span>
              </button>

              {/* Tab 4: DATA GANDA */}
              <button
                type="button"
                onClick={() => setActiveTab('ganda')}
                className={`w-full min-h-[64px] sm:min-h-[72px] p-2.5 sm:p-3.5 rounded-2xl transition-all flex flex-col justify-between gap-1.5 cursor-pointer active:translate-y-0.5 text-left ${
                  activeTab === 'ganda'
                    ? 'bg-[#1CB0F6] text-white border-2 border-b-4 border-[#1899D6] shadow-sm'
                    : 'bg-[#EBF7FD] hover:bg-sky-100 text-[#1899D6] border-2 border-b-4 border-[#1CB0F6]/40 hover:border-[#1CB0F6]'
                }`}
              >
                <div className="flex items-center justify-between w-full gap-1">
                  <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${
                    activeTab === 'ganda' ? 'bg-white/20 text-white' : 'bg-sky-200 text-[#1899D6]'
                  }`}>
                    <Copy className="w-3.5 h-3.5 shrink-0" />
                  </div>
                  <span className={`text-[10px] sm:text-[11px] px-2 py-0.5 rounded-md font-black shrink-0 whitespace-nowrap ${
                    activeTab === 'ganda'
                      ? 'bg-white text-[#1899D6]'
                      : duplicateCount > 0
                      ? 'bg-sky-200 text-sky-950'
                      : 'bg-sky-100 text-sky-700'
                  }`}>
                    {duplicateCount > 0 ? `${duplicateCount} ganda` : '0 ganda'}
                  </span>
                </div>
                <span className="font-black text-xs sm:text-sm uppercase tracking-wider block truncate">
                  Data Ganda
                </span>
              </button>

              {/* Tab 5: DATA TERLEWAT (Dinamis jika ada data yang belum lengkap) */}
              {pendingCount > 0 && (
                <button
                  type="button"
                  onClick={() => setActiveTab('terlewat')}
                  className={`w-full min-h-[64px] sm:min-h-[72px] p-2.5 sm:p-3.5 rounded-2xl transition-all flex flex-col justify-between gap-1.5 cursor-pointer active:translate-y-0.5 text-left col-span-2 sm:col-span-1 ${
                    activeTab === 'terlewat'
                      ? 'bg-[#FF9600] text-white border-2 border-b-4 border-[#E07700] shadow-sm'
                      : 'bg-amber-50 hover:bg-amber-100 text-amber-900 border-2 border-b-4 border-amber-300 hover:border-amber-400'
                  }`}
                >
                  <div className="flex items-center justify-between w-full gap-1">
                    <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${
                      activeTab === 'terlewat' ? 'bg-white/20 text-white' : 'bg-amber-200 text-amber-900'
                    }`}>
                      <ClipboardList className="w-3.5 h-3.5 shrink-0" />
                    </div>
                    <span className={`text-[10px] sm:text-[11px] px-2 py-0.5 rounded-md font-black shrink-0 whitespace-nowrap animate-pulse ${
                      activeTab === 'terlewat' ? 'bg-white text-[#FF9600]' : 'bg-amber-200 text-amber-950'
                    }`}>
                      {pendingCount} orang
                    </span>
                  </div>
                  <span className="font-black text-xs sm:text-sm uppercase tracking-wider block truncate">
                    Data Terlewat
                  </span>
                </button>
              )}
            </div>
          );
        })()}

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
                    <th className="py-3.5 px-3 text-center w-16">No. DPT</th>
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
                      <td colSpan={7} className="py-8 text-center text-slate-400 font-bold">
                        Tidak ada data pemilih yang sesuai dengan pencarian atau filter.
                      </td>
                    </tr>
                  ) : (
                    voters.data.map((voter) => (
                      <tr key={voter.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 px-3 text-center">
                          <span className="font-mono font-black text-xs px-2 py-1 rounded-xl bg-slate-100 text-slate-700 border border-slate-200 block shadow-2xs">
                            #{voter.no_urut || voter.id}
                          </span>
                        </td>
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
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <span className="font-mono font-black text-[10px] px-1.5 py-0.5 rounded-md bg-slate-200 text-slate-700">
                            #{voter.no_urut || voter.id}
                          </span>
                          <span className="font-black text-slate-900 text-sm">
                            {voter.nama}
                          </span>
                        </div>
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
              <div className="pt-4 border-t-2 border-slate-100 flex flex-col md:flex-row items-center justify-between gap-3">
                <div className="text-xs text-slate-500 font-bold text-center md:text-left select-none">
                  Menampilkan <span className="text-slate-800 font-black">{voters.data.length}</span> dari{' '}
                  <span className="text-slate-800 font-black">{voters.total.toLocaleString('id-ID')}</span> pemilih
                  {voters.last_page > 1 && (
                    <span className="text-slate-400 font-bold ml-1.5">
                      (Hal. {voters.current_page} dari {voters.last_page})
                    </span>
                  )}
                </div>

                <div className="w-full md:w-auto max-w-full overflow-x-auto pb-1 flex items-center justify-center md:justify-end no-scrollbar">
                  <div className="inline-flex items-center gap-1.5 shrink-0 px-0.5">
                    {voters.links.map((link, idx) => {
                      const isPrev = idx === 0 || link.label.includes('&laquo;') || link.label.toLowerCase().includes('prev');
                      const isNext = idx === voters.links.length - 1 || link.label.includes('&raquo;') || link.label.toLowerCase().includes('next');
                      const isEllipsis = link.label === '...';

                      if (isEllipsis) {
                        return (
                          <span
                            key={idx}
                            className="w-7 h-8 inline-flex items-center justify-center text-xs font-black text-slate-400 shrink-0 select-none"
                          >
                            ...
                          </span>
                        );
                      }

                      const prevNextContent = isPrev ? (
                        <>
                          <ChevronLeft className="w-4 h-4 shrink-0" />
                          <span className="hidden sm:inline">Sebelumnya</span>
                        </>
                      ) : isNext ? (
                        <>
                          <span className="hidden sm:inline">Berikutnya</span>
                          <ChevronRight className="w-4 h-4 shrink-0" />
                        </>
                      ) : null;

                      if (!link.url) {
                        return (
                          <span
                            key={idx}
                            aria-disabled="true"
                            className={`h-8 rounded-xl text-xs font-bold text-slate-300 bg-slate-50 border border-slate-200/80 shrink-0 inline-flex items-center justify-center cursor-not-allowed select-none ${
                              isPrev || isNext ? 'px-2.5 sm:px-3 gap-1' : 'min-w-[34px] px-2'
                            }`}
                          >
                            {isPrev || isNext ? prevNextContent : link.label}
                          </span>
                        );
                      }

                      if (link.active) {
                        return (
                          <span
                            key={idx}
                            aria-current="page"
                            className="min-w-[34px] h-8 px-2 rounded-xl text-xs font-black bg-[#58CC02] text-white border-b-2 border-[#46A302] shadow-sm shrink-0 inline-flex items-center justify-center select-none"
                          >
                            {link.label}
                          </span>
                        );
                      }

                      return (
                        <Link
                          key={idx}
                          href={link.url}
                          preserveState
                          preserveScroll
                          className={`h-8 rounded-xl text-xs font-black text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 hover:border-slate-300 shrink-0 inline-flex items-center justify-center transition-all active:translate-y-0.5 shadow-2xs ${
                            isPrev || isNext ? 'px-2.5 sm:px-3 gap-1' : 'min-w-[34px] px-2'
                          }`}
                        >
                          {isPrev || isNext ? prevNextContent : link.label}
                        </Link>
                      );
                    })}
                  </div>
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

        {/* TAB 3: PENGATURAN REDAKSI & MASKOT */}
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
                      <span>Pengaturan Redaksi & Maskot {mascotForm.data.mascot_name || 'Si Glawu'}</span>
                      <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-700 font-black">
                        Admin Live Editor
                      </span>
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
                      Ubah foto gambar maskot, nama panggilan, sapaan dialog, slogan, judul maskot, serta 4 poin himbauan warga yang langsung tampil di portal publik.
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

            {/* Live Interactive Preview Card of Mascot speaking */}
            <div className="bg-gradient-to-br from-purple-50 via-white to-amber-50/40 border-2 border-b-4 border-purple-200 rounded-3xl p-6 sm:p-8 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-purple-800 text-xs font-black uppercase tracking-wider">
                  <MessageSquareQuote className="w-4 h-4 text-purple-600" />
                  <span>Pratinjau Langsung Balon Bicara {mascotForm.data.mascot_name || 'Si Glawu'}</span>
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
                <div className="relative w-24 h-24 sm:w-28 sm:h-28 shrink-0 flex items-center justify-center">
                  <img
                    src={mascotPreviewUrl || DEFAULT_MASCOT_GLAWU}
                    alt={mascotForm.data.mascot_name || 'Maskot Glawu'}
                    className="w-full h-full object-contain drop-shadow-md animate-bounce-subtle select-none"
                  />
                </div>
                <div className="flex-1 space-y-2 text-center sm:text-left">
                  <div className="inline-block relative bg-white border-2 border-b-4 border-purple-300 rounded-2xl p-4 shadow-sm text-slate-800 font-bold text-sm sm:text-base leading-relaxed">
                    <span className="text-purple-600 font-black mr-2">
                      “{mascotForm.data.mascot_name || 'Glawu'}:”
                    </span>
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
              
              {/* SECTION 1: Identitas Foto/Gambar & Nama Panggilan Maskot */}
              <div className="bg-white border-2 border-b-4 border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
                <div className="flex items-center gap-2.5 pb-3 border-b-2 border-slate-100">
                  <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-black text-sm">
                    1
                  </div>
                  <div>
                    <h3 className="text-base font-black text-slate-900">
                      Gambar & Nama Panggilan Maskot
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">
                      Sesuaikan visual gambar karakter dan nama panggilan maskot resmi Pilkades yang tampil di seluruh portal publik.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  {/* Visual Box & Upload (5 cols) */}
                  <div className="lg:col-span-5 flex flex-col items-center bg-slate-50/80 p-5 rounded-2xl border-2 border-slate-200 space-y-4">
                    <div className="relative w-40 h-40 rounded-2xl bg-white border-2 border-purple-200 p-3 shadow-inner flex items-center justify-center overflow-hidden group">
                      <img
                        src={mascotPreviewUrl || DEFAULT_MASCOT_GLAWU}
                        alt="Preview Maskot"
                        className="w-full h-full object-contain drop-shadow-sm group-hover:scale-105 transition-transform"
                      />
                    </div>

                    <div className="text-center space-y-2 w-full">
                      <div className="flex items-center justify-center">
                        {mascotPreviewUrl !== DEFAULT_MASCOT_GLAWU ? (
                          <span className="px-3 py-1 rounded-xl bg-purple-100 text-purple-700 border border-purple-200 text-xs font-black uppercase tracking-wider flex items-center gap-1.5">
                            <ImageIcon className="w-3.5 h-3.5" />
                            <span>Maskot Kustom Aktif</span>
                          </span>
                        ) : (
                          <span className="px-3 py-1 rounded-xl bg-amber-100 text-amber-800 border border-amber-200 text-xs font-black uppercase tracking-wider flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                            <span>Maskot Bawaan Pabrik</span>
                          </span>
                        )}
                      </div>

                      <input
                        type="file"
                        ref={mascotFileInputRef}
                        onChange={handleMascotImageChange}
                        accept="image/png,image/jpeg,image/jpg,image/webp,image/svg+xml"
                        className="hidden"
                      />

                      <div className="flex flex-col gap-2 w-full pt-1">
                        <button
                          type="button"
                          onClick={() => mascotFileInputRef.current?.click()}
                          className="w-full px-4 py-2.5 rounded-xl bg-[#9333EA] hover:bg-[#7E22CE] text-white font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs border-b-2 border-[#6B21A8] active:translate-y-0.5"
                        >
                          <Upload className="w-4 h-4" />
                          <span>Pilih / Ganti Gambar Maskot</span>
                        </button>

                        {mascotPreviewUrl !== DEFAULT_MASCOT_GLAWU && (
                          <button
                            type="button"
                            onClick={handleResetMascotImage}
                            className="w-full px-4 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-600 font-bold text-xs uppercase tracking-wider border border-slate-200 transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                          >
                            <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
                            <span>Kembalikan ke Maskot Bawaan</span>
                          </button>
                        )}
                      </div>

                      <p className="text-[11px] text-slate-500 font-medium text-left leading-tight bg-white p-2.5 rounded-xl border border-slate-200 flex items-start gap-1.5">
                        <Lightbulb className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                        <span><strong>Format:</strong> PNG transparan (disarankan), JPG, WebP, atau SVG. Ukuran maksimal <strong>5 MB</strong>.</span>
                      </p>
                    </div>
                  </div>

                  {/* Text Fields (7 cols) */}
                  <div className="lg:col-span-7 space-y-4">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-black uppercase text-slate-700 tracking-wider">
                        Nama Panggilan Maskot:
                      </label>
                      <input
                        type="text"
                        value={mascotForm.data.mascot_name || ''}
                        onChange={(e) => mascotForm.setData('mascot_name', e.target.value)}
                        placeholder="Contoh: Si Glawu / Glawu / Si Gatot"
                        className="w-full px-4 py-3 rounded-2xl border-2 border-slate-200 focus:border-[#9333EA] focus:ring-0 text-slate-900 font-bold text-sm transition shadow-2xs"
                        required
                      />
                      {mascotForm.errors.mascot_name && (
                        <p className="text-xs font-bold text-red-500">{mascotForm.errors.mascot_name}</p>
                      )}
                      <p className="text-[11px] text-slate-500 font-medium">
                        * Nama ini akan tampil di balon dialog ucapan, panduan interaktif, dan sapaan warga.
                      </p>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-black uppercase text-slate-700 tracking-wider">
                        Badge Ikon / Label Singkat Maskot:
                      </label>
                      <input
                        type="text"
                        value={mascotForm.data.mascot_badge || ''}
                        onChange={(e) => mascotForm.setData('mascot_badge', e.target.value)}
                        placeholder="Contoh: IKON SEMANGAT DEMOKRASI DESA"
                        className="w-full px-4 py-3 rounded-2xl border-2 border-slate-200 focus:border-[#9333EA] focus:ring-0 text-slate-900 font-bold text-sm transition shadow-2xs"
                      />
                      {mascotForm.errors.mascot_badge && (
                        <p className="text-xs font-bold text-red-500">{mascotForm.errors.mascot_badge}</p>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-black uppercase text-slate-700 tracking-wider">
                        Tag Karakter Maskot:
                      </label>
                      <input
                        type="text"
                        value={mascotForm.data.mascot_tag || ''}
                        onChange={(e) => mascotForm.setData('mascot_tag', e.target.value)}
                        placeholder="Contoh: Burung Khas Lereng Gn. Slamet"
                        className="w-full px-4 py-3 rounded-2xl border-2 border-slate-200 focus:border-[#9333EA] focus:ring-0 text-slate-900 font-bold text-sm transition shadow-2xs"
                      />
                      {mascotForm.errors.mascot_tag && (
                        <p className="text-xs font-bold text-red-500">{mascotForm.errors.mascot_tag}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 2: Kalimat Sapaan Si Glawu (Rotasi Balon Dialog) */}
              <div className="bg-white border-2 border-b-4 border-slate-200 rounded-3xl p-6 sm:p-8 space-y-4 shadow-sm">
                <div className="flex items-center gap-2.5 pb-3 border-b-2 border-slate-100">
                  <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-black text-sm">
                    2
                  </div>
                  <div>
                    <h3 className="text-base font-black text-slate-900">
                      Kalimat Sapaan {mascotForm.data.mascot_name || 'Si Glawu'} (Rotasi Balon Dialog)
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">
                      Tuliskan <strong>1 kalimat per baris</strong>. Balon dialog akan menampilkan dan merotasi kalimat-kalimat ini secara bergantian.
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
                    placeholder="Tuliskan ucapan maskot di sini, tekan Enter untuk kalimat berikutnya..."
                    className="w-full px-4 py-3 rounded-2xl border-2 border-slate-200 focus:border-[#9333EA] focus:ring-0 text-slate-900 font-medium text-sm leading-relaxed transition shadow-2xs resize-y"
                    required
                  />
                  {mascotForm.errors.mascot_speeches && (
                    <p className="text-xs font-bold text-red-500">{mascotForm.errors.mascot_speeches}</p>
                  )}
                  <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
                    <span className="flex items-center gap-1 text-slate-500">
                      <Lightbulb className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      <span>Tips: Gunakan bahasa santai, ajakan damai, atau bahasa Banyumasan khas desa agar ramah warga.</span>
                    </span>
                    <span className="font-bold text-purple-700">
                      {previewSpeeches.length} baris terdeteksi
                    </span>
                  </div>
                </div>
              </div>

              {/* SECTION 3: Identitas & Slogan Maskot */}
              <div className="bg-white border-2 border-b-4 border-slate-200 rounded-3xl p-6 sm:p-8 space-y-4 shadow-sm">
                <div className="flex items-center gap-2.5 pb-3 border-b-2 border-slate-100">
                  <div className="w-8 h-8 rounded-xl bg-[#1CB0F6]/15 text-[#1CB0F6] flex items-center justify-center font-black text-sm">
                    3
                  </div>
                  <div>
                    <h3 className="text-base font-black text-slate-900">
                      Identitas & Slogan Utama Maskot
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">
                      Judul dan deskripsi profil maskot yang tampil pada kartu pengenalan maskot.
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
                    placeholder="Jelaskan karakter maskot dan nilai yang dibawanya..."
                    className="w-full px-4 py-3 rounded-2xl border-2 border-slate-200 focus:border-[#9333EA] focus:ring-0 text-slate-900 font-medium text-sm leading-relaxed transition shadow-2xs"
                    required
                  />
                  {mascotForm.errors.mascot_desc && (
                    <p className="text-xs font-bold text-red-500">{mascotForm.errors.mascot_desc}</p>
                  )}
                </div>
              </div>

              {/* SECTION 4: 4 Poin Ajakan / Himbauan Warga */}
              <div className="bg-white border-2 border-b-4 border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
                <div className="flex items-center gap-2.5 pb-3 border-b-2 border-slate-100">
                  <div className="w-8 h-8 rounded-xl bg-[#FF9600]/15 text-[#E07700] flex items-center justify-center font-black text-sm">
                    4
                  </div>
                  <div>
                    <h3 className="text-base font-black text-slate-900">
                      4 Pesan Edukasi & Himbauan Warga
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">
                      4 kartu edukasi pemilih yang tampil di samping gambar maskot pada halaman publik.
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

              {/* SECTION 5: 4 Makna Filosofi Simbolik Maskot */}
              <div className="bg-white border-2 border-b-4 border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
                <div className="flex items-center gap-2.5 pb-3 border-b-2 border-slate-100">
                  <div className="w-8 h-8 rounded-xl bg-[#1CB0F6]/15 text-[#1CB0F6] flex items-center justify-center font-black text-sm">
                    5
                  </div>
                  <div>
                    <h3 className="text-base font-black text-slate-900">
                      4 Makna Filosofi & Karakter Maskot
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">
                      Penjelasan makna filosofis simbolik karakter maskot yang tampil pada Tab Filosofi & Makna.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Filosofi 1 */}
                  <div className="bg-slate-50 border-2 border-b-4 border-slate-200 rounded-2xl p-4 space-y-3">
                    <span className="text-xs font-black text-[#1CB0F6] uppercase tracking-wider block">
                      Makna 1 (Burung Slamet)
                    </span>
                    <input
                      type="text"
                      value={mascotForm.data.filosofi_1_title || ''}
                      onChange={(e) => mascotForm.setData('filosofi_1_title', e.target.value)}
                      placeholder="Judul filosofi 1"
                      className="w-full px-3.5 py-2 rounded-xl border-2 border-slate-200 text-xs font-bold bg-white mb-2"
                    />
                    <textarea
                      rows={2}
                      value={mascotForm.data.filosofi_1_desc || ''}
                      onChange={(e) => mascotForm.setData('filosofi_1_desc', e.target.value)}
                      placeholder="Uraian filosofi 1"
                      className="w-full px-3.5 py-2 rounded-xl border-2 border-slate-200 text-xs bg-white"
                    />
                  </div>

                  {/* Filosofi 2 */}
                  <div className="bg-slate-50 border-2 border-b-4 border-slate-200 rounded-2xl p-4 space-y-3">
                    <span className="text-xs font-black text-[#D97706] uppercase tracking-wider block">
                      Makna 2 (Blangkon & Surjan Lurik)
                    </span>
                    <input
                      type="text"
                      value={mascotForm.data.filosofi_2_title || ''}
                      onChange={(e) => mascotForm.setData('filosofi_2_title', e.target.value)}
                      placeholder="Judul filosofi 2"
                      className="w-full px-3.5 py-2 rounded-xl border-2 border-slate-200 text-xs font-bold bg-white mb-2"
                    />
                    <textarea
                      rows={2}
                      value={mascotForm.data.filosofi_2_desc || ''}
                      onChange={(e) => mascotForm.setData('filosofi_2_desc', e.target.value)}
                      placeholder="Uraian filosofi 2"
                      className="w-full px-3.5 py-2 rounded-xl border-2 border-slate-200 text-xs bg-white"
                    />
                  </div>

                  {/* Filosofi 3 */}
                  <div className="bg-slate-50 border-2 border-b-4 border-slate-200 rounded-2xl p-4 space-y-3">
                    <span className="text-xs font-black text-[#46A302] uppercase tracking-wider block">
                      Makna 3 (Sayap & Surat Suara)
                    </span>
                    <input
                      type="text"
                      value={mascotForm.data.filosofi_3_title || ''}
                      onChange={(e) => mascotForm.setData('filosofi_3_title', e.target.value)}
                      placeholder="Judul filosofi 3"
                      className="w-full px-3.5 py-2 rounded-xl border-2 border-slate-200 text-xs font-bold bg-white mb-2"
                    />
                    <textarea
                      rows={2}
                      value={mascotForm.data.filosofi_3_desc || ''}
                      onChange={(e) => mascotForm.setData('filosofi_3_desc', e.target.value)}
                      placeholder="Uraian filosofi 3"
                      className="w-full px-3.5 py-2 rounded-xl border-2 border-slate-200 text-xs bg-white"
                    />
                  </div>

                  {/* Filosofi 4 */}
                  <div className="bg-slate-50 border-2 border-b-4 border-slate-200 rounded-2xl p-4 space-y-3">
                    <span className="text-xs font-black text-[#9333EA] uppercase tracking-wider block">
                      Makna 4 (Ekspresi Ceria & Ramah)
                    </span>
                    <input
                      type="text"
                      value={mascotForm.data.filosofi_4_title || ''}
                      onChange={(e) => mascotForm.setData('filosofi_4_title', e.target.value)}
                      placeholder="Judul filosofi 4"
                      className="w-full px-3.5 py-2 rounded-xl border-2 border-slate-200 text-xs font-bold bg-white mb-2"
                    />
                    <textarea
                      rows={2}
                      value={mascotForm.data.filosofi_4_desc || ''}
                      onChange={(e) => mascotForm.setData('filosofi_4_desc', e.target.value)}
                      placeholder="Uraian filosofi 4"
                      className="w-full px-3.5 py-2 rounded-xl border-2 border-slate-200 text-xs bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 6: Pengaturan Tambahan (Tahapan Data & Pengumuman) */}
              <div className="bg-white border-2 border-b-4 border-slate-200 rounded-3xl p-6 sm:p-8 space-y-4 shadow-sm">
                <div className="flex items-center gap-2.5 pb-3 border-b-2 border-slate-100">
                  <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-black text-sm">
                    6
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

        {/* TAB 4: DATA PEMILIH TERLEWAT (hanya tampil jika ada pending) */}
        {activeTab === 'terlewat' && (
          <div className="space-y-5">
            <PendingSkippedVotersView
              initialPendingVoters={pendingSkippedVoters}
              allTpsOptions={allTpsOptions}
              onNavigateToDps={() => setActiveTab('dps')}
              onCountChange={(count) => {
                setPendingCount(count);
                if (count === 0) {
                  setActiveTab('dps');
                }
              }}
            />
          </div>
        )}

        {/* TAB 5: DATA NIK GANDA (hanya tampil jika ada riwayat data ganda dari import) */}
        {activeTab === 'ganda' && (
          <div className="space-y-5">
            <ImportDuplicateVotersView
              initialDuplicateVoters={importDuplicateVoters}
              allTpsOptions={allTpsOptions}
              onNavigateToDps={() => setActiveTab('dps')}
              onCountChange={(count) => {
                setDuplicateCount(count);
                if (count === 0) {
                  setActiveTab('dps');
                }
              }}
            />
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
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-1">
                  <label className="block text-xs font-black uppercase text-slate-700 mb-1">
                    No. DPT (Opsional)
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={voterForm.data.no_urut}
                    onChange={(e) => voterForm.setData('no_urut', e.target.value ? Number(e.target.value) : '')}
                    placeholder="Auto (1, 2...)"
                    className="w-full px-3 py-2 bg-slate-50 border-2 border-slate-200 rounded-xl text-xs font-extrabold tracking-wider text-slate-900 focus:outline-none focus:border-[#58CC02]"
                  />
                  {voterForm.errors.no_urut && (
                    <span className="text-[10px] text-[#EA2B2B] font-bold block mt-1">
                      {voterForm.errors.no_urut}
                    </span>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-black uppercase text-slate-700 mb-1">
                    NIK 16 Digit *
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
