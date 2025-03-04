<?php

use App\Console\Commands\SendInvoiceReminders;
use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Spatie\Health\Commands\RunHealthChecksCommand;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Schedule::command('backup:clean')->daily()->at('01:00');
Schedule::command('backup:run')->daily()->at('01:30');

Schedule::command(RunHealthChecksCommand::class)->everyMinute();

Schedule::command(SendInvoiceReminders::class)->dailyAt('10:00');
