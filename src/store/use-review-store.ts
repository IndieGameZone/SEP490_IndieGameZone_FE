import { getReviewByGameId } from "@/lib/api/review-api";
import { Review } from "@/types/review";
import { create } from "zustand";

interface ReviewState {
  reviews: Review[];
  loading: boolean;
  error: string | null;
  fetchReviewsByGameId: (gameId: string) => Promise<void>;
  renderKey: number;
  rerender: () => void;
}

const useReviewStore = create<ReviewState>((set) => ({
  reviews: [],
  loading: false,
  error: null,
  renderKey: 0,
  rerender: () => {
    set((prev) => ({ renderKey: prev.renderKey + 1 }));
  },
  fetchReviewsByGameId: async (gameId) => {
    set({ loading: true, error: null });
    try {
      const response = await getReviewByGameId(gameId);
      if (!response.error) {
        set({ reviews: response.data, loading: false });
      } else {
        set({ loading: false, error: response.error });
      }
    } catch (error: any) {
      set({ loading: false, error: error.message });
    }
  },
}));

export default useReviewStore;
