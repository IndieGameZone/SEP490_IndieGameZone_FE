import { getAllPostTags } from "@/lib/api/post-game-api";
import { getAllTags } from "@/lib/api/tag-api";
import { Tag } from "@/types/tag";
import { create } from "zustand";

interface TagState {
  tags: Tag[];
  postTags: Tag[];
  loading: boolean;
  error: string | null;
  fetchTags: () => Promise<void>;
  fetchPostTags: () => Promise<void>;
  renderKey: number;
  rerender: () => void;
}

const useTagStore = create<TagState>((set) => ({
  tags: [],
  postTags: [],

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
}));

export default useTagStore;
