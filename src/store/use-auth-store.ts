import { getUserInfo } from '@/lib/api/auth-api';
import { User } from '@/types/user';
import { create } from 'zustand';

interface AuthState {
    profile?: User;
    loading: boolean;
    error: string | null;
    fetchProfile: () => Promise<void>;
    setProfile: (user?: User) => void;
    getDisplayProfile: () => User | undefined;
    logout: () => void;
    renderKey: number;
    rerender: () => void;
}

const useAuthStore = create<AuthState>((set) => ({
    profile: undefined,
    loading: false,
    error: null,
    renderKey: 0,
    rerender: () => {
        set(prev => ({ renderKey: prev.renderKey + 1 }))
    },
    fetchProfile: async () => {
        set({ loading: true, error: null });
        try {
            var response = await getUserInfo();
            if (!response.error) {
                localStorage.setItem("profile", JSON.stringify(response.data))
                set({ profile: response.data, loading: false });
            } else {
                set({ loading: false, error: response.error });
            }
        } catch (error: any) {
            set({ loading: false, error: error.message });
        }
    },
    getDisplayProfile() {
        const saved = localStorage.getItem("profile");
        if (saved) {
            return JSON.parse(saved);
        }
        return undefined;
    },
    setProfile(user) {
        set({ profile: user })
    },
    logout: () => {
        localStorage.clear();
        set({ profile: undefined });
    }
}));

export default useAuthStore;