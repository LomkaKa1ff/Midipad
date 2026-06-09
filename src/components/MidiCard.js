import React, { useState, useEffect } from 'react';
import { Download, Play, Pause, Heart, Headphones, MessageSquare, Trash2 } from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function MidiCard({ data, onDeleteClick, playlist }) {
    const { playTrack, currentTrack, updateCurrentTrack } = usePlayer();

    const token = localStorage.getItem('token');
    const getUserId = () => {
        try {
            if (!token) return null;
            const payload = JSON.parse(atob(token.split('.')[1]));
            return payload.id || payload.userId;
        } catch(e) { return null; }
    };
    const userId = getUserId();

    const isCurrentTrack = currentTrack && String(currentTrack._id || currentTrack.id) === String(data._id || data.id);

    const [localLikes, setLocalLikes] = useState(data.likes || 0);
    const [localIsLiked, setLocalIsLiked] = useState(() => {
        if (!userId || !data.likedBy) return false;
        return data.likedBy.some(id => String(id) === String(userId));
    });
    const [localDownloads, setLocalDownloads] = useState(data.downloads || 0);

    useEffect(() => {
        setLocalLikes(data.likes || 0);
        setLocalDownloads(data.downloads || 0);
        if (userId && data.likedBy) {
            setLocalIsLiked(data.likedBy.some(id => String(id) === String(userId)));
        }
    }, [data, userId]);

    const displayLikes = isCurrentTrack ? (currentTrack.likes || 0) : localLikes;
    const displayDownloads = isCurrentTrack ? (currentTrack.downloads || 0) : localDownloads;
    const displayIsLiked = isCurrentTrack ? (
        userId && currentTrack.likedBy ? currentTrack.likedBy.some(id => String(id) === String(userId)) : false
    ) : localIsLiked;

    const handleTogglePlay = (e) => {
        e.stopPropagation();
        isCurrentTrack ? playTrack(null) : playTrack(data, playlist || []);
    };

    const handleLike = async (e) => {
        e.stopPropagation();
        if (!token) {
            toast.error("You must be logged in to like sounds.");
            return;
        }

        try {
            const res = await fetch(`http://localhost:5000/api/midi/like/${data._id}`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (res.ok) {
                const result = await res.json();
                setLocalLikes(result.likes);
                setLocalIsLiked(result.isLiked);

                let updatedLikedBy = [...(data.likedBy || [])];
                if (result.isLiked) {
                    if (!updatedLikedBy.includes(userId)) updatedLikedBy.push(userId);
                } else {
                    updatedLikedBy = updatedLikedBy.filter(id => String(id) !== String(userId));
                }

                data.likes = result.likes;
                data.likedBy = updatedLikedBy;

                if (isCurrentTrack && updateCurrentTrack) {
                    updateCurrentTrack({ likes: result.likes, likedBy: updatedLikedBy });
                }
            }
        } catch (err) { console.error("Error liking track:", err); }
    };

    const handleDownload = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/midi/download-increment/${data._id}`, { method: 'POST' });
            if (response.ok) {
                const result = await response.json();
                setLocalDownloads(result.downloads);
                data.downloads = result.downloads;

                if (isCurrentTrack && updateCurrentTrack) {
                    updateCurrentTrack({ downloads: result.downloads });
                }
            }
            window.location.href = `http://localhost:5000/api/midi/download/${data._id}`;
        } catch (err) { console.error("Error downloading track:", err); }
    };

    const isAuthor = userId && data.uploader && (String(data.uploader._id || data.uploader.id || data.uploader) === String(userId));

    const handleDeleteClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (onDeleteClick) {
            onDeleteClick(data);
        }
    };

    // ФОРМИРУЕМ ССЫЛКУ НА ФАЙЛ ДЛЯ ВИЗУАЛИЗАТОРА
    const fileUrl = `http://localhost:5000/uploads/${data.filename}`;

    return (
        <div className="midi-card" style={{ position: 'relative', padding: '1.2rem', display: 'flex', flexDirection: 'column' }}>
            {isAuthor && onDeleteClick && (
                <button
                    onClick={handleDeleteClick}
                    title="Delete track"
                    style={{
                        position: 'absolute', top: '12px', right: '12px', background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: 'var(--text-muted)', cursor: 'pointer', zIndex: 10, transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = '#ff5555'; e.currentTarget.style.borderColor = '#ff5555'; e.currentTarget.style.transform = 'scale(1.1)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.transform = 'scale(1)'; }}
                >
                    <Trash2 size={16} />
                </button>
            )}

            {/* 👇 ОЖИВШИЙ ЭКРАНЧИК С НОТАМИ 👇 */}
            <div className="piano-roll" style={{
                position: 'relative',
                marginBottom: '0.8rem',
                height: '80px', // Высота экранчика
                background: '#111',
                borderRadius: '8px',
                overflow: 'hidden',
                boxShadow: 'inset 0 0 10px rgba(0,0,0,0.8)'
            }}>
                {/* НАСТОЯЩИЙ ВИЗУАЛИЗАТОР */}
                <midi-visualizer
                    id={`visualizer-${data._id || data.id}`}
                    key={fileUrl}
                    type="piano-roll"
                    src={fileUrl}
                    style={{ width: '100%', height: '100%', display: 'block' }}
                    // 👇 ДЕЛАЕМ ИХ ЖИРНЫМИ И ПЛОТНЫМИ 👇
                    note-height="5"    /* Увеличиваем толщину (по умолчанию 2) */
                    note-spacing="1"   /* Оставляем зазор, чтобы не слипались */
                ></midi-visualizer>

                {/* ОВЕРЛЕЙ С КНОПКОЙ PLAY ПОВЕРХ ЭКРАНА */}
                <div className="play-overlay">
                    <button className="play-btn" onClick={handleTogglePlay}>
                        {isCurrentTrack ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
                    </button>
                </div>
            </div>
            {/* 👆 ---------------------------- 👆 */}

            <h3 className="card-title" title={data.title} style={{ margin: '0 0 0.3rem 0', fontSize: '1.2rem', lineHeight: '1.2' }}>
                <Link to={`/track/${data._id || data.id}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                    {data.title}
                </Link>
            </h3>

            <p className="card-author" style={{ display: 'flex', alignItems: 'center', color: 'var(--text-muted)', margin: '0 0 0.6rem 0', fontSize: '0.85rem' }}>
                by <span style={{ color: 'white', fontWeight: '500', marginLeft: '5px' }}>{data.uploader?.username}</span>
                <span className="stats-divider" style={{width: '1px', height: '14px', background: 'rgba(255,255,255,0.2)', margin: '0 8px'}}></span>
                <span>{new Date(data.createdAt).toLocaleDateString()}</span>
            </p>

            {data.tags && data.tags.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '0.6rem' }}>
                    {data.tags.map((tag, index) => (
                        <Link
                            key={index}
                            to={`/tag/${tag}`}
                            style={{
                                background: 'rgba(255,255,255,0.08)', color: '#a0a0a0', padding: '0.2rem 0.6rem',
                                borderRadius: '8px', fontSize: '0.75rem', fontWeight: '500', letterSpacing: '0.2px',
                                textDecoration: 'none', transition: 'all 0.2s ease', cursor: 'pointer'
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.15)'; e.currentTarget.style.color = '#fff'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = '#a0a0a0'; }}
                        >
                            #{tag}
                        </Link>
                    ))}
                </div>
            )}

            <div style={{ width: '100%', height: '1px', background: 'rgba(255,255,255,0.1)', marginBottom: '0.6rem' }}></div>

            <div className="card-stats" style={{ display: 'flex', gap: '1rem', margin: '0 0 0.8rem 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                <button
                    className="heart-btn"
                    onClick={handleLike}
                    style={{ background: 'none', border: 'none', color: displayIsLiked ? '#ff5555' : 'inherit', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', padding: 0 }}
                >
                    <Heart size={14} fill={displayIsLiked ? "currentColor" : "none"} /> {displayLikes}
                </button>

                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <MessageSquare size={14} /> {data.comments?.length || 0}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Headphones size={14} /> {data.listens || 0}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Download size={14} /> {displayDownloads}
                </div>
            </div>

            <button onClick={handleDownload} className="btn-download" style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Download size={18} /> Download .MID
            </button>
        </div>
    );
}