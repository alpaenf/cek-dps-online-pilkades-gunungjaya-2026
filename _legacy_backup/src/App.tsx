/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { RefreshCw, Database, CheckCircle2, AlertCircle, ShieldCheck, LogOut, FileSpreadsheet, ImageIcon, Sparkles, BarChart3 } from 'lucide-react';
import { Header } from './components/Header';
import { HeroSearch } from './components/HeroSearch';
import { SearchResult } from './components/SearchResult';
import { TpsInformation } from './components/TpsInformation';
import { GoogleSheetGuideModal } from './components/GoogleSheetGuideModal';
import { LogoManagerModal } from './components/LogoManagerModal';
import { MascotManagerModal } from './components/MascotManagerModal';
import { RecapManagerModal } from './components/RecapManagerModal';
import { AdminLoginModal } from './components/AdminLoginModal';
import { WatermarkBackground } from './components/WatermarkBackground';
import { Footer } from './components/Footer';
import { DEFAULT_CONFIG, DEFAULT_TPS_LIST, executeDptCheck } from './data/mockDatabase';
import { DEFAULT_VILLAGE_LOGO, DEFAULT_WATERMARK, DEFAULT_BLACK_BANNER, DEFAULT_GLOSSY_BG, DEFAULT_MASCOT_GLAWU } from './data/logoPresets';
import { DptPublicResult, PilkadesConfig, TpsItem, DpsRecapData } from './types/pilkades';
import { DEFAULT_DPS_RECAP, applyTpsLocationsToRecap } from './data/dpsRecapData';

