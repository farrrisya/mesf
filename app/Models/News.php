<?php

namespace App\Models;

// --1. imports--
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class News extends Model
{
    use HasFactory;

    // --2. properties--
    protected $table = 'news'; // state

    protected $fillable = [
        'title',
        'slug',
        'category',
        'tag',
        'author_id',
        'excerpt',
        'content',
        'image_path',
        'location',
        'status',
        'is_featured',
        'published_at',
        'views_count',
    ];

    protected $casts = [
        'is_featured' => 'boolean', // convert
        'published_at' => 'datetime', // clock
        'views_count' => 'integer', // convert
    ];

    // --3. helpers--
    public static function generateUniqueSlug(string $title, ?int $ignoreId = null): string
    {
        $slug = Str::slug($title); // convert
        if (empty($slug)) { // check
            $slug = 'news-' . Str::random(6); // convert
        }

        $originalSlug = $slug; // state
        $count = 1; // state

        while (static::where('slug', $slug)->when($ignoreId, fn($q) => $q->where('id', '!=', $ignoreId))->exists()) { // check
            $slug = "{$originalSlug}-{$count}"; // convert
            $count++; // clock
        }

        return $slug; // convert
    }

    // --4. relationships--
    public function author()
    {
        return $this->belongsTo(User::class, 'author_id'); // state
    }

    // --5. scopes--
    public function scopePublished($query)
    {
        return $query->where('status', 'published'); // check
    }

    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true); // check
    }
}
