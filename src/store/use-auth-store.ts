import { getUserInfo } from '@/lib/api/auth-api';
import { User } from '@/types/user';
import { create } from 'zustand';

interface AuthState {
    profile?: User;
    loading: boolean;
    error: string | null;
    isRefreshingToken: boolean;
    isLoggedIn: boolean;
    setIsRefreshingToken: (refreshing: boolean) => void;
    fetchProfile: () => Promise<void>;
    setProfile: (user?: User) => void;
    logout: () => void;
    renderKey: number;
    rerender: () => void;
}

const useAuthStore = create<AuthState>((set) => ({
    profile: undefined,
    loading: false,
    error: null,
    renderKey: 0,
    isLoggedIn: false,
    isRefreshingToken: false,
    setIsRefreshingToken: (refreshing) => set({ isRefreshingToken: refreshing }),
    rerender: () => {
        set(prev => ({ renderKey: prev.renderKey + 1 }))
    },
    fetchProfile: async () => {
        set({ loading: true, error: null });
        try {
            var response = await getUserInfo();
            if (!response.error) {
                set({ profile: response.data, loading: false, isLoggedIn: true });
            } else {
                set({ loading: false, error: response.error });
            }
        } catch (error: any) {
            set({ loading: false, error: error.message });
        }
    },
    
    setProfile(user) {
        set({ profile: user })
    },

    logout: () => {
        localStorage.removeItem("accessToken");
        localStorage.clear();
        set({ profile: undefined, isLoggedIn: false });
    }
}));

export default useAuthStore;