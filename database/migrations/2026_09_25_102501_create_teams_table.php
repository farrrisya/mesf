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
        Schema::create('teams', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('tag')->nullable();
            $table->string('type')->default('national'); // national, state, pro
            $table->string('region')->nullable();
            $table->string('game_title')->nullable();
            $table->string('manager_name')->nullable();
            $table->string('contact_email')->nullable();
            $table->string('motto')->nullable();
            $table->integer('roster_size')->default(5);
            $table->string('status')->default('ACTIVE');
            $table->string('logo_path')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('teams');
    }
};
