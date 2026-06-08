import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import MidiCard from '../components/MidiCard';
import FaultyTerminal from '../components/backgrounds/FaultyTerminal';
import { User, UploadCloud, Heart, AlertTriangle } from 'lucide-react';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

export default function ProfilePage() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;

    const [activeTab, setActiveTab] = useState('uploads');
    const [tracks, setTracks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [trackToDelete, setTrackToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const [currentPage, setCurrentPage] = useState(1);
    const tracksPerPage = 16;

    useEffect(() => {
        if (!token || !user) {
            navigate('/login');
        }
    }, [token, user, navigate]);

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

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [currentPage]);

    const openDeleteModal = (track) => {
        setTrackToDelete(track);
        setIsModalOpen(true);
    };

    const closeDeleteModal = () => {
        setIsModalOpen(false);
        setTrackToDelete(null);
    };

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
                setTracks(prevTracks => {
                    const updated = prevTracks.filter(t => String(t._id || t.id) !== String(trackId));
                    const newTotalPages = Math.ceil(updated.length / tracksPerPage);
                    if (currentPage > newTotalPages && newTotalPages > 0) {
                        setCurrentPage(newTotalPages);
                    }
                    return updated;
                });

                toast.success("Track deleted successfully!");
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

    const memoizedBackground = useMemo(() => (
        <div className="background-layer">
            <FaultyTerminal scale={3} brightness={0.1} />
        </div>
    ), []);

    if (!user) return null;

    const indexOfLastTrack = currentPage * tracksPerPage;
    const indexOfFirstTrack = indexOfLastTrack - tracksPerPage;
    const currentTracks = tracks.slice(indexOfFirstTrack, indexOfLastTrack);
    const totalPages = Math.ceil(tracks.length / tracksPerPage);

    return (
        <>
            {memoizedBackground}

            <div className="profile-header text-center mb-large" style={{ marginTop: '2rem' }}>
                <div className="profile-avatar" style={{
                    width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', border: '1px solid rgba(255,255,255,0.1)'
                }}>
                    <User size={40} color="white" />
                </div>
                <h1 className="title-main" style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>
                    {user.username}
                </h1>
                <p className="text-muted">{t('member_since')} {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : t('recently')}</p>
            </div>

            <div className="profile-tabs" style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '3rem' }}>
                <div
                    className={`nav-item ${activeTab === 'uploads' ? 'active' : ''}`}
                    onClick={() => setActiveTab('uploads')}
                    style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem' }}
                >
                    <UploadCloud size={18} /> {t('my_uploads')} ({activeTab === 'uploads' ? tracks.length : '...'})
                </div>
                <div
                    className={`nav-item ${activeTab === 'liked' ? 'active' : ''}`}
                    onClick={() => setActiveTab('liked')}
                    style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem' }}
                >
                    <Heart size={18} /> {t('liked_tracks')} ({activeTab === 'liked' ? tracks.length : '...'})
                </div>
            </div>

            {isLoading ? (
                <div style={{ textAlign: 'center', color: 'white', padding: '3rem 0' }}>
                    {t('loading_profile')}
                </div>
            ) : tracks.length === 0 ? (
                <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '3rem 0' }}>
                    {activeTab === 'uploads' ? t('no_uploads_yet') : t('no_likes_yet')}
                </div>
            ) : (
                <>
                    <div className="midi-grid">
                        {currentTracks.map(midi => (
                            <MidiCard key={midi._id || midi.id} data={midi} onDeleteClick={openDeleteModal} playlist={currentTracks} />
                        ))}
                    </div>

                    {totalPages > 1 && (
                        <div className="pagination-container" style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '3rem', paddingBottom: '2rem' }}>
                            <button
                                className="page-btn"
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                style={{ padding: '0.5rem 1rem', cursor: currentPage === 1 ? 'not-allowed' : 'pointer', opacity: currentPage === 1 ? 0.5 : 1 }}
                            >
                                &laquo; {t('btn_back')}
                            </button>

                            {[...Array(totalPages)].map((_, index) => {
                                const pageNumber = index + 1;
                                return (
                                    <button
                                        key={pageNumber}
                                        onClick={() => setCurrentPage(pageNumber)}
                                        className={`page-btn ${currentPage === pageNumber ? 'active' : ''}`}
                                        style={{ padding: '0.5rem 1rem', cursor: 'pointer', backgroundColor: currentPage === pageNumber ? 'rgba(255,255,255,0.2)' : 'transparent', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '4px' }}
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
                                {t('btn_next')} &raquo;
                            </button>
                        </div>
                    )}
                </>
            )}

            {isModalOpen && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0, 0, 0, 0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, backdropFilter: 'blur(4px)' }}>
                    <div style={{ background: '#141414', border: '1px solid rgba(255, 85, 85, 0.2)', padding: '2rem', borderRadius: '12px', maxWidth: '400px', width: '90%', textAlign: 'center', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
                        <div style={{ color: '#ff5555', marginBottom: '1rem', display: 'flex', justifyContent: 'center' }}>
                            <AlertTriangle size={40} />
                        </div>
                        <h2 style={{ color: '#fff', fontSize: '1.5rem', marginBottom: '0.5rem', fontFamily: 'monospace' }}>
                            {t('delete_track_title')}
                        </h2>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '2rem', lineHeight: '1.4' }}>
                            {t('delete_track_confirm')} <span style={{ color: '#fff', fontWeight: 'bold' }}>"{trackToDelete?.title}"</span>? {t('action_cannot_be_undone')}
                        </p>

                        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                            <button
                                onClick={closeDeleteModal}
                                disabled={isDeleting}
                                style={{ padding: '0.6rem 1.5rem', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '6px', cursor: 'pointer', transition: 'all 0.2s' }}
                            >
                                {t('btn_cancel')}
                            </button>
                            <button
                                onClick={handleConfirmDelete}
                                disabled={isDeleting}
                                style={{ padding: '0.6rem 1.5rem', background: '#ff5555', border: 'none', color: '#fff', fontWeight: '600', borderRadius: '6px', cursor: 'pointer', transition: 'all 0.2s' }}
                            >
                                {isDeleting ? t('btn_deleting') : t('btn_delete')}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}