<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Tps extends Model
{
    protected $table = 'tps';

    protected $fillable = [
        'nomor_tps',
        'nama_lokasi',
        'alamat',
        'dusun',
        'rt',
        'rw',
        'latitude',
        'longitude',
        'keterangan',
    ];

    public function voters(): HasMany
    {
        return $this->hasMany(Voter::class, 'tps_id');
    }
}
