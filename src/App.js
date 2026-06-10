import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './i18n';

// Import files
import ProfilePage from './pages/ProfilePage';
import TrackPage from './pages/TrackPage';
import TagPage from './pages/TagPage';
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
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

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