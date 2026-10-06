/**
 * Kode Google Apps Script (Code.gs) Versi 2.0 - Ultra Robust
 * Tahan terhadap notasi ilmiah (3.32E+15), otomatis deteksi kolom & nama sheet.
 */

export const GOOGLE_APPS_SCRIPT_SOURCE = `/**
 * ============================================================================
 * API GOOGLE APPS SCRIPT - CEK DPT ONLINE PILKADES GUNUNGJAYA 2026
 * Versi: 2.0 (Robust Anti-Error & Auto-Detect Column)
 * ============================================================================
 */

function doGet(e) {
  try {
    var params = (e && e.parameter) ? e.parameter : {};
    var action = params.action || 'check';
    var rawNik = (params.nik || '').toString().trim();

    // 1. Jika diakses langsung tanpa NIK (Test Ping)
    if (!rawNik && action !== 'config' && action !== 'tps') {
      return createJsonResponse({
        status: 'online',
        message: 'API Google Apps Script Pilkades Gunungjaya Aktif!',
        waktu: new Date().toISOString(),
        petunjuk: 'Gunakan parameter ?action=check&nik=16DIGIT untuk mengecek DPT.'
      });
    }

    // 2. Endpoint Konfigurasi
    if (action === 'config') {
      return createJsonResponse(getConfigData());
    }

    // 3. Endpoint TPS
    if (action === 'tps') {
      return createJsonResponse(getTpsData());
    }

    // 4. Endpoint Rekapitulasi Otomatis (Laki-laki & Perempuan serta per TPS)
    if (action === 'recap') {
      return createJsonResponse(getRecapData());
    }

    // 5. Validasi NIK: hanya angka dan 16 digit
    var cleanNik = rawNik.replace(/[^0-9]/g, '');
    if (cleanNik.length !== 16) {
      return createJsonResponse({
        found: false,
        message: 'NIK harus terdiri dari 16 digit angka.'
      });
    }

    // 5. Cek Cache (Hanya jika tidak ada parameter nocache/refresh)
    var cache = CacheService.getScriptCache();
    var cacheKey = 'dpt_v2_' + cleanNik;
    var forceRefresh = params.nocache === '1' || params.refresh === '1';
    
    if (!forceRefresh) {
      var cached = cache.get(cacheKey);
      if (cached) {
        return createJsonResponse(JSON.parse(cached));
      }
    }

    // 6. Buka Spreadsheet Aktif & Deteksi Sheet DPS / DPT
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheetDpt = ss.getSheetByName('DPS') || 
                   ss.getSheetByName('dps') || 
                   ss.getSheetByName('DPT') || 
                   ss.getSheetByName('dpt') || 
                   ss.getSheetByName('Sheet1') || 
                   ss.getSheetByName('Sheet 1') || 
                   ss.getSheets()[0]; // Fallback ke sheet pertama

    if (!sheetDpt) {
      return createJsonResponse({
        found: false,
        message: 'Sheet data pemilih tidak ditemukan pada spreadsheet.'
      });
    }

    // Gunakan getDisplayValues() agar angka 16 digit TIDAK terpotong jadi notasi ilmiah (3.32E+15)
    var displayData = sheetDpt.getDataRange().getDisplayValues();
    if (displayData.length <= 1) {
      return createJsonResponse({
        found: false,
        message: 'Sheet DPT belum memiliki baris data pemilih.'
      });
    }

    // 7. Auto-Deteksi Index Kolom berdasarkan Header Baris 1
    var headerRow = displayData[0];
    var colNik = 1;
    var colNama = 3;
    var colDusun = 8;
    var colRt = 9;
    var colRw = 10;
    var colTps = 11;
    var colStatus = 12;

    for (var c = 0; c < headerRow.length; c++) {
      var h = String(headerRow[c] || '').toLowerCase().replace(/[^a-z0-9]/g, '');
      if (h === 'nik' || h.indexOf('nik') !== -1) colNik = c;
      else if (h === 'nama' || h.indexOf('nama') !== -1) colNama = c;
      else if (h === 'dusun' || h.indexOf('dusun') !== -1) colDusun = c;
      else if (h === 'rt') colRt = c;
      else if (h === 'rw') colRw = c;
      else if (h === 'tps' || h.indexOf('tps') !== -1) colTps = c;
      else if (h === 'status' || h.indexOf('status') !== -1) colStatus = c;
    }

    // 8. Cari Baris NIK
    for (var i = 1; i < displayData.length; i++) {
      var row = displayData[i];
      var cellNik = String(row[colNik] || '').replace(/[^0-9]/g, '');

      if (cellNik === cleanNik) {
        var maskedNik = cleanNik.substring(0, 4) + '********' + cleanNik.substring(12);
        var rawTps = String(row[colTps] || '1').replace(/[^0-9]/g, '');
        var tpsStr = 'TPS ' + (rawTps || '1');

        var result = {
          found: true,
          nama: String(row[colNama] || '').trim(),
          nik_masked: maskedNik,
          dusun: String(row[colDusun] || '').trim(),
          rt: String(row[colRt] || '01').padStart(2, '0'),
          rw: String(row[colRw] || '01').padStart(2, '0'),
          tps: tpsStr,
          status: String(row[colStatus] || 'TERDAFTAR DALAM DPS (Daftar Pemilih Sementara)').trim()
        };

        // Cache hasil singkat 60 detik agar jika admin mengedit data di spreadsheet cepat ter-update
        cache.put(cacheKey, JSON.stringify(result), 60);
        return createJsonResponse(result);
      }
    }

    return createJsonResponse({
      found: false,
      message: 'Data Anda belum ditemukan dalam database DPS (Daftar Pemilih Sementara) yang tersedia pada website ini.'
    });

  } catch (err) {
    return createJsonResponse({
      found: false,
      error: 'Terjadi kendala pada server Google Script: ' + err.toString()
    });
  }
}

function getConfigData() {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName('PENGATURAN') || 
                ss.getSheetByName('Pengaturan') || 
                ss.getSheetByName('pengaturan') || 
                ss.getSheetByName('CONFIG') || 
                ss.getSheetByName('Config');
    if (!sheet) return { success: true, config: {} };

    var data = sheet.getDataRange().getDisplayValues();
    if (data.length <= 1) return { success: true, config: {} };

    var config = {};

    // Cek apakah format Vertikal (Kolom A = Key, Kolom B = Value)
    // atau format Horizontal (Baris 1 = Header, Baris 2 = Nilai)
    if (data[0].length >= 2 && data.length > 2) {
      // Format vertikal
      for (var i = 0; i < data.length; i++) {
        var k = String(data[i][0] || '').trim().toLowerCase().replace(/[^a-z0-9_]/g, '_');
        var v = String(data[i][1] || '').trim();
        if (k) config[k] = v;
      }
    }
    
    // Jika format horizontal (Baris 0 header, Baris 1 nilai)
    if (data.length >= 2) {
      for (var col = 0; col < data[0].length; col++) {
        var headerKey = String(data[0][col] || '').trim().toLowerCase().replace(/[^a-z0-9_]/g, '_');
        var headerVal = String(data[1][col] || '').trim();
        if (headerKey && headerVal && !config[headerKey]) {
          config[headerKey] = headerVal;
        }
      }
    }

    return { success: true, config: config };
  } catch (e) {
    return { success: false, config: {} };
  }
}

function getTpsData() {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName('TPS') || 
                ss.getSheetByName('Tps') || 
                ss.getSheetByName('tps') || 
                ss.getSheetByName('LOKASI TPS') || 
                ss.getSheetByName('Data TPS');
    if (!sheet) return { success: false, list: [] };

    var data = sheet.getDataRange().getDisplayValues();
    var list = [];
    for (var i = 1; i < data.length; i++) {
      var row = data[i];
      var rawNum = String(row[0] || '').replace(/[^0-9]/g, '');
      if (rawNum || (row[1] && String(row[0]).toLowerCase() !== 'tps')) {
        list.push({
          tps: rawNum ? 'TPS ' + rawNum : String(row[0] || '').trim(),
          nama_lokasi: String(row[1] || '').trim(),
          alamat: String(row[2] || '').trim(),
          dusun: String(row[3] || '').trim(),
          rt: String(row[4] || '').trim(),
          rw: String(row[5] || '').trim(),
          keterangan: String(row[6] || '').trim()
        });
      }
    }
    return { success: true, list: list };
  } catch (e) {
    return { success: false, list: [] };
  }
}

function getRecapData() {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName('DPS') || 
                ss.getSheetByName('dps') || 
                ss.getSheetByName('DPT') || 
                ss.getSheetByName('dpt') || 
                ss.getSheetByName('Sheet1') || 
                ss.getSheets()[0];
    if (!sheet) return { success: false, message: 'Sheet pemilih tidak ditemukan.' };

    var data = sheet.getDataRange().getDisplayValues();
    if (data.length <= 1) return { success: false, message: 'Sheet kosong.' };

    var headerRow = data[0];
    var colJk = -1;
    var colTps = -1;

    for (var c = 0; c < headerRow.length; c++) {
      var h = String(headerRow[c] || '').toLowerCase().replace(/[^a-z0-9]/g, '');
      if (h.indexOf('kelamin') !== -1 || h === 'jk' || h === 'gender' || h === 'lp') colJk = c;
      else if (h.indexOf('tps') !== -1) colTps = c;
    }

    if (colJk === -1) colJk = 6;
    if (colTps === -1) colTps = 11;

    var totalL = 0;
    var totalP = 0;
    var tpsCounts = { 1: { L: 0, P: 0 }, 2: { L: 0, P: 0 }, 3: { L: 0, P: 0 }, 4: { L: 0, P: 0 }, 5: { L: 0, P: 0 } };

    for (var i = 1; i < data.length; i++) {
      var row = data[i];
      var rawJk = String(row[colJk] || '').trim().toUpperCase();
      var isL = rawJk.indexOf('L') === 0;
      var isP = rawJk.indexOf('P') === 0 || rawJk.indexOf('W') === 0;

      if (!isL && !isP) continue;

      if (isL) totalL++;
      if (isP) totalP++;

      var rawTps = String(row[colTps] || '').replace(/[^0-9]/g, '');
      var tpsNum = parseInt(rawTps, 10) || 1;
      if (tpsNum < 1 || tpsNum > 5) tpsNum = 1;

      if (isL) tpsCounts[tpsNum].L++;
      if (isP) tpsCounts[tpsNum].P++;
    }

    var defaultTpsNames = [
      { tps: 'TPS 1', lokasi: 'Pendopo Balai Desa Gunungjaya', dusun: 'Dusun Krajan' },
      { tps: 'TPS 2', lokasi: 'Gedung SDN 01 Gunungjaya', dusun: 'Dusun Gombong' },
      { tps: 'TPS 3', lokasi: 'Gedung MDA Nurul Huda', dusun: 'Dusun Soka' },
      { tps: 'TPS 4', lokasi: 'Balai Pertemuan Warga Dusun Karanganyar', dusun: 'Dusun Karanganyar' },
      { tps: 'TPS 5', lokasi: 'Halaman Gedung Posyandu Watukumpul', dusun: 'Dusun Watukumpul' }
    ];

    var tpsStats = [];
    for (var k = 1; k <= 5; k++) {
      var d = defaultTpsNames[k - 1];
      var counts = tpsCounts[k];
      tpsStats.push({
        tps: d.tps,
        lokasi: d.lokasi,
        dusun: d.dusun,
        lakiLaki: counts.L,
        perempuan: counts.P,
        total: counts.L + counts.P
      });
    }

    return {
      success: true,
      recap: {
        totalDps: totalL + totalP,
        totalLakiLaki: totalL,
        totalPerempuan: totalP,
        tpsStats: tpsStats,
        lastUpdated: 'Sinkronisasi Otomatis Google Apps Script'
      }
    };
  } catch (e) {
    return { success: false, message: e.toString() };
  }
}

function createJsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
`;
