<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Traits\LogsActivity;

class League extends Model
{
    use HasFactory, LogsActivity;

    protected $fillable = [
        'name',
        'slug',
        'season',
        'game_title',
        'tier',
        'format',
        'prize_pool',
        'start_date',
        'end_date',
        'registration_deadline',
        'slots',
        'entry_fee',
        'registration_status',
        'banner_path',
        'description',
        'location',
        'display_options',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'start_date' => 'date',
        'end_date' => 'date',
        'registration_deadline' => 'date',
        'display_options' => 'array',
    ];
}
