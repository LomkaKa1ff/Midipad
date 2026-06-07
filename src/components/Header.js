import React, { useState, useEffect } from 'react'; // Добавили useEffect
import { Search, UploadCloud, LogIn, User, LogOut } from 'lucide-react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom'; // Добавили useSearchParams
import UploadModal from './UploadModal';

export default function Header() {
    const navigate = useNavigate();

    // --- ЛОГИКА ПОИСКА ---
    const [searchParams] = useSearchParams();
    const currentSearch = searchParams.get('search') || '';
    const currentSort = searchParams.get('sort') || 'trending'; // Сохраняем активную вкладку

    const [inputValue, setInputValue] = useState(currentSearch);

    // Если URL изменился извне (например, клик по логотипу), обновляем инпут
    useEffect(() => {
        setInputValue(currentSearch);
    }, [currentSearch]);

    const handleSearch = (e) => {
        if (e.key === 'Enter') {
            if (inputValue.trim() === '') {
                // Если пусто — просто оставляем сортировку
                navigate(`/?sort=${currentSort}`);
            } else {
                // Если есть текст — добавляем параметр search
                navigate(`/?sort=${currentSort}&search=${encodeURIComponent(inputValue.trim())}`);
            }
        }
    };
    // ---------------------

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
                {/* Если кликаем по логотипу, скидываем все параметры и возвращаем на главную */}
                <Link to="/" className="logo-container" onClick={() => setInputValue('')}>
                    <img src="/midipadLogo.png" alt="MidiPad Logo" className="logo-image" />
                    <span className="logo-text">MidiPad</span>
                </Link>
                <nav className="header-nav">
                    <Link to="/about" className="header-link">About Us</Link>
                    <Link to="/dmca" className="header-link">Rules & DMCA</Link>
                    <Link to="/contacts" className="header-link">Contacts</Link>
                </nav>
            </div>

            {/* ОЖИВЛЕННЫЙ ПОИСК */}
            <div className="search-container">
                <Search className="search-icon" size={18} />
                <input
                    type="text"
                    placeholder="Search MIDI..."
                    className="search-input"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleSearch}
                />
            </div>

            <div className="header-actions">
                <button className="btn btn-primary" onClick={handleUploadClick}>
                    <UploadCloud size={18} />
                    Upload MIDI
                </button>

                {user ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Link to="/profile" className="btn btn-secondary" style={{ display: 'flex', textDecoration: 'none', border: 'none', background: 'rgba(255, 255, 255, 0.05)' }}>
                            <User size={18} />
                            {user.username}
                        </Link>
                        <button onClick={handleLogout} className="btn btn-secondary" style={{ display: 'flex', padding: '0.5rem', border: 'none', color: '#ff5555' }} title="Log out">
                            <LogOut size={18} />
                        </button>
                    </div>
                ) : (
                    <Link to="/login" className="btn btn-secondary" style={{ display: 'flex', textDecoration: 'none' }}>
                        <LogIn size={18} />
                        Log In
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