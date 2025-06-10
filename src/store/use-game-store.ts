import { Image } from '@/types/game';
import { create } from 'zustand';

interface GameState {
    gameImages: Image[];
    loading: boolean;
    error: string | null;
    renderKey: number;
    rerender: () => void;
}

const useGameStore = create<GameState>((set) => ({
    gameImages: [],
    loading: false,
    error: null,
    renderKey: 0,
    rerender: () => {
        set(prev => ({ renderKey: prev.renderKey + 1 }))
    },
}));

export default useGameStore;