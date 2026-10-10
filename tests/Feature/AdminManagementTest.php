<?php

namespace Tests\Feature;

use App\Models\ImportDuplicateVoter;
use App\Models\PendingSkippedVoter;
use App\Models\Tps;
use App\Models\User;
use App\Models\Voter;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminManagementTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_is_redirected_to_login_when_accessing_admin_url(): void
    {
        $response = $this->get('/admin');
        $response->assertRedirect('/login');

        $dashboardResponse = $this->get('/admin/dashboard');
        $dashboardResponse->assertRedirect('/login');
    }

    public function test_non_admin_user_is_forbidden_from_admin_dashboard(): void
    {
        $user = User::factory()->create([
            'role' => 'user',
        ]);

        $response = $this->actingAs($user)->get('/admin/dashboard');
        $response->assertStatus(403);
    }

    public function test_admin_user_can_access_admin_dashboard(): void
    {
        $admin = User::factory()->create([
            'role' => 'admin',
        ]);

        $tps = Tps::create([
            'nomor_tps' => 'TPS 01',
            'nama_lokasi' => 'Balai Desa',
            'dusun' => 'Dusun Krajan',
        ]);

        $response = $this->actingAs($admin)->get('/admin/dashboard');
        $response->assertStatus(200);
    }

    public function test_admin_can_create_update_and_delete_tps(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);

        // Create TPS
        $createResponse = $this->actingAs($admin)->post('/admin/tps', [
            'nomor_tps' => 'TPS 08',
            'nama_lokasi' => 'Gedung Serbaguna',
            'dusun' => 'Dusun Tiga',
            'rt' => '01',
            'rw' => '02',
        ]);

        $createResponse->assertSessionHas('success');
        $this->assertDatabaseHas('tps', ['nomor_tps' => 'TPS 08']);

        $tps = Tps::where('nomor_tps', 'TPS 08')->first();

        // Update TPS
        $updateResponse = $this->actingAs($admin)->put("/admin/tps/{$tps->id}", [
            'nomor_tps' => 'TPS 08',
            'nama_lokasi' => 'Gedung Olahraga',
            'dusun' => 'Dusun Tiga',
        ]);

        $updateResponse->assertSessionHas('success');
        $this->assertDatabaseHas('tps', ['nama_lokasi' => 'Gedung Olahraga']);

        // Delete TPS
        $deleteResponse = $this->actingAs($admin)->delete("/admin/tps/{$tps->id}");
        $deleteResponse->assertSessionHas('success');
        $this->assertDatabaseMissing('tps', ['id' => $tps->id]);
    }

    public function test_admin_can_create_update_and_delete_voter_dps(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);

        $tps = Tps::create([
            'nomor_tps' => 'TPS 01',
            'nama_lokasi' => 'Balai Desa',
            'dusun' => 'Krajan',
        ]);

        // Create Voter
        $createResponse = $this->actingAs($admin)->post('/admin/voters', [
            'nik' => '3327090101900001',
            'nama' => 'Budi Santoso',
            'jenis_kelamin' => 'L',
            'tps_id' => $tps->id,
            'dusun' => 'Krajan',
            'rt' => '01',
            'rw' => '01',
            'status' => 'DPS',
        ]);

        $createResponse->assertSessionHas('success');
        $this->assertDatabaseHas('voters', ['nik' => '3327090101900001']);

        $voter = Voter::where('nik', '3327090101900001')->first();

        // Update Voter
        $updateResponse = $this->actingAs($admin)->put("/admin/voters/{$voter->id}", [
            'nik' => '3327090101900001',
            'nama' => 'Budi Santoso SPd',
            'jenis_kelamin' => 'L',
            'tps_id' => $tps->id,
            'dusun' => 'Krajan Barat',
        ]);

        $updateResponse->assertSessionHas('success');
        $this->assertDatabaseHas('voters', ['nama' => 'Budi Santoso SPd']);

        // Delete Voter
        $deleteResponse = $this->actingAs($admin)->delete("/admin/voters/{$voter->id}");
        $deleteResponse->assertSessionHas('success');
        $this->assertDatabaseMissing('voters', ['id' => $voter->id]);
    }

    public function test_admin_can_view_and_update_profile_whatsapp_email_and_password(): void
    {
        $admin = User::factory()->create([
            'email' => 'admin@desa.id',
            'role' => 'admin',
        ]);

        $viewResponse = $this->actingAs($admin)->get('/admin/profile');
        $viewResponse->assertStatus(200);

        $updateResponse = $this->actingAs($admin)->patch('/admin/profile', [
            'email' => 'admin.baru@desa.id',
            'whatsapp_panitia' => '081234567890',
            'current_password' => 'password',
            'new_password' => 'password123',
            'new_password_confirmation' => 'password123',
        ]);

        $updateResponse->assertSessionHas('success');
        $this->assertDatabaseHas('users', ['email' => 'admin.baru@desa.id']);
        $this->assertDatabaseHas('app_settings', [
            'key' => 'whatsapp_panitia',
            'value' => '081234567890',
        ]);
    }

    public function test_admin_can_update_mascot_and_redaksi_settings(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);

        $response = $this->actingAs($admin)->post('/admin/settings/mascot', [
            'mascot_title' => 'Judul Baru Maskot Glawu Keren',
            'mascot_desc' => 'Deskripsi baru karakter Glawu ramah warga.',
            'mascot_slogan' => 'Pilkades Damai, Gunungjaya Bersatu!',
            'mascot_speeches' => "Halo warga RT 01!\nAyo sukseskan Pilkades!\nJaga kerukunan bersama.",
            'ajakan_1_title' => 'Poin Ajakan Satu',
            'ajakan_1_desc' => 'Deskripsi ajakan satu',
            'ajakan_2_title' => 'Poin Ajakan Dua',
            'ajakan_2_desc' => 'Deskripsi ajakan dua',
            'ajakan_3_title' => 'Poin Ajakan Tiga Anti Politik Uang',
            'ajakan_3_desc' => 'Deskripsi ajakan tiga',
            'ajakan_4_title' => 'Poin Ajakan Empat',
            'ajakan_4_desc' => 'Deskripsi ajakan empat',
            'data_phase' => 'DPT',
            'pengumuman' => 'Pengumuman terbaru Pilkades 2026',
        ]);

        $response->assertRedirect('/admin/dashboard?tab=redaksi');
        $response->assertSessionHas('success');

        $this->assertDatabaseHas('app_settings', [
            'key' => 'mascot_title',
            'value' => 'Judul Baru Maskot Glawu Keren',
        ]);
        $this->assertDatabaseHas('app_settings', [
            'key' => 'mascot_slogan',
            'value' => 'Pilkades Damai, Gunungjaya Bersatu!',
        ]);
        $this->assertDatabaseHas('app_settings', [
            'key' => 'data_phase',
            'value' => 'DPT',
        ]);
    }

    public function test_admin_cannot_reset_voter_data_with_incorrect_password(): void
    {
        $admin = User::factory()->create([
            'role' => 'admin',
            'password' => bcrypt('correct-password'),
        ]);

        $tps = Tps::create([
            'nomor_tps' => 'TPS 01',
            'nama_lokasi' => 'Balai Desa',
            'dusun' => 'Krajan',
        ]);

        Voter::create([
            'nik' => '3327090101900001',
            'nama' => 'Budi Santoso',
            'jenis_kelamin' => 'L',
            'tps_id' => $tps->id,
            'dusun' => 'Krajan',
            'status' => 'DPS',
        ]);

        $response = $this->actingAs($admin)->post('/admin/voters/reset-all', [
            'password' => 'wrong-password',
        ]);

        $response->assertSessionHasErrors('password');
        $this->assertDatabaseCount('voters', 1);
    }

    public function test_admin_can_reset_all_voter_data_with_valid_password(): void
    {
        $admin = User::factory()->create([
            'role' => 'admin',
            'password' => bcrypt('password123'),
        ]);

        $tps = Tps::create([
            'nomor_tps' => 'TPS 01',
            'nama_lokasi' => 'Balai Desa',
            'dusun' => 'Krajan',
        ]);

        Voter::create([
            'nik' => '3327090101900001',
            'nama' => 'Budi Santoso',
            'jenis_kelamin' => 'L',
            'tps_id' => $tps->id,
            'dusun' => 'Krajan',
            'status' => 'DPS',
        ]);

        ImportDuplicateVoter::create([
            'row_number' => 8,
            'nik' => '3327090101900001',
            'nama' => 'Budi Santoso Duplikat',
            'tps_id' => $tps->id,
            'tps_name' => 'TPS 01',
            'first_seen_row_number' => 7,
            'first_seen_name' => 'Budi Santoso',
            'status_match' => 'IDENTIK',
        ]);

        PendingSkippedVoter::create([
            'row_number' => 12,
            'nama' => 'Calon Belum Lengkap',
            'nik' => '3327090101900099',
            'tps_id' => $tps->id,
        ]);

        $this->assertDatabaseCount('voters', 1);
        $this->assertDatabaseCount('import_duplicate_voters', 1);
        $this->assertDatabaseCount('pending_skipped_voters', 1);

        $response = $this->actingAs($admin)->post('/admin/voters/reset-all', [
            'password' => 'password123',
        ]);

        $response->assertSessionHas('success');
        $this->assertDatabaseCount('voters', 0);
        $this->assertDatabaseCount('import_duplicate_voters', 0);
        $this->assertDatabaseCount('pending_skipped_voters', 0);
        // TPS and Admin user must remain intact
        $this->assertDatabaseCount('tps', 1);
        $this->assertDatabaseCount('users', 1);
    }
}
