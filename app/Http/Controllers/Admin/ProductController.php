<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $products = Product::whereNotIn('category', ["AR-RAHNU X'CHANGE", "COOP MART", "KNSTP", "KNSTP SMART SOLUTIONS", "Ar-Rahnu", "Coop Mart"])
            ->whereRaw('LOWER(title) NOT LIKE ?', ['%knstp%'])
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('Admin/Produk/Index', [
            'products' => $products
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Admin/Produk/Create');
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
            'title', 'category', 'sub_category', 'media_type', 'url_link', 'description', 'description2'
        ]);

        if ($request->media_type === 'file' && $request->hasFile('file')) {
            $file = $request->file('file');
            $path = $file->store('products', 'public');
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

        Product::create($data);

        return redirect()->route('admin.produk-perkhidmatan.index')->with('success', 'Produk & Perkhidmatan berjaya ditambah.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Product $product)
    {
        return Inertia::render('Admin/Produk/Show', [
            'product' => $product
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Product $product)
    {
        return Inertia::render('Admin/Produk/Edit', [
            'product' => $product
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Product $product)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'category' => 'required|string',
            'media_type' => 'required|string|in:file,url,media',
        ]);

        $data = $request->only([
            'title', 'category', 'sub_category', 'media_type', 'url_link', 'description', 'description2'
        ]);

        if ($request->media_type === 'file') {
            if ($request->hasFile('file')) {
                // Delete old file if exists
                if ($product->file_path && Storage::disk('public')->exists($product->file_path)) {
                    Storage::disk('public')->delete($product->file_path);
                }

                $file = $request->file('file');
                $path = $file->store('products', 'public');
                $data['file_path'] = $path;
                
                // Format file size
                $bytes = $file->getSize();
                $units = ['B', 'KB', 'MB', 'GB', 'TB'];
                $bytes = max($bytes, 0);
                $pow = floor(($bytes ? log($bytes) : 0) / log(1024));
                $pow = min($pow, count($units) - 1);
                $bytes /= (1 << (10 * $pow));
                $data['file_size'] = round($bytes, 2) . ' ' . $units[$pow];
            } else {
                // If no new file is uploaded, check if the file was cleared in the frontend
                // Since 'file_path' is not in $request->only(...), we check $request directly
                if ($request->has('file_path') && empty($request->file_path)) {
                    if ($product->file_path && Storage::disk('public')->exists($product->file_path)) {
                        Storage::disk('public')->delete($product->file_path);
                    }
                    $data['file_path'] = null;
                    $data['file_size'] = null;
                }
            }
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

        $product->update($data);

        return back()->with('success', 'Produk & Perkhidmatan berjaya dikemaskini.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Product $product)
    {
        if ($product->file_path && Storage::disk('public')->exists($product->file_path)) {
            Storage::disk('public')->delete($product->file_path);
        }

        $product->delete();

        return back()->with('success', 'Produk & Perkhidmatan berjaya dipadam.');
    }

    /**
     * Update the active status of the specified resource.
     */
    public function updateStatus(Request $request, Product $product)
    {
        $validated = $request->validate([ // validate
            'is_active' => ['required', 'boolean'],
        ]);

        $product->update(['is_active' => $validated['is_active']]); // save

        return redirect()->back()->with('success', 'Status produk & perkhidmatan berjaya dikemaskini.'); // redirect
    }
}
