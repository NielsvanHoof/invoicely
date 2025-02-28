<?php

namespace App\Helpers;

class Formatters
{
    /**
     * Format an amount to 2 decimal places
     */
    public static function formatAmount(float $amount): string
    {
        return number_format($amount, 2);
    }
}
