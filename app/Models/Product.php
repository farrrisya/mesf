<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Traits\LogsActivity;

class Product extends Model
{
    use HasFactory, LogsActivity;

    protected $fillable = [
        'title',
        'category',
        'sub_category',
        'media_type',
        'url_link',
        'file_size',
        'file_path',
        'description',
        'description2',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];
}
