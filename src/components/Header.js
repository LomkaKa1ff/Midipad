import React from 'react';
import { Search, UploadCloud, LogIn } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Header() {
    return (
        <header className="header">
            <div className="header-left">
                <Link to="/" className="logo-container">
                    <img src="/midipadLogo.png" alt="MidiPad Logo" className="logo-image" />
                    <span className="logo-text">MidiPad</span>
                </Link>

                <nav className="header-nav">
                    <Link to="/about" className="header-link">About Us</Link>
                    <Link to="/dmca" className="header-link">Rules & DMCA</Link>
                    <Link to="/contacts" className="header-link">Contacts</Link>
                </nav>
            </div>

            <div className="search-container">
                <Search className="search-icon" size={18} />
                <input
                    type="text"
                    placeholder="Search MIDI track, author, or tag..."
                    className="search-input"
                />
            </div>

            <div className="header-actions">
                <button className="btn btn-primary">
                    <UploadCloud size={18} />
                    Upload MIDI
                </button>
                <button className="btn btn-secondary">
                    <LogIn size={18} />
                    Log In
                </button>
            </div>
        </header>
    );
}