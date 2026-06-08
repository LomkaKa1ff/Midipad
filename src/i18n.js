import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
    en: {
        translation: {
            "main_title_1": "Upload, download, and listen to",
            "main_title_2": "MIDI music without limits.",
            "main_subtitle": "A shared database of melodies for your favorite games.",
            "loading_tracks": "Loading tracks...",
            "no_tracks_search": "No tracks found for \"{{query}}\" in {{tab}}.",
            "no_trending": "No trending tracks in the last 14 days. Be the first to hype something up!",
            "no_tracks": "No tracks found.",
            "btn_back": "Back",
            "btn_next": "Next",

            "app_name": "MidiPad",
            "upload_midi": "Upload MIDI",
            "create_account": "Create Account",
            "email": "Email",
            "username": "Username",
            "password": "Password",
            "confirm_password": "Confirm Password",
            "sign_up": "Sign Up",
            "already_have_account": "Already have an account?",

            "nav_about": "About Us",
            "nav_rules": "Rules & DMCA",
            "nav_contacts": "Contacts",
            "search_placeholder": "Search MIDI...",
            "log_in": "Log In",
            "log_out": "Log out"
        }
    },
    ru: {
        translation: {
            "main_title_1": "Загружай, скачивай и слушай",
            "main_title_2": "MIDI музыку без ограничений.",
            "main_subtitle": "Общая база мелодий для твоих любимых игр.",
            "loading_tracks": "Загрузка треков...",
            "no_tracks_search": "По запросу \"{{query}}\" в {{tab}} ничего не найдено.",
            "no_trending": "За последние 14 дней нет трендов. Стань первым, кто задаст хайп!",
            "no_tracks": "Треки не найдены.",
            "btn_back": "Назад",
            "btn_next": "Вперед",

            "app_name": "MidiPad",
            "upload_midi": "Загрузить MIDI",
            "create_account": "Создать аккаунт",
            "email": "Эл. почта",
            "username": "Имя пользователя",
            "password": "Пароль",
            "confirm_password": "Подтвердите пароль",
            "sign_up": "Зарегистрироваться",
            "already_have_account": "Уже есть аккаунт?",

            "nav_about": "О нас",
            "nav_rules": "Правила и DMCA",
            "nav_contacts": "Контакты",
            "search_placeholder": "Поиск MIDI...",
            "log_in": "Войти",
            "log_out": "Выйти"
        }
    }
};

i18n
    .use(LanguageDetector) // Автоматически определяет язык браузера
    .use(initReactI18next) // Передает инстанс i18n в react-i18next
    .init({
        resources,
        fallbackLng: 'en', // Язык по умолчанию, если язык юзера не найден
        interpolation: {
            escapeValue: false // React уже защищает от XSS
        }
    });

export default i18n;