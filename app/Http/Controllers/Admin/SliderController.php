<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Slider;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class SliderController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Sliders/Index', [
            'sliders' => Slider::orderBy('sort_order', 'asc')->orderBy('created_at', 'desc')->get(),
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Sliders/Create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'image' => 'nullable|image',
            'image_path' => 'nullable|string',
            'title' => 'nullable|string|max:255',
            'sort_order' => 'nullable|integer|min:0',
        ]);

        if (!$request->hasFile('image') && empty($request->image_path)) {
            return back()->withErrors(['image' => 'Sila muat naik gambar atau pilih dari Media Library.']);
        }

        $path = $request->image_path ?? null;
        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('sliders', 'public');
        }

        Slider::create([
            'title' => $request->title,
            'image_path' => $path,
            'sort_order' => $request->sort_order ?? 0,
            'is_active' => true,
        ]);

        return redirect()->route('admin.sliders.index')->with('success', 'Slider berjaya ditambah.');
    }

    public function edit(Slider $slider)
    {
        return Inertia::render('Admin/Sliders/Edit', [
            'slider' => $slider
        ]);
    }

    public function update(Request $request, Slider $slider)
    {
        $request->validate([
            'image' => 'nullable|image',
            'image_path' => 'nullable|string',
            'title' => 'nullable|string|max:255',
            'sort_order' => 'nullable|integer|min:0',
        ]);

        if ($request->hasFile('image')) {
            if ($slider->image_path && Storage::disk('public')->exists($slider->image_path)) {
                Storage::disk('public')->delete($slider->image_path);
            }
            $slider->image_path = $request->file('image')->store('sliders', 'public');
        } elseif (!empty($request->image_path)) {
            $slider->image_path = $request->image_path;
        }

        $slider->title = $request->title;
        $slider->sort_order = $request->sort_order ?? 0;
        $slider->save();

        return back()->with('success', 'Slider berjaya dikemaskini.');
    }

    public function updateStatus(Request $request, Slider $slider)
    {
        $request->validate([
            'is_active' => 'required|boolean',
        ]);

        $slider->update([
            'is_active' => $request->is_active,
        ]);

        return redirect()->back()->with('success', 'Status slider berjaya dikemaskini.');
    }

    public function destroy(Slider $slider)
    {
        if ($slider->image_path && Storage::disk('public')->exists($slider->image_path)) {
            Storage::disk('public')->delete($slider->image_path);
        }
        
        $slider->delete();

        return redirect()->back()->with('success', 'Slider berjaya dipadam.');
    }

    public function bulkDestroy(Request $request)
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:sliders,id'
        ]);

        $sliders = Slider::whereIn('id', $request->ids)->get();

        foreach ($sliders as $slider) {
            if ($slider->image_path && Storage::disk('public')->exists($slider->image_path)) {
                Storage::disk('public')->delete($slider->image_path);
            }
            $slider->delete();
        }

        return redirect()->back()->with('success', 'Slider yang dipilih berjaya dipadam.');
    }
}
