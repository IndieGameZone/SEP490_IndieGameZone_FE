import { GameData, GameFiles, GameInfo, GameMediaAssets } from '@/types/game';
import { create } from 'zustand';

interface ManageGameState {
    gameInfo: GameInfo;
    gameMediaAssets: GameMediaAssets;
    gameFiles: GameFiles;
    setGameInfo: (info: GameInfo) => void;
    setGameMediaAssets: (mediaAssets: GameMediaAssets) => void;
    setGameFiles: (files: GameFiles) => void;
    loadState: () => void;
    saveState: () => void;
    clearState: () => void;
    loading: boolean;
    error: string | null;
    renderKey: number;
    rerender: () => void;
    isSaved: boolean;
}

const initState: GameData = {
    gameInfo: {
        name: "",
        shortDescription: "",
        averageSession: 1,
        categoryId: "",
        tagIds: [],
        languageIds: [],
        ageRestrictionId: "",
        releaseStatus: "Released",
        description: "",
        price: 0,
        allowDonate: false
    },
    gameMediaAssets: {
        coverImage: [],
        coverImageUrl: "",
        gameImages: [],
        gameImageUrls: [],
        videoLink: ""
    },
    gameFiles: {
        files: [],
        installInstruction: ""
    },
}

const STORAGE_KEY = 'manage-game-data';

const useManageGameStore = create<ManageGameState>((set, get) => ({
    gameInfo: initState.gameInfo,
    gameMediaAssets: initState.gameMediaAssets,
    gameFiles: initState.gameFiles,
    setGameInfo: (info) => {
        set({ gameInfo: info });
    },
    setGameMediaAssets: (mediaAssets) => {
        set({ gameMediaAssets: mediaAssets });
    },
    setGameFiles: (files) => {
        set({ gameFiles: files })
    },
    loadState: () => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            const parsed = JSON.parse(stored);
            set({
                gameInfo: parsed.gameInfo,
                gameMediaAssets: parsed.gameMediaAssets,
                gameFiles: parsed.gameFiles
            });
        } else {
            set({ isSaved: false })
        }
    },
    saveState: () => {
        const stateToSave = {
            info: get().gameInfo,
            mediaAssets: get().gameMediaAssets,
            files: get().gameFiles,
        }
        localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
        set({ isSaved: true });
    },
    clearState: () => {
        localStorage.removeItem(STORAGE_KEY);
        set({
            gameInfo: initState.gameInfo,
            gameMediaAssets: initState.gameMediaAssets,
            gameFiles: initState.gameFiles
        })
    },
    loading: false,
    error: null,
    renderKey: 0,
    rerender: () => {
        set(prev => ({ renderKey: prev.renderKey + 1 }))
    },
    isSaved: false,
}));

export default useManageGameStore;