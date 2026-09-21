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
        Schema::table('penerbitans', function (Blueprint $table) {
            $table->boolean('is_active')->default(true)->after('url_link');
        });

        Schema::table('notices', function (Blueprint $table) {
            $table->boolean('is_active')->default(true)->after('image_path');
        });

        Schema::table('documents', function (Blueprint $table) {
            $table->boolean('is_active')->default(true)->after('description');
        });

        Schema::table('products', function (Blueprint $table) {
            $table->boolean('is_active')->default(true)->after('description');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('penerbitans', function (Blueprint $table) {
            $table->dropColumn('is_active');
        });

        Schema::table('notices', function (Blueprint $table) {
            $table->dropColumn('is_active');
        });

        Schema::table('documents', function (Blueprint $table) {
            $table->dropColumn('is_active');
        });

        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn('is_active');
        });
    }
};
