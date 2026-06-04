import React from 'react';
import { Play, Download } from 'lucide-react';

export default function MidiCard({ data }) {
    return (
        <div className="midi-card">
            {/* Piano Roll Graphic */}
            <div className="piano-roll">
                <div className="play-overlay">
                    <button className="play-btn">
                        <Play fill="currentColor" size={20} />
                    </button>
                </div>
                <div className="note" style={{ width: '33%' }}></div>
                <div className="note" style={{ width: '50%', marginLeft: '1rem' }}></div>
                <div className="note" style={{ width: '25%', marginLeft: '2.5rem' }}></div>
                <div className="note glow" style={{ width: '66%', marginLeft: '0.5rem' }}></div>
                <div className="note" style={{ width: '20%', marginLeft: '2rem' }}></div>
            </div>

            <div>
                <h3 className="card-title">{data.title}</h3>
                <p className="text-muted card-author">by {data.author}</p>
            </div>

            <div className="card-meta text-muted">
                <span className="track-badge">{data.tracks}</span>
                <span>{data.size}</span>
            </div>

            <button className="btn-download">
                <Download size={18} />
                Download .MID
            </button>
        </div>
    );
}