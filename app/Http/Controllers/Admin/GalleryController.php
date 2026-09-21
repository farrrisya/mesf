<?php

namespace App\Http\Controllers\Admin;

// --1. imports--
use App\Http\Controllers\Controller;
use App\Models\Gallery;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

// --2. main controller--
class GalleryController extends Controller
{
    // --3. index--
    public function index()
    {
        return Inertia::render('Admin/Galleries/Index', [ // screen
            'albums' => \App\Models\Album::with('latestGallery')->withCount('galleries')->orderBy('created_at', 'desc')->get(), // state
            'galleries' => Gallery::whereNull('album_id')->orderBy('created_at', 'desc')->get(), // state
            'allImages' => Gallery::where('type', 'image')->whereNull('album_id')->orderBy('created_at', 'desc')->get(), // state
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Galleries/Create');
    }

    // --4. store--
    public function store(Request $request)
    {
        $validated = $request->validate([ // validate
            'title' => 'nullable|string|max:255',
            'type' => 'required|in:image,video',
            'image' => 'nullable|image|max:40960', // 40MB max
            'image_path' => 'nullable|string',
            'video_url' => 'required_if:type,video|nullable|url|max:255',
            'description' => 'nullable|string',
        ]);

        if ($validated['type'] === 'image' && !$request->hasFile('image') && empty($validated['image_path'])) {
            return back()->withErrors(['image' => 'Sila muat naik gambar atau pilih dari Media Library.']);
        }

        $imagePath = $validated['image_path'] ?? null;
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('galleries', 'public'); // save
        }

        Gallery::create([ // save
            'title' => $validated['title'],
            'type' => $validated['type'],
            'image_path' => $imagePath,
            'video_url' => $validated['video_url'] ?? null,
            'description' => $validated['description'],
        ]);

        return redirect()->route('admin.galleries.index')->with('success', 'Media berjaya dimuat naik.'); // redirect
    }

    // --5. edit--
    public function edit(Gallery $gallery)
    {
        return Inertia::render('Admin/Galleries/Edit', [
            'gallery' => $gallery
        ]);
    }

    // --6. update--
    public function update(Request $request, Gallery $gallery)
    {
        $validated = $request->validate([ // validate
            'title' => 'nullable|string|max:255',
            'description' => 'nullable|string',
        ]);

        $gallery->update([ // save
            'title' => $validated['title'],
            'description' => $validated['description'],
        ]);

        return back()->with('success', 'Maklumat media berjaya dikemaskini.'); // redirect
    }

    // --7. destroy--
    public function destroy(Gallery $gallery)
    {
        if ($gallery->image_path) { // check
            Storage::disk('public')->delete($gallery->image_path); // save
        }
        
        $gallery->delete(); // save
        
        return redirect()->back()->with('success', 'Gambar berjaya dipadam.'); // redirect
    }
}
