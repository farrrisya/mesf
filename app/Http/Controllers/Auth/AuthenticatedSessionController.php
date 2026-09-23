<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;

class AuthenticatedSessionController extends Controller
{
    /**
     * Display the login view.
     */
    public function create(): Response
    {
        return Inertia::render('Admin/Login', [ // screen
            'canResetPassword' => Route::has('password.request'),
            'status' => session('status'),
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): RedirectResponse
    {
        $request->authenticate(); // check

        $request->session()->regenerate(); // save

        $user = $request->user(); // state

        if ($user->role === 'admin') { // check
            return redirect()->intended(route('admin.dashboard', absolute: false)); // redirect
        }

        if ($user->role === 'editor') { // check
            return redirect()->intended(route('editor.dashboard', absolute: false)); // redirect
        }

        if ($user->role === 'secretariat') { // check
            return redirect()->intended(route('secretary.dashboard', absolute: false)); // redirect
        }

        return redirect()->intended('/'); // redirect
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return redirect()->route('login');
    }
}
