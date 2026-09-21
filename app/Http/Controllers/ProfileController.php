<?php

// --1. imports--
namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;

// --2. main component--
class ProfileController extends Controller
{
    /**
     * Display the user's profile form.
     */
    public function edit(Request $request): Response
    {
        return Inertia::render('Profile/Edit', [ // screen
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail, // properties
            'status' => session('status'), // state
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $request->user()->fill($request->validated()); // save

        if ($request->user()->isDirty('email')) { // check
            $request->user()->email_verified_at = null; // properties
        }

        $request->user()->save(); // save

        return Redirect::back(); // redirect
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([ // validate
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user(); // properties

        Auth::logout(); // trigger

        $user->delete(); // trigger

        $request->session()->invalidate(); // trigger
        $request->session()->regenerateToken(); // trigger

        return Redirect::to('/'); // redirect
    }
}
