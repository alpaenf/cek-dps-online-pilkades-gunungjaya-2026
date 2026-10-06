import React, { useState } from 'react';
import { Search, ShieldCheck, CheckCircle2, RotateCcw, Sparkles, MapPin, Globe, CreditCard } from 'lucide-react';
import bannerImg from '../assets/images/kpu_banner_elections_1790172500765.jpg';
import crestImg from '../assets/images/kpu_official_crest_1790172519882.jpg';

interface SearchSectionProps {
  onSearch: (mode: 'nik' | 'passport' | 'name', query: string, extra?: { provinsi?: string; kabKota?: string }) => void;
  isLoading: boolean;
}

export const SearchSection: React.FC<SearchSectionProps> = ({ onSearch, isLoading }) => {
  const [activeTab, setActiveTab] = useState<'nik' | 'passport' | 'name'>('nik');
  const [queryInput, setQueryInput] = useState('');
  const [provinsiInput, setProvinsiInput] = useState('DKI Jakarta');
  const [kabKotaInput, setKabKotaInput] = useState('Kota Jakarta Pusat');
  const [securityChecked, setSecurityChecked] = useState(true);
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleQuickSelect = (mode: 'nik' | 'passport' | 'name', val: string, prov?: string, kab?: string) => {
    setActiveTab(mode);
    setQueryInput(val);
    setValidationError(null);
    if (prov) setProvinsiInput(prov);
    if (kab) setKabKotaInput(kab);
    onSearch(mode, val, { provinsi: prov, kabKota: kab });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    const trimmed = queryInput.trim();
    if (!trimmed) {
      setValidationError(
        activeTab === 'nik'
          ? 'Silakan masukkan 16 digit Nomor Induk Kependudukan (NIK).'
          : activeTab === 'passport'
          ? 'Silakan masukkan Nomor Paspor Anda.'
          : 'Silakan masukkan nama lengkap sesuai KTP-el.'
      );
      return;
    }

    if (activeTab === 'nik') {
      const cleanDigits = trimmed.replace(/\D/g, '');
      if (cleanDigits.length !== 16) {
        setValidationError(`NIK harus tepat 16 digit angka. Saat ini ${cleanDigits.length} digit.`);
        return;
      }
    }

    if (!securityChecked) {
      setValidationError('Silakan centang pernyataan verifikasi pemilih.');
      return;
    }

    onSearch(activeTab, trimmed, { provinsi: provinsiInput, kabKota: kabKotaInput });
  };

  return (
    <section id="search-section" className="relative pt-8 pb-16 overflow-hidden">
      {/* Background Civic Pattern */}
      <div className="absolute inset-0 bg-gradient-to-b from-red-950/5 via-stone-50 to-stone-100 pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Civic Identity Block */}
        <div className="flex flex-col md:flex-row items-center gap-6 mb-8 pb-8 border-b border-stone-200">
          <div className="w-20 h-20 sm:w-24 sm:h-24 shrink-0 rounded-2xl overflow-hidden border border-stone-200 shadow-sm bg-stone-100 flex items-center justify-center">
            <img
              src={crestImg}
              alt="Lambang Resmi Pemilu KPU RI"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.currentTarget as HTMLElement).style.display = 'none';
              }}
            />
          </div>

          <div className="text-center md:text-left">
            <div className="text-xs font-semibold uppercase tracking-wider text-red-900 mb-1">
              Komisi Pemilihan Umum Republik Indonesia
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-stone-900 font-serif mb-2">
              Pengecekan Data Pemilih Tetap (DPT) Online
            </h1>
            <p className="text-base sm:text-lg text-stone-600 max-w-3xl leading-relaxed">
              Pastikan nama dan hak suara Anda telah terdaftar secara sah dalam DPT Pemilihan Umum. Ketahui secara pasti lokasi Tempat Pemungutan Suara (TPS) Anda.
            </p>
          </div>
        </div>

        {/* Search Engine Card */}
        <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden mb-8">
          {/* Visual Header Banner */}
          <div className="relative h-28 sm:h-36 overflow-hidden bg-red-950">
            <img
              src={bannerImg}
              alt="Banner Pemilu Indonesia KPU"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover opacity-35"
              onError={(e) => {
                (e.currentTarget as HTMLElement).style.display = 'none';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-red-950/90 via-red-900/80 to-stone-900/80 flex items-center px-6 sm:px-8">
              <div>
                <p className="text-xs font-semibold tracking-wider uppercase text-amber-300 mb-1">
                  Layanan Publik Terbuka & Mandiri
                </p>
                <h2 className="text-xl sm:text-2xl font-bold text-white font-serif">
                  Cari Data Pemilih & Lokasi TPS Anda
                </h2>
              </div>
            </div>
          </div>

          {/* Search Tabs */}
          <div className="p-6 sm:p-8">
            <div className="flex flex-wrap items-center gap-2 p-1.5 bg-stone-100 rounded-xl mb-6 max-w-xl">
              <button
                type="button"
                onClick={() => {
                  setActiveTab('nik');
                  setValidationError(null);
                }}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold rounded-lg transition-colors whitespace-nowrap ${
                  activeTab === 'nik'
                    ? 'bg-white text-red-950 shadow-sm'
                    : 'text-stone-600 hover:text-stone-950'
                }`}
              >
                <CreditCard className="w-4 h-4 text-red-800" />
                NIK e-KTP (16 Digit)
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveTab('passport');
                  setValidationError(null);
                }}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold rounded-lg transition-colors whitespace-nowrap ${
                  activeTab === 'passport'
                    ? 'bg-white text-red-950 shadow-sm'
                    : 'text-stone-600 hover:text-stone-950'
                }`}
              >
                <Globe className="w-4 h-4 text-red-800" />
                Paspor Luar Negeri (PPLN)
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveTab('name');
                  setValidationError(null);
                }}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold rounded-lg transition-colors whitespace-nowrap ${
                  activeTab === 'name'
                    ? 'bg-white text-red-950 shadow-sm'
                    : 'text-stone-600 hover:text-stone-950'
                }`}
              >
                <MapPin className="w-4 h-4 text-red-800" />
                Nama & Wilayah
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {activeTab === 'nik' && (
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label htmlFor="nik-input" className="text-sm font-semibold text-stone-800">
                      Nomor Induk Kependudukan (NIK)
                    </label>
                    <span className="text-xs font-mono tabular-nums text-stone-500">
                      {queryInput.replace(/\D/g, '').length} / 16 Digit
                    </span>
                  </div>
                  <div className="relative">
                    <input
                      id="nik-input"
                      type="text"
                      maxLength={16}
                      value={queryInput}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '');
                        setQueryInput(val);
                        setValidationError(null);
                      }}
                      placeholder="Contoh: 3171021508920004 (16 digit angka)"
                      className="w-full px-4 py-3.5 text-base sm:text-lg font-mono tracking-wider bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-900 focus:border-red-900 text-stone-900 placeholder:text-stone-400 placeholder:font-sans"
                    />
                  </div>
                  <p className="text-xs text-stone-500 mt-1.5">
                    Nomor NIK tertera pada Kartu Tanda Penduduk Elektronik (KTP-el) atau Kartu Keluarga (KK).
                  </p>
                </div>
              )}

              {activeTab === 'passport' && (
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label htmlFor="passport-input" className="text-sm font-semibold text-stone-800">
                      Nomor Paspor / Dokumen Perjalanan RI
                    </label>
                  </div>
                  <input
                    id="passport-input"
                    type="text"
                    value={queryInput}
                    onChange={(e) => {
                      setQueryInput(e.target.value.toUpperCase());
                      setValidationError(null);
                    }}
                    placeholder="Contoh: A98765432 atau B12345678"
                    className="w-full px-4 py-3.5 text-base sm:text-lg font-mono tracking-wider bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-900 focus:border-red-900 text-stone-900 placeholder:text-stone-400 placeholder:font-sans"
                  />
                  <p className="text-xs text-stone-500 mt-1.5">
                    Khusus bagi Warga Negara Indonesia (WNI) yang berdomisili di luar negeri dan terdaftar pada Panitia Pemilihan Luar Negeri (PPLN).
                  </p>
                </div>
              )}

              {activeTab === 'name' && (
                <div className="space-y-3">
                  <div>
                    <label htmlFor="name-input" className="block text-sm font-semibold text-stone-800 mb-1.5">
                      Nama Lengkap Sesuai KTP-el
                    </label>
                    <input
                      id="name-input"
                      type="text"
                      value={queryInput}
                      onChange={(e) => {
                        setQueryInput(e.target.value);
                        setValidationError(null);
                      }}
                      placeholder="Masukkan nama lengkap (minimal 3 huruf)"
                      className="w-full px-4 py-3 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-900 focus:border-red-900 text-stone-900"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        Provinsi Domisili
                      </label>
                      <select
                        value={provinsiInput}
                        onChange={(e) => setProvinsiInput(e.target.value)}
                        className="w-full px-3 py-2.5 bg-stone-50 border border-stone-300 rounded-lg text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-red-900"
                      >
                        <option value="DKI Jakarta">DKI Jakarta</option>
                        <option value="Jawa Barat">Jawa Barat</option>
                        <option value="Jawa Tengah">Jawa Tengah</option>
                        <option value="Jawa Timur">Jawa Timur</option>
                        <option value="Banten">Banten</option>
                        <option value="Bali">Bali</option>
                        <option value="Sumatera Utara">Sumatera Utara</option>
                        <option value="Sulawesi Selatan">Sulawesi Selatan</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        Kabupaten / Kota
                      </label>
                      <input
                        type="text"
                        value={kabKotaInput}
                        onChange={(e) => setKabKotaInput(e.target.value)}
                        placeholder="Contoh: Kota Jakarta Pusat"
                        className="w-full px-3 py-2.5 bg-stone-50 border border-stone-300 rounded-lg text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-red-900"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Security Check Verification */}
              <div className="pt-2">
                <label className="flex items-start gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={securityChecked}
                    onChange={(e) => setSecurityChecked(e.target.checked)}
                    className="mt-1 w-4 h-4 rounded text-red-900 border-stone-300 focus:ring-red-900"
                  />
                  <span className="text-xs text-stone-600 leading-normal">
                    Saya menyatakan pencarian data pemilih ini dilakukan untuk keperluan verifikasi hak pilih pemilu yang sah, sesuai dengan Undang-Undang Perlindungan Data Pribadi dan Peraturan KPU.
                  </span>
                </label>
              </div>

              {/* Validation error */}
              {validationError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs font-medium text-red-800 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-700 shrink-0" />
                  {validationError}
                </div>
              )}

              {/* Submit CTA */}
              <div className="pt-3 flex flex-col sm:flex-row items-center gap-3">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full sm:w-auto min-w-[220px] px-6 py-3.5 bg-red-900 hover:bg-red-800 disabled:bg-stone-400 text-white font-semibold rounded-xl shadow-sm transition-all flex items-center justify-center gap-2.5"
                >
                  {isLoading ? (
                    <>
                      <RotateCcw className="w-4 h-4 animate-spin" />
                      <span>Memeriksa Data DPT...</span>
                    </>
                  ) : (
                    <>
                      <Search className="w-4 h-4" />
                      <span>Cari Data Pemilih</span>
                    </>
                  )}
                </button>

                <div className="text-xs text-stone-500 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>Koneksi aman terenkripsi ke database KPU RI</span>
                </div>
              </div>
            </form>

            {/* Quick Demo Pre-set triggers */}
            <div className="mt-8 pt-6 border-t border-stone-200">
              <div className="flex items-center gap-2 text-xs font-semibold text-stone-700 mb-3">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>Coba Contoh Data Cepat (Simulasi Interaktif):</span>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickSelect('nik', '3171021508920004')}
                  className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-medium rounded-lg border border-stone-200 transition-colors"
                >
                  DKI Jakarta (Menteng)
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickSelect('nik', '3578074211890001')}
                  className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-medium rounded-lg border border-stone-200 transition-colors"
                >
                  Surabaya (Disabilitas TPS)
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickSelect('nik', '3273052804950007')}
                  className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-medium rounded-lg border border-stone-200 transition-colors"
                >
                  Bandung (Coblong)
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickSelect('passport', 'A98765432')}
                  className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-medium rounded-lg border border-stone-200 transition-colors"
                >
                  Paspor Tokyo (PPLN Luar Negeri)
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickSelect('nik', '3171000000000000')}
                  className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-900 text-xs font-medium rounded-lg border border-red-200 transition-colors"
                >
                  Simulasi Belum Terdaftar
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Informational strip */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-stone-600">
          <div className="p-4 bg-white rounded-xl border border-stone-200 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-red-800 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-stone-900 block mb-0.5">Satu Pemilih Satu Suara</span>
              Data pemilih disaring ketat melalui sistem de-duplikasi nasional untuk mencegah hak pilih ganda.
            </div>
          </div>
          <div className="p-4 bg-white rounded-xl border border-stone-200 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-red-800 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-stone-900 block mb-0.5">Akurasi Titik Lokasi TPS</span>
              Menampilkan alamat detail, RT/RW, dan navigasi rute ke TPS agar Anda tidak salah mendatangi lokasi.
            </div>
          </div>
          <div className="p-4 bg-white rounded-xl border border-stone-200 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-red-800 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-stone-900 block mb-0.5">Kanal Lapor Resmi</span>
              Bagi masyarakat yang memenuhi syarat namun belum terdaftar, formulir tanggapan tersedia secara daring.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
