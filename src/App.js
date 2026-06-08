import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify'; // ИМПОРТ ТОАСТОВ
import 'react-toastify/dist/ReactToastify.css'; // ИМПОРТ БАЗОВЫХ СТИЛЕЙ ТОАСТОВ
import ProfilePage from './pages/ProfilePage';
import TrackPage from './pages/TrackPage';
import TagPage from './pages/TagPage';
import './i18n';

import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';

// Импорт страниц
import MainPage from './pages/MainPage';
import AboutPage from './pages/AboutPage';
import DMCAPage from './pages/DMCAPage';
import ContactsPage from './pages/ContactsPage';
import PrivacyPage from './pages/PrivacyPage';
import TermsPage from './pages/TermsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import MainLayout from './components/MainLayout';

function App() {
    return (
        <BrowserRouter>
            {/* КОНТЕЙНЕР ДЛЯ УВЕДОМЛЕНИЙ */}
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
                toastClassName="custom-toast"
            />

            <Routes>
                {/* --- ГРУППА 1: ЧИСТЫЕ СТРАНИЦЫ (Без шапки и футера) --- */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                {/* --- ГРУППА 2: СТАНДАРТНЫЕ СТРАНИЦЫ (Обернуты в MainLayout) --- */}
                <Route element={<MainLayout />}>
                    <Route path="/" element={<MainPage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/dmca" element={<DMCAPage />} />
                    <Route path="/contacts" element={<ContactsPage />} />
                    <Route path="/privacy" element={<PrivacyPage />} />
                    <Route path="/terms" element={<TermsPage />} />
                    <Route path="/track/:id" element={<TrackPage />} />
                    <Route path="/tag/:tag" element={<TagPage />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;