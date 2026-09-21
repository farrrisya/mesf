<?php

namespace App\Models;

// --1. imports--
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Traits\LogsActivity;

// --2. main class--
class Gallery extends Model
{
    use HasFactory, LogsActivity;

    // --3. properties--
    protected $fillable = [
        'title',
        'category',
        'type',
        'image_path',
        'video_url',
        'description',
        'album_id',
    ];

    // --4. relationships--
    public function album()
    {
        return $this->belongsTo(Album::class);
    }
}
