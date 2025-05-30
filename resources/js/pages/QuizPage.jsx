import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function QuizPage() {
    const navigate = useNavigate();

    const [questions, setQuestions] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const res = await axios.get('/results/data');

                if (!res.data.questions || res.data.questions.length === 0) {
                    alert('No quiz data found. Please start again.');
                    navigate('/');
                    return;
                }

                setQuestions(res.data.questions);
            } catch (error) {
                alert('Something went wrong while loading quiz questions.');
                navigate('/');
            } finally {
                setLoading(false);
            }
        };

        fetchQuestions();
    }, [navigate]);

    const handleSubmit = (answerHtml) => {
        const div = document.createElement('div');
        div.innerHTML = answerHtml;
        const textAnswer = div.textContent || div.innerText || '';

        axios.post('/submit-answer', { answer: textAnswer })
            .then(() => {
                const next = currentIndex + 1;
                if (next < questions.length) {
                    setCurrentIndex(next);
                } else {
                    navigate('/results');
                }
            });
    };

    if (loading) {
        return <div className="container mt-5">Loading...</div>;
    }

    const currentQuestion = questions[currentIndex];

    return (
        <div className="container mt-5">
            <h2 className="mb-4">Question {currentIndex + 1} of {questions.length}</h2>
            <div className="card mb-4">
                <div className="card-body">
                    <h5 className="card-title" dangerouslySetInnerHTML={{ __html: currentQuestion.question }}></h5>
                    <div className="list-group">
                        {currentQuestion.shuffled_answers?.map((answerHtml, index) => (
                            <button
                                key={index}
                                className="list-group-item list-group-item-action"
                                onClick={() => handleSubmit(answerHtml)}
                                dangerouslySetInnerHTML={{ __html: answerHtml }}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
