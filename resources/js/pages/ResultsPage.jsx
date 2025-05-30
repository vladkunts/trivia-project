import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function ResultsPage() {
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get('/results/data')
            .then(res => {
                setQuestions(res.data.questions || []);
                setAnswers(res.data.answers || []);
            })
            .catch(() => {
                alert('Failed to load results.');
                navigate('/');
            })
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return <div className="container mt-5">Loading...</div>;
    }

    const score = questions.reduce((acc, q, idx) => {
        const userAnswer = answers[idx];
        return userAnswer === q.correct_answer ? acc + 1 : acc;
    }, 0);

    return (
        <div className="container mt-5">
            <div className="text-center mb-4">
                <h2>Quiz Results</h2>
                <div className="alert alert-info mt-3">
                    You scored <strong>{score}</strong> out of <strong>{questions.length}</strong>!
                </div>
                <button className="btn btn-primary mt-3" onClick={() => navigate('/')}>
                    Try Again
                </button>
            </div>

            <div className="mt-5">
                {questions.map((q, idx) => {
                    const userAnswer = answers[idx];
                    const isCorrect = userAnswer === q.correct_answer;

                    return (
                        <div className="card mb-3" key={idx}>
                            <div className="card-body">
                                <h5 dangerouslySetInnerHTML={{ __html: q.question }} />
                                <p>
                                    Your answer:{' '}
                                    <span className={isCorrect ? 'text-success' : 'text-danger'}>
                                        <strong dangerouslySetInnerHTML={{ __html: userAnswer || 'No answer' }} />
                                    </span>
                                </p>
                                {!isCorrect && (
                                    <p>
                                        Correct answer:{' '}
                                        <span className="text-success">
                                            <strong dangerouslySetInnerHTML={{ __html: q.correct_answer }} />
                                        </span>
                                    </p>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
