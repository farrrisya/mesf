<?php

namespace App\Http\Controllers\Admin;

// --1. imports--
use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Models\News;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

// --2. main controller--
class NewsController extends Controller
{
    // --3. index--
    public function index(Request $request)
    {
        $search = $request->input('search'); // state
        $category = $request->input('category'); // state
        $status = $request->input('status'); // state

        $query = News::with('author:id,name,role') // state
            ->when($search, function ($q, $search) { // check
                $q->where(function ($sub) use ($search) { // check
                    $sub->where('title', 'like', "%{$search}%") // check
                        ->orWhere('excerpt', 'like', "%{$search}%") // check
                        ->orWhere('location', 'like', "%{$search}%") // check
                        ->orWhere('tag', 'like', "%{$search}%"); // check
                });
            })
            ->when($category && $category !== 'ALL', function ($q) use ($category) { // check
                $q->where('category', $category); // check
            })
            ->when($status && $status !== 'ALL', function ($q) use ($status) { // check
                $q->where('status', $status); // check
            })
            ->orderBy('is_featured', 'desc') // state
            ->orderBy('published_at', 'desc') // clock
            ->orderBy('created_at', 'desc'); // clock

        $articles = $query->get()->map(function ($item) { // convert
            return [
                'id' => $item->id, // state
                'title' => $item->title, // state
                'slug' => $item->slug, // state
                'category' => $item->category, // state
                'tag' => $item->tag ?: "[ {$item->category} ]", // state
                'excerpt' => $item->excerpt, // state
                'content' => $item->content, // state
                'image_path' => $item->image_path ? Storage::url($item->image_path) : null, // state
                'raw_image_path' => $item->image_path, // state
                'video_url' => $item->video_url, // state
                'location' => $item->location, // state
                'status' => $item->status, // state
                'is_featured' => (bool) $item->is_featured, // state
                'published_at' => $item->published_at ? $item->published_at->format('Y-m-d') : null, // clock
                'published_at_formatted' => $item->published_at ? $item->published_at->format('d M Y') : 'Draft', // clock
                'author' => $item->author ? $item->author->name : 'MESF Editorial', // state
                'views_count' => $item->views_count, // state
                'created_at' => $item->created_at->format('d M Y, H:i'), // clock
            ];
        });

        $stats = [ // state
            'total' => News::count(), // state
            'published' => News::where('status', 'published')->count(), // state
            'draft' => News::where('status', 'draft')->count(), // state
            'featured' => News::where('is_featured', true)->count(), // state
        ];

        $categories = [ // state
            'TOURNAMENTS',
            'ACHIEVEMENTS',
            'PARTNERSHIPS',
            'ANNOUNCEMENTS',
        ];

        return Inertia::render('Admin/News', [ // screen
            'articles' => $articles, // state
            'stats' => $stats, // state
            'categories' => $categories, // state
            'filters' => [ // state
                'search' => $search ?? '', // state
                'category' => $category ?? 'ALL', // state
                'status' => $status ?? 'ALL', // state
            ],
        ]);
    }

    // --4. create--
    public function create()
    {
        $categories = [ // state
            'TOURNAMENTS',
            'ACHIEVEMENTS',
            'PARTNERSHIPS',
            'ANNOUNCEMENTS',
        ];

        return Inertia::render('Admin/News/Create', [ // screen
            'categories' => $categories, // state
        ]);
    }

