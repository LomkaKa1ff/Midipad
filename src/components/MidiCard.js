import React, { useState, useEffect } from 'react';
import { Download, Play, Pause, Heart, Headphones, MessageSquare } from 'lucide-react'; // ДОБАВИЛИ MessageSquare
import { usePlayer } from '../context/PlayerContext';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function MidiCard({ data }) {
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
        isCurrentTrack ? playTrack(null) : playTrack(data);
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

    return (
        <div className="midi-card">
            <div className="piano-roll">
                <div className="note" style={{ width: '40%', marginLeft: '10%' }}></div>
                <div className="note glow" style={{ width: '60%', marginLeft: '20%' }}></div>
                <div className="play-overlay">
                    <button className="play-btn" onClick={handleTogglePlay}>
                        {isCurrentTrack ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
                    </button>
                </div>
            </div>

            <h3 className="card-title" title={data.title}>
                <Link to={`/track/${data._id || data.id}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                    {data.title}
                </Link>
            </h3>

            <p className="card-author" style={{ display: 'flex', alignItems: 'center', color: 'var(--text-muted)' }}>
                by <span style={{ color: 'white', fontWeight: '500', marginLeft: '5px' }}>{data.uploader?.username}</span>
                <span className="stats-divider" style={{width: '1px', height: '14px', background: 'rgba(255,255,255,0.2)', margin: '0 10px'}}></span>
                <span>{new Date(data.createdAt).toLocaleDateString()}</span>
            </p>

            <div className="card-stats" style={{ display: 'flex', gap: '1rem', margin: '0.8rem 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                <button
                    className="heart-btn"
                    onClick={handleLike}
                    style={{ background: 'none', border: 'none', color: displayIsLiked ? '#ff5555' : 'inherit', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', padding: 0 }}
                >
                    <Heart size={14} fill={displayIsLiked ? "currentColor" : "none"} /> {displayLikes}
                </button>

                {/* НОВЫЙ СЧЕТЧИК КОММЕНТАРИЕВ */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <MessageSquare size={14} /> {data.comments?.length || 0}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <Headphones size={14} /> {data.listens || 0}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <Download size={14} /> {displayDownloads}
                </div>
            </div>

            <button onClick={handleDownload} className="btn-download" style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Download size={18} /> Download .MID
            </button>
        </div>
    );
}