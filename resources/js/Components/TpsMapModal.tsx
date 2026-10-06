import React from 'react';
import { X, MapPin, Navigation, Compass, ExternalLink, Clock, Accessibility, Car } from 'lucide-react';
import { VoterRecord } from '../data/dptDatabase';

interface TpsMapModalProps {
  voter: VoterRecord | null;
  onClose: () => void;
}

export const TpsMapModal: React.FC<TpsMapModalProps> = ({ voter, onClose }) => {
  if (!voter) return null;

  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${voter.tpsName}, ${voter.tpsAddress}, ${voter.kabupatenKota}`
  )}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-stone-200">
        {/* Modal Header */}
        <div className="p-6 border-b border-stone-200 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur z-10">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-red-900 block mb-0.5">
              Lokasi & Navigasi TPS
            </span>
            <h3 className="text-xl font-bold text-stone-900 font-serif">
              {voter.tpsName} ({voter.tpsNumber})
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-stone-500 hover:text-stone-900 hover:bg-stone-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          {/* Simulated Interactive Map SVG */}
          <div className="relative w-full h-64 bg-stone-100 rounded-xl overflow-hidden border border-stone-300">
            {/* SVG Map Canvas */}
            <svg className="w-full h-full" viewBox="0 0 600 300" preserveAspectRatio="xMidYMid slice">
              {/* Ground & Parks */}
              <rect width="600" height="300" fill="#f4f4f2" />
              <path d="M 40,40 L 180,30 L 160,110 L 30,100 Z" fill="#e2ecd8" />
              <path d="M 380,180 L 560,160 L 580,260 L 400,280 Z" fill="#e2ecd8" />

              {/* Road Grid */}
              <line x1="0" y1="140" x2="600" y2="140" stroke="#ffffff" strokeWidth="24" />
              <line x1="0" y1="140" x2="600" y2="140" stroke="#e0ded8" strokeWidth="20" />
              <line x1="0" y1="140" x2="600" y2="140" stroke="#fbbf24" strokeWidth="2" strokeDasharray="6,6" />

              <line x1="280" y1="0" x2="280" y2="300" stroke="#ffffff" strokeWidth="20" />
              <line x1="280" y1="0" x2="280" y2="300" stroke="#e0ded8" strokeWidth="16" />

              <line x1="120" y1="140" x2="120" y2="300" stroke="#ffffff" strokeWidth="16" />
              <line x1="120" y1="140" x2="120" y2="300" stroke="#e0ded8" strokeWidth="12" />

              <line x1="440" y1="0" x2="440" y2="140" stroke="#ffffff" strokeWidth="16" />
              <line x1="440" y1="0" x2="440" y2="140" stroke="#e0ded8" strokeWidth="12" />

              {/* Route Line from Residence to TPS */}
              <path
                d="M 120,240 L 120,140 L 280,140 L 280,90 L 330,90"
                fill="none"
                stroke="#991b1b"
                strokeWidth="4"
                strokeDasharray="6,4"
              />

              {/* User Home Pin */}
              <g transform="translate(120, 240)">
                <circle r="12" fill="#3b82f6" opacity="0.2" />
                <circle r="6" fill="#1d4ed8" />
                <text x="14" y="4" fontSize="11" fontWeight="bold" fill="#1e3a8a">
                  Domisili Pemilih (RT {voter.rt})
                </text>
              </g>

              {/* TPS Building Box */}
              <rect x="330" y="60" width="130" height="60" rx="8" fill="#ffffff" stroke="#991b1b" strokeWidth="2" />
              <text x="340" y="84" fontSize="11" fontWeight="bold" fill="#7f1d1d">
                {voter.tpsName.slice(0, 18)}...
              </text>
              <text x="340" y="102" fontSize="10" fill="#57534e">
                {voter.tpsNumber} • Bilik Suara
              </text>

              {/* TPS Pin */}
              <g transform="translate(330, 90)">
                <circle r="16" fill="#ef4444" opacity="0.25" className="animate-ping" />
                <circle r="9" fill="#991b1b" />
                <circle r="4" fill="#ffffff" />
              </g>
            </svg>

            {/* Floating Navigation Pill */}
            <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur px-3 py-1.5 rounded-lg border border-stone-200 shadow-sm flex items-center gap-3 text-xs font-medium text-stone-700">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-stone-500" />
                ~4 Menit Jalan Kaki (320m)
              </span>
              <span className="text-stone-300">|</span>
              <span className="flex items-center gap-1">
                <Car className="w-3.5 h-3.5 text-stone-500" />
                ~1 Menit Kendaraan
              </span>
            </div>
          </div>

          {/* Location Details */}
          <div className="space-y-3">
            <div className="p-4 bg-stone-50 rounded-xl border border-stone-200">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-500 block mb-1">
                Alamat Lengkap TPS
              </span>
              <p className="text-sm font-semibold text-stone-900">
                {voter.tpsAddress}
              </p>
              <p className="text-xs text-stone-600 mt-1">
                Kelurahan {voter.kelurahan}, Kecamatan {voter.kecamatan}, {voter.kabupatenKota}, {voter.provinsi} {voter.kodePos}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-stone-50 rounded-lg border border-stone-200">
                <span className="font-semibold text-stone-900 block mb-0.5">Jam Operasional TPS</span>
                <span className="text-stone-600">Pukul 07.00 - 13.00 waktu setempat</span>
              </div>
              <div className="p-3 bg-stone-50 rounded-lg border border-stone-200">
                <span className="font-semibold text-stone-900 block mb-0.5">Aksesibilitas</span>
                <span className="text-stone-600">Tersedia ramp kursi roda & pendampingan petugas</span>
              </div>
            </div>
          </div>

          {/* Direct CTA */}
          <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto flex-1 px-5 py-3 bg-red-900 hover:bg-red-800 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-sm transition-colors flex items-center justify-center gap-2"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Buka Petunjuk Arah di Google Maps</span>
            </a>

            <button
              onClick={onClose}
              className="w-full sm:w-auto px-5 py-3 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs sm:text-sm font-semibold rounded-xl border border-stone-300 transition-colors"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
