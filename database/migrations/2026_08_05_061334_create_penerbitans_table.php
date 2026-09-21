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
        Schema::create('penerbitans', function (Blueprint $table) {
            $table->id();
            $table->string('title'); // properties
            $table->string('category'); // properties (buletin, laporan)
            $table->string('media_type')->default('file'); // properties (file, url)
            $table->string('file_path')->nullable(); // properties
            $table->string('url_link')->nullable(); // properties
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('penerbitans');
    }
};
