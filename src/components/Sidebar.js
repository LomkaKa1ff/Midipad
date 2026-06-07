import React from 'react';
import { TrendingUp, Star, Clock } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function Sidebar() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    // ФИКС: Теперь если в URL ничего нет, по умолчанию берется 'trending'
    const activeTab = searchParams.get('sort') || 'trending';

    return (
        <aside className="sidebar">
            <nav className="nav-menu">
                <div
                    className={`nav-item ${activeTab === 'trending' ? 'active' : ''}`}
                    onClick={() => navigate('/?sort=trending')}
                >
                    <TrendingUp size={20} /> Trending
                </div>

                <div
                    className={`nav-item ${activeTab === 'popular' ? 'active' : ''}`}
                    onClick={() => navigate('/?sort=popular')}
                >
                    <Star size={20} /> Popular
                </div>

                <div
                    className={`nav-item ${activeTab === 'newest' ? 'active' : ''}`}
                    onClick={() => navigate('/?sort=newest')}
                >
                    <Clock size={20} /> Newest
                </div>
            </nav>
        </aside>
    );
}