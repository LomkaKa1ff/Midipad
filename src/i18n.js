import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
    en: {
        translation: {
            "app_name": "MidiPad",
            "upload_midi": "Upload MIDI",
            "upload_midi_title": "Upload MIDI",
            "create_account": "Create Account",
            "email": "Email",
            "username": "Username",
            "password": "Password",
            "confirm_password": "Confirm Password",
            "sign_up": "Sign Up",
            "already_have_account": "Already have an account?",

            // MainPage & Header
            "main_title_1": "Upload, download, and listen to",
            "main_title_2": "MIDI music without limits.",
            "main_subtitle": "A shared database of melodies for your favorite games.",
            "loading_tracks": "Loading tracks...",
            "no_tracks_search": "No tracks found for \"{{query}}\" in {{tab}}.",
            "no_trending": "No trending tracks in the last 14 days. Be the first to hype something up!",
            "no_tracks": "No tracks found.",
            "btn_back": "Back",
            "btn_next": "Next",
            "nav_about": "About Us",
            "nav_rules": "Rules & DMCA",
            "nav_contacts": "Contacts",
            "search_placeholder": "Search MIDI...",
            "log_in": "Log In",
            "log_out": "Log out",

            // Sidebar
            "trending": "Trending",
            "popular": "Popular",
            "newest": "Newest",

            // Footer
            "footer_desc_1": "MidiPad - service for searching and downloading MIDI files for digital instruments and games.",
            "footer_desc_2": "Find melodies, covers, and effects from games, memes, and more.",
            "footer_nav": "Navigation",
            "footer_home": "Home",
            "footer_links": "Links",
            "footer_donate": "Donate",
            "terms_of_use": "Terms of Use",
            "privacy_policy": "Privacy Policy",
            "all_rights_reserved": "MidiPad. All rights reserved.",

            // Auth (Login & Register)
            "back_to_midipad": "Back to MidiPad",
            "welcome_back": "Welcome Back",
            "logging_in": "Logging in...",
            "or": "OR",
            "continue_discord": "Continue with Discord",
            "dont_have_account": "Don't have an account?",
            "forgot_password": "Forgot password?",
            "privacy_notice": "We collect and process your data strictly to provide the service. We do not sell your personal information to third parties.",
            "creating_account": "Creating...",
            "create_account_btn": "Create Account",

            // Profile Page
            "member_since": "Member since",
            "recently": "recently",
            "my_uploads": "My Uploads",
            "liked_tracks": "Liked Tracks",
            "loading_profile": "Loading profile data...",
            "no_uploads_yet": "You haven't uploaded any MIDI files yet.",
            "no_likes_yet": "You haven't liked any tracks yet.",
            "delete_track_title": "Delete Track?",
            "delete_track_confirm": "Are you sure you want to delete",
            "action_cannot_be_undone": "This action cannot be undone.",
            "btn_cancel": "Cancel",
            "btn_delete": "Delete",
            "btn_deleting": "Deleting...",

            // Tag Page
            "tracks_found_count": "Tracks found: {{count}}",
            "searching_for_tag": "Searching for #{{tag}}...",
            "no_tracks_tag": "No tracks found with this tag.",

            // Upload Modal
            "drag_drop": "Drag & Drop or Click to select a MIDI file",
            "max_1mb": "(Max 1 MB)",
            "track_title": "Track Title",
            "tags_label": "Tags (Press Enter to add)",
            "max_tags_reached": "Maximum tags reached",
            "add_tags_placeholder": "Add up to 5 tags. Each tag up to 15 chars.",
            "supports_only": "Supports only MIDI files",
            "supported_formats": "Supported formats: .mid, .midi",
            "max_file_size": "Max file size: 1MB",
            "i_agree": "I agree to the",
            "and": "and",
            "upload_confirm": "By uploading, you confirm that your content does not violate copyright and meets our community guidelines.",
            "uploading": "Uploading...",
            "publish_track": "Publish Track",

            // Upload Errors
            "err_only_midi": "Only .mid or .midi files are allowed!",
            "err_too_large": "File is too large! Maximum size is 1 MB.",
            "err_tag_length": "Tag must be 15 characters or less.",
            "err_max_tags": "Maximum 5 tags allowed.",
            "err_tag_exists": "Tag already exists.",
            "err_select_file": "Please select a MIDI file.",
            "err_enter_title": "Please enter a title.",
            "err_agree_terms": "You must agree to the terms and conditions.",
            "err_title_length": "Title must be 50 characters or less."
        }
    },
    ru: {
        translation: {
            "app_name": "MidiPad",
            "upload_midi": "Загрузить MIDI",
            "upload_midi_title": "Загрузить MIDI",
            "create_account": "Создать аккаунт",
            "email": "Эл. почта",
            "username": "Имя пользователя",
            "password": "Пароль",
            "confirm_password": "Подтвердите пароль",
            "sign_up": "Зарегистрироваться",
            "already_have_account": "Уже есть аккаунт?",

            // MainPage & Header
            "main_title_1": "Загружай, скачивай и слушай",
            "main_title_2": "MIDI музыку без ограничений.",
            "main_subtitle": "Общая база мелодий для твоих любимых игр.",
            "loading_tracks": "Загрузка треков...",
            "no_tracks_search": "По запросу \"{{query}}\" в {{tab}} ничего не найдено.",
            "no_trending": "За последние 14 дней нет трендов. Стань первым, кто задаст хайп!",
            "no_tracks": "Треки не найдены.",
            "btn_back": "Назад",
            "btn_next": "Вперед",
            "nav_about": "О нас",
            "nav_rules": "Правила и DMCA",
            "nav_contacts": "Контакты",
            "search_placeholder": "Поиск MIDI...",
            "log_in": "Войти",
            "log_out": "Выйти",

            // Sidebar
            "trending": "В тренде",
            "popular": "Популярное",
            "newest": "Новинки",

            // Footer
            "footer_desc_1": "MidiPad - сервис для поиска и скачивания MIDI файлов для цифровых инструментов и игр.",
            "footer_desc_2": "Находи мелодии, каверы и звуки из игр, мемов и не только.",
            "footer_nav": "Навигация",
            "footer_home": "Главная",
            "footer_links": "Ссылки",
            "footer_donate": "Поддержать проект",
            "terms_of_use": "Условия использования",
            "privacy_policy": "Политика конфиденциальности",
            "all_rights_reserved": "MidiPad. Все права защищены.",

            // Auth (Login & Register)
            "back_to_midipad": "Вернуться в MidiPad",
            "welcome_back": "С возвращением",
            "logging_in": "Вход...",
            "or": "ИЛИ",
            "continue_discord": "Войти через Discord",
            "dont_have_account": "Нет аккаунта?",
            "forgot_password": "Забыли пароль?",
            "privacy_notice": "Мы собираем и обрабатываем ваши данные исключительно для предоставления сервиса. Мы не передаем вашу личную информацию третьим лицам.",
            "creating_account": "Создание...",
            "create_account_btn": "Создать аккаунт",

            // Profile Page
            "member_since": "С нами с",
            "recently": "недавнего времени",
            "my_uploads": "Мои загрузки",
            "liked_tracks": "Понравившиеся",
            "loading_profile": "Загрузка профиля...",
            "no_uploads_yet": "Вы еще не загрузили ни одного MIDI файла.",
            "no_likes_yet": "Вы еще не оценили ни одного трека.",
            "delete_track_title": "Удалить трек?",
            "delete_track_confirm": "Вы уверены, что хотите удалить",
            "action_cannot_be_undone": "Это действие нельзя отменить.",
            "btn_cancel": "Отмена",
            "btn_delete": "Удалить",
            "btn_deleting": "Удаление...",

            // Tag Page
            "tracks_found_count": "Треков найдено: {{count}}",
            "searching_for_tag": "Поиск по #{{tag}}...",
            "no_tracks_tag": "По этому тегу ничего не найдено.",

            // Upload Modal
            "drag_drop": "Перетащите или нажмите, чтобы выбрать MIDI",
            "max_1mb": "(Макс 1 МБ)",
            "track_title": "Название трека",
            "tags_label": "Теги (нажмите Enter для добавления)",
            "max_tags_reached": "Достигнут лимит тегов",
            "add_tags_placeholder": "До 5 тегов. Макс 15 символов.",
            "supports_only": "Поддерживаются только MIDI файлы",
            "supported_formats": "Доступные форматы: .mid, .midi",
            "max_file_size": "Макс. размер файла: 1 МБ",
            "i_agree": "Я согласен с",
            "and": "и",
            "upload_confirm": "Загружая файл, вы подтверждаете, что контент не нарушает авторские права и соответствует правилам.",
            "uploading": "Загрузка...",
            "publish_track": "Опубликовать трек",

            // Upload Errors
            "err_only_midi": "Разрешены только файлы .mid или .midi!",
            "err_too_large": "Файл слишком большой! Максимум 1 МБ.",
            "err_tag_length": "Длина тега не более 15 символов.",
            "err_max_tags": "Разрешено максимум 5 тегов.",
            "err_tag_exists": "Такой тег уже есть.",
            "err_select_file": "Пожалуйста, выберите MIDI файл.",
            "err_enter_title": "Пожалуйста, введите название.",
            "err_agree_terms": "Вы должны согласиться с условиями использования.",
            "err_title_length": "Название не должно превышать 50 символов."
        }
    }
};

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources,
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false
        }
    });

export default i18n;