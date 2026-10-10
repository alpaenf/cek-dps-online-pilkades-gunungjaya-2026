import React, { useState } from 'react';
import { X, Copy, Check, ExternalLink, FileSpreadsheet, ShieldAlert, Sparkles, CheckCircle2, Code, AlertTriangle, RefreshCw, HelpCircle, Lightbulb, FlaskConical, XCircle, ArrowRight } from 'lucide-react';
import { GOOGLE_APPS_SCRIPT_SOURCE } from '../data/googleAppsScriptCode';
import { testAppsScriptConnection } from '../data/mockDatabase';

interface GoogleSheetGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  appsScriptUrl: string;
  onSaveAppsScriptUrl: (url: string) => void;
}

export const GoogleSheetGuideModal: React.FC<GoogleSheetGuideModalProps> = ({
  isOpen,
  onClose,
  appsScriptUrl,
  onSaveAppsScriptUrl
}) => {
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedPengaturan, setCopiedPengaturan] = useState(false);
  const [inputUrl, setInputUrl] = useState(appsScriptUrl);
  const [activeTab, setActiveTab] = useState<'architecture' | 'sheets' | 'script' | 'url' | 'troubleshooting'>('url');
  const [saveStatus, setSaveStatus] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    message: string;
    details?: string;
  } | null>(null);

  if (!isOpen) return null;

  const pengaturanTsv = [
    ['tanggal_pemungutan', 'Senin, 9 November 2026 (Pukul 07.00 - 13.00 WIB)'],
    ['nama_kegiatan', 'Pemilihan Kepala Desa Gunungjaya Tahun 2026'],
    ['desa', 'Gunungjaya'],
    ['kecamatan', 'Belik'],
    ['kabupaten', 'Pemalang'],
    ['tahun', '2026'],
    ['pengumuman', 'Pengecekan DPS Online telah dibuka. Pastikan NIK Anda terdaftar sebelum hari H!'],
    ['whatsapp_panitia', '6285226123456']
  ].map(row => row.join('\t')).join('\n');

  const handleCopyPengaturan = () => {
    navigator.clipboard.writeText(pengaturanTsv);
    setCopiedPengaturan(true);
    setTimeout(() => setCopiedPengaturan(false), 2500);
  };

  const handleDownloadPengaturanCsv = () => {
    const csvContent = 'data:text/csv;charset=utf-8,' + encodeURIComponent(
      'Parameter,Nilai\n' +
      'tanggal_pemungutan,"Senin, 9 November 2026 (Pukul 07.00 - 13.00 WIB)"\n' +
      'nama_kegiatan,"Pemilihan Kepala Desa Gunungjaya Tahun 2026"\n' +
      'desa,"Gunungjaya"\n' +
      'kecamatan,"Belik"\n' +
      'kabupaten,"Pemalang"\n' +
      'tahun,"2026"\n' +
      'pengumuman,"Pengecekan DPS Online telah dibuka. Pastikan NIK Anda terdaftar sebelum hari H!"\n' +
      'whatsapp_panitia,"6285226123456"\n'
    );
    const link = document.createElement('a');
    link.setAttribute('href', csvContent);
    link.setAttribute('download', 'PENGATURAN_PILKADES.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(GOOGLE_APPS_SCRIPT_SOURCE);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleSaveUrl = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveAppsScriptUrl(inputUrl.trim());
    setSaveStatus(true);
    setTimeout(() => setSaveStatus(false), 2500);
  };

  const handleTestConnection = async () => {
    const urlToTest = inputUrl.trim();
    if (!urlToTest) {
      setTestResult({
        success: false,
        message: 'Masukkan URL terlebih dahulu untuk diuji.',
        details: 'Tempelkan URL Google Apps Script Web App yang berakhiran /exec.'
      });
      return;
    }

    setIsTesting(true);
    setTestResult(null);
    const res = await testAppsScriptConnection(urlToTest);
    setIsTesting(false);
    setTestResult(res);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[92vh] overflow-hidden shadow-2xl border border-slate-200 flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 font-serif">
                Integrasi Database Google Sheets & Apps Script
              </h3>
              <p className="text-xs text-slate-500">
                Pengecekan DPT online langsung dari Google Sheets Desa Gunungjaya
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-slate-100/70 px-4 text-xs font-semibold overflow-x-auto">
          <button
            onClick={() => setActiveTab('url')}
            className={`py-3 px-3 border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'url'
                ? 'border-blue-900 text-blue-950 font-bold bg-white rounded-t-lg'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            1. Sambungkan Web App URL
          </button>
          <button
            onClick={() => setActiveTab('troubleshooting')}
            className={`py-3 px-3 border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === 'troubleshooting'
                ? 'border-blue-900 text-red-950 font-bold bg-white rounded-t-lg'
                : 'border-transparent text-red-700 hover:text-red-900'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            <span>2. Solusi Error "Data Tidak Dapat Diakses"</span>
          </button>
          <button
            onClick={() => setActiveTab('script')}
            className={`py-3 px-3 border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'script'
                ? 'border-blue-900 text-blue-950 font-bold bg-white rounded-t-lg'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            3. Kode Apps Script (Code.gs)
          </button>
          <button
            onClick={() => setActiveTab('sheets')}
            className={`py-3 px-3 border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'sheets'
                ? 'border-blue-900 text-blue-950 font-bold bg-white rounded-t-lg'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            4. Format Spreadsheet
          </button>
          <button
            onClick={() => setActiveTab('architecture')}
            className={`py-3 px-3 border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'architecture'
                ? 'border-blue-900 text-blue-950 font-bold bg-white rounded-t-lg'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            5. Keamanan & Privasi
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto flex-1 text-xs sm:text-sm text-slate-700 space-y-6">
          {/* TAB 1: SAMBUNGKAN URL & TES KONEKSI */}
          {activeTab === 'url' && (
            <div className="space-y-4">
              <form onSubmit={handleSaveUrl} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    URL Google Apps Script Web App ATAU Link Google Spreadsheet
                  </label>
                  <input
                    type="url"
                    value={inputUrl}
                    onChange={(e) => setInputUrl(e.target.value)}
                    placeholder="https://script.google.com/macros/s/.../exec ATAU https://docs.google.com/spreadsheets/d/..."
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:bg-white"
                  />
                  <div className="mt-2 p-3 bg-blue-50/70 border border-blue-200 rounded-lg text-[11px] text-blue-900 space-y-1">
                    <p className="font-semibold flex items-center gap-1.5">
                      <Lightbulb className="w-3.5 h-3.5 text-blue-800 shrink-0" />
                      <span>Anda memiliki 2 metode yang didukung penuh:</span>
                    </p>
                    <p><strong>Metode A (Rekomendasi):</strong> Tempelkan URL Google Apps Script Web App (berakhiran <code>/exec</code>).</p>
                    <p><strong>Metode B (Alternatif Termudah):</strong> Tempelkan langsung Link Google Spreadsheet Anda (contoh: <code>https://docs.google.com/spreadsheets/d/...</code>) setelah mengatur hak akses ke <em>"Siapa saja yang memiliki link dapat melihat"</em>.</p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-blue-900 hover:bg-blue-950 text-white rounded-xl text-xs font-bold transition-colors shadow-2xs"
                  >
                    Simpan Konfigurasi URL
                  </button>

                  {/* Tombol Uji Koneksi Langsung */}
                  <button
                    type="button"
                    onClick={handleTestConnection}
                    disabled={isTesting}
                    className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-2xs disabled:opacity-50"
                  >
                    {isTesting ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin text-blue-900" />
                    ) : (
                      <FlaskConical className="w-3.5 h-3.5 text-blue-900" />
                    )}
                    <span>{isTesting ? 'Sedang Menguji...' : 'Uji / Tes Koneksi URL'}</span>
                  </button>

                  {inputUrl && (
                    <button
                      type="button"
                      onClick={() => {
                        setInputUrl('');
                        onSaveAppsScriptUrl('');
                        setTestResult(null);
                      }}
                      className="px-3.5 py-2.5 text-slate-600 hover:text-red-700 text-xs font-semibold"
                    >
                      Reset ke Mode Demo (Simulasi)
                    </button>
                  )}
                </div>

                {saveStatus && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Konfigurasi berhasil disimpan! Sistem akan otomatis menggunakan URL ini.</span>
                  </div>
                )}

                {/* Hasil Uji Koneksi */}
                {testResult && (
                  <div
                    className={`p-3.5 rounded-xl border text-xs space-y-1 ${
                      testResult.success
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                        : 'bg-red-50 border-red-300 text-red-900'
                    }`}
                  >
                    <div className="flex items-center gap-2 font-bold">
                      {testResult.success ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-red-600" />
                      )}
                      <span>{testResult.message}</span>
                    </div>
                    {testResult.details && (
                      <p className="text-slate-700 pl-6">{testResult.details}</p>
                    )}
                    {!testResult.success && (
                      <div className="pl-6 pt-1">
                        <button
                          type="button"
                          onClick={() => setActiveTab('troubleshooting')}
                          className="text-blue-900 underline font-semibold hover:text-blue-950 inline-flex items-center gap-1"
                        >
                          <span>Lihat langkah perbaikan di tab &quot;Solusi Error&quot;</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </form>

              {/* Status Database */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600">
                <span className="font-bold text-slate-800 block mb-1">Status Database Saat Ini:</span>
                {appsScriptUrl ? (
                  <p className="text-emerald-700 font-semibold font-mono break-all">
                    Terhubung ke Web App Live: {appsScriptUrl}
                  </p>
                ) : (
                  <div className="space-y-1">
                    <p className="text-blue-900 font-medium flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>Menggunakan Database Simulasi Google Sheets Desa Gunungjaya (7 contoh pemilih aktif di 5 TPS).</span>
                    </p>
                    <p className="text-slate-500 text-[11px]">
                      Anda dapat mencoba NIK contoh seperti <strong>3327091205850001</strong> atau <strong>3327092304900002</strong>.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: TROUBLESHOOTING / SOLUSI ERROR LENGKAP */}
          {activeTab === 'troubleshooting' && (
            <div className="space-y-5">
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                <h4 className="font-bold text-red-900 text-sm flex items-center gap-2 mb-1">
                  <AlertTriangle className="w-4 h-4 text-red-600" />
                  Mengapa Muncul: "Data sedang tidak dapat diakses dari server Google Sheets"?
                </h4>
                <p className="text-xs text-red-800 leading-relaxed">
                  Pesan ini terjadi ketika website mencoba menghubungi Google Apps Script Web App Anda, tetapi Google menolak atau memblokir koneksi browser. Berikut adalah 4 penyebab utama dan solusinya:
                </p>
              </div>

              {/* Solusi 1 - Terpenting */}
              <div className="p-4 bg-amber-50/70 border border-amber-300 rounded-xl space-y-2">
                <div className="flex items-center gap-2 font-bold text-amber-950 text-xs">
                  <span className="w-5 h-5 rounded-full bg-amber-500 text-white flex items-center justify-center text-[10px]">1</span>
                  <span>PENYEBAB UTAMA (90% KASUS): Hak Akses Deployment Belum "Anyone" (Siapa Saja)</span>
                </div>
                <p className="text-xs text-amber-900 leading-relaxed pl-7">
                  Secara default, Google Apps Script mengatur izin akses hanya untuk pemilik (*"Only myself"*). Akibatnya, Google meminta login akun dan menolak akses dari website publik (CORS Error).
                </p>
                <div className="pl-7 pt-1">
                  <div className="bg-white p-3 rounded-lg border border-amber-200 text-xs text-slate-800 space-y-1">
                    <strong className="block text-slate-900 font-semibold">Cara Memperbaiki:</strong>
                    <p>1. Buka kembali Google Spreadsheet Anda → Klik <strong>Ekstensi (Extensions)</strong> → <strong>Apps Script</strong>.</p>
                    <p>2. Di pojok kanan atas, klik tombol biru <strong>Deploy (Terapkan)</strong> → pilih <strong>Manage deployments (Kelola penerapan)</strong>.</p>
                    <p>3. Klik ikon pensil (Edit) di samping penerapan aktif Anda.</p>
                    <p>4. Pada pilihan <strong>Who has access (Siapa yang memiliki akses)</strong>, ubah dari <em>"Only myself"</em> menjadi <strong>"Anyone" (Siapa saja)</strong>.</p>
                    <p>5. Pada <em>Version</em>, pilih <strong>New version (Versi baru)</strong>.</p>
                    <p>6. Klik <strong>Deploy</strong>, lalu salin kembali URL Web App yang berakhiran <code>/exec</code>.</p>
                  </div>
                </div>
              </div>

              {/* Solusi 2 */}
              <div className="p-4 bg-slate-50 border border-slate-300 rounded-xl space-y-2">
                <div className="flex items-center gap-2 font-bold text-slate-900 text-xs">
                  <span className="w-5 h-5 rounded-full bg-blue-900 text-white flex items-center justify-center text-[10px]">2</span>
                  <span>Salah Menyalin URL Editor (/edit) bukan URL Web App (/exec)</span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed pl-7">
                  Jangan menyalin link dari bilah alamat browser saat sedang mengedit script (yang berisi <code>/edit</code>).
                  Link yang benar didapatkan setelah mengklik tombol <strong>Deploy → New deployment → Web App</strong>, dengan format:
                </p>
                <div className="pl-7">
                  <code className="block p-2 bg-slate-900 text-emerald-400 font-mono text-[11px] rounded-lg break-all">
                    https://script.google.com/macros/s/AKfycb.../exec
                  </code>
                </div>
              </div>

              {/* Solusi 3 */}
              <div className="p-4 bg-slate-50 border border-slate-300 rounded-xl space-y-2">
                <div className="flex items-center gap-2 font-bold text-slate-900 text-xs">
                  <span className="w-5 h-5 rounded-full bg-blue-900 text-white flex items-center justify-center text-[10px]">3</span>
                  <span>Nama Tab Lembar Kerja di Google Spreadsheet Tidak Sesuai</span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed pl-7">
                  Pastikan nama tab di bagian bawah Google Spreadsheet Anda bernama persis <strong>DPT</strong> (semua huruf kapital, tanpa spasi tambahan). Jika tab bernama <em>Sheet1</em>, ubah namanya menjadi <strong>DPT</strong>.
                </p>
              </div>

              {/* Solusi 4 */}
              <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-xl space-y-2">
                <div className="flex items-center gap-2 font-bold text-emerald-950 text-xs">
                  <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px]">4</span>
                  <span>Solusi Cepat Sementara: Gunakan Database Demo</span>
                </div>
                <p className="text-xs text-emerald-900 leading-relaxed pl-7">
                  Jika Anda sedang melakukan demonstrasi website dan belum sempat mengonfigurasi Google Sheets, cukup hapus URL yang tersimpan. Website akan langsung beralih ke 7 contoh data DPT aktif tanpa error!
                </p>
                <div className="pl-7 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setInputUrl('');
                      onSaveAppsScriptUrl('');
                      setTestResult(null);
                      setActiveTab('url');
                    }}
                    className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold transition-colors"
                  >
                    Beralih Sekarang ke Mode Demo (Simulasi)
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: KODE APPS SCRIPT */}
          {activeTab === 'script' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                    File Apps Script: Code.gs
                  </h4>
                  <p className="text-xs text-slate-500">
                    Buka Google Sheets → <strong>Ekstensi (Extensions)</strong> → <strong>Apps Script</strong> → Tempel kode ini.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="px-3.5 py-1.5 bg-blue-900 hover:bg-blue-950 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  {copiedCode ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedCode ? 'Tersalin!' : 'Salin Kode'}</span>
                </button>
              </div>

              <div className="relative">
                <pre className="p-4 bg-slate-900 text-slate-200 font-mono text-xs rounded-xl overflow-x-auto max-h-80 border border-slate-800">
                  {GOOGLE_APPS_SCRIPT_SOURCE}
                </pre>
              </div>

              <div className="p-4 bg-slate-100 rounded-xl text-xs space-y-1.5">
                <span className="font-bold text-slate-900 block">Langkah Deploy Web App:</span>
                <p>1. Klik <strong>Deploy</strong> (Terapkan) → <strong>New deployment</strong> (Penerapan baru).</p>
                <p>2. Pilih tipe (ikon roda gigi): <strong>Web app</strong>.</p>
                <p>3. Atur <em>Execute as</em>: <strong>Me</strong> (Akun Anda).</p>
                <p>4. Atur <em>Who has access</em>: <strong>Anyone</strong> (Wajib "Siapa saja", bukan "Only myself").</p>
                <p>5. Salin URL Web App berakhiran <code>/exec</code> ke tab <strong>Sambungkan Web App URL</strong>.</p>
              </div>
            </div>
          )}

          {/* TAB 4: STRUKTUR SPREADSHEET */}
          {activeTab === 'sheets' && (
            <div className="space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">
                  STRUKTUR 3 SHEET DI GOOGLE SPREADSHEET
                </span>
                <p className="text-xs text-slate-600">
                  Untuk mengontrol data pemilih, jadwal pemilihan, dan sebaran TPS secara otomatis, buat 3 tab lembar kerja di bagian bawah Google Spreadsheet Anda:
                </p>
              </div>

              {/* Sheet 1: DPT */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-blue-900 font-mono flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-blue-900 text-white flex items-center justify-center text-[10px]">1</span>
                    Sheet: <strong>DPT</strong> (Daftar Pemilih Tetap)
                  </span>
                  <span className="text-[10px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-bold">Wajib</span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Baris 1 harus persis nama kolom header berikut:
                </p>
                <div className="p-2.5 bg-slate-900 text-emerald-400 font-mono text-[11px] rounded-lg overflow-x-auto">
                  NO | NIK | NO_KK | NAMA | TEMPAT_LAHIR | TANGGAL_LAHIR | JENIS_KELAMIN | ALAMAT | DUSUN | RT | RW | TPS | STATUS | KETERANGAN
                </div>
                <p className="text-[11px] text-slate-500">
                  Contoh baris 2: <code>1 | 3327091205850001 | 3327091001050011 | BUDI SANTOSO | Pemalang | 12-05-1985 | L | Dusun Krajan | Dusun Krajan | 01 | 02 | 1 | DPT | -</code>
                </p>
              </div>

              {/* Sheet 2: PENGATURAN */}
              <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-xl space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs font-bold text-amber-950 font-mono flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-amber-600 text-white flex items-center justify-center text-[10px]">2</span>
                    Sheet: <strong>PENGATURAN</strong> (Jadwal Pemilihan & Info Desa)
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={handleCopyPengaturan}
                      className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white text-[11px] font-semibold rounded-lg flex items-center gap-1 transition shadow-xs cursor-pointer"
                      title="Salin 2 kolom ini untuk langsung di-Paste (Ctrl+V) di cell A1 sheet PENGATURAN"
                    >
                      {copiedPengaturan ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedPengaturan ? 'Tersalin ke Clipboard!' : 'Salin Data Tabel (Siap Tempel)'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleDownloadPengaturanCsv}
                      className="px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-700 border border-amber-300 text-[11px] font-semibold rounded-lg flex items-center gap-1 transition shadow-xs cursor-pointer"
                      title="Unduh file CSV untuk di-Import ke Google Sheets"
                    >
                      <span>Unduh CSV</span>
                    </button>
                  </div>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">
                  Buat tab bernama <strong>PENGATURAN</strong> di spreadsheet Anda. Format tabel (Kolom A = Parameter, Kolom B = Nilai):
                </p>

                <div className="overflow-x-auto bg-white rounded-lg border border-amber-200 text-xs">
                  <table className="w-full text-left">
                    <thead className="bg-amber-100/80 text-amber-950 font-bold border-b border-amber-200">
                      <tr>
                        <th className="p-2 w-1/3">Kolom A (Kunci Parameter)</th>
                        <th className="p-2">Kolom B (Isi Nilai yang Ingin Ditampilkan)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-amber-100 font-mono text-[11px]">
                      <tr>
                        <td className="p-2 font-bold text-blue-900">tanggal_pemungutan</td>
                        <td className="p-2 font-sans text-emerald-800 font-bold">Senin, 9 November 2026 (Pukul 07.00 - 13.00 WIB)</td>
                      </tr>
                      <tr>
                        <td className="p-2 font-bold text-blue-900">nama_kegiatan</td>
                        <td className="p-2 font-sans text-slate-700">Pemilihan Kepala Desa Gunungjaya Tahun 2026</td>
                      </tr>
                      <tr>
                        <td className="p-2 font-bold text-blue-900">desa</td>
                        <td className="p-2 font-sans text-slate-700">Gunungjaya</td>
                      </tr>
                      <tr>
                        <td className="p-2 font-bold text-blue-900">kecamatan</td>
                        <td className="p-2 font-sans text-slate-700">Belik</td>
                      </tr>
                      <tr>
                        <td className="p-2 font-bold text-blue-900">kabupaten</td>
                        <td className="p-2 font-sans text-slate-700">Pemalang</td>
                      </tr>
                      <tr>
                        <td className="p-2 font-bold text-blue-900">tahun</td>
                        <td className="p-2 font-sans text-slate-700">2026</td>
                      </tr>
                      <tr>
                        <td className="p-2 font-bold text-blue-900">pengumuman</td>
                        <td className="p-2 font-sans text-slate-700">Pengecekan DPT Online telah dibuka. Pastikan NIK Anda terdaftar sebelum hari H!</td>
                      </tr>
                      <tr>
                        <td className="p-2 font-bold text-blue-900">whatsapp_panitia</td>
                        <td className="p-2 font-sans text-slate-700">6285226123456</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="p-2.5 bg-amber-100/50 rounded-lg text-amber-950 text-[11px] leading-relaxed flex items-start gap-1.5">
                  <Lightbulb className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <span><strong>Cara Instan:</strong> Klik tombol <strong>&quot;Salin Data Tabel (Siap Tempel)&quot;</strong> di atas, buka tab <code>PENGATURAN</code> di Google Sheets Anda, klik sel <strong>A1</strong>, lalu tekan <strong>Ctrl + V</strong> (atau Cmd + V di Mac). Semua data di atas langsung terisi rapi ke masing-masing baris dan kolom!</span>
                </div>
              </div>

              {/* Sheet 3: TPS */}
              <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-blue-950 font-mono flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-blue-900 text-white flex items-center justify-center text-[10px]">3</span>
                    Sheet: <strong>TPS</strong> (Cakupan Wilayah Lebih dari 1 RT & 1 RW)
                  </span>
                  <span className="text-[10px] bg-blue-100 text-blue-900 px-2 py-0.5 rounded font-bold">Daftar TPS & Cakupan</span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">
                  Buat tab bernama <strong>TPS</strong>. Baris 1 adalah nama header kolom:
                </p>
                <div className="p-2 bg-slate-900 text-emerald-400 font-mono text-[11px] rounded-lg overflow-x-auto">
                  TPS | NAMA_LOKASI | ALAMAT | DUSUN | RT | RW | KETERANGAN
                </div>

                <div className="space-y-2 text-xs text-slate-700">
                  <span className="font-bold text-slate-900 block">
                    Cara Menulis Jika 1 TPS Mencakup Lebih dari 1 RT dan 1 RW:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                    <div className="p-2.5 bg-white rounded-lg border border-blue-200 space-y-1">
                      <strong className="text-blue-900 block">Model A (Pakai Koma):</strong>
                      <p className="text-slate-600">
                        Kolom RT: <code className="bg-slate-100 px-1 py-0.5 rounded font-bold text-slate-900">01, 02, 03, 04</code><br />
                        Kolom RW: <code className="bg-slate-100 px-1 py-0.5 rounded font-bold text-slate-900">01, 02</code> atau <code className="bg-slate-100 px-1 py-0.5 rounded font-bold text-slate-900">01 & 02</code>
                      </p>
                      <span className="text-emerald-700 block font-semibold text-[10px]">
                        → Muncul di Web: RT 01, 02, 03, 04 / RW 01 & 02
                      </span>
                    </div>

                    <div className="p-2.5 bg-white rounded-lg border border-blue-200 space-y-1">
                      <strong className="text-blue-900 block">Model B (Pakai Rentang s/d atau -):</strong>
                      <p className="text-slate-600">
                        Kolom RT: <code className="bg-slate-100 px-1 py-0.5 rounded font-bold text-slate-900">01 s/d 04</code> atau <code className="bg-slate-100 px-1 py-0.5 rounded font-bold text-slate-900">01 - 05</code><br />
                        Kolom RW: <code className="bg-slate-100 px-1 py-0.5 rounded font-bold text-slate-900">01 & 02</code>
                      </p>
                      <span className="text-emerald-700 block font-semibold text-[10px]">
                        → Muncul di Web: RT 01 s/d 04 / RW 01 & 02
                      </span>
                    </div>
                  </div>

                  <div className="p-2.5 bg-white rounded-lg border border-blue-200 space-y-1 text-[11px]">
                    <strong className="text-blue-900 block">Model C (Kombinasi Spesifik antar Dusun/RW):</strong>
                    <p className="text-slate-600">
                      Jika RT 01-03 ikut RW 01 sedangkan RT 01-02 ikut RW 02, Anda bisa langsung ketik di Kolom RT:<br />
                      <code className="bg-slate-100 px-1.5 py-0.5 rounded font-bold text-slate-900">RT 01-03 (RW 01) & RT 01-02 (RW 02)</code> (kosongkan kolom RW).
                    </p>
                    <span className="text-emerald-700 block font-semibold text-[10px]">
                      → Sistem otomatis mendeteksi dan menampilkan seluruh cakupan dengan rapi tanpa terpotong!
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: ARSITEKTUR & KEAMANAN */}
          {activeTab === 'architecture' && (
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                <span className="font-bold text-blue-950 block mb-1">
                  Arsitektur Keamanan (Option A - Google Apps Script):
                </span>
                <p className="text-xs text-blue-900">
                  Google Sheets (Tersimpan Privat oleh Panitia) → Google Apps Script Web App (API Filter NIK) → Website CEK DPT (Frontend Publik)
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/50">
                  <span className="font-bold text-emerald-900 flex items-center gap-1.5 mb-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Standar Keamanan Terpenuhi:</span>
                  </span>
                  <ul className="list-disc pl-4 space-y-1 text-emerald-800">
                    <li>Tidak ada API Secret / Service Account key di frontend JavaScript.</li>
                    <li>Google Sheet tidak perlu dibuat publik untuk umum.</li>
                    <li>Apps Script hanya mengembalikan baris yang cocok dengan NIK 16 digit.</li>
                    <li>Masking NIK otomatis (contoh: <code>3327********1234</code>).</li>
                    <li>Nomor KK, tanggal lahir, dan catatan panitia tidak pernah diekspos.</li>
                  </ul>
                </div>

                <div className="p-4 rounded-xl border border-red-200 bg-red-50/50">
                  <span className="font-bold text-red-900 flex items-center gap-1.5 mb-1">
                    <XCircle className="w-4 h-4 text-red-600" />
                    <span>Larangan yang Diterapkan:</span>
                  </span>
                  <ul className="list-disc pl-4 space-y-1 text-red-800">
                    <li>TIDAK ADA endpoint <code>/api/all</code> atau <code>/api/dpt</code>.</li>
                    <li>Tidak ada query daftar pemilih massal.</li>
                    <li>Dilengkapi rate-limiting dan search throttling anti abuse.</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setActiveTab('troubleshooting')}
            className="text-xs text-red-700 hover:text-red-900 font-semibold flex items-center gap-1"
          >
            <HelpCircle className="w-4 h-4" />
            <span>Butuh bantuan mengatasi error?</span>
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};

