<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        $superAdmin = DB::table('users')->where('email', 'super_admin@mesf.my')->first();
        if ($superAdmin) {
            $admin = DB::table('users')->where('email', 'admin@mesf.my')->first();
            if ($admin) {
                DB::table('activity_logs')
                    ->where('user_id', $superAdmin->id)
                    ->update(['user_id' => $admin->id]);
            }
            DB::table('users')->where('id', $superAdmin->id)->delete();
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // No reverse action needed
    }
};
