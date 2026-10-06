<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CitizenReport extends Model
{
    protected $fillable = [
        'ticket_number',
        'nama',
        'nik',
        'whatsapp',
        'kategori',
        'deskripsi',
        'file_lampiran',
        'status',
        'catatan_petugas',
    ];
}
