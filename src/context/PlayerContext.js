import React, { createContext, useState, useContext } from 'react';

const PlayerContext = createContext();

export const PlayerProvider = ({ children }) => {
    const [currentTrack, setCurrentTrack] = useState(null);

    const playTrack = (track) => {
        setCurrentTrack(track);
    };

    // ВОТ ЭТА ФУНКЦИЯ КРИТИЧЕСКИ ВАЖНА ДЛЯ СИНХРОНИЗАЦИИ
    const updateCurrentTrack = (fields) => {
        setCurrentTrack(prev => {
            if (!prev) return null;
            return { ...prev, ...fields };
        });
    };

    return (
        <PlayerContext.Provider value={{ currentTrack, playTrack, updateCurrentTrack }}>
            {children}
        </PlayerContext.Provider>
    );
};

export const usePlayer = () => useContext(PlayerContext);