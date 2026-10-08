<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Media;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class MediaController extends Controller
{
    // --1. helpers--
    private function formatBytes($bytes, $precision = 1) // convert
    {
        $units = ['B', 'KB', 'MB', 'GB'];
        $bytes = max($bytes, 0);
        $pow = floor(($bytes ? log($bytes) : 0) / log(1024));
        $pow = min($pow, count($units) - 1);
        $bytes /= pow(1024, $pow);
        return round($bytes, $precision) . ' ' . $units[$pow];
    }

    private function mapMediaItem(Media $m) // convert
    {
        $isUrl = $m->file_type === 'url';
        $url = $isUrl ? $m->file_path : Storage::url($m->file_path); // state
        $isImage = $isUrl
            ? (bool) preg_match('/\.(jpeg|jpg|png|gif|webp|svg)(\?.*)?$/i', $m->file_path)
            : Str::startsWith($m->file_type, 'image/') || in_array(strtolower(pathinfo($m->file_path, PATHINFO_EXTENSION)), ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg']); // check

        return [
            'id' => $m->id,
            'file_name' => $m->file_name,
            'file_path' => $m->file_path,
            'url' => $url,
            'file_type' => $m->file_type,
            'file_size' => (int) $m->file_size,
            'human_size' => $this->formatBytes((int) $m->file_size),
            'is_image' => $isImage,
            'created_at' => $m->created_at ? $m->created_at->format('d M Y, h:i A') : null,
            'raw_created_at' => $m->created_at ? $m->created_at->toIso8601String() : null,
        ];
    }

    // --2. index--
    public function index()
    {
        $mediaList = Media::orderBy('created_at', 'desc')->get()->map(function ($m) { // state
            return $this->mapMediaItem($m); // convert
        });

        return Inertia::render('Admin/Library', [ // screen
            'mediaList' => $mediaList,
        ]);
    }

    // --3. create--
    public function create()
    {
        return Inertia::render('Admin/Library/Create'); // screen
    }

    // --4. store--
    public function store(Request $request)
    {
        $request->validate([ // validate
            'files' => 'nullable|array',
            'files.*' => 'file|max:20480', // max 20MB per file
            'file' => 'nullable|file|max:20480',
        ]);

        $uploadedItems = []; // state
        $filesToProcess = []; // state

        if ($request->hasFile('files')) { // check
            $filesToProcess = $request->file('files');
        } elseif ($request->hasFile('file')) { // check
            $filesToProcess = [$request->file('file')];
        }

        foreach ($filesToProcess as $file) {
            if (!$file->isValid()) { // check
                continue;
            }

            $path = $file->store('media', 'public'); // save
            $media = Media::create([ // save
                'file_name' => $file->getClientOriginalName(),
                'file_path' => $path,
                'file_type' => $file->getClientMimeType() ?: 'application/octet-stream',
                'file_size' => $file->getSize() ?: 0,
            ]);

            $uploadedItems[] = $this->mapMediaItem($media); // state
        }

        if ($request->wantsJson()) { // check
            return response()->json([
                'success' => true,
                'message' => count($uploadedItems) . ' file(s) uploaded successfully.',
                'items' => $uploadedItems,
            ]);
        }

        return redirect()->route('admin.library')->with('success', count($uploadedItems) . ' file(s) uploaded to library successfully.'); // redirect
    }

    // --5. getItems (API for MediaPickerModal)--
    public function getItems(Request $request)
    {
        $query = Media::orderBy('created_at', 'desc'); // state

        if ($request->filled('search')) { // check
            $search = trim($request->input('search')); // input
            $query->where('file_name', 'like', "%{$search}%");
        }

        $items = $query->get()->map(function ($m) { // state
            return $this->mapMediaItem($m); // convert
        });

        if ($request->input('type') === 'image') { // check
            $items = $items->filter(fn ($item) => $item['is_image'])->values();
        }

        return response()->json([
            'items' => $items,
        ]);
    }

    // --6. destroy--
    public function destroy(Media $medium)
    {
        if ($medium->file_type !== 'url' && $medium->file_path) { // check
            Storage::disk('public')->delete($medium->file_path); // trigger
        }

        $medium->delete(); // trigger

        return redirect()->back()->with('success', 'File removed from library.'); // redirect
    }

    // --7. bulkDestroy--
    public function bulkDestroy(Request $request)
    {
        $request->validate([ // validate
            'ids' => 'required|array|min:1', // validate
            'ids.*' => 'integer|exists:media,id', // validate
        ]);

        $items = Media::whereIn('id', $request->input('ids'))->get(); // state
        $count = 0; // state

        foreach ($items as $item) { // loop
            if ($item->file_type !== 'url' && $item->file_path) { // check
                Storage::disk('public')->delete($item->file_path); // trigger
            }
            $item->delete(); // trigger
            $count++; // state
        }

        return redirect()->back()->with('success', "{$count} file(s) removed from library."); // redirect
    }
}
