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
        Schema::create('invoices', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('invoice_number')->unique();
            $table->string('client_name');
            $table->string('client_email')->nullable();
            $table->text('client_address')->nullable();
            $table->decimal('amount', 10, 2);
            $table->date('issue_date');
            $table->date('due_date');
            $table->enum('status', ['draft', 'sent', 'paid', 'overdue'])->default('draft');
            $table->text('notes')->nullable();
            $table->string('file_path')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('invoices');
    }
};
