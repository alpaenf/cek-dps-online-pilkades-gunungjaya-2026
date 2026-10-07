export interface DptRecord {
  no: number;
  nik: string;
  no_kk: string;
  nama: string;
  tempat_lahir: string;
  tanggal_lahir: string;
  jenis_kelamin: 'L' | 'P';
  alamat: string;
  dusun: string;
  rt: string;
  rw: string;
  tps: string;
  status: string;
  keterangan: string;
}

export interface DptPublicResult {
  found: boolean;
  nama?: string;
  nik_masked?: string;
  dusun?: string;
  rt?: string;
  rw?: string;
  tps?: string;
  status?: string;
  message?: string;
}

export interface PilkadesConfig {
  nama_kegiatan: string;
  desa: string;
  kecamatan: string;
  kabupaten: string;
  tahun: string;
  tanggal_pemungutan: string;
  kontak_panitia: string;
  whatsapp_panitia: string;
  alamat_sekretariat: string;
  pengumuman: string;
  dataPhase?: string;
  votingHours?: string;
}

export interface TpsItem {
  tps: string;
  nama_lokasi: string;
  alamat: string;
  dusun: string;
  rt: string;
  rw: string;
  keterangan: string;
}

export interface DpsTpsStat {
  tps: string;
  lokasi: string;
  dusun: string;
  lakiLaki: number;
  perempuan: number;
  total: number;
}

export interface DpsRecapData {
  totalDps: number;
  totalLakiLaki: number;
  totalPerempuan: number;
  tpsStats: DpsTpsStat[];
  lastUpdated?: string;
}
