<?php

// --1. imports--
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

// --2. main migration--
return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::dropIfExists('applications');
        Schema::dropIfExists('financing_schemes');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::create('financing_schemes', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->decimal('interest_rate', 5, 2);
            $table->decimal('max_amount', 12, 2);
            $table->timestamps();
        });

        Schema::create('applications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('financing_scheme_id')->constrained('financing_schemes')->onDelete('cascade');
            $table->decimal('amount', 12, 2);
            $table->integer('duration_months');
            $table->enum('status', ['pending', 'approved', 'rejected'])->default('pending');
            $table->text('rejection_reason')->nullable();
            $table->timestamps();
        });
    }
};
