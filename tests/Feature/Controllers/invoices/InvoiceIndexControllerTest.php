<?php

namespace Tests\Feature\Controllers\Invoices;

use App\Models\Team;
use App\Models\User;
use App\Policies\InvoicePolicy;
use Mockery\MockInterface;

use function Pest\Laravel\actingAs;
use function Pest\Laravel\get;

beforeEach(function () {
    $this->user = User::factory()->create();
});

test('it shows the invoice page for a logged in user', function () {
    $this->partialMock(InvoicePolicy::class, function (MockInterface $mock) {
        $mock->shouldReceive('viewAny')->andReturn(true);
    });

    $response = actingAs($this->user)->get(route('invoices.index'));

    $response->assertOk();
});

test('it shows the invoice page for a logged in user with a team', function () {
    $this->partialMock(InvoicePolicy::class, function (MockInterface $mock) {
        $mock->shouldReceive('viewAny')->andReturn(true);
    });

    $team = Team::factory()->create();
    $this->user->team()->associate($team);
    $this->user->save();

    $response = actingAs($this->user)->get(route('invoices.index'));

    $response->assertOk();
});

test('it redirects to the login page for an unauthenticated user', function () {
    $response = get(route('invoices.index'));

    $response->assertRedirect(route('login'));
});
