<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Media;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class MediaController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Media/Index', [ // screen
            'mediaList' => Media::latest()->get() // state
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Media/Create');
    }

    public function store(Request $request)
    {
        $request->validate([ // validate
            'media_type' => 'required|in:file,url',
            'file' => 'required_if:media_type,file|nullable|file',
            'url_link' => 'required_if:media_type,url|nullable|url|max:255',
        ]);

        if ($request->media_type === 'file' && $request->hasFile('file')) { // check
            $file = $request->file('file'); // properties
            $path = $file->store('media', 'public'); // save
            
            Media::create([ // save
                'file_name' => $file->getClientOriginalName(),
                'file_path' => $path,
                'file_type' => $file->getClientMimeType(),
                'file_size' => $file->getSize(),
            ]);
        } else if ($request->media_type === 'url') {
            Media::create([ // save
                'file_name' => $request->url_link,
                'file_path' => $request->url_link,
                'file_type' => 'url',
                'file_size' => '0',
            ]);
        }

        return redirect()->route('admin.media.index')->with('success', 'Media uploaded successfully'); // redirect
    }

    public function update(Request $request, Media $medium)
    {
        $request->validate([ // validate
            'file_name' => 'required|string|max:255',
        ]);

        $medium->update([ // save
            'file_name' => $request->file_name,
        ]);

        return redirect()->back()->with('success', 'Media updated successfully'); // redirect
    }

    public function destroy(Media $medium)
    {
        if ($medium->file_type !== 'url') { // check
            Storage::disk('public')->delete($medium->file_path); // trigger
        }
        $medium->delete(); // trigger

        return redirect()->back()->with('success', 'Media deleted successfully'); // redirect
    }

    public function bulkDestroy(Request $request)
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:media,id'
        ]);

        $mediaList = Media::whereIn('id', $request->ids)->get();

        foreach ($mediaList as $medium) {
            if ($medium->file_type !== 'url') {
                Storage::disk('public')->delete($medium->file_path);
            }
            $medium->delete();
        }

        return redirect()->back()->with('success', 'Selected media deleted successfully');
    }
}