export default function App() {
  // Topologi Halaman Terpisah: Halaman Cek DPS & Halaman Informasi TPS (Default: Cek DPS)
  const [activePage, setActivePage] = useState<'cek-dps' | 'informasi-tps'>('cek-dps');
  const [isLoading, setIsLoading] = useState(false);
  const [searchResult, setSearchResult] = useState<DptPublicResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | undefined>();
  const [config, setConfig] = useState<PilkadesConfig>(DEFAULT_CONFIG);
  const [tpsList, setTpsList] = useState<TpsItem[]>(DEFAULT_TPS_LIST);
  const [recapData, setRecapData] = useState<DpsRecapData>(() => {
    try {
      const saved = localStorage.getItem('pilkades_custom_dps_recap');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed.totalDps === 'number') {
          return applyTpsLocationsToRecap(parsed, DEFAULT_TPS_LIST);
        }
      }
    } catch {}
    return applyTpsLocationsToRecap(DEFAULT_DPS_RECAP, DEFAULT_TPS_LIST);
  });
  const [isSheetGuideOpen, setIsSheetGuideOpen] = useState(false);
  const [isLogoModalOpen, setIsLogoModalOpen] = useState(false);
  const [isMascotModalOpen, setIsMascotModalOpen] = useState(false);
  const [isRecapModalOpen, setIsRecapModalOpen] = useState(false);

  // Maskot Pilkades (GLAWU) yang dapat diedit oleh Admin
  const [mascotSrc, setMascotSrc] = useState<string>(() => {
    return localStorage.getItem('pilkades_custom_mascot') || DEFAULT_MASCOT_GLAWU;
  });

  const handleUpdateMascot = (newMascot: string) => {
    setMascotSrc(newMascot);
    try {
      localStorage.setItem('pilkades_custom_mascot', newMascot);
    } catch {
      // ignore
    }
  };

  const handleResetMascot = () => {
    setMascotSrc(DEFAULT_MASCOT_GLAWU);
    try {
      localStorage.removeItem('pilkades_custom_mascot');
    } catch {
      // ignore
    }
  };

  // Watermark Background Website
  const [watermarkSrc, setWatermarkSrc] = useState<string>(() => {
    return localStorage.getItem('pilkades_watermark_src') || DEFAULT_WATERMARK;
  });
  const [watermarkOpacity, setWatermarkOpacity] = useState<number>(() => {
    const saved = localStorage.getItem('pilkades_watermark_opacity');
    return saved !== null ? parseFloat(saved) : 0.08;
  });
  const [bgImageSrc, setBgImageSrc] = useState<string>(() => {
    return localStorage.getItem('pilkades_custom_bg') || DEFAULT_GLOSSY_BG;
  });

  const handleUpdateWatermark = (src: string, opacity: number) => {
    setWatermarkSrc(src);
    setWatermarkOpacity(opacity);
    try {
      localStorage.setItem('pilkades_watermark_src', src);
      localStorage.setItem('pilkades_watermark_opacity', opacity.toString());
    } catch {
      // ignore
    }
  };

  // Mode Administrator
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    return localStorage.getItem('pilkades_is_admin') === 'true';
  });
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [adminPin, setAdminPin] = useState<string>(() => {
    return localStorage.getItem('pilkades_admin_pin') || '123456';
  });

  // Otomatis buka form login admin jika URL memiliki ?admin=1 atau hash #admin
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('admin') === '1' || params.get('admin') === 'true' || window.location.hash === '#admin') {
      setIsAdminLoginOpen(true);
    }
  }, []);

  const handleLoginAdmin = () => {
    setIsAdmin(true);
    localStorage.setItem('pilkades_is_admin', 'true');
  };

  const handleLogoutAdmin = () => {
    setIsAdmin(false);
    localStorage.removeItem('pilkades_is_admin');
  };

  const handleUpdatePin = (newPin: string) => {
    setAdminPin(newPin);
    localStorage.setItem('pilkades_admin_pin', newPin);
  };

  // Logo Pilkades
  const [currentLogo, setCurrentLogo] = useState<string>(() => {
    return localStorage.getItem('pilkades_custom_logo') || DEFAULT_VILLAGE_LOGO;
  });

  const handleSelectLogo = (logoSrc: string) => {
    setCurrentLogo(logoSrc);
    try {
      localStorage.setItem('pilkades_custom_logo', logoSrc);
    } catch {
      // ignore
    }
  };

  // Google Sheets Apps Script URL
  const [appsScriptUrl, setAppsScriptUrl] = useState<string>(() => {
    return localStorage.getItem('pilkades_gas_url') || '';
  });
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [syncToast, setSyncToast] = useState<string | null>(null);

  const fetchLiveConfigAndTps = async (url: string) => {
    if (!url) return;
    setIsSyncing(true);
    try {
      const isGas = url.includes('/exec') || url.includes('script.google.com');
      const isSheet = url.includes('spreadsheets/d/');

      // Load Config
      const resConfig = await fetch('/api/get-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gasUrl: isGas ? url : undefined,
          spreadsheetUrl: isSheet ? url : undefined
        })
      });
      if (resConfig.ok) {
        const dataConfig = await resConfig.json();
        if (dataConfig.success && dataConfig.config && Object.keys(dataConfig.config).length > 0) {
          setConfig(prev => ({
            ...prev,
            nama_kegiatan: dataConfig.config.nama_kegiatan || prev.nama_kegiatan,
            desa: dataConfig.config.desa || prev.desa,
            kecamatan: dataConfig.config.kecamatan || prev.kecamatan,
            kabupaten: dataConfig.config.kabupaten || prev.kabupaten,
            tahun: dataConfig.config.tahun || prev.tahun,
            tanggal_pemungutan: dataConfig.config.tanggal_pemungutan || prev.tanggal_pemungutan,
            kontak_panitia: dataConfig.config.kontak_panitia || prev.kontak_panitia,
            whatsapp_panitia: dataConfig.config.whatsapp_panitia || prev.whatsapp_panitia,
            alamat_sekretariat: dataConfig.config.alamat_sekretariat || prev.alamat_sekretariat,
            pengumuman: dataConfig.config.pengumuman || prev.pengumuman
          }));
        }
      }

      // Load TPS
      const resTps = await fetch('/api/get-tps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gasUrl: isGas ? url : undefined,
          spreadsheetUrl: isSheet ? url : undefined
        })
      });
      if (resTps.ok) {
        const dataTps = await resTps.json();
        if (dataTps.success && Array.isArray(dataTps.list) && dataTps.list.length > 0) {
          setTpsList(dataTps.list);
          setRecapData(prev => applyTpsLocationsToRecap(prev, dataTps.list));
        }
      }

      // Load & Hitung Rekapitulasi Otomatis (L/P dan per TPS dari Sheet DPS)
      try {
        const resRecap = await fetch('/api/get-dps-recap', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            gasUrl: isGas ? url : undefined,
            spreadsheetUrl: isSheet ? url : undefined
          })
        });
        if (resRecap.ok) {
          const dataRecap = await resRecap.json();
          if (dataRecap.success && dataRecap.recap) {
            setRecapData(dataRecap.recap);
            try {
              localStorage.setItem('pilkades_custom_dps_recap', JSON.stringify(dataRecap.recap));
            } catch {}
          }
        }
      } catch {}

      setSyncToast('Data DPS, Pengaturan & TPS berhasil disinkronkan langsung dari Google Spreadsheet!');
      setTimeout(() => setSyncToast(null), 4000);
    } catch (e) {
      console.error('Error fetching live config/tps:', e);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleSaveRecapData = (newRecap: DpsRecapData) => {
    setRecapData(newRecap);
    try {
      localStorage.setItem('pilkades_custom_dps_recap', JSON.stringify(newRecap));
    } catch {}
    setSyncToast('Data Rekapitulasi Laki-laki & Perempuan berhasil diperbarui!');
    setTimeout(() => setSyncToast(null), 3500);
  };

  const handleResetRecapData = () => {
    try {
      localStorage.removeItem('pilkades_custom_dps_recap');
    } catch {}
    setRecapData(applyTpsLocationsToRecap(DEFAULT_DPS_RECAP, tpsList));
    setSyncToast('Data Rekapitulasi dikembalikan ke default resmi.');
    setTimeout(() => setSyncToast(null), 3500);
  };

  useEffect(() => {
    if (appsScriptUrl) {
      fetchLiveConfigAndTps(appsScriptUrl);
    }
  }, [appsScriptUrl]);

  const handleSaveAppsScriptUrl = (url: string) => {
    setAppsScriptUrl(url);
    if (url) {
      localStorage.setItem('pilkades_gas_url', url);
      fetchLiveConfigAndTps(url);
    } else {
      localStorage.removeItem('pilkades_gas_url');
      try {
        localStorage.removeItem('pilkades_custom_dps_recap');
      } catch {}
      setConfig(DEFAULT_CONFIG);
      setTpsList(DEFAULT_TPS_LIST);
      setRecapData(applyTpsLocationsToRecap(DEFAULT_DPS_RECAP, DEFAULT_TPS_LIST));
    }
  };

  // Mencari NIK
  const handleSearch = async (nik: string) => {
    setIsLoading(true);
    setErrorMessage(undefined);
    setSearchResult(null);

    const res = await executeDptCheck(nik, appsScriptUrl);

    setIsLoading(false);

    if (res.error) {
      setErrorMessage(res.error);
      setSearchResult(null);
    } else if (res.result) {
      setSearchResult(res.result);
      setErrorMessage(undefined);

      // Scroll halus ke kartu hasil
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

  // Pindah Halaman Terpisah (Cek DPS vs Informasi TPS)
  const handleSwitchPage = (page: 'cek-dps' | 'informasi-tps') => {
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#020408]/80 flex flex-col text-slate-100 selection:bg-amber-500 selection:text-slate-950 relative">
      {/* Watermark Background Website dengan Gradasi Hitam Mengkilap & Banner Resmi */}
      <WatermarkBackground watermarkSrc={watermarkSrc} bannerSrc={DEFAULT_BLACK_BANNER} bgSrc={bgImageSrc} opacity={watermarkOpacity} />

      {/* Header dengan identitas Desa Gunungjaya */}
      <Header
        onOpenSheetGuide={() => setIsSheetGuideOpen(true)}
        onOpenLogoModal={() => setIsLogoModalOpen(true)}
        currentLogo={currentLogo}
        activePage={activePage}
        onSelectPage={handleSwitchPage}
        isAdmin={isAdmin}
        onOpenAdminModal={() => setIsAdminLoginOpen(true)}
        onOpenMascotModal={() => setIsMascotModalOpen(true)}
      />

      {/* Admin Bar (Hanya tampil jika login admin) */}
      {isAdmin && (
        <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-500 text-slate-950 px-4 py-2 text-xs font-semibold shadow-md flex items-center justify-between border-b border-amber-400 z-30 relative">
          <div className="flex items-center gap-2">
            <span className="bg-slate-950 text-amber-300 px-2 py-0.5 rounded text-[10px] font-mono uppercase font-black tracking-wider flex items-center gap-1 shadow-xs">
              <ShieldCheck className="w-3 h-3 text-amber-400" />
              MODE ADMIN
            </span>
            <span className="hidden sm:inline font-bold">
              Panel Pengaturan Pilkades Aktif
            </span>
            {appsScriptUrl ? (
              <span className="text-[11px] bg-slate-900/10 px-2 py-0.5 rounded flex items-center gap-1 text-slate-950 font-medium">
                <Database className="w-3 h-3 text-emerald-800" />
                Live Google Sheets Terhubung
              </span>
            ) : (
              <span className="text-[11px] bg-amber-700/20 px-2 py-0.5 rounded text-amber-950 font-medium">
                Mode Demo (Spreadsheet Belum Ditautkan)
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {appsScriptUrl && (
              <button
                type="button"
                onClick={() => fetchLiveConfigAndTps(appsScriptUrl)}
                disabled={isSyncing}
                className="px-2.5 py-1 bg-slate-950 hover:bg-slate-900 text-amber-300 rounded text-[11px] font-bold flex items-center gap-1 transition shadow-xs cursor-pointer"
                title="Sinkronkan ulang data dari spreadsheet sekarang"
              >
                <RefreshCw className={`w-3 h-3 ${isSyncing ? 'animate-spin text-amber-400' : ''}`} />
                <span>{isSyncing ? 'Menyinkronkan...' : 'Sinkronkan'}</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setIsRecapModalOpen(true)}
              className="px-2.5 py-1 bg-slate-950 hover:bg-slate-900 text-amber-300 rounded text-[11px] font-bold flex items-center gap-1 transition shadow-xs cursor-pointer"
              title="Koreksi rincian pemilih Laki-laki & Perempuan DPS"
            >
              <BarChart3 className="w-3 h-3 text-amber-400" />
              <span>Kelola Rekap DPS</span>
            </button>

            <button
              type="button"
              onClick={() => setIsMascotModalOpen(true)}
              className="px-2.5 py-1 bg-slate-950 hover:bg-slate-900 text-amber-300 rounded text-[11px] font-bold flex items-center gap-1 transition shadow-xs cursor-pointer"
              title="Ganti Gambar Maskot Pilkades"
            >
              <span>🦅</span>
              <span className="hidden sm:inline">Ubah Maskot</span>
            </button>

            <button
              type="button"
              onClick={() => setIsLogoModalOpen(true)}
              className="px-2.5 py-1 bg-slate-950 hover:bg-slate-900 text-amber-300 rounded text-[11px] font-bold flex items-center gap-1 transition shadow-xs cursor-pointer"
              title="Ganti Logo Pilkades"
            >
              <ImageIcon className="w-3 h-3 text-amber-400" />
              <span className="hidden sm:inline">Ubah Logo</span>
            </button>

            <button
              type="button"
              onClick={() => setIsSheetGuideOpen(true)}
              className="px-2.5 py-1 bg-emerald-950 hover:bg-emerald-900 text-emerald-300 rounded text-[11px] font-bold flex items-center gap-1 transition shadow-xs cursor-pointer"
              title="Atur Integrasi Google Sheets"
            >
              <FileSpreadsheet className="w-3 h-3 text-emerald-400" />
              <span className="hidden sm:inline">Pengaturan Sheets</span>
            </button>

            <button
              type="button"
              onClick={handleLogoutAdmin}
              className="px-2.5 py-1 bg-red-950 hover:bg-red-900 text-red-200 rounded text-[11px] font-bold transition flex items-center gap-1 cursor-pointer"
              title="Keluar dari sesi administrator"
            >
              <LogOut className="w-3 h-3 text-red-400" />
              <span>Keluar</span>
            </button>
          </div>
        </div>
      )}

      {/* Toast Notifikasi Sinkronisasi Berhasil */}
      {syncToast && (
        <div className="bg-emerald-600 text-white text-xs py-2 px-4 text-center font-medium shadow-sm flex items-center justify-center gap-2 animate-fadeIn relative z-20">
          <CheckCircle2 className="w-4 h-4" />
          <span>{syncToast}</span>
        </div>
      )}

      {/* Main Content: Terpisah secara topologi (Cek DPS vs Informasi TPS) */}
      <main className="flex-1 relative z-10">
        {/* Mobile Segmented Switcher (Sangat ergonomis di HP / Smartphone browser) */}
        <div className="sm:hidden px-4 pt-4 pb-1">
          <div className="bg-slate-950/90 p-1 rounded-2xl border border-amber-500/30 flex items-center shadow-lg">
            <button
              type="button"
              onClick={() => handleSwitchPage('cek-dps')}
              className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 min-h-[44px] cursor-pointer ${
                activePage === 'cek-dps'
                  ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <span>🔍 Cek DPS</span>
            </button>
            <button
              type="button"
              onClick={() => handleSwitchPage('informasi-tps')}
              className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 min-h-[44px] cursor-pointer ${
                activePage === 'informasi-tps'
                  ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <span>📍 Daftar TPS (1 - 5)</span>
            </button>
          </div>
        </div>

        {/* ================= HALAMAN 1: CEK DPS ONLINE (DEFAULT DITAMPILKAN) ================= */}
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
              watermarkSrc={watermarkSrc}
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
                watermarkSrc={watermarkSrc}
                mascotSrc={mascotSrc}
              />
            )}
          </div>
        )}

        {/* ================= HALAMAN 2: INFORMASI TPS (HANYA MUNCUL KETIKA MENU DIKLIK) ================= */}
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

      {/* Footer Resmi Desa & Sekretariat P2KD (Tetap Ditampilkan di Semua Halaman Website) */}
      <Footer
        config={config}
        onOpenSheetGuide={() => setIsSheetGuideOpen(true)}
        currentLogo={currentLogo}
        onOpenLogoModal={() => setIsLogoModalOpen(true)}
        isAdmin={isAdmin}
        onOpenAdminModal={() => setIsAdminLoginOpen(true)}
        onSelectPage={handleSwitchPage}
      />

      {/* Fixed Bottom Tab Bar on Mobile (Ergonomic Thumb Zone - Touch Target >= 48px) */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-xl border-t border-amber-500/30 shadow-[0_-10px_25px_rgba(0,0,0,0.9)] pb-safe">
        <div className="grid grid-cols-2 items-center h-16 px-4 gap-2">
          <button
            type="button"
            onClick={() => handleSwitchPage('cek-dps')}
            className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all min-h-[48px] cursor-pointer ${
              activePage === 'cek-dps'
                ? 'text-amber-400 font-black bg-amber-500/10'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span className="text-lg">🔍</span>
            <span className="text-[11px] font-bold tracking-tight">Cek DPS</span>
          </button>

          <button
            type="button"
            onClick={() => handleSwitchPage('informasi-tps')}
            className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all min-h-[48px] cursor-pointer ${
              activePage === 'informasi-tps'
                ? 'text-amber-400 font-black bg-amber-500/10'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span className="text-lg">📍</span>
            <span className="text-[11px] font-bold tracking-tight">Daftar TPS (1 - 5)</span>
          </button>
        </div>
      </div>

      {/* Modal Penggantian Maskot Pilkades (Khusus Admin) */}
      <MascotManagerModal
        isOpen={isMascotModalOpen}
        onClose={() => setIsMascotModalOpen(false)}
        currentMascot={mascotSrc}
        onUpdateMascot={handleUpdateMascot}
        onResetMascot={handleResetMascot}
      />

      {/* Modal Penggantian Logo & Watermark (Khusus Admin) */}
      <LogoManagerModal
        isOpen={isLogoModalOpen}
        onClose={() => setIsLogoModalOpen(false)}
        currentLogo={currentLogo}
        onSelectLogo={handleSelectLogo}
        watermarkSrc={watermarkSrc}
        watermarkOpacity={watermarkOpacity}
        onUpdateWatermark={handleUpdateWatermark}
      />

      {/* Modal Panduan & Integrasi Google Sheets + Apps Script (Khusus Admin) */}
      <GoogleSheetGuideModal
        isOpen={isSheetGuideOpen}
        onClose={() => setIsSheetGuideOpen(false)}
        appsScriptUrl={appsScriptUrl}
        onSaveAppsScriptUrl={handleSaveAppsScriptUrl}
      />

      {/* Modal Kelola & Koreksi Rekapitulasi DPS (Khusus Admin) */}
      <RecapManagerModal
        isOpen={isRecapModalOpen}
        onClose={() => setIsRecapModalOpen(false)}
        recapData={recapData}
        tpsList={tpsList}
        appsScriptUrl={appsScriptUrl}
        onSaveRecap={handleSaveRecapData}
        onResetRecap={handleResetRecapData}
      />

      {/* Modal Login & Pengaturan Administrator (dengan Menu Ubah Maskot setelah PIN dimasukkan) */}
      <AdminLoginModal
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
        onLoginSuccess={handleLoginAdmin}
        currentPin={adminPin}
        onUpdatePin={handleUpdatePin}
        isAdmin={isAdmin}
        onLogout={handleLogoutAdmin}
        onOpenMascotModal={() => setIsMascotModalOpen(true)}
        onOpenLogoModal={() => setIsLogoModalOpen(true)}
        onOpenSheetGuide={() => setIsSheetGuideOpen(true)}
        onOpenRecapModal={() => setIsRecapModalOpen(true)}
      />
    </div>
  );
}
