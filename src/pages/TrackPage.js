import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import MidiCard from '../components/MidiCard';
import FaultyTerminal from '../components/backgrounds/FaultyTerminal';
import { ArrowLeft, Send, Trash2 } from 'lucide-react';
import { toast } from 'react-toastify';

export default function TrackPage() {
    const { id } = useParams();
    const [track, setTrack] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    const [commentText, setCommentText] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;
    const currentUserId = user ? (user.id || user.userId || user._id) : null;

    // Track loading
    const fetchTrack = () => {
        fetch(`/api/midi/track/${id}`)
            .then(res => {
                if (!res.ok) throw new Error('Track not found');
                return res.json();
            })
            .then(data => setTrack(data))
            .catch(err => setError(err.message))
            .finally(() => setIsLoading(false));
    };

    useEffect(() => {
        fetchTrack();
    }, [id]);

    // Comment sending
    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (!commentText.trim()) return;
        if (!token) return toast.error("You must be logged in to comment.");

        setIsSubmitting(true);
        try {
            const response = await fetch(`/api/midi/${id}/comment`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ text: commentText })
            });

            const data = await response.json();

            if (response.ok) {
                setTrack(data);
                setCommentText('');
                toast.success("Comment added successfully!");
            } else {
                toast.error(data.message || "Failed to add comment");
            }
        } catch (err) {
            console.error(err);
            toast.error("Server error");
        } finally {
            setIsSubmitting(false);
        }
    };


    // Comment deletion
    const handleDeleteComment = async (commentId) => {
        if (!token) return toast.error("You must be logged in to delete comments.");

        try {
            const response = await fetch(`/api/midi/${id}/comment/${commentId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (response.ok) {
                setTrack(data);
                toast.success("Comment deleted successfully!");
            } else {
                toast.error(data.message || "Failed to delete comment");
            }
        } catch (err) {
            console.error("Error deleting comment:", err);
            toast.error("Server error");
        }
    };


    // Background optimization
    const memoizedBackground = useMemo(() => (
        <div className="background-layer">
            <FaultyTerminal scale={3} brightness={0.05} />
        </div>
    ), []);

    return (
        <>
            {memoizedBackground}

            <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem', color: '#fff' }}>
                <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', textDecoration: 'none', marginBottom: '2rem' }}>
                    <ArrowLeft size={20} /> Back to Home
                </Link>

                {isLoading ? (
                    <p style={{ textAlign: 'center' }}>Loading track...</p>
                ) : error ? (
                    <p style={{ color: '#ff5555', textAlign: 'center' }}>{error}</p>
                ) : track ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>

                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <div style={{ width: '100%', maxWidth: '400px' }}>
                                <MidiCard data={track} />
                            </div>
                        </div>

                        <div className="comments-section" style={{ background: 'rgba(0,0,0,0.4)', padding: '2rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                            <h3 style={{ marginBottom: '1.5rem', fontSize: '1.3rem', fontFamily: 'monospace' }}>
                                Comments ({track.comments?.length || 0})
                            </h3>

                            {user ? (
                                <form onSubmit={handleCommentSubmit} style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                                    <input
                                        type="text"
                                        placeholder="Write a comment..." // ENGLISH
                                        value={commentText}
                                        onChange={(e) => setCommentText(e.target.value)}
                                        disabled={isSubmitting}
                                        style={{
                                            flex: 1,
                                            padding: '0.8rem 1.2rem',
                                            borderRadius: '8px',
                                            border: '1px solid rgba(255,255,255,0.1)',
                                            background: 'rgba(255,255,255,0.03)',
                                            color: '#fff',
                                            outline: 'none'
                                        }}
                                    />
                                    <button
                                        type="submit"
                                        disabled={isSubmitting || !commentText.trim()}
                                        className="btn btn-primary"
                                        style={{ padding: '0.8rem 1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem', borderRadius: '8px' }}
                                    >
                                        <Send size={16} />
                                    </button>
                                </form>
                            ) : (
                                <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', textAlign: 'center', marginBottom: '2rem', color: 'var(--text-muted)' }}>
                                    You must be <Link to="/login" style={{ color: '#ffffff' }}>logged in</Link> to leave a comment.
                                </div>
                            )}

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {!track.comments || track.comments.length === 0 ? (
                                    <p style={{ color: 'var(--text-muted)', textAlign: 'center', fontSize: '0.9rem' }}>No comments yet. Be the first to write one!</p>
                                ) : (
                                    track.comments.map((comment, index) => {
                                        const isAuthor = currentUserId && String(currentUserId) === String(comment.userId);

                                        return (
                                            <div
                                                key={index}
                                                className="comment-box"
                                                style={{
                                                    padding: '1.5rem',
                                                    background: '#1e1e1e',
                                                    borderRadius: '8px',
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'flex-start',
                                                    border: '1px solid rgba(255,255,255,0.05)',
                                                    position: 'relative'
                                                }}
                                            >
                                                <div className="comment-main-content" style={{ flex: 1, paddingRight: '2rem' }}>
                                                    <div style={{ fontSize: '0.85rem', lineHeight: '1' }}>
                                                        <span
                                                            className="comment-username"
                                                            style={{ fontWeight: '600', fontFamily: 'monospace', color: 'white' }}
                                                        >
                                                            {comment.username}
                                                        </span>
                                                    </div>
                                                    <p style={{ fontSize: '0.95rem', color: '#e0e0e0', lineHeight: '1.4', margin: 0, marginTop: '0.6rem' }}>
                                                        {comment.text}
                                                    </p>
                                                </div>

                                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', minWidth: '80px' }}>

                                                    <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: '1', marginTop: '-0.45rem' }}>
                                                        {new Date(comment.createdAt).toLocaleDateString()}
                                                    </span>

                                                    {isAuthor && (
                                                        <button
                                                            className="comment-delete-btn"
                                                            onClick={() => handleDeleteComment(comment._id)}
                                                            title="Delete comment"
                                                            style={{
                                                                position: 'absolute',
                                                                top: '2.5rem',
                                                                right: '1.5rem',
                                                                background: 'none', border: 'none', cursor: 'pointer', padding: 0,
                                                                color: '#666', transition: 'all 0.2s ease', display: 'flex'
                                                            }}
                                                            onMouseEnter={(e) => { e.currentTarget.style.color = '#ff5555'; e.currentTarget.style.transform = 'scale(1.1)'; }}
                                                            onMouseLeave={(e) => { e.currentTarget.style.color = '#666'; e.currentTarget.style.transform = 'scale(1)'; }}
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>

                        </div>
                    </div>
                ) : null}
            </div>
        </>
    );
}