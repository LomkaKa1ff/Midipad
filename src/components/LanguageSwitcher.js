import React from 'react';
import { useTranslation } from 'react-i18next';

export default function LanguageSwitcher() {
    const { i18n } = useTranslation();

    const toggleLanguage = () => {
        const nextLang = i18n.language.startsWith('ru') ? 'en' : 'ru';
        i18n.changeLanguage(nextLang);
    };

    const isRu = i18n.language.startsWith('ru');

    return (
        <button
            onClick={toggleLanguage}
            title={isRu ? 'Switch to English' : 'Переключить на русский'}
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px', // Отступ между флагом и текстом
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: 'var(--text-muted)',
                padding: '0.55rem 0.8rem', // Идеальные отступы для совпадения по высоте
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '0.9rem', // Чуть уменьшили текст, чтобы совпадал с кнопками
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
            {/* Настоящие картинки флагов вместо эмодзи */}
            <img
                src={isRu ? "https://flagcdn.com/w20/ru.png" : "https://flagcdn.com/w20/us.png"}
                alt={isRu ? "RU Flag" : "US Flag"}
                style={{ width: '18px', borderRadius: '2px', objectFit: 'cover' }}
            />
            {isRu ? 'RU' : 'EN'}
        </button>
    );
}