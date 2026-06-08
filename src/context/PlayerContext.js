import React, { createContext, useState, useContext } from 'react';

const PlayerContext = createContext();

export const usePlayer = () => useContext(PlayerContext);

export const PlayerProvider = ({ children }) => {
    const [currentTrack, setCurrentTrack] = useState(null);
    const [playlist, setPlaylist] = useState([]); // 👈 Список треков

    // Теперь мы принимаем не только трек, но и массив соседних треков
    const playTrack = (track, trackList = []) => {
        setCurrentTrack(track);
        if (trackList.length > 0) {
            setPlaylist(trackList);
        }
    };

    const updateCurrentTrack = (updates) => {
        if (currentTrack) setCurrentTrack({ ...currentTrack, ...updates });
    };

    // Вперед
    const playNext = () => {
        if (!currentTrack || playlist.length === 0) return;
        const currentIndex = playlist.findIndex(t => String(t._id || t.id) === String(currentTrack._id || currentTrack.id));
        if (currentIndex !== -1 && currentIndex < playlist.length - 1) {
            setCurrentTrack(playlist[currentIndex + 1]);
        } else {
            setCurrentTrack(null); // Конец списка
        }
    };

    // Назад
    const playPrev = () => {
        if (!currentTrack || playlist.length === 0) return;
        const currentIndex = playlist.findIndex(t => String(t._id || t.id) === String(currentTrack._id || currentTrack.id));
        if (currentIndex > 0) {
            setCurrentTrack(playlist[currentIndex - 1]);
        }
    };

    return (
        <PlayerContext.Provider value={{ currentTrack, playTrack, updateCurrentTrack, playNext, playPrev, playlist }}>
            {children}
        </PlayerContext.Provider>
    );
};