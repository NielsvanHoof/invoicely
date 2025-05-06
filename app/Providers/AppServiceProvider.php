<?php

namespace App\Providers;

use App\Models\User;
use Gate;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\ServiceProvider;
use Inertia\Inertia;
use Laravel\Telescope\TelescopeServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        if ($this->app->environment('local') && class_exists(TelescopeServiceProvider::class)) {
            $this->app->register(TelescopeServiceProvider::class);
        }

        Model::shouldBeStrict(! app()->isProduction());

        Model::automaticallyEagerLoadRelationships();

        Inertia::encryptHistory(true);

        Gate::define('view-analytics', function (User $user) {
            return $user->hasRole('invoicer') || $user->hasRole('admin');
        });
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}
