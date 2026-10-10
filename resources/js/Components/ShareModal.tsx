import React, { useState } from 'react';
import { X, Share2, Copy, Check, MessageCircle, Globe, Sparkles } from 'lucide-react';
import { PilkadesConfig, getPhaseInfo } from '../types/pilkades';
import { DEFAULT_MASCOT_GLAWU } from '../data/logoPresets';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  config?: PilkadesConfig;
  mascotSrc?: string;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  config,
  mascotSrc
}) => {
  const [copied, setCopied] = useState(false);
  const phase = getPhaseInfo(config?.dataPhase);

  if (!isOpen) return null;

  const currentUrl = typeof window !== 'undefined' ? window.location.origin : 'https://gunungjaya.desa.id';
  const shareText = `Halo Warga Desa ${config?.desa || 'Gunungjaya'}! Ayo periksa hak pilih Anda dalam Pilkades ${config?.desa || 'Gunungjaya'} 2026 secara mandiri melalui Cek ${phase.code} Online resmi: ${currentUrl}`;

  const handleCopy = () => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleShareWhatsApp = () => {
    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
    window.open(waUrl, '_blank');
  };

  const handleShareFacebook = () => {
    const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`;
    window.open(fbUrl, '_blank');
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div className="bg-white border-2 border-b-4 border-slate-200 rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-xl relative animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b-2 border-slate-100 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#DDF4FF] text-[#1CB0F6] border-2 border-[#1CB0F6]/30 flex items-center justify-center shadow-2xs">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-slate-900 leading-snug">
                Bagikan Layanan Cek DPS
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Ajak keluarga & tetangga periksa hak suara
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 transition cursor-pointer"
            aria-label="Tutup"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Mascot & Card Preview */}
        <div className="bg-[#F0FDF4] border-2 border-b-4 border-[#86EFAC] rounded-2xl p-4 mb-5 flex items-center gap-3.5">
          <img
            src={mascotSrc || DEFAULT_MASCOT_GLAWU}
            alt="Maskot GLAWU"
            className="w-16 h-16 object-contain shrink-0 duo-float"
          />
          <div className="text-xs space-y-1">
            <span className="px-2 py-0.5 rounded-lg bg-[#DCFCE7] text-[#15803D] font-black uppercase text-[10px] tracking-wider inline-flex items-center gap-1 border border-[#86EFAC]">
              <Sparkles className="w-3 h-3" />
              Pilkades {config?.desa || 'Gunungjaya'} 2026
            </span>
            <p className="font-extrabold text-slate-800 leading-tight">
              Pengecekan {phase.fullName} Online Resmi
            </p>
            <p className="text-slate-500 font-medium text-[11px]">
              Cukup masukkan 16 digit NIK KTP-el Anda.
            </p>
          </div>
        </div>

        {/* Action Buttons: WhatsApp & Copy */}
        <div className="space-y-3">
          <button
            type="button"
            onClick={handleShareWhatsApp}
            className="w-full py-3.5 px-4 rounded-2xl bg-[#25D366] hover:bg-[#20ba59] text-white font-black text-xs sm:text-sm uppercase tracking-wider border-b-4 border-[#1ea850] active:border-b-0 active:translate-y-1 transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Bagikan ke WhatsApp Warga</span>
          </button>

          <button
            type="button"
            onClick={handleShareFacebook}
            className="w-full py-3 px-4 rounded-2xl bg-[#1877F2] hover:bg-[#166fe5] text-white font-black text-xs uppercase tracking-wider border-b-4 border-[#125ec2] active:border-b-0 active:translate-y-1 transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer"
          >
            <Globe className="w-4 h-4" />
            <span>Bagikan ke Facebook</span>
          </button>
        </div>

        {/* Copy Link Input */}
        <div className="mt-4 pt-4 border-t-2 border-slate-100">
          <label className="block text-[11px] font-black uppercase tracking-wider text-slate-500 mb-1.5">
            Salin Tautan Situs
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={currentUrl}
              className="flex-1 px-3.5 py-2.5 bg-slate-50 border-2 border-slate-200 rounded-xl text-xs font-bold text-slate-700 select-all focus:outline-none"
            />
            <button
              type="button"
              onClick={handleCopy}
              className={`px-4 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer ${
                copied
                  ? 'bg-[#58CC02] text-white border-b-2 border-[#46A302]'
                  : 'bg-white hover:bg-slate-100 text-slate-700 border-2 border-b-4 border-slate-200'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Tersalin!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Salin</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
