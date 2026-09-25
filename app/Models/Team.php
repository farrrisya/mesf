<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Traits\LogsActivity;

class Team extends Model
{
    use HasFactory, LogsActivity;

    protected $fillable = [
        'name',
        'slug',
        'tag',
        'type', // national, state, pro
        'region',
        'game_title',
        'manager_name',
        'contact_email',
        'motto',
        'roster_size',
        'status',
        'logo_path',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'roster_size' => 'integer',
    ];
}
