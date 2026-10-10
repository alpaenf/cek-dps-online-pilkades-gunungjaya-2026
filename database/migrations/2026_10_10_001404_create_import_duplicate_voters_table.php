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
        Schema::create('import_duplicate_voters', function (Blueprint $table) {
            $table->id();
            $table->unsignedInteger('row_number')->nullable();
            $table->string('nik', 30);
            $table->string('nama', 150);
            $table->string('dusun', 100)->nullable();
            $table->string('rt', 10)->nullable();
            $table->string('rw', 10)->nullable();
            $table->foreignId('tps_id')->nullable()->constrained('tps')->nullOnDelete();
            $table->string('tps_name', 50)->nullable();
            $table->unsignedInteger('first_seen_row_number')->nullable();
            $table->string('first_seen_name', 150)->nullable();
            $table->string('first_seen_dusun', 100)->nullable();
            $table->string('first_seen_rt', 10)->nullable();
            $table->string('first_seen_rw', 10)->nullable();
            $table->string('first_seen_tps_name', 50)->nullable();
            $table->string('status_match', 50)->default('IDENTIK');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('import_duplicate_voters');
    }
};
