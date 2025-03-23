<?php

namespace App\Notifications;

use App\Models\Invoice;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class InvoicePaidNotification extends Notification implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct(protected Invoice $invoice)
    {
        //
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        $formattedAmount = number_format($this->invoice->amount, 2);

        return (new MailMessage)
            ->subject('Invoice #'.$this->invoice->invoice_number.' has been paid')
            ->greeting("Hello {$notifiable->name}!")
            ->line('Good news! Your invoice has been paid.')
            ->line('Invoice #: '.$this->invoice->invoice_number)
            ->line('Client: '.$this->invoice->client_name)
            ->line("Amount: $formattedAmount")
            ->line('Payment Method: '.$this->invoice->payment_method->label())
            ->line('Payment Reference: '.$this->invoice->payment_reference)
            ->line('Paid At: '.$this->invoice->paid_at->format('Y-m-d H:i:s'))
            ->action('View Invoice', url('/invoices/'.$this->invoice->id))
            ->line('Thank you for using our application!');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'invoice_id' => $this->invoice->id,
            'invoice_number' => $this->invoice->invoice_number,
            'client_name' => $this->invoice->client_name,
            'amount' => $this->invoice->amount,
            'payment_method' => $this->invoice->payment_method->value,
            'payment_reference' => $this->invoice->payment_reference,
            'paid_at' => $this->invoice->paid_at->toIso8601String(),
        ];
    }
}
