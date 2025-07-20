import { getAllGameTags, getAllPostTags } from "@/lib/api/game-post-api";
import { getAllTags } from "@/lib/api/tag-api";
import { Tag } from "@/types/tag";
import { create } from "zustand";

interface TagState {
  tags: Tag[];
  postTags: Tag[];
  gameTags: Tag[];
  loading: boolean;
  error: string | null;
  fetchTags: () => Promise<void>;
  fetchPostTags: () => Promise<void>;
  fetchGameTags: () => Promise<void>;
  renderKey: number;
  rerender: () => void;
}

const useTagStore = create<TagState>((set) => ({
  tags: [],
  postTags: [],
  gameTags: [],
  loading: false,
  error: null,
  renderKey: 0,
  rerender: () => {
    set((prev) => ({ renderKey: prev.renderKey + 1 }));
  },
  fetchTags: async () => {
    set({ loading: true, error: null });
    try {
      const response = await getAllTags();
      if (!response.error) {
        set({ tags: response.data, loading: false });
      } else {
        set({ loading: false, error: response.error });
      }
    } catch (error: any) {
      set({ loading: false, error: error.message });
    }
  },
  fetchPostTags: async () => {
    set({ loading: true, error: null });
    try {
      const response = await getAllPostTags();
      if (!response.error) {
        set({ postTags: response.data, loading: false });
      } else {
        set({ loading: false, error: response.error });
      }
    } catch (error: any) {
      set({ loading: false, error: error.message });
    }
  },
  fetchGameTags: async () => {
    set({ loading: true, error: null });
    try {
      const response = await getAllGameTags();
      if (!response.error) {
        set({ gameTags: response.data, loading: false });
      } else {
        set({ loading: false, error: response.error });
      }
    } catch (error: any) {
      set({ loading: false, error: error.message });
    }
  }
}));

export default useTagStore;
