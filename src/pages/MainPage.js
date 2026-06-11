import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import MidiCard from '../components/MidiCard';
import FaultyTerminal from '../components/backgrounds/FaultyTerminal';
import { useTranslation } from 'react-i18next';

export default function MainPage() {
    const [searchParams] = useSearchParams();
    const { t } = useTranslation();

    const activeTab = searchParams.get('sort') || 'trending';
    const searchQuery = searchParams.get('search') || '';

    const [midis, setMidis] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const [currentPage, setCurrentPage] = useState(1);
    const tracksPerPage = 16;

    useEffect(() => {
        setCurrentPage(1);
    }, [activeTab, searchQuery]);

    useEffect(() => {
        const fetchMidis = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(`/api/midi?sort=${activeTab}&search=${searchQuery}`);
                const data = await response.json();

                if (response.ok) {
                    setMidis(data);
                }
            } catch (error) {
                console.error("Failed to fetch MIDIs:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchMidis();
    }, [activeTab, searchQuery]);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [currentPage]);

    const indexOfLastTrack = currentPage * tracksPerPage;
    const indexOfFirstTrack = indexOfLastTrack - tracksPerPage;
    const currentTracks = midis.slice(indexOfFirstTrack, indexOfLastTrack);
    const totalPages = Math.ceil(midis.length / tracksPerPage);

    return (
        <>
            <div className="background-layer">
                <FaultyTerminal
                    scale={3}
                    gridMul={[2, 1]}
                    digitSize={1.2}
                    timeScale={0.1}
                    pause={false}
                    scanlineIntensity={0.5}
                    glitchAmount={1}
                    flickerAmount={1}
                    noiseAmp={1}
                    chromaticAberration={0}
                    dither={0}
                    curvature={0.1}
                    tint="#ffffff"
                    mouseReact={false}
                    mouseStrength={0.5}
                    pageLoadAnimation={true}
                    brightness={0.1}
                />
            </div>

            <div className="mb-large text-center">
                <h1 className="title-main">
                    {t('main_title_1')} <br/>
                    <span className="title-gradient">{t('main_title_2')}</span>
                </h1>
                <p className="text-muted">{t('main_subtitle')}</p>
            </div>

            {isLoading ? (
                <div style={{ textAlign: 'center', color: 'white', padding: '3rem 0' }}>
                    {t('loading_tracks')}
                </div>
            ) : midis.length === 0 ? (
                <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '3rem 0' }}>
                    {searchQuery
                        ? t('no_tracks_search', { query: searchQuery, tab: activeTab })
                        : activeTab === 'trending'
                            ? t('no_trending')
                            : t('no_tracks')}
                </div>
            ) : (
                <>
                    <div className="midi-grid">
                        {currentTracks.map(midi => (
                            <MidiCard key={midi._id || midi.id} data={midi} playlist={currentTracks} />
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
                                        style={{
                                            padding: '0.5rem 1rem',
                                            cursor: 'pointer',
                                            backgroundColor: currentPage === pageNumber ? 'rgba(255,255,255,0.2)' : 'transparent',
                                            color: '#fff',
                                            border: '1px solid rgba(255,255,255,0.2)',
                                            borderRadius: '4px'
                                        }}
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
        </>
    );
}