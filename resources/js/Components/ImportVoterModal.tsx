import React, { useState, useRef } from 'react';
import { router } from '@inertiajs/react';
import {
  FileSpreadsheet,
  Upload,
  Download,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  X,
  RefreshCw,
  Eye,
  Check,
  FileText,
  Trash2,
  Database,
  ArrowRight,
  Info,
  Zap,
  FolderUp
} from 'lucide-react';
import * as XLSX from 'xlsx';

interface TpsOption {
  id: number;
  nomor_tps: string;
  nama_lokasi: string;
  dusun: string;
}

interface ImportVoterModalProps {
  isOpen: boolean;
  onClose: () => void;
  allTpsOptions: TpsOption[];
}

interface ParsedVoterRow {
  no_dpt?: string | number;
  no?: string | number;
  nik: string;
  nama: string;
  jenis_kelamin: string;
  tempat_lahir?: string;
  tanggal_lahir?: string;
  dusun?: string;
  rt?: string;
  rw?: string;
  tps?: string;
  status?: string;
  ket?: string;
  keterangan?: string;
  _isValidNik: boolean;
}

export const ImportVoterModal: React.FC<ImportVoterModalProps> = ({
  isOpen,
  onClose,
  allTpsOptions,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isParsing, setIsParsing] = useState(false);
  const [parsedRows, setParsedRows] = useState<ParsedVoterRow[]>([]);
  const [headerColumns, setHeaderColumns] = useState<string[]>([]);
  const [parseError, setParseError] = useState<string | null>(null);

  // Settings
  const [updateExisting, setUpdateExisting] = useState(true);
  const [resetFirst, setResetFirst] = useState(false);
  const [showPreview, setShowPreview] = useState(true);

  // Upload & Progress State
  const [isImporting, setIsImporting] = useState(false);
  const [importProgress, setImportProgress] = useState(0);
  const [currentChunkInfo, setCurrentChunkInfo] = useState('');
  const [importResult, setImportResult] = useState<{
    inserted: number;
    updated: number;
    skipped: number;
    total: number;
  } | null>(null);

  // Direct File Upload State
  const [activeTab, setActiveTab] = useState<'chunk' | 'direct'>('chunk');
  const [isDirectUploading, setIsDirectUploading] = useState(false);
  const [directUploadError, setDirectUploadError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleResetState = () => {
    setSelectedFile(null);
    setParsedRows([]);
    setHeaderColumns([]);
    setParseError(null);
    setIsImporting(false);
    setImportProgress(0);
    setCurrentChunkInfo('');
    setImportResult(null);
    setIsDirectUploading(false);
    setDirectUploadError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClose = () => {
    if (isImporting || isDirectUploading) {
      if (!confirm('Proses import sedang berlangsung. Yakin ingin menutup jendela?')) {
        return;
      }
    }
    handleResetState();
    onClose();
  };

  /**
   * Parse file Excel / CSV menggunakan SheetJS
   */
  const handleFileChange = (file: File) => {
    if (!file) return;

    setSelectedFile(file);
    setIsParsing(true);
    setParseError(null);
    setImportResult(null);
    setParsedRows([]);
    setHeaderColumns([]);

    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const buffer = e.target?.result as ArrayBuffer;
        const workbook = XLSX.read(buffer, {
          type: 'array',
          cellDates: true,
          cellNF: false,
          cellText: true,
        });

        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];

        // Konversi ke array 2D dengan raw string agar NIK tidak terpotong atau eksponensial
        const rawData: any[][] = XLSX.utils.sheet_to_json(worksheet, {
          header: 1,
          defval: '',
          raw: false,
        });

        if (!rawData || rawData.length === 0) {
          throw new Error('File Excel kosong atau tidak memiliki data.');
        }

        // Cari baris header (biasanya baris ke-4 atau ke-5 sesuai foto)
        let headerRowIdx = -1;
        let subHeaderRowIdx = -1;

        for (let i = 0; i < Math.min(rawData.length, 15); i++) {
          const rowStr = rawData[i].map((c) => String(c).trim().toUpperCase()).join(' ');
          if (
            (rowStr.includes('NIK') && rowStr.includes('NAMA')) ||
            (rowStr.includes('PEMILIH') && rowStr.includes('KELAMIN')) ||
            (rowStr.includes('NO DPT') && rowStr.includes('NIK'))
          ) {
            headerRowIdx = i;
            // Cek apakah baris berikutnya adalah subheader (TEMPAT, TANGGAL, DUSUN, RT, RW)
            if (i + 1 < rawData.length) {
              const nextRowStr = rawData[i + 1].map((c) => String(c).trim().toUpperCase()).join(' ');
              if (
                nextRowStr.includes('TEMPAT') ||
                nextRowStr.includes('TANGGAL') ||
                nextRowStr.includes('DUSUN') ||
                nextRowStr.includes('RT')
              ) {
                subHeaderRowIdx = i + 1;
              }
            }
            break;
          }
        }

        if (headerRowIdx === -1) {
          throw new Error(
            'Kolom header tidak ditemukan! Pastikan file memiliki baris judul kolom yang memuat minimal "NIK" dan "NAMA PEMILIH".'
          );
        }

        // Gabungkan header utama & subheader
        const headerRow = rawData[headerRowIdx];
        const subHeaderRow = subHeaderRowIdx !== -1 ? rawData[subHeaderRowIdx] : [];
        const detectedHeaders: string[] = [];
        const colKeyMap: { [colIndex: number]: string } = {};

        const maxCols = Math.max(headerRow.length, subHeaderRow.length);

        for (let c = 0; c < maxCols; c++) {
          const mainHead = String(headerRow[c] || '').trim().toUpperCase();
          const subHead = String(subHeaderRow[c] || '').trim().toUpperCase();

          let combinedName = mainHead;
          if (subHead && subHead !== mainHead) {
            combinedName = mainHead ? `${mainHead} ${subHead}` : subHead;
          }

          detectedHeaders.push(combinedName || `KOLOM ${c + 1}`);

          // Petakan ke atribut sistem
          const normalizedStr = combinedName.toLowerCase().replace(/[^a-z0-9]/g, '');

          if (normalizedStr.includes('nik')) {
            colKeyMap[c] = 'nik';
          } else if (
            normalizedStr.includes('namapemilih') ||
            normalizedStr === 'nama' ||
            normalizedStr.includes('namalengkap')
          ) {
            colKeyMap[c] = 'nama';
          } else if (
            normalizedStr.includes('jeniskelamin') ||
            normalizedStr === 'jk' ||
            normalizedStr.includes('kelamin')
          ) {
            colKeyMap[c] = 'jenis_kelamin';
          } else if (normalizedStr.includes('tempat') || normalizedStr.includes('tmplahir')) {
            colKeyMap[c] = 'tempat_lahir';
          } else if (
            normalizedStr.includes('tanggal') ||
            normalizedStr.includes('tgllahir') ||
            normalizedStr.includes('tgllhr')
          ) {
            colKeyMap[c] = 'tanggal_lahir';
          } else if (normalizedStr.includes('dusun') || normalizedStr.includes('dukuh')) {
            colKeyMap[c] = 'dusun';
          } else if (normalizedStr === 'rt' || normalizedStr.endsWith('rt')) {
            colKeyMap[c] = 'rt';
          } else if (normalizedStr === 'rw' || normalizedStr.endsWith('rw')) {
            colKeyMap[c] = 'rw';
          } else if (normalizedStr.includes('tps') || normalizedStr.includes('nomortps')) {
            colKeyMap[c] = 'tps';
          } else if (normalizedStr === 'status' || normalizedStr.includes('statuspemilih')) {
            colKeyMap[c] = 'status';
          } else if (
            normalizedStr === 'keterangan' ||
            normalizedStr.includes('keterangan')
          ) {
            colKeyMap[c] = 'keterangan';
          } else if (normalizedStr === 'ket') {
            colKeyMap[c] = 'ket';
          } else if (
            normalizedStr === 'nodpt' ||
            normalizedStr.includes('nodpt') ||
            normalizedStr === 'dpt'
          ) {
            colKeyMap[c] = 'no_dpt';
          } else if (normalizedStr === 'no' || normalizedStr === 'nourut') {
            colKeyMap[c] = 'no';
          }
        }

        setHeaderColumns(detectedHeaders);

        // Ambil baris data
        const dataStartIndex = (subHeaderRowIdx !== -1 ? subHeaderRowIdx : headerRowIdx) + 1;
        const validRows: ParsedVoterRow[] = [];

        for (let r = dataStartIndex; r < rawData.length; r++) {
          const row = rawData[r];
          if (!row || row.length === 0) continue;

          // Cek apakah baris kosong
          const hasContent = row.some((val: any) => String(val).trim() !== '');
          if (!hasContent) continue;

          const item: any = {};
          for (let c = 0; c < row.length; c++) {
            const key = colKeyMap[c];
            if (key) {
              item[key] = String(row[c] || '').trim();
            }
          }

          // Bersihkan NIK
          const rawNik = String(item.nik || '').replace(/\D/g, '');
          const nama = String(item.nama || '').trim();

          // Abaikan baris jika nama kosong atau berisi kata 'TOTAL' / 'JUMLAH'
          if (!nama || nama.toUpperCase().includes('TOTAL') || nama.toUpperCase().includes('JUMLAH')) {
            continue;
          }

          validRows.push({
            no_dpt: item.no_dpt || '',
            no: item.no || '',
            nik: rawNik,
            nama: nama,
            jenis_kelamin: item.jenis_kelamin || 'L',
            tempat_lahir: item.tempat_lahir || '',
            tanggal_lahir: item.tanggal_lahir || '',
            dusun: item.dusun || '',
            rt: item.rt || '',
            rw: item.rw || '',
            tps: item.tps || '',
            status: item.status || 'AKTIF',
            ket: item.ket || '',
            keterangan: item.keterangan || '',
            _isValidNik: rawNik.length === 16,
          });
        }

        if (validRows.length === 0) {
          throw new Error('Tidak ada baris data pemilih yang valid ditemukan dalam lembar kerja.');
        }

        setParsedRows(validRows);
        setIsParsing(false);
      } catch (err: any) {
        setIsParsing(false);
        setParseError(err.message || 'Terjadi kesalahan saat memproses file Excel.');
      }
    };

    reader.onerror = () => {
      setIsParsing(false);
      setParseError('Gagal membaca berkas. Pastikan berkas tidak rusak atau terproteksi sandi.');
    };

    reader.readAsArrayBuffer(file);
  };

  /**
   * Eksekusi Chunked Import ke Backend Laravel
   */
  const handleStartChunkImport = async () => {
    if (parsedRows.length === 0) return;

    setIsImporting(true);
    setImportProgress(0);
    setCurrentChunkInfo('Mempersiapkan data import...');
    setImportResult(null);

    const CHUNK_SIZE = 150; // 150 pemilih per request untuk performa aman & tanpa timeout
    const totalRecords = parsedRows.length;
    const totalChunks = Math.ceil(totalRecords / CHUNK_SIZE);

    let totalInserted = 0;
    let totalUpdated = 0;
    let totalSkipped = 0;

    // Ambil CSRF token
    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';

    try {
      for (let i = 0; i < totalChunks; i++) {
        const start = i * CHUNK_SIZE;
        const end = Math.min(start + CHUNK_SIZE, totalRecords);
        const chunk = parsedRows.slice(start, end);

        setCurrentChunkInfo(
          `Mengunggah paket ${i + 1} dari ${totalChunks} (Pemilih baris ${start + 1} - ${end})...`
        );

        // Hanya chunk pertama yang mengeksekusi reset_first jika opsi reset aktif
        const isResetThisChunk = i === 0 && resetFirst;

        const response = await fetch('/admin/voters/import-chunk', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'X-CSRF-TOKEN': csrfToken,
            'X-Requested-With': 'XMLHttpRequest',
          },
          body: JSON.stringify({
            voters: chunk,
            update_existing: updateExisting,
            reset_first: isResetThisChunk,
          }),
        });

        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          throw new Error(errData.message || `Gagal mengimpor batch ke-${i + 1} (Kode ${response.status})`);
        }

        const resData = await response.json();
        totalInserted += resData.inserted || 0;
        totalUpdated += resData.updated || 0;
        totalSkipped += resData.skipped || 0;

        const progressPercent = Math.round(((i + 1) / totalChunks) * 100);
        setImportProgress(progressPercent);
      }

      setImportResult({
        inserted: totalInserted,
        updated: totalUpdated,
        skipped: totalSkipped,
        total: totalRecords,
      });
      setIsImporting(false);
      setCurrentChunkInfo('Import selesai dengan sukses!');
    } catch (error: any) {
      setIsImporting(false);
      setParseError(`Proses import terhenti: ${error.message}`);
    }
  };

  /**
   * Eksekusi Direct File Upload ke Server via Inertia Form
   */
  const handleDirectFileUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      setDirectUploadError('Silakan pilih berkas Excel terlebih dahulu.');
      return;
    }

    setIsDirectUploading(true);
    setDirectUploadError(null);

    const formData = new FormData();
    formData.append('excel_file', selectedFile);
    formData.append('update_existing', updateExisting ? '1' : '0');
    formData.append('reset_first', resetFirst ? '1' : '0');

    router.post('/admin/voters/import-file', formData, {
      forceFormData: true,
      onSuccess: () => {
        setIsDirectUploading(false);
        handleClose();
      },
      onError: (errors) => {
        setIsDirectUploading(false);
        setDirectUploadError(
          errors.excel_file || errors.message || 'Gagal memproses file pada server.'
        );
      },
    });
  };

  /**
   * Selesai & Refresh Data Dashboard
   */
  const handleFinishAndReload = () => {
    handleResetState();
    onClose();
    router.reload();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white border-2 border-b-4 border-slate-200 rounded-3xl max-w-4xl w-full p-5 sm:p-8 space-y-6 shadow-2xl my-auto max-h-[92vh] flex flex-col">
        
        {/* Header Modal */}
        <div className="flex items-start justify-between gap-4 pb-4 border-b-2 border-slate-100 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#58CC02]/15 border-2 border-[#58CC02]/30 flex items-center justify-center text-[#58CC02] shrink-0 shadow-inner">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight">
                Import DPS Langsung dari Excel
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 font-bold mt-0.5">
                Mendukung otomatis format panitia Pilkades Desa Gunungjaya 2026.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="p-2 rounded-2xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer shrink-0"
            title="Tutup Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Area (Scrollable) */}
        <div className="space-y-6 overflow-y-auto flex-1 pr-1">
          
          {/* Hasil Sukses */}
          {importResult ? (
            <div className="bg-[#58CC02]/10 border-2 border-[#58CC02] rounded-3xl p-6 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#58CC02] text-white flex items-center justify-center mx-auto shadow-md animate-bounce">
                <Check className="w-9 h-9 stroke-[3]" />
              </div>
              <div>
                <h4 className="text-xl font-black text-slate-900">
                  Data DPS Berhasil Diimpor!
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 font-bold mt-1">
                  Seluruh data pemilih telah disimpan dan terdistribusi ke TPS terkait.
                </p>
              </div>

              {/* Rincian Angka */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-xl mx-auto pt-2">
                <div className="bg-white p-3 rounded-2xl border-2 border-slate-200">
                  <span className="text-[10px] font-black uppercase text-slate-400 block">Total Diproses</span>
                  <span className="text-lg font-black text-slate-800">{importResult.total.toLocaleString('id-ID')}</span>
                </div>
                <div className="bg-white p-3 rounded-2xl border-2 border-[#58CC02]/40">
                  <span className="text-[10px] font-black uppercase text-[#58CC02] block">Pemilih Baru</span>
                  <span className="text-lg font-black text-[#58CC02]">+{importResult.inserted.toLocaleString('id-ID')}</span>
                </div>
                <div className="bg-white p-3 rounded-2xl border-2 border-[#1CB0F6]/40">
                  <span className="text-[10px] font-black uppercase text-[#1CB0F6] block">Diperbarui</span>
                  <span className="text-lg font-black text-[#1CB0F6]">{importResult.updated.toLocaleString('id-ID')}</span>
                </div>
                <div className="bg-white p-3 rounded-2xl border-2 border-slate-200">
                  <span className="text-[10px] font-black uppercase text-slate-500 block">Dilewati</span>
                  <span className="text-lg font-black text-slate-600">{importResult.skipped.toLocaleString('id-ID')}</span>
                </div>
              </div>

              <div className="pt-3">
                <button
                  type="button"
                  onClick={handleFinishAndReload}
                  className="px-6 py-3 rounded-2xl bg-[#58CC02] hover:bg-[#4ebb02] text-white font-black text-xs uppercase tracking-wider border-b-4 border-[#46A302] active:border-b-0 active:translate-y-1 transition-all shadow-md cursor-pointer inline-flex items-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Selesai & Muat Ulang Dashboard</span>
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Info banner & Download Template */}
              <div className="bg-slate-50 border-2 border-slate-200 rounded-3xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-[#1CB0F6] shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-xs font-black text-slate-800">
                      Sesuai Struktur Kolom Foto Panitia:
                    </p>
                    <p className="text-[11px] text-slate-600 font-bold leading-relaxed">
                      NO DPT • NO • NIK (16 Digit) • NAMA PEMILIH • JENIS KELAMIN • LAHIR (TEMPAT, TANGGAL) • ALAMAT (DUSUN, RT, RW) • TPS • STATUS • KETERANGAN
                    </p>
                  </div>
                </div>

                <a
                  href="/admin/voters/template-excel"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 rounded-2xl bg-white hover:bg-slate-100 text-[#1CB0F6] font-black text-xs uppercase tracking-wider border-2 border-[#1CB0F6]/30 hover:border-[#1CB0F6] active:translate-y-0.5 transition-all flex items-center justify-center gap-2 shrink-0 shadow-xs"
                >
                  <Download className="w-4 h-4" />
                  <span>Unduh Contoh Format Excel</span>
                </a>
              </div>

              {/* Tab Pemilihan Mode */}
              <div className="flex border-b-2 border-slate-200 gap-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('chunk')}
                  className={`pb-2.5 px-4 text-xs font-black uppercase tracking-wider transition-all border-b-4 -mb-[2px] cursor-pointer flex items-center gap-1.5 ${
                    activeTab === 'chunk'
                      ? 'border-[#58CC02] text-[#58CC02]'
                      : 'border-transparent text-slate-400 hover:text-slate-600'
                  }`}
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>Mode Cepat & Preview (Rekomendasi)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('direct')}
                  className={`pb-2.5 px-4 text-xs font-black uppercase tracking-wider transition-all border-b-4 -mb-[2px] cursor-pointer flex items-center gap-1.5 ${
                    activeTab === 'direct'
                      ? 'border-[#1CB0F6] text-[#1CB0F6]'
                      : 'border-transparent text-slate-400 hover:text-slate-600'
                  }`}
                >
                  <FolderUp className="w-3.5 h-3.5" />
                  <span>Upload File Utuh Langsung</span>
                </button>
              </div>

              {/* Area File Dropzone */}
              <div>
                <label className="block text-xs font-black uppercase text-slate-700 mb-2">
                  Pilih Berkas Excel DPS (.xlsx / .xls / .csv)
                </label>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-3xl p-6 sm:p-8 text-center cursor-pointer transition-all ${
                    selectedFile
                      ? 'border-[#58CC02] bg-[#58CC02]/5'
                      : 'border-slate-300 hover:border-[#58CC02] hover:bg-slate-50'
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".xlsx, .xls, .csv"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleFileChange(e.target.files[0]);
                      }
                    }}
                  />

                  <div className="flex flex-col items-center justify-center gap-2">
                    <div className="w-12 h-12 rounded-2xl bg-white border-2 border-slate-200 flex items-center justify-center text-slate-600 shadow-sm">
                      <Upload className="w-6 h-6 text-[#58CC02]" />
                    </div>
                    {selectedFile ? (
                      <div className="space-y-1">
                        <span className="text-sm font-black text-slate-900 block">
                          {selectedFile.name}
                        </span>
                        <span className="text-xs text-slate-500 font-bold">
                          {(selectedFile.size / 1024).toFixed(1)} KB • Klik untuk ganti berkas
                        </span>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <span className="text-sm font-black text-slate-800 block">
                          Tarik berkas Excel ke sini atau klik untuk memilih
                        </span>
                        <span className="text-xs text-slate-400 font-bold">
                          Format yang didukung: Microsoft Excel (.xlsx, .xls) atau CSV (.csv)
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Indikator Parsing */}
              {isParsing && (
                <div className="flex items-center justify-center gap-3 py-4 text-[#58CC02]">
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  <span className="text-xs font-black uppercase tracking-wider">
                    Sedang membaca struktur tabel dan baris pemilih...
                  </span>
                </div>
              )}

              {/* Pesan Kesalahan Parse */}
              {parseError && (
                <div className="bg-[#FFE5E5] border-2 border-[#EA2B2B] rounded-2xl p-4 flex items-start gap-3 text-[#EA2B2B]">
                  <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                  <div className="text-xs font-bold leading-relaxed">{parseError}</div>
                </div>
              )}

              {directUploadError && (
                <div className="bg-[#FFE5E5] border-2 border-[#EA2B2B] rounded-2xl p-4 flex items-start gap-3 text-[#EA2B2B]">
                  <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                  <div className="text-xs font-bold leading-relaxed">{directUploadError}</div>
                </div>
              )}

              {/* Opsi Pengaturan Import */}
              <div className="bg-slate-50 border-2 border-slate-200 rounded-3xl p-4 sm:p-5 space-y-3">
                <span className="text-xs font-black uppercase text-slate-700 tracking-wider block">
                  Opsi Import Data
                </span>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="updateExisting"
                    checked={updateExisting}
                    onChange={(e) => setUpdateExisting(e.target.checked)}
                    className="w-4 h-4 rounded text-[#58CC02] focus:ring-[#58CC02] border-slate-300 cursor-pointer"
                  />
                  <label htmlFor="updateExisting" className="text-xs font-bold text-slate-700 cursor-pointer">
                    Perbarui data jika NIK sudah ada di database (Update data ganda)
                  </label>
                </div>

                <div className="flex items-start gap-3 pt-1">
                  <input
                    type="checkbox"
                    id="resetFirst"
                    checked={resetFirst}
                    onChange={(e) => setResetFirst(e.target.checked)}
                    className="w-4 h-4 rounded text-[#EA2B2B] focus:ring-[#EA2B2B] border-slate-300 cursor-pointer mt-0.5"
                  />
                  <div>
                    <label htmlFor="resetFirst" className="text-xs font-black text-[#EA2B2B] cursor-pointer">
                      Hapus / Kosongkan seluruh data DPS lama sebelum mengimpor file ini
                    </label>
                    <p className="text-[10px] text-slate-500 font-bold mt-0.5">
                      Gunakan hanya jika Anda ingin mengganti total daftar pemilih dari awal.
                    </p>
                  </div>
                </div>
              </div>

              {/* MODE 1: Preview Data & Chunk Import */}
              {activeTab === 'chunk' && parsedRows.length > 0 && (
                <div className="space-y-4">
                  {/* Statistik Data Terdeteksi */}
                  <div className="flex flex-wrap items-center justify-between gap-3 bg-white border-2 border-slate-200 rounded-2xl p-4">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-[#58CC02] animate-pulse"></span>
                      <span className="text-xs font-black text-slate-800">
                        {parsedRows.length.toLocaleString('id-ID')} Baris Pemilih Ditemukan
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setShowPreview(!showPreview)}
                        className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>{showPreview ? 'Sembunyikan Preview' : 'Lihat Preview'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Tabel Preview Baris Pertama */}
                  {showPreview && (
                    <div className="border-2 border-slate-200 rounded-2xl overflow-hidden shadow-xs">
                      <div className="bg-slate-100 px-4 py-2 border-b-2 border-slate-200 flex items-center justify-between">
                        <span className="text-[11px] font-black uppercase text-slate-600 tracking-wider">
                          Preview 5 Baris Pertama Terdeteksi
                        </span>
                        <span className="text-[10px] font-bold text-slate-400">
                          (Pastikan kolom sesuai sebelum import)
                        </span>
                      </div>
                      <div className="overflow-x-auto max-h-60">
                        <table className="w-full text-left text-xs border-collapse">
                          <thead className="bg-slate-50 text-slate-500 font-black text-[10px] uppercase border-b border-slate-200 sticky top-0">
                            <tr>
                              <th className="py-2.5 px-3">No</th>
                              <th className="py-2.5 px-3">NIK (16 Digit)</th>
                              <th className="py-2.5 px-3">Nama Pemilih</th>
                              <th className="py-2.5 px-3">JK</th>
                              <th className="py-2.5 px-3">Tempat / Tgl Lahir</th>
                              <th className="py-2.5 px-3">Dusun / RT / RW</th>
                              <th className="py-2.5 px-3">TPS</th>
                              <th className="py-2.5 px-3">Status</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 font-medium">
                            {parsedRows.slice(0, 5).map((row, idx) => (
                              <tr key={idx} className="hover:bg-slate-50">
                                <td className="py-2.5 px-3 font-bold text-slate-500">{idx + 1}</td>
                                <td className="py-2.5 px-3">
                                  <span
                                    className={`font-mono font-bold px-2 py-0.5 rounded-lg text-[11px] ${
                                      row._isValidNik
                                        ? 'bg-slate-100 text-slate-800'
                                        : 'bg-amber-100 text-amber-700'
                                    }`}
                                  >
                                    {row.nik || '(Kosong)'}
                                  </span>
                                </td>
                                <td className="py-2.5 px-3 font-black text-slate-900 uppercase">
                                  {row.nama}
                                </td>
                                <td className="py-2.5 px-3">
                                  <span
                                    className={`px-2 py-0.5 rounded-lg font-black text-[10px] ${
                                      row.jenis_kelamin?.toUpperCase().startsWith('P')
                                        ? 'bg-rose-100 text-rose-700'
                                        : 'bg-sky-100 text-sky-700'
                                    }`}
                                  >
                                    {row.jenis_kelamin?.toUpperCase().startsWith('P') ? 'P' : 'L'}
                                  </span>
                                </td>
                                <td className="py-2.5 px-3 text-slate-600">
                                  {row.tempat_lahir || '-'} {row.tanggal_lahir ? `, ${row.tanggal_lahir}` : ''}
                                </td>
                                <td className="py-2.5 px-3 text-slate-600">
                                  {row.dusun || '-'} {row.rt ? `RT ${row.rt}` : ''} {row.rw ? `RW ${row.rw}` : ''}
                                </td>
                                <td className="py-2.5 px-3 font-black text-[#1CB0F6]">
                                  {row.tps || 'Auto'}
                                </td>
                                <td className="py-2.5 px-3">
                                  <span className="px-2 py-0.5 rounded-lg font-black text-[10px] bg-emerald-100 text-emerald-700">
                                    {row.status || 'AKTIF'}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* Progress Bar Saat Import */}
                  {isImporting && (
                    <div className="space-y-2 bg-slate-50 border-2 border-slate-200 rounded-2xl p-4">
                      <div className="flex items-center justify-between text-xs font-black">
                        <span className="text-slate-700">{currentChunkInfo}</span>
                        <span className="text-[#58CC02]">{importProgress}%</span>
                      </div>
                      <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#58CC02] transition-all duration-300 rounded-full"
                          style={{ width: `${importProgress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* MODE 2: Direct File Form */}
              {activeTab === 'direct' && (
                <div className="p-4 bg-slate-50 border-2 border-slate-200 rounded-2xl space-y-3">
                  <p className="text-xs text-slate-600 font-bold leading-relaxed">
                    Mode ini akan mengunggah file Excel Anda langsung ke server Laravel dan diproses menggunakan pustaka <strong>PhpSpreadsheet</strong> di latar belakang.
                  </p>
                  <button
                    type="button"
                    onClick={handleDirectFileUpload}
                    disabled={!selectedFile || isDirectUploading}
                    className="w-full py-3 rounded-2xl bg-[#1CB0F6] hover:bg-[#189ddb] text-white font-black text-xs uppercase tracking-wider border-b-4 border-[#1899D6] active:border-b-0 active:translate-y-1 transition-all disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
                  >
                    {isDirectUploading ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Sedang Mengunggah & Memproses di Server...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4" />
                        <span>Upload & Proses Langsung di Server</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </>
          )}

        </div>

        {/* Footer Actions */}
        {!importResult && (
          <div className="flex items-center justify-between gap-3 pt-4 border-t-2 border-slate-100 shrink-0">
            <button
              type="button"
              onClick={handleClose}
              className="px-5 py-2.5 rounded-2xl bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs uppercase tracking-wider border-2 border-slate-200 cursor-pointer"
            >
              Batal
            </button>

            {activeTab === 'chunk' && (
              <button
                type="button"
                onClick={handleStartChunkImport}
                disabled={parsedRows.length === 0 || isImporting}
                className="px-6 py-2.5 rounded-2xl bg-[#58CC02] hover:bg-[#4ebb02] text-white font-black text-xs uppercase tracking-wider border-b-4 border-[#46A302] active:border-b-0 active:translate-y-1 transition-all disabled:opacity-50 cursor-pointer flex items-center gap-2 shadow-xs"
              >
                {isImporting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Mengimpor Data ({importProgress}%)...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    <span>Mulai Import ({parsedRows.length.toLocaleString('id-ID')} Pemilih)</span>
                  </>
                )}
              </button>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
