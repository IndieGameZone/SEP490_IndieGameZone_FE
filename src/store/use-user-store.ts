import { GetAccountParams, getAllAccounts, getBanHistoryById, getUserById } from "@/lib/api/user-api";
import { User, UserBanHistory } from "@/types/user";
import { create } from "zustand";

interface UserState {
  users: User[];
  user?: User;
  loading: boolean;
  userBanHistory: UserBanHistory[];
  error: string | null;
  fetchUserById: (id: string) => Promise<User | undefined>;
  fetchAllAccounts: (params?: GetAccountParams) => void;
  fetchBanHistory: (userId: string) => void;
  renderKey: number;
  rerender: () => void;
  pagination: {
    totalCount: number;
    currentPage: number;
    pageSize: number;
  }
}

const useUserStore = create<UserState>((set) => ({
  users: [],
  user: undefined,
  loading: false,
  userBanHistory: [],
  error: null,
  renderKey: 0,
  pagination: {
    totalCount: 0,
    currentPage: 1,
    pageSize: 10,
  },
  rerender: () => {
    set((prev) => ({ renderKey: prev.renderKey + 1 }));
  },

  fetchAllAccounts: async (params) => {
    set({ loading: true, error: null });
    try {
      const response = await getAllAccounts(params);
      const paginationHeader = response.headers["x-pagination"];
      const pagination = paginationHeader ? JSON.parse(paginationHeader) : null;
      if (!response.error) {
        set({
          users: response.data,
          pagination: {
            currentPage: pagination.CurrentPage,
            pageSize: pagination.PageSize,
            totalCount: pagination.TotalCount
          }, loading: false
        });
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
        return response.data;
      } else {
        set({ loading: false, error: response.error });
      }
    } catch (error: any) {
      set({ loading: false, error: error.message });
    }
  },
}));



export default useUserStore;
