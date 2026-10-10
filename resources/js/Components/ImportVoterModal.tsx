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
  FolderUp,
  FileDown,
  HelpCircle,
  Edit3,
  Save,
  UserCheck,
  UserPlus,
  Sparkles,
  Copy,
  Search
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
  rowNumber: number;
  no_dpt?: string | number;
  no_urut?: string | number;
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

interface SkippedRowInfo {
  rowNumber: number;
  nik: string;
  nama: string;
  jenis_kelamin?: string;
  tempat_lahir?: string;
  tanggal_lahir?: string;
  dusun?: string;
  rt?: string;
  rw?: string;
  tps?: string;
  status?: string;
  keterangan?: string;
  reason: string;
}

interface DuplicateRowInfo {
  rowNumber: number; // Baris kedua / duplikat di Excel
  nik: string;
  nama: string;
  dusun?: string;
  rt?: string;
  rw?: string;
  tps?: string;
  jenis_kelamin?: string;
  tempat_lahir?: string;
  tanggal_lahir?: string;
  firstSeenRowNumber: number; // Baris pertama / asal di Excel
  firstSeenName: string;
  firstSeenDusun?: string;
  firstSeenRt?: string;
  firstSeenRw?: string;
  firstSeenTps?: string;
  firstSeenJenisKelamin?: string;
}

interface FileStats {
  totalRowsInFile: number;
  headerAndTitleRows: number;
  emptyOrFooterRows: number;
  totalVoterCandidateRows: number;
  validVotersCount: number;
  uniqueVotersCount: number;
  duplicateVotersCount: number;
  invalidVotersCount: number;
}

