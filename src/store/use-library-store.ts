import { getUserLibrary } from '@/lib/api/game-library-api';
import { LibraryItem } from '@/types/game';
import { create } from 'zustand';

interface LibraryState {
  ownedGameIds: string[];
  ownedGames: LibraryItem[];
  loading: boolean;
  error: string | null;
  renderKey: number;
  fetchOwnedGameIds: (userId: string) => Promise<void>;
  fetchOwnedGames: (userId: string) => Promise<void>;
  rerender: () => void;
}

const useLibraryStore = create<LibraryState>((set) => ({
  ownedGameIds: [],
  ownedGames: [],
  loading: false,
  error: null,
  renderKey: 0,
  rerender: () => set((prev) => ({ renderKey: prev.renderKey + 1 })),
  fetchOwnedGameIds: async (userId: string) => {
    set({ loading: true, error: null });
    try {
      const result = await getUserLibrary(userId);
      set({ ownedGameIds: result.data.map((item: LibraryItem) => item.game.id) ?? [], loading: false, error: result.error });
    } catch (error: any) {
      set({ loading: false, error: error.message });
    }
  },
  fetchOwnedGames: async (userId: string) => {
    set({ loading: true, error: null });
    try {
      const result = await getUserLibrary(userId);
      set({ ownedGames: result.data ?? [], loading: false, error: result.error });
    } catch (error: any) {
      set({ loading: false, error: error.message });
    }
  }
}));

export default useLibraryStore;