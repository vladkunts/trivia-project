import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function QuizForm() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        full_name: '',
        email: '',
        difficulty: 'easy',
        type: 'multiple',
        number_of_questions: 5,
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrorMessage('');

        try {
            const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

            const response = await fetch('/search', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': token,
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                const data = await response.json();
                navigate('/quiz', { state: data });
            } else {
                const err = await response.json();
                setErrorMessage(err.message || 'Invalid form data');
            }
        } catch (error) {
            console.error('Request error:', error);
            setErrorMessage('An error occurred while submitting the form.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="container mt-5">
            <div className="card shadow">
                <div className="card-header">
                    <h2 className="mb-0 text-center">Start Trivia</h2>
                </div>
                <div className="card-body">
                    {errorMessage && (
                        <div className="alert alert-danger" role="alert">
                            {errorMessage}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="form-floating mb-3">
                            <input
                                type="text"
                                id="full_name"
                                name="full_name"
                                className="form-control"
                                placeholder="Jane Doe"
                                value={formData.full_name}
                                onChange={handleChange}
                                required
                            />
                            <label htmlFor="full_name">Full Name</label>
                        </div>

                        <div className="form-floating mb-3">
                            <input
                                type="email"
                                id="email"
                                name="email"
                                className="form-control"
                                placeholder="jane.doe@example.com"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                            <label htmlFor="email">Email</label>
                        </div>

                        <div className="form-floating mb-3">
                            <select
                                id="difficulty"
                                name="difficulty"
                                className="form-select"
                                value={formData.difficulty}
                                onChange={handleChange}
                                required
                            >
                                <option value="" disabled>Select difficulty</option>
                                <option value="easy">Easy</option>
                                <option value="medium">Medium</option>
                                <option value="hard">Hard</option>
                            </select>
                            <label htmlFor="difficulty">Difficulty</label>
                        </div>

                        <div className="form-floating mb-3">
                            <select
                                id="type"
                                name="type"
                                className="form-select"
                                value={formData.type}
                                onChange={handleChange}
                                required
                            >
                                <option value="" disabled>Select type</option>
                                <option value="multiple">Multiple Choice</option>
                                <option value="boolean">True / False</option>
                            </select>
                            <label htmlFor="type">Type</label>
                        </div>

                        <div className="form-floating mb-4">
                            <input
                                type="number"
                                id="amount"
                                name="number_of_questions"
                                className="form-control"
                                placeholder="Number of Questions"
                                min="1"
                                max="50"
                                value={formData.number_of_questions}
                                onChange={handleChange}
                                required
                            />
                            <label htmlFor="amount">Amount</label>
                        </div>

                        <div className="d-grid">
                            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                                {isSubmitting ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                        Submitting...
                                    </>
                                ) : (
                                    'Start Quiz'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
