<?php

// --1. imports--
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Document;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

// --2. main controller--
class DocumentController extends Controller
{
    public function index()
    {
        $documents = Document::orderBy('created_at', 'desc')->get()->map(function ($doc) { // state
            return [ // convert
                'id' => $doc->id,
                'title' => $doc->title,
                'category' => $doc->category,
                'version_ref' => $doc->version_ref,
                'media_type' => $doc->media_type,
                'file_size' => $doc->file_size,
                'file_url' => $doc->file_path ? Storage::url($doc->file_path) : $doc->url_link,
                'url_link' => $doc->url_link,
                'description' => $doc->description,
                'is_active' => (bool)$doc->is_active,
                'created_at' => $doc->created_at ? $doc->created_at->format('d M Y') : null,
            ];
        });

        return Inertia::render('Admin/Documents', [ // screen
            'documents' => $documents
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Documents/Create'); // screen
    }

    public function store(Request $request)
    {
        $request->validate([ // validate
            'title' => 'required|string|max:255',
            'category' => 'required|string|max:255',
            'media_type' => 'required|string|in:file,link,url',
            'url_link' => 'nullable|string|max:2000',
            'version_ref' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'file' => 'nullable|file|max:51200', // 50MB max
        ]);

        $mediaType = $request->input('media_type') === 'link' ? 'url' : $request->input('media_type'); // state
        $filePath = null; // state
        $fileSize = 'N/A'; // state

        if ($request->hasFile('file')) { // check
            $file = $request->file('file'); // state
            $filePath = $file->store('documents', 'public'); // save
            $bytes = $file->getSize(); // convert
            $fileSize = round($bytes / (1024 * 1024), 2) . ' MB'; // convert
        } elseif ($mediaType === 'url') { // check
            $fileSize = 'External Link'; // state
        }

        Document::create([ // save
            'title' => $request->input('title'),
            'category' => $request->input('category'),
            'sub_category' => $request->input('category'),
            'version_ref' => $request->input('version_ref'),
            'media_type' => $mediaType,
            'url_link' => $request->input('url_link'),
            'file_size' => $fileSize,
            'file_path' => $filePath,
            'description' => $request->input('description'),
            'is_active' => true,
        ]);

        return redirect()->route('admin.documents')->with('success', 'Document registered successfully.'); // redirect
    }

    public function destroy(Document $document)
    {
        if ($document->file_path && Storage::disk('public')->exists($document->file_path)) { // check
            Storage::disk('public')->delete($document->file_path); // save
        }

        $document->delete(); // save

        return back()->with('success', 'Document deleted successfully.'); // redirect
    }

    public function toggleStatus(Document $document)
    {
        $document->update([ // save
            'is_active' => !$document->is_active
        ]);

        return back()->with('success', 'Status updated successfully.'); // redirect
    }
}
