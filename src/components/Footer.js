import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-col">
                    <Link to="/" className="logo-container" style={{ marginBottom: '1rem' }}>
                        <img src="/midipadLogo.png" alt="MidiPad Logo" className="logo-image" style={{ width: '32px', height: '32px' }} />
                        <span className="logo-text" style={{ fontSize: '1.25rem' }}>MidiPad</span>
                    </Link>
                    <p>MidiPad - service for searching and downloading MIDI files for digital instruments and games.</p>
                    <p>Find melodies, covers, and effects from games, memes, and more.</p>
                    <p style={{ marginTop: '0.5rem', fontWeight: 'bold' }}>MIDI for Bards, Sounds for Instruments</p>
                </div>

                <div className="footer-col">
                    <h3>Navigation</h3>
                    <Link to="/">Home</Link>
                    <Link to="/">Trending</Link>
                    <Link to="/">Popular</Link>
                    <Link to="/about">About us</Link>
                    <Link to="/dmca">DMCA / Copyright</Link>
                    <Link to="/contacts">Contacts</Link>
                    <Link to="/privacy">Privacy Policy</Link>
                    <Link to="/terms">Terms of Use</Link>
                </div>

                <div className="footer-col">
                    <h3>Links</h3>
                    <a href="/">Donate</a>
                </div>

                <div className="footer-col">
                    <h3>Contacts</h3>
                    <a href="mailto:support@midipad.me">support@midipad.me</a>
                </div>
            </div>

            <div className="footer-bottom">
                &copy; {new Date().getFullYear()} MidiPad. All rights reserved.
            </div>
        </footer>
    );
}