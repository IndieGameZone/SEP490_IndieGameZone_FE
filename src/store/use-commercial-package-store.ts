import { getAllCommercialPackages } from '@/lib/api/commercial-package-api';
import { CommercialPackage } from '@/types/commercial-package';
import { create } from 'zustand';


interface CommercialPackageState {
    commercialPackages: CommercialPackage[];
    loading: boolean;
    error: string | null;
    fetchCommercialPackages: () => Promise<void>;
    renderKey: number;
    rerender: () => void;
}

const useCommericalPackageStore = create<CommercialPackageState>((set) => ({
    commercialPackages: [],
    loading: false,
    error: null,
    renderKey: 0,
    rerender: () => {
        set(prev => ({ renderKey: prev.renderKey + 1 }))
    },
    fetchCommercialPackages: async () => {
        set({ loading: true, error: null });
        try {
            const response = await getAllCommercialPackages();
            if (!response.error) {
                set({ commercialPackages: response.data, loading: false });
            } else {
                set({ loading: false, error: response.error });
            }
        } catch (error: any) {
            set({ loading: false, error: error.message });
        }
    },
}));

export default useCommericalPackageStore;