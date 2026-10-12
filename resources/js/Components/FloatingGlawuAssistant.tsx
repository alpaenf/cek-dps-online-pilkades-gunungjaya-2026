import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Sparkles,
  ArrowUpRight,
  Calendar,
  Phone,
  Search,
  MapPin,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Music,
  ChevronUp,
  Disc3
} from 'lucide-react';
import { DEFAULT_MASCOT_GLAWU } from '../data/logoPresets';
import { PilkadesConfig } from '../types/pilkades';

interface FloatingGlawuAssistantProps {
  config: PilkadesConfig;
  onScrollToSearch: () => void;
  onScrollToTps: () => void;
  onScrollToContact: () => void;
  onScrollToMascot: () => void;
  mascotSrc?: string;
  audioSrc?: string;
}

export const FloatingGlawuAssistant: React.FC<FloatingGlawuAssistantProps> = ({
  config,
  onScrollToSearch,
  onScrollToTps,
  onScrollToContact,
  onScrollToMascot,
  mascotSrc,
  audioSrc = '/audio/jingle-pilkades-gunungjaya.mp3'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.45);
  const [isMuted, setIsMuted] = useState(false);
  const [showAudioHint, setShowAudioHint] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const mascotName = config.mascot_name || 'Si Glawu';

  // Inisialisasi Audio & Autoplay Handlers
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = isMuted ? 0 : volume;
    audio.loop = true;

    // Cek apakah user sebelumnya sengaja mem-pause musik di sesi ini
    const wasUserPaused = sessionStorage.getItem('glawu_music_paused') === 'true';
    if (wasUserPaused) {
      setIsPlaying(false);
      return;
    }

    // Mencoba memutar audio secara otomatis (Default Nyala)
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsPlaying(true);
          setShowAudioHint(false);
        })
        .catch(() => {
          // Jika browser memblokir autoplay tanpa gesture interaksi,
          // dengarkan klik/sentuhan pertama user di mana pun pada halaman
          setIsPlaying(false);
          setShowAudioHint(true);

          const handleFirstUserGesture = () => {
            if (sessionStorage.getItem('glawu_music_paused') !== 'true' && audioRef.current) {
              audioRef.current
                .play()
                .then(() => {
                  setIsPlaying(true);
                  setShowAudioHint(false);
                })
                .catch(() => {});
            }
            window.removeEventListener('click', handleFirstUserGesture);
            window.removeEventListener('touchstart', handleFirstUserGesture);
            window.removeEventListener('keydown', handleFirstUserGesture);
          };

          window.addEventListener('click', handleFirstUserGesture, { once: true });
          window.addEventListener('touchstart', handleFirstUserGesture, { once: true });
          window.addEventListener('keydown', handleFirstUserGesture, { once: true });
        });
    }

    // Tangani perpindahan tab (pause saat tab tidak aktif, lanjutkan jika aktif)
    const handleVisibilityChange = () => {
      const currentAudio = audioRef.current;
      if (!currentAudio) return;

      if (document.hidden) {
        if (isPlaying) {
          currentAudio.pause();
        }
      } else {
        if (isPlaying && sessionStorage.getItem('glawu_music_paused') !== 'true') {
          currentAudio.play().catch(() => {});
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // Update volume & mute pada elemen audio
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
      audioRef.current.muted = isMuted;
    }
  }, [volume, isMuted]);

  // Handler Play / Pause
  const togglePlay = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
      sessionStorage.setItem('glawu_music_paused', 'true');
    } else {
      audio
        .play()
        .then(() => {
          setIsPlaying(true);
          setShowAudioHint(false);
          sessionStorage.setItem('glawu_music_paused', 'false');
        })
        .catch((err) => {
          console.warn('Gagal memutar audio:', err);
        });
    }
  };

  // Handler Mute / Unmute
  const toggleMute = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setIsMuted(!isMuted);
  };

  // Handler Ganti Volume
  const handleVolumeChange = (newVal: number) => {
    setVolume(newVal);
    if (newVal > 0 && isMuted) {
      setIsMuted(false);
    }
  };

  const handleOpen = () => {
    setIsOpen(!isOpen);
    setHasInteracted(true);
    setShowAudioHint(false);
  };

  return (
    <div className="fixed bottom-3 right-3 sm:bottom-5 sm:right-5 z-40 select-none print:hidden">
      {/* Audio Element Tersembunyi */}
      <audio
        ref={audioRef}
        src={audioSrc}
        preload="auto"
        loop
      />

      {/* Popover Bubble Card (Menu Panduan & Kontrol Musik Premium) */}
      {isOpen && (
        <div className="mb-2 w-72 sm:w-80 bg-white rounded-2xl shadow-[0_16px_50px_rgba(0,0,0,0.18)] border-2 border-b-4 border-slate-200 overflow-hidden animate-in fade-in slide-in-from-bottom-3 duration-200 text-slate-800">
          {/* Header Maskot */}
          <div className="bg-gradient-to-r from-[#FFC800] via-[#FFD633] to-[#FFC800] text-slate-900 p-2.5 px-3 relative border-b-2 border-[#E59B00]/40 flex items-center justify-between">
            <div className="flex items-center gap-2 min-w-0 pr-4">
              <div className="relative w-8 h-8 rounded-full overflow-hidden bg-white border border-[#E59B00]/50 p-0.5 shrink-0 shadow-2xs">
                <img
                  src={mascotSrc || DEFAULT_MASCOT_GLAWU}
                  alt={mascotName}
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-1">
                  <span className="text-[8px] font-black uppercase text-amber-950 bg-amber-200/90 px-1.5 py-0.2 rounded-full border border-amber-400/60 leading-none">
                    Sahabat Pemilih
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                </div>
                <h4 className="text-xs font-black text-slate-900 flex items-center gap-1 mt-0.5 truncate leading-tight">
                  <span>Halo, Aku {mascotName}!</span>
                  <Sparkles className="w-3 h-3 text-amber-700 shrink-0" />
                </h4>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-slate-700 hover:text-slate-950 p-1 rounded-lg hover:bg-black/10 transition cursor-pointer shrink-0"
              title="Tutup panduan"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body Content */}
          <div className="p-3 space-y-2.5 text-[11px]">
            {/* MINI MUSIC PLAYER SECTION */}
            <div className="p-2.5 bg-gradient-to-br from-amber-50 via-yellow-50/80 to-amber-100/60 rounded-xl border border-amber-300/80 shadow-2xs space-y-2">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <div
                    className={`relative w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border border-amber-400/80 shadow-2xs transition-transform ${
                      isPlaying ? 'bg-[#FFC800] text-amber-950 scale-105' : 'bg-white text-slate-500'
                    }`}
                  >
                    <Disc3
                      className={`w-4 h-4 ${
                        isPlaying ? 'animate-[spin_4s_linear_infinite] text-amber-950' : 'text-slate-400'
                      }`}
                    />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[8px] font-black uppercase text-amber-950 bg-amber-200/80 px-1.5 py-0.2 rounded leading-none">
                        Jingle Resmi
                      </span>
                      {isPlaying && (
                        <span className="text-[8px] font-bold text-emerald-700 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                          Memutar
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] font-black text-slate-900 truncate mt-0.5 leading-tight">
                      Pilkades Gunungjaya 2026
                    </p>
                  </div>
                </div>

                {/* Tombol Play/Pause Utama di Popover */}
                <button
                  type="button"
                  onClick={togglePlay}
                  className={`px-3 py-1.5 rounded-xl text-xs font-black inline-flex items-center gap-1.5 transition-all cursor-pointer shadow-xs active:translate-y-0.5 ${
                    isPlaying
                      ? 'bg-amber-500 hover:bg-amber-600 text-white border-b-2 border-amber-700 active:border-b-0'
                      : 'bg-[#58CC02] hover:bg-[#4eb302] text-white border-b-2 border-[#46A302] active:border-b-0'
                  }`}
                  title={isPlaying ? 'Jeda Jingle' : 'Putar Jingle'}
                >
                  {isPlaying ? (
                    <>
                      <Pause className="w-3.5 h-3.5 fill-white" />
                      <span>Jeda</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 fill-white ml-0.5" />
                      <span>Putar</span>
                    </>
                  )}
                </button>
              </div>

              {/* Soundwave Visualizer & Volume Bar */}
              <div className="flex items-center justify-between pt-1.5 border-t border-amber-200/70 text-[10px] text-amber-900">
                <div className="flex items-center gap-1.5">
                  <div className="flex items-end gap-0.5 h-3.5">
                    <span
                      className={`w-1 rounded-full transition-all ${
                        isPlaying ? 'bg-amber-600 animate-eq-1 h-full' : 'bg-slate-300 h-1'
                      }`}
                    />
                    <span
                      className={`w-1 rounded-full transition-all ${
                        isPlaying ? 'bg-amber-600 animate-eq-2 h-full' : 'bg-slate-300 h-2'
                      }`}
                    />
                    <span
                      className={`w-1 rounded-full transition-all ${
                        isPlaying ? 'bg-amber-600 animate-eq-3 h-full' : 'bg-slate-300 h-1.5'
                      }`}
                    />
                    <span
                      className={`w-1 rounded-full transition-all ${
                        isPlaying ? 'bg-amber-600 animate-eq-4 h-full' : 'bg-slate-300 h-2.5'
                      }`}
                    />
                  </div>
                  <span className="font-bold text-[9px] text-amber-950">
                    {isPlaying ? 'Musik Aktif' : 'Musik Dijeda'}
                  </span>
                </div>

                {/* Volume Slider & Mute Toggle */}
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={toggleMute}
                    className="p-1 text-amber-800 hover:text-amber-950 hover:bg-amber-200/60 rounded-md transition cursor-pointer"
                    title={isMuted ? 'Bunyikan' : 'Bisukan'}
                  >
                    {isMuted ? (
                      <VolumeX className="w-3.5 h-3.5 text-red-600" />
                    ) : (
                      <Volume2 className="w-3.5 h-3.5" />
                    )}
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={isMuted ? 0 : volume}
                    onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                    className="w-16 h-1 bg-amber-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
                    aria-label="Volume Musik"
                  />
                </div>
              </div>
            </div>

            {/* Quick Actions Panduan */}
            <div className="space-y-1.5">
              <button
                type="button"
                onClick={() => {
                  onScrollToSearch();
                  setIsOpen(false);
                }}
                className="w-full p-2 rounded-xl bg-[#E5F9D2]/70 hover:bg-[#E5F9D2] text-[#2E6B01] border border-b-2 border-[#58CC02]/50 hover:border-[#58CC02] active:border-b active:translate-y-0.5 flex items-center justify-between text-left transition font-black cursor-pointer group shadow-2xs"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-5 h-5 rounded-lg bg-[#58CC02] text-white flex items-center justify-center shrink-0 shadow-2xs">
                    <Search className="w-3 h-3" />
                  </div>
                  <span className="text-[11px] font-black text-[#2E6B01] truncate">Cek NIK di DPT</span>
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#46A302] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform shrink-0" />
              </button>

              <button
                type="button"
                onClick={() => {
                  onScrollToTps();
                  setIsOpen(false);
                }}
                className="w-full p-2 rounded-xl bg-[#DDF4FF]/70 hover:bg-[#DDF4FF] text-[#0369A1] border border-b-2 border-[#1CB0F6]/50 hover:border-[#1CB0F6] active:border-b active:translate-y-0.5 flex items-center justify-between text-left transition font-black cursor-pointer group shadow-2xs"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-5 h-5 rounded-lg bg-[#1CB0F6] text-white flex items-center justify-center shrink-0 shadow-2xs">
                    <MapPin className="w-3 h-3" />
                  </div>
                  <span className="text-[11px] font-black text-[#0369A1] truncate">Lokasi & Data TPS</span>
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#0284C7] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform shrink-0" />
              </button>

              <button
                type="button"
                onClick={() => {
                  onScrollToMascot();
                  setIsOpen(false);
                }}
                className="w-full p-2 rounded-xl bg-[#FFF5D1]/80 hover:bg-[#FFF5D1] text-[#9A3412] border border-b-2 border-[#FFC800]/60 hover:border-[#FFC800] active:border-b active:translate-y-0.5 flex items-center justify-between text-left transition font-black cursor-pointer group shadow-2xs"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-5 h-5 rounded-lg bg-[#FFC800] text-slate-900 flex items-center justify-center shrink-0 shadow-2xs">
                    <Sparkles className="w-3 h-3 text-amber-800" />
                  </div>
                  <span className="text-[11px] font-black text-[#9A3412] truncate">Kenal {mascotName}</span>
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#D97706] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform shrink-0" />
              </button>

              <button
                type="button"
                onClick={() => {
                  onScrollToContact();
                  setIsOpen(false);
                }}
                className="w-full p-2 rounded-xl bg-[#F3E8FF]/70 hover:bg-[#F3E8FF] text-[#6B21A8] border border-b-2 border-[#CE82FF]/60 hover:border-[#CE82FF] active:border-b active:translate-y-0.5 flex items-center justify-between text-left transition font-black cursor-pointer group shadow-2xs"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-5 h-5 rounded-lg bg-[#A855F7] text-white flex items-center justify-center shrink-0 shadow-2xs">
                    <Phone className="w-3 h-3" />
                  </div>
                  <span className="text-[11px] font-black text-[#6B21A8] truncate">Kontak Panitia P2KD</span>
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#7E22CE] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform shrink-0" />
              </button>
            </div>

            {/* Kotak Pengingat Jadwal Pemungutan Suara */}
            <div className="p-2 bg-slate-50 rounded-xl border border-slate-200 text-slate-700 space-y-0.5">
              <span className="flex items-center gap-1 font-black text-[#D97706] text-[9px] uppercase tracking-wider">
                <Calendar className="w-3 h-3 text-[#FFC800]" />
                Pemungutan Suara:
              </span>
              <p className="font-black text-slate-900 text-[10px] leading-tight">
                {config.tanggal_pemungutan}
              </p>
              <p className="text-[9px] text-slate-500 font-medium">
                Pukul {config.votingHours || '07.00 - 13.00 WIB'} di TPS masing-masing.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* FLOATING TRIGGER PILL WITH GLOWING AVATAR & DIRECT PLAY/PAUSE */}
      <div className="relative">
        {/* Balon Petunjuk Autoplay (Jika diblokir browser saat pertama masuk) */}
        {showAudioHint && !isOpen && (
          <div className="absolute -top-10 right-0 animate-in fade-in slide-in-from-bottom-2 duration-300 pointer-events-auto">
            <button
              type="button"
              onClick={togglePlay}
              className="bg-slate-900/90 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-lg border border-amber-400/50 flex items-center gap-1.5 cursor-pointer hover:bg-slate-900 transition whitespace-nowrap"
            >
              <Music className="w-3 h-3 text-amber-400 animate-bounce" />
              <span>Sentuh untuk Putar Jingle Pilkades</span>
            </button>
          </div>
        )}

        {/* The Main Floating Pill Container */}
        <div className="relative flex items-center bg-white/95 backdrop-blur-xs text-slate-900 p-1.5 pr-2.5 rounded-full shadow-[0_8px_30px_rgba(0,0,0,0.14)] border-2 border-b-3 border-amber-400 hover:border-amber-500 transition-all duration-200 gap-2">
          {/* AVATAR PROFILE BUTTON: BERPENDAR & KLIK TOGGLE PLAY/PAUSE */}
          <button
            type="button"
            onClick={togglePlay}
            className="group/avatar relative cursor-pointer focus:outline-none rounded-full p-0.5 shrink-0"
            title={isPlaying ? 'Klik Profil untuk Jeda Musik' : 'Klik Profil untuk Putar Musik'}
            aria-label={isPlaying ? 'Jeda Musik' : 'Putar Musik'}
          >
            {/* Efek Berpendar (Glowing Sound Waves) saat musik berputar */}
            {isPlaying && (
              <>
                <span className="absolute -inset-1.5 rounded-full bg-amber-400/40 animate-sound-ripple pointer-events-none" />
                <span className="absolute -inset-1 rounded-full bg-gradient-to-r from-amber-400 to-yellow-300 opacity-75 blur-xs animate-music-glow pointer-events-none" />
              </>
            )}

            {/* Lingkaran Avatar Maskot Si Glawu */}
            <div
              className={`relative w-8 h-8 rounded-full overflow-hidden bg-gradient-to-b from-amber-100 to-amber-200 transition-all duration-300 p-0.5 flex items-center justify-center ${
                isPlaying
                  ? 'border-2 border-amber-500 shadow-md ring-2 ring-amber-300/60 scale-105'
                  : 'border border-amber-300'
              }`}
            >
              <img
                src={mascotSrc || DEFAULT_MASCOT_GLAWU}
                alt={`Maskot ${mascotName}`}
                className={`w-full h-full object-contain transition-transform duration-300 ${
                  isPlaying ? 'group-hover/avatar:scale-95' : 'group-hover/avatar:scale-110'
                }`}
              />

              {/* Overlay Glassmorphism Saat Hover (Icon Play / Pause) */}
              <div className="absolute inset-0 bg-slate-900/45 rounded-full flex items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-opacity backdrop-blur-[0.5px]">
                {isPlaying ? (
                  <Pause className="w-3.5 h-3.5 text-white fill-white drop-shadow" />
                ) : (
                  <Play className="w-3.5 h-3.5 text-white fill-white ml-0.5 drop-shadow" />
                )}
              </div>
            </div>

            {/* Badge Status Musik di Sudut Avatar */}
            <div className="absolute -bottom-0.5 -right-0.5 flex items-center justify-center">
              {isPlaying ? (
                <div className="flex items-end gap-[1.5px] h-3.5 px-1 py-0.5 bg-gradient-to-r from-amber-500 to-[#58CC02] rounded-full border border-white shadow-xs">
                  <span className="w-[2px] bg-white rounded-full animate-eq-1 h-full" />
                  <span className="w-[2px] bg-white rounded-full animate-eq-2 h-full" />
                  <span className="w-[2px] bg-white rounded-full animate-eq-3 h-full" />
                </div>
              ) : (
                <div className="w-3.5 h-3.5 rounded-full bg-slate-600 text-white flex items-center justify-center border border-white shadow-xs">
                  <Play className="w-2 h-2 fill-white ml-0.5" />
                </div>
              )}
            </div>
          </button>

          {/* AREA TEKS PANDUAN PEMILIH (KLIK UNTUK BUKA POPOVER MENU) */}
          <button
            type="button"
            onClick={handleOpen}
            className="text-left focus:outline-none cursor-pointer flex-1 min-w-0 pr-1 group"
            aria-label={`Buka Panduan ${mascotName}`}
          >
            <div className="flex items-center gap-1">
              <span className="text-[11px] font-black text-slate-900 uppercase tracking-tight group-hover:text-amber-700 transition-colors">
                {mascotName}
              </span>
              {isPlaying ? (
                <span className="text-[8px] bg-emerald-100 text-emerald-800 border border-emerald-300 font-black px-1.5 py-0.2 rounded-full leading-none flex items-center gap-0.5 shadow-2xs">
                  <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                  Jingle ON
                </span>
              ) : (
                <span className="text-[8px] bg-[#FFC800]/30 text-[#B45309] border border-[#FFC800] font-black px-1 py-0.2 rounded-full leading-none">
                  Maskot
                </span>
              )}
            </div>
            <div className="flex items-center gap-1 mt-0.5">
              <span className="text-[9px] text-slate-500 block font-bold leading-none">
                {isPlaying ? 'Panduan Pemilih 🎵' : 'Panduan Pemilih'}
              </span>
            </div>
          </button>

          {/* TOMBOL CEPAT AUDIO TOGGLE DI SISI KANAN */}
          <button
            type="button"
            onClick={togglePlay}
            className={`w-6 h-6 rounded-full flex items-center justify-center border transition-all cursor-pointer shrink-0 ${
              isPlaying
                ? 'bg-amber-100 hover:bg-amber-200 text-amber-800 border-amber-300 shadow-2xs'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-600 border-slate-300'
            }`}
            title={isPlaying ? 'Jeda Jingle' : 'Putar Jingle'}
            aria-label={isPlaying ? 'Jeda Jingle' : 'Putar Jingle'}
          >
            {isPlaying ? (
              <Pause className="w-3 h-3 fill-amber-800" />
            ) : (
              <Play className="w-3 h-3 fill-slate-700 ml-0.5" />
            )}
          </button>

          {/* Icon Panah untuk Membuka Popover */}
          <button
            type="button"
            onClick={handleOpen}
            className="text-slate-400 hover:text-slate-700 cursor-pointer p-0.5 transition"
            title="Buka Menu Panduan"
            aria-label="Buka Menu Panduan"
          >
            <ChevronUp
              className={`w-3.5 h-3.5 transition-transform duration-200 ${
                isOpen ? 'rotate-180' : ''
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
};

