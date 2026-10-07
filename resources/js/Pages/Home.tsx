import React, { useState, useEffect } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { RefreshCw, CheckCircle2, FileSpreadsheet, ImageIcon, BarChart3, Sparkles, Search, MapPin } from 'lucide-react';
import { Header } from '@/Components/Header';
import { HeroSearch } from '@/Components/HeroSearch';
import { SearchResult } from '@/Components/SearchResult';
import { TpsInformation } from '@/Components/TpsInformation';
import { GoogleSheetGuideModal } from '@/Components/GoogleSheetGuideModal';
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
      localStorage.removeItem('pilkades_custom_mascot');
      localStorage.removeItem('pilkades_custom_logo');
    } catch {}
  }, []);

  const [isSheetGuideOpen, setIsSheetGuideOpen] = useState(false);
  const [isRecapModalOpen, setIsRecapModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  // Maskot & Logo Pilkades
  const mascotSrc = DEFAULT_MASCOT_GLAWU;
  const currentLogo = DEFAULT_VILLAGE_LOGO;

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
        <link rel="preload" as="image" href={DEFAULT_MASCOT_GLAWU} type="image/webp" />
      </Head>

      {/* Duolingo Splash Screen saat user buka web */}
      <DuolingoSplashScreen mascotSrc={mascotSrc} desa={config.desa} />

      {/* Clean Duolingo Dot Grid Background */}
      <WatermarkBackground />

      {/* Header */}
      <Header
        onOpenSheetGuide={() => setIsSheetGuideOpen(true)}
        currentLogo={currentLogo}
        activePage={activePage}
        onSelectPage={handleSwitchPage}
        isAdmin={isAdmin}
        onOpenShareModal={() => setIsShareModalOpen(true)}
      />

      {/* Toast Notification */}
      {syncToast && (
        <div className="bg-[#58CC02] text-white text-xs font-black py-2.5 px-4 text-center shadow-sm flex items-center justify-center gap-2 animate-fadeIn relative z-20">
          <CheckCircle2 className="w-4 h-4" />
          <span>{syncToast}</span>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 relative z-10">

        {/* Halaman 1: Cek DPS */}
        {activePage === 'cek-dps' && (
          <div className="animate-in fade-in duration-200">
            <HeroSearch
              onSearch={handleSearch}
              isLoading={isLoading}
              errorMessage={errorMessage}
              onClearError={() => setErrorMessage(undefined)}
              currentLogo={currentLogo}
              onOpenLogoModal={() => {}}
              onOpenSheetGuide={() => setIsSheetGuideOpen(true)}
              onSwitchToDemo={() => {
                handleSaveAppsScriptUrl('');
                setErrorMessage(undefined);
              }}
              isAdmin={isAdmin}
              mascotSrc={mascotSrc}
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
        onOpenLogoModal={() => {}}
        isAdmin={isAdmin}
        onSelectPage={handleSwitchPage}
      />

      {/* Modals */}

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
