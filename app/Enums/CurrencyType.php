<?php

namespace App\Enums;

enum CurrencyType: string
{
    case USD = 'USD';
    case EUR = 'EUR';
    case GBP = 'GBP';
    case JPY = 'JPY';
    case CAD = 'CAD';
    case AUD = 'AUD';
    case CHF = 'CHF';
    case CNY = 'CNY';
    case INR = 'INR';
    case BRL = 'BRL';

    /**
     * Get the label for the enum value.
     */
    public function label(): string
    {
        return match ($this) {
            self::USD => 'US Dollar ($)',
            self::EUR => 'Euro (€)',
            self::GBP => 'British Pound (£)',
            self::JPY => 'Japanese Yen (¥)',
            self::CAD => 'Canadian Dollar (CA$)',
            self::AUD => 'Australian Dollar (A$)',
            self::CHF => 'Swiss Franc (CHF)',
            self::CNY => 'Chinese Yuan (¥)',
            self::INR => 'Indian Rupee (₹)',
            self::BRL => 'Brazilian Real (R$)',
        };
    }

    /**
     * Get all available currencies as an array of select options.
     */
    public static function options(): array
    {
        return collect(self::cases())->map(fn ($case) => [
            'value' => $case->value,
            'label' => $case->label(),
        ])->toArray();
    }
}
