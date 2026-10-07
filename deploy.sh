#!/bin/bash

# ==============================================================================
# Script Otomatis Deployment - Cek DPS Online Pilkades Gunungjaya 2026
# Repository : https://github.com/alpaenf/cek-dps-online-pilkades-gunungjaya-2026
# Framework  : Laravel 12 + Inertia React (Vite)
# ==============================================================================
# Cara Penggunaan:
#   chmod +x deploy.sh
#   ./deploy.sh
#
# Opsi Tambahan:
#   ./deploy.sh --skip-build    (Lewati proses build frontend / npm)
#   ./deploy.sh --skip-migrate  (Lewati proses migrasi database)
#   ./deploy.sh --seed          (Jalankan seeder database jika inisialisasi)
# ==============================================================================

# Hentikan eksekusi jika terjadi error kritis di luar blok penanganan
set -e

# ------------------------------------------------------------------------------
# 1. Konfigurasi Path, Repository & Environment
# ------------------------------------------------------------------------------
# Repository GitHub Resmi
REPO_URL="https://github.com/alpaenf/cek-dps-online-pilkades-gunungjaya-2026.git"
BRANCH="main"

# Nama folder project otomatis diambil dari nama folder aktif saat ini
PROJECT_DIR="$(basename "$PWD")"

# Path folder publik jika menggunakan cPanel / Shared Hosting (default: ../public_html)
PUBLIC_HTML_PATH="../public_html"

# Executables
PHP_BIN="php"
COMPOSER_BIN="composer"
NPM_BIN="npm"

# Flag Opsi Default
SKIP_BUILD=false
SKIP_MIGRATE=false
RUN_SEED=false

for arg in "$@"; do
    case $arg in
        --skip-build|--skip-npm)
            SKIP_BUILD=true
            shift
            ;;
        --skip-migrate)
            SKIP_MIGRATE=true
            shift
            ;;
        --seed)
            RUN_SEED=true
            shift
            ;;
    esac
done

echo "===================================================================="
echo "🚀 MEMULAI DEPLOYMENT: CEK DPS ONLINE PILKADES GUNUNGJAYA 2026"
echo "📂 Project Directory : $PROJECT_DIR"
echo "🕒 Tanggal/Waktu     : $(date '+%Y-%m-%d %H:%M:%S')"
echo "===================================================================="

# ------------------------------------------------------------------------------
# 2. Verifikasi File .env
# ------------------------------------------------------------------------------
echo "🔍 [1/8] Memeriksa konfigurasi environment (.env)..."
if [ ! -f ".env" ]; then
    if [ -f ".env.production" ]; then
        echo "   📄 Menyalin .env.production ke .env..."
        cp .env.production .env
    elif [ -f ".env.example" ]; then
        echo "   ⚠️ File .env tidak ditemukan! Menyalin dari .env.example..."
        cp .env.example .env
        $PHP_BIN artisan key:generate --force
    else
        echo "   ❌ ERROR: File .env tidak ditemukan dan tidak ada template."
        exit 1
    fi
fi

# ------------------------------------------------------------------------------
# 3. Mode Maintenance Sementara (Opsional / Graceful)
# ------------------------------------------------------------------------------
echo "🚧 [2/8] Mengaktifkan Maintenance Mode sementara..."
if $PHP_BIN artisan --version >/dev/null 2>&1; then
    if [ -n "${MAINTENANCE_SECRET:-}" ]; then
        $PHP_BIN artisan down --render="errors::503" --secret="$MAINTENANCE_SECRET" || true
    else
        $PHP_BIN artisan down --render="errors::503" || true
    fi
fi

# ------------------------------------------------------------------------------
# 4. Tarik Pembaruan dari Git
# ------------------------------------------------------------------------------
echo "📥 [3/8] Mengambil kode terbaru dari Git ($REPO_URL)..."
if [ -d ".git" ]; then
    # Pastikan remote origin mengarah ke repository yang sesuai
    git remote set-url origin "$REPO_URL" 2>/dev/null || true
    git fetch origin "$BRANCH" 2>/dev/null || true
    # Simpan perubahan lokal jika ada agar tidak menggagalkan pull
    git stash 2>/dev/null || true
    if ! git pull origin "$BRANCH"; then
        echo "   ⚠️ Terjadi konflik lokal, menyinkronkan paksa ke origin/$BRANCH..."
        git reset --hard "origin/$BRANCH" || true
    fi
else
    echo "   ℹ️ Inisialisasi Git remote ke $REPO_URL..."
    git init
    git remote add origin "$REPO_URL" 2>/dev/null || true
    git fetch origin "$BRANCH" 2>/dev/null || true
    git pull origin "$BRANCH" 2>/dev/null || true
fi

# ------------------------------------------------------------------------------
# 5. Composer Dependencies (Optimized for Production)
# ------------------------------------------------------------------------------
echo "📦 [4/8] Menginstall dependensi Composer (PHP)..."
if command -v $COMPOSER_BIN >/dev/null 2>&1; then
    $COMPOSER_BIN install --no-dev --prefer-dist --optimize-autoloader --no-interaction --ignore-platform-req=ext-fileinfo || \
    $COMPOSER_BIN install --no-dev --prefer-dist --optimize-autoloader --no-interaction --ignore-platform-reqs
else
    echo "   ⚠️ $COMPOSER_BIN tidak ditemukan di PATH sistem. Melewati composer install."
