import React, { useEffect, useRef, useState } from 'react';
import { usePlayer } from '../context/PlayerContext';
import { Heart, Download, Share2, Music, X, SkipBack, SkipForward, Volume2, VolumeX, Play, Pause } from 'lucide-react';
import { toast } from 'react-toastify';

const MemoizedMidiPlayer = React.memo(React.forwardRef(({ fileUrl, visualizerId }, ref) => {
    return (
        <midi-player
            ref={ref}
            src={fileUrl}
            sound-font="https://storage.googleapis.com/magentadata/js/soundfonts/sgm_plus"
            visualizer={visualizerId}
            className="hidden-midi-player"
        ></midi-player>
    );
}), (prevProps, nextProps) => {
    return prevProps.fileUrl === nextProps.fileUrl && prevProps.visualizerId === nextProps.visualizerId;
});

export default function BottomPlayer() {
    const { currentTrack, playTrack, updateCurrentTrack, playNext, playPrev, playlist = [] } = usePlayer();
    const playerRef = useRef(null);

    const token = localStorage.getItem('token');
    const getUserId = () => {
        try {
            if (!token) return null;
            const payload = JSON.parse(atob(token.split('.')[1]));
            return payload.id || payload.userId;
        } catch(e) { return null; }
    };
    const userId = getUserId();

    const [volume, setVolume] = useState(80);
    const [isMuted, setIsMuted] = useState(false);
    const [currentTime, setCurrentTime] = useState('0:00');
    const [duration, setDuration] = useState('0:00');
    const [progress, setProgress] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);

    const isLiked = userId && currentTrack?.likedBy ? currentTrack.likedBy.some(id => String(id) === String(userId)) : false;
    const trackIdForAudio = currentTrack ? (currentTrack._id || currentTrack.id) : null;

    const currentIndex = playlist.findIndex(t => String(t._id || t.id) === String(trackIdForAudio));
    const hasPrev = currentIndex > 0;
    const hasNext = currentIndex !== -1 && currentIndex < playlist.length - 1;

    const stateRef = useRef({ hasNext, playNext, volume });
    useEffect(() => {
        stateRef.current = { hasNext, playNext, volume };
    }, [hasNext, playNext, volume]);

    useEffect(() => {
        if (!trackIdForAudio || !playerRef.current) return;
        const player = playerRef.current;

        const handleLoad = () => {
            try {
                if (window.Tone && window.Tone.Destination) {
                    window.Tone.Destination.mute = false;
                    const gain = stateRef.current.volume / 100;
                    window.Tone.Destination.volume.value = gain > 0 ? 20 * Math.log10(gain) : -100;
                }
                player.start();
            } catch (err) {
                console.warn("Autoplay didn't work:", err);
            }
        };

        player.addEventListener('load', handleLoad);

        if (player.duration > 0) {
            handleLoad();
        }

        const listenTimer = setTimeout(async () => {
            try {
                await fetch(`/api/midi/listen/${trackIdForAudio}`, { method: 'POST' });
            } catch (e) {}
        }, 3000);

        const timeInterval = setInterval(() => {
            if (player) {
                setIsPlaying(!!player.playing);
                const curr = player.currentTime || 0;
                const dur = player.duration || 0;

                const formatTime = (seconds) => {
                    if (!seconds || isNaN(seconds)) return '0:00';
                    const m = Math.floor(seconds / 60);
                    const s = Math.floor(seconds % 60);
                    return `${m}:${s < 10 ? '0' : ''}${s}`;
                };

                setCurrentTime(formatTime(curr));
                setDuration(formatTime(dur));

                if (dur > 0) {
                    setProgress((curr / dur) * 100);

                    if (curr >= dur - 0.2 && stateRef.current.hasNext) {
                        stateRef.current.playNext();
                    }
                }
            }
        }, 100);

        return () => {
            clearTimeout(listenTimer);
            clearInterval(timeInterval);
            player.removeEventListener('load', handleLoad);

            try {
                player.stop();
                if (window.Tone && window.Tone.Destination) {
                    window.Tone.Destination.mute = true;
                    window.Tone.Destination.volume.value = -100;
                }
            } catch (err) {}
        };
    }, [trackIdForAudio]);

    const handleLike = async (e) => {
        e.stopPropagation();
        if (!token) {
            toast.error("You must be logged in to like sounds.");
            return;
        }

        try {
            const res = await fetch(`/api/midi/like/${trackIdForAudio}`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (res.ok) {
                const result = await res.json();
                let updatedLikedBy = [...(currentTrack.likedBy || [])];

                if (result.isLiked) {
                    if (!updatedLikedBy.includes(userId)) updatedLikedBy.push(userId);
                } else {
                    updatedLikedBy = updatedLikedBy.filter(id => String(id) !== String(userId));
                }

                if (updateCurrentTrack) {
                    updateCurrentTrack({ likes: result.likes, likedBy: updatedLikedBy });
                }
            }
        } catch (err) { console.error("Ошибка лайка:", err); }
    };

    const togglePlay = () => {
        if (!playerRef.current) return;
        playerRef.current.playing ? playerRef.current.stop() : playerRef.current.start();
    };

    const handleSeek = (e) => {
        const newProgress = parseFloat(e.target.value);
        setProgress(newProgress);
        if (playerRef.current && playerRef.current.duration) {
            playerRef.current.currentTime = (newProgress / 100) * playerRef.current.duration;
        }
    };

    const changeInternalVolume = (val) => {
        const gain = val / 100;
        try {
            if (window.Tone && window.Tone.Destination) {
                if (gain <= 0) {
                    window.Tone.Destination.volume.value = -100;
                    window.Tone.Destination.mute = true;
                } else {
                    window.Tone.Destination.mute = false;
                    window.Tone.Destination.volume.value = 20 * Math.log10(gain);
                }
            }
        } catch (err) {}
    };

    const handleVolumeChange = (e) => {
        const val = Number(e.target.value);
        setVolume(val);
        setIsMuted(val === 0);
        changeInternalVolume(val);
    };

    const toggleMute = () => {
        const newMuted = !isMuted;
        setIsMuted(newMuted);
        const targetVol = newMuted ? 0 : (volume === 0 ? 80 : volume);
        if (!newMuted && volume === 0) setVolume(80);
        changeInternalVolume(targetVol);
        setVolume(newMuted ? 0 : targetVol);
    };

    const handleShare = (e) => {
        e.stopPropagation();
        const shareUrl = `${window.location.origin}/track/${trackIdForAudio}`;
        navigator.clipboard.writeText(shareUrl)
            .then(() => toast.success("Link copied to clipboard!"))
            .catch(() => toast.error("Failed to copy link"));
    };

    if (!currentTrack) return null;

    const fileUrl = `/uploads/${encodeURIComponent(currentTrack.filename)}`;
    const downloadUrl = `/api/midi/download/${trackIdForAudio}`;

    return (
        <div className="bottom-player-wrapper">
            <div className="bp-section bp-left">
                <div className="bp-cover"><Music size={24} color="#fff" /></div>
                <div className="bp-text">
                    <h4>{currentTrack.title}</h4>
                    <p>{currentTrack.uploader?.username || 'Unknown User'}</p>
                </div>
            </div>

            <div className="bp-section bp-center">
                <div className="bp-controls-row">
                    <button
                        className="bp-icon-btn"
                        onClick={playPrev}
                        disabled={!hasPrev}
                        style={{ color: hasPrev ? 'inherit' : 'rgba(255,255,255,0.2)', cursor: hasPrev ? 'pointer' : 'not-allowed' }}
                    >
                        <SkipBack size={20} fill="currentColor" />
                    </button>

                    <button className="bp-custom-play-btn" onClick={togglePlay}>
                        {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
                    </button>

                    <MemoizedMidiPlayer
                        ref={playerRef}
                        fileUrl={fileUrl}
                        visualizerId={`#visualizer-${trackIdForAudio}`}
                    />

                    <button
                        className="bp-icon-btn"
                        onClick={playNext}
                        disabled={!hasNext}
                        style={{ color: hasNext ? 'inherit' : 'rgba(255,255,255,0.2)', cursor: hasNext ? 'pointer' : 'not-allowed' }}
                    >
                        <SkipForward size={20} fill="currentColor" />
                    </button>
                </div>
            </div>

            <div className="bp-section bp-right">
                <button
                    className="bp-icon-btn"
                    onClick={handleLike}
                    style={{ color: isLiked ? '#ff5555' : 'inherit' }}
                >
                    <Heart size={18} fill={isLiked ? "currentColor" : "none"} />
                </button>

                <a href={downloadUrl} className="bp-icon-btn" title="Download"><Download size={18} /></a>

                <button className="bp-icon-btn" onClick={handleShare} title="Share link">
                    <Share2 size={18} />
                </button>

                <div className="bp-volume-container" style={{ marginLeft: '1rem' }}>
                    <button className="bp-icon-btn" onClick={toggleMute} style={{ padding: 0 }}>
                        {isMuted || volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
                    </button>
                    <input type="range" min="0" max="100" value={isMuted ? 0 : volume} onChange={handleVolumeChange} className="bp-volume-slider" />
                </div>
                <button className="bp-icon-btn bp-close-btn" onClick={() => playTrack(null)}><X size={20} /></button>
            </div>

            <div className="bp-progress-wrapper">
                <span className="bp-time-current">{currentTime}</span>
                <input type="range" className="bp-custom-slider" min="0" max="100" step="0.1" value={progress || 0} onChange={handleSeek}
                       style={{ background: `linear-gradient(to right, #fff ${progress}%, rgba(255, 255, 255, 0.1) ${progress}%)` }} />
                <span className="bp-time-total">{duration}</span>
            </div>
        </div>
    );
}