<?php

namespace Tests\Feature\Controllers\Invoices;

use App\Enums\InvoiceStatus;
use App\Models\Invoice;
use App\Models\User;
use App\Policies\InvoicePolicy;
use Illuminate\Http\UploadedFile;
use Mockery\MockInterface;

use function Pest\Laravel\actingAs;
use function Pest\Laravel\assertDatabaseHas;
use function PHPUnit\Framework\assertMatchesRegularExpression;

beforeEach(function () {
    $this->user = User::factory()->create();
});

test('A user can create an invoice', function () {
    $this->partialMock(InvoicePolicy::class, function (MockInterface $mock) {
        $mock->shouldReceive('create')->andReturn(true);
    });

    $data = [
        'invoice_number' => 'INV-123',
        'client_name' => 'John Doe',
        'client_email' => 'john@doe.com',
        'client_address' => '123 Main St, Anytown, USA',
        'amount' => 100,
        'issue_date' => '2021-01-01',
        'due_date' => '2021-01-15',
        'status' => InvoiceStatus::PAID->value,
        'notes' => 'Test notes',
    ];

    $response = actingAs($this->user)->post(route('invoices.store'), $data);

    $response->assertRedirect(route('invoices.index'));
    $response->assertSessionHas('success', 'Invoice created successfully.');

    assertDatabaseHas('invoices', [
        'invoice_number' => 'INV-123',
    ]);
});

test('A user can create an invoice with a file', function () {
    $this->partialMock(InvoicePolicy::class, function (MockInterface $mock) {
        $mock->shouldReceive('create')->andReturn(true);
    });

    $data = [
        'invoice_number' => 'INV-123',
        'client_name' => 'John Doe',
        'client_email' => 'john@doe.com',
        'client_address' => '123 Main St, Anytown, USA',
        'amount' => 100,
        'issue_date' => '2021-01-01',
        'due_date' => '2021-01-15',
        'status' => InvoiceStatus::PAID->value,
        'notes' => 'Test notes',
        'file' => UploadedFile::fake()->create('invoice.pdf'),
    ];

    $response = actingAs($this->user)->post(route('invoices.store'), $data);

    $response->assertRedirect(route('invoices.index'));
    $response->assertSessionHas('success', 'Invoice created successfully.');

    assertDatabaseHas('invoices', [
        'invoice_number' => 'INV-123',
    ]);

    $invoice = Invoice::where('invoice_number', 'INV-123')->first();

    assertMatchesRegularExpression(
        '/^invoices\/'.$this->user->id.'\/[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}\.pdf$/',
        $invoice->file_path
    );
});
