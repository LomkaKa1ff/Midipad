import React, { useState, useRef } from 'react';
import { UploadCloud, X } from 'lucide-react';

export default function UploadModal({ isOpen, onClose }) {
    const [file, setFile] = useState(null);
    const [title, setTitle] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isDragging, setIsDragging] = useState(false); // Для визуального эффекта при перетаскивании

    const fileInputRef = useRef(null);

    if (!isOpen) return null;

    const resetForm = () => {
        setFile(null);
        setTitle('');
        setError('');
        setIsLoading(false);
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) return setError('Please select a MIDI file.');
        if (!title.trim()) return setError('Please enter a title.');

        setError('');
        setIsLoading(true);

        const formData = new FormData();
        formData.append('midiFile', file);
        formData.append('title', title);

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
        // Проверяем, что клик был ровно по оверлею (e.target === e.currentTarget)
        <div
            className="modal-overlay"
            onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
        >
            <div className="modal-content" onClick={e => e.stopPropagation()}>
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

                    <button type="submit" className="btn-auth-submit" disabled={isLoading || !file}>
                        {isLoading ? 'Uploading...' : 'Publish Track'}
                    </button>
                </form>
            </div>
        </div>
    );
}