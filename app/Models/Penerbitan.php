<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Traits\LogsActivity;

class Penerbitan extends Model
{
    use HasFactory, LogsActivity;

    protected $fillable = [
        'title',
        'category',
        'sub_category',
        'media_type',
        'file_path',
        'url_link',
        'image_path',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];
}
