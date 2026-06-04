import React from 'react';
import { TrendingUp, Star, Clock } from 'lucide-react';

export default function Sidebar() {
    return (
        <aside className="sidebar">
            <nav className="nav-menu">
                <div className="nav-item active">
                    <TrendingUp size={20} /> Trending
                </div>
                <div className="nav-item">
                    <Star size={20} /> Popular
                </div>
                <div className="nav-item">
                    <Clock size={20} /> Newest
                </div>
            </nav>
        </aside>
    );
}