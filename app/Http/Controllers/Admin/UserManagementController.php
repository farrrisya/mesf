<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class UserManagementController extends Controller
{
    // --1. index--
    public function index()
    {
        $users = User::where('role', '!=', 'member')
            ->select('id', 'name', 'email', 'role', 'is_active', 'created_at')
            ->orderBy('created_at', 'desc')
            ->get(); // state

        return Inertia::render('Admin/Users/Index', [ // screen
            'users' => $users,
        ]);
    }

    // --2. create--
    public function create()
    {
        return Inertia::render('Admin/Users/Create'); // screen
    }

    // --3. store--
    public function store(Request $request)
    {
        $validated = $request->validate([ // validate
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email',
            'password' => 'required|string|min:8|confirmed',
            'role' => ['required', Rule::in(['admin', 'editor', 'secretariat'])],
        ]);

        User::create([ // save
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => $validated['role'],
            'is_active' => true,
        ]);

        return redirect()->route('admin.users.index')->with('success', 'Staff account created successfully.'); // redirect
    }

    // --4. edit--
    public function edit(User $user)
    {
        if ($user->role === 'member') { // check
            abort(404);
        }

        return Inertia::render('Admin/Users/Edit', [ // screen
            'staffUser' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'is_active' => (bool) $user->is_active,
                'created_at' => $user->created_at,
            ],
        ]);
    }

    // --5. update--
    public function update(Request $request, User $user)
    {
        if ($user->role === 'member') { // check
            abort(404);
        }

        $validated = $request->validate([ // validate
            'role' => ['required', Rule::in(['admin', 'editor', 'secretariat'])],
            'is_active' => 'required|boolean',
        ]);

        // safeguard: cannot remove the last admin
        if ($user->role === 'admin' && ($validated['role'] !== 'admin' || !$validated['is_active'])) { // check
            $otherAdminsCount = User::where('role', 'admin')
                ->where('is_active', true)
                ->where('id', '!=', $user->id)
                ->count(); // check

            if ($otherAdminsCount === 0) { // check
                return back()->withErrors(['error' => 'Cannot remove the last Admin.']); // error
            }
        }

        $user->update([ // save
            'role' => $validated['role'],
            'is_active' => $validated['is_active'],
        ]);

        return redirect()->route('admin.users.index')->with('success', 'Staff account updated successfully.'); // redirect
    }

    // --6. destroy--
    public function destroy(User $user)
    {
        if ($user->role === 'member') { // check
            abort(404);
        }

        // safeguard 1: cannot delete currently logged in account
        if ($user->id === Auth::id()) { // check
            return back()->withErrors(['error' => 'You cannot delete your own account while logged in.']); // error
        }

        // safeguard 2: cannot delete the last admin
        if ($user->role === 'admin') { // check
            $otherAdminsCount = User::where('role', 'admin')
                ->where('id', '!=', $user->id)
                ->count(); // check

            if ($otherAdminsCount === 0) { // check
                return back()->withErrors(['error' => 'Cannot remove the last Admin.']); // error
            }
        }

        $user->delete(); // save

        return redirect()->route('admin.users.index')->with('success', 'Staff account deleted successfully.'); // redirect
    }

    // --7. switch to--
    public function switchTo(User $user)
    {
        $admin = Auth::user(); // state

        // safeguard 1: cannot impersonate another admin
        if ($user->role === 'admin') { // check
            return back()->withErrors(['error' => 'Cannot impersonate another Admin account.']); // error
        }

        // safeguard 2: cannot impersonate self
        if ($user->id === $admin->id) { // check
            return back()->withErrors(['error' => 'Cannot impersonate your own account.']); // error
        }

        // store impersonator id in session
        session(['impersonator_id' => $admin->id]); // save

        // log to ActivityLog
        ActivityLog::create([ // save
            'user_id' => $admin->id,
            'action' => 'impersonation_start',
            'description' => "Admin {$admin->name} switched into account {$user->name} ({$user->role})",
            'model_type' => User::class,
            'model_id' => $user->id,
            'properties' => [
                'admin_id' => $admin->id,
                'admin_email' => $admin->email,
                'target_id' => $user->id,
                'target_email' => $user->email,
                'target_role' => $user->role,
            ],
        ]);

        Auth::login($user); // save

        if ($user->role === 'editor') { // check
            return redirect()->route('editor.dashboard')->with('success', "Now viewing as {$user->name} ({$user->role})."); // redirect
        }

        if ($user->role === 'secretariat') { // check
            return redirect()->route('secretariat.dashboard')->with('success', "Now viewing as {$user->name} ({$user->role})."); // redirect
        }

        return redirect()->route('dashboard'); // redirect
    }

    // --8. switch back--
    public function switchBack(Request $request)
    {
        $impersonatorId = session('impersonator_id'); // state

        if (!$impersonatorId) { // check
            return redirect()->route('dashboard'); // redirect
        }

        $currentUser = Auth::user(); // state
        $admin = User::findOrFail($impersonatorId); // state

        // log to ActivityLog
        ActivityLog::create([ // save
            'user_id' => $admin->id,
            'action' => 'impersonation_end',
            'description' => "Admin {$admin->name} returned to Admin account from {$currentUser->name} ({$currentUser->role})",
            'model_type' => User::class,
            'model_id' => $currentUser->id,
            'properties' => [
                'admin_id' => $admin->id,
                'target_id' => $currentUser->id,
            ],
        ]);

        session()->forget('impersonator_id'); // save
        Auth::login($admin); // save

        return redirect()->route('admin.dashboard')->with('success', 'Returned to Admin account.'); // redirect
    }
}