fi

# ------------------------------------------------------------------------------
# 6. Kompilasi Frontend Assets (Vite / React)
# ------------------------------------------------------------------------------
echo "🎨 [5/8] Memeriksa & mengompilasi aset frontend (Vite)..."
# Hapus file hot dev server agar Laravel selalu memakai build produksi
rm -f public/hot "$PUBLIC_HTML_PATH/hot" 2>/dev/null || true

if [ "$SKIP_BUILD" = false ]; then
    if command -v $NPM_BIN >/dev/null 2>&1; then
        echo "   ⚡ Menjalankan npm run build..."
        $NPM_BIN run build
    else
        echo "   ℹ️ npm tidak ditemukan di server. Menggunakan aset build produksi dari repository."
    fi
else
    echo "   ⏭️ Melewati kompilasi frontend (--skip-build aktif)."
fi

# Pastikan file hot selalu terhapus setelah proses apapun
rm -f public/hot "$PUBLIC_HTML_PATH/hot" 2>/dev/null || true

# ------------------------------------------------------------------------------
# 7. Migrasi Database & Seeder
# ------------------------------------------------------------------------------
echo "🗄️ [6/8] Menjalankan migrasi database..."
if [ "$SKIP_MIGRATE" = false ]; then
    $PHP_BIN artisan migrate --force
    if [ "$RUN_SEED" = true ]; then
        echo "   🌱 Menjalankan database seeder..."
        $PHP_BIN artisan db:seed --force
    fi
else
    echo "   ⏭️ Melewati migrasi database (--skip-migrate aktif)."
fi

# ------------------------------------------------------------------------------
# 8. Optimasi Cache Laravel & Permission
# ------------------------------------------------------------------------------
echo "⚡ [7/8] Mengoptimasi Cache & Pengaturan Hak Akses (Storage & Cache)..."
$PHP_BIN artisan optimize:clear
$PHP_BIN artisan config:cache
$PHP_BIN artisan route:cache
$PHP_BIN artisan view:cache
$PHP_BIN artisan event:cache 2>/dev/null || true

# Buat symbolic link storage Laravel jika belum ada
$PHP_BIN artisan storage:link --force 2>/dev/null || true

# Pastikan folder writable oleh web server
chmod -R 775 storage bootstrap/cache 2>/dev/null || true

# ------------------------------------------------------------------------------
# 9. Penanganan Khusus cPanel / Shared Hosting (public_html)
# ------------------------------------------------------------------------------
echo "🌐 [8/8] Memeriksa struktur Document Root (cPanel / VPS)..."

if [ -d "$PUBLIC_HTML_PATH" ]; then
    echo "   📂 Terdeteksi folder cPanel: $PUBLIC_HTML_PATH"
    echo "   📋 Menyalin file publik ke $PUBLIC_HTML_PATH..."

    # Pastikan file hot tidak terbawa ke public_html
    rm -f public/hot "$PUBLIC_HTML_PATH/hot" 2>/dev/null || true

    # Salin semua isi public/ ke public_html
    cp -r public/* "$PUBLIC_HTML_PATH/"

    # Pastikan kembali file hot terhapus di public_html
    rm -f "$PUBLIC_HTML_PATH/hot" 2>/dev/null || true

    # Salin .htaccess jika ada
    if [ -f "public/.htaccess" ]; then
        cp public/.htaccess "$PUBLIC_HTML_PATH/.htaccess"
    fi

    # Buat file index.php yang terhubung secara benar ke folder project ini
    echo "   📝 Mengonfigurasi index.php khusus cPanel..."
    cat > "$PUBLIC_HTML_PATH/index.php" << EOL
<?php

use Illuminate\Foundation\Application;
use Illuminate\Http\Request;

define('LARAVEL_START', microtime(true));

// Determine if the application is in maintenance mode...
if (file_exists(\$maintenance = __DIR__.'/../${PROJECT_DIR}/storage/framework/maintenance.php')) {
    require \$maintenance;
}

// Register the Composer autoloader...
require __DIR__.'/../${PROJECT_DIR}/vendor/autoload.php';

// Bootstrap Laravel and handle the request...
/** @var Application \$app */
\$app = require_once __DIR__.'/../${PROJECT_DIR}/bootstrap/app.php';

\$app->handleRequest(Request::capture());
EOL

    # Perbaiki Symbolic Link Storage di public_html
    echo "   🔗 Memperbaiki Symlink Storage di $PUBLIC_HTML_PATH/storage..."
    rm -rf "$PUBLIC_HTML_PATH/storage"
    ln -sfn "../${PROJECT_DIR}/storage/app/public" "$PUBLIC_HTML_PATH/storage" 2>/dev/null || cp -r "storage/app/public" "$PUBLIC_HTML_PATH/storage"
else
    echo "   ℹ️ Menjalankan mode standar (Document Root langsung mengarah ke public/)."
fi

# ------------------------------------------------------------------------------
# 10. Matikan Maintenance Mode (Website Kembali Online)
# ------------------------------------------------------------------------------
echo "🟢 Mengaktifkan kembali website (php artisan up)..."
$PHP_BIN artisan up || true

echo "===================================================================="
echo "✅ DEPLOYMENT BERHASIL SELESAI!"
echo "✨ Layanan Cek DPS Online Pilkades Gunungjaya 2026 Siap Digunakan!"
echo "===================================================================="
