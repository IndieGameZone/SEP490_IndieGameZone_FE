import { getGameById, getGamesByDeveloperId } from '@/lib/api/game-api';
import { Game } from '@/types/game';
import { create } from 'zustand';

interface GameState {
    games: Game[];
    game?: Game;
    loading: boolean;
    error: string | null;
    fetchGameByDeveloperId: (developerId: string) => void;
    fetchGameById: (gameId: string) => void;
    renderKey: number;
    rerender: () => void;
}

const useGameStore = create<GameState>((set) => ({
    games: [],
    game: undefined,
    loading: false,
    error: null,
    renderKey: 0,
    rerender: () => {
        set(prev => ({ renderKey: prev.renderKey + 1 }))
    },
    fetchGameByDeveloperId: async (developerId) => {
        set({ loading: true, error: null });
        try {
            const response = await getGamesByDeveloperId(developerId);
            if (!response.error) {
                set({ games: response.data, loading: false });
            } else {
                set({ loading: false, error: response.error });
            }
        } catch (error: any) {
            set({ loading: false, error: error.message });
        }
    },
    fetchGameById: async (gameId) => {
        set({ loading: true, error: null });
        try {
            const response = await getGameById(gameId);
            if (!response.error) {
                set({ game: response.data, loading: false });
            } else {
                set({ loading: false, error: response.error });
            }
        } catch (error: any) {
            set({ loading: false, error: error.message });
        }
    },
}));

export default useGameStore;