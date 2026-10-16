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
        Schema::table('users', function (Blueprint $table) {
            $table->string('gamer_tag')->nullable()->after('name');
            $table->string('primary_game')->nullable()->after('gamer_tag');
            $table->string('state_region')->nullable()->after('primary_game');
            $table->json('game_ids')->nullable()->after('state_region');
            $table->string('avatar_path')->nullable()->after('game_ids');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['gamer_tag', 'primary_game', 'state_region', 'game_ids', 'avatar_path']);
        });
    }
};
