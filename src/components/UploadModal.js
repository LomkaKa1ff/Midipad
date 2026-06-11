import React, { useState, useRef } from 'react';
import { UploadCloud, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function UploadModal({ isOpen, onClose }) {
    const { t } = useTranslation();
    const [file, setFile] = useState(null);
    const [title, setTitle] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isDragging, setIsDragging] = useState(false);

    const [tags, setTags] = useState([]);
    const [tagInput, setTagInput] = useState('');
    const [agreed, setAgreed] = useState(false);

    const fileInputRef = useRef(null);

    if (!isOpen) return null;

    const resetForm = () => {
        setFile(null);
        setTitle('');
        setError('');
        setIsLoading(false);
        setTags([]);
        setTagInput('');
        setAgreed(false);
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    const handleFileSelect = (selectedFile) => {
        setError('');
        if (!selectedFile) return;

        if (!selectedFile.name.endsWith('.mid') && !selectedFile.name.endsWith('.midi')) {
            return setError(t('err_only_midi'));
        }

        if (selectedFile.size > 1048576) {
            return setError(t('err_too_large'));
        }

        setFile(selectedFile);
        if (!title) {
            setTitle(selectedFile.name.replace(/\.midi?$/i, ''));
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFileSelect(e.dataTransfer.files[0]);
        }
    };

    const handleTagKeyDown = (e) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            setError('');

            const newTag = tagInput.trim().toLowerCase();

            if (newTag) {
                if (newTag.length > 15) {
                    return setError(t('err_tag_length'));
                }
                if (tags.length >= 5) {
                    return setError(t('err_max_tags'));
                }
                if (tags.includes(newTag)) {
                    return setError(t('err_tag_exists'));
                }

                setTags([...tags, newTag]);
                setTagInput('');
            }
        }
    };

    const removeTag = (indexToRemove) => {
        setTags(tags.filter((_, index) => index !== indexToRemove));
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) return setError(t('err_select_file'));
        if (!title.trim()) return setError(t('err_enter_title'));
        if (title.trim().length > 50) return setError(t('err_title_length'));
        if (!agreed) return setError(t('err_agree_terms'));

        setError('');
        setIsLoading(true);

        const formData = new FormData();
        formData.append('midiFile', file);
        formData.append('title', title);
        formData.append('tags', JSON.stringify(tags));

        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/midi/upload', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Upload failed');

            resetForm();
            onClose();
            window.location.reload();
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="modal-overlay" onMouseDown={(e) => { if (e.target === e.currentTarget) handleClose(); }}>
            <div className="modal-content" onMouseDown={e => e.stopPropagation()} style={{ maxHeight: '90vh', overflowY: 'auto' }}>
                <button className="modal-close" onClick={handleClose}><X size={24} /></button>
                <h2 style={{ marginTop: 0, marginBottom: '1.5rem', color: 'white' }}>{t('upload_midi_title')}</h2>

                {error && <div className="auth-error" style={{ marginBottom: '1rem' }}>{error}</div>}

                <form onSubmit={handleSubmit} className="auth-form">
                    <input type="file" ref={fileInputRef} accept=".mid,.midi" style={{ display: 'none' }} onChange={(e) => handleFileSelect(e.target.files[0])} />

                    <div className={`file-drop-area ${isDragging ? 'active' : ''}`} onClick={() => fileInputRef.current.click()} onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}>
                        <UploadCloud size={32} color={file ? '#A7EF9E' : 'white'} />
                        {file ? (
                            <p className="file-name-display">{file.name}</p>
                        ) : (
                            <p>{t('drag_drop')}<br/>{t('max_1mb')}</p>
                        )}
                    </div>

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

                    <div style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px', padding: '1rem', marginTop: '0.5rem', marginBottom: '1rem' }}>
                        <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: '1.8', marginBottom: '1rem' }}>
                            <p style={{ margin: 0 }}>{t('supports_only')}</p>
                            <p style={{ margin: 0 }}>{t('supported_formats')}</p>
                            <p style={{ margin: 0 }}>{t('max_file_size')}</p>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.8rem' }}>
                            <input type="checkbox" id="modal-terms" checked={agreed} onChange={(e) => { setAgreed(e.target.checked); setError(''); }} style={{ marginTop: '0.2rem', cursor: 'pointer', width: '16px', height: '16px', accentColor: '#00ffcc' }} />
                            <div>
                                <label htmlFor="modal-terms" style={{ color: '#e0e0e0', fontSize: '0.9rem', cursor: 'pointer' }}>
                                    {t('i_agree')} <a href="/terms" style={{ color: '#fff', textDecoration: 'underline' }}>{t('terms_of_use')}</a> {t('and')} <a href="/privacy" style={{ color: '#fff', textDecoration: 'underline' }}>{t('privacy_policy')}</a>.
                                </label>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', margin: '0.4rem 0 0 0', lineHeight: '1.4' }}>
                                    {t('upload_confirm')}
                                </p>
                            </div>
                        </div>
                    </div>

                    <button type="submit" className="btn-auth-submit" disabled={isLoading || !file || !agreed} style={{ opacity: (!file || !agreed) ? 0.5 : 1, cursor: (!file || !agreed) ? 'not-allowed' : 'pointer' }}>
                        {isLoading ? t('uploading') : t('publish_track')}
                    </button>
                </form>
            </div>
        </div>
    );
}