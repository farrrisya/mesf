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
        Schema::create('news', function (Blueprint $table) {
            $table->id(); // state
            $table->string('title'); // state
            $table->string('slug')->unique(); // state
            $table->string('category')->default('PRESS RELEASES'); // state
            $table->string('tag')->nullable(); // state
            $table->foreignId('author_id')->nullable()->constrained('users')->nullOnDelete(); // state
            $table->text('excerpt')->nullable(); // state
            $table->longText('content')->nullable(); // state
            $table->string('image_path')->nullable(); // state
            $table->string('location')->nullable(); // state
            $table->string('status')->default('published'); // state
            $table->boolean('is_featured')->default(false); // state
            $table->dateTime('published_at')->nullable(); // clock
            $table->unsignedBigInteger('views_count')->default(0); // state
            $table->timestamps(); // clock
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('news'); // trigger
    }
};
