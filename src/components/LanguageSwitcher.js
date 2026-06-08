import React from 'react';
import { useTranslation } from 'react-i18next';

export default function LanguageSwitcher() {
    // Теперь i18n 100% будет содержать функцию changeLanguage
    const { i18n } = useTranslation();

    // Защита от undefined при первой миллисекунде загрузки
    const currentLang = i18n.language || window.localStorage.getItem('i18nextLng') || 'en';
    const isRu = currentLang.startsWith('ru');

    const toggleLanguage = () => {
        const nextLang = isRu ? 'en' : 'ru';
        i18n.changeLanguage(nextLang);
    };

    return (
        <button
            onClick={toggleLanguage}
            title={isRu ? 'Switch to English' : 'Переключить на русский'}
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: 'var(--text-muted)',
                padding: '0.55rem 0.8rem',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '0.9rem',
                fontWeight: '600',
                transition: 'all 0.2s ease',
                fontFamily: 'inherit'
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.color = '#fff';
                e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.color = 'var(--text-muted)';
                e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
            }}
        >
            <img
                src={isRu ? "https://flagcdn.com/w20/ru.png" : "https://flagcdn.com/w20/us.png"}
                alt={isRu ? "RU Flag" : "US Flag"}
                style={{ width: '18px', borderRadius: '2px', objectFit: 'cover' }}
            />
            {isRu ? 'RU' : 'EN'}
        </button>
    );
}