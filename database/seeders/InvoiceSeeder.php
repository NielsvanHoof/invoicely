<?php

namespace Database\Seeders;

use App\Models\Invoice;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class InvoiceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get the first user or create one if none exists
        $user = User::first() ?? User::factory()->create();

        // Sample statuses
        $statuses = ['draft', 'sent', 'paid', 'overdue'];

        // Create sample invoices
        for ($i = 1; $i <= 10; $i++) {
            $issueDate = Carbon::now()->subDays(rand(1, 60));
            $dueDate = (clone $issueDate)->addDays(30);
            $status = $statuses[array_rand($statuses)];

            // If due date is in the past and status is 'sent', change to 'overdue'
            if ($dueDate->isPast() && $status === 'sent') {
                $status = 'overdue';
            }

            // Add a file path for some invoices (every third one)
            $filePath = null;
            if ($i % 3 === 0) {
                $filePath = 'invoices/'.$user->id.'/sample_invoice_'.$i.'.pdf';
            }

            Invoice::create([
                'user_id' => $user->id,
                'invoice_number' => 'INV-'.str_pad($i, 4, '0', STR_PAD_LEFT),
                'client_name' => 'Client '.$i,
                'client_email' => 'client'.$i.'@example.com',
                'client_address' => '123 Main St, City '.$i.', Country',
                'amount' => rand(100, 5000) + (rand(0, 99) / 100),
                'issue_date' => $issueDate,
                'due_date' => $dueDate,
                'status' => $status,
                'notes' => $i % 3 === 0 ? 'Sample notes for invoice '.$i : null,
                'file_path' => $filePath,
            ]);
        }
    }
}
