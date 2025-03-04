<?php

namespace App\Console\Commands;

use App\Mail\Reminders\InvoiceReminderMail;
use App\Services\Reminders\ReminderService;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Mail;

class SendInvoiceReminders extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:send-invoice-reminders';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Send due invoice reminders to clients';

    /**
     * Execute the console command.
     */
    public function handle(ReminderService $reminderService)
    {
        $this->info('Sending invoice reminders...');

        $dueReminders = $reminderService->getDueReminders();

        if ($dueReminders->isEmpty()) {
            $this->info('No reminders due to be sent.');

            return Command::SUCCESS;
        }

        $this->info("Found {$dueReminders->count()} reminders to send.");

        $bar = $this->output->createProgressBar($dueReminders->count());
        $bar->start();

        foreach ($dueReminders as $reminder) {
            $invoice = $reminder->invoice;

            // Skip if the invoice doesn't have a client email
            if (empty($invoice->client_email)) {
                $this->warn("Skipping reminder for invoice #{$invoice->invoice_number} - no client email");
                $bar->advance();

                continue;
            }

            try {
                // Send the email
                Mail::to($invoice->client_email)
                    ->send(new InvoiceReminderMail($reminder, $invoice));

                // Mark the reminder as sent
                $reminderService->markAsSent($reminder);

            } catch (\Exception $e) {
                $this->error("Failed to send reminder for invoice #{$invoice->invoice_number}: {$e->getMessage()}");
            }

            $bar->advance();
        }

        $bar->finish();
        $this->newLine(2);
        $this->info('Reminder sending completed.');

        return Command::SUCCESS;
    }
}
