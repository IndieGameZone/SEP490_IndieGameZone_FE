import { getGamePosts, getPostCommentsByPostId } from "@/lib/api/game-post-api";
import { GamePost } from "@/types/game-post";

import { create } from "zustand";

interface GamePostState {
  postComments: GamePost[];
  postGame: { items: GamePost[];
    totalItems?: number;
    totalPages?: number;
    currentPage?: number;
  };
  loading: boolean;
  error: string | null;
  fetchPostComments: (postId: string) => Promise<void>;
  fetchGamePosts: (
    gameId: string,
    params: {
      PageNumber?: number;
      PageSize?: number;
    }
  ) => Promise<void>;
  renderKey: number;
  rerender: () => void;
}

const useGamePostStore = create<GamePostState>((set) => ({
  postComments: [],
  postGame: {
    items: [],
    totalItems: 0,
    totalPages: 0,
    currentPage: 1
  },
  loading: false,
  error: null,
  renderKey: 0,
  rerender: () => {
    set((prev) => ({ renderKey: prev.renderKey + 1 }));
  },
  fetchPostComments: async (postId: string) => {
    set({ loading: true, error: null });
    try {
      const response = await getPostCommentsByPostId(postId);
      if (!response.error) {
        set({ postComments: response.data, loading: false });
      } else {
        set({ loading: false, error: response.error });
      }
    } catch (error: any) {
      set({ loading: false, error: error.message });
    }
  },
fetchGamePosts: async (gameId, params) => {
    set({ loading: true, error: null });
    try {
      const response = await getGamePosts(gameId, params);
      if (!response.error) {
        const { posts, headers } = response.data;
        set({
          postGame: {
            items: posts,
            totalItems: Number(headers['x-total-count']),
            totalPages: Number(headers['x-total-pages']),
            currentPage: params.PageNumber || 1
          },
          loading: false 
        });
      } else {
        set({ loading: false, error: response.error });
      }
    } catch (error: any) {
      set({ loading: false, error: error.message });
    }
  },
}));

export default useGamePostStore;
