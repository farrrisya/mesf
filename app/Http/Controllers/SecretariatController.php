<?php

// --1. imports--
namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;

// --2. main controller--
class SecretariatController extends Controller
{
    /**
     * Display the secretariat dashboard.
     */
    public function index(): Response
    {
        return Inertia::render('Secretariat/Dashboard'); // screen
    }
}
