import React, { useState, useEffect } from 'react';
import { TrendingUp, Star, Clock, Music } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function Sidebar() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();

    const activeTab = location.pathname.replace('/', '') || 'trending';
    const [trackCount, setTrackCount] = useState(null);

    useEffect(() => {
        fetch('/api/midi/stats/count')
            .then(res => res.json())
            .then(data => {
                if (data.count !== undefined) setTrackCount(data.count);
            })
            .catch(err => console.error('Error fetching count:', err));
    }, []);

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

            {trackCount !== null && (
                <div style={{
                    marginTop: 'auto',
                    padding: '1.5rem 1.5rem',
                    color: 'var(--text-muted)',
                    fontSize: '0.85rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    borderTop: '1px solid rgba(255,255,255,0.05)'
                }}>
                    <div style={{
                        background: 'rgba(0, 255, 204, 0.1)',
                        padding: '8px',
                        borderRadius: '8px',
                        display: 'flex'
                    }}>
                        <Music size={18} style={{ color: '#00ffcc' }} />
                    </div>
                    <span style={{ lineHeight: '1.4' }}>
                        <strong style={{ color: '#fff', fontSize: '1rem' }}>{trackCount.toLocaleString()}</strong><br/>
                        MIDI's uploaded
                    </span>
                </div>
            )}
        </aside>
    );
}