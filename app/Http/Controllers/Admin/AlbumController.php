<?php

namespace App\Http\Controllers\Admin;

// --1. imports--
use App\Http\Controllers\Controller;
use App\Models\Album;
use App\Models\Gallery;
use Illuminate\Http\Request;
use Inertia\Inertia;

// --2. main controller--
class AlbumController extends Controller
{
    public function create()
    {
        $allImages = Gallery::where('type', 'image')->whereNull('album_id')->orderBy('created_at', 'desc')->get();
        return Inertia::render('Admin/Albums/Create', [
            'allImages' => $allImages,
        ]);
    }
    
    // --3. store--
    public function store(Request $request)
    {
        $validated = $request->validate([ // validate
            'title' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'gallery_ids' => 'nullable|array',
            'gallery_ids.*' => 'exists:galleries,id',
        ]);

        $album = Album::create([ // save
            'title' => $validated['title'],
            'description' => $validated['description'],
        ]);

        if (!empty($validated['gallery_ids'])) { // check
            Gallery::whereIn('id', $validated['gallery_ids'])->update(['album_id' => $album->id]); // save
        }

        return redirect()->route('admin.galleries.index')->with('success', 'Album berjaya ditambah.'); // redirect
    }

    // --4. show--
    public function show(Album $album)
    {
        $album->load(['galleries' => function($query) {
            $query->orderBy('created_at', 'desc');
        }]);

        // state
        $availableGalleries = Gallery::where('type', 'image')->whereNull('album_id')->orderBy('created_at', 'desc')->get();

        return Inertia::render('Admin/Galleries/AlbumShow', [ // screen
            'album' => $album,
            'availableGalleries' => $availableGalleries,
        ]);
    }

    public function edit(Album $album)
    {
        $album->load('galleries');
        $availableGalleries = Gallery::where('type', 'image')->whereNull('album_id')->orderBy('created_at', 'desc')->get();
        return Inertia::render('Admin/Albums/Edit', [
            'album' => $album,
            'availableGalleries' => $availableGalleries,
        ]);
    }

    // --5. update--
    public function update(Request $request, Album $album)
    {
        $validated = $request->validate([ // validate
            'title' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'gallery_ids' => 'nullable|array',
            'gallery_ids.*' => 'exists:galleries,id',
        ]);

        $album->update([ // save
            'title' => $validated['title'],
            'description' => $validated['description'],
        ]);

        // First remove all galleries from this album
        Gallery::where('album_id', $album->id)->update(['album_id' => null]); // save

        // Then add the selected ones
        if (!empty($validated['gallery_ids'])) { // check
            Gallery::whereIn('id', $validated['gallery_ids'])->update(['album_id' => $album->id]); // save
        }

        return redirect()->back()->with('success', 'Album berjaya dikemaskini.'); // redirect
    }

    // --6. destroy--
    public function destroy(Album $album)
    {
        // Unlink galleries
        Gallery::where('album_id', $album->id)->update(['album_id' => null]); // save
        
        $album->delete(); // save
        
        return redirect()->route('admin.galleries.index')->with('success', 'Album berjaya dipadam.'); // redirect
    }
}
