import React, { useState, useEffect } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { RefreshCw, CheckCircle2, ShieldCheck, LogOut, FileSpreadsheet, ImageIcon, BarChart3, Sparkles, Search, MapPin, Database } from 'lucide-react';
import { Header } from '@/Components/Header';
import { HeroSearch } from '@/Components/HeroSearch';
import { SearchResult } from '@/Components/SearchResult';
import { TpsInformation } from '@/Components/TpsInformation';
import { GoogleSheetGuideModal } from '@/Components/GoogleSheetGuideModal';
import { LogoManagerModal } from '@/Components/LogoManagerModal';
import { MascotManagerModal } from '@/Components/MascotManagerModal';
import { RecapManagerModal } from '@/Components/RecapManagerModal';
import { DuolingoSplashScreen } from '@/Components/DuolingoSplashScreen';
import { ShareModal } from '@/Components/ShareModal';
import { WatermarkBackground } from '@/Components/WatermarkBackground';
import { Footer } from '@/Components/Footer';
import { DEFAULT_CONFIG, DEFAULT_TPS_LIST, executeDptCheck } from '@/data/mockDatabase';
import { DEFAULT_VILLAGE_LOGO, DEFAULT_MASCOT_GLAWU } from '@/data/logoPresets';
import { DptPublicResult, PilkadesConfig, TpsItem, DpsRecapData } from '@/types/pilkades';
import { DEFAULT_DPS_RECAP, applyTpsLocationsToRecap } from '@/data/dpsRecapData';
import { PageProps } from '@/types';

interface HomeProps {
  config: PilkadesConfig;
  tpsList: TpsItem[];
  recapData: DpsRecapData;
}

