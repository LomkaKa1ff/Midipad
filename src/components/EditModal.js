import React, { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function EditModal({ isOpen, onClose, trackData }) {
    const { t } = useTranslation();
    const [title, setTitle] = useState('');
    const [tags, setTags] = useState([]);
    const [tagInput, setTagInput] = useState('');
    const [coverFile, setCoverFile] = useState(null);
    const [coverUrl, setCoverUrl] = useState('');
    const [removeCoverFlag, setRemoveCoverFlag] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const coverInputRef = useRef(null);

    useEffect(() => {
        if (trackData && isOpen) {
            setTitle(trackData.title || '');
            setTags(trackData.tags || []);
            setCoverUrl(trackData.coverImage && !trackData.coverImage.startsWith('/uploads/') ? trackData.coverImage : '');
            setCoverFile(null);
            setRemoveCoverFlag(false);
            setError('');
        }
    }, [trackData, isOpen]);

    if (!isOpen || !trackData) return null;

    const handleCoverSelect = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.size > 2097152) { // 2MB
            return setError(t('err_cover_too_large') || 'Cover image too large');
        }
        setCoverFile(file);
        setCoverUrl('');
        setRemoveCoverFlag(false);
    };

    const handleTagKeyDown = (e) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            setError('');

            const newTag = tagInput.trim().toLowerCase();
            if (newTag) {
                if (newTag.length > 15) return setError(t('err_tag_length') || 'Tag too long');
                if (tags.length >= 5) return setError(t('err_max_tags') || 'Max 5 tags');
                if (tags.includes(newTag)) return setError(t('err_tag_exists') || 'Tag already exists');

                setTags([...tags, newTag]);
                setTagInput('');
            }
        }
    };

    const removeTag = (indexToRemove) => {
        setTags(tags.filter((_, index) => index !== indexToRemove));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title.trim()) return setError(t('err_enter_title') || 'Enter title');
        if (title.trim().length > 50) return setError(t('err_title_length') || 'Title too long');

        setError('');
        setIsLoading(true);

        const formData = new FormData();
        formData.append('title', title);
        formData.append('tags', JSON.stringify(tags));

        // 🔥 УМНАЯ ЛОГИКА ОБЛОЖКИ
        if (coverFile) {
            formData.append('coverImage', coverFile);
        } else if (coverUrl) {
            formData.append('coverUrl', coverUrl);
        } else if (removeCoverFlag) {
            formData.append('coverUrl', '');
        }

        try {
            const token = localStorage.getItem('token');
            const trackId = trackData._id || trackData.id;
            const response = await fetch(`/api/midi/${trackId}`, {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData
            });

            const text = await response.text();
            let data;
            try {
                data = JSON.parse(text);
            } catch (err) {
                throw new Error(t('server_error') || 'Server error');
            }

            if (!response.ok) throw new Error(data.message || 'Update failed');

            onClose();
            window.location.reload();
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="modal-overlay" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
            <div className="modal-content" onMouseDown={e => e.stopPropagation()} style={{ maxHeight: '90vh', overflowY: 'auto' }}>
                <button className="modal-close" onClick={onClose}><X size={24} /></button>
                <h2 style={{ marginTop: 0, marginBottom: '1.5rem', color: 'white' }}>{t('edit_track_title') || 'Edit Track'}</h2>

                {error && <div className="auth-error" style={{ marginBottom: '1rem' }}>{error}</div>}

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="auth-input-group">
                        <label style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span>{t('track_title')} <span className="required">*</span></span>
                            <span style={{ color: title.length >= 50 ? '#ff5555' : 'inherit' }}>
                                {title.length}/50
                            </span>
                        </label>
                        <input
                            type="text"
                            className="auth-input"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            maxLength={50}
                            required
                        />
                    </div>

                    <div className="auth-input-group">
                        <label style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span>{t('tags_label')}</span>
                            <span>{tags.length}/5</span>
                        </label>
                        <input type="text" className="auth-input" value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={handleTagKeyDown} placeholder={tags.length >= 5 ? t('max_tags_reached') : t('add_tags_placeholder')} disabled={tags.length >= 5} style={{ opacity: tags.length >= 5 ? 0.5 : 1 }} />

                        {tags.length > 0 && (
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.8rem' }}>
                                {tags.map((tag, index) => (
                                    <div key={index} style={{ background: '#2a2a2a', border: '1px solid rgba(255,255,255,0.1)', padding: '0.3rem 0.8rem', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', color: '#e0e0e0' }}>
                                        #{tag}
                                        <button type="button" onClick={() => removeTag(index)} style={{ background: 'none', border: 'none', color: '#ff5555', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center' }}>
                                            <X size={14} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="auth-input-group" style={{ marginTop: '1.5rem' }}>
                        <label style={{ display: 'block', color: 'white', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                            {t('custom_cover_title') || 'Custom Cover'}
                        </label>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '8px' }}>
                            <input type="file" accept="image/*" ref={coverInputRef} onChange={handleCoverSelect} style={{ display: 'none' }} />

                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <button type="button" onClick={() => coverInputRef.current.click()} style={{ padding: '0.4rem 0.8rem', background: '#333', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85rem' }}>
                                    {t('choose_cover_btn') || 'Choose a cover image'}
                                </button>
                                <span style={{ color: '#aaa', fontSize: '0.85rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '200px' }}>
                                    {coverFile ? coverFile.name : ((trackData.coverImage && !removeCoverFlag) ? (t('cover_exists') || 'Cover already set') : (t('no_file_chosen') || 'No file chosen'))}
                                </span>
                            </div>

                            <div style={{ color: '#aaa', fontSize: '0.8rem', textAlign: 'center', margin: '0.5rem 0' }}>
                                - {t('or_paste_link') || 'or paste a GIF link'} -
                            </div>

                            <input
                                type="text"
                                placeholder="https://example.com/image.gif"
                                value={coverUrl}
                                onChange={(e) => {
                                    setCoverUrl(e.target.value);
                                    if (e.target.value) setCoverFile(null);
                                    setRemoveCoverFlag(false);
                                }}
                                className="auth-input"
                                style={{ padding: '0.5rem' }}
                            />

                            <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', margin: '0', lineHeight: '1.4', flex: 1 }}>
                                    {t('cover_description') || 'Add a background to your sound card (max 2MB).'}
                                </p>
                                {((trackData.coverImage && !removeCoverFlag) || coverFile || coverUrl) && (
                                    <button
                                        type="button"
                                        onClick={() => { setCoverFile(null); setCoverUrl(''); setRemoveCoverFlag(true); }}
                                        style={{ background: 'transparent', border: 'none', color: '#ff5555', cursor: 'pointer', fontSize: '0.8rem', padding: 0 }}
                                    >
                                        {t('remove_cover_btn') || 'Remove Cover'}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    <button type="submit" className="btn-auth-submit" disabled={isLoading} style={{ marginTop: '1.5rem' }}>
                        {isLoading ? (t('saving') || 'Saving...') : (t('save_changes_btn') || 'Save Changes')}
                    </button>
                </form>
            </div>
        </div>
    );
}