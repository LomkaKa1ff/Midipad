import React, { useState, useEffect } from 'react';
import { Search, UploadCloud, LogIn, User, LogOut } from 'lucide-react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import UploadModal from './UploadModal';
import LanguageSwitcher from "./LanguageSwitcher";

export default function Header() {
    const { t } = useTranslation();
    const navigate = useNavigate();

    // Search logic
    const [searchParams] = useSearchParams();
    const currentSearch = searchParams.get('search') || '';
    const currentSort = searchParams.get('sort') || 'trending';

    const [inputValue, setInputValue] = useState(currentSearch);

    useEffect(() => {
        setInputValue(currentSearch);
    }, [currentSearch]);

    const handleSearch = (e) => {
        if (e.key === 'Enter') {
            if (inputValue.trim() === '') {
                navigate(`/?sort=${currentSort}`);
            } else {
                navigate(`/?sort=${currentSort}&search=${encodeURIComponent(inputValue.trim())}`);
            }
        }
    };

    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.reload();
    };

    const handleUploadClick = () => {
        if (!user) {
            navigate('/login');
        } else {
            setIsUploadModalOpen(true);
        }
    };

    return (
        <header className="header">
            <div className="header-left">
                <Link to="/" className="logo-container" onClick={() => setInputValue('')}>
                    <img src="/midipadLogo.png" alt="MidiPad Logo" className="logo-image" />
                    <span className="logo-text">MidiPad</span>
                </Link>
                <nav className="header-nav">
                    <Link to="/about" className="header-link">{t('nav_about')}</Link>
                    <Link to="/dmca" className="header-link">{t('nav_rules')}</Link>
                    <Link to="/contacts" className="header-link">{t('nav_contacts')}</Link>
                </nav>
            </div>

            <div className="search-container">
                <Search className="search-icon" size={18} />
                <input
                    type="text"
                    placeholder={t('search_placeholder')}
                    className="search-input"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleSearch}
                />
            </div>

            <div className="header-actions" style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>

                <LanguageSwitcher />

                <button className="btn btn-primary" onClick={handleUploadClick}>
                    <UploadCloud size={18} />
                    {t('upload_midi')}
                </button>

                {user ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Link to="/profile" className="btn btn-secondary" style={{ display: 'flex', textDecoration: 'none', border: 'none', background: 'rgba(255, 255, 255, 0.05)' }}>
                            <User size={18} />
                            {user.username}
                        </Link>
                        <button onClick={handleLogout} className="btn btn-secondary" style={{ display: 'flex', padding: '0.5rem', border: 'none', color: '#ff5555' }} title={t('log_out')}>
                            <LogOut size={18} />
                        </button>
                    </div>
                ) : (
                    <Link to="/login" className="btn btn-secondary" style={{ display: 'flex', textDecoration: 'none' }}>
                        <LogIn size={18} />
                        {t('log_in')}
                    </Link>
                )}
            </div>

            <UploadModal
                isOpen={isUploadModalOpen}
                onClose={() => setIsUploadModalOpen(false)}
            />
        </header>
    );
}