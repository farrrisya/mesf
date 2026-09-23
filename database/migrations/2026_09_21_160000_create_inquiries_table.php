<?php

// --1. imports--
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

// --2. migration--
return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('inquiries', function (Blueprint $table) {
            $table->id();
            $table->enum('type', ['join_tournament', 'partnership', 'host_tournament']); // type
            $table->string('name'); // state
            $table->string('email'); // state
            $table->string('phone'); // state
            $table->string('organization')->nullable(); // state
            $table->text('message')->nullable(); // state
            $table->json('details')->nullable(); // convert
            $table->enum('status', ['pending', 'reviewed', 'approved', 'rejected'])->default('pending'); // state
            $table->text('admin_notes')->nullable(); // state
            $table->foreignId('handled_by')->nullable()->constrained('users')->nullOnDelete(); // check
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('inquiries');
    }
};
