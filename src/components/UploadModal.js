import React, { useState, useRef } from 'react';
import { UploadCloud, X } from 'lucide-react';

export default function UploadModal({ isOpen, onClose }) {
    const [file, setFile] = useState(null);
    const [title, setTitle] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isDragging, setIsDragging] = useState(false);

    // --- СТЕЙТЫ ДЛЯ ТЕГОВ И ЧЕКБОКСА ---
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

    // Общая функция обработки файла
    const handleFileSelect = (selectedFile) => {
        setError('');
        if (!selectedFile) return;

        if (!selectedFile.name.endsWith('.mid') && !selectedFile.name.endsWith('.midi')) {
            return setError('Only .mid or .midi files are allowed!');
        }

        // ВЕРНУЛИ ЛИМИТ 1 МБ
        if (selectedFile.size > 1048576) {
            return setError('File is too large! Maximum size is 1 MB.');
        }

        setFile(selectedFile);
        if (!title) {
            setTitle(selectedFile.name.replace(/\.midi?$/i, ''));
        }
    };

    // --- DRAG AND DROP ОБРАБОТЧИКИ ---
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

    // --- ЛОГИКА ТЕГОВ ---
    const handleTagKeyDown = (e) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            setError('');

            const newTag = tagInput.trim().toLowerCase();

            if (newTag) {
                if (newTag.length > 15) {
                    return setError("Tag must be 15 characters or less.");
                }
                if (tags.length >= 5) {
                    return setError("Maximum 5 tags allowed.");
                }
                if (tags.includes(newTag)) {
                    return setError("Tag already exists.");
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

    // --- ЛОГИКА ОТПРАВКИ ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) return setError('Please select a MIDI file.');
        if (!title.trim()) return setError('Please enter a title.');
        if (!agreed) return setError('You must agree to the terms and conditions.');

        setError('');
        setIsLoading(true);

        const formData = new FormData();
        formData.append('midiFile', file);
        formData.append('title', title);
        formData.append('tags', JSON.stringify(tags));

        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/midi/upload', {
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
        <div
            className="modal-overlay"
            onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
        >
            <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxHeight: '90vh', overflowY: 'auto' }}>
                <button className="modal-close" onClick={handleClose}><X size={24} /></button>
                <h2 style={{ marginTop: 0, marginBottom: '1.5rem', color: 'white' }}>Upload MIDI</h2>

                {error && <div className="auth-error" style={{ marginBottom: '1rem' }}>{error}</div>}

                <form onSubmit={handleSubmit} className="auth-form">
                    <input
                        type="file"
                        ref={fileInputRef}
                        accept=".mid,.midi"
                        style={{ display: 'none' }}
                        onChange={(e) => handleFileSelect(e.target.files[0])}
                    />

                    {/* Зона перетаскивания файла */}
                    <div
                        className={`file-drop-area ${isDragging ? 'active' : ''}`}
                        onClick={() => fileInputRef.current.click()}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                    >
                        <UploadCloud size={32} color={file ? '#A7EF9E' : 'white'} />
                        {file ? (
                            <p className="file-name-display">{file.name}</p>
                        ) : (
                            <p>Drag & Drop or Click to select a MIDI file<br/>(Max 1 MB)</p>
                        )}
                    </div>

                    {/* Поле: Название */}
                    <div className="auth-input-group">
                        <label>Track Title <span className="required">*</span></label>
                        <input
                            type="text"
                            className="auth-input"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </div>

                    {/* Поле: Теги */}
                    <div className="auth-input-group">
                        <label style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span>Tags (Press Enter to add)</span>
                            <span>{tags.length}/5</span>
                        </label>
                        <input
                            type="text"
                            className="auth-input"
                            value={tagInput}
                            onChange={(e) => setTagInput(e.target.value)}
                            onKeyDown={handleTagKeyDown}
                            placeholder={tags.length >= 5 ? "Maximum tags reached" : "Add up to 5 tags. Each tag up to 15 chars."}
                            disabled={tags.length >= 5}
                            style={{ opacity: tags.length >= 5 ? 0.5 : 1 }}
                        />

                        {/* Вывод добавленных тегов */}
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

                    {/* --- ИНФО-БЛОК И СОГЛАШЕНИЕ --- */}
                    <div style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px', padding: '1rem', marginTop: '0.5rem', marginBottom: '1rem' }}>
                        <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: '1.8', marginBottom: '1rem' }}>
                            <p style={{ margin: 0 }}>Supports only MIDI files</p>
                            <p style={{ margin: 0 }}>Supported formats: .mid, .midi</p>
                            <p style={{ margin: 0 }}>Max file size: 1MB</p>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.8rem' }}>
                            <input
                                type="checkbox"
                                id="modal-terms"
                                checked={agreed}
                                onChange={(e) => { setAgreed(e.target.checked); setError(''); }}
                                style={{ marginTop: '0.2rem', cursor: 'pointer', width: '16px', height: '16px', accentColor: '#00ffcc' }}
                            />
                            <div>
                                <label htmlFor="modal-terms" style={{ color: '#e0e0e0', fontSize: '0.9rem', cursor: 'pointer' }}>
                                    I agree to the <a href="/terms" style={{ color: '#fff', textDecoration: 'underline' }}>terms and conditions</a> and <a href="/privacy" style={{ color: '#fff', textDecoration: 'underline' }}>privacy policy</a>.
                                </label>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', margin: '0.4rem 0 0 0', lineHeight: '1.4' }}>
                                    By uploading, you confirm that your content does not violate copyright and meets our community guidelines.
                                </p>
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="btn-auth-submit"
                        disabled={isLoading || !file || !agreed}
                        style={{ opacity: (!file || !agreed) ? 0.5 : 1, cursor: (!file || !agreed) ? 'not-allowed' : 'pointer' }}
                    >
                        {isLoading ? 'Uploading...' : 'Publish Track'}
                    </button>
                </form>
            </div>
        </div>
    );
}