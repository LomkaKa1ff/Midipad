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

                    <a href="mailto:support@midipad.net" style={{ marginBottom: '1rem', display: 'inline-block' }}>
                        support@midipad.net
                    </a>

                    <div style={{ display: 'flex', gap: '12px' }}>
                        <a
                            href="https://discord.gg/geS29zbFpC"
                            target="_blank"
                            rel="noopener noreferrer"
                            title="Join our Discord Server"
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '40px',
                                height: '40px',
                                borderRadius: '8px',
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
                                e.currentTarget.style.transform = 'translateY(-2px)';
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

                        <a
                            href="https://github.com/LomkaKa1ff/Midipad.git" // Не забудь вставить свою ссылку!
                            target="_blank"
                            rel="noopener noreferrer"
                            title="View Source on GitHub"
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '40px',
                                height: '40px',
                                borderRadius: '8px',
                                background: 'rgba(255, 255, 255, 0.05)',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                color: '#a0a0a0',
                                transition: 'all 0.2s ease',
                                cursor: 'pointer'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                                e.currentTarget.style.borderColor = '#ffffff';
                                e.currentTarget.style.color = '#ffffff';
                                e.currentTarget.style.transform = 'translateY(-2px)';
                                e.currentTarget.style.boxShadow = '0 4px 12px rgba(255, 255, 255, 0.2)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                                e.currentTarget.style.color = '#a0a0a0';
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = 'none';
                            }}
                        >
                            <svg
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                style={{ display: 'block' }}
                            >
                                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                            </svg>
                        </a>
                    </div>
                </div>
            </div>

            <div className="footer-bottom">
                &copy; {new Date().getFullYear()} {t('all_rights_reserved')}
            </div>
        </footer>
    );
}