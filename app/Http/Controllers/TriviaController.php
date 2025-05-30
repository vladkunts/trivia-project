<?php

namespace App\Http\Controllers;

use Illuminate\Contracts\View\View;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

use App\Models\SearchHistory;

class TriviaController extends Controller
{
    public function search(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'full_name' => 'required|string|max:255',
            'email' => 'required|email',
            'number_of_questions' => 'required|integer|min:1|max:50',
            'difficulty' => 'required|in:easy,medium,hard',
            'type' => 'required|in:multiple,boolean',
        ]);

        SearchHistory::create($validated);

        $questions = [];
        $attempts = 0;
        $maxAttempts = 3;

        do {
            $response = Http::get('https://opentdb.com/api.php', [
                'amount' => $validated['number_of_questions'],
                'difficulty' => $validated['difficulty'],
                'type' => $validated['type'],
            ])->json();

            $questions = collect($response['results'] ?? [])
                ->filter(fn($q) => $q['category'] !== 'Entertainment: Video Games')
                ->map(function ($q) {
                    $answers = $q['incorrect_answers'];
                    $answers[] = $q['correct_answer'];
                    shuffle($answers);
                    $q['shuffled_answers'] = $answers;
                    return $q;
                })
                ->sortBy('category')
                ->values()
                ->all();

            $attempts++;
        } while (count($questions) === 0 && $attempts < $maxAttempts);

        if (count($questions) === 0) {
            return response()->json([
                'message' => 'Could not find suitable questions after several attempts. All questions were filtered out.',
            ], 422);
        }

        session([
            'questions' => $questions,
            'answers' => [],
        ]);

        return response()->json([
            'success' => true,
            'questions' => $questions,
        ]);
    }

    public function submitAnswer(Request $request): JsonResponse
    {
        $answer = $request->input('answer');

        if (!$answer) {
            return response()->json(['error' => 'Missing answer'], 400);
        }

        $answers = session('answers', []);
        $answers[] = $answer;

        session(['answers' => $answers]);

        return response()->json(['success' => true]);
    }

    public function results(): JsonResponse
    {
        $questions = session('questions');
        $answers = session('answers');

        $isResultsDataRequest = request()->is('results/data');

        $shouldRedirect = !$questions || ($isResultsDataRequest && !$answers);

        if ($shouldRedirect) {
            return response()->json(['redirect' => true], 302);
        }

        return response()->json([
            'questions' => $questions,
            'answers' => $answers,
        ]);
    }
}
