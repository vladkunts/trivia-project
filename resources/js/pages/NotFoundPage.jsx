import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function NotFoundPage() {
    const navigate = useNavigate();

    return (
        <div className="container mt-5 text-center">
            <h1 className="display-4">404 - Page Not Found</h1>
            <p className="lead">The page you're looking for doesn't exist.</p>
            <button className="btn btn-primary mt-3" onClick={() => navigate('/')}>
                Go to Home
            </button>
        </div>
    );
}
