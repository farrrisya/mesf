<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Traits\LogsActivity;

class EsportMatch extends Model
{
    use HasFactory, LogsActivity;

    protected $table = 'matches';

    protected $fillable = [
        'tournament_name',
        'game_title',
        'round',
        'format',
        'team_a_name',
        'team_a_tag',
        'team_a_score',
        'team_b_name',
        'team_b_tag',
        'team_b_score',
        'scheduled_date',
        'scheduled_time',
        'venue',
        'stream_url',
        'status',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'scheduled_date' => 'date',
        'team_a_score' => 'integer',
        'team_b_score' => 'integer',
    ];
}
