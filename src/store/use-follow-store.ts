import { createFollow, getNumberofFollowers, getNumberofFollowees, checkIfFollowed } from "@/lib/api/follow-api";
import { create } from "zustand";

interface FollowState {
  // States
  followers: number;
  followees: number;
  isFollowed: boolean;
  loading: boolean;
  error: string | null;

  // Actions
  followDeveloper: (followerId: string, followeeId: string) => Promise<void>;
  getFollowerCount: (followeeId: string) => Promise<void>;
  getFolloweeCount: (followerId: string) => Promise<void>;
  checkIsFollowed: (followerId: string, followeeId: string) => Promise<void>;
  resetState: () => void;
}

const initialState = {
  followers: 0,
  followees: 0,
  isFollowed: false,
  loading: false,
  error: null,
};

const useFollowStore = create<FollowState>((set) => ({
  ...initialState,

  resetState: () => {
    set(initialState);
  },

  followDeveloper: async (followerId: string, followeeId: string) => {
    try {
      set({ loading: true });
      const response = await createFollow(followerId, followeeId);

      if (response.success) {
        set((state) => ({
          isFollowed: !state.isFollowed,
          followers: state.followers + (state.isFollowed ? -1 : 1),
        }));
      }
    } catch (error: any) {
      set({ error: error.message || "Failed to follow developer" });
    } finally {
      set({ loading: false });
    }
  },

  getFollowerCount: async (followeeId: string) => {
    try {
      set({ loading: true });
      const response = await getNumberofFollowers(followeeId);

      if (response.success) {
        set({ followers: response.data });
      }
    } catch (error: any) {
      set({ error: error.message || "Failed to get follower count" });
    } finally {
      set({ loading: false });
    }
  },

  getFolloweeCount: async (followerId: string) => {
    try {
      set({ loading: true });
      const response = await getNumberofFollowees(followerId);

      if (response.success) {
        set({ followees: response.data });
      }
    } catch (error: any) {
      set({ error: error.message || "Failed to get followee count" });
    } finally {
      set({ loading: false });
    }
  },

  checkIsFollowed: async (followerId: string, followeeId: string) => {
    try {
      set({ loading: true });
      const response = await checkIfFollowed(followerId, followeeId);

      if (response.success) {
        set({ isFollowed: Boolean(response.data) });
      }
    } catch (error: any) {
      set({ error: error.message || "Failed to check follow status" });
      set({ isFollowed: false });
    } finally {
      set({ loading: false });
    }
  },
}));

export default useFollowStore;
