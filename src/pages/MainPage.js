import React from 'react';
import MidiCard from '../components/MidiCard';
import Pagination from '../components/Pagination';
import FaultyTerminal from '../components/backgrounds/FaultyTerminal'; // Вернули импорт

const DUMMY_MIDI = [
    { id: 1, title: 'SS14 Bar Theme', author: 'SpaceClown', size: '15 KB', tracks: '1 Track', tags: ['Jazz'] },
    { id: 2, title: 'Rust Guitar Solo', author: 'Survivor99', size: '8 KB', tracks: 'Solo', tags: ['Rock'] },
    { id: 3, title: 'Epic Boss Fight', author: 'BardMaster', size: '42 KB', tracks: 'Multi', tags: ['Orchestra'] },
    { id: 4, title: 'Meme Compilation', author: 'UwU_Hater', size: '112 KB', tracks: 'Multi', tags: ['Meme'] },
    { id: 5, title: 'Genshin Lyre Cover', author: 'Traveler', size: '5 KB', tracks: 'Solo', tags: ['Anime'] },
    { id: 6, title: 'Cyberpunk Synth', author: 'Netrunner', size: '24 KB', tracks: '2 Tracks', tags: ['Synthwave'] },
];

export default function MainPage() {
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
                    Upload, download, and listen to <br/>
                    <span className="title-gradient">MIDI music without limits.</span>
                </h1>
                <p className="text-muted">A shared database of melodies for your favorite games.</p>
            </div>

            <div className="midi-grid">
                {DUMMY_MIDI.map(midi => (
                    <MidiCard key={midi.id} data={midi} />
                ))}
            </div>

            <Pagination />
        </>
    );
}