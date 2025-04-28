<?php

namespace App\Enums;

enum DocumentType: string
{
    case CONTRACT = 'contract';
    case INVOICE = 'invoice';
    case RECEIPT = 'receipt';
    case OTHER = 'other';
}
