import { getUserById } from '@/lib/api/user-api';
import { User } from '@/types/user';
import { create } from 'zustand';


interface UserState {
    user?: User;
    loading: boolean;
    error: string | null;
    fetchUserById: (id: string) => Promise<void>;
    renderKey: number;
    rerender: () => void;
}

const useUserStore = create<UserState>((set) => ({
    user: undefined,
    loading: false,
    error: null,
    renderKey: 0,
    rerender: () => {
        set(prev => ({ renderKey: prev.renderKey + 1 }))
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