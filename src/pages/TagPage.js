import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import MidiCard from '../components/MidiCard';
import FaultyTerminal from '../components/backgrounds/FaultyTerminal';
import { Hash } from 'lucide-react'; // Иконка решетки

export default function TagPage() {
    const { tag } = useParams(); // Достаем тег из URL (например, из /tag/rock достанет "rock")
    const [tracks, setTracks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        window.scrollTo(0, 0); // При переходе на страницу скроллим наверх
        const fetchByTag = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(`http://localhost:5000/api/midi/tag/${tag}`);
                if (response.ok) {
                    const data = await response.json();
                    setTracks(data);
                }
            } catch (error) {
                console.error("Error fetching by tag:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchByTag();
    }, [tag]); // Если юзер кликнет на другой тег, useEffect запустится заново

    return (
        <>
            <div className="background-layer">
                <FaultyTerminal scale={3} brightness={0.05} />
            </div>

            <div style={{ maxWidth: '1200px', margin: '4rem auto', padding: '0 1rem', position: 'relative', zIndex: 1 }}>

                {/* ШАПКА СТРАНИЦЫ */}
                <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <div style={{ display: 'inline-flex', padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '50%', marginBottom: '1rem' }}>
                        <Hash size={40} color="#ffffff" />
                    </div>
                    <h1 style={{ color: '#fff', fontSize: '2.5rem', fontFamily: 'monospace', margin: 0 }}>
                        #{tag}
                    </h1>
                    <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                        Found {tracks.length} track{tracks.length !== 1 ? 's' : ''}
                    </p>
                </div>

                {/* ВЫВОД ТРЕКОВ */}
                {isLoading ? (
                    <div style={{ textAlign: 'center', color: 'white', padding: '2rem' }}>
                        Searching for #{tag}...
                    </div>
                ) : tracks.length === 0 ? (
                    <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>
                        No tracks found with this tag.
                    </div>
                ) : (
                    <div className="midi-grid">
                        {tracks.map(midi => (
                            <MidiCard key={midi._id || midi.id} data={midi} />
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}