import { getAllCategories } from '@/lib/api/category-api';
import { Category } from '@/types/category';
import { create } from 'zustand';


interface CategoryState {
    categories: Category[];
    displayCategory: Category | null;
    loading: boolean;
    error: string | null;
    fetchCategories: () => Promise<void>;
    setDisplayCategory: (category: Category | null) => void;
    renderKey: number;
    rerender: () => void;
}

const useCategoryStore = create<CategoryState>((set) => ({
    categories: [],
    displayCategory: null,
    loading: false,
    error: null,
    renderKey: 0,
    rerender: () => {
        set(prev => ({ renderKey: prev.renderKey + 1 }))
    },
    setDisplayCategory: (category) => {
        set({ displayCategory: category })
    },
    fetchCategories: async () => {
        set({ loading: true, error: null });
        try {
            const response = await getAllCategories();
            if (!response.error) {
                set({ categories: response.data, loading: false });
            } else {
                set({ loading: false, error: response.error });
            }
        } catch (error: any) {
            set({ loading: false, error: error.message });
        }
    },
}));

export default useCategoryStore;