import { GetReviewsParams, getReviewsByGameId } from "@/lib/api/review-api";
import { Review } from "@/types/review";
import { create } from "zustand";

interface ReviewState {
  reviews: Review[];
  pagination: {
    totalCount: number;
    currentPage: number;
    pageSize: number;
  }
  loading: boolean;
  error: string | null;
  fetchReviewsByGameId: (gameId: string, params?: GetReviewsParams) => Promise<void>;
  renderKey: number;
  rerender: () => void;
}

const useReviewStore = create<ReviewState>((set) => ({
  reviews: [],
  pagination: {
    currentPage: 1,
    pageSize: 10,
    totalCount: 0
  },
  loading: false,
  error: null,
  renderKey: 0,
  rerender: () => {
    set((prev) => ({ renderKey: prev.renderKey + 1 }));
  },
  fetchReviewsByGameId: async (gameId, params) => {
    set({ loading: true, error: null });
    try {
      const response = await getReviewsByGameId(gameId, params);
      if (!response.error) {
        const paginationHeader = response.data.headers["x-pagination"];
        const pagination = paginationHeader ? JSON.parse(paginationHeader) : null;

        set({
          reviews: response.data.reviews, loading: false,
          pagination: {
            currentPage: pagination.CurrentPage,
            pageSize: pagination.PageSize,
            totalCount: pagination.TotalCount
          }
        });
      } else {
        set({ loading: false, error: response.error });
      }
    } catch (error: any) {
      set({ loading: false, error: error.message });
    }
  },
}));

export default useReviewStore;
