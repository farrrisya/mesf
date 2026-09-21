<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SettingController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $settings = Setting::all()->pluck('value', 'key')->toArray(); // state

        // Ensure valid default asset paths if unset or corrupted
        if (empty($settings['logoUrl']) || $settings['logoUrl'] === '[object Object]' || $settings['logoUrl'] === '[object File]') {
            $settings['logoUrl'] = '/images/mesf_logo.png';
        }
        if (empty($settings['bannerUrl']) || $settings['bannerUrl'] === '[object Object]' || $settings['bannerUrl'] === '[object File]') {
            $settings['bannerUrl'] = '/images/mesf_bg_v2.jpg';
        }

        return Inertia::render('Admin/Settings', [ // screen
            'settings' => $settings
        ]);
    }

    /**
     * Update the specified settings in storage.
     */
    public function update(Request $request)
    {
        $data = $request->except(['_token', '_method']);

        if ($request->hasFile('logoFile')) {
            $path = $request->file('logoFile')->store('settings', 'public');
            Setting::updateOrCreate(
                ['key' => 'logoUrl'],
                ['value' => '/storage/' . $path]
            );
            unset($data['logoFile']);
        }

        if ($request->hasFile('bannerFile')) {
            $path = $request->file('bannerFile')->store('settings', 'public');
            Setting::updateOrCreate(
                ['key' => 'bannerUrl'],
                ['value' => '/storage/' . $path]
            );
            unset($data['bannerFile']);
        }

        foreach ($data as $key => $value) {
            if ($value === null || $value === '[object Object]' || $value === '[object File]') {
                continue;
            }
            if ($value instanceof \Illuminate\Http\UploadedFile) {
                $path = $value->store('settings', 'public');
                $value = '/storage/' . $path;
            }
            Setting::updateOrCreate( // save
                ['key' => $key],
                ['value' => (string) $value]
            );
        }

        return back()->with('success', 'Settings updated successfully.'); // redirect
    }
}
