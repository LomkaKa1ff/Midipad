import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';

export default function MainLayout() {
    return (
        <div className="app-container">
            <Header />
            <div className="main-wrapper">
                <Sidebar />
                <main className="content">
                    {/* В этот Outlet React Router будет вставлять текущую страницу (Main, About и т.д.) */}
                    <Outlet />
                </main>
            </div>
            <Footer />
        </div>
    );
}