export const ImportVoterModal: React.FC<ImportVoterModalProps> = ({
  isOpen,
  onClose,
  allTpsOptions,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isParsing, setIsParsing] = useState(false);
  const [validParsedRows, setValidParsedRows] = useState<ParsedVoterRow[]>([]);
  const [headerColumns, setHeaderColumns] = useState<string[]>([]);
  const [parseError, setParseError] = useState<string | null>(null);
  const [fileStats, setFileStats] = useState<FileStats | null>(null);

  // Baris yang dilewati saat parsing (di sisi klien)
  const [skippedInParsing, setSkippedInParsing] = useState<SkippedRowInfo[]>([]);
  const [showSkippedWarning, setShowSkippedWarning] = useState(false);

  // Baris dengan NIK ganda di dalam file Excel
  const [duplicateInParsing, setDuplicateInParsing] = useState<DuplicateRowInfo[]>([]);
  const [showDuplicateWarning, setShowDuplicateWarning] = useState(false);
  const [duplicateSearchQuery, setDuplicateSearchQuery] = useState('');
  const [showPostImportDuplicateDetail, setShowPostImportDuplicateDetail] = useState(false);

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
    totalVoterRows: number;
    totalRowsInFile: number;
    nonDataRowsCount: number;
  } | null>(null);

  // Baris yang dilewati secara total (parsing + backend)
  const [allSkippedRows, setAllSkippedRows] = useState<SkippedRowInfo[]>([]);
  const [showSkippedDetail, setShowSkippedDetail] = useState(false);

  // State untuk Fitur Koreksi Manual Baris Terlewat
  const [editingRow, setEditingRow] = useState<SkippedRowInfo | null>(null);
  const [editFormData, setEditFormData] = useState<{
    nik: string;
    nama: string;
    jenis_kelamin: string;
    tps_id: string;
    dusun: string;
    rt: string;
    rw: string;
    tempat_lahir: string;
    tanggal_lahir: string;
    keterangan: string;
  }>({
    nik: '',
    nama: '',
    jenis_kelamin: 'L',
    tps_id: allTpsOptions[0]?.id ? String(allTpsOptions[0].id) : '1',
    dusun: '',
    rt: '',
    rw: '',
    tempat_lahir: '',
    tanggal_lahir: '',
    keterangan: '',
  });
  const [isSavingCorrection, setIsSavingCorrection] = useState(false);
  const [correctionSuccessMsg, setCorrectionSuccessMsg] = useState<string | null>(null);
  const [correctionErrorMsg, setCorrectionErrorMsg] = useState<string | null>(null);

  // Direct File Upload State
  const [activeTab, setActiveTab] = useState<'chunk' | 'direct'>('chunk');
  const [isDirectUploading, setIsDirectUploading] = useState(false);
  const [directUploadError, setDirectUploadError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleResetState = () => {
    setSelectedFile(null);
    setValidParsedRows([]);
    setHeaderColumns([]);
    setParseError(null);
    setFileStats(null);
    setIsImporting(false);
    setImportProgress(0);
    setCurrentChunkInfo('');
    setImportResult(null);
    setIsDirectUploading(false);
    setDirectUploadError(null);
    setSkippedInParsing([]);
    setShowSkippedWarning(false);
    setDuplicateInParsing([]);
    setShowDuplicateWarning(false);
    setDuplicateSearchQuery('');
    setShowPostImportDuplicateDetail(false);
    setAllSkippedRows([]);
    setShowSkippedDetail(false);
    setEditingRow(null);
    setCorrectionSuccessMsg(null);
    setCorrectionErrorMsg(null);
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
    const hadResult = !!importResult;
    handleResetState();
    onClose();
    if (hadResult) {
      router.reload();
    }
  };

  /**
   * Helper konversi nilai sel Excel agar tanggal, angka murni (NIK 16 digit), dan teks tidak rusak
   */
  const formatCellValue = (val: any): string => {
    if (val === null || val === undefined) return '';
    if (val instanceof Date) {
      if (isNaN(val.getTime())) return '';
      const y = val.getFullYear();
      const m = String(val.getMonth() + 1).padStart(2, '0');
      const d = String(val.getDate()).padStart(2, '0');
      return `${y}-${m}-${d}`;
    }
    if (typeof val === 'number') {
      // Di JavaScript, integer hingga 9.007.199.254.740.991 (16 digit) aman tanpa pembulatan
      return Number.isInteger(val) ? BigInt(val).toString() : String(val);
    }
    return String(val).trim();
  };

  /**
   * Helper parsing NIK yang kebal notasi ilmiah dan format angka Excel
   */
  const extractNik = (rawVal: any): { nik: string; raw: string; error?: string } => {
    if (rawVal === null || rawVal === undefined) {
      return { nik: '', raw: '', error: 'NIK kosong' };
    }

    let str = '';
    if (typeof rawVal === 'number') {
      str = Number.isInteger(rawVal) ? BigInt(rawVal).toString() : String(rawVal);
    } else {
      str = String(rawVal).trim().replace(/['"]/g, '');
    }

    // Tangani Notasi Ilmiah Excel jika terlanjur berformat string bertanda E+ (misal: 3.32703450278E+15)
    if (/^[0-9]+(\.[0-9]+)?[eE]\+[0-9]+$/i.test(str)) {
      try {
        const num = Number(str);
        if (!isNaN(num) && isFinite(num)) {
          str = BigInt(Math.round(num)).toString();
        }
      } catch {}
    }

    const digits = str.replace(/\D/g, '');

    if (digits.length === 16) {
      return { nik: digits, raw: str };
    }

    if (digits.length === 15) {
      return {
        nik: digits,
        raw: str,
        error: `NIK hanya 15 digit (kurang 1 angka, kemungkinan angka 0 di depan hilang: ${digits})`,
      };
    }

    if (digits.length === 0) {
      return { nik: '', raw: str, error: 'NIK kosong / tidak berisi angka' };
    }

    return {
      nik: digits,
      raw: str,
      error: `NIK terdeteksi ${digits.length} digit (harus tepat 16 digit: ${digits})`,
    };
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
    setValidParsedRows([]);
    setHeaderColumns([]);
    setFileStats(null);
    setSkippedInParsing([]);

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

        if (!workbook.SheetNames || workbook.SheetNames.length === 0) {
          throw new Error('File Excel tidak memiliki lembar kerja (sheet).');
        }

        let totalRowsInFile = 0;
        let totalHeaderAndTitleRows = 0;
        let totalEmptyOrFooterRows = 0;
        const validVoters: ParsedVoterRow[] = [];
        const skippedVoters: SkippedRowInfo[] = [];
        const duplicateVoters: DuplicateRowInfo[] = [];
        let primaryHeaders: string[] = [];
        const seenNikMap = new Map<
          string,
          {
            rowNumber: number;
            nama: string;
            dusun?: string;
            rt?: string;
            rw?: string;
            tps?: string;
            jenis_kelamin?: string;
            tempat_lahir?: string;
            tanggal_lahir?: string;
          }
        >();
        let duplicateNikCountInFile = 0;

        // Iterasi seluruh sheet di dalam workbook Excel (mendukung multi-sheet TPS maupun single sheet)
        for (const sheetName of workbook.SheetNames) {
          const worksheet = workbook.Sheets[sheetName];
          if (!worksheet) continue;

          const rawData: any[][] = XLSX.utils.sheet_to_json(worksheet, {
            header: 1,
            defval: '',
            raw: true,
          });

          if (!rawData || rawData.length === 0) {
            continue;
          }

          // Pangkas baris-baris kosong di bagian paling bawah (trailing empty rows)
          // agar total baris file tepat berhenti di baris data terakhir
          let lastDataRowIdx = rawData.length - 1;
          while (
            lastDataRowIdx >= 0 &&
            (!rawData[lastDataRowIdx] ||
              rawData[lastDataRowIdx].length === 0 ||
              !rawData[lastDataRowIdx].some(
                (val: any) => val !== null && val !== undefined && String(val).trim() !== ''
              ))
          ) {
            lastDataRowIdx--;
          }

          if (lastDataRowIdx < 0) {
            continue;
          }

          const trimmedRawData = rawData.slice(0, lastDataRowIdx + 1);
          totalRowsInFile += trimmedRawData.length;

          // 1. Deteksi Baris Header Kolom pada sheet ini
          let headerRowIdx = -1;
          let subHeaderRowIdx = -1;

          for (let i = 0; i < Math.min(trimmedRawData.length, 25); i++) {
            const rowStr = trimmedRawData[i].map((c) => String(c ?? '').trim().toUpperCase()).join(' ');
            if (
              (rowStr.includes('NIK') && rowStr.includes('NAMA')) ||
              (rowStr.includes('PEMILIH') && rowStr.includes('KELAMIN')) ||
              (rowStr.includes('NO DPT') && rowStr.includes('NIK'))
            ) {
              headerRowIdx = i;
              if (i + 1 < trimmedRawData.length) {
                const nextRowStr = trimmedRawData[i + 1].map((c) => String(c ?? '').trim().toUpperCase()).join(' ');
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

          // Jika sheet tidak memiliki kolom NIK & Nama (misal sheet petunjuk/grafik), lewati sheet ini
          if (headerRowIdx === -1) {
            continue;
          }

          const headerRow = trimmedRawData[headerRowIdx];
          const subHeaderRow = subHeaderRowIdx !== -1 ? trimmedRawData[subHeaderRowIdx] : [];
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

          if (primaryHeaders.length === 0) {
            primaryHeaders = detectedHeaders;
          }

          // 2. Klasifikasi & Akuntansi Baris Data
          const dataStartIndex = (subHeaderRowIdx !== -1 ? subHeaderRowIdx : headerRowIdx) + 1;
          totalHeaderAndTitleRows += dataStartIndex;

          // Deteksi kemungkinan nomor TPS dari nama sheet (misal "TPS 01" -> "001")
          let defaultSheetTps = '';
          const sheetTpsMatch = sheetName.match(/TPS\s*0*([0-9]+)/i);
          if (sheetTpsMatch && sheetTpsMatch[1]) {
            defaultSheetTps = sheetTpsMatch[1].padStart(3, '0');
          }

          for (let r = dataStartIndex; r < trimmedRawData.length; r++) {
            const row = trimmedRawData[r];
            const rowNumber = r + 1;

            // A. Baris Kosong di tengah data: lewati langsung tanpa menambah hitungan non-data
            if (!row || row.length === 0 || !row.some((val: any) => val !== null && val !== undefined && String(val).trim() !== '')) {
              continue;
            }

            const item: any = {};
            let rawNikCell: any = null;
            for (let c = 0; c < row.length; c++) {
              const key = colKeyMap[c];
              if (key) {
                item[key] = formatCellValue(row[c]);
                if (key === 'nik') {
                  rawNikCell = row[c];
                }
              }
            }

            const nama = String(item.nama || '').trim();
            const nikResult = extractNik(rawNikCell !== null ? rawNikCell : item.nik);

            // B. Baris Footer / Rekap Total / Tanda Tangan
            if (
              nama.toUpperCase().includes('TOTAL') ||
              nama.toUpperCase().includes('JUMLAH') ||
              nama.toUpperCase().includes('MENGETAHUI') ||
              nama.toUpperCase().includes('KETUA P2KD') ||
              (!nama && !nikResult.nik)
            ) {
              continue;
            }

            const resolvedTps = item.tps || defaultSheetTps || '';

            // C. Baris Data Pemilih Tidak Valid
            if (!nama) {
              skippedVoters.push({
                rowNumber,
                nik: nikResult.raw || nikResult.nik || '(kosong)',
                nama: '(kosong)',
                jenis_kelamin: item.jenis_kelamin || 'L',
                tempat_lahir: item.tempat_lahir || '',
                tanggal_lahir: item.tanggal_lahir || '',
                dusun: item.dusun || '',
                rt: item.rt || '',
                rw: item.rw || '',
                tps: resolvedTps,
                status: item.status || 'DPS',
                keterangan: item.keterangan || item.ket || '',
                reason: 'Nama pemilih kosong di file Excel',
              });
              continue;
            }

            if (nikResult.error || nikResult.nik.length !== 16) {
              skippedVoters.push({
                rowNumber,
                nik: nikResult.raw || '(kosong)',
                nama,
                jenis_kelamin: item.jenis_kelamin || 'L',
                tempat_lahir: item.tempat_lahir || '',
                tanggal_lahir: item.tanggal_lahir || '',
                dusun: item.dusun || '',
                rt: item.rt || '',
                rw: item.rw || '',
                tps: resolvedTps,
                status: item.status || 'DPS',
                keterangan: item.keterangan || item.ket || '',
                reason: nikResult.error || `NIK tidak valid (${nikResult.nik.length} digit, harus 16 digit)`,
              });
              continue;
            }

            // D. Baris Data Pemilih Valid
            if (seenNikMap.has(nikResult.nik)) {
              const original = seenNikMap.get(nikResult.nik)!;
              duplicateNikCountInFile++;
              duplicateVoters.push({
                rowNumber,
                nik: nikResult.nik,
                nama,
                dusun: item.dusun || '',
                rt: item.rt || '',
                rw: item.rw || '',
                tps: resolvedTps,
                jenis_kelamin: item.jenis_kelamin || 'L',
                tempat_lahir: item.tempat_lahir || '',
                tanggal_lahir: item.tanggal_lahir || '',
                firstSeenRowNumber: original.rowNumber,
                firstSeenName: original.nama,
                firstSeenDusun: original.dusun || '',
                firstSeenRt: original.rt || '',
                firstSeenRw: original.rw || '',
                firstSeenTps: original.tps || '',
                firstSeenJenisKelamin: original.jenis_kelamin || 'L',
              });
            } else {
              seenNikMap.set(nikResult.nik, {
                rowNumber,
                nama,
                dusun: item.dusun || '',
                rt: item.rt || '',
                rw: item.rw || '',
                tps: resolvedTps,
                jenis_kelamin: item.jenis_kelamin || 'L',
                tempat_lahir: item.tempat_lahir || '',
                tanggal_lahir: item.tanggal_lahir || '',
              });
            }

            const sequentialNo = validVoters.length + 1;
            let resolvedNoDpt: number | string = sequentialNo;
            if (item.no_dpt && !isNaN(Number(item.no_dpt)) && Number(item.no_dpt) > 0) {
              resolvedNoDpt = Number(item.no_dpt);
            } else if (item.no && !isNaN(Number(item.no)) && Number(item.no) > 0) {
              resolvedNoDpt = Number(item.no);
            }

            validVoters.push({
              rowNumber,
              no_dpt: resolvedNoDpt,
              no_urut: resolvedNoDpt,
              no: resolvedNoDpt,
              nik: nikResult.nik,
              nama,
              jenis_kelamin: item.jenis_kelamin || 'L',
              tempat_lahir: item.tempat_lahir || '',
              tanggal_lahir: item.tanggal_lahir || '',
              dusun: item.dusun || '',
              rt: item.rt || '',
              rw: item.rw || '',
              tps: resolvedTps,
              status: item.status || 'DPS',
              ket: item.ket || '',
              keterangan: item.keterangan || '',
              _isValidNik: true,
            });
          }
        }

        if (primaryHeaders.length === 0) {
          throw new Error(
            'Kolom header tidak ditemukan! Pastikan berkas Excel memiliki baris judul kolom yang memuat minimal kolom "NIK" dan "NAMA PEMILIH".'
          );
        }

        setHeaderColumns(primaryHeaders);

        const totalVoterCandidateRows = validVoters.length + skippedVoters.length;

        if (totalVoterCandidateRows === 0) {
          throw new Error('Tidak ada baris data pemilih yang ditemukan dalam berkas Excel.');
        }

        setValidParsedRows(validVoters);
        setSkippedInParsing(skippedVoters);
        setDuplicateInParsing(duplicateVoters);
        setAllSkippedRows(skippedVoters);
        setShowSkippedWarning(skippedVoters.length > 0);

        setFileStats({
          totalRowsInFile,
          headerAndTitleRows: totalHeaderAndTitleRows,
          emptyOrFooterRows: totalEmptyOrFooterRows,
          totalVoterCandidateRows,
          validVotersCount: validVoters.length,
          uniqueVotersCount: seenNikMap.size,
          duplicateVotersCount: duplicateNikCountInFile,
          invalidVotersCount: skippedVoters.length,
        });

        setIsParsing(false);
      } catch (err: any) {
        setIsParsing(false);
        setParseError(err.message || 'Terjadi kesalahan saat memproses berkas Excel.');
      }
    };

    reader.onerror = () => {
      setIsParsing(false);
      setParseError('Gagal membaca berkas. Pastikan berkas tidak rusak atau terproteksi sandi.');
    };

    reader.readAsArrayBuffer(file);
  };

  /**
   * Buka Form Koreksi Manual untuk baris tertentu
   */
  const handleOpenCorrection = (row: SkippedRowInfo) => {
    // Cari TPS ID yang cocok
    let matchedTpsId = allTpsOptions[0]?.id ? String(allTpsOptions[0].id) : '1';
    if (row.tps) {
      const numTps = String(row.tps).replace(/\D/g, '');
      const found = allTpsOptions.find(t => t.nomor_tps === numTps || t.nomor_tps === String(row.tps));
      if (found) matchedTpsId = String(found.id);
    }

    // Bersihkan NIK awal
    const rawCleanNik = String(row.nik || '').replace(/[^0-9]/g, '');

    setEditingRow(row);
    setEditFormData({
      nik: rawCleanNik,
      nama: row.nama === '(kosong)' ? '' : row.nama,
      jenis_kelamin: row.jenis_kelamin?.toUpperCase().startsWith('P') ? 'P' : 'L',
      tps_id: matchedTpsId,
      dusun: row.dusun || '',
      rt: row.rt || '',
      rw: row.rw || '',
      tempat_lahir: row.tempat_lahir || '',
      tanggal_lahir: row.tanggal_lahir || '',
      keterangan: row.keterangan || '',
    });
    setCorrectionSuccessMsg(null);
    setCorrectionErrorMsg(null);
  };

  /**
   * Simpan Data Pemilih yang telah dikoreksi manual
   */
  const handleSaveCorrection = async (e: React.FormEvent, andNext: boolean = false) => {
    e.preventDefault();
    if (!editingRow) return;

    const cleanNik = editFormData.nik.replace(/\D/g, '');
    if (cleanNik.length !== 16) {
      setCorrectionErrorMsg(`NIK harus tepat 16 digit angka (saat ini ${cleanNik.length} digit).`);
      return;
    }

    if (!editFormData.nama.trim()) {
      setCorrectionErrorMsg('Nama pemilih wajib diisi.');
      return;
    }

    setIsSavingCorrection(true);
    setCorrectionErrorMsg(null);
    setCorrectionSuccessMsg(null);

    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';

    try {
      // Kirim ke endpoint import-chunk dengan single record
      const response = await fetch('/admin/voters/import-chunk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-CSRF-TOKEN': csrfToken,
          'X-Requested-With': 'XMLHttpRequest',
        },
        body: JSON.stringify({
          voters: [
            {
              rowNumber: editingRow.rowNumber,
              nik: cleanNik,
              nama: editFormData.nama.trim(),
              jenis_kelamin: editFormData.jenis_kelamin,
              tps: editFormData.tps_id,
              dusun: editFormData.dusun,
              rt: editFormData.rt,
              rw: editFormData.rw,
              tempat_lahir: editFormData.tempat_lahir,
              tanggal_lahir: editFormData.tanggal_lahir,
              keterangan: editFormData.keterangan,
              status: 'DPS',
            },
          ],
          update_existing: true,
          reset_first: false,
        }),
      });

      const resData = await response.json();

      if (!response.ok || !resData.success) {
        throw new Error(resData.message || 'Gagal menyimpan pemilih ke database.');
      }

      // Cari baris saat ini dan tentukan baris berikutnya
      const currentIndex = allSkippedRows.findIndex(r => r.rowNumber === editingRow.rowNumber);
      const updatedSkipped = allSkippedRows.filter(r => r.rowNumber !== editingRow.rowNumber);
      setAllSkippedRows(updatedSkipped);
      setSkippedInParsing(prev => prev.filter(r => r.rowNumber !== editingRow.rowNumber));

      // Update counter hasil import jika ada
      if (importResult) {
        setImportResult(prev => prev ? {
          ...prev,
          inserted: prev.inserted + (resData.inserted || 1),
          skipped: Math.max(0, prev.skipped - 1),
        } : null);
      }

      setCorrectionSuccessMsg(`Pemilih ${editFormData.nama.toUpperCase()} (NIK: ${cleanNik}) berhasil disimpan ke DPS!`);
      setIsSavingCorrection(false);

      if (andNext && updatedSkipped.length > 0) {
        // Otomatis buka baris berikutnya
        const nextRow = updatedSkipped[currentIndex < updatedSkipped.length ? currentIndex : 0];
        setTimeout(() => {
          handleOpenCorrection(nextRow);
        }, 700);
      } else {
        setTimeout(() => {
          setEditingRow(null);
          setCorrectionSuccessMsg(null);
        }, 1200);
      }
    } catch (err: any) {
      setIsSavingCorrection(false);
      setCorrectionErrorMsg(err.message || 'Terjadi kesalahan saat menyimpan data.');
    }
  };

  /**
   * Eksekusi Chunked Import ke Backend Laravel
   */
  const handleStartChunkImport = async () => {
    if (validParsedRows.length === 0) {
      setParseError('Tidak ada baris dengan NIK valid (16 digit) yang bisa diimpor.');
      return;
    }

    setIsImporting(true);
    setImportProgress(0);
    setCurrentChunkInfo('Mempersiapkan data import...');
    setImportResult(null);

    const CHUNK_SIZE = 150;
    const totalRecords = validParsedRows.length;
    const totalChunks = Math.ceil(totalRecords / CHUNK_SIZE);

    let totalInserted = 0;
    let totalUpdated = 0;
    let totalBackendSkipped = 0;
    const backendSkippedDetails: SkippedRowInfo[] = [];

    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';

    try {
      for (let i = 0; i < totalChunks; i++) {
        const start = i * CHUNK_SIZE;
        const end = Math.min(start + CHUNK_SIZE, totalRecords);
        const chunk = validParsedRows.slice(start, end);

        setCurrentChunkInfo(
          `Mengunggah paket ${i + 1} dari ${totalChunks} (baris ${start + 1}–${end} dari ${totalRecords} data valid)...`
        );

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
        totalBackendSkipped += resData.skipped || 0;

        if (resData.skipped_rows && Array.isArray(resData.skipped_rows)) {
          backendSkippedDetails.push(...resData.skipped_rows);
        }

        const progressPercent = Math.round(((i + 1) / totalChunks) * 100);
        setImportProgress(progressPercent);
      }

      // Pisahkan baris data tidak lengkap (harus dikoreksi) dengan notifikasi NIK ganda di file
      const incompleteSkipped = skippedInParsing;
      const backendDuplicateSkipped = backendSkippedDetails.filter(
        (r) => r.reason?.toLowerCase().includes('sudah ada') || r.reason?.toLowerCase().includes('ganda')
      );
      const otherBackendSkipped = backendSkippedDetails.filter(
        (r) => !r.reason?.toLowerCase().includes('sudah ada') && !r.reason?.toLowerCase().includes('ganda')
      );

      const trueSkippedToCorrect = [
        ...incompleteSkipped,
        ...otherBackendSkipped,
      ];
      setAllSkippedRows(trueSkippedToCorrect);
      if (trueSkippedToCorrect.length > 0) {
        setShowSkippedDetail(true);
      }

      const nonDataCount = (fileStats?.headerAndTitleRows || 0) + (fileStats?.emptyOrFooterRows || 0);
      const totalRowsFile = fileStats?.totalRowsInFile || totalRecords;

      // Sync data ganda & data terlewat & metadata baris langsung ke server
      setCurrentChunkInfo('Menyimpan riwayat data ganda & data terlewat...');
      await syncDuplicateRowsToDatabase(duplicateInParsing, nonDataCount, totalRowsFile);
      if (trueSkippedToCorrect.length > 0) {
        await syncSkippedRowsToDatabase(trueSkippedToCorrect);
      }

      setImportResult({
        inserted: totalInserted,
        updated: totalUpdated + (updateExisting ? 0 : backendDuplicateSkipped.length),
        skipped: trueSkippedToCorrect.length,
        totalVoterRows: fileStats?.totalVoterCandidateRows || (totalRecords + skippedInParsing.length),
        totalRowsInFile: totalRowsFile,
        nonDataRowsCount: nonDataCount,
      });

      setIsImporting(false);
      setCurrentChunkInfo('Import selesai!');
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
   * Unduh file Excel berisikan seluruh baris yang dilewati/gagal
   */
  const handleDownloadSkippedReport = () => {
    if (allSkippedRows.length === 0) return;

    const reportData = allSkippedRows.map((r, idx) => ({
      'No': idx + 1,
      'Nomor Baris di Excel Asli': `Baris ${r.rowNumber}`,
      'NIK Terdeteksi': r.nik,
      'Nama Pemilih': r.nama,
      'Alasan Dilewati': r.reason,
      'Saran Solusi': r.reason.includes('15')
        ? 'Periksa angka awal NIK, pastikan format sel teks agar angka 0 tidak terhapus.'
        : r.reason.includes('kosong')
        ? 'Lengkapi NIK atau Nama Pemilih yang kosong pada file Excel.'
        : 'Pastikan NIK tepat 16 digit angka dan tidak duplikat.',
    }));

    const ws = XLSX.utils.json_to_sheet(reportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Baris Dilewati');

    ws['!cols'] = [
      { wch: 6 },
      { wch: 25 },
      { wch: 22 },
      { wch: 30 },
      { wch: 45 },
      { wch: 55 },
    ];

    XLSX.writeFile(wb, `Laporan_Baris_Dilewati_Import_DPS_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  /**
   * Unduh file Excel berisikan seluruh baris NIK ganda yang terdeteksi di file
   */
  const handleDownloadDuplicateReport = () => {
    if (duplicateInParsing.length === 0) return;

    const reportData = duplicateInParsing.map((r, idx) => ({
      'No': idx + 1,
      'Pasangan Baris Kembar': `Baris #${r.firstSeenRowNumber} ⟷ Baris #${r.rowNumber}`,
      'NIK Ganda': r.nik,
      'Baris Asal (Pertama)': `Baris #${r.firstSeenRowNumber}`,
      'Nama di Baris Asal': r.firstSeenName,
      'TPS Baris Asal': r.firstSeenTps || '-',
      'Alamat Baris Asal': `${r.firstSeenDusun || '-'} ${r.firstSeenRt ? `RT ${r.firstSeenRt}` : ''} ${r.firstSeenRw ? `RW ${r.firstSeenRw}` : ''}`.trim(),
      'Baris Ganda (Duplikat)': `Baris #${r.rowNumber}`,
      'Nama di Baris Ganda': r.nama,
      'TPS Baris Ganda': r.tps || '-',
      'Alamat Baris Ganda': `${r.dusun || '-'} ${r.rt ? `RT ${r.rt}` : ''} ${r.rw ? `RW ${r.rw}` : ''}`.trim(),
      'Status Kecocokan': r.nama.trim().toUpperCase() === r.firstSeenName.trim().toUpperCase() ? 'Nama & NIK 100% Identik' : 'Nama Berbeda pada NIK yang Sama',
      'Penanganan Sistem': 'Diperbarui otomatis ke daftar DPS (Data baris terbaru digunakan)',
    }));

    const ws = XLSX.utils.json_to_sheet(reportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Laporan Data Ganda');

    ws['!cols'] = [
      { wch: 6 },
      { wch: 25 },
      { wch: 22 },
      { wch: 22 },
      { wch: 28 },
      { wch: 15 },
      { wch: 30 },
      { wch: 22 },
      { wch: 28 },
      { wch: 15 },
      { wch: 30 },
      { wch: 30 },
      { wch: 45 },
    ];

    XLSX.writeFile(wb, `Laporan_Perbandingan_NIK_Ganda_DPS_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  /**
   * Filter daftar baris ganda berdasarkan pencarian kata kunci
   */
  const filteredDuplicateRows = duplicateInParsing.filter((r) => {
    if (!duplicateSearchQuery.trim()) return true;
    const q = duplicateSearchQuery.toLowerCase();
    return (
      r.nik.toLowerCase().includes(q) ||
      r.nama.toLowerCase().includes(q) ||
      r.firstSeenName.toLowerCase().includes(q) ||
      String(r.rowNumber).includes(q) ||
      String(r.firstSeenRowNumber).includes(q) ||
      (r.dusun && r.dusun.toLowerCase().includes(q)) ||
      (r.firstSeenDusun && r.firstSeenDusun.toLowerCase().includes(q)) ||
      (r.tps && String(r.tps).toLowerCase().includes(q)) ||
      (r.firstSeenTps && String(r.firstSeenTps).toLowerCase().includes(q))
    );
  });

  /**
   * Sync baris terlewat ke database agar muncul di tab "Data Terlewat"
   */
  const syncSkippedRowsToDatabase = async (skippedRows: SkippedRowInfo[]) => {
    if (skippedRows.length === 0) return;

    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';

    try {
      await fetch('/admin/voters/sync-pending-skipped', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-CSRF-TOKEN': csrfToken,
          'X-Requested-With': 'XMLHttpRequest',
        },
        body: JSON.stringify({
          clear_previous: true,
          skipped_voters: skippedRows.map((r) => ({
            rowNumber: r.rowNumber,
            nik: r.nik,
            nama: r.nama,
            jenis_kelamin: r.jenis_kelamin || 'L',
            tempat_lahir: r.tempat_lahir || '',
            tanggal_lahir: r.tanggal_lahir || '',
            dusun: r.dusun || '',
            rt: r.rt || '',
            rw: r.rw || '',
            tps: r.tps || '',
            status: r.status || 'DPS',
            keterangan: r.keterangan || '',
            reason: r.reason || 'Data tidak lengkap',
          })),
        }),
      });
    } catch {
      // Sync gagal tidak memblokir reload halaman
    }
  };

  /**
   * Sync baris data ganda ke database agar muncul di tab "Data Ganda"
   */
  const syncDuplicateRowsToDatabase = async (
    duplicateRows: DuplicateRowInfo[],
    headerCount?: number,
    totalRows?: number
  ) => {
    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';

    try {
      await fetch('/admin/voters/sync-import-duplicates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-CSRF-TOKEN': csrfToken,
          'X-Requested-With': 'XMLHttpRequest',
        },
        body: JSON.stringify({
          clear_previous: true,
          header_count: headerCount !== undefined ? headerCount : (fileStats?.headerAndTitleRows || 0),
          total_rows: totalRows !== undefined ? totalRows : (fileStats?.totalRowsInFile || 0),
          duplicate_voters: duplicateRows.map((r) => ({
            rowNumber: r.rowNumber,
            nik: r.nik,
            nama: r.nama,
            dusun: r.dusun || '',
            rt: r.rt || '',
            rw: r.rw || '',
            tps: r.tps || '',
            firstSeenRowNumber: r.firstSeenRowNumber,
            firstSeenName: r.firstSeenName,
            firstSeenDusun: r.firstSeenDusun || '',
            firstSeenRt: r.firstSeenRt || '',
            firstSeenRw: r.firstSeenRw || '',
            firstSeenTps: r.firstSeenTps || '',
          })),
        }),
      });
    } catch {
      // Sync gagal tidak memblokir reload halaman
    }
  };

  /**
   * Selesai & Refresh Data Dashboard
   */
  const handleFinishAndReload = async () => {
    // Sync skipped rows & duplicate rows ke DB sebelum reload
    if (allSkippedRows.length > 0) {
      await syncSkippedRowsToDatabase(allSkippedRows);
    }
    if (duplicateInParsing.length > 0) {
      await syncDuplicateRowsToDatabase(duplicateInParsing);
    }
    handleResetState();
    onClose();
    router.reload();
  };

  /**
   * Selesai & Buka Tab Data Terlewat (jika ada yang terlewat)
   */
  const handleFinishAndOpenTerlewat = async () => {
    if (allSkippedRows.length > 0) {
      await syncSkippedRowsToDatabase(allSkippedRows);
    }
    if (duplicateInParsing.length > 0) {
      await syncDuplicateRowsToDatabase(duplicateInParsing);
    }
    handleResetState();
    onClose();
    // Reload dengan ?tab=terlewat agar dashboard langsung buka tab terlewat
    router.visit(window.location.pathname + '?tab=terlewat', { replace: true });
  };

  /**
   * Selesai & Buka Tab Data Ganda
   */
  const handleFinishAndOpenGanda = async () => {
    if (allSkippedRows.length > 0) {
      await syncSkippedRowsToDatabase(allSkippedRows);
    }
    if (duplicateInParsing.length > 0) {
      await syncDuplicateRowsToDatabase(duplicateInParsing);
    }
    handleResetState();
    onClose();
    // Reload dengan ?tab=ganda agar dashboard langsung buka tab data ganda
    router.visit(window.location.pathname + '?tab=ganda', { replace: true });
  };


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto overflow-x-hidden">
      <div className="fixed inset-0 -z-10" onClick={handleClose} aria-hidden="true" />
      <div className="relative bg-white border-2 border-b-4 border-slate-200 rounded-2xl sm:rounded-3xl max-w-4xl w-full p-3.5 sm:p-8 space-y-4 sm:space-y-6 shadow-2xl my-auto max-h-[92vh] flex flex-col min-w-0 overflow-hidden z-10">
        
        {/* Header Modal */}
        <div className="flex items-center justify-between gap-3 pb-3 sm:pb-4 border-b-2 border-slate-100 shrink-0">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-[#58CC02]/15 border-2 border-[#58CC02]/30 flex items-center justify-center text-[#58CC02] shrink-0 shadow-inner">
              <FileSpreadsheet className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="min-w-0">
              <h3 className="text-base sm:text-xl font-black text-slate-900 tracking-tight truncate">
                Import DPS dari Excel
              </h3>
              <p className="text-[11px] sm:text-sm text-slate-500 font-bold mt-0.5 truncate">
                Format resmi panitia Pilkades Desa Gunungjaya 2026.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="p-1.5 sm:p-2 rounded-xl sm:rounded-2xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer shrink-0"
            title="Tutup Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Area (Scrollable) */}
        <div className="space-y-4 sm:space-y-6 overflow-y-auto overflow-x-hidden flex-1 pr-0.5 sm:pr-1 min-w-0">
          
          {/* HASIL SUKSES & REKONSILIASI ANGKA LENGKAP */}
          {importResult ? (
            <div className="space-y-4">
              <div className="bg-[#58CC02]/10 border-2 border-[#58CC02] rounded-2xl sm:rounded-3xl p-4 sm:p-6 text-center space-y-4">
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-[#58CC02] text-white flex items-center justify-center mx-auto shadow-md animate-bounce">
                  <Check className="w-7 h-7 sm:w-9 sm:h-9 stroke-[3]" />
                </div>
                <div>
                  <h4 className="text-lg sm:text-xl font-black text-slate-900">
                    Proses Import Data DPS Selesai!
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-600 font-bold mt-1">
                    {(importResult.inserted + importResult.updated).toLocaleString('id-ID')} pemilih berhasil tersimpan di database.
                  </p>
                </div>

                {/* Grid Rincian Angka Transparan (5 Kotak Rekonsiliasi) */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-3 max-w-4xl mx-auto pt-1">
                  <div className="bg-white p-3 rounded-2xl border-2 border-slate-200 text-center">
                    <span className="text-[10px] font-black uppercase text-slate-400 block">Total Baris File</span>
                    <span className="text-base sm:text-lg font-black text-slate-800">{importResult.totalRowsInFile.toLocaleString('id-ID')}</span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">Sampai data terakhir</span>
                  </div>
                  <div className="bg-purple-50/70 p-3 rounded-2xl border-2 border-purple-200 text-center">
                    <span className="text-[10px] font-black uppercase text-purple-700 block">Header / Judul</span>
                    <span className="text-base sm:text-lg font-black text-purple-700">{importResult.nonDataRowsCount.toLocaleString('id-ID')}</span>
                    <span className="text-[10px] text-purple-600/80 block mt-0.5">Dilewati otomatis</span>
                  </div>
                  <div className="bg-white p-3 rounded-2xl border-2 border-[#58CC02]/40 text-center">
                    <span className="text-[10px] font-black uppercase text-[#58CC02] block">Pemilih Baru (DPS)</span>
                    <span className="text-base sm:text-lg font-black text-[#58CC02]">+{importResult.inserted.toLocaleString('id-ID')}</span>
                    <span className="text-[10px] text-[#58CC02]/80 block mt-0.5">NIK unik masuk DPS</span>
                  </div>
                  <div className="bg-white p-3 rounded-2xl border-2 border-[#1CB0F6]/40 text-center">
                    <span className="text-[10px] font-black uppercase text-[#1CB0F6] block">Data Ganda</span>
                    <span className="text-base sm:text-lg font-black text-[#1CB0F6]">{importResult.updated.toLocaleString('id-ID')}</span>
                    <span className="text-[10px] text-[#1CB0F6]/80 block mt-0.5">NIK ganda disinkron</span>
                  </div>
                  <div className={`bg-white p-3 rounded-2xl border-2 text-center col-span-2 sm:col-span-1 ${importResult.skipped > 0 ? 'border-amber-300 bg-amber-50/50' : 'border-slate-200'}`}>
                    <span className={`text-[10px] font-black uppercase block ${importResult.skipped > 0 ? 'text-amber-600' : 'text-slate-500'}`}>Dilewati / Kurang</span>
                    <span className={`text-base sm:text-lg font-black ${importResult.skipped > 0 ? 'text-amber-600' : 'text-slate-600'}`}>{importResult.skipped.toLocaleString('id-ID')}</span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">Bisa dikoreksi manual</span>
                  </div>
                </div>

                {/* Kotak Penjelasan Rekonsiliasi Angka */}
                <div className="p-3.5 rounded-2xl bg-white border-2 border-slate-200 text-left text-xs space-y-1.5 max-w-3xl mx-auto">
                  <div className="flex items-center gap-2 text-slate-800 font-black">
                    <HelpCircle className="w-4 h-4 text-[#1CB0F6]" />
                    <span>Rekonsiliasi Angka & Penjelasan Selisih Data:</span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed font-medium">
                    • <strong>Total Baris File:</strong> {importResult.totalRowsInFile.toLocaleString('id-ID')} baris (sampai baris data pemilih terakhir).<br />
                    • <strong>Baris Header / Judul Kolom:</strong> {importResult.nonDataRowsCount.toLocaleString('id-ID')} baris (dilewati otomatis).<br />
                    • <strong>Pemilih Baru Masuk DPS:</strong> {importResult.inserted.toLocaleString('id-ID')} orang (NIK unik berbeda).<br />
                    • <strong>Data Ganda di File (Diperbarui):</strong> {importResult.updated.toLocaleString('id-ID')} baris (NIK duplikat disinkronkan).<br />
                    • <strong>Data Terlewat (Perlu Dilengkapi):</strong> {importResult.skipped.toLocaleString('id-ID')} baris (NIK/nama tidak lengkap).
                  </p>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                  {allSkippedRows.length > 0 && (
                    <button
                      type="button"
                      onClick={handleFinishAndOpenTerlewat}
                      className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-[#FF9600] hover:bg-[#E07700] text-white font-black text-xs uppercase tracking-wider border-b-4 border-[#C86600] active:border-b-0 active:translate-y-1 transition-all shadow-md cursor-pointer inline-flex items-center justify-center gap-2"
                    >
                      <ArrowRight className="w-4 h-4 shrink-0 stroke-[2.5]" />
                      <span>Lihat & Lengkapi Data Terlewat ({allSkippedRows.length})</span>
                    </button>
                  )}

                  {allSkippedRows.length > 0 && (
                    <button
                      type="button"
                      onClick={handleDownloadSkippedReport}
                      className="w-full sm:w-auto px-5 py-3.5 rounded-2xl bg-white hover:bg-slate-50 text-slate-700 font-black text-xs uppercase tracking-wider border-2 border-slate-200 active:translate-y-0.5 transition-all shadow-xs cursor-pointer inline-flex items-center justify-center gap-2"
                    >
                      <FileDown className="w-4 h-4 shrink-0 text-amber-600" />
                      <span>Unduh Laporan Terlewat ({allSkippedRows.length})</span>
                    </button>
                  )}

                  {duplicateInParsing.length > 0 && (
                    <button
                      type="button"
                      onClick={handleFinishAndOpenGanda}
                      className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-[#1CB0F6] hover:bg-[#189ddb] text-white font-black text-xs uppercase tracking-wider border-b-4 border-[#1899D6] active:border-b-0 active:translate-y-1 transition-all shadow-md cursor-pointer inline-flex items-center justify-center gap-2"
                    >
                      <Copy className="w-4 h-4 shrink-0 stroke-[2.5]" />
                      <span>Buka Tab Data Ganda ({duplicateInParsing.length})</span>
                    </button>
                  )}

                  {duplicateInParsing.length > 0 && (
                    <button
                      type="button"
                      onClick={handleDownloadDuplicateReport}
                      className="w-full sm:w-auto px-5 py-3.5 rounded-2xl bg-white hover:bg-slate-50 text-[#1899D6] font-black text-xs uppercase tracking-wider border-2 border-[#1CB0F6]/40 active:translate-y-0.5 transition-all shadow-xs cursor-pointer inline-flex items-center justify-center gap-2"
                    >
                      <FileDown className="w-4 h-4 shrink-0 text-[#1CB0F6]" />
                      <span>Unduh NIK Ganda ({duplicateInParsing.length})</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={handleFinishAndReload}
                    className={`w-full sm:w-auto px-6 py-3.5 rounded-2xl font-black text-xs uppercase tracking-wider active:translate-y-1 transition-all shadow-xs cursor-pointer inline-flex items-center justify-center gap-2 ${
                      allSkippedRows.length > 0
                        ? 'bg-white hover:bg-slate-100 text-slate-700 border-2 border-slate-200'
                        : 'bg-[#58CC02] hover:bg-[#4ebb02] text-white border-b-4 border-[#46A302]'
                    }`}
                  >
                    <RefreshCw className="w-4 h-4 shrink-0" />
                    <span>Selesai & Muat Ulang</span>
                  </button>
                </div>

              </div>

              {/* Panel Detail Baris Dilewati + Fitur Koreksi Manual */}
              {allSkippedRows.length > 0 && (
                <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl sm:rounded-3xl overflow-hidden min-w-0 shadow-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 sm:p-4 text-left gap-3 border-b-2 border-amber-200 bg-amber-100/60">
                    <div className="flex items-start sm:items-center gap-2.5 text-amber-900 min-w-0">
                      <AlertTriangle className="w-5 h-5 shrink-0 text-amber-600 mt-0.5 sm:mt-0" />
                      <div>
                        <span className="text-xs sm:text-sm font-black uppercase tracking-wider block">
                          Terdapat {allSkippedRows.length} Data Pemilih yang Perlu Dilengkapi
                        </span>
                        <span className="text-[11px] text-amber-800 font-medium">
                          Anda dapat melengkapi NIK atau nama secara manual satu per satu tanpa harus mengulang import Excel.
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleOpenCorrection(allSkippedRows[0])}
                        className="px-3.5 py-2 bg-[#58CC02] hover:bg-[#4ebb02] text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-xs border-b-2 border-[#46A302] active:translate-y-0.5 cursor-pointer"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Mulai Lengkapi</span>
                      </button>
                      <button
                        type="button"
                        onClick={handleDownloadSkippedReport}
                        className="px-3 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1 shadow-xs cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Unduh Excel</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowSkippedDetail(!showSkippedDetail)}
                        className="px-3 py-2 bg-white border border-amber-300 hover:bg-amber-50 text-amber-800 rounded-xl text-xs font-black uppercase cursor-pointer"
                      >
                        {showSkippedDetail ? 'Tutup Tabel' : 'Buka Tabel'}
                      </button>
                    </div>
                  </div>

                  {/* Tabel Daftar Baris Terlewat dengan Tombol Koreksi */}
                  {showSkippedDetail && (
                    <div className="overflow-x-auto max-h-80">
                      <table className="w-full text-left text-xs min-w-[620px]">
                        <thead className="bg-amber-100 text-amber-900 font-black text-[10px] uppercase sticky top-0 border-b border-amber-200">
                          <tr>
                            <th className="py-2.5 px-3">No. Baris Excel</th>
                            <th className="py-2.5 px-3">NIK Terdeteksi</th>
                            <th className="py-2.5 px-3">Nama Pemilih</th>
                            <th className="py-2.5 px-3">Alasan Dilewati</th>
                            <th className="py-2.5 px-3 text-center">Tindakan</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-amber-200/70 bg-white">
                          {allSkippedRows.map((r, idx) => (
                            <tr key={idx} className="hover:bg-amber-50/80 transition-colors">
                              <td className="py-2.5 px-3 font-bold text-amber-800 whitespace-nowrap">Baris #{r.rowNumber}</td>
                              <td className="py-2.5 px-3 font-mono text-slate-700 whitespace-nowrap">
                                <span className="px-2 py-0.5 rounded-lg bg-slate-100 font-bold text-xs">{r.nik}</span>
                              </td>
                              <td className="py-2.5 px-3 font-black text-slate-900 uppercase">{r.nama}</td>
                              <td className="py-2.5 px-3 text-amber-700 font-bold text-[11px]">{r.reason}</td>
                              <td className="py-2.5 px-3 text-center whitespace-nowrap">
                                <button
                                  type="button"
                                  onClick={() => handleOpenCorrection(r)}
                                  className="px-3.5 py-1.5 bg-[#58CC02] hover:bg-[#4ebb02] text-white font-black text-xs uppercase tracking-wider rounded-xl border-b-2 border-[#46A302] active:border-b-0 active:translate-y-0.5 shadow-xs transition inline-flex items-center gap-1.5 cursor-pointer"
                                  title="Koreksi data ini dan masukkan ke DPS"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                  <span>Lengkapi Data</span>
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* Panel Detail Data Ganda yang Diperbarui */}
              {duplicateInParsing.length > 0 && (
                <div className="bg-[#EBF7FD] border-2 border-[#1CB0F6]/40 rounded-2xl sm:rounded-3xl overflow-hidden min-w-0 shadow-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 sm:p-4 text-left gap-3 border-b-2 border-[#1CB0F6]/20 bg-sky-100/60">
                    <div className="flex items-start sm:items-center gap-2.5 text-slate-800 min-w-0">
                      <Copy className="w-5 h-5 shrink-0 text-[#1899D6] mt-0.5 sm:mt-0" />
                      <div>
                        <span className="text-xs sm:text-sm font-black text-[#1899D6] uppercase tracking-wider block">
                          {duplicateInParsing.length.toLocaleString('id-ID')} Data Pemilih NIK Ganda Telah Disinkronkan
                        </span>
                        <span className="text-[11px] text-slate-600 font-medium">
                          Data NIK duplikat di file Excel telah disinkronkan ke daftar DPS tanpa menciptakan data ganda.
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={handleDownloadDuplicateReport}
                        className="px-3 py-2 bg-[#1CB0F6] hover:bg-[#1899D6] text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1 shadow-xs cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Unduh Excel</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowPostImportDuplicateDetail(!showPostImportDuplicateDetail)}
                        className="px-3 py-2 bg-white border border-[#1CB0F6]/40 hover:bg-sky-50 text-[#1899D6] rounded-xl text-xs font-black uppercase cursor-pointer"
                      >
                        {showPostImportDuplicateDetail ? 'Tutup Tabel' : 'Buka Tabel'}
                      </button>
                    </div>
                  </div>

                  {/* Tabel Detail Data Ganda Pasca Import */}
                  {showPostImportDuplicateDetail && (
                    <div className="p-3 bg-white space-y-2.5">
                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
                        <div className="relative flex-1">
                          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                          <input
                            type="text"
                            value={duplicateSearchQuery}
                            onChange={(e) => setDuplicateSearchQuery(e.target.value)}
                            placeholder="Cari NIK, Nama Pemilih, Dusun, atau Baris..."
                            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-[#1CB0F6] focus:ring-1 focus:ring-[#1CB0F6]"
                          />
                        </div>
                        <span className="text-[11px] font-bold text-slate-500 whitespace-nowrap text-right">
                          Menampilkan {filteredDuplicateRows.length} dari {duplicateInParsing.length} baris ganda
                        </span>
                      </div>

                      <div className="overflow-x-auto max-h-72 rounded-xl border border-slate-200">
                        <table className="w-full text-left text-xs min-w-[700px]">
                          <thead className="bg-sky-100/90 text-sky-950 font-black text-[10px] uppercase sticky top-0 border-b border-sky-200 z-10">
                            <tr>
                              <th className="py-2.5 px-3 whitespace-nowrap">Pasangan Baris Kembar</th>
                              <th className="py-2.5 px-3 whitespace-nowrap">NIK (16 Digit)</th>
                              <th className="py-2.5 px-3">Data Baris Asal (Pertama)</th>
                              <th className="py-2.5 px-3">Data Baris Ganda (Duplikat)</th>
                              <th className="py-2.5 px-3 text-center whitespace-nowrap">Status Analisis</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-sky-100 bg-white">
                            {filteredDuplicateRows.length === 0 ? (
                              <tr>
                                <td colSpan={5} className="py-8 text-center text-slate-400 font-bold">
                                  Tidak ada data ganda yang cocok dengan pencarian "{duplicateSearchQuery}".
                                </td>
                              </tr>
                            ) : (
                              filteredDuplicateRows.map((r, idx) => {
                                const isExactSameName = r.nama.trim().toUpperCase() === r.firstSeenName.trim().toUpperCase();
                                return (
                                  <tr key={idx} className="hover:bg-sky-50/70 transition-colors">
                                    {/* Pasangan Baris Kembar */}
                                    <td className="py-3 px-3 whitespace-nowrap align-middle">
                                      <div className="flex items-center gap-1.5 font-black text-xs">
                                        <span className="px-2 py-0.5 rounded-lg bg-sky-100 text-[#1899D6] border border-sky-200 shadow-2xs">
                                          Baris #{r.firstSeenRowNumber}
                                        </span>
                                        <span className="text-slate-400 font-black">⟷</span>
                                        <span className="px-2 py-0.5 rounded-lg bg-amber-100 text-amber-800 border border-amber-200 shadow-2xs">
                                          Baris #{r.rowNumber}
                                        </span>
                                      </div>
                                      <span className="text-[10px] text-slate-500 font-bold block mt-1">
                                        Baris #{r.rowNumber} kembar dengan Baris #{r.firstSeenRowNumber}
                                      </span>
                                    </td>

                                    {/* NIK */}
                                    <td className="py-3 px-3 whitespace-nowrap font-mono align-middle">
                                      <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 font-bold text-xs border border-slate-200 block text-center">
                                        {r.nik}
                                      </span>
                                    </td>

                                    {/* Data Baris Asal */}
                                    <td className="py-3 px-3 align-middle">
                                      <div className="space-y-0.5">
                                        <div className="flex items-center gap-1.5">
                                          <span className="w-2 h-2 rounded-full bg-[#1CB0F6] shrink-0"></span>
                                          <span className="font-black text-slate-900 uppercase text-xs">{r.firstSeenName}</span>
                                        </div>
                                        <div className="text-[10px] text-slate-500 font-medium pl-3.5 flex items-center gap-2 flex-wrap">
                                          <span className="font-bold text-[#1899D6]">TPS {r.firstSeenTps || '-'}</span>
                                          <span>•</span>
                                          <span>{r.firstSeenDusun || '-'} {r.firstSeenRt ? `RT ${r.firstSeenRt}` : ''} {r.firstSeenRw ? `RW ${r.firstSeenRw}` : ''}</span>
                                        </div>
                                      </div>
                                    </td>

                                    {/* Data Baris Ganda */}
                                    <td className="py-3 px-3 align-middle">
                                      <div className="space-y-0.5">
                                        <div className="flex items-center gap-1.5">
                                          <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0"></span>
                                          <span className="font-black text-slate-900 uppercase text-xs">{r.nama}</span>
                                        </div>
                                        <div className="text-[10px] text-slate-500 font-medium pl-3.5 flex items-center gap-2 flex-wrap">
                                          <span className="font-bold text-amber-700">TPS {r.tps || '-'}</span>
                                          <span>•</span>
                                          <span>{r.dusun || '-'} {r.rt ? `RT ${r.rt}` : ''} {r.rw ? `RW ${r.rw}` : ''}</span>
                                        </div>
                                      </div>
                                    </td>

                                    {/* Status Analisis */}
                                    <td className="py-3 px-3 text-center whitespace-nowrap align-middle">
                                      {isExactSameName ? (
                                        <span className="px-2.5 py-1 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 font-black text-[10px] uppercase inline-flex items-center gap-1">
                                          <Check className="w-3 h-3 stroke-[3]" />
                                          <span>100% Identik</span>
                                        </span>
                                      ) : (
                                        <span className="px-2.5 py-1 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 font-black text-[10px] uppercase inline-flex items-center gap-1" title="Data baris ganda akan memperbarui data sebelumnya">
                                          <AlertTriangle className="w-3 h-3 stroke-[2.5]" />
                                          <span>Beda Nama (Diperbarui)</span>
                                        </span>
                                      )}
                                    </td>
                                  </tr>
                                );
                              })
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <>
              {/* Info banner & Download Template */}
              <div className="bg-slate-50 border-2 border-slate-200 rounded-2xl sm:rounded-3xl p-3 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4 min-w-0">
                <div className="flex items-start gap-2.5 sm:gap-3 min-w-0">
                  <Info className="w-5 h-5 text-[#1CB0F6] shrink-0 mt-0.5" />
                  <div className="space-y-1 min-w-0">
                    <p className="text-xs font-black text-slate-800">
                      Sesuai Struktur Kolom Foto Panitia:
                    </p>
                    <p className="text-[10px] sm:text-[11px] text-slate-600 font-bold leading-relaxed break-words">
                      NO DPT • NO • NIK (16 Digit) • NAMA PEMILIH • JENIS KELAMIN • LAHIR (TEMPAT, TANGGAL) • ALAMAT (DUSUN, RT, RW) • TPS • STATUS • KETERANGAN
                    </p>
                  </div>
                </div>

                <a
                  href="/admin/voters/template-excel"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full md:w-auto px-3.5 py-2.5 sm:px-4 sm:py-2.5 rounded-xl sm:rounded-2xl bg-white hover:bg-slate-100 text-[#1CB0F6] font-black text-xs uppercase tracking-wider border-2 border-[#1CB0F6]/30 hover:border-[#1CB0F6] active:translate-y-0.5 transition-all flex items-center justify-center gap-2 shrink-0 shadow-xs text-center"
                >
                  <Download className="w-4 h-4 shrink-0" />
                  <span>Unduh Contoh Format Excel</span>
                </a>
              </div>

              {/* Tab Pemilihan Mode */}
              <div className="grid grid-cols-2 gap-1.5 sm:gap-2 p-1 bg-slate-100 rounded-2xl border-2 border-slate-200">
                <button
                  type="button"
                  onClick={() => setActiveTab('chunk')}
                  className={`py-2 px-2 sm:px-4 text-[11px] sm:text-xs font-black uppercase tracking-wider transition-all rounded-xl cursor-pointer flex items-center justify-center gap-1 sm:gap-1.5 text-center ${
                    activeTab === 'chunk'
                      ? 'bg-white text-[#58CC02] shadow-sm border border-slate-200/60'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <Zap className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">Mode Cepat (Rekomendasi)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('direct')}
                  className={`py-2 px-2 sm:px-4 text-[11px] sm:text-xs font-black uppercase tracking-wider transition-all rounded-xl cursor-pointer flex items-center justify-center gap-1 sm:gap-1.5 text-center ${
                    activeTab === 'direct'
                      ? 'bg-white text-[#1CB0F6] shadow-sm border border-slate-200/60'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <FolderUp className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">Upload Utuh</span>
                </button>
              </div>

              {/* Area File Dropzone */}
              <div className="min-w-0">
                <label className="block text-xs font-black uppercase text-slate-700 mb-2">
                  Pilih Berkas Excel DPS (.xlsx / .xls / .csv)
                </label>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-2xl sm:rounded-3xl p-4 sm:p-8 text-center cursor-pointer transition-all ${
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
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-white border-2 border-slate-200 flex items-center justify-center text-slate-600 shadow-sm">
                      <Upload className="w-5 h-5 sm:w-6 sm:h-6 text-[#58CC02]" />
                    </div>
                    {selectedFile ? (
                      <div className="space-y-1 max-w-full px-2">
                        <span className="text-xs sm:text-sm font-black text-slate-900 block truncate">
                          {selectedFile.name}
                        </span>
                        <span className="text-[11px] sm:text-xs text-slate-500 font-bold block">
                          {(selectedFile.size / 1024).toFixed(1)} KB • Klik untuk ganti berkas
                        </span>
                      </div>
                    ) : (
                      <div className="space-y-1 max-w-full px-2">
                        <span className="text-xs sm:text-sm font-black text-slate-800 block">
                          Tarik berkas Excel ke sini atau klik untuk memilih
                        </span>
                        <span className="text-[10px] sm:text-xs text-slate-400 font-bold block">
                          Format: Microsoft Excel (.xlsx, .xls) atau CSV (.csv)
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Indikator Parsing */}
              {isParsing && (
                <div className="flex items-center justify-center gap-2.5 py-3 text-[#58CC02] text-center">
                  <RefreshCw className="w-4 h-4 animate-spin shrink-0" />
                  <span className="text-xs font-black uppercase tracking-wider">
                    Sedang membaca struktur tabel dan baris pemilih...
                  </span>
                </div>
              )}

              {/* Pesan Kesalahan Parse */}
              {parseError && (
                <div className="bg-[#FFE5E5] border-2 border-[#EA2B2B] rounded-2xl p-3 sm:p-4 flex items-start gap-2.5 sm:gap-3 text-[#EA2B2B]">
                  <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                  <div className="text-xs font-bold leading-relaxed">{parseError}</div>
                </div>
              )}

              {directUploadError && (
                <div className="bg-[#FFE5E5] border-2 border-[#EA2B2B] rounded-2xl p-3 sm:p-4 flex items-start gap-2.5 sm:gap-3 text-[#EA2B2B]">
                  <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                  <div className="text-xs font-bold leading-relaxed">{directUploadError}</div>
                </div>
              )}

              {/* Opsi Pengaturan Import */}
              <div className="bg-slate-50 border-2 border-slate-200 rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 space-y-3 min-w-0">
                <span className="text-[11px] sm:text-xs font-black uppercase text-slate-700 tracking-wider block">
                  Opsi Import Data
                </span>

                <div className="flex items-start gap-2.5 sm:gap-3">
                  <input
                    type="checkbox"
                    id="updateExisting"
                    checked={updateExisting}
                    onChange={(e) => setUpdateExisting(e.target.checked)}
                    className="w-4 h-4 rounded text-[#58CC02] focus:ring-[#58CC02] border-slate-300 cursor-pointer mt-0.5 shrink-0"
                  />
                  <label htmlFor="updateExisting" className="text-[11px] sm:text-xs font-bold text-slate-700 cursor-pointer leading-snug">
                    Perbarui data jika NIK sudah ada di database (Update data ganda)
                  </label>
                </div>

                <div className="flex items-start gap-2.5 sm:gap-3 pt-1">
                  <input
                    type="checkbox"
                    id="resetFirst"
                    checked={resetFirst}
                    onChange={(e) => setResetFirst(e.target.checked)}
                    className="w-4 h-4 rounded text-[#EA2B2B] focus:ring-[#EA2B2B] border-slate-300 cursor-pointer mt-0.5 shrink-0"
                  />
                  <div className="min-w-0">
                    <label htmlFor="resetFirst" className="text-[11px] sm:text-xs font-black text-[#EA2B2B] cursor-pointer leading-snug block">
                      Hapus / Kosongkan seluruh data DPS lama sebelum mengimpor file ini
                    </label>
                    <p className="text-[10px] text-slate-500 font-bold mt-0.5 leading-tight">
                      Gunakan hanya jika Anda ingin mengganti total daftar pemilih dari awal.
                    </p>
                  </div>
                </div>
              </div>

              {/* MODE 1: Preview Data & Chunk Import */}
              {activeTab === 'chunk' && fileStats && (
                <div className="space-y-3 sm:space-y-4 min-w-0">
                  {/* Statistik Data Terdeteksi */}
                  <div className="bg-white border-2 border-slate-200 rounded-2xl p-3.5 sm:p-4 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#58CC02] animate-pulse shrink-0"></span>
                        <span className="text-xs font-black text-slate-900">
                          Hasil Deteksi File Excel:
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowPreview(!showPreview)}
                        className="self-start sm:self-auto px-3 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5 shrink-0" />
                        <span>{showPreview ? 'Tutup Preview' : 'Lihat Preview'}</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 text-center">
                      <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                        <span className="text-[10px] text-slate-400 font-black uppercase block">Baris di File</span>
                        <span className="text-sm sm:text-base font-black text-slate-800">{fileStats.totalRowsInFile.toLocaleString('id-ID')}</span>
                        <span className="text-[10px] text-slate-400 block mt-0.5">Sampai data terakhir</span>
                      </div>
                      <div className="p-2.5 bg-purple-50/70 rounded-xl border border-purple-200">
                        <span className="text-[10px] text-purple-700 font-black uppercase block">Header / Judul</span>
                        <span className="text-sm sm:text-base font-black text-purple-700">{fileStats.headerAndTitleRows.toLocaleString('id-ID')}</span>
                        <span className="text-[10px] text-purple-600/80 block mt-0.5">Dilewati otomatis</span>
                      </div>
                      <div className="p-2.5 bg-[#E5F9D2] rounded-xl border border-[#58CC02]/40">
                        <span className="text-[10px] text-[#46A302] font-black uppercase block">Pemilih Unik Baru</span>
                        <span className="text-sm sm:text-base font-black text-[#46A302]">{fileStats.uniqueVotersCount.toLocaleString('id-ID')}</span>
                        <span className="text-[10px] text-[#46A302]/80 block mt-0.5">NIK 16 digit berbeda</span>
                      </div>
                      <div className={`p-2.5 rounded-xl border ${fileStats.duplicateVotersCount > 0 ? 'bg-[#EBF7FD] border-[#1CB0F6]/40' : 'bg-slate-50 border-slate-200'}`}>
                        <span className={`text-[10px] font-black uppercase block ${fileStats.duplicateVotersCount > 0 ? 'text-[#1899D6]' : 'text-slate-400'}`}>Data Ganda di File</span>
                        <span className={`text-sm sm:text-base font-black ${fileStats.duplicateVotersCount > 0 ? 'text-[#1899D6]' : 'text-slate-600'}`}>{fileStats.duplicateVotersCount.toLocaleString('id-ID')}</span>
                        <span className="text-[10px] text-[#1899D6]/80 block mt-0.5">Diperbarui otomatis</span>
                      </div>
                      <div className={`p-2.5 rounded-xl border col-span-2 sm:col-span-1 ${fileStats.invalidVotersCount > 0 ? 'bg-amber-50 border-amber-300' : 'bg-slate-50 border-slate-200'}`}>
                        <span className={`text-[10px] font-black uppercase block ${fileStats.invalidVotersCount > 0 ? 'text-amber-700' : 'text-slate-400'}`}>Dilewati (Data Kurang)</span>
                        <span className={`text-sm sm:text-base font-black ${fileStats.invalidVotersCount > 0 ? 'text-amber-700' : 'text-slate-600'}`}>{fileStats.invalidVotersCount.toLocaleString('id-ID')}</span>
                        <span className="text-[10px] text-amber-600 block mt-0.5">Bisa dikoreksi manual</span>
                      </div>
                    </div>
                  </div>

                  {/* Warning Panel Baris Bermasalah saat Parsing + Tombol Koreksi */}
                  {showSkippedWarning && skippedInParsing.length > 0 && (
                    <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl overflow-hidden min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 gap-2 border-b border-amber-200 bg-amber-100/60">
                        <div className="flex items-center gap-2 text-amber-900 min-w-0">
                          <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600" />
                          <span className="text-xs font-black">
                            {skippedInParsing.length} baris dilewati (Klik "Koreksi" untuk memperbaiki & menambahkan manual)
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setShowSkippedWarning(!showSkippedWarning)}
                          className="text-xs font-black text-amber-800 px-2 py-1 rounded-lg bg-white border border-amber-300 cursor-pointer self-start sm:self-auto"
                        >
                          {showSkippedWarning ? '▲ Sembunyikan' : '▼ Buka Rincian'}
                        </button>
                      </div>

                      <div className="overflow-x-auto max-h-56">
                        <table className="w-full text-left text-xs min-w-[550px] bg-white">
                          <thead className="bg-amber-100 text-amber-800 font-black text-[10px] uppercase sticky top-0">
                            <tr>
                              <th className="py-2 px-3">Baris</th>
                              <th className="py-2 px-3">NIK</th>
                              <th className="py-2 px-3">Nama</th>
                              <th className="py-2 px-3">Alasan Dilewati</th>
                              <th className="py-2 px-3 text-center">Aksi</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-amber-100">
                            {skippedInParsing.map((r, idx) => (
                              <tr key={idx} className="hover:bg-amber-50/50">
                                <td className="py-2 px-3 font-bold text-amber-800 whitespace-nowrap">#{r.rowNumber}</td>
                                <td className="py-2 px-3 font-mono text-slate-600 whitespace-nowrap">{r.nik}</td>
                                <td className="py-2 px-3 font-bold text-slate-800 uppercase">{r.nama}</td>
                                <td className="py-2 px-3 text-amber-700 font-medium">{r.reason}</td>
                                <td className="py-2 px-3 text-center whitespace-nowrap">
                                  <button
                                    type="button"
                                    onClick={() => handleOpenCorrection(r)}
                                    className="px-2.5 py-1 bg-[#58CC02] hover:bg-[#4ebb02] text-white font-black text-[10px] uppercase tracking-wider rounded-lg shadow-2xs transition inline-flex items-center gap-1 cursor-pointer"
                                  >
                                    <Edit3 className="w-3 h-3" />
                                    <span>Koreksi</span>
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* Panel Rincian Data Ganda di File Excel Sebelum Import */}
                  {duplicateInParsing.length > 0 && (
                    <div className="bg-[#EBF7FD] border-2 border-[#1CB0F6]/40 rounded-2xl overflow-hidden min-w-0 shadow-xs">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 gap-2 border-b border-[#1CB0F6]/30 bg-sky-100/60">
                        <div className="flex items-start sm:items-center gap-2.5 text-slate-800 min-w-0">
                          <Copy className="w-4 h-4 shrink-0 text-[#1899D6] mt-0.5 sm:mt-0" />
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="text-xs font-black text-[#1899D6] uppercase tracking-wider">
                                {duplicateInParsing.length.toLocaleString('id-ID')} Data NIK Ganda di File Excel
                              </span>
                              <span className="px-2 py-0.5 rounded-full bg-[#1CB0F6]/20 text-[#1899D6] font-extrabold text-[10px]">
                                Otomatis Disinkronkan
                              </span>
                            </div>
                            <span className="text-[11px] text-slate-600 font-medium block">
                              NIK sama dengan baris sebelumnya. Sistem akan memperbarui data tanpa membuat duplikat di DPS.
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto">
                          <button
                            type="button"
                            onClick={handleDownloadDuplicateReport}
                            className="px-2.5 py-1 bg-white hover:bg-slate-50 text-[#1899D6] border border-[#1CB0F6]/40 rounded-lg text-xs font-black uppercase tracking-wider flex items-center gap-1 shadow-2xs cursor-pointer"
                            title="Unduh laporan data ganda dalam format Excel"
                          >
                            <FileDown className="w-3 h-3" />
                            <span>Unduh Excel ({duplicateInParsing.length})</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setShowDuplicateWarning(!showDuplicateWarning)}
                            className="text-xs font-black text-[#1899D6] px-2.5 py-1 rounded-lg bg-white border border-[#1CB0F6]/40 hover:bg-sky-50 cursor-pointer"
                          >
                            {showDuplicateWarning ? '▲ Sembunyikan' : '▼ Buka Preview Ganda'}
                          </button>
                        </div>
                      </div>

                      {/* Tabel Preview Data Ganda */}
                      {showDuplicateWarning && (
                        <div className="p-3 bg-white space-y-2.5">
                          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
                            <div className="relative flex-1">
                              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                              <input
                                type="text"
                                value={duplicateSearchQuery}
                                onChange={(e) => setDuplicateSearchQuery(e.target.value)}
                                placeholder="Cari NIK, Nama Pemilih, Dusun, atau Baris..."
                                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-[#1CB0F6] focus:ring-1 focus:ring-[#1CB0F6]"
                              />
                            </div>
                            <span className="text-[11px] font-bold text-slate-500 whitespace-nowrap text-right">
                              Menampilkan {filteredDuplicateRows.length} dari {duplicateInParsing.length} baris ganda
                            </span>
                          </div>

                          <div className="overflow-x-auto max-h-60 rounded-xl border border-slate-200">
                            <table className="w-full text-left text-xs min-w-[700px]">
                              <thead className="bg-sky-100/90 text-sky-950 font-black text-[10px] uppercase sticky top-0 border-b border-sky-200 z-10">
                                <tr>
                                  <th className="py-2.5 px-3 whitespace-nowrap">Pasangan Baris Kembar</th>
                                  <th className="py-2.5 px-3 whitespace-nowrap">NIK (16 Digit)</th>
                                  <th className="py-2.5 px-3">Data Baris Asal (Pertama)</th>
                                  <th className="py-2.5 px-3">Data Baris Ganda (Duplikat)</th>
                                  <th className="py-2.5 px-3 text-center whitespace-nowrap">Status Analisis</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-sky-100 bg-white">
                                {filteredDuplicateRows.length === 0 ? (
                                  <tr>
                                    <td colSpan={5} className="py-8 text-center text-slate-400 font-bold">
                                      Tidak ada data ganda yang cocok dengan pencarian "{duplicateSearchQuery}".
                                    </td>
                                  </tr>
                                ) : (
                                  filteredDuplicateRows.map((r, idx) => {
                                    const isExactSameName = r.nama.trim().toUpperCase() === r.firstSeenName.trim().toUpperCase();
                                    return (
                                      <tr key={idx} className="hover:bg-sky-50/70 transition-colors">
                                        {/* Pasangan Baris Kembar */}
                                        <td className="py-3 px-3 whitespace-nowrap align-middle">
                                          <div className="flex items-center gap-1.5 font-black text-xs">
                                            <span className="px-2 py-0.5 rounded-lg bg-sky-100 text-[#1899D6] border border-sky-200 shadow-2xs">
                                              Baris #{r.firstSeenRowNumber}
                                            </span>
                                            <span className="text-slate-400 font-black">⟷</span>
                                            <span className="px-2 py-0.5 rounded-lg bg-amber-100 text-amber-800 border border-amber-200 shadow-2xs">
                                              Baris #{r.rowNumber}
                                            </span>
                                          </div>
                                          <span className="text-[10px] text-slate-500 font-bold block mt-1">
                                            Baris #{r.rowNumber} kembar dengan Baris #{r.firstSeenRowNumber}
                                          </span>
                                        </td>

                                        {/* NIK */}
                                        <td className="py-3 px-3 whitespace-nowrap font-mono align-middle">
                                          <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 font-bold text-xs border border-slate-200 block text-center">
                                            {r.nik}
                                          </span>
                                        </td>

                                        {/* Data Baris Asal */}
                                        <td className="py-3 px-3 align-middle">
                                          <div className="space-y-0.5">
                                            <div className="flex items-center gap-1.5">
                                              <span className="w-2 h-2 rounded-full bg-[#1CB0F6] shrink-0"></span>
                                              <span className="font-black text-slate-900 uppercase text-xs">{r.firstSeenName}</span>
                                            </div>
                                            <div className="text-[10px] text-slate-500 font-medium pl-3.5 flex items-center gap-2 flex-wrap">
                                              <span className="font-bold text-[#1899D6]">TPS {r.firstSeenTps || '-'}</span>
                                              <span>•</span>
                                              <span>{r.firstSeenDusun || '-'} {r.firstSeenRt ? `RT ${r.firstSeenRt}` : ''} {r.firstSeenRw ? `RW ${r.firstSeenRw}` : ''}</span>
                                            </div>
                                          </div>
                                        </td>

                                        {/* Data Baris Ganda */}
                                        <td className="py-3 px-3 align-middle">
                                          <div className="space-y-0.5">
                                            <div className="flex items-center gap-1.5">
                                              <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0"></span>
                                              <span className="font-black text-slate-900 uppercase text-xs">{r.nama}</span>
                                            </div>
                                            <div className="text-[10px] text-slate-500 font-medium pl-3.5 flex items-center gap-2 flex-wrap">
                                              <span className="font-bold text-amber-700">TPS {r.tps || '-'}</span>
                                              <span>•</span>
                                              <span>{r.dusun || '-'} {r.rt ? `RT ${r.rt}` : ''} {r.rw ? `RW ${r.rw}` : ''}</span>
                                            </div>
                                          </div>
                                        </td>

                                        {/* Status Analisis */}
                                        <td className="py-3 px-3 text-center whitespace-nowrap align-middle">
                                          {isExactSameName ? (
                                            <span className="px-2.5 py-1 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 font-black text-[10px] uppercase inline-flex items-center gap-1">
                                              <Check className="w-3 h-3 stroke-[3]" />
                                              <span>100% Identik</span>
                                            </span>
                                          ) : (
                                            <span className="px-2.5 py-1 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 font-black text-[10px] uppercase inline-flex items-center gap-1" title="Data baris ganda akan memperbarui data sebelumnya">
                                              <AlertTriangle className="w-3 h-3 stroke-[2.5]" />
                                              <span>Beda Nama (Diperbarui)</span>
                                            </span>
                                          )}
                                        </td>
                                      </tr>
                                    );
                                  })
                                )}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Tabel Preview Baris Pertama */}
                  {showPreview && validParsedRows.length > 0 && (
                    <div className="border-2 border-slate-200 rounded-2xl overflow-hidden shadow-xs min-w-0">
                      <div className="bg-slate-100 px-3 sm:px-4 py-2 border-b-2 border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                        <span className="text-[11px] font-black uppercase text-slate-600 tracking-wider">
                          Preview 5 Baris Pertama Terdeteksi
                        </span>
                        <span className="text-[10px] font-bold text-slate-400">
                          (Geser tabel ke samping untuk melihat seluruh kolom)
                        </span>
                      </div>
                      <div className="overflow-x-auto max-h-60">
                        <table className="w-full text-left text-xs border-collapse min-w-[720px]">
                          <thead className="bg-slate-50 text-slate-500 font-black text-[10px] uppercase border-b border-slate-200 sticky top-0">
                            <tr>
                              <th className="py-2.5 px-3 text-center">No. DPT</th>
                              <th className="py-2.5 px-3">Baris Excel</th>
                              <th className="py-2.5 px-3">NIK (16 Digit)</th>
                              <th className="py-2.5 px-3">Nama Pemilih</th>
                              <th className="py-2.5 px-3 text-center">JK</th>
                              <th className="py-2.5 px-3">Tempat / Tgl Lahir</th>
                              <th className="py-2.5 px-3">Dusun / RT / RW</th>
                              <th className="py-2.5 px-3">TPS</th>
                              <th className="py-2.5 px-3 text-center">Status</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 font-medium bg-white">
                            {validParsedRows.slice(0, 5).map((row, idx) => (
                              <tr key={idx} className="hover:bg-slate-50">
                                <td className="py-2.5 px-3 text-center whitespace-nowrap">
                                  <span className="font-mono font-black px-2 py-0.5 rounded-lg text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-2xs">
                                    #{row.no_dpt || (idx + 1)}
                                  </span>
                                </td>
                                <td className="py-2.5 px-3 font-bold text-slate-400 whitespace-nowrap">
                                  Baris #{row.rowNumber}
                                </td>
                                <td className="py-2.5 px-3">
                                  <span className="font-mono font-bold px-2 py-0.5 rounded-lg text-[11px] bg-slate-100 text-slate-800">
                                    {row.nik}
                                  </span>
                                </td>
                                <td className="py-2.5 px-3 font-black text-slate-900 uppercase">
                                  {row.nama}
                                </td>
                                <td className="py-2.5 px-3 text-center">
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
                                <td className="py-2.5 px-3 text-center">
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
                    <div className="space-y-2 bg-slate-50 border-2 border-slate-200 rounded-2xl p-3 sm:p-4">
                      <div className="flex items-center justify-between text-xs font-black">
                        <span className="text-slate-700 truncate pr-2">{currentChunkInfo}</span>
                        <span className="text-[#58CC02] shrink-0">{importProgress}%</span>
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
                <div className="p-3.5 sm:p-4 bg-slate-50 border-2 border-slate-200 rounded-2xl space-y-3 min-w-0">
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
                        <RefreshCw className="w-4 h-4 animate-spin shrink-0" />
                        <span className="truncate">Sedang Mengunggah & Memproses...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4 shrink-0" />
                        <span className="truncate">Upload & Proses Langsung di Server</span>
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
          <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-2.5 pt-3 sm:pt-4 border-t-2 border-slate-100 shrink-0">
            <button
              type="button"
              onClick={handleClose}
              className="w-full sm:w-auto px-5 py-2.5 rounded-2xl bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs uppercase tracking-wider border-2 border-slate-200 cursor-pointer text-center"
            >
              Batal
            </button>

            {activeTab === 'chunk' && (
              <button
                type="button"
                onClick={handleStartChunkImport}
                disabled={validParsedRows.length === 0 || isImporting}
                className="w-full sm:w-auto px-5 sm:px-6 py-3 sm:py-2.5 rounded-2xl bg-[#58CC02] hover:bg-[#4ebb02] text-white font-black text-xs uppercase tracking-wider border-b-4 border-[#46A302] active:border-b-0 active:translate-y-1 transition-all disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2 shadow-xs text-center"
              >
                {isImporting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin shrink-0" />
                    <span className="truncate">Mengimpor ({importProgress}%)...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 shrink-0" />
                    <span className="truncate">
                      Mulai Import ({fileStats?.uniqueVotersCount?.toLocaleString('id-ID') || validParsedRows.length.toLocaleString('id-ID')} Pemilih Unik{fileStats?.duplicateVotersCount ? ` & ${fileStats.duplicateVotersCount.toLocaleString('id-ID')} Update` : ''})
                    </span>
                  </>
                )}
              </button>
            )}
          </div>
        )}

      </div>

      {/* POPUP MODAL: KOREKSI & TAMBAHKAN MANUAL PEMILIH TERLEWAT */}
      {editingRow && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white border-2 border-b-4 border-slate-200 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Header Modal Koreksi */}
            <div className="p-4 sm:p-5 border-b-2 border-slate-100 bg-amber-50/80 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-[#58CC02] text-white flex items-center justify-center shadow-xs">
                  <Edit3 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm sm:text-base font-black text-slate-900">
                    Lengkapi Data Pemilih (Baris #{editingRow.rowNumber})
                  </h4>
                  <p className="text-[11px] text-amber-800 font-bold">
                    Tersisa {allSkippedRows.length} data pemilih yang perlu dilengkapi
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setEditingRow(null)}
                className="w-8 h-8 rounded-xl bg-white hover:bg-slate-100 text-slate-500 flex items-center justify-center cursor-pointer border border-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body Form Koreksi */}
            <form onSubmit={handleSaveCorrection} className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1 text-left">
              
              {/* Alert Alasan Kesalahan */}
              <div className="p-3 rounded-2xl bg-amber-100/70 border-2 border-amber-300/80 text-amber-900 text-xs font-bold leading-relaxed flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-700" />
                <div>
                  <span className="font-black block">Alasan Terlewat di Excel:</span>
                  <span>{editingRow.reason}</span>
                </div>
              </div>

              {/* Toast Error / Success */}
              {correctionErrorMsg && (
                <div className="p-3 rounded-2xl bg-red-100 text-red-700 border-2 border-red-300 text-xs font-bold">
                  {correctionErrorMsg}
                </div>
              )}

              {correctionSuccessMsg && (
                <div className="p-3 rounded-2xl bg-[#E5F9D2] text-[#2E6B01] border-2 border-[#58CC02] text-xs font-black flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#58CC02]" />
                  <span>{correctionSuccessMsg}</span>
                </div>
              )}

              {/* Field 1: NIK 16 Digit dengan Live Counter */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-black uppercase tracking-wider text-slate-700">
                    Nomor Induk Kependudukan (NIK):
                  </label>
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded-lg ${
                    editFormData.nik.replace(/\D/g, '').length === 16
                      ? 'bg-[#E5F9D2] text-[#46A302]'
                      : 'bg-amber-100 text-amber-700'
                  }`}>
                    {editFormData.nik.replace(/\D/g, '').length} / 16 Digit
                  </span>
                </div>
                <input
                  type="text"
                  maxLength={16}
                  value={editFormData.nik}
                  onChange={(e) => setEditFormData({ ...editFormData, nik: e.target.value.replace(/\D/g, '').slice(0, 16) })}
                  placeholder="Masukkan 16 digit NIK..."
                  className="w-full px-3.5 py-2.5 rounded-2xl border-2 border-slate-200 focus:border-[#58CC02] focus:ring-0 text-slate-900 font-mono font-bold text-sm tracking-wide"
                  required
                />
              </div>

              {/* Field 2: Nama Pemilih */}
              <div className="space-y-1">
                <label className="text-[11px] font-black uppercase tracking-wider text-slate-700">
                  Nama Lengkap Pemilih:
                </label>
                <input
                  type="text"
                  value={editFormData.nama}
                  onChange={(e) => setEditFormData({ ...editFormData, nama: e.target.value })}
                  placeholder="Nama pemilih sesuai KTP..."
                  className="w-full px-3.5 py-2.5 rounded-2xl border-2 border-slate-200 focus:border-[#58CC02] focus:ring-0 text-slate-900 font-bold text-sm uppercase"
                  required
                />
              </div>

              {/* Field 3: Jenis Kelamin & Lokasi TPS */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-black uppercase tracking-wider text-slate-700">
                    Jenis Kelamin:
                  </label>
                  <select
                    value={editFormData.jenis_kelamin}
                    onChange={(e) => setEditFormData({ ...editFormData, jenis_kelamin: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-2xl border-2 border-slate-200 focus:border-[#58CC02] focus:ring-0 text-slate-800 font-bold text-xs bg-white"
                  >
                    <option value="L">LAKI-LAKI (L)</option>
                    <option value="P">PEREMPUAN (P)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-black uppercase tracking-wider text-slate-700">
                    Lokasi TPS:
                  </label>
                  <select
                    value={editFormData.tps_id}
                    onChange={(e) => setEditFormData({ ...editFormData, tps_id: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-2xl border-2 border-slate-200 focus:border-[#58CC02] focus:ring-0 text-slate-800 font-bold text-xs bg-white"
                  >
                    {allTpsOptions.map((tps) => (
                      <option key={tps.id} value={tps.id}>
                        TPS {tps.nomor_tps} - {tps.dusun}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Field 4: Dusun, RT, RW */}
              <div className="grid grid-cols-3 gap-2">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-wider text-slate-700">
                    Dusun:
                  </label>
                  <input
                    type="text"
                    value={editFormData.dusun}
                    onChange={(e) => setEditFormData({ ...editFormData, dusun: e.target.value })}
                    placeholder="Dusun..."
                    className="w-full px-3 py-2 rounded-xl border-2 border-slate-200 text-xs font-bold uppercase"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-wider text-slate-700">
                    RT:
                  </label>
                  <input
                    type="text"
                    value={editFormData.rt}
                    onChange={(e) => setEditFormData({ ...editFormData, rt: e.target.value })}
                    placeholder="001"
                    className="w-full px-3 py-2 rounded-xl border-2 border-slate-200 text-xs font-bold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-wider text-slate-700">
                    RW:
                  </label>
                  <input
                    type="text"
                    value={editFormData.rw}
                    onChange={(e) => setEditFormData({ ...editFormData, rw: e.target.value })}
                    placeholder="001"
                    className="w-full px-3 py-2 rounded-xl border-2 border-slate-200 text-xs font-bold"
                  />
                </div>
              </div>

              {/* Footer Modal Actions */}
              <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setEditingRow(null)}
                  className="px-4 py-2.5 rounded-2xl bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs uppercase tracking-wider border-2 border-slate-200 cursor-pointer"
                >
                  Batal
                </button>

                <button
                  type="submit"
                  disabled={isSavingCorrection}
                  className="px-5 py-2.5 rounded-2xl bg-[#1CB0F6] hover:bg-[#189ddb] text-white font-black text-xs uppercase tracking-wider border-b-4 border-[#1899D6] active:border-b-0 active:translate-y-1 shadow-sm transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {isSavingCorrection ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Menyimpan...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Simpan Saja</span>
                    </>
                  )}
                </button>

                {allSkippedRows.length > 1 && (
                  <button
                    type="button"
                    onClick={(e) => handleSaveCorrection(e, true)}
                    disabled={isSavingCorrection}
                    className="px-6 py-2.5 rounded-2xl bg-[#58CC02] hover:bg-[#4ebb02] text-white font-black text-xs uppercase tracking-wider border-b-4 border-[#46A302] active:border-b-0 active:translate-y-1 shadow-sm transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    {isSavingCorrection ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Menyimpan...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        <span>Simpan & Lanjut Berikutnya ➔</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
