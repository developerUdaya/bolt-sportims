import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

interface Player {
    id: string;
    name: string;
    email: string;
    // Add other fields from your API response
}

interface PlayerContextType {
    player: Player | null;
    loading: boolean;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export const PlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [player, setPlayer] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const baseURL = import.meta.env.VITE_API_BASE_URL;

    useEffect(() => {
        const fetchPlayer = async () => {
            const userId = localStorage.getItem('user_id');
            if (!userId) return;

            try {
                const res = await axios.get(`${baseURL}/players/${userId}`);
                setPlayer(res.data);
            } catch (error) {
                console.error('Error fetching player profile:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPlayer();
    }, []);

    return (
        <PlayerContext.Provider value={{ player, loading }}>
            {children}
        </PlayerContext.Provider>
    );
};

export const usePlayer = () => {
    const context = useContext(PlayerContext);
    if (!context) throw new Error('usePlayer must be used within a PlayerProvider');
    return context;
};
