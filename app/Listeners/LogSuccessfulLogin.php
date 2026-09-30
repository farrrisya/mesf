<?php

namespace App\Listeners;

use Illuminate\Auth\Events\Login;
use App\Models\ActivityLog;

class LogSuccessfulLogin
{
    /**
     * Create the event listener.
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     */
    public function handle(Login $event): void
    {
        ActivityLog::create([
            'user_id' => $event->user->id,
            'action' => 'Sign In',
            'description' => 'Signed into system',
            'model_type' => get_class($event->user),
            'model_id' => $event->user->id,
            'properties' => null,
        ]);
    }
}
