<?php

// --1. imports--
namespace App\Http\Controllers;

use App\Models\Setting;
use Inertia\Inertia;
use Inertia\Response;

// --2. main controller--
class SecretaryController extends Controller
{
    /**
     * Display the secretary dashboard.
     */
    public function index(): Response
    {
        $settings = Setting::pluck('value', 'key')->all(); // state

        return Inertia::render('Secretary/Dashboard', [ // screen
            'inquiryChannels' => [
                'generalEmail' => $settings['email_general'] ?? 'inquiry@mesf.my',
                'mediaEmail' => $settings['email_media'] ?? 'media@mesf.my',
                'phone' => $settings['phone'] ?? '+603-0000 0000',
            ]
        ]);
    }
}
