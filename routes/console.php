<?php

use App\Console\Commands\SendInvoiceRemindersCommand;
use Spatie\Health\Commands\RunHealthChecksCommand;

Schedule::command('backup:clean')->daily()->at('01:00');
Schedule::command('backup:run')->daily()->at('01:30');

Schedule::command(RunHealthChecksCommand::class)->everyMinute();

Schedule::command(SendInvoiceRemindersCommand::class)->dailyAt('10:00');