    // --5. store--
    public function store(Request $request)
    {
        $validated = $request->validate([ // validate
            'title' => 'required|string|max:255', // validate
            'slug' => 'nullable|string|max:255', // validate
            'category' => 'nullable|string|max:100', // validate
            'tag' => 'nullable|string|max:100', // validate
            'excerpt' => 'nullable|string|max:1000', // validate
            'content' => 'nullable|string', // validate
            'location' => 'nullable|string|max:255', // validate
            'status' => 'required|in:published,draft', // validate
            'is_featured' => 'nullable', // validate
            'published_at' => 'nullable', // validate
            'image' => 'nullable|image|max:10240', // validate
            'video_url' => 'nullable|string|max:500', // validate
        ]);

        $category = !empty($validated['category']) ? $validated['category'] : ($request->input('category') ?: 'TOURNAMENTS'); // state
        $slugInput = $validated['slug'] ?? $request->input('slug'); // state
        $slug = News::generateUniqueSlug(!empty($slugInput) ? $slugInput : $validated['title']); // convert

        $tagInput = $validated['tag'] ?? $request->input('tag'); // state
        $tag = !empty($tagInput) // check
            ? $tagInput // state
            : "[ " . strtoupper($category) . " ]"; // convert

        $imagePath = null; // state
        if ($request->hasFile('image')) { // check
            $imagePath = $request->file('image')->store('news', 'public'); // save
        }

        $isFeatured = $request->boolean('is_featured'); // state
        if ($isFeatured) { // check
            News::where('is_featured', true)->update(['is_featured' => false]); // save
        }

        $publishedAt = $validated['published_at'] ?? $request->input('published_at'); // clock
        if ($validated['status'] === 'published' && empty($publishedAt)) { // check
            $publishedAt = now(); // clock
        }

        $news = News::create([ // save
            'title' => $validated['title'], // state
            'slug' => $slug, // state
            'category' => $category, // state
            'tag' => $tag, // state
            'author_id' => $request->user()?->id, // state
            'excerpt' => $validated['excerpt'] ?? $request->input('excerpt'), // state
            'content' => $validated['content'] ?? $request->input('content'), // state
            'image_path' => $imagePath, // state
            'video_url' => $validated['video_url'] ?? $request->input('video_url'), // state
            'location' => $validated['location'] ?? $request->input('location'), // state
            'status' => $validated['status'], // state
            'is_featured' => $isFeatured, // state
            'published_at' => $publishedAt, // clock
            'views_count' => 0, // state
        ]);

        ActivityLog::create([ // save
            'user_id' => $request->user()?->id, // state
            'action' => 'create', // state
            'description' => "Created news article: {$news->title}", // state
            'model_type' => News::class, // state
            'model_id' => $news->id, // state
            'properties' => [ // state
                'title' => $news->title, // state
                'category' => $news->category, // state
                'status' => $news->status, // state
            ],
        ]);

        return redirect()->route('admin.news')->with('success', 'News article created successfully.'); // redirect
    }

    // --6. edit--
    public function edit(News $news)
    {
        $categories = [ // state
            'TOURNAMENTS',
            'ACHIEVEMENTS',
            'PARTNERSHIPS',
            'ANNOUNCEMENTS',
        ];

        return Inertia::render('Admin/News/Edit', [ // screen
            'article' => [ // state
                'id' => $news->id, // state
                'title' => $news->title, // state
                'slug' => $news->slug, // state
                'category' => $news->category, // state
                'tag' => $news->tag, // state
                'excerpt' => $news->excerpt, // state
                'content' => $news->content, // state
                'image_path' => $news->image_path ? Storage::url($news->image_path) : null, // state
                'video_url' => $news->video_url ?? '', // state
                'location' => $news->location, // state
                'status' => $news->status, // state
                'is_featured' => (bool) $news->is_featured, // state
                'published_at' => $news->published_at ? $news->published_at->format('Y-m-d') : '', // clock
            ],
            'categories' => $categories, // state
        ]);
    }

