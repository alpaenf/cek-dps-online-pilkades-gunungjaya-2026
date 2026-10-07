<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Tps;
use App\Models\Voter;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use PhpOffice\PhpSpreadsheet\Cell\Coordinate;
use PhpOffice\PhpSpreadsheet\Cell\DataType;
use PhpOffice\PhpSpreadsheet\IOFactory;
use PhpOffice\PhpSpreadsheet\Shared\Date;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Style\Border;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use Symfony\Component\HttpFoundation\StreamedResponse;

class AdminVoterController extends Controller
{
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'nik' => ['required', 'digits:16', 'unique:voters,nik'],
            'nama' => ['required', 'string', 'max:150'],
            'jenis_kelamin' => ['required', Rule::in(['L', 'P'])],
            'tps_id' => ['required', 'exists:tps,id'],
            'dusun' => ['nullable', 'string', 'max:100'],
            'rt' => ['nullable', 'string', 'max:10'],
            'rw' => ['nullable', 'string', 'max:10'],
            'tempat_lahir' => ['nullable', 'string', 'max:100'],
            'tanggal_lahir' => ['nullable', 'date'],
            'alamat' => ['nullable', 'string'],
            'no_kk' => ['nullable', 'digits:16'],
            'status' => ['nullable', Rule::in(['DPS', 'DPT', 'DPTb', 'DPK', 'TMS'])],
            'keterangan' => ['nullable', 'string'],
        ], [
            'nik.required' => 'Nomor NIK 16 digit wajib diisi.',
            'nik.digits' => 'NIK harus tepat 16 digit angka.',
            'nik.unique' => 'NIK sudah terdaftar dalam data pemilih.',
            'nama.required' => 'Nama lengkap pemilih wajib diisi.',
            'jenis_kelamin.required' => 'Pilih jenis kelamin (L atau P).',
            'tps_id.required' => 'Silakan pilih lokasi TPS untuk pemilih ini.',
            'tps_id.exists' => 'TPS yang dipilih tidak valid.',
        ]);

        if (empty($validated['status'])) {
            $validated['status'] = 'DPS';
        }

        Voter::create($validated);

        return redirect()->back()->with('success', "Pemilih {$validated['nama']} (NIK: {$validated['nik']}) berhasil ditambahkan ke DPS!");
    }

    public function update(Request $request, Voter $voter): RedirectResponse
    {
        $validated = $request->validate([
            'nik' => ['required', 'digits:16', Rule::unique('voters', 'nik')->ignore($voter->id)],
            'nama' => ['required', 'string', 'max:150'],
            'jenis_kelamin' => ['required', Rule::in(['L', 'P'])],
            'tps_id' => ['required', 'exists:tps,id'],
            'dusun' => ['nullable', 'string', 'max:100'],
            'rt' => ['nullable', 'string', 'max:10'],
            'rw' => ['nullable', 'string', 'max:10'],
            'tempat_lahir' => ['nullable', 'string', 'max:100'],
            'tanggal_lahir' => ['nullable', 'date'],
            'alamat' => ['nullable', 'string'],
            'no_kk' => ['nullable', 'digits:16'],
            'status' => ['nullable', Rule::in(['DPS', 'DPT', 'DPTb', 'DPK', 'TMS'])],
            'keterangan' => ['nullable', 'string'],
        ], [
            'nik.required' => 'Nomor NIK 16 digit wajib diisi.',
            'nik.digits' => 'NIK harus tepat 16 digit angka.',
            'nik.unique' => 'NIK sudah digunakan oleh pemilih lain.',
            'nama.required' => 'Nama lengkap pemilih wajib diisi.',
            'jenis_kelamin.required' => 'Pilih jenis kelamin.',
            'tps_id.required' => 'Pilih TPS untuk pemilih ini.',
        ]);

        $voter->update($validated);

        return redirect()->back()->with('success', "Data pemilih {$voter->nama} berhasil diperbarui!");
    }

    public function destroy(Voter $voter): RedirectResponse
    {
        $nama = $voter->nama;
        $voter->delete();

        return redirect()->back()->with('success', "Data pemilih {$nama} berhasil dihapus dari DPS.");
    }

    /**
     * Download format template Excel yang persis dengan foto format DPS desa
     */
    public function downloadTemplate(): StreamedResponse
    {
        $spreadsheet = new Spreadsheet;
        $sheet = $spreadsheet->getActiveSheet();
        $sheet->setTitle('DPS Pilkades 2026');

        // Judul Lembar Kerja
        $sheet->setCellValue('A1', 'DAFTAR PEMILIH SEMENTARA');
        $sheet->setCellValue('A2', 'PEMILIHAN KEPALA DESA');
        $sheet->setCellValue('A3', 'DESA GUNUNGJAYA KECAMATAN BELIK TAHUN 2026');

        $sheet->mergeCells('A1:N1');
        $sheet->mergeCells('A2:N2');
        $sheet->mergeCells('A3:N3');

        $titleStyle = [
            'font' => ['bold' => true, 'size' => 11, 'name' => 'Calibri'],
            'alignment' => ['horizontal' => Alignment::HORIZONTAL_CENTER, 'vertical' => Alignment::VERTICAL_CENTER],
        ];
        $sheet->getStyle('A1:A3')->applyFromArray($titleStyle);

        // Header Kolom Baris 4 & 5 (Sesuai dengan Foto Asli)
        $sheet->setCellValue('A4', 'NO DPT');
        $sheet->mergeCells('A4:A5');
        $sheet->setCellValue('B4', 'NO');
        $sheet->mergeCells('B4:B5');
        $sheet->setCellValue('C4', 'NIK');
        $sheet->mergeCells('C4:C5');
        $sheet->setCellValue('D4', 'NAMA PEMILIH');
        $sheet->mergeCells('D4:D5');
        $sheet->setCellValue('E4', 'JENIS KELAMIN');
        $sheet->mergeCells('E4:E5');

        // Header Gabungan LAHIR (F4:G4)
        $sheet->setCellValue('F4', 'LAHIR');
        $sheet->mergeCells('F4:G4');
        $sheet->setCellValue('F5', 'TEMPAT');
        $sheet->setCellValue('G5', 'TANGGAL');

        // Header Gabungan ALAMAT (H4:J4)
        $sheet->setCellValue('H4', 'ALAMAT');
        $sheet->mergeCells('H4:J4');
        $sheet->setCellValue('H5', 'DUSUN');
        $sheet->setCellValue('I5', 'RT');
        $sheet->setCellValue('J5', 'RW');

        $sheet->setCellValue('K4', 'KET');
        $sheet->mergeCells('K4:K5');
        $sheet->setCellValue('L4', 'TPS');
        $sheet->mergeCells('L4:L5');
        $sheet->setCellValue('M4', 'STATUS');
        $sheet->mergeCells('M4:M5');
        $sheet->setCellValue('N4', 'KETERANGAN');
        $sheet->mergeCells('N4:N5');

        // Desain Header Warna Biru Sesuai Foto
        $headerStyle = [
            'font' => ['bold' => true, 'color' => ['rgb' => 'FFFFFF'], 'size' => 10],
            'fill' => [
                'fillType' => Fill::FILL_SOLID,
                'startColor' => ['rgb' => '5B85BA'],
            ],
            'alignment' => [
                'horizontal' => Alignment::HORIZONTAL_CENTER,
                'vertical' => Alignment::VERTICAL_CENTER,
                'wrapText' => true,
            ],
            'borders' => [
                'allBorders' => ['borderStyle' => Border::BORDER_THIN, 'color' => ['rgb' => '1E293B']],
            ],
        ];
        $sheet->getStyle('A4:N5')->applyFromArray($headerStyle);

        // Contoh Data Nyata dari Foto Pengguna
        $sampleData = [
            [1, 1, '3327034502780006', 'HARYATI', 'PEREMPUAN', 'PEMALANG', '05-02-1978', 'DEPOK GUNUNGJAYA', '001', '001', '', '001', 'AKTIF', 'TERVERIFIKASI'],
            [2, 2, '3327034804070002', 'FAZA FADHILAH', 'PEREMPUAN', 'PEMALANG', '08-04-2007', 'DEPOK GUNUNGJAYA', '001', '001', '', '001', 'AKTIF', 'TERVERIFIKASI'],
            [3, 3, '3327031205850001', 'SLAMET RIYADI', 'LAKI-LAKI', 'PEMALANG', '12-05-1985', 'KRAJAN GUNUNGJAYA', '002', '001', '', '002', 'AKTIF', 'TERVERIFIKASI'],
        ];

        $rowIdx = 6;
        foreach ($sampleData as $row) {
            foreach ($row as $colIdx => $val) {
                $colLetter = Coordinate::stringFromColumnIndex($colIdx + 1);
                if ($colIdx === 2) {
                    // Set NIK eksplisit sebagai string agar 16 digit tidak menjadi notasi ilmiah (3.32E+15)
                    $sheet->setCellValueExplicit($colLetter.$rowIdx, (string) $val, DataType::TYPE_STRING);
                } else {
                    $sheet->setCellValue($colLetter.$rowIdx, $val);
                }
            }

            $sheet->getStyle("A{$rowIdx}:N{$rowIdx}")->getBorders()->getAllBorders()->setBorderStyle(Border::BORDER_THIN)->getColor()->setRGB('CBD5E1');
            $sheet->getStyle("A{$rowIdx}:C{$rowIdx}")->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);
            $sheet->getStyle("E{$rowIdx}")->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);
            $sheet->getStyle("G{$rowIdx}")->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);
            $sheet->getStyle("I{$rowIdx}:J{$rowIdx}")->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);
            $sheet->getStyle("L{$rowIdx}:M{$rowIdx}")->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);

            $rowIdx++;
        }

        // Auto width kolom
        foreach (range(1, 14) as $col) {
            $sheet->getColumnDimensionByColumn($col)->setAutoSize(true);
        }

        $writer = new Xlsx($spreadsheet);
        $fileName = 'Template_Import_DPS_Pilkades_Gunungjaya_2026.xlsx';

        return new StreamedResponse(function () use ($writer) {
            $writer->save('php://output');
        }, 200, [
            'Content-Type' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'Content-Disposition' => "attachment; filename=\"{$fileName}\"",
            'Cache-Control' => 'max-age=0',
        ]);
    }

    /**
     * Import DPS dari batch data JSON (Client-Side Chunking via SheetJS)
     * Menghindari timeout server untuk file ribuan pemilih
     */
    public function importChunk(Request $request): JsonResponse
    {
        $votersData = $request->input('voters', []);
        $updateExisting = (bool) $request->input('update_existing', true);
        $resetFirst = (bool) $request->input('reset_first', false);

        if (empty($votersData) || ! is_array($votersData)) {
            return response()->json(['success' => false, 'message' => 'Tidak ada data pemilih yang dikirim.'], 400);
        }

        DB::beginTransaction();
        try {
            if ($resetFirst) {
                Voter::query()->delete();
            }

            $inserted = 0;
            $updated = 0;
            $skipped = 0;
            $skippedRows = [];

            foreach ($votersData as $index => $item) {
                $normalized = $this->normalizeVoterRow((array) $item);
                if (! $normalized) {
                    $skipped++;
                    // Catat alasan skip
                    $rawNik = preg_replace('/\D/', '', (string) ($item['nik'] ?? ''));
                    $nama = trim((string) ($item['nama'] ?? $item['nama_pemilih'] ?? ''));
                    $reason = empty($nama) ? 'Nama pemilih kosong' : (strlen($rawNik) !== 16
                        ? (empty($rawNik) ? 'NIK kosong' : "NIK tidak valid — {$rawNik} ({$rawNik} = ".strlen($rawNik).' digit, harus 16)')
                        : 'Data tidak memenuhi syarat');
                    $skippedRows[] = [
                        'rowNumber' => $index + 1,
                        'nik' => $rawNik ?: '(kosong)',
                        'nama' => $nama ?: '(kosong)',
                        'reason' => $reason,
                    ];

                    continue;
                }

                $existing = Voter::where('nik', $normalized['nik'])->first();
                if ($existing) {
                    if ($updateExisting) {
                        $existing->update($normalized);
                        $updated++;
                    } else {
                        $skipped++;
                        $skippedRows[] = [
                            'rowNumber' => $index + 1,
                            'nik' => $normalized['nik'],
                            'nama' => $normalized['nama'],
                            'reason' => 'NIK sudah ada di database & opsi update dinonaktifkan',
                        ];
                    }
                } else {
                    Voter::create($normalized);
                    $inserted++;
                }
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'inserted' => $inserted,
                'updated' => $updated,
                'skipped' => $skipped,
                'total' => count($votersData),
                'skipped_rows' => $skippedRows,
            ]);
        } catch (\Throwable $e) {
            DB::rollBack();

            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan saat menyimpan data: '.$e->getMessage(),
            ], 500);
        }
    }

    /**
     * Direct File Upload Import via PhpSpreadsheet
     */
    public function importFile(Request $request): RedirectResponse
    {
        $request->validate([
            'excel_file' => ['required', 'file', 'mimes:xlsx,xls,csv,txt'],
        ], [
            'excel_file.required' => 'Pilih file Excel (.xlsx / .xls / .csv) terlebih dahulu.',
            'excel_file.mimes' => 'Format file harus berupa Excel (.xlsx / .xls) atau CSV.',
        ]);

        $file = $request->file('excel_file');
        $updateExisting = (bool) $request->input('update_existing', true);
        $resetFirst = (bool) $request->input('reset_first', false);

        try {
            $spreadsheet = IOFactory::load($file->getRealPath());
            $sheet = $spreadsheet->getActiveSheet();
            $rawRows = $sheet->toArray(null, true, true, false);

            if (empty($rawRows)) {
                return redirect()->back()->with('error', 'File Excel kosong atau tidak terbaca.');
            }

            $headerRowIndex = $this->detectHeaderRowIndex($rawRows);
            if ($headerRowIndex === -1) {
                return redirect()->back()->with('error', 'Gagal menemukan baris kolom NIK atau Nama Pemilih dalam file Excel.');
            }

            $colKeys = $this->buildColumnKeys($rawRows, $headerRowIndex);

            // Deteksi jika ada baris sub-header kedua (baris TEMPAT, TANGGAL, DUSUN, dsb)
            $dataStartIndex = $headerRowIndex + 1;
            if (isset($rawRows[$headerRowIndex + 1])) {
                $rowNext = array_filter(array_map('strtoupper', array_map('trim', array_map('strval', $rawRows[$headerRowIndex + 1]))));
                if (in_array('TEMPAT', $rowNext) || in_array('DUSUN', $rowNext) || in_array('RT', $rowNext)) {
                    $dataStartIndex = $headerRowIndex + 2;
                }
            }

            DB::beginTransaction();

            if ($resetFirst) {
                Voter::query()->delete();
            }

            $inserted = 0;
            $updated = 0;
            $skipped = 0;

            for ($i = $dataStartIndex; $i < count($rawRows); $i++) {
                $row = $rawRows[$i];
                if (empty(array_filter($row))) {
                    continue;
                }

                $mappedRow = [];
                foreach ($colKeys as $colIdx => $key) {
                    $mappedRow[$key] = $row[$colIdx] ?? null;
                }

                $normalized = $this->normalizeVoterRow($mappedRow);
                if (! $normalized) {
                    $skipped++;

                    continue;
                }

                $existing = Voter::where('nik', $normalized['nik'])->first();
                if ($existing) {
                    if ($updateExisting) {
                        $existing->update($normalized);
                        $updated++;
                    } else {
                        $skipped++;
                    }
                } else {
                    Voter::create($normalized);
                    $inserted++;
                }
            }

            DB::commit();

            return redirect()->back()->with('success', "Import Excel Berhasil! {$inserted} data pemilih baru ditambahkan, {$updated} diperbarui".($skipped > 0 ? ", {$skipped} dilewati." : '.'));
        } catch (\Throwable $e) {
            DB::rollBack();

            return redirect()->back()->with('error', 'Gagal memproses file Excel: '.$e->getMessage());
        }
    }

    /**
     * Normalisasi baris data pemilih dari Excel ke format database
     */
    private function normalizeVoterRow(array $row): ?array
    {
        // 1. Ambil NIK
        $nik = null;
        foreach (['nik', 'no_nik', 'nomor_induk_kependudukan', 'nik_pemilih'] as $k) {
            if (! empty($row[$k])) {
                $nik = preg_replace('/\D/', '', (string) $row[$k]);
                break;
            }
        }
        if (empty($nik) || strlen($nik) !== 16) {
            return null; // Baris tanpa 16 digit NIK dilewati
        }

        // 2. Nama Pemilih
        $nama = '';
        foreach (['nama_pemilih', 'nama', 'nama_lengkap', 'namapemilih'] as $k) {
            if (! empty($row[$k])) {
                $nama = trim((string) $row[$k]);
                break;
            }
        }
        if (empty($nama)) {
            return null;
        }

        // 3. Jenis Kelamin
        $jkRaw = strtoupper(trim((string) ($row['jenis_kelamin'] ?? $row['jk'] ?? '')));
        $jk = str_starts_with($jkRaw, 'P') ? 'P' : 'L';

        // 4. Tanggal Lahir
        $tglRaw = $row['tanggal'] ?? $row['tanggal_lahir'] ?? $row['tgl_lahir'] ?? $row['tgl'] ?? null;
        $tglLahir = $this->parseDateValue($tglRaw);

        // 5. Tempat Lahir
        $tempatLahir = trim((string) ($row['tempat'] ?? $row['tempat_lahir'] ?? ''));

        // 6. Alamat Dusun, RT, RW
        $dusun = trim((string) ($row['dusun'] ?? $row['dukuh'] ?? ''));
        $rt = trim((string) ($row['rt'] ?? ''));
        $rw = trim((string) ($row['rw'] ?? ''));

        // 7. No Urut DPT
        $noUrut = null;
        foreach (['no_dpt', 'no', 'no_urut', 'nomor_dpt', 'nodpt'] as $k) {
            if (isset($row[$k]) && is_numeric($row[$k])) {
                $noUrut = (int) $row[$k];
                break;
            }
        }

        // 8. Lokasi TPS
        $tpsRaw = trim((string) ($row['tps'] ?? $row['nomor_tps'] ?? ''));
        $tpsId = $this->resolveTpsId($tpsRaw, $dusun);

        // 9. Status Pemilih
        $statusRaw = strtoupper(trim((string) ($row['status'] ?? '')));
        $status = 'DPS';
        if (in_array($statusRaw, ['DPS', 'DPT', 'DPTB', 'DPK', 'TMS'])) {
            $status = $statusRaw === 'DPTB' ? 'DPTb' : $statusRaw;
        }

        // 10. Keterangan
        $ketParts = [];
        if (! empty($row['ket'])) {
            $ketParts[] = trim((string) $row['ket']);
        }
        if (! empty($row['keterangan']) && ! in_array(trim((string) $row['keterangan']), $ketParts)) {
            $ketParts[] = trim((string) $row['keterangan']);
        }
        $keterangan = implode(' - ', $ketParts);

        // Bentuk alamat lengkap
        $alamatParts = [];
        if ($dusun) {
            $alamatParts[] = $dusun;
        }
        if ($rt) {
            $alamatParts[] = 'RT '.str_pad($rt, 3, '0', STR_PAD_LEFT);
        }
        if ($rw) {
            $alamatParts[] = 'RW '.str_pad($rw, 3, '0', STR_PAD_LEFT);
        }
        $alamat = implode(', ', $alamatParts);

        return [
            'nik' => $nik,
            'nama' => strtoupper($nama),
            'jenis_kelamin' => $jk,
            'tps_id' => $tpsId,
            'no_urut' => $noUrut,
            'tempat_lahir' => $tempatLahir ? strtoupper($tempatLahir) : null,
            'tanggal_lahir' => $tglLahir,
            'alamat' => $alamat ?: null,
            'dusun' => $dusun ? strtoupper($dusun) : null,
            'rt' => $rt ?: null,
            'rw' => $rw ?: null,
            'status' => $status,
            'keterangan' => $keterangan ?: null,
        ];
    }

    /**
     * Cari ID TPS yang cocok atau buat otomatis jika TPS belum terdaftar di database
     */
    private function resolveTpsId(?string $tpsRaw, ?string $dusun = null): ?int
    {
        if (empty($tpsRaw)) {
            $first = Tps::first();

            return $first ? $first->id : null;
        }

        $num = (int) preg_replace('/\D/', '', $tpsRaw);
        if ($num <= 0) {
            $first = Tps::first();

            return $first ? $first->id : null;
        }

        $formattedNum = (string) $num;
        $tpsName = "TPS {$num}";
        $padName = 'TPS '.str_pad($formattedNum, 2, '0', STR_PAD_LEFT);
        $pad3 = str_pad($formattedNum, 3, '0', STR_PAD_LEFT);

        $tps = Tps::where('nomor_tps', $tpsName)
            ->orWhere('nomor_tps', $padName)
            ->orWhere('nomor_tps', $formattedNum)
            ->orWhere('nomor_tps', $pad3)
            ->orWhere('nomor_tps', 'LIKE', "%{$num}%")
            ->first();

        if ($tps) {
            return $tps->id;
        }

        // Buat TPS baru secara otomatis jika belum ada
        $newTps = Tps::create([
            'nomor_tps' => $tpsName,
            'nama_lokasi' => "Lokasi TPS {$num}",
            'dusun' => $dusun ?: 'Desa Gunungjaya',
        ]);

        return $newTps->id;
    }

    /**
     * Konversi variasi tanggal Excel (serial number, format d-m-Y, d/m/Y, dsb)
     */
    private function parseDateValue($val): ?string
    {
        if (empty($val)) {
            return null;
        }

        // Tanggal berupa serial angka Excel (misal: 28526)
        if (is_numeric($val) && $val > 1000) {
            try {
                return Date::excelToDateTimeObject((int) $val)->format('Y-m-d');
            } catch (\Throwable $e) {
            }
        }

        $val = trim((string) $val);
        foreach (['d-m-Y', 'd/m/Y', 'Y-m-d', 'Y/m/d', 'd.m.Y'] as $fmt) {
            try {
                return Carbon::createFromFormat($fmt, $val)->format('Y-m-d');
            } catch (\Throwable $e) {
            }
        }

        try {
            return Carbon::parse($val)->format('Y-m-d');
        } catch (\Throwable $e) {
            return null;
        }
    }

    /**
     * Cari nomor baris header dalam Excel (mencari letak NIK / Nama Pemilih)
     */
    private function detectHeaderRowIndex(array $rows): int
    {
        for ($i = 0; $i < min(15, count($rows)); $i++) {
            $upperRow = array_map(function ($val) {
                return strtoupper(trim((string) $val));
            }, $rows[$i]);

            foreach ($upperRow as $cell) {
                if (str_contains($cell, 'NIK') || str_contains($cell, 'NAMA PEMILIH') || str_contains($cell, 'NO DPT')) {
                    return $i;
                }
            }
        }

        return -1;
    }

    /**
     * Petakan indeks kolom Excel ke atribut pemilih
     */
    private function buildColumnKeys(array $rows, int $headerIdx): array
    {
        $mainHeader = $rows[$headerIdx];
        $subHeader = isset($rows[$headerIdx + 1]) ? $rows[$headerIdx + 1] : [];

        $keys = [];
        foreach ($mainHeader as $idx => $mainVal) {
            $m = strtolower(trim((string) $mainVal));
            $s = isset($subHeader[$idx]) ? strtolower(trim((string) $subHeader[$idx])) : '';

            if ($s === 'tempat' || $s === 'tempat lahir') {
                $keys[$idx] = 'tempat';
            } elseif ($s === 'tanggal' || $s === 'tgl' || $s === 'tanggal lahir') {
                $keys[$idx] = 'tanggal';
            } elseif ($s === 'dusun' || $s === 'dukuh') {
                $keys[$idx] = 'dusun';
            } elseif ($s === 'rt') {
                $keys[$idx] = 'rt';
            } elseif ($s === 'rw') {
                $keys[$idx] = 'rw';
            } elseif (str_contains($m, 'nik')) {
                $keys[$idx] = 'nik';
            } elseif (str_contains($m, 'nama')) {
                $keys[$idx] = 'nama_pemilih';
            } elseif (str_contains($m, 'kelamin') || $m === 'jk') {
                $keys[$idx] = 'jenis_kelamin';
            } elseif (str_contains($m, 'no dpt') || str_contains($m, 'nodpt')) {
                $keys[$idx] = 'no_dpt';
            } elseif ($m === 'no' || $m === 'nomor') {
                $keys[$idx] = 'no';
            } elseif ($m === 'tps') {
                $keys[$idx] = 'tps';
            } elseif ($m === 'status') {
                $keys[$idx] = 'status';
            } elseif ($m === 'keterangan') {
                $keys[$idx] = 'keterangan';
            } elseif ($m === 'ket') {
                $keys[$idx] = 'ket';
            } else {
                $keys[$idx] = $s ?: ($m ?: 'col_'.$idx);
            }
        }

        return $keys;
    }
}
