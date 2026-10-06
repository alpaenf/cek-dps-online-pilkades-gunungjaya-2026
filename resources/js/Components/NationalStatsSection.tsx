import React, { useState } from 'react';
import { Users, Building2, Globe2, Search, ArrowUpDown } from 'lucide-react';
import { NATIONAL_STATS, PROVINCE_STATS } from '../data/dptDatabase';

export const NationalStatsSection: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'voters' | 'tps' | 'name'>('voters');

  const filteredProvinces = PROVINCE_STATS.filter((prov) =>
    prov.name.toLowerCase().includes(searchTerm.toLowerCase())
  ).sort((a, b) => {
    if (sortBy === 'voters') return b.voterCount - a.voterCount;
    if (sortBy === 'tps') return b.tpsCount - a.tpsCount;
    return a.name.localeCompare(b.name);
  });

  return (
    <section id="stats-section" className="py-16 bg-stone-50 border-t border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-10 text-center max-w-3xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-red-900 block mb-1">
            Data Agregat Terbuka
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-serif text-stone-900 mb-3">
            Rekapitulasi Daftar Pemilih Tetap (DPT) Nasional
          </h2>
          <p className="text-stone-600 text-sm sm:text-base">
            Data pemilih yang telah diverifikasi dan dimutakhirkan melalui Rapat Pleno Terbuka Rekapitulasi DPT Tingkat Nasional KPU RI.
          </p>
        </div>

        {/* National Metric Bento Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          <div className="p-6 bg-white rounded-2xl border border-stone-200 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">
                Total Pemilih Nasional
              </span>
              <Users className="w-5 h-5 text-red-900" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-stone-900 font-mono tabular-nums mb-1">
              {NATIONAL_STATS.totalVoters.toLocaleString('id-ID')}
            </div>
            <div className="text-xs text-stone-500 flex items-center gap-2">
              <span>Dalam Negeri: {NATIONAL_STATS.domesticVoters.toLocaleString('id-ID')}</span>
            </div>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-stone-200 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">
                Proporsi Gender Pemilih
              </span>
              <Users className="w-5 h-5 text-stone-700" />
            </div>
            <div className="text-lg font-bold text-stone-900 font-mono tabular-nums mb-1">
              L: {NATIONAL_STATS.maleVoters.toLocaleString('id-ID')} (49.9%)
            </div>
            <div className="text-sm font-semibold text-stone-700 font-mono tabular-nums">
              P: {NATIONAL_STATS.femaleVoters.toLocaleString('id-ID')} (50.1%)
            </div>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-stone-200 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">
                Total TPS Seluruh Indonesia
              </span>
              <Building2 className="w-5 h-5 text-red-900" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-stone-900 font-mono tabular-nums mb-1">
              {NATIONAL_STATS.totalTps.toLocaleString('id-ID')}
            </div>
            <div className="text-xs text-stone-500">
              Tersebar di 38 Provinsi & 514 Kab/Kota
            </div>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-stone-200 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">
                Pemilih Luar Negeri (PPLN)
              </span>
              <Globe2 className="w-5 h-5 text-amber-700" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-stone-900 font-mono tabular-nums mb-1">
              {NATIONAL_STATS.overseasVoters.toLocaleString('id-ID')}
            </div>
            <div className="text-xs text-stone-500">
              Di 128 Perwakilan KBRI / KJRI ({NATIONAL_STATS.overseasTps.toLocaleString('id-ID')} TPSLN)
            </div>
          </div>
        </div>

        {/* Regional Breakdown Table */}
        <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
          <div className="p-6 border-b border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-stone-900 font-serif">
                Sebaran Pemilih per Wilayah Provinsi & Luar Negeri
              </h3>
              <p className="text-xs text-stone-500">
                Menampilkan perbandingan jumlah pemilih terdaftar dan alokasi TPS
              </p>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Cari nama provinsi..."
                  className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-red-900"
                />
              </div>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-red-900"
              >
                <option value="voters">Urutkan: Pemilih Terbanyak</option>
                <option value="tps">Urutkan: TPS Terbanyak</option>
                <option value="name">Urutkan: Abjad Provinsi</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto max-h-96 overflow-y-auto">
            <table className="w-full text-left text-xs text-stone-800">
              <thead className="sticky top-0 bg-stone-100 text-stone-700 uppercase tracking-wider font-semibold border-b border-stone-200">
                <tr>
                  <th className="py-3 px-4">Wilayah / Provinsi</th>
                  <th className="py-3 px-4 text-right">Laki-Laki</th>
                  <th className="py-3 px-4 text-right">Perempuan</th>
                  <th className="py-3 px-4 text-right">Total DPT</th>
                  <th className="py-3 px-4 text-right">Jumlah TPS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 font-mono tabular-nums">
                {filteredProvinces.map((prov) => (
                  <tr key={prov.code} className="hover:bg-stone-50 transition-colors">
                    <td className="py-3 px-4 font-sans font-semibold text-stone-900 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-red-800 shrink-0" />
                      <span>{prov.name}</span>
                    </td>
                    <td className="py-3 px-4 text-right text-stone-600">
                      {prov.maleCount.toLocaleString('id-ID')}
                    </td>
                    <td className="py-3 px-4 text-right text-stone-600">
                      {prov.femaleCount.toLocaleString('id-ID')}
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-stone-900">
                      {prov.voterCount.toLocaleString('id-ID')}
                    </td>
                    <td className="py-3 px-4 text-right text-stone-700">
                      {prov.tpsCount.toLocaleString('id-ID')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-4 bg-stone-50 border-t border-stone-200 text-xs text-stone-500 text-center font-mono">
            Sumber Data: Surat Keputusan KPU RI tentang Penetapan Daftar Pemilih Tetap (DPT) Nasional
          </div>
        </div>
      </div>
    </section>
  );
};
