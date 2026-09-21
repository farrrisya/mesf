<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Traits\LogsActivity;

class Application extends Model
{
    use HasFactory, LogsActivity;

    protected $fillable = [ // properties
        'user_id',
        'scheme_id',
        'amount_requested',
        'status',
    ];

    protected $casts = [ // convert
        'amount_requested' => 'decimal:2',
    ];

    public function user()
    {
        return $this->belongsTo(User::class); // properties
    }

    public function scheme()
    {
        return $this->belongsTo(FinancingScheme::class, 'scheme_id'); // properties
    }
}
