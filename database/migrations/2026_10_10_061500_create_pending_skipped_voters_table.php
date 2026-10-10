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
        Schema::create('pending_skipped_voters', function (Blueprint $table) {
            $table->id();
            $table->unsignedInteger('row_number')->nullable();
            $table->string('nik', 30)->nullable();
            $table->string('nama', 150)->nullable();
            $table->enum('jenis_kelamin', ['L', 'P'])->default('L');
            $table->string('tempat_lahir', 100)->nullable();
            $table->string('tanggal_lahir', 50)->nullable();
            $table->string('dusun', 100)->nullable();
            $table->string('rt', 10)->nullable();
            $table->string('rw', 10)->nullable();
            $table->foreignId('tps_id')->nullable()->constrained('tps')->nullOnDelete();
            $table->string('tps_name', 50)->nullable();
            $table->string('status', 20)->default('DPS');
            $table->text('keterangan')->nullable();
            $table->string('reason', 255)->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pending_skipped_voters');
    }
};
