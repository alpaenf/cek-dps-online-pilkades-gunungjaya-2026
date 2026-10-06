import express from 'express';
import type { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  /**
   * Helper masking NIK
   */
  function maskNik(rawNik: string): string {
    const s = String(rawNik).trim();
    if (s.length !== 16) return s;
    return s.substring(0, 4) + '********' + s.substring(12);
  }

  /**
   * API Proxy: /api/check-dpt
   * Solusi definitif untuk kendala CORS, Iframe Sandbox, dan Multi-Akun Google di browser.
   * Node.js melakukan request langsung ke Google Apps Script atau Google Sheet tanpa restriksi browser CORS.
   */
  app.post('/api/check-dpt', async (req: Request, res: Response) => {
    try {
      const { nik, gasUrl, spreadsheetUrl } = req.body;
      const cleanNik = String(nik || '').replace(/\D/g, '').trim();

      if (!cleanNik || cleanNik.length !== 16) {
        return res.status(400).json({
          found: false,
          error: 'NIK harus terdiri dari 16 digit angka.'
        });
      }

      // 1. Jika pengguna memberikan URL Google Apps Script Web App
      if (gasUrl && typeof gasUrl === 'string' && gasUrl.trim().startsWith('https://script.google.com')) {
        let targetUrl = gasUrl.trim();
        // Ubah /edit menjadi /exec jika salah input
        if (targetUrl.includes('/edit')) {
          targetUrl = targetUrl.replace(/\/edit.*$/, '/exec');
        }

        const urlObj = new URL(targetUrl);
        urlObj.searchParams.set('action', 'check');
        urlObj.searchParams.set('nik', cleanNik);
        urlObj.searchParams.set('nocache', '1');
        urlObj.searchParams.set('_t', String(Date.now()));

        console.log(`[Proxy] Querying Google Apps Script: ${urlObj.toString()}`);

        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 25000);

        let response: any;
        try {
          response = await fetch(urlObj.toString(), {
            method: 'GET',
            redirect: 'follow',
            signal: controller.signal
          });
        } catch (fetchErr: any) {
          clearTimeout(timeout);
          if (fetchErr.name === 'AbortError' || String(fetchErr).toLowerCase().includes('aborted')) {
            console.warn('[Proxy Warning] Request ke Google Apps Script timeout (melebihi 25 detik).');
            return res.status(504).json({
              found: false,
              isTimeout: true,
              error: 'Server Google Apps Script sedang sibuk atau membutuhkan waktu lebih dari 25 detik untuk merespons (Timeout). Silakan coba klik tombol "Cek DPT" sekali lagi.'
            });
          }
          throw fetchErr;
        } finally {
          clearTimeout(timeout);
        }

        const contentType = response.headers.get('content-type') || '';
        const responseText = await response.text();

        // Cek jika Google merespons dengan halaman login (tanda 'Anyone' belum diatur)
        if (responseText.includes('accounts.google.com') || responseText.includes('ServiceLogin')) {
          return res.status(403).json({
            found: false,
            error: 'Google Apps Script meminta login Google. Pengaturan "Who has access" (Siapa yang memiliki akses) saat Deploy WAJIB diubah ke "Anyone" (Siapa saja).',
            isLoginRequired: true
          });
        }

        try {
          const jsonData = JSON.parse(responseText);
          return res.json(jsonData);
        } catch {
          console.error('[Proxy] Response bukan JSON:', responseText.slice(0, 300));
          return res.status(502).json({
            found: false,
            error: 'Google Apps Script merespons tetapi tidak mengembalikan JSON yang valid. Pastikan fungsi doGet mengembalikan ContentService.createTextOutput().',
            rawSnippet: responseText.slice(0, 200)
          });
        }
      }

      // 2. Jika pengguna memberikan Link Google Sheet langsung (Spreadsheet ID)
      if (spreadsheetUrl && typeof spreadsheetUrl === 'string' && spreadsheetUrl.includes('docs.google.com/spreadsheets')) {
        const match = spreadsheetUrl.match(/\/d\/([a-zA-Z0-9-_]+)/);
        if (match && match[1]) {
          const sheetId = match[1];
          console.log(`[Proxy] Querying Google Sheet ID via Visualization API: ${sheetId}`);

          // Gunakan endpoint Google Visualization API (format JSON aman dengan cache buster)
          const gvizUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json&_t=${Date.now()}`;

          const gvizRes = await fetch(gvizUrl, { redirect: 'follow' });
          if (!gvizRes.ok) {
            return res.status(403).json({
              found: false,
              error: 'Google Sheet tidak dapat diakses. Pastikan hak akses Spreadsheet diatur ke "Siapa saja yang memiliki link dapat melihat" (Anyone with the link can view).'
            });
          }

          const rawText = await gvizRes.text();
          // Hapus pembungkus Google Visualization: /*O_o*/ google.visualization.Query.setResponse(...);
          const jsonString = rawText.substring(rawText.indexOf('{'), rawText.lastIndexOf('}') + 1);
          const sheetData = JSON.parse(jsonString);

          const rows = sheetData?.table?.rows || [];
          const cols = sheetData?.table?.cols || [];

          // Cari index kolom NIK, Nama, Dusun, RT, RW, TPS, Status
          let nikColIdx = 1;
          let namaColIdx = 3;
          let dusunColIdx = 8;
          let rtColIdx = 9;
          let rwColIdx = 10;
          let tpsColIdx = 11;
          let statusColIdx = 12;

          for (let c = 0; c < cols.length; c++) {
            const label = (cols[c]?.label || '').toLowerCase();
            if (label.includes('nik')) nikColIdx = c;
            else if (label.includes('nama')) namaColIdx = c;
            else if (label.includes('dusun')) dusunColIdx = c;
            else if (label.includes('rt')) rtColIdx = c;
            else if (label.includes('rw')) rwColIdx = c;
            else if (label.includes('tps')) tpsColIdx = c;
            else if (label.includes('status')) statusColIdx = c;
          }

          for (const r of rows) {
            const rowCells = r.c || [];
            // Google Visualization API menyediakan 'v' (raw value) dan 'f' (formatted string)
            const cellNikRaw = rowCells[nikColIdx]?.f || String(rowCells[nikColIdx]?.v || '');
            const cellNikClean = cellNikRaw.replace(/\D/g, '').trim();

            if (cellNikClean === cleanNik) {
              const nama = String(rowCells[namaColIdx]?.v || '').trim();
              const dusun = String(rowCells[dusunColIdx]?.v || '').trim();
              const rt = String(rowCells[rtColIdx]?.v || '').padStart(2, '0');
              const rw = String(rowCells[rwColIdx]?.v || '').padStart(2, '0');
              const tps = 'TPS ' + String(rowCells[tpsColIdx]?.v || '1').replace(/[^0-9]/g, '');
              const status = String(rowCells[statusColIdx]?.v || 'TERDAFTAR DALAM DPS (Daftar Pemilih Sementara)').trim();

              return res.json({
                found: true,
                nama,
                nik_masked: maskNik(cleanNik),
                dusun,
                rt,
                rw,
                tps,
                status
              });
            }
          }

          return res.json({
            found: false,
            message: 'Data Anda belum ditemukan dalam database DPS (Daftar Pemilih Sementara) yang tersedia pada website ini.'
          });
        }
      }

      return res.status(400).json({
        found: false,
        error: 'Tidak ada URL Google Apps Script atau Google Sheet yang valid untuk diproses.'
      });

    } catch (err: any) {
      if (err.name === 'AbortError' || String(err).toLowerCase().includes('aborted')) {
        console.warn('[Proxy Warning] Query dibatalkan atau waktu tunggu habis (timeout):', err.message);
        return res.status(504).json({
          found: false,
          isTimeout: true,
          error: 'Koneksi ke Google Apps Script/Sheets mengalami batas waktu (timeout). Silakan ulangi beberapa saat lagi.'
        });
      }
      console.warn('[Proxy Fetch Error]', err.message || err);
      return res.status(500).json({
        found: false,
        error: `Server Backend gagal menghubungi sumber data: ${err.message || 'Network error'}`
      });
    }
  });

  /**
   * API Endpoint: /api/get-config
   * Membaca pengaturan (Sheet PENGATURAN) dari Apps Script atau Google Sheets secara realtime
   */
  app.post('/api/get-config', async (req: Request, res: Response) => {
    try {
      const { gasUrl, spreadsheetUrl } = req.body;

      if (gasUrl && typeof gasUrl === 'string' && gasUrl.trim().startsWith('https://script.google.com')) {
        let targetUrl = gasUrl.trim().replace(/\/edit.*$/, '/exec');
        const urlObj = new URL(targetUrl);
        urlObj.searchParams.set('action', 'config');
        urlObj.searchParams.set('nocache', '1');
        urlObj.searchParams.set('_t', String(Date.now()));

        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 20000);

        try {
          const response = await fetch(urlObj.toString(), {
            redirect: 'follow',
            signal: controller.signal
          });
          clearTimeout(timeout);
          if (response.ok) {
            const data = await response.json();
            return res.json(data);
          }
        } catch (e: any) {
          clearTimeout(timeout);
          // Abaikan timeout config di background agar tidak mengganggu UI
        }
      }

      if (spreadsheetUrl && typeof spreadsheetUrl === 'string' && spreadsheetUrl.includes('docs.google.com/spreadsheets')) {
        const match = spreadsheetUrl.match(/\/d\/([a-zA-Z0-9-_]+)/);
        if (match && match[1]) {
          const sheetId = match[1];

          // Coba sheet PENGATURAN, jika tidak ada coba Pengaturan atau pengaturan
          let rawText = '';
          const sheetNamesToTry = ['PENGATURAN', 'Pengaturan', 'pengaturan', 'CONFIG', 'Config'];

          for (const sName of sheetNamesToTry) {
            const gvizUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json&sheet=${encodeURIComponent(sName)}&_t=${Date.now()}`;
            try {
              const gvizRes = await fetch(gvizUrl, { redirect: 'follow' });
              if (gvizRes.ok) {
                const text = await gvizRes.text();
                if (text && !text.includes('"status":"error"')) {
                  rawText = text;
                  break;
                }
              }
            } catch {}
          }

          if (rawText) {
            const jsonString = rawText.substring(rawText.indexOf('{'), rawText.lastIndexOf('}') + 1);
            const sheetData = JSON.parse(jsonString);
            const rows = sheetData?.table?.rows || [];
            const config: Record<string, string> = {};

            if (rows.length > 0) {
              // Deteksi format Horizontal vs Vertikal
              const firstRowCols = (rows[0]?.c || []).map((cell: any) =>
                String(cell?.v || '').trim().toLowerCase().replace(/[^a-z0-9_]/g, '_')
              );
              const isHorizontal = firstRowCols.some((col: string) =>
                col.includes('nama_kegiatan') || col.includes('tanggal') || col.includes('desa')
              );

              if (isHorizontal && rows.length >= 2) {
                // Baris 0 = nama parameter, Baris 1 = nilainya
                const dataCells = rows[1]?.c || [];
                for (let c = 0; c < firstRowCols.length; c++) {
                  const k = firstRowCols[c];
                  const v = String(dataCells[c]?.f || dataCells[c]?.v || '').trim();
                  if (k && v) config[k] = v;
                }
              } else {
                // Format Vertikal: Baris per baris, Kolom A = parameter, Kolom B = nilainya
                for (const r of rows) {
                  const k = String(r.c?.[0]?.v || '').trim().toLowerCase().replace(/[^a-z0-9_]/g, '_');
                  const v = String(r.c?.[1]?.f || r.c?.[1]?.v || '').trim();
                  if (k && v) config[k] = v;
                }
              }
            }

            return res.json({ success: true, config });
          }
        }
      }

      return res.json({ success: false, config: {} });
    } catch (err: any) {
      return res.json({ success: false, error: err.message, config: {} });
    }
  });

  /**
   * API Endpoint: /api/get-tps
   * Membaca data TPS (Sheet TPS) dari Apps Script atau Google Sheets secara realtime
   */
  app.post('/api/get-tps', async (req: Request, res: Response) => {
    try {
      const { gasUrl, spreadsheetUrl } = req.body;

      if (gasUrl && typeof gasUrl === 'string' && gasUrl.trim().startsWith('https://script.google.com')) {
        let targetUrl = gasUrl.trim().replace(/\/edit.*$/, '/exec');
        const urlObj = new URL(targetUrl);
        urlObj.searchParams.set('action', 'tps');
        urlObj.searchParams.set('nocache', '1');
        urlObj.searchParams.set('_t', String(Date.now()));

        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 20000);

        try {
          const response = await fetch(urlObj.toString(), {
            redirect: 'follow',
            signal: controller.signal
          });
          clearTimeout(timeout);
          if (response.ok) {
            const data = await response.json();
            return res.json(data);
          }
        } catch (e: any) {
          clearTimeout(timeout);
          // Abaikan timeout TPS di background agar tidak mengganggu UI
        }
      }

      if (spreadsheetUrl && typeof spreadsheetUrl === 'string' && spreadsheetUrl.includes('docs.google.com/spreadsheets')) {
        const match = spreadsheetUrl.match(/\/d\/([a-zA-Z0-9-_]+)/);
        if (match && match[1]) {
          const sheetId = match[1];

          let rawText = '';
          const sheetNamesToTry = ['TPS', 'Tps', 'tps', 'LOKASI TPS', 'Data TPS'];

          for (const sName of sheetNamesToTry) {
            const gvizUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json&sheet=${encodeURIComponent(sName)}&_t=${Date.now()}`;
            try {
              const gvizRes = await fetch(gvizUrl, { redirect: 'follow' });
              if (gvizRes.ok) {
                const text = await gvizRes.text();
                if (text && !text.includes('"status":"error"')) {
                  rawText = text;
                  break;
                }
              }
            } catch {}
          }

          if (rawText) {
            const jsonString = rawText.substring(rawText.indexOf('{'), rawText.lastIndexOf('}') + 1);
            const sheetData = JSON.parse(jsonString);
            const rows = sheetData?.table?.rows || [];
            const list: any[] = [];
            for (const r of rows) {
              const cells = r.c || [];
              const rawTpsCell = String(cells[0]?.f || cells[0]?.v || '').trim();
              const rawTpsDigits = rawTpsCell.replace(/[^0-9]/g, '');
              // Abaikan baris header 'TPS' atau 'No TPS'
              if (rawTpsDigits || (rawTpsCell && !rawTpsCell.toLowerCase().includes('tps'))) {
                list.push({
                  tps: rawTpsDigits ? `TPS ${rawTpsDigits}` : rawTpsCell,
                  nama_lokasi: String(cells[1]?.f || cells[1]?.v || '').trim(),
                  alamat: String(cells[2]?.f || cells[2]?.v || '').trim(),
                  dusun: String(cells[3]?.f || cells[3]?.v || '').trim(),
                  rt: String(cells[4]?.f || cells[4]?.v || '').trim(),
                  rw: String(cells[5]?.f || cells[5]?.v || '').trim(),
                  keterangan: String(cells[6]?.f || cells[6]?.v || '').trim()
                });
              }
            }
            return res.json({ success: true, list });
          }
        }
      }

      return res.json({ success: false, list: [] });
    } catch (err: any) {
      return res.json({ success: false, error: err.message, list: [] });
    }
  });

  /**
   * API Endpoint: /api/get-dps-recap
   * Menghitung rekapitulasi data pemilih (L/P dan per TPS) langsung dari Google Spreadsheet / Apps Script
   */
  app.post('/api/get-dps-recap', async (req: Request, res: Response) => {
    try {
      const { gasUrl, spreadsheetUrl } = req.body;

      // 1. Lewat Google Apps Script
      if (gasUrl && typeof gasUrl === 'string' && gasUrl.trim().startsWith('https://script.google.com')) {
        let targetUrl = gasUrl.trim().replace(/\/edit.*$/, '/exec');
        const urlObj = new URL(targetUrl);
        urlObj.searchParams.set('action', 'recap');
        urlObj.searchParams.set('nocache', '1');
        urlObj.searchParams.set('_t', String(Date.now()));

        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 25000);

        try {
          const response = await fetch(urlObj.toString(), {
            redirect: 'follow',
            signal: controller.signal
          });
          clearTimeout(timeout);
          if (response.ok) {
            const data = await response.json();
            if (data && data.success && data.recap) {
              return res.json(data);
            }
          }
        } catch {
          clearTimeout(timeout);
        }
      }

      // 2. Lewat Google Spreadsheet Visualization API
      if (spreadsheetUrl && typeof spreadsheetUrl === 'string' && spreadsheetUrl.includes('docs.google.com/spreadsheets')) {
        const match = spreadsheetUrl.match(/\/d\/([a-zA-Z0-9-_]+)/);
        if (match && match[1]) {
          const sheetId = match[1];

          let rawText = '';
          const sheetNamesToTry = ['DPS', 'dps', 'DPT', 'dpt', 'Sheet1', 'Sheet 1'];

          for (const sName of sheetNamesToTry) {
            const gvizUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json&sheet=${encodeURIComponent(sName)}&_t=${Date.now()}`;
            try {
              const gvizRes = await fetch(gvizUrl, { redirect: 'follow' });
              if (gvizRes.ok) {
                const text = await gvizRes.text();
                if (text && !text.includes('"status":"error"')) {
                  rawText = text;
                  break;
                }
              }
            } catch {}
          }

          if (rawText) {
            const jsonString = rawText.substring(rawText.indexOf('{'), rawText.lastIndexOf('}') + 1);
            const sheetData = JSON.parse(jsonString);
            const rows = sheetData?.table?.rows || [];
            const cols = sheetData?.table?.cols || [];

            let jkColIdx = -1;
            let tpsColIdx = -1;

            for (let c = 0; c < cols.length; c++) {
              const label = (cols[c]?.label || '').toLowerCase();
              if (label.includes('kelamin') || label.includes('jk') || label.includes('gender') || label === 'l/p' || label === 'lp') {
                jkColIdx = c;
              } else if (label.includes('tps')) {
                tpsColIdx = c;
              }
            }

            // Fallback default index jika tidak ada label
            if (jkColIdx === -1) jkColIdx = 6;
            if (tpsColIdx === -1) tpsColIdx = 11;

            let totalL = 0;
            let totalP = 0;
            const tpsCounts: Record<number, { L: number; P: number }> = {
              1: { L: 0, P: 0 },
              2: { L: 0, P: 0 },
              3: { L: 0, P: 0 },
              4: { L: 0, P: 0 },
              5: { L: 0, P: 0 }
            };

            for (const r of rows) {
              const cells = r.c || [];
              const rawJk = String(cells[jkColIdx]?.f || cells[jkColIdx]?.v || '').trim().toUpperCase();
              const isL = rawJk.startsWith('L');
              const isP = rawJk.startsWith('P') || rawJk.startsWith('W');

              if (!isL && !isP) continue;

              if (isL) totalL++;
              if (isP) totalP++;

              const rawTps = String(cells[tpsColIdx]?.f || cells[tpsColIdx]?.v || '').replace(/[^0-9]/g, '');
              const tpsNum = parseInt(rawTps, 10) || 1;
              const safeTpsNum = tpsNum >= 1 && tpsNum <= 5 ? tpsNum : 1;

              if (isL) tpsCounts[safeTpsNum].L++;
              if (isP) tpsCounts[safeTpsNum].P++;
            }

            if (totalL > 0 || totalP > 0) {
              const defaultTpsNames = [
                { tps: 'TPS 1', lokasi: 'Pendopo Balai Desa Gunungjaya', dusun: 'Dusun Krajan' },
                { tps: 'TPS 2', lokasi: 'Gedung SDN 01 Gunungjaya', dusun: 'Dusun Gombong' },
                { tps: 'TPS 3', lokasi: 'Gedung MDA Nurul Huda', dusun: 'Dusun Soka' },
                { tps: 'TPS 4', lokasi: 'Balai Pertemuan Warga Dusun Karanganyar', dusun: 'Dusun Karanganyar' },
                { tps: 'TPS 5', lokasi: 'Halaman Gedung Posyandu Watukumpul', dusun: 'Dusun Watukumpul' }
              ];

              const tpsStats = defaultTpsNames.map((item, idx) => {
                const num = idx + 1;
                const c = tpsCounts[num] || { L: 0, P: 0 };
                return {
                  tps: item.tps,
                  lokasi: item.lokasi,
                  dusun: item.dusun,
                  lakiLaki: c.L,
                  perempuan: c.P,
                  total: c.L + c.P
                };
              });

              return res.json({
                success: true,
                recap: {
                  totalDps: totalL + totalP,
                  totalLakiLaki: totalL,
                  totalPerempuan: totalP,
                  tpsStats,
                  lastUpdated: 'Sinkronisasi Realtime Spreadsheet'
                }
              });
            }
          }
        }
      }

      return res.json({ success: false, message: 'Tidak dapat menghitung rekap dari data yang diberikan.' });
    } catch (err: any) {
      return res.json({ success: false, error: err.message });
    }
  });

  /**
   * API Test Endpoint: /api/test-gas
   */
  app.post('/api/test-gas', async (req: Request, res: Response) => {
    try {
      const { url } = req.body;
      if (!url || typeof url !== 'string') {
        return res.json({ success: false, message: 'URL tidak valid.' });
      }

      const target = url.trim();
      const testUrl = new URL(target.includes('/edit') ? target.replace(/\/edit.*$/, '/exec') : target);
      testUrl.searchParams.set('action', 'check');
      testUrl.searchParams.set('nik', '3327091205850001');

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 25000);

      let response: any;
      try {
        response = await fetch(testUrl.toString(), {
          method: 'GET',
          redirect: 'follow',
          signal: controller.signal
        });
      } catch (fetchErr: any) {
        clearTimeout(timeout);
        if (fetchErr.name === 'AbortError' || String(fetchErr).toLowerCase().includes('aborted')) {
          return res.json({
            success: false,
            message: 'Koneksi Timeout (Waktu Habis).',
            details: 'Google Apps Script membutuhkan waktu lebih dari 25 detik untuk merespons. Jika script baru saja dibuka (cold-start), silakan coba klik Tes URL sekali lagi.'
          });
        }
        throw fetchErr;
      } finally {
        clearTimeout(timeout);
      }

      const text = await response.text();

      if (text.includes('accounts.google.com') || text.includes('ServiceLogin')) {
        return res.json({
          success: false,
          message: 'Terdeteksi Login Google (Akses Ditolak).',
          details: 'Pengaturan "Who has access" saat Deploy masih "Only myself". Wajib diubah menjadi "Anyone" (Siapa saja).'
        });
      }

      try {
        const json = JSON.parse(text);
        return res.json({
          success: true,
          message: 'Koneksi Berhasil!',
          details: 'Google Apps Script merespons JSON dengan benar melalui server backend proxy.',
          data: json
        });
      } catch {
        return res.json({
          success: false,
          message: 'Respons bukan JSON.',
          details: `Google Apps Script mengembalikan status ${response.status} tetapi formatnya bukan JSON: ${text.slice(0, 150)}`
        });
      }
    } catch (err: any) {
      return res.json({
        success: false,
        message: 'Koneksi Gagal.',
        details: err.message || 'Tidak dapat menghubungi server Apps Script.'
      });
    }
  });

  // Mount Vite middlewares in development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server Pilkades Gunungjaya berjalan di http://0.0.0.0:${PORT}`);
  });
}

startServer();
