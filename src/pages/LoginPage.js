import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Turnstile } from '@marsidev/react-turnstile';

export default function LoginPage() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [captchaToken, setCaptchaToken] = useState(null);
    const [searchParams] = useSearchParams();

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!captchaToken) {
            return setError('Please complete the security check.');
        }

        setIsLoading(true);
        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...formData, captchaToken })
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Invalid credentials');

            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            navigate('/');
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const token = searchParams.get('token');
        const userStr = searchParams.get('user');

        if (token && userStr) {
            localStorage.setItem('token', token);
            localStorage.setItem('user', userStr);
            navigate('/'); // Redirect to home page
        }
    }, [searchParams, navigate]);

    return (
        <div className="auth-page-container">
            <Link to="/" className="back-button">
                <ArrowLeft size={16} />
                {t('back_to_midipad')}
            </Link>

            <div className="auth-card">
                <h1>{t('welcome_back')}</h1>

                {error && <div className="auth-error" style={{marginBottom: '1rem'}}>{error}</div>}

                <form className="auth-form" onSubmit={handleSubmit}>
                    <div className="auth-input-group">
                        <label>{t('email')}</label>
                        <input type="text" name="email" className="auth-input" placeholder="example@email.com" required value={formData.email} onChange={handleChange} />
                    </div>

                    <div className="auth-input-group">
                        <label>{t('password')}</label>
                        <input type="password" name="password" className="auth-input" placeholder="••••••••" required value={formData.password} onChange={handleChange} />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem', marginBottom: '1rem' }}>
                        <Turnstile
                            siteKey="0x4AAAAAADtjiIhg3hksJ485"
                            options={{ theme: 'dark' }}
                            onSuccess={(token) => setCaptchaToken(token)}
                        />
                    </div>

                    <button type="submit" className="btn-auth-submit" disabled={isLoading}>
                        {isLoading ? t('logging_in') : t('log_in')}
                    </button>
                </form>

                <div className="auth-divider">{t('or')}</div>

                <button
                    type="button"
                    className="btn-discord"
                    onClick={() => window.location.href = '/api/auth/discord'}
                >
                    <svg width="20" height="20" viewBox="0 0 127.14 96.36" fill="white" xmlns="http://www.w3.org/2000/svg"><path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a67.55,67.55,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1,105.25,105.25,0,0,0,32.19-16.14c2.64-27.38-4.51-51.11-18.9-72.15ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.31,60,73.31,53s5-12.74,11.43-12.74S96.2,46,96.12,53,91.08,65.69,84.69,65.69Z"/></svg>
                    {t('continue_discord')}
                </button>

                <div className="auth-footer">
                    <Link to="/register">{t('dont_have_account')}</Link>
                    <Link to="/forgot-password" style={{marginTop: '0.3rem'}}>{t('forgot_password')}</Link>
                </div>
            </div>
        </div>
    );
}