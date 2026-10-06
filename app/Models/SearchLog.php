<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SearchLog extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'nik_masked',
        'is_found',
        'ip_address',
        'user_agent',
        'created_at',
    ];

    protected $casts = [
        'is_found' => 'boolean',
        'created_at' => 'datetime',
    ];
}
