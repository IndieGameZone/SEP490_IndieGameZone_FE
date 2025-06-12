import { getAllPlatforms } from '@/lib/api/platform-api';
import { Platform } from '@/types/platform';
import { create } from 'zustand';


interface PlatFormState {
    platforms: Platform[];
    loading: boolean;
    error: string | null;
    fetchPlatforms: () => Promise<void>;
    getDefaultPlatforms: () => {
        windowsPlatformId?: string,
        macOsPlatformId?: string,
        linuxPlatformId?: string,
    };
    renderKey: number;
    rerender: () => void;
}

const usePlatformStore = create<PlatFormState>((set) => ({
    platforms: [],
    loading: false,
    error: null,
    renderKey: 0,
    rerender: () => {
        set(prev => ({ renderKey: prev.renderKey + 1 }))
    },
    fetchPlatforms: async () => {
        set({ loading: true, error: null });
        try {
            const response = await getAllPlatforms();
            if (!response.error) {
                set({ platforms: response.data, loading: false });
            } else {
                set({ loading: false, error: response.error });
            }
        } catch (error: any) {
            set({ loading: false, error: error.message });
        }
    },
    getDefaultPlatforms: () => {
        var windowsPlatformId;
        var macOsPlatformId;
        var linuxPlatformId;
        set(prev => {
            windowsPlatformId = prev.platforms.find(p => p.name == "Windows")?.id;
            macOsPlatformId = prev.platforms.find(p => p.name == "MacOS")?.id;
            linuxPlatformId = prev.platforms.find(p => p.name == "Linux")?.id;
            return prev;
        })
        return {
            windowsPlatformId,
            macOsPlatformId,
            linuxPlatformId
        }
    }
}));

export default usePlatformStore;