<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Traits\LogsActivity;

class FinancingScheme extends Model
{
    use HasFactory, LogsActivity;

    protected $fillable = [
        'name',
        'interest_rate',
        'max_amount',
    ];

    protected $casts = [
        'interest_rate' => 'decimal:2',
        'max_amount' => 'decimal:2',
    ];

    public function applications()
    {
        return $this->hasMany(Application::class, 'scheme_id');
    }
}
