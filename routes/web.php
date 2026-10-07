<?php

use App\Http\Controllers\Admin\AdminDashboardController;
use App\Http\Controllers\Admin\AdminProfileController;
use App\Http\Controllers\Admin\AdminTpsController;
use App\Http\Controllers\Admin\AdminVoterController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\DpsSearchController;
use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Halaman Publik Cek DPS Pilkades Gunungjaya 2026
Route::get('/', [DpsSearchController::class, 'index'])->name('home');

// Endpoint API Pencarian NIK dengan Rate Limiting Ketat (Anti-Scraping / Anti-Brute Force)
Route::post('/api/check-dps', [DpsSearchController::class, 'checkDps'])
    ->middleware('throttle:30,1')
    ->name('dps.check');

// Endpoint Pengaduan / Sanggahan Warga dengan Rate Limiting (Anti-Spam / Anti-DoS)
Route::post('/api/lapor', [DpsSearchController::class, 'submitReport'])
    ->middleware('throttle:5,1')
    ->name('dps.lapor');

// Akses /admin dan /admin/login:
Route::get('/admin/login', [AuthenticatedSessionController::class, 'create'])->name('admin.login');
Route::post('/admin/login', [AuthenticatedSessionController::class, 'store'])->middleware('throttle:5,1');

Route::get('/admin', function () {
    if (auth()->check()) {
        return redirect()->route('admin.dashboard');
    }
    return redirect()->route('login');
});

// Alias route dashboard untuk kompatibilitas auth
Route::get('/dashboard', function () {
    return redirect()->route('admin.dashboard');
})->middleware('auth')->name('dashboard');

// Panel Administrator (CRUD Lokasi TPS & CRUD DPS)
Route::prefix('admin')->middleware(['auth', 'admin'])->group(function () {
    Route::get('/dashboard', [AdminDashboardController::class, 'index'])->name('admin.dashboard');

    // CRUD Lokasi TPS
    Route::post('/tps', [AdminTpsController::class, 'store'])->name('admin.tps.store');
    Route::put('/tps/{tps}', [AdminTpsController::class, 'update'])->name('admin.tps.update');
    Route::delete('/tps/{tps}', [AdminTpsController::class, 'destroy'])->name('admin.tps.destroy');

    // CRUD Daftar Pemilih Sementara (DPS)
    Route::post('/voters', [AdminVoterController::class, 'store'])->name('admin.voters.store');
    Route::put('/voters/{voter}', [AdminVoterController::class, 'update'])->name('admin.voters.update');
    Route::delete('/voters/{voter}', [AdminVoterController::class, 'destroy'])->name('admin.voters.destroy');

    // Import & Template Excel DPS
    Route::post('/voters/import-chunk', [AdminVoterController::class, 'importChunk'])->name('admin.voters.import.chunk');
    Route::post('/voters/import-file', [AdminVoterController::class, 'importFile'])->name('admin.voters.import.file');
    Route::get('/voters/template-excel', [AdminVoterController::class, 'downloadTemplate'])->name('admin.voters.template');

    // Pengaturan Profil Admin (WhatsApp, Email, Password)
    Route::get('/profile', [AdminProfileController::class, 'edit'])->name('admin.profile.edit');
    Route::patch('/profile', [AdminProfileController::class, 'update'])->name('admin.profile.update');
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
