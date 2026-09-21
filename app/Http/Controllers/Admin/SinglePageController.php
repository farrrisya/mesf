<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Str;

class SinglePageController extends Controller
{
    private $slugCategoryMap = [
        'ar-rahnu' => "AR-RAHNU X'CHANGE",
        'coop-mart' => 'COOP MART',
        'knstp' => 'KNSTP SMART SOLUTIONS'
    ];

    public function edit($slug)
    {
        if (!array_key_exists($slug, $this->slugCategoryMap)) {
            abort(404);
        }

        $category = $this->slugCategoryMap[$slug];
        
        $product = Product::where('category', $category)->first();

        $titleMap = [
            'ar-rahnu' => 'Ar-Rahnu',
            'coop-mart' => 'Coop Mart',
            'knstp' => 'KNSTP Smart Solutions'
        ];

        return Inertia::render('Admin/SinglePage/Edit', [
            'slug' => $slug,
            'pageTitle' => $titleMap[$slug],
            'product' => $product
        ]);
    }

    public function update(Request $request, $slug)
    {
        if (!array_key_exists($slug, $this->slugCategoryMap)) {
            abort(404);
        }

        $category = $this->slugCategoryMap[$slug];

        $request->validate([
            'title' => 'nullable|string|max:255',
            'media_type' => 'required|in:file,url,media',
            'file' => 'nullable|file|mimes:jpg,jpeg,png,pdf,doc,docx|max:40960',
            'url_link' => 'nullable|url',
            'file_path' => 'nullable|string',
            'description' => 'nullable|string',
            'description2' => 'nullable|string'
        ]);

        $product = Product::firstOrNew(['category' => $category]);
        $product->title = $request->title ?? '';
        $product->description = $request->description;
        $product->description2 = $request->description2;
        
        // Handle media
        if ($request->media_type === 'url') {
            $product->media_type = 'url';
            $product->url_link = $request->url_link;
            $product->file_path = null;
            $product->file_size = null;
        } elseif ($request->media_type === 'media') {
            $product->media_type = 'file'; // Store as file internally if picking from media
            $product->file_path = $request->file_path;
            $product->url_link = null;
            $product->file_size = null;
        } elseif ($request->media_type === 'file') {
            if ($request->hasFile('file')) {
                $file = $request->file('file');
                $filename = time() . '_' . Str::slug(pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME)) . '.' . $file->getClientOriginalExtension();
                $path = $file->storeAs('products', $filename, 'public');
                
                // Delete old file if it exists
                if ($product->file_path && \Illuminate\Support\Facades\Storage::disk('public')->exists($product->file_path)) {
                    \Illuminate\Support\Facades\Storage::disk('public')->delete($product->file_path);
                }

                $product->media_type = 'file';
                $product->file_path = $path;
                $product->url_link = null;
                $product->file_size = round($file->getSize() / 1024 / 1024, 2) . ' MB';
            } else {
                // If no new file is uploaded, but the file_path was cleared by the user
                if (empty($request->file_path)) {
                    if ($product->file_path && \Illuminate\Support\Facades\Storage::disk('public')->exists($product->file_path)) {
                        \Illuminate\Support\Facades\Storage::disk('public')->delete($product->file_path);
                    }
                    $product->file_path = null;
                    $product->file_size = null;
                }
            }
        }

        if (!isset($product->is_active)) {
            $product->is_active = true;
        }
        $product->save();

        return redirect()->back()->with('success', 'Halaman berjaya dikemaskini.');
    }
}
