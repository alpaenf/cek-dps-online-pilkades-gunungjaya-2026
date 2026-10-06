<?php

namespace Tests\Feature;

use App\Models\Tps;
use App\Models\Voter;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DpsSearchTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_view_home_page(): void
    {
        $response = $this->get('/');
        $response->assertStatus(200);
    }

    public function test_can_search_voter_by_nik(): void
    {
        $tps = Tps::create([
            'nomor_tps' => 'TPS 1',
            'nama_lokasi' => 'Balai Desa',
            'dusun' => 'Krajan',
        ]);

        $voter = Voter::create([
            'tps_id' => $tps->id,
            'nik' => '3327091205850001',
            'nama' => 'BUDI SANTOSO',
            'dusun' => 'Krajan',
            'rt' => '01',
            'rw' => '02',
            'status' => 'DPS',
        ]);

        $response = $this->postJson('/api/check-dps', [
            'nik' => '3327091205850001',
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'found' => true,
                'nama' => 'BUDI SANTOSO',
                'nik_masked' => '3327********0001',
            ]);
    }

    public function test_cannot_search_invalid_nik(): void
    {
        $response = $this->postJson('/api/check-dps', [
            'nik' => '123',
        ]);

        $response->assertStatus(400)
            ->assertJson([
                'found' => false,
            ]);
    }

    public function test_recap_data_is_calculated_from_real_database(): void
    {
        $tps1 = Tps::create([
            'nomor_tps' => 'TPS 1',
            'nama_lokasi' => 'Balai Desa',
            'dusun' => 'Krajan',
        ]);

        $tps2 = Tps::create([
            'nomor_tps' => 'TPS 2',
            'nama_lokasi' => 'SDN 01',
            'dusun' => 'Gombong',
        ]);

        Voter::create([
            'tps_id' => $tps1->id,
            'nik' => '3327091205850001',
            'nama' => 'PEMILIH LAKI 1',
            'jenis_kelamin' => 'L',
            'status' => 'DPS',
        ]);

        Voter::create([
            'tps_id' => $tps1->id,
            'nik' => '3327091205850002',
            'nama' => 'PEMILIH PEREMPUAN 1',
            'jenis_kelamin' => 'P',
            'status' => 'DPS',
        ]);

        Voter::create([
            'tps_id' => $tps2->id,
            'nik' => '3327091205850003',
            'nama' => 'PEMILIH LAKI 2',
            'jenis_kelamin' => 'L',
            'status' => 'DPS',
        ]);

        $response = $this->get('/');
        $response->assertStatus(200);

        $recap = $response->viewData('page')['props']['recapData'];
        $this->assertEquals(3, $recap['totalDps']);
        $this->assertEquals(2, $recap['totalLakiLaki']);
        $this->assertEquals(1, $recap['totalPerempuan']);
        $this->assertCount(2, $recap['tpsStats']);
        $this->assertEquals(2, $recap['tpsStats'][0]['total']);
        $this->assertEquals(1, $recap['tpsStats'][1]['total']);
    }
}
