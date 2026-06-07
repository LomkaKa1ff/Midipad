import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';
import BottomPlayer from './BottomPlayer'; // Импорт плеера
import { PlayerProvider } from '../context/PlayerContext'; // Импорт провайдера

export default function MainLayout() {
    return (
        // Оборачиваем всё в PlayerProvider
        <PlayerProvider>
            <div className="app-container">
                <Header />
                <div className="main-wrapper">
                    <Sidebar />
                    <main className="content">
                        <Outlet />
                    </main>
                </div>
                <Footer />

                {/* Плеер висит поверх всего в самом низу */}
                <BottomPlayer />
            </div>
        </PlayerProvider>
    );
}