<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\TriviaController;

Route::get('/results/data', [TriviaController::class, 'results']);
Route::get('/quiz/data', [TriviaController::class, 'results']);

Route::get('/{any}', fn () => view('app'))->where('any', '.*');

Route::post('/search', [TriviaController::class, 'search']);
Route::post('/submit-answer', [TriviaController::class, 'submitAnswer']);
Route::post('/quiz', [TriviaController::class, 'submitAnswer']);
