import { create } from 'zustand';
import { addWishList, getAllUserWishlists, removeWishlist } from '@/lib/api/wish-list-api';

interface WishlistState {
  gamedIds: string[]; 
  loading: boolean;
  error: string | null;
  renderKey: number;
  fetchWishlistGameIds: (userId: string) => Promise<void>;
  addToWishlist: (userId: string, gameId: string) => Promise<void>;
  removeFromWishlist: (userId: string, gameId: string) => Promise<void>;
  rerender: () => void;
}

const useWishlistStore = create<WishlistState>((set) => ({
  gamedIds: [],
  loading: false,
  error: null,
  renderKey: 0,
  rerender: () => {
    set((prev) => ({ renderKey: prev.renderKey + 1 }));
  },
  fetchWishlistGameIds: async (userId: string) => {
    set({ loading: true, error: null });
    try {
      const response = await getAllUserWishlists(userId);
      if (response.success && Array.isArray(response.data)) {
        const gameIds = response.data
          .filter((item: any) => item.gameId)
          .map((item: { gameId: string }) => item.gameId);
        set({ gamedIds: gameIds, loading: false });
      } else {
        set({
          loading: false,
          error: response.error || 'Failed to fetch wishlists. Invalid response data.',
        });
      }
    } catch (error: any) {
      set({
        loading: false,
        error: error.message || 'An unexpected error occurred while fetching wishlists.',
      });
    }
  },
  addToWishlist: async (userId: string, gameId: string) => {
    set({ loading: true, error: null });
    try {
      const response = await addWishList({ userId, gameId });
      if (response.success) {
        set((state) => ({
          wishlists: [...state.gamedIds, gameId],
          loading: false,
        }));
      } else {
        set({ loading: false, error: response.error || 'Failed to add to wishlist' });
      }
    } catch (error: any) {
      set({ loading: false, error: error.message || 'An unexpected error occurred' });
    }
  },
  removeFromWishlist: async (userId: string, gameId: string) => {
    set({ loading: true, error: null });
    try {
      const response = await removeWishlist(userId, gameId);
      if (response.success) {
        set((state) => ({
          wishlists: state.gamedIds.filter((id) => id !== gameId),
          loading: false,
        }));
      } else {
        set({ loading: false, error: response.error || 'Failed to remove from wishlist' });
      }
    } catch (error: any) {
      set({ loading: false, error: error.message || 'An unexpected error occurred' });
    }
  },
}));

export default useWishlistStore;