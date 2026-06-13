import React from 'react';
import { TrendingUp, Star, Clock } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function Sidebar() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();

    const activeTab = location.pathname.replace('/', '') || 'trending';

    return (
        <aside className="sidebar">
            <nav className="nav-menu">
                <div
                    className={`nav-item ${activeTab === 'trending' ? 'active' : ''}`}
                    onClick={() => navigate('/trending')}
                >
                    <TrendingUp size={20} /> {t('trending')}
                </div>

                <div
                    className={`nav-item ${activeTab === 'popular' ? 'active' : ''}`}
                    onClick={() => navigate('/popular')}
                >
                    <Star size={20} /> {t('popular')}
                </div>

                <div
                    className={`nav-item ${activeTab === 'newest' ? 'active' : ''}`}
                    onClick={() => navigate('/newest')}
                >
                    <Clock size={20} /> {t('newest')}
                </div>
            </nav>
        </aside>
    );
}