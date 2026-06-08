import React from 'react';
import { TrendingUp, Star, Clock } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function Sidebar() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const activeTab = searchParams.get('sort') || 'trending';

    return (
        <aside className="sidebar">
            <nav className="nav-menu">
                <div
                    className={`nav-item ${activeTab === 'trending' ? 'active' : ''}`}
                    onClick={() => navigate('/?sort=trending')}
                >
                    <TrendingUp size={20} /> {t('trending')}
                </div>

                <div
                    className={`nav-item ${activeTab === 'popular' ? 'active' : ''}`}
                    onClick={() => navigate('/?sort=popular')}
                >
                    <Star size={20} /> {t('popular')}
                </div>

                <div
                    className={`nav-item ${activeTab === 'newest' ? 'active' : ''}`}
                    onClick={() => navigate('/?sort=newest')}
                >
                    <Clock size={20} /> {t('newest')}
                </div>
            </nav>
        </aside>
    );
}