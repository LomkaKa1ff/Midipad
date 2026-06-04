import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
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

function App() {
  return (
      <BrowserRouter>
        <div className="app-container">
          <Header />

          <div className="main-wrapper">
            <Sidebar />

            <main className="content">
              <Routes>
                <Route path="/" element={<MainPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/dmca" element={<DMCAPage />} />
                <Route path="/contacts" element={<ContactsPage />} />
                <Route path="/privacy" element={<PrivacyPage />} />
                <Route path="/terms" element={<TermsPage />} />
              </Routes>
            </main>
          </div>

          <Footer />
        </div>
      </BrowserRouter>
  );
}

export default App;