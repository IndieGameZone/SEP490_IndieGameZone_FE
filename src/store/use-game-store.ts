import { getGamesAsAdmin, getGamesByDeveloperId, getGameById, getGameFiles, getGameCensorLog, getNumberOfGame, getGamePriceLogs } from '@/lib/api/game-api';
import { Game, GameCensorLog, GameFile, PriceLog } from '@/types/game';
import { create } from 'zustand';

interface GameStatistics {
  total: number;
  approve: number;
  reject: number;
  manual: number;
  ai: number;
}

interface GameState {
  games: Game[];
  gameFiles: GameFile[];
  game?: Game;
  gameCensorLogs: GameCensorLog[];
  gamePriceLogs: PriceLog[];
  installInstruction?: string;
  statistics: GameStatistics | null;
  loading: boolean;
  loadingFiles: boolean;
  loadingStatistics: boolean;
  error: string | null;
  fetchGameByDeveloperId: (developerId: string) => void;
  fetchGameById: (gameId: string) => void;
  fetchGameFiles: (gameId: string) => void;
  fetchGameCensorLog: (gameId: string) => void;
  fetchGamePriceLogs: (gameId: string) => void;
  fetchAllGamesAdmin: () => void;
  fetchGameStatistics: () => void;
  clearGameStore: () => void;
  renderKey: number;
  rerender: () => void;
}

const useGameStore = create<GameState>((set) => ({
  games: [],
  gameFiles: [],
  gameCensorLogs: [],
  gamePriceLogs: [],
  game: undefined,
  statistics: null,
  loading: false,
  loadingFiles: false,
  loadingStatistics: false,
  error: null,
  renderKey: 0,
  rerender: () => {
    set((prev) => ({ renderKey: prev.renderKey + 1 }));
  },

  fetchAllGamesAdmin: async () => {
    set({ loading: true, error: null });
    try {
      const response = await getGamesAsAdmin();
      if (!response.error) {
        set({ games: response.data.games, loading: false });
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
    try {
      const response = await getGameCensorLog(gameId);
      if (!response.error) {
        set({ gameCensorLogs: response.data });
      } else {
        set({ error: response.error });
      }
    } catch (error: any) {
      set({ error: error.message });
    }
  },

  fetchGamePriceLogs: async (gameId) => {
    try {
      const response = await getGamePriceLogs(gameId);
      if (!response.error) {
        set({ gamePriceLogs: response.data });
      } else {
        set({ error: response.error });
      }
    } catch (error: any) {
      set({ error: error.message });
    }
  },


  fetchGameStatistics: async () => {
    set({ loadingStatistics: true, error: null });
    try {
      const response = await getNumberOfGame();
      if (!response.error) {
        set({ statistics: response.data, loadingStatistics: false });
      } else {
        set({ loadingStatistics: false, error: response.error });
      }
    } catch (error: any) {
      set({ loadingStatistics: false, error: error.message });
    }
  },

  clearGameStore: () => {
    set({ loading: false, loadingFiles: false, loadingStatistics: false, gameFiles: [], game: undefined, games: [], statistics: null });
  },
}));

export default useGameStore;