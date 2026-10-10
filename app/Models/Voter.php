<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Voter extends Model
{
    protected $fillable = [
        'tps_id',
        'no_urut',
        'nik',
        'no_kk',
        'nama',
        'tempat_lahir',
        'tanggal_lahir',
        'jenis_kelamin',
        'alamat',
        'dusun',
        'rt',
        'rw',
        'status',
        'keterangan',
    ];

    protected $casts = [
        'tanggal_lahir' => 'date',
    ];

    protected $appends = [
        'masked_nik',
    ];

    public function tps(): BelongsTo
    {
        return $this->belongsTo(Tps::class, 'tps_id');
    }

    /**
     * Masking NIK untuk keamanan privasi warga saat diakses publik (e.g. 3327********0001)
     */
    public function getMaskedNikAttribute(): string
    {
        $nik = (string) $this->nik;
        if (strlen($nik) !== 16) {
            return $nik;
        }

        return substr($nik, 0, 4).'********'.substr($nik, 12);
    }
}
