import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MidiCard from '../components/MidiCard';
import FaultyTerminal from '../components/backgrounds/FaultyTerminal';
import { User, UploadCloud, Heart } from 'lucide-react';

export default function ProfilePage() {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;

    // Стейты для вкладок и данных
    const [activeTab, setActiveTab] = useState('uploads'); // 'uploads' или 'liked'
    const [tracks, setTracks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Пагинация для профиля (тоже по 16 треков)
    const [currentPage, setCurrentPage] = useState(1);
    const tracksPerPage = 16;

    // Редирект на логин, если юзер не авторизован
    useEffect(() => {
        if (!token || !user) {
            navigate('/login');
        }
    }, [token, user, navigate]);

    // Загрузка треков в зависимости от активной вкладки
    useEffect(() => {
        if (!token) return;

        const fetchProfileData = async () => {
            setIsLoading(true);
            try {
                const endpoint = activeTab === 'uploads' ? 'uploads' : 'liked';
                const response = await fetch(`http://localhost:5000/api/midi/profile/${endpoint}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const data = await response.json();

                if (response.ok) {
                    setTracks(data);
                }
            } catch (error) {
                console.error("Error fetching profile tracks:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfileData();
        setCurrentPage(1); // Сбрасываем страницу при смене вкладки
    }, [activeTab, token]);

    // Скролл наверх при пагинации
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [currentPage]);

    if (!user) return null;

    // Вычисления пагинации
    const indexOfLastTrack = currentPage * tracksPerPage;
    const indexOfFirstTrack = indexOfLastTrack - tracksPerPage;
    const currentTracks = tracks.slice(indexOfFirstTrack, indexOfLastTrack);
    const totalPages = Math.ceil(tracks.length / tracksPerPage);

    return (
        <>
            <div className="background-layer">
                <FaultyTerminal
                    scale={3}
                    gridMul={[2, 1]}
                    digitSize={1.2}
                    timeScale={0.1}
                    pause={false}
                    scanlineIntensity={0.5}
                    glitchAmount={1}
                    flickerAmount={1}
                    noiseAmp={1}
                    chromaticAberration={0}
                    dither={0}
                    curvature={0.1}
                    tint="#ffffff"
                    mouseReact={false}
                    mouseStrength={0.5}
                    pageLoadAnimation={true}
                    brightness={0.1}
                />
            </div>

            {/* Шапка профиля */}
            <div className="profile-header text-center mb-large" style={{ marginTop: '2rem' }}>
                <div className="profile-avatar" style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.05)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1rem',
                    border: '1px solid rgba(255,255,255,0.1)'
                }}>
                    <User size={40} color="white" />
                </div>
                <h1 className="title-main" style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>
                    {user.username}
                </h1>
                <p className="text-muted">Member since {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'recently'}</p>
            </div>

            {/* Вкладки Сайдбара перенесены в мини-меню профиля */}
            <div className="profile-tabs" style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '3rem' }}>
                <div
                    className={`nav-item ${activeTab === 'uploads' ? 'active' : ''}`}
                    onClick={() => setActiveTab('uploads')}
                    style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem' }}
                >
                    <UploadCloud size={18} /> My Uploads ({activeTab === 'uploads' ? tracks.length : '...'})
                </div>
                <div
                    className={`nav-item ${activeTab === 'liked' ? 'active' : ''}`}
                    onClick={() => setActiveTab('liked')}
                    style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem' }}
                >
                    <Heart size={18} /> Liked Tracks ({activeTab === 'liked' ? tracks.length : '...'})
                </div>
            </div>

            {/* Вывод списка треков */}
            {isLoading ? (
                <div style={{ textAlign: 'center', color: 'white', padding: '3rem 0' }}>
                    Loading profile data...
                </div>
            ) : tracks.length === 0 ? (
                <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '3rem 0' }}>
                    {activeTab === 'uploads'
                        ? "You haven't uploaded any MIDI files yet."
                        : "You haven't liked any tracks yet."}
                </div>
            ) : (
                <>
                    <div className="midi-grid">
                        {currentTracks.map(midi => (
                            <MidiCard key={midi._id || midi.id} data={midi} />
                        ))}
                    </div>

                    {/* Пагинация */}
                    {totalPages > 1 && (
                        <div className="pagination-container" style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '3rem', paddingBottom: '2rem' }}>
                            <button
                                className="page-btn"
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                style={{ padding: '0.5rem 1rem', cursor: currentPage === 1 ? 'not-allowed' : 'pointer', opacity: currentPage === 1 ? 0.5 : 1 }}
                            >
                                &laquo; Back
                            </button>

                            {[...Array(totalPages)].map((_, index) => {
                                const pageNumber = index + 1;
                                return (
                                    <button
                                        key={pageNumber}
                                        onClick={() => setCurrentPage(pageNumber)}
                                        className={`page-btn ${currentPage === pageNumber ? 'active' : ''}`}
                                        style={{
                                            padding: '0.5rem 1rem',
                                            cursor: 'pointer',
                                            backgroundColor: currentPage === pageNumber ? 'rgba(255,255,255,0.2)' : 'transparent',
                                            color: '#fff',
                                            border: '1px solid rgba(255,255,255,0.2)',
                                            borderRadius: '4px'
                                        }}
                                    >
                                        {pageNumber}
                                    </button>
                                );
                            })}

                            <button
                                className="page-btn"
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                style={{ padding: '0.5rem 1rem', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', opacity: currentPage === totalPages ? 0.5 : 1 }}
                            >
                                Next &raquo;
                            </button>
                        </div>
                    )}
                </>
            )}
        </>
    );
}