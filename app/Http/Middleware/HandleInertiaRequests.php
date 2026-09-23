<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app'; // properties

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request); // properties
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [ // state
            ...parent::share($request),
            'auth' => [
                'user' => $request->user(), // properties
                'is_impersonating' => $request->session()->has('impersonator_id'), // state
                'impersonator_id' => $request->session()->get('impersonator_id'), // state
            ],
            'settings' => function () {
                if (!\Illuminate\Support\Facades\Schema::hasTable('settings')) {
                    return [
                        'logoUrl' => '/images/mesf_logo.png',
                        'bannerUrl' => '/images/mesf_bg_v2.jpg',
                    ];
                }
                $settings = \App\Models\Setting::pluck('value', 'key')->toArray();
                if (empty($settings['logoUrl']) || $settings['logoUrl'] === '[object Object]' || $settings['logoUrl'] === '[object File]') {
                    $settings['logoUrl'] = '/images/mesf_logo.png';
                }
                if (empty($settings['bannerUrl']) || $settings['bannerUrl'] === '[object Object]' || $settings['bannerUrl'] === '[object File]') {
                    $settings['bannerUrl'] = '/images/mesf_bg_v2.jpg';
                }
                return $settings;
            },
        ];
    }
}
