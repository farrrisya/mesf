<?php

// --1. imports--
namespace App\Http\Controllers;

use App\Models\Notice;
use Illuminate\Http\Request;

// --2. main component--
class NoticeController extends Controller
{
    /**
     * Show the form for creating a new notice.
     */
    public function create()
    {
        return \Inertia\Inertia::render('Admin/Notices/Create');
    }

    /**
     * Show the form for editing the specified notice.
     */
    public function edit(Notice $notice)
    {
        return \Inertia\Inertia::render('Admin/Notices/Edit', [
            'notice' => $notice
        ]);
    }

    /**
     * Store a newly created notice in storage (Admin only).
     */
    public function store(Request $request)
    {
        $validated = $request->validate([ // validate
            'title' => ['required', 'string', 'max:255'],
            'content' => ['nullable', 'string'],
            'image' => ['nullable', 'image', 'max:40960'],
            'image_path' => ['nullable', 'string'],
        ]);

        if (!$request->hasFile('image') && empty($validated['image_path'])) {
            return back()->withErrors(['image' => 'Sila muat naik poster atau pilih dari Media Library.']);
        }

        $imagePath = $validated['image_path'] ?? null; // properties
        if ($request->hasFile('image')) { // check
            $imagePath = $request->file('image')->store('notices', 'public'); // save
        }

        Notice::create([ // save
            'title' => $validated['title'],
            'content' => $validated['content'] ?? '-', // Default fallback since DB requires it
            'published_at' => now(),
            'image_path' => $imagePath,
        ]);

        return redirect()->route('admin.notices.index')->with('success', 'Notis baharu telah berjaya diterbitkan.'); // redirect
    }

    /**
     * Display a listing of all public notices.
     */
    public function publicIndex()
    {
        return \Inertia\Inertia::render('Public/NoticeIndex', [ // screen
            'notices' => Notice::where('is_active', true)->orderBy('created_at', 'desc')->get(), // state
        ]);
    }

    /**
     * Display the specified notice.
     */
    public function show(Notice $notice)
    {
        return \Inertia\Inertia::render('Public/NoticeDetail', [ // screen
            'notice' => $notice, // properties
        ]);
    }


    /**
     * Update the specified notice in storage.
     */
    public function update(Request $request, Notice $notice)
    {
        $validated = $request->validate([ // validate
            'title' => ['required', 'string', 'max:255'],
            'content' => ['nullable', 'string'],
            'image' => ['nullable', 'image', 'max:40960'],
            'image_path' => ['nullable', 'string'],
        ]);

        $data = [
            'title' => $validated['title'],
            'content' => $validated['content'] ?? '-',
        ];

        if ($request->hasFile('image')) {
            $data['image_path'] = $request->file('image')->store('notices', 'public'); // save
        } elseif (!empty($validated['image_path'])) {
            $data['image_path'] = $validated['image_path'];
        }

        $notice->update($data); // save

        return back()->with('success', 'Notis berjaya dikemas kini.'); // redirect
    }

    /**
     * Remove the specified notice from storage.
     */
    public function destroy(Notice $notice)
    {
        $notice->delete(); // trigger

        return redirect()->route('admin.notices.index')->with('success', 'Notis berjaya dipadam.'); // redirect
    }

    /**
     * Update the active status of the specified notice.
     */
    public function updateStatus(Request $request, Notice $notice)
    {
        $validated = $request->validate([ // validate
            'is_active' => ['required', 'boolean'],
        ]);

        $notice->update(['is_active' => $validated['is_active']]); // save

        return redirect()->back()->with('success', 'Status notis berjaya dikemas kini.'); // redirect
    }
}
