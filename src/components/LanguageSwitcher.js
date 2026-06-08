import React from 'react';
import { useTranslation } from 'react-i18next';

export default function LanguageSwitcher() {
    const { i18n } = useTranslation();

    const toggleLanguage = () => {
        const nextLang = i18n.language.startsWith('ru') ? 'en' : 'ru';
        i18n.changeLanguage(nextLang);
    };

    return (
        <button
            onClick={toggleLanguage}
            style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: 'var(--text-muted)',
                padding: '0.4rem 0.8rem',
                borderRadius: '6px',
                cursor: 'pointer',
                fontFamily: 'monospace',
                fontWeight: 'bold',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '5px'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
        >
            {/* Показываем текст языка в зависимости от текущего */}
            {i18n.language.startsWith('ru') ? '🇷🇺 RU' : '🇺🇸 EN'}
        </button>
    );
}