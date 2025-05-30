<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class TriviaFlowTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function it_shows_the_form(): void
    {
        $response = $this->get('/');
        $response->assertStatus(200);
        $response->assertSee('<div id="app">', false);
    }

    #[Test]
    public function it_validates_form_submission(): void
    {
        $response = $this->postJson('/search', [
            'full_name' => '',
            'email' => 'not-an-email',
            'number_of_questions' => 0,
            'difficulty' => 'impossible',
            'type' => 'unknown',
        ]);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors([
            'full_name',
            'email',
            'number_of_questions',
            'difficulty',
            'type',
        ]);
    }

    #[Test]
    public function it_fails_when_no_questions_remain(): void
    {
        Http::fake([
            'opentdb.com/*' => Http::response([
                'results' => [
                    [
                        'category' => 'Entertainment: Video Games',
                        'question' => 'Test?',
                        'correct_answer' => 'Yes',
                        'incorrect_answers' => ['No']
                    ]
                ]
            ], 200),
        ]);

        $response = $this->postJson('/search', [
            'full_name' => 'Test User',
            'email' => 'john.doe@example.com',
            'number_of_questions' => 5,
            'difficulty' => 'easy',
            'type' => 'multiple',
        ]);

        $response->assertStatus(422);
        $response->assertJson([
            'message' => 'Could not find suitable questions after several attempts. All questions were filtered out.',
        ]);
    }
}
