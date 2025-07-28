import { getPostCommentsByPostId } from "@/lib/api/game-post-api";
import { GamePost } from "@/types/game-post";

import { create } from "zustand";

interface GamePostState {
    postComments: GamePost[];

  loading: boolean;
  error: string | null;
  fetchPostComments: (postId: string) => Promise<void>;
  renderKey: number;
  rerender: () => void;
}

const useGamePostStore = create<GamePostState>((set) => ({
  postComments: [],
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
}));

export default useGamePostStore;
