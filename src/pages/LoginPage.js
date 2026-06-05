import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function LoginPage() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            const response = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
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

    return (
        <div className="auth-page-container">
            <Link to="/" className="back-button">
                <ArrowLeft size={16} />
                Back to MidiPad
            </Link>

            <div className="auth-card">
                <h1>Welcome Back</h1>

                {error && <div className="auth-error" style={{marginBottom: '1rem'}}>{error}</div>}

                <form className="auth-form" onSubmit={handleSubmit}>
                    <div className="auth-input-group">
                        <label>Email or Username</label>
                        <input type="text" name="email" className="auth-input" placeholder="example@email.com" required value={formData.email} onChange={handleChange} />
                    </div>

                    <div className="auth-input-group">
                        <label>Password</label>
                        <input type="password" name="password" className="auth-input" placeholder="••••••••" required value={formData.password} onChange={handleChange} />
                    </div>

                    {/* Место для капчи Cloudflare */}
                    <div style={{ height: '60px', background: '#111', border: '1px solid #333', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#555', fontSize: '0.8rem', marginTop: '0.5rem' }}>
                        Cloudflare Turnstile Captcha Placeholder
                    </div>

                    <button type="submit" className="btn-auth-submit" disabled={isLoading}>
                        {isLoading ? 'Logging in...' : 'Log In'}
                    </button>
                </form>

                <div className="auth-divider">OR</div>

                <button type="button" className="btn-discord">
                    <svg width="20" height="20" viewBox="0 0 127.14 96.36" fill="white" xmlns="http://www.w3.org/2000/svg"><path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a67.55,67.55,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1,105.25,105.25,0,0,0,32.19-16.14c2.64-27.38-4.51-51.11-18.9-72.15ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.31,60,73.31,53s5-12.74,11.43-12.74S96.2,46,96.12,53,91.08,65.69,84.69,65.69Z"/></svg>
                    Continue with Discord
                </button>

                <div className="auth-footer">
                    <Link to="/register">Don't have an account?</Link>
                    <Link to="/forgot-password" style={{marginTop: '0.3rem'}}>Forgot password?</Link>
                </div>
            </div>
        </div>
    );
}