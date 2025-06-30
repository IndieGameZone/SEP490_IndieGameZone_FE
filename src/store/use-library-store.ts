import { getUserLibrary } from '@/lib/api/game-library-api';
import { create } from 'zustand';

interface LibraryState {
  ownedGameIds: string[];
  loading: boolean;
  error: string | null;
  renderKey: number;
  fetchLibraries: (userId: string) => Promise<void>;
  rerender: () => void;
}

const useLibraryStore = create<LibraryState>((set) => ({
  ownedGameIds: [],
  loading: false,
  error: null,
  renderKey: 0,
  rerender: () => set((prev) => ({ renderKey: prev.renderKey + 1 })),
  fetchLibraries: async (userId: string) => {
    set({ loading: true, error: null });
    try {
      const result = await getUserLibrary(userId);
      set({ ownedGameIds: result.success && Array.isArray(result.data) ? result.data.map((item: { gameId: string }) => item.gameId) : [], loading: false, error: result.error });
    } catch (error: any) {
      set({ loading: false, error: error.message });
    }
  },
}));

export default useLibraryStore;