    // --7. update--
    public function update(Request $request, News $news)
    {
        $validated = $request->validate([ // validate
            'title' => 'required|string|max:255', // validate
            'slug' => 'nullable|string|max:255', // validate
            'category' => 'nullable|string|max:100', // validate
            'tag' => 'nullable|string|max:100', // validate
            'excerpt' => 'nullable|string|max:1000', // validate
            'content' => 'nullable|string', // validate
            'location' => 'nullable|string|max:255', // validate
            'status' => 'required|in:published,draft', // validate
            'is_featured' => 'nullable', // validate
            'published_at' => 'nullable', // validate
            'image' => 'nullable|image|max:10240', // validate
            'remove_image' => 'nullable|boolean', // validate
            'video_url' => 'nullable|string|max:500', // validate
        ]);

        $category = !empty($validated['category']) ? $validated['category'] : ($request->input('category') ?: $news->category ?: 'TOURNAMENTS'); // state
        $slug = $news->slug; // state
        if (!empty($validated['slug']) && $validated['slug'] !== $news->slug) { // check
            $slug = News::generateUniqueSlug($validated['slug'], $news->id); // convert
        } elseif ($validated['title'] !== $news->title && empty($validated['slug'])) { // check
            $slug = News::generateUniqueSlug($validated['title'], $news->id); // convert
        }

        $imagePath = $news->image_path; // state
        if ($request->boolean('remove_image')) { // check
            if ($imagePath && Storage::disk('public')->exists($imagePath)) { // check
                Storage::disk('public')->delete($imagePath); // save
            }
            $imagePath = null; // state
        }

        if ($request->hasFile('image')) { // check
            if ($imagePath && Storage::disk('public')->exists($imagePath)) { // check
                Storage::disk('public')->delete($imagePath); // save
            }
            $imagePath = $request->file('image')->store('news', 'public'); // save
        }

        $isFeatured = $request->boolean('is_featured'); // state
        if ($isFeatured && !$news->is_featured) { // check
            News::where('id', '!=', $news->id)->where('is_featured', true)->update(['is_featured' => false]); // save
        }

        $publishedAt = $validated['published_at'] ?? $news->published_at; // clock
        if ($validated['status'] === 'published' && empty($publishedAt)) { // check
            $publishedAt = now(); // clock
        }

        $tagInput = $validated['tag'] ?? $request->input('tag'); // state
        $tag = !empty($tagInput) // check
            ? $tagInput // state
            : "[ " . strtoupper($category) . " ]"; // convert

        $news->update([ // save
            'title' => $validated['title'], // state
            'slug' => $slug, // state
            'category' => $category, // state
            'tag' => $tag, // state
            'excerpt' => $validated['excerpt'] ?? $request->input('excerpt'), // state
            'content' => $validated['content'] ?? $request->input('content'), // state
            'image_path' => $imagePath, // state
            'video_url' => $validated['video_url'] ?? $request->input('video_url'), // state
            'location' => $validated['location'] ?? $request->input('location'), // state
            'status' => $validated['status'], // state
            'is_featured' => $isFeatured, // state
            'published_at' => $publishedAt, // clock
        ]);

        ActivityLog::create([ // save
            'user_id' => $request->user()?->id, // state
            'action' => 'update', // state
            'description' => "Updated news article: {$news->title}", // state
            'model_type' => News::class, // state
            'model_id' => $news->id, // state
            'properties' => [ // state
                'title' => $news->title, // state
                'status' => $news->status, // state
                'is_featured' => $news->is_featured, // state
            ],
        ]);

        return redirect()->route('admin.news')->with('success', 'News article updated successfully.'); // redirect
    }

    // --6. destroy--
    public function destroy(Request $request, News $news)
    {
        $title = $news->title; // state
        $id = $news->id; // state

        if ($news->image_path && Storage::disk('public')->exists($news->image_path)) { // check
            Storage::disk('public')->delete($news->image_path); // save
        }

        $news->delete(); // save

        ActivityLog::create([ // save
            'user_id' => $request->user()?->id, // state
            'action' => 'delete', // state
            'description' => "Deleted news article: {$title}", // state
            'model_type' => News::class, // state
            'model_id' => $id, // state
        ]);

        return redirect()->route('admin.news')->with('success', 'News article deleted successfully.'); // redirect
    }

    // --7. actions--
    public function toggleStatus(Request $request, News $news)
    {
        $newStatus = $news->status === 'published' ? 'draft' : 'published'; // toggle
        $publishedAt = $news->published_at; // clock

        if ($newStatus === 'published' && !$publishedAt) { // check
            $publishedAt = now(); // clock
        }

        $news->update([ // save
            'status' => $newStatus, // state
            'published_at' => $publishedAt, // clock
        ]);

        ActivityLog::create([ // save
            'user_id' => $request->user()?->id, // state
            'action' => 'toggle_status', // state
            'description' => "Toggled news article [{$news->title}] status to {$newStatus}", // state
            'model_type' => News::class, // state
            'model_id' => $news->id, // state
        ]);

        return redirect()->back()->with('success', "Article status changed to {$newStatus}."); // redirect
    }

    public function toggleFeatured(Request $request, News $news)
    {
        $newFeatured = !$news->is_featured; // toggle

        if ($newFeatured) { // check
            News::where('id', '!=', $news->id)->where('is_featured', true)->update(['is_featured' => false]); // save
        }

        $news->update([ // save
            'is_featured' => $newFeatured, // state
        ]);

        ActivityLog::create([ // save
            'user_id' => $request->user()?->id, // state
            'action' => 'toggle_featured', // state
            'description' => $newFeatured // check
                ? "Set news article [{$news->title}] as featured hero story" // state
                : "Unfeatured news article [{$news->title}]", // state
            'model_type' => News::class, // state
            'model_id' => $news->id, // state
        ]);

        return redirect()->back()->with('success', $newFeatured ? 'Article set as hero featured story.' : 'Article unfeatured.'); // redirect
    }
}
