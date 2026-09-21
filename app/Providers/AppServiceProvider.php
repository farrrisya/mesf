<?php

// --1. imports--
namespace App\Providers;

use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;
use Illuminate\Validation\Rules\Password;
use Illuminate\Support\Facades\Event;
use Illuminate\Auth\Events\Login;
use App\Listeners\LogSuccessfulLogin;

// --2. main component--
class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        // register binds
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Vite::prefetch(concurrency: 3); // prefetch

        Event::listen(
            Login::class,
            LogSuccessfulLogin::class,
        );

        Password::defaults(function () { // defaults
            return Password::min(8) // check
                ->letters()
                ->mixedCase()
                ->numbers()
                ->symbols();
        });
    }
}