export default function Home({
  config: initialConfig,
  tpsList: initialTpsList,
  recapData: initialRecapData
}: HomeProps) {
  const pageProps = usePage().props as unknown as { auth?: { user?: { name: string; role?: string; email: string } } };
  const isAdmin = pageProps.auth?.user?.role === 'admin';

  const [activePage, setActivePage] = useState<'cek-dps' | 'informasi-tps'>('cek-dps');
  const [isLoading, setIsLoading] = useState(false);
  const [searchResult, setSearchResult] = useState<DptPublicResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | undefined>();

  const [config, setConfig] = useState<PilkadesConfig>(initialConfig || DEFAULT_CONFIG);
  const [tpsList, setTpsList] = useState<TpsItem[]>(initialTpsList && initialTpsList.length > 0 ? initialTpsList : DEFAULT_TPS_LIST);
  const [recapData, setRecapData] = useState<DpsRecapData>(initialRecapData || DEFAULT_DPS_RECAP);

  useEffect(() => {
    if (initialRecapData) {
      setRecapData(initialRecapData);
    }
  }, [initialRecapData]);

  useEffect(() => {
    try {
      localStorage.removeItem('pilkades_custom_dps_recap');
      const storedMascot = localStorage.getItem('pilkades_custom_mascot');
      if (storedMascot && (storedMascot.includes('mascot_glawu_transparent') || storedMascot.includes('mascot_guide_transparent') || storedMascot.includes('mascot_glawu_png') || storedMascot.includes('mascot_glawu_1790262373859'))) {
        localStorage.removeItem('pilkades_custom_mascot');
        setMascotSrc(DEFAULT_MASCOT_GLAWU);
      }
    } catch {}
  }, []);

  const [isSheetGuideOpen, setIsSheetGuideOpen] = useState(false);
  const [isLogoModalOpen, setIsLogoModalOpen] = useState(false);
  const [isMascotModalOpen, setIsMascotModalOpen] = useState(false);
  const [isRecapModalOpen, setIsRecapModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  // Maskot Pilkades
  const [mascotSrc, setMascotSrc] = useState<string>(() => {
    return localStorage.getItem('pilkades_custom_mascot') || DEFAULT_MASCOT_GLAWU;
  });

  const handleUpdateMascot = (newMascot: string) => {
    setMascotSrc(newMascot);
    try {
      localStorage.setItem('pilkades_custom_mascot', newMascot);
    } catch {}
  };

  const handleResetMascot = () => {
    setMascotSrc(DEFAULT_MASCOT_GLAWU);
    try {
      localStorage.removeItem('pilkades_custom_mascot');
    } catch {}
  };

  // Logo Pilkades
  const [currentLogo, setCurrentLogo] = useState<string>(() => {
    return localStorage.getItem('pilkades_custom_logo') || DEFAULT_VILLAGE_LOGO;
  });

  const handleSelectLogo = (logoSrc: string) => {
    setCurrentLogo(logoSrc);
    try {
      localStorage.setItem('pilkades_custom_logo', logoSrc);
    } catch {}
  };

  // Google Sheets Apps Script URL
  const [appsScriptUrl, setAppsScriptUrl] = useState<string>(() => {
    return localStorage.getItem('pilkades_gas_url') || '';
  });
  const [syncToast, setSyncToast] = useState<string | null>(null);

  const handleSaveRecapData = (newRecap: DpsRecapData) => {
    setRecapData(newRecap);
    try {
      localStorage.setItem('pilkades_custom_dps_recap', JSON.stringify(newRecap));
    } catch {}
    setSyncToast('Data Rekapitulasi berhasil diperbarui.');
    setTimeout(() => setSyncToast(null), 3500);
  };

  const handleResetRecapData = () => {
    try {
      localStorage.removeItem('pilkades_custom_dps_recap');
    } catch {}
    setRecapData(initialRecapData || applyTpsLocationsToRecap(DEFAULT_DPS_RECAP, tpsList));
    setSyncToast('Data Rekapitulasi dikembalikan ke default.');
    setTimeout(() => setSyncToast(null), 3500);
  };

  const handleSaveAppsScriptUrl = (url: string) => {
    setAppsScriptUrl(url);
    if (url) {
      localStorage.setItem('pilkades_gas_url', url);
    } else {
      localStorage.removeItem('pilkades_gas_url');
      try {
        localStorage.removeItem('pilkades_custom_dps_recap');
      } catch {}
      setConfig(initialConfig || DEFAULT_CONFIG);
      setTpsList(initialTpsList || DEFAULT_TPS_LIST);
      setRecapData(initialRecapData || DEFAULT_DPS_RECAP);
    }
  };

  // Pencarian NIK via MySQL dengan animasi maskot GLAWU ala Duolingo
  const handleSearch = async (nik: string) => {
    setIsLoading(true);
    setErrorMessage(undefined);
    setSearchResult(null);

    const startTime = Date.now();
    const res = await executeDptCheck(nik, appsScriptUrl);
    const elapsed = Date.now() - startTime;
    // Beri jeda animasi maskot GLAWU minimal 1.2 detik agar animasi lompatan & progress bar dinikmati pengguna
    if (elapsed < 1200) {
      await new Promise((resolve) => setTimeout(resolve, 1200 - elapsed));
    }

    setIsLoading(false);

    if (res.error) {
      setErrorMessage(res.error);
      setSearchResult(null);
    } else if (res.result) {
      setSearchResult(res.result);
      setErrorMessage(undefined);

      setTimeout(() => {
        const el = document.getElementById('hasil-pencarian');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  };

  const handleReset = () => {
    setSearchResult(null);
    setErrorMessage(undefined);
    handleSwitchPage('cek-dps');
  };

  const handleSwitchPage = (page: 'cek-dps' | 'informasi-tps') => {
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#F7F9FA] flex flex-col text-slate-800 selection:bg-[#58CC02] selection:text-white relative font-sans">
      <Head>
        <title>{`Cek DPS Online - ${config.nama_kegiatan} | Desa ${config.desa}`}</title>
        <meta name="description" content={`Layanan Resmi Pengecekan Daftar Pemilih Sementara (DPS) & DPT Pemilihan Kepala Desa ${config.desa} Tahun ${config.tahun}.`} />
      </Head>

      {/* Duolingo Splash Screen saat user buka web */}
      <DuolingoSplashScreen mascotSrc={mascotSrc} desa={config.desa} />

      {/* Clean Duolingo Dot Grid Background */}
      <WatermarkBackground />

      {/* Header */}
      <Header
        onOpenSheetGuide={() => setIsSheetGuideOpen(true)}
        onOpenLogoModal={() => setIsLogoModalOpen(true)}
        currentLogo={currentLogo}
        activePage={activePage}
        onSelectPage={handleSwitchPage}
        isAdmin={isAdmin}
        onOpenMascotModal={() => setIsMascotModalOpen(true)}
        onOpenShareModal={() => setIsShareModalOpen(true)}
      />

      {/* Admin Top Bar (Hanya tampil jika user sudah login sebagai role admin via /admin) */}
      {isAdmin && (
        <div className="bg-[#FFF5D1] border-b-2 border-[#FFC800] px-4 py-2.5 text-xs text-amber-950 font-bold shadow-xs flex items-center justify-between z-30 relative">
          <div className="flex items-center gap-2">
            <span className="bg-[#FFC800] text-amber-950 px-2.5 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wider flex items-center gap-1 border-b-2 border-[#E59B00]">
              <ShieldCheck className="w-3.5 h-3.5" />
              Role Admin Aktif
            </span>
            <span className="hidden sm:inline font-black text-slate-800">
              Halo, {pageProps.auth?.user?.name || 'Panitia'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href={route('admin.dashboard')}
              className="px-3.5 py-1.5 bg-[#58CC02] hover:bg-[#4ebb02] text-white rounded-xl text-xs font-black border-b-4 border-[#46A302] active:border-b-0 flex items-center gap-1.5 transition cursor-pointer shadow-xs"
            >
              <Database className="w-3.5 h-3.5" />
              <span>Buka Panel Admin (CRUD TPS & DPS)</span>
            </Link>

            <button
              type="button"
              onClick={() => router.post(route('logout'))}
              className="px-3 py-1.5 bg-[#FF4B4B] hover:bg-[#e03d3d] text-white rounded-xl text-xs font-black border-b-4 border-[#EA2B2B] active:border-b-0 flex items-center gap-1 cursor-pointer transition"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {syncToast && (
        <div className="bg-[#58CC02] text-white text-xs font-black py-2.5 px-4 text-center shadow-sm flex items-center justify-center gap-2 animate-fadeIn relative z-20">
          <CheckCircle2 className="w-4 h-4" />
          <span>{syncToast}</span>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 relative z-10">
        {/* Mobile Segmented Switcher */}
        <div className="sm:hidden px-4 pt-4 pb-2">
          <div className="bg-white p-1 rounded-2xl border-2 border-b-4 border-slate-200 flex items-center shadow-xs">
            <button
              type="button"
              onClick={() => handleSwitchPage('cek-dps')}
              className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 min-h-[44px] cursor-pointer ${
                activePage === 'cek-dps'
                  ? 'bg-[#58CC02] text-white border-b-2 border-[#46A302] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Search className="w-4 h-4" />
              <span>Cek DPS</span>
            </button>
            <button
              type="button"
              onClick={() => handleSwitchPage('informasi-tps')}
              className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 min-h-[44px] cursor-pointer ${
                activePage === 'informasi-tps'
                  ? 'bg-[#1CB0F6] text-white border-b-2 border-[#1899D6] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <MapPin className="w-4 h-4" />
              <span>5 TPS</span>
            </button>
          </div>
        </div>

        {/* Halaman 1: Cek DPS */}
        {activePage === 'cek-dps' && (
          <div className="animate-in fade-in duration-200">
            <HeroSearch
              onSearch={handleSearch}
              isLoading={isLoading}
              errorMessage={errorMessage}
              onClearError={() => setErrorMessage(undefined)}
              currentLogo={currentLogo}
              onOpenLogoModal={() => setIsLogoModalOpen(true)}
              onOpenSheetGuide={() => setIsSheetGuideOpen(true)}
              onSwitchToDemo={() => {
                handleSaveAppsScriptUrl('');
                setErrorMessage(undefined);
              }}
              isAdmin={isAdmin}
              mascotSrc={mascotSrc}
              onOpenMascotModal={() => setIsMascotModalOpen(true)}
              config={config}
              recapData={recapData}
              tpsList={tpsList}
              onOpenEditRecap={() => setIsRecapModalOpen(true)}
            />

            {/* Hasil Pengecekan DPS */}
            {searchResult && (
              <SearchResult
                result={searchResult}
                onReset={handleReset}
                config={config}
                tpsList={tpsList}
                onContactClick={() => {
                  handleSwitchPage('informasi-tps');
                }}
                mascotSrc={mascotSrc}
              />
            )}
          </div>
        )}

        {/* Halaman 2: Informasi TPS */}
        {activePage === 'informasi-tps' && (
          <div className="animate-in fade-in duration-200">
            <TpsInformation
              tpsList={tpsList}
              config={config}
              onBackToCekDps={() => handleSwitchPage('cek-dps')}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer
        config={config}
        onOpenSheetGuide={() => setIsSheetGuideOpen(true)}
        currentLogo={currentLogo}
        onOpenLogoModal={() => setIsLogoModalOpen(true)}
        isAdmin={isAdmin}
        onSelectPage={handleSwitchPage}
      />

      {/* Fixed Bottom Tab Bar on Mobile */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t-2 border-slate-200 shadow-md pb-safe">
        <div className="grid grid-cols-2 items-center h-16 px-4 gap-2">
          <button
            type="button"
            onClick={() => handleSwitchPage('cek-dps')}
            className={`flex flex-col items-center justify-center py-1 rounded-2xl transition-all min-h-[48px] cursor-pointer ${
              activePage === 'cek-dps'
                ? 'text-[#58CC02] font-black bg-[#E5F9D2]'
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <Search className="w-5 h-5" />
            <span className="text-[11px] font-black uppercase tracking-wider">Cek DPS</span>
          </button>

          <button
            type="button"
            onClick={() => handleSwitchPage('informasi-tps')}
            className={`flex flex-col items-center justify-center py-1 rounded-2xl transition-all min-h-[48px] cursor-pointer ${
              activePage === 'informasi-tps'
                ? 'text-[#1CB0F6] font-black bg-[#DDF4FF]'
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <MapPin className="w-5 h-5" />
            <span className="text-[11px] font-black uppercase tracking-wider">Daftar TPS</span>
          </button>
        </div>
      </div>

      {/* Modals */}
      <MascotManagerModal
        isOpen={isMascotModalOpen}
        onClose={() => setIsMascotModalOpen(false)}
        currentMascot={mascotSrc}
        onUpdateMascot={handleUpdateMascot}
        onResetMascot={handleResetMascot}
      />

      <LogoManagerModal
        isOpen={isLogoModalOpen}
        onClose={() => setIsLogoModalOpen(false)}
        currentLogo={currentLogo}
        onSelectLogo={handleSelectLogo}
        watermarkSrc=""
        watermarkOpacity={0}
        onUpdateWatermark={() => {}}
      />

      <GoogleSheetGuideModal
        isOpen={isSheetGuideOpen}
        onClose={() => setIsSheetGuideOpen(false)}
        appsScriptUrl={appsScriptUrl}
        onSaveAppsScriptUrl={handleSaveAppsScriptUrl}
      />

      <RecapManagerModal
        isOpen={isRecapModalOpen}
        onClose={() => setIsRecapModalOpen(false)}
        recapData={recapData}
        tpsList={tpsList}
        appsScriptUrl={appsScriptUrl}
        onSaveRecap={handleSaveRecapData}
        onResetRecap={handleResetRecapData}
      />

      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        config={config}
        mascotSrc={mascotSrc}
      />
    </div>
  );
}
