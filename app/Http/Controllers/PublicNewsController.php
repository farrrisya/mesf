<?php

namespace App\Http\Controllers;

// --1. imports--
use App\Models\News;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

// --2. main controller--
class PublicNewsController extends Controller
{
    // --3. index--
    public function index(Request $request)
    {
        $activeCategory = $request->query('category', 'ALL'); // state
        $search = $request->query('search'); // state

        $baseQuery = News::published() // check
            ->when($search, function ($q, $search) { // check
                $q->where(function ($sub) use ($search) { // check
                    $sub->where('title', 'like', "%{$search}%") // check
                        ->orWhere('excerpt', 'like', "%{$search}%") // check
                        ->orWhere('location', 'like', "%{$search}%"); // check
                });
            });

        // get featured article (first priority is is_featured, then latest)
        $featuredArticle = (clone $baseQuery) // state
            ->orderBy('is_featured', 'desc') // state
            ->orderBy('published_at', 'desc') // clock
            ->first();

        // grid query
        $gridQuery = clone $baseQuery; // state
        if ($activeCategory !== 'ALL') { // check
            $gridQuery->where('category', $activeCategory); // check
        }

        // if on ALL category and we have a featured article, exclude it from grid to avoid duplicate
        if ($activeCategory === 'ALL' && $featuredArticle) { // check
            $gridQuery->where('id', '!=', $featuredArticle->id); // check
        }

        $articles = $gridQuery->orderBy('published_at', 'desc') // clock
            ->orderBy('created_at', 'desc') // clock
            ->get() // state
            ->map(function ($item) { // convert
                return [
                    'id' => $item->id, // state
                    'title' => $item->title, // state
                    'slug' => $item->slug, // state
                    'category' => $item->category, // state
                    'tag' => $item->tag ?: "[ {$item->category} ]", // state
                    'excerpt' => $item->excerpt, // state
                    'image' => $item->image_path ? Storage::url($item->image_path) : null, // state
                    'poster' => $item->poster_path ? Storage::url($item->poster_path) : ($item->image_path ? Storage::url($item->image_path) : null), // state
                    'video_url' => $item->video_url, // state
                    'date' => $item->published_at ? $item->published_at->format('d M Y') : $item->created_at->format('d M Y'), // clock
                    'detail' => $item->location ?: 'OFFICIAL', // state
                ];
            });

        $featuredData = $featuredArticle ? [ // state
            'id' => $featuredArticle->id, // state
            'title' => $featuredArticle->title, // state
            'slug' => $featuredArticle->slug, // state
            'category' => $featuredArticle->category, // state
            'tag' => $featuredArticle->tag ?: "[ {$featuredArticle->category} ]", // state
            'excerpt' => $featuredArticle->excerpt, // state
            'image' => $featuredArticle->image_path ? Storage::url($featuredArticle->image_path) : null, // state
            'poster' => $featuredArticle->poster_path ? Storage::url($featuredArticle->poster_path) : ($featuredArticle->image_path ? Storage::url($featuredArticle->image_path) : null), // state
            'video_url' => $featuredArticle->video_url, // state
            'date' => $featuredArticle->published_at ? $featuredArticle->published_at->format('d M Y') : $featuredArticle->created_at->format('d M Y'), // clock
            'detail' => $featuredArticle->location ?: 'OFFICIAL', // state
        ] : null;

        $categories = [ // state
            'ALL',
            'TOURNAMENTS',
            'ACHIEVEMENTS',
            'PARTNERSHIPS',
            'ANNOUNCEMENTS',
        ];

        return Inertia::render('News', [ // screen
            'articles' => $articles, // state
            'featuredArticle' => $featuredData, // state
            'activeCategory' => $activeCategory, // state
            'categories' => $categories, // state
            'search' => $search ?? '', // state
        ]);
    }

    // --4. show--
    public function show(Request $request, $slug)
    {
        $user = $request->user(); // state
        $canPreviewDraft = $user && in_array($user->role, ['admin', 'editor']); // check

        $article = News::where('slug', $slug) // state
            ->orWhere('id', is_numeric($slug) ? $slug : null) // check
            ->when(!$canPreviewDraft, function ($q) { // check
                $q->published(); // check
            })
            ->firstOrFail(); // check

        // increment views
        $article->increment('views_count'); // clock

        // fetch related / latest articles for sidebar feed
        $latestFeed = News::published() // check
            ->where('id', '!=', $article->id) // check
            ->orderBy('published_at', 'desc') // clock
            ->limit(4) // state
            ->get() // state
            ->map(function ($item) { // convert
                return [
                    'id' => $item->id, // state
                    'title' => $item->title, // state
                    'slug' => $item->slug, // state
                    'category' => $item->category, // state
                    'tag' => $item->tag ?: "[ {$item->category} ]", // state
                    'excerpt' => $item->excerpt, // state
                    'image' => $item->image_path ? Storage::url($item->image_path) : null, // state
                    'date' => $item->published_at ? $item->published_at->format('d M Y') : $item->created_at->format('d M Y'), // clock
                ];
            });

        return Inertia::render('NewsArticle', [ // screen
            'article' => [ // state
                'id' => $article->id, // state
                'title' => $article->title, // state
                'slug' => $article->slug, // state
                'category' => $article->category, // state
                'tag' => $article->tag ?: "[ {$article->category} ]", // state
                'excerpt' => $article->excerpt, // state
                'content' => $article->content, // state
                'image' => $article->image_path ? Storage::url($article->image_path) : null, // state
                'poster' => $article->poster_path ? Storage::url($article->poster_path) : ($article->image_path ? Storage::url($article->image_path) : null), // state
                'video_url' => $article->video_url, // state
                'location' => $article->location ?: 'MALAYSIA', // state
                'status' => $article->status, // state
                'date' => $article->published_at ? $article->published_at->format('d M Y') : $article->created_at->format('d M Y'), // clock
                'author' => $article->author ? $article->author->name : 'MESF Editorial', // state
                'views_count' => $article->views_count, // state
            ],
            'latestFeed' => $latestFeed, // state
        ]);
    }
}
