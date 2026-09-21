<?php

namespace Tests\Feature;

use App\Models\FinancingScheme;
use App\Models\User;
use App\Models\Application;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class BackendLogicTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_is_redirected_from_member_and_admin_routes()
    {
        $this->get(route('member.dashboard'))
            ->assertRedirect(route('login'));

        $this->get(route('admin.notices.index'))
            ->assertRedirect(route('login'));
    }

    public function test_member_can_access_member_routes_but_not_admin_routes()
    {
        $member = User::factory()->create(['role' => 'member']);

        $this->actingAs($member)
            ->get(route('member.dashboard'))
            ->assertStatus(200);

        $this->actingAs($member)
            ->get(route('admin.notices.index'))
            ->assertStatus(403);
    }

    public function test_admin_can_access_admin_routes_but_not_member_routes()
    {
        $admin = User::factory()->create(['role' => 'admin']);

        $this->actingAs($admin)
            ->get(route('admin.notices.index'))
            ->assertStatus(200);

        $this->actingAs($admin)
            ->get(route('member.dashboard'))
            ->assertStatus(403);
    }

    public function test_dashboard_dispatches_correctly_based_on_user_role()
    {
        $member = User::factory()->create(['role' => 'member']);
        $admin = User::factory()->create(['role' => 'admin']);

        $this->actingAs($member)
            ->get(route('dashboard'))
            ->assertRedirect(route('member.dashboard'));

        $this->actingAs($admin)
            ->get(route('dashboard'))
            ->assertRedirect(route('admin.dashboard'));
    }

    public function test_member_can_submit_valid_financing_application()
    {
        $member = User::factory()->create(['role' => 'member']);
        $scheme = FinancingScheme::create([
            'name' => 'Skim Ujian',
            'interest_rate' => 4.00,
            'max_amount' => 10000.00,
        ]);

        $response = $this->actingAs($member)
            ->post(route('member.financing.submit'), [
                'scheme_id' => $scheme->id,
                'amount_requested' => 5000.00,
            ]);

        $response->assertSessionHasNoErrors();
        $this->assertDatabaseHas('applications', [
            'user_id' => $member->id,
            'scheme_id' => $scheme->id,
            'amount_requested' => 5000.00,
            'status' => 'pending',
        ]);
    }

    public function test_member_cannot_submit_application_exceeding_max_amount()
    {
        $member = User::factory()->create(['role' => 'member']);
        $scheme = FinancingScheme::create([
            'name' => 'Skim Ujian',
            'interest_rate' => 4.00,
            'max_amount' => 10000.00,
        ]);

        $response = $this->actingAs($member)
            ->post(route('member.financing.submit'), [
                'scheme_id' => $scheme->id,
                'amount_requested' => 15000.00,
            ]);

        $response->assertSessionHasErrors(['amount_requested']);
        $this->assertDatabaseMissing('applications', [
            'user_id' => $member->id,
        ]);
    }

    public function test_admin_can_update_application_status()
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $member = User::factory()->create(['role' => 'member']);
        $scheme = FinancingScheme::create([
            'name' => 'Skim Ujian',
            'interest_rate' => 4.00,
            'max_amount' => 10000.00,
        ]);

        $application = Application::create([
            'user_id' => $member->id,
            'scheme_id' => $scheme->id,
            'amount_requested' => 5000.00,
            'status' => 'pending',
        ]);

        $response = $this->actingAs($admin)
            ->patch(route('admin.applications.update-status', $application), [
                'status' => 'approved',
            ]);

        $response->assertSessionHasNoErrors();
        $this->assertEquals('approved', $application->fresh()->status);
    }
}
