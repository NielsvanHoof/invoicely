<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('reminders', function (Blueprint $table) {
            $table->id();
            $table->foreignUlid('invoice_id')->constrained()->cascadeOnDelete();
            $table->string('type'); // 'upcoming', 'overdue', etc.
            $table->dateTime('scheduled_date');
            $table->dateTime('sent_at')->nullable();
            $table->text('message')->nullable();
            $table->timestamps();

            // Add index for performance
            $table->index(['scheduled_date', 'sent_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reminders');
    }
};
