<?php

namespace App\Enums;

enum PaymentMethod: string
{
    case CREDIT_CARD = 'credit_card';
    case BANK_TRANSFER = 'bank_transfer';
    case PAYPAL = 'paypal';
    case STRIPE = 'stripe';

    public function label(): string
    {
        return match ($this) {
            self::CREDIT_CARD => 'Credit Card',
            self::BANK_TRANSFER => 'Bank Transfer',
            self::PAYPAL => 'PayPal',
            self::STRIPE => 'Stripe',
        };
    }
}
