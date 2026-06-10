import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function Footer() {
    const { t } = useTranslation();

    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-col">
                    <Link to="/" className="logo-container" style={{ marginBottom: '1rem' }}>
                        <img src="/midipadLogo.png" alt="MidiPad Logo" className="logo-image" style={{ width: '32px', height: '32px' }} />
                        <span className="logo-text" style={{ fontSize: '1.25rem' }}>{t('app_name')}</span>
                    </Link>
                    <p>{t('footer_desc_1')}</p>
                    <p>{t('footer_desc_2')}</p>
                </div>

                <div className="footer-col">
                    <h3>{t('footer_nav')}</h3>
                    <Link to="/">{t('footer_home')}</Link>
                    <Link to="/">{t('trending')}</Link>
                    <Link to="/">{t('popular')}</Link>
                    <Link to="/about">{t('nav_about')}</Link>
                    <Link to="/dmca">{t('nav_rules')}</Link>
                    <Link to="/contacts">{t('nav_contacts')}</Link>
                    <Link to="/privacy">{t('privacy_policy')}</Link>
                    <Link to="/terms">{t('terms_of_use')}</Link>
                </div>

                <div className="footer-col">
                    <h3>{t('footer_links')}</h3>
                    <a href="https://boosty.to/komkalive"
                       target="_blank"
                       rel="noopener noreferrer"
                    > {t('footer_donate')}</a>
                </div>

                <div className="footer-col">
                    <h3>{t('nav_contacts')}</h3>

                    <a href="mailto:support@midipad.me" style={{ marginBottom: '1rem', display: 'inline-block' }}>
                        support@midipad.net
                    </a>

                    {/* КНОПКА DISCORD */}
                    <a
                        href="https://discord.gg/geS29zbFpC" // 👈 НЕ ЗАБУДЬ ВСТАВИТЬ СВОЮ ССЫЛКУ
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Join our Discord Server"
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '40px',
                            height: '40px',
                            borderRadius: '8px', // Слегка закругленные края смотрятся современнее круга
                            background: 'rgba(255, 255, 255, 0.05)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            color: '#a0a0a0',
                            transition: 'all 0.2s ease',
                            cursor: 'pointer'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'rgba(88, 101, 242, 0.1)';
                            e.currentTarget.style.borderColor = '#5865F2';
                            e.currentTarget.style.color = '#5865F2';
                            e.currentTarget.style.transform = 'translateY(-2px)'; // Легкий прыжок вверх при наведении
                            e.currentTarget.style.boxShadow = '0 4px 12px rgba(88, 101, 242, 0.3)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                            e.currentTarget.style.color = '#a0a0a0';
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = 'none';
                        }}
                    >
                        {/* Иконка Discord SVG */}
                        <svg
                            width="20"
                            height="20"
                            viewBox="0 0 127.14 96.36"
                            fill="currentColor"
                            style={{ display: 'block' }}
                        >
                            <path d="M107.7,8.07A105.15,105.15,0,0,0,77.26,0a77.19,77.19,0,0,0-3.3,6.83A96.67,96.67,0,0,0,53.22,6.83,77.19,77.19,0,0,0,49.88,0,105.15,105.15,0,0,0,19.44,8.07C3.66,31.58-1.86,54.65,1,77.53A105.73,105.73,0,0,0,32,96.36a74.37,74.37,0,0,0,6.73-11A68.21,68.21,0,0,1,28.1,79.91c.85-.62,1.69-1.28,2.5-1.95a75.79,75.79,0,0,0,66,0c.81.67,1.65,1.33,2.5,1.95a68.3,68.3,0,0,1-10.65,5.43,74.58,74.58,0,0,0,6.73,11,105.73,105.73,0,0,0,31-18.83C129.87,50.73,124.08,27.86,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53S36.18,40.36,42.45,40.36,53.93,46,53.7,53,48.72,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.24,60,73.24,53S78.41,40.36,84.69,40.36,96.17,46,95.94,53,91,65.69,84.69,65.69Z"/>
                        </svg>
                    </a>
                </div>
            </div>

            <div className="footer-bottom">
                &copy; {new Date().getFullYear()} {t('all_rights_reserved')}
            </div>
        </footer>
    );
}