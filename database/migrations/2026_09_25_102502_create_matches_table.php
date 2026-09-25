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
        Schema::create('matches', function (Blueprint $table) {
            $table->id();
            $table->string('tournament_name');
            $table->string('game_title');
            $table->string('round')->nullable();
            $table->string('format')->nullable();
            $table->string('team_a_name');
            $table->string('team_a_tag')->nullable();
            $table->integer('team_a_score')->nullable();
            $table->string('team_b_name');
            $table->string('team_b_tag')->nullable();
            $table->integer('team_b_score')->nullable();
            $table->date('scheduled_date');
            $table->string('scheduled_time')->nullable();
            $table->string('venue')->nullable();
            $table->string('stream_url')->nullable();
            $table->string('status')->default('UPCOMING'); // UPCOMING, LIVE, COMPLETED, POSTPONED
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('matches');
    }
};
