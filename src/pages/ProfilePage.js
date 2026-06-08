import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import MidiCard from '../components/MidiCard';
import FaultyTerminal from '../components/backgrounds/FaultyTerminal';
import { User, UploadCloud, Heart, AlertTriangle } from 'lucide-react'; // Добавили AlertTriangle
import { toast } from 'react-toastify';

export default function ProfilePage() {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;

    // Стейты для вкладок и данных
    const [activeTab, setActiveTab] = useState('uploads');
    const [tracks, setTracks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // --- СТЕЙТЫ ДЛЯ КАСТОМНОГО АЛЕРТА (МОДАЛКИ) ---
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [trackToDelete, setTrackToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    // Пагинация для профиля (по 16 треков)
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
        setCurrentPage(1);
    }, [activeTab, token]);

    // Скролл наверх при пагинации
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [currentPage]);


    // --- ЛОГИКА КАСТОМНОГО АЛЕРТА УДАЛЕНИЯ ---

    // 1. Открытие модалки при клике на корзину в карточке
    const openDeleteModal = (track) => {
        setTrackToDelete(track);
        setIsModalOpen(true);
    };

    // 2. Закрытие модалки
    const closeDeleteModal = () => {
        setIsModalOpen(false);
        setTrackToDelete(null);
    };

    // 3. Подтверждение удаления (Запрос на бэкенд + мгновенный фикс UI)
    const handleConfirmDelete = async () => {
        if (!trackToDelete || !token) return;

        setIsDeleting(true);
        try {
            const trackId = trackToDelete._id || trackToDelete.id;
            const res = await fetch(`http://localhost:5000/api/midi/${trackId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (res.ok) {
                // МГНОВЕННОЕ УДАЛЕНИЕ ИЗ ФРОНТЕНД СТЕЙТА
                setTracks(prevTracks => {
                    const updated = prevTracks.filter(t => String(t._id || t.id) !== String(trackId));

                    // Если удалили последний трек на текущей странице, откидываем назад
                    const newTotalPages = Math.ceil(updated.length / tracksPerPage);
                    if (currentPage > newTotalPages && newTotalPages > 0) {
                        setCurrentPage(newTotalPages);
                    }
                    return updated;
                });

                toast.success("Track deleted successfully!"); // Зеленый тоаст успеха
                closeDeleteModal();
            } else {
                const errData = await res.json();
                toast.error(errData.message || "Failed to delete track");
            }
        } catch (err) {
            console.error("Error deleting track:", err);
            toast.error("Server error");
        } finally {
            setIsDeleting(false);
        }
    };


    // --- ОПТИМИЗАЦИЯ ФОНА ---
    const memoizedBackground = useMemo(() => (
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
    ), []);

    if (!user) return null;

    // Вычисления пагинации
    const indexOfLastTrack = currentPage * tracksPerPage;
    const indexOfFirstTrack = indexOfLastTrack - tracksPerPage;
    const currentTracks = tracks.slice(indexOfFirstTrack, indexOfLastTrack);
    const totalPages = Math.ceil(tracks.length / tracksPerPage);

    return (
        <>
            {memoizedBackground}

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

            {/* Вкладки профиля */}
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
                            <MidiCard
                                key={midi._id || midi.id}
                                data={midi}
                                onDeleteClick={openDeleteModal} // ТЕПЕРЬ ПЕРЕДАЕМ ОТКРЫТИЕ МОДАЛКИ СЮДА
                            />
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

            {/* --- НАШ СОБСТВЕННЫЙ КАСTОМНЫЙ АЛЕРТ (CONFIRMATION MODAL) --- */}
            {isModalOpen && (
                <div style={{
                    position: 'fixed',
                    top: 0, left: 0, width: '100vw', height: '100vh',
                    background: 'rgba(0, 0, 0, 0.85)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    zIndex: 9999,
                    backdropFilter: 'blur(4px)'
                }}>
                    <div style={{
                        background: '#141414',
                        border: '1px solid rgba(255, 85, 85, 0.2)', // Тонкая красная неоновая рамка
                        padding: '2rem',
                        borderRadius: '12px',
                        maxWidth: '400px',
                        width: '90%',
                        textAlign: 'center',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
                    }}>
                        <div style={{ color: '#ff5555', marginBottom: '1rem', display: 'flex', justifyContent: 'center' }}>
                            <AlertTriangle size={40} />
                        </div>
                        <h2 style={{ color: '#fff', fontSize: '1.5rem', marginBottom: '0.5rem', fontFamily: 'monospace' }}>
                            Delete Track?
                        </h2>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '2rem', lineHeight: '1.4' }}>
                            Are you sure you want to delete <span style={{ color: '#fff', fontWeight: 'bold' }}>"{trackToDelete?.title}"</span>? This action cannot be undone.
                        </p>

                        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                            <button
                                onClick={closeDeleteModal}
                                disabled={isDeleting}
                                style={{
                                    padding: '0.6rem 1.5rem', background: 'transparent',
                                    border: '1px solid rgba(255,255,255,0.1)', color: '#fff',
                                    borderRadius: '6px', cursor: 'pointer', transition: 'all 0.2s'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirmDelete}
                                disabled={isDeleting}
                                style={{
                                    padding: '0.6rem 1.5rem', background: '#ff5555',
                                    border: 'none', color: '#fff', fontWeight: '600',
                                    borderRadius: '6px', cursor: 'pointer', transition: 'all 0.2s'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.background = '#ff3333'}
                                onMouseLeave={(e) => e.currentTarget.style.background = '#ff5555'}
                            >
                                {isDeleting ? "Deleting..." : "Delete"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}