<?php

// --1. imports--
namespace App\Models;

use App\Traits\LogsActivity;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

// --2. main model--
class Inquiry extends Model
{
    use HasFactory, LogsActivity;

    // --3. properties--
    protected $fillable = [
        'type', // state
        'name', // state
        'email', // state
        'phone', // state
        'organization', // state
        'message', // state
        'details', // state
        'status', // state
        'admin_notes', // state
        'handled_by', // state
    ];

    protected $casts = [
        'details' => 'array', // convert
    ];

    // --4. relationships--
    public function handler(): BelongsTo
    {
        return $this->belongsTo(User::class, 'handled_by'); // check
    }
}
