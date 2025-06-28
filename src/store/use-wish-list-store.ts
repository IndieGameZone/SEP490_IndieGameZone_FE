import { create } from 'zustand';
import { addWishList, getUserWishlists, removeWishlist } from '@/lib/api/wish-list-api';

interface WishlistState {
  wishlists: string[]; 
  loading: boolean;
  error: string | null;
  renderKey: number;
  fetchWishlists: (userId: string) => Promise<void>;
  addToWishlist: (userId: string, gameId: string) => Promise<void>;
  removeFromWishlist: (userId: string, gameId: string) => Promise<void>;
  rerender: () => void;
}

const useWishlistStore = create<WishlistState>((set) => ({
  wishlists: [],
  loading: false,
  error: null,
  renderKey: 0,
  rerender: () => {
    set((prev) => ({ renderKey: prev.renderKey + 1 }));
  },
  fetchWishlists: async (userId: string) => {
    set({ loading: true, error: null });
    try {
      const response = await getUserWishlists(userId);
      if (response.success && Array.isArray(response.data)) {
        const gameIds = response.data
          .filter((item: any) => item.gameId)
          .map((item: { gameId: string }) => item.gameId);
        set({ wishlists: gameIds, loading: false });
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
          wishlists: [...state.wishlists, gameId],
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
          wishlists: state.wishlists.filter((id) => id !== gameId),
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