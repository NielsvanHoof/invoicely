<?php

namespace App\Http\Controllers\Settings;

use App\Enums\CurrencyType;
use App\Events\InvalidateAnalyticsCacheEvent;
use App\Events\InvalidateDashBoardCacheEvent;
use App\Http\Controllers\Controller;
use App\Models\User;
use Auth;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class CurrencyController extends Controller
{
    /**
     * Display the currency settings page.
     */
    public function index(): Response
    {
        return Inertia::render('settings/currency', [
            'userCurrency' => auth()->user()->currency,
        ]);
    }

    /**
     * Update the user's currency preference.
     */
    public function update(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'currency' => ['required', 'string', 'max:3', Rule::enum(CurrencyType::class)],
        ]);

        /** @var User $user */
        $user = Auth::user();
        $user->currency = $validated['currency'];
        $user->save();

        InvalidateDashBoardCacheEvent::dispatch($user);
        InvalidateAnalyticsCacheEvent::dispatch($user);

        return redirect()->back()->with('success', 'Currency updated successfully.');
    }
}
