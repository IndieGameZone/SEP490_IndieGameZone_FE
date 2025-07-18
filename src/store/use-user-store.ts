import { getAllAccounts, getBanHistoryById, getUserById } from "@/lib/api/user-api";
import { User, UserBanHistory } from "@/types/user";
import { create } from "zustand";

interface UserState {
  users: User[];
  user?: User;
  loading: boolean;
  userBanHistory: UserBanHistory[];
  error: string | null;
  fetchUserById: (id: string) => Promise<void>;
  fetchAllAccounts: () => void;
  fetchBanHistory: (userId: string) => void;
  renderKey: number;
  rerender: () => void;
}

const useUserStore = create<UserState>((set) => ({
  users: [],
  user: undefined,
  loading: false,
  userBanHistory: [],
  error: null,
  renderKey: 0,
  rerender: () => {
    set((prev) => ({ renderKey: prev.renderKey + 1 }));
  },

  fetchAllAccounts: async () => {
    set({ loading: true, error: null });
    try {
      const response = await getAllAccounts();
      if (!response.error) {
        set({ users: response.data, loading: false });
      } else {
        set({ loading: false, error: response.error });
      }
    } catch (error: any) {
      set({ loading: false, error: error.message });
    }
  },
  
  fetchBanHistory: async (userId) => {
    set({ loading: true, error: null });
    try {
      const response = await getBanHistoryById(userId);
      if (!response.error) {
        set({ userBanHistory: response.data, loading: false });
      } else {
        set({ loading: false, error: response.error });
      }
    } catch (error: any) {
      set({ loading: false, error: error.message });
    }
  },
  fetchUserById: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await getUserById(id);
      if (!response.error) {
        set({ user: response.data, loading: false });
      } else {
        set({ loading: false, error: response.error });
      }
    } catch (error: any) {
      set({ loading: false, error: error.message });
    }
  },
}));



export default useUserStore;
