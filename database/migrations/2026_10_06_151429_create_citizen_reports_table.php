<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('citizen_reports', function (Blueprint $table) {
            $table->id();
            $table->string('ticket_number', 50)->unique();
            $table->string('nama', 150);
            $table->string('nik', 16)->index();
            $table->string('whatsapp', 25);
            $table->enum('kategori', [
                'BELUM_TERDAFTAR',
                'PINDAH_DOMISILI',
                'MENINGGAL_DUNIA',
                'DATA_GANDA',
                'KOREKSI_DATA'
            ])->default('BELUM_TERDAFTAR');
            $table->text('deskripsi');
            $table->string('file_lampiran')->nullable();
            $table->enum('status', ['PENDING', 'DIPROSES', 'DISETUJUI', 'DITOLAK'])->default('PENDING')->index();
            $table->text('catatan_petugas')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('citizen_reports');
    }
};
