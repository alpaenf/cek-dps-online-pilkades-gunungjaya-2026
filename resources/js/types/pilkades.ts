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
  no_dpt?: number | string;
  dusun?: string;
  rt?: string;
  rw?: string;
  tps?: string;
  nama_tps?: string;
  alamat_tps?: string;
  status?: string;
  jenis_kelamin?: string;
  keterangan?: string;
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
  mascot_title?: string;
  mascot_badge?: string;
  mascot_tag?: string;
  mascot_desc?: string;
  mascot_slogan?: string;
  mascot_speeches?: string[];
  mascot_filosofi?: {
    num: number;
    title: string;
    desc: string;
  }[];
  mascot_ajakan?: {
    num: number;
    title: string;
    desc: string;
  }[];
  tata_nilai_netralitas?: string;
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
