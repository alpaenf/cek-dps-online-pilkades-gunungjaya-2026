import { DpsRecapData, DptRecord, TpsItem } from '../types/pilkades';
import { DEFAULT_TPS_LIST } from './mockDatabase';

/**
 * Data Rekapitulasi Resmi DPS (Daftar Pemilih Sementara) Desa Gunungjaya 2026
 * Jumlah DPS resmi: 7.794 Jiwa / Pemilih
 * Terbagi dalam 5 TPS di 5 Dusun
 */
export const DEFAULT_DPS_RECAP: DpsRecapData = {
  totalDps: 7794,
  totalLakiLaki: 3908,
  totalPerempuan: 3886,
  lastUpdated: 'Oktober 2026',
  tpsStats: [
    {
      tps: 'TPS 1',
      lokasi: 'Pendopo Balai Desa Gunungjaya',
      dusun: 'Dusun Krajan',
      lakiLaki: 785,
      perempuan: 778,
      total: 1563
    },
    {
      tps: 'TPS 2',
      lokasi: 'Gedung SDN 01 Gunungjaya',
      dusun: 'Dusun Gombong',
      lakiLaki: 792,
      perempuan: 786,
      total: 1578
    },
    {
      tps: 'TPS 3',
      lokasi: 'Gedung MDA Nurul Huda',
      dusun: 'Dusun Soka',
      lakiLaki: 776,
      perempuan: 769,
      total: 1545
    },
    {
      tps: 'TPS 4',
      lokasi: 'Balai Pertemuan Warga Dusun Karanganyar',
      dusun: 'Dusun Karanganyar',
      lakiLaki: 780,
      perempuan: 774,
      total: 1554
    },
    {
      tps: 'TPS 5',
      lokasi: 'Halaman Gedung Posyandu Watukumpul',
      dusun: 'Dusun Watukumpul',
      lakiLaki: 775,
      perempuan: 779,
      total: 1554
    }
  ]
};

/**
 * Sinkronisasi Nama Lokasi & Dusun TPS di Rekapitulasi langsung dari Data Lokasi TPS
 */
export function applyTpsLocationsToRecap(recap: DpsRecapData, tpsList?: TpsItem[]): DpsRecapData {
  const sourceList = (tpsList && tpsList.length > 0) ? tpsList : DEFAULT_TPS_LIST;

  const updatedStats = recap.tpsStats.map(stat => {
    const statTpsNum = stat.tps.replace(/\D/g, '');
    const matched = sourceList.find(t => {
      const tNum = t.tps.replace(/\D/g, '');
      return tNum === statTpsNum || t.tps.trim().toLowerCase() === stat.tps.trim().toLowerCase();
    });

    if (matched) {
      return {
        ...stat,
        lokasi: matched.nama_lokasi || stat.lokasi,
        dusun: matched.dusun || stat.dusun
      };
    }
    return stat;
  });

  return {
    ...recap,
    tpsStats: updatedStats
  };
}

/**
 * Menghitung rekapitulasi data pemilih dari baris record database
 * Jika jumlah data sedikit (< 50, mode demo), gunakan rekapitulasi resmi 7.794 DPS
 * dengan nama TPS diambil langsung dari data lokasi TPS.
 */
export function calculateDpsRecap(records: DptRecord[], tpsList?: TpsItem[]): DpsRecapData {
  const sourceList = (tpsList && tpsList.length > 0) ? tpsList : DEFAULT_TPS_LIST;

  if (!records || records.length < 50) {
    return applyTpsLocationsToRecap(DEFAULT_DPS_RECAP, sourceList);
  }

  let totalL = 0;
  let totalP = 0;
  const tpsMap = new Map<string, { L: number; P: number; lokasi: string; dusun: string }>();

  // Inisialisasi TPS 1 - 5 agar urut, nama diambil dari data lokasi TPS
  for (let i = 1; i <= 5; i++) {
    const tpsKey = `TPS ${i}`;
    const tpsFromList = sourceList.find(t => t.tps.replace(/\D/g, '') === String(i));
    const defaultStat = DEFAULT_DPS_RECAP.tpsStats[i - 1];

    tpsMap.set(tpsKey, {
      L: 0,
      P: 0,
      lokasi: tpsFromList?.nama_lokasi || defaultStat?.lokasi || `Lokasi TPS ${i}`,
      dusun: tpsFromList?.dusun || defaultStat?.dusun || `Dusun ${i}`
    });
  }

  for (const item of records) {
    const isL = (item.jenis_kelamin || '').toUpperCase() === 'L';
    if (isL) totalL++;
    else totalP++;

    const rawTps = String(item.tps || '').trim();
    const tpsDigits = rawTps.replace(/\D/g, '') || '1';
    const cleanTpsKey = `TPS ${tpsDigits}`;

    const matchingTps = sourceList.find(t => t.tps.replace(/\D/g, '') === tpsDigits);

    const entry = tpsMap.get(cleanTpsKey) || {
      L: 0,
      P: 0,
      lokasi: matchingTps?.nama_lokasi || item.alamat || `Lokasi ${cleanTpsKey}`,
      dusun: matchingTps?.dusun || item.dusun || `Dusun ${cleanTpsKey}`
    };

    if (isL) entry.L++;
    else entry.P++;

    if (matchingTps?.nama_lokasi) entry.lokasi = matchingTps.nama_lokasi;
    if (matchingTps?.dusun) entry.dusun = matchingTps.dusun;

    tpsMap.set(cleanTpsKey, entry);
  }

  const tpsStats = Array.from(tpsMap.entries()).map(([tps, data]) => ({
    tps,
    lokasi: data.lokasi,
    dusun: data.dusun,
    lakiLaki: data.L,
    perempuan: data.P,
    total: data.L + data.P
  }));

  return {
    totalDps: totalL + totalP,
    totalLakiLaki: totalL,
    totalPerempuan: totalP,
    tpsStats,
    lastUpdated: 'Oktober 2026'
  };
}
