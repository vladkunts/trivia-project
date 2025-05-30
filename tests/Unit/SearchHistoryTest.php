<?php

namespace Tests\Unit;

use App\Models\SearchHistory;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class SearchHistoryTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function it_can_create_a_record(): void
    {
        $data = [
            'full_name' => 'Test User',
            'email' => 'john.doe@example.com',
            'number_of_questions' => 5,
            'difficulty' => 'easy',
            'type' => 'multiple',
        ];

        $record = SearchHistory::create($data);

        $this->assertDatabaseHas('search_histories', [
            'email' => 'john.doe@example.com',
            'number_of_questions' => 5,
        ]);

        $this->assertEquals('easy', $record->difficulty);
    }
}
