<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Document;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class DocumentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $documents = Document::orderBy('created_at', 'desc')->get();

        return Inertia::render('Admin/MuatTurun/Index', [
            'documents' => $documents
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Admin/MuatTurun/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'category' => 'required|string',
            'media_type' => 'required|string|in:file,url,media',
        ]);

        $data = $request->only([
            'title', 'category', 'sub_category', 'media_type', 'url_link'
        ]);

        if ($request->media_type === 'file' && $request->hasFile('file')) {
            $file = $request->file('file');
            $path = $file->store('documents', 'public');
            $data['file_path'] = $path;
            
            // Format file size
            $bytes = $file->getSize();
            $units = ['B', 'KB', 'MB', 'GB', 'TB'];
            $bytes = max($bytes, 0);
            $pow = floor(($bytes ? log($bytes) : 0) / log(1024));
            $pow = min($pow, count($units) - 1);
            $bytes /= (1 << (10 * $pow));
            $data['file_size'] = round($bytes, 2) . ' ' . $units[$pow];
        } elseif ($request->media_type === 'media') {
            $data['file_path'] = $request->file_path;
            if ($request->file_path && Storage::disk('public')->exists($request->file_path)) {
                $bytes = Storage::disk('public')->size($request->file_path);
                $units = ['B', 'KB', 'MB', 'GB', 'TB'];
                $bytes = max($bytes, 0);
                $pow = floor(($bytes ? log($bytes) : 0) / log(1024));
                $pow = min($pow, count($units) - 1);
                $bytes /= (1 << (10 * $pow));
                $data['file_size'] = round($bytes, 2) . ' ' . $units[$pow];
            } else {
                $data['file_size'] = 'N/A';
            }
        } elseif ($request->media_type === 'url') {
            $data['file_size'] = 'Pautan URL';
        }

        Document::create($data);

        return redirect()->route('admin.muat-turun.index')->with('success', 'Muat turun berjaya ditambah.');
    }

    public function edit(Document $document)
    {
        return Inertia::render('Admin/MuatTurun/Edit', [
            'document' => $document
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Document $document)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'category' => 'required|string',
            'media_type' => 'required|string|in:file,url,media',
        ]);

        $data = $request->only([
            'title', 'category', 'sub_category', 'media_type', 'url_link'
        ]);

        if ($request->media_type === 'file' && $request->hasFile('file')) {
            // Delete old file if exists
            if ($document->file_path && Storage::disk('public')->exists($document->file_path)) {
                Storage::disk('public')->delete($document->file_path);
            }

            $file = $request->file('file');
            $path = $file->store('documents', 'public');
            $data['file_path'] = $path;
            
            // Format file size
            $bytes = $file->getSize();
            $units = ['B', 'KB', 'MB', 'GB', 'TB'];
            $bytes = max($bytes, 0);
            $pow = floor(($bytes ? log($bytes) : 0) / log(1024));
            $pow = min($pow, count($units) - 1);
            $bytes /= (1 << (10 * $pow));
            $data['file_size'] = round($bytes, 2) . ' ' . $units[$pow];
        } elseif ($request->media_type === 'media') {
            $data['file_path'] = $request->file_path;
            if ($request->file_path && Storage::disk('public')->exists($request->file_path)) {
                $bytes = Storage::disk('public')->size($request->file_path);
                $units = ['B', 'KB', 'MB', 'GB', 'TB'];
                $bytes = max($bytes, 0);
                $pow = floor(($bytes ? log($bytes) : 0) / log(1024));
                $pow = min($pow, count($units) - 1);
                $bytes /= (1 << (10 * $pow));
                $data['file_size'] = round($bytes, 2) . ' ' . $units[$pow];
            } else {
                $data['file_size'] = 'N/A';
            }
        } elseif ($request->media_type === 'url') {
            $data['file_path'] = null;
            $data['file_size'] = 'Pautan URL';
        }

        $document->update($data);

        return back()->with('success', 'Muat turun berjaya dikemaskini.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Document $document)
    {
        if ($document->file_path && Storage::disk('public')->exists($document->file_path)) {
            Storage::disk('public')->delete($document->file_path);
        }

        $document->delete();

        return back()->with('success', 'Muat turun berjaya dipadam.');
    }

    /**
     * Update the active status of the specified resource.
     */
    public function updateStatus(Request $request, Document $document)
    {
        $validated = $request->validate([ // validate
            'is_active' => ['required', 'boolean'],
        ]);

        $document->update(['is_active' => $validated['is_active']]); // save

        return redirect()->back()->with('success', 'Status muat turun berjaya dikemaskini.'); // redirect
    }
}
