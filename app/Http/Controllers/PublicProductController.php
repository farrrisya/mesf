<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PublicProductController extends Controller
{
    /**
     * Display the specified resource.
     */
    public function show(Product $product)
    {
        return Inertia::render('Public/ProdukShow', [
            'product' => $product
        ]);
    }
}
