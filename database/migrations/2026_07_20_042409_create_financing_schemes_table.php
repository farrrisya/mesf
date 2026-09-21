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
        Schema::create('financing_schemes', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->decimal('interest_rate', 5, 2); // e.g., 4.50%
            $table->decimal('max_amount', 15, 2); // e.g., 50000.00
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('financing_schemes');
    }
};
