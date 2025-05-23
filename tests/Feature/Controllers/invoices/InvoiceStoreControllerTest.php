<?php

namespace Tests\Feature\Controllers\Invoices;

use App\Enums\InvoiceStatus;
use App\Models\Client;
use App\Models\Team;
use App\Models\User;
use App\Policies\InvoicePolicy;
use Illuminate\Http\UploadedFile;
use Mockery\MockInterface;

use function Pest\Laravel\actingAs;
use function Pest\Laravel\assertDatabaseHas;

beforeEach(function () {
    $this->user = User::factory()->create();
});

test('A user can create an invoice', function () {
    $this->partialMock(InvoicePolicy::class, function (MockInterface $mock) {
        $mock->shouldReceive('create')->andReturn(true);
    });

    $team = Team::factory()->create();
    $client = Client::factory()->create();
    $this->user->team()->associate($team);
    $this->user->save();

    $data = [
        'invoice_number' => 'INV-123',
        'client_id' => $client->id,
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

    $team = Team::factory()->create();
    $client = Client::factory()->create();
    $this->user->team()->associate($team);
    $this->user->save();

    $data = [
        'invoice_number' => 'INV-123',
        'client_id' => $client->id,
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
});
