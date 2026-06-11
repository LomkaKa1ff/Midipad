import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';
import BottomPlayer from './BottomPlayer';
import { PlayerProvider } from '../context/PlayerContext';

export default function MainLayout() {
    return (
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

                <BottomPlayer />
            </div>
        </PlayerProvider>
    );
}