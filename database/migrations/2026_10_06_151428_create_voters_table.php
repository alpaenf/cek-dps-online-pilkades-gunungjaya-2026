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
        Schema::create('voters', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tps_id')->nullable()->constrained('tps')->nullOnDelete();
            $table->unsignedInteger('no_urut')->nullable();
            $table->string('nik', 16)->unique();
            $table->string('no_kk', 16)->nullable();
            $table->string('nama', 150)->index();
            $table->string('tempat_lahir', 100)->nullable();
            $table->date('tanggal_lahir')->nullable();
            $table->enum('jenis_kelamin', ['L', 'P'])->default('L');
            $table->text('alamat')->nullable();
            $table->string('dusun', 100)->nullable()->index();
            $table->string('rt', 10)->nullable();
            $table->string('rw', 10)->nullable();
            $table->enum('status', ['DPS', 'DPT', 'DPTb', 'DPK', 'TMS'])->default('DPS');
            $table->text('keterangan')->nullable();
            $table->timestamps();

            // Optimasi index untuk kecepatan rekap dan filter
            $table->index(['tps_id', 'jenis_kelamin']);
            $table->index(['dusun', 'tps_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('voters');
    }
};
