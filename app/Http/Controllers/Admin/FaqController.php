<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Faq;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FaqController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $faqs = Faq::orderBy('sort_order', 'asc')->orderBy('created_at', 'desc')->get(); // state

        return Inertia::render('Admin/SoalanLazim/Index', [ // screen
            'faqs' => $faqs
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Admin/SoalanLazim/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'question' => 'required|string',
            'answer' => 'required|string',
        ]);

        Faq::create([ // save
            'question' => $request->question,
            'answer' => $request->answer,
            'is_active' => $request->boolean('is_active', true),
            'sort_order' => $request->input('sort_order', 0),
        ]);

        return redirect()->route('admin.soalan-lazim.index')->with('success', 'Soalan Lazim berjaya ditambah.'); // redirect
    }

    public function edit(Faq $faq)
    {
        return Inertia::render('Admin/SoalanLazim/Edit', [
            'faq' => $faq
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Faq $faq)
    {
        $request->validate([
            'question' => 'required|string',
            'answer' => 'required|string',
        ]);

        $faq->update([ // save
            'question' => $request->question,
            'answer' => $request->answer,
            'is_active' => $request->boolean('is_active', $faq->is_active),
            'sort_order' => $request->input('sort_order', $faq->sort_order),
        ]);

        return back()->with('success', 'Soalan Lazim berjaya dikemaskini.'); // redirect
    }

    /**
     * Update the status of the specified resource.
     */
    public function updateStatus(Request $request, Faq $faq)
    {
        $request->validate([
            'is_active' => 'required|boolean',
        ]);

        $faq->update([ // save
            'is_active' => $request->is_active,
        ]);

        return back(); // redirect
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Faq $faq)
    {
        $faq->delete(); // trigger

        return back()->with('success', 'Soalan Lazim berjaya dipadam.'); // redirect
    }
}
