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
                    <a href="/frontend/public">{t('footer_donate')}</a>
                </div>

                <div className="footer-col">
                    <h3>{t('nav_contacts')}</h3>
                    <a href="mailto:support@midipad.me">support@midipad.me</a>
                </div>
            </div>

            <div className="footer-bottom">
                &copy; {new Date().getFullYear()} {t('all_rights_reserved')}
            </div>
        </footer>
    );
}