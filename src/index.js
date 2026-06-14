import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.js';
import { HelmetProvider } from 'react-helmet-async';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <HelmetProvider>
            <App />
        </HelmetProvider>
    </React.StrictMode>
);