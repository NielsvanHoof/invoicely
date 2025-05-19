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
     * Show the login page.
     */
    public function create(Request $request): Response
    {
        return Inertia::render('auth/login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => $request->session()->get('status'),
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): RedirectResponse
    {
        // Determine which guard to use based on the request
        $guard = $this->determineGuard($request);

        // Authenticate using the determined guard
        $request->authenticate($guard);

        $request->session()->regenerate();

        // Redirect based on the guard type
        return $this->getRedirectPath($guard);
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        // Logout from both guards to ensure complete session cleanup
        Auth::guard('web')->logout();
        Auth::guard('client')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }

    /**
     * Determine which guard to use for authentication.
     */
    private function determineGuard(Request $request): string
    {
        // You can determine the guard based on various factors:
        // 1. A specific parameter in the request
        // 2. The URL path
        // 3. A specific header
        // For now, we'll use a request parameter 'guard_type'
        return $request->input('guard_type', 'web');
    }

    /**
     * Get the redirect path based on the guard type.
     */
    private function getRedirectPath(string $guard): RedirectResponse
    {
        return match ($guard) {
            'client' => redirect()->intended(route('client.dashboard', absolute: false)),
            default => redirect()->intended(route('dashboard', absolute: false)),
        };
    }
}
