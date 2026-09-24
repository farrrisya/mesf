<?php

// --1. imports--
namespace App\Http\Controllers;

use App\Models\Album;
use App\Models\News;
use App\Models\Notice;
use Inertia\Inertia;
use Inertia\Response;

// --2. main controller--
class EditorController extends Controller
{
    /**
     * Display the editor dashboard.
     */
    public function index(): Response
    {
        return Inertia::render('Editor/Dashboard', [ // screen
            'stats' => [
                'newsCount' => News::count(), // state
                'albumsCount' => Album::count(), // state
            ]
        ]);
    }
}
