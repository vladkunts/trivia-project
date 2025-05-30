import React from 'react';
import { createRoot } from 'react-dom/client';
import AppRouter from './AppRouter';
import 'bootstrap/dist/css/bootstrap.min.css';

const root = createRoot(document.getElementById('app'));
root.render(<AppRouter />);
