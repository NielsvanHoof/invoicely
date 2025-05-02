<?php

namespace App\Mail\Reminders;

use App\Enums\ReminderType;
use App\Models\Invoice;
use App\Models\Reminder;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class InvoiceReminderMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    /**
     * Create a new message instance.
     */
    public function __construct(
        public Reminder $reminder,
        public Invoice $invoice
    ) {}

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        $subject = match ($this->reminder->type) {
            ReminderType::UPCOMING => "Upcoming Invoice Payment Reminder: #{$this->invoice->invoice_number}",
            ReminderType::OVERDUE => "Overdue Invoice Payment: #{$this->invoice->invoice_number}",
            ReminderType::THANK_YOU => "Thank You for Your Payment: #{$this->invoice->invoice_number}",
        };

        return new Envelope(
            subject: $subject,
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            markdown: 'mail.invoice-reminder-mail',
            with: [
                'reminder' => $this->reminder,
                'invoice' => $this->invoice,
                'message' => $this->reminder->message,
            ],
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}
