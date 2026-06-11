import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function RegisterPage() {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [agreed, setAgreed] = useState(false);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const { username, email, password, confirmPassword } = formData;

        if (!agreed) {
            return setError(t('err_agree_terms'));
        }

        if (username.length < 3 || username.length > 16) {
            return setError('Username must be between 3 and 16 characters.');
        }
        if (!/^[a-zA-Z0-9_]+$/.test(username)) {
            return setError('Username can only contain letters, numbers, and underscores.');
        }
        if (password.length < 8) {
            return setError('Password must be at least 8 characters long.');
        }
        const digitsCount = (password.match(/\d/g) || []).length;
        if (digitsCount < 3) {
            return setError('Password must contain at least 3 numbers.');
        }
        if (password !== confirmPassword) {
            return setError('Passwords do not match!');
        }

        setIsLoading(true);
        try {
            const regResponse = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, email, password })
            });
            const regData = await regResponse.json();

            if (!regResponse.ok) throw new Error(regData.message || 'Registration failed');

            const loginResponse = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const loginData = await loginResponse.json();

            if (loginResponse.ok) {
                localStorage.setItem('token', loginData.token);
                localStorage.setItem('user', JSON.stringify(loginData.user));
                navigate('/');
            } else {
                navigate('/login');
            }

        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="auth-page-container">
            <Link to="/" className="back-button">
                <ArrowLeft size={16} />
                {t('back_to_midipad')}
            </Link>

            <div className="auth-card">
                <h1>{t('create_account')}</h1>

                {error && <div className="auth-error" style={{marginBottom: '1rem'}}>{error}</div>}

                <form className="auth-form" onSubmit={handleSubmit}>
                    <div className="auth-input-group">
                        <label>{t('email')}</label>
                        <input type="email" name="email" className="auth-input" placeholder="example@email.com" required value={formData.email} onChange={handleChange} />
                    </div>

                    <div className="auth-input-group">
                        <label>{t('username')}</label>
                        <input type="text" name="username" className="auth-input" placeholder="username123" required value={formData.username} onChange={handleChange} />
                    </div>

                    <div className="auth-input-group">
                        <label>{t('password')}</label>
                        <input type="password" name="password" className="auth-input" placeholder="••••••••" required value={formData.password} onChange={handleChange} />
                    </div>

                    <div className="auth-input-group">
                        <label>{t('confirm_password')}</label>
                        <input type="password" name="confirmPassword" className="auth-input" placeholder="••••••••" required value={formData.confirmPassword} onChange={handleChange} />
                    </div>

                    <div style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px', padding: '1rem', marginTop: '1rem', marginBottom: '0.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.8rem' }}>
                            <input
                                type="checkbox"
                                id="register-terms"
                                checked={agreed}
                                onChange={(e) => { setAgreed(e.target.checked); setError(''); }}
                                style={{ marginTop: '0.2rem', cursor: 'pointer', width: '16px', height: '16px', accentColor: '#00ffcc' }}
                            />
                            <div>
                                <label htmlFor="register-terms" style={{ color: '#e0e0e0', fontSize: '0.9rem', cursor: 'pointer' }}>
                                    {t('i_agree')} <a href="/terms" style={{ color: '#fff', textDecoration: 'underline' }}>{t('terms_of_use')}</a> {t('and')} <a href="/privacy" style={{ color: '#fff', textDecoration: 'underline' }}>{t('privacy_policy')}</a>.
                                </label>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', margin: '0.4rem 0 0 0', lineHeight: '1.4' }}>
                                    {t('privacy_notice')}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div style={{ height: '60px', background: '#111', border: '1px solid #333', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#555', fontSize: '0.8rem', marginTop: '0.5rem' }}>
                        Cloudflare Turnstile Captcha Placeholder
                    </div>

                    <button
                        type="submit"
                        className="btn-auth-submit"
                        disabled={isLoading || !agreed}
                        style={{ opacity: (!agreed) ? 0.5 : 1, cursor: (!agreed) ? 'not-allowed' : 'pointer', transition: 'all 0.2s ease' }}
                    >
                        {isLoading ? t('creating_account') : t('create_account_btn')}
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
                    <Link to="/login">{t('already_have_account')}</Link>
                </div>
            </div>
        </div>
    );
}