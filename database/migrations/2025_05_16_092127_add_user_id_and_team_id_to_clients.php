<?php

use App\Models\Team;
use App\Models\User;
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
        Schema::table('clients', function (Blueprint $table) {
            $table->foreignIdFor(User::class)->nullable()->constrained()->cascadeOnDelete();
            $table->foreignIdFor(Team::class)->nullable()->constrained()->cascadeOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('clients', function (Blueprint $table) {
            $table->dropForeign(['user_id']);
            $table->dropForeign(['team_id']);
            $table->dropColumn('user_id');
            $table->dropColumn('team_id');
        });
    }
};
