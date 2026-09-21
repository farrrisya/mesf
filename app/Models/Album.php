<?php

namespace App\Models;

// --1. imports--
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Traits\LogsActivity;

// --2. main class--
class Album extends Model
{
    use HasFactory, LogsActivity;

    // --3. properties--
    protected $fillable = [
        'title',
        'description',
    ];

    // --4. relationships--
    public function galleries()
    {
        return $this->hasMany(Gallery::class);
    }

    public function latestGallery()
    {
        return $this->hasOne(Gallery::class)->latestOfMany();
    }
}
