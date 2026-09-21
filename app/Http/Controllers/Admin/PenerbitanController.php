<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Penerbitan;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class PenerbitanController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Penerbitan/Index', [ // screen
            'penerbitans' => Penerbitan::orderBy('created_at', 'desc')->get(), // state
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Penerbitan/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([ // validate
            'title' => 'required|string|max:255',
            'category' => 'required|in:buletin,laporan',
            'sub_category' => 'nullable|required_if:category,buletin|in:kontemporari',
            'media_type' => 'required|in:file,url,media',
            'file' => 'required_if:media_type,file|nullable|file|max:40960',
            'url_link' => 'required_if:media_type,url|nullable|url|max:255',
            'file_path' => 'nullable|string',
            'image' => 'nullable|image|max:2048',
        ]);

        $filePath = $validated['file_path'] ?? null;
        if ($request->hasFile('file') && $validated['media_type'] === 'file') { // check
            $filePath = $request->file('file')->store('penerbitan', 'public'); // save
        }
        
        $imagePath = null;
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('penerbitan/images', 'public');
        }

        Penerbitan::create([ // save
            'title' => $validated['title'],
            'category' => $validated['category'],
            'sub_category' => $validated['sub_category'] ?? null,
            'media_type' => $validated['media_type'],
            'file_path' => $filePath,
            'url_link' => $validated['url_link'] ?? null,
            'image_path' => $imagePath,
        ]);

        return redirect()->route('admin.penerbitan.index')->with('success', 'Penerbitan berjaya ditambah.'); // redirect
    }

    public function edit(Penerbitan $penerbitan)
    {
        return Inertia::render('Admin/Penerbitan/Edit', [
            'penerbitan' => $penerbitan
        ]);
    }

    public function update(Request $request, Penerbitan $penerbitan)
    {
        $validated = $request->validate([ // validate
            'title' => 'required|string|max:255',
            'category' => 'required|in:buletin,laporan',
            'sub_category' => 'nullable|required_if:category,buletin|in:kontemporari',
            'media_type' => 'required|in:file,url,media',
            'file' => 'required_if:media_type,file|nullable|file|max:40960',
            'url_link' => 'required_if:media_type,url|nullable|url|max:255',
            'file_path' => 'nullable|string',
            'image' => 'nullable|image|max:2048',
        ]);

        $imagePath = $penerbitan->image_path;
        if ($request->hasFile('image')) {
            if ($imagePath) {
                Storage::disk('public')->delete($imagePath);
            }
            $imagePath = $request->file('image')->store('penerbitan/images', 'public');
        }

        $filePath = $validated['file_path'] ?? null;
        if ($request->hasFile('file') && $validated['media_type'] === 'file') {
            if ($penerbitan->file_path) {
                Storage::disk('public')->delete($penerbitan->file_path);
            }
            $filePath = $request->file('file')->store('penerbitan', 'public');
        } else if ($validated['media_type'] === 'url') {
            if ($penerbitan->file_path) {
                Storage::disk('public')->delete($penerbitan->file_path);
            }
            $filePath = null;
        }

        $penerbitan->update([ // save
            'title' => $validated['title'],
            'category' => $validated['category'],
            'sub_category' => $validated['sub_category'] ?? null,
            'media_type' => $validated['media_type'],
            'file_path' => $filePath,
            'url_link' => $validated['url_link'] ?? null,
            'image_path' => $imagePath,
        ]);

        return back()->with('success', 'Penerbitan berjaya dikemaskini.'); // redirect
    }

    public function destroy(Penerbitan $penerbitan)
    {
        if ($penerbitan->file_path) { // check
            Storage::disk('public')->delete($penerbitan->file_path); // save
        }
        if ($penerbitan->image_path) {
            Storage::disk('public')->delete($penerbitan->image_path);
        }

        $penerbitan->delete(); // save

        return redirect()->back()->with('success', 'Penerbitan berjaya dipadam.'); // redirect
    }

    public function updateStatus(Request $request, Penerbitan $penerbitan)
    {
        $validated = $request->validate([ // validate
            'is_active' => ['required', 'boolean'],
        ]);

        $penerbitan->update(['is_active' => $validated['is_active']]); // save

        return redirect()->back()->with('success', 'Status penerbitan berjaya dikemaskini.'); // redirect
    }
}
