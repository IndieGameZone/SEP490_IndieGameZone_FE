import { getAllGamesAdmin, getGameById, getGameCensorLog, getGameFiles, getGamesByDeveloperId } from '@/lib/api/game-api';
import { Game, GameCensorLog, GameFile } from '@/types/game';
import { create } from 'zustand';

interface GameState {
    games: Game[];
    gameFiles: GameFile[],
    game?: Game;
    gameCensorLogs: GameCensorLog[];
    installInstruction?: string;
    loading: boolean;
    loadingFiles: boolean;
    error: string | null;
    fetchGameByDeveloperId: (developerId: string) => void;
    fetchGameById: (gameId: string) => void;
    fetchGameFiles: (gameId: string) => void;
    fetchGameCensorLog: (gameId: string) => void;
    fetchAllGamesAdmin: () => void;
    clearGameStore: () => void;
    renderKey: number;
    rerender: () => void;
}

const useGameStore = create<GameState>((set) => ({
    games: [],
    gameFiles: [],
    gameCensorLogs: [],
    game: undefined,
    loading: false,
    loadingFiles: false,
    error: null,
    renderKey: 0,
    rerender: () => {
        set(prev => ({ renderKey: prev.renderKey + 1 }))
    },

    fetchAllGamesAdmin: async () => {
        set({ loading: true, error: null });
        try {
            const response = await getAllGamesAdmin();
            if (!response.error) {
                set({ games: response.data, loading: false });
            } else {
                set({ loading: false, error: response.error });
            }
        } catch (error: any) {
            set({ loading: false, error: error.message });
        }
    },

    fetchGameByDeveloperId: async (developerId) => {
        set({ loading: true, error: null });
        try {
            const response = await getGamesByDeveloperId(developerId);
            if (!response.error) {
                set({ games: response.data.games, loading: false });
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

    fetchGameFiles: async (gameId) => {
        set({ loadingFiles: true, error: null });
        try {
            const response = await getGameFiles(gameId);
            if (!response.error) {
                set({ gameFiles: response.data.gamePlatforms, installInstruction: response.data.installInstruction, loadingFiles: false });
            } else {
                set({ loadingFiles: false, error: response.error });
            }
        } catch (error: any) {
            set({ loadingFiles: false, error: error.message });
        }
    },
    fetchGameCensorLog: async (gameId) => {
        set({ loadingFiles: true, error: null });
        try {
            const response = await getGameCensorLog(gameId);
            if (!response.error) {
                set({ gameCensorLogs: response.data });
            } else {
                set({ loadingFiles: false, error: response.error });
            }
        } catch (error: any) {
            set({ loadingFiles: false, error: error.message });
        }
    },
    clearGameStore: () => {
        set({ loading: false, gameFiles: [], game: undefined, games: [] });
    }
}));

export default useGameStore;