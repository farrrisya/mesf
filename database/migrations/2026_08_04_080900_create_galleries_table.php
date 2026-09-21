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
        Schema::dropIfExists('galleries'); // drop if stuck
        Schema::create('galleries', function (Blueprint $table) { // state
            $table->id();
            $table->string('title'); // properties
            $table->string('category')->default('Aktiviti'); // properties
            $table->string('type')->default('image'); // properties
            $table->string('image_path')->nullable(); // properties
            $table->string('video_url')->nullable(); // properties
            $table->text('description')->nullable(); // properties
            $table->timestamps(); // properties
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('galleries'); // trigger
    }
};
