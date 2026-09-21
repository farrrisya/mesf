<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Traits\LogsActivity;

class Media extends Model
{
    use HasFactory, LogsActivity;

    protected $fillable = [
        'file_name',
        'file_path',
        'file_type',
        'file_size',
    ];
}
