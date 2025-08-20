import { GameFieldTypes, GameFilesFieldType, GameInfoFieldType, GameMediaAssetsFieldType } from '@/types/game';
import { create } from 'zustand';

interface ManageGameState {
    gameInfo: GameInfoFieldType;
    gameMediaAssets: GameMediaAssetsFieldType;
    gameFiles: GameFilesFieldType;
    setGameInfo: (info: GameInfoFieldType) => void;
    setGameMediaAssets: (mediaAssets: GameMediaAssetsFieldType) => void;
    setGameFiles: (files: GameFilesFieldType) => void;
    loadState: () => boolean;
    saveState: () => void;
    clearState: () => void;
    loading: boolean;
    error: string | null;
    renderKey: number;
    rerender: () => void;
    isSaved: boolean;
    isLoaded: boolean;
}

const initState: GameFieldTypes = {
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
        allowDonate: false,
        pricingOption: "Free",
        visibility: "Public",
        requireActivationKey: false
    },
    gameMediaAssets: {
        coverImage: [],
        gameImages: [],
        videoLink: ""
    },
    gameFiles: {
        files: [],
        installInstruction: "",
        versionDescription: "",
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
                gameInfo: parsed.info,
                gameMediaAssets: parsed.mediaAssets,
                gameFiles: {
                    files: parsed.files.files ?? [],
                    installInstruction: parsed.installInstruction,
                    versionDescription: parsed.versionDescription
                }
            });
            set({ isLoaded: true })
            return true;
        } else {
            set({ isSaved: false })
            return false;
        }
    },
    saveState: () => {
        const stateToSave = {
            info: get().gameInfo,
            mediaAssets: { ...get().gameMediaAssets, coverImage: null, gameImages: null },
            files: { ...get().gameFiles, files: null },
        }
        localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
        set({ isSaved: true })
    },
    clearState: () => {
        localStorage.removeItem(STORAGE_KEY);
        set({
            gameInfo: initState.gameInfo,
            gameMediaAssets: initState.gameMediaAssets,
            gameFiles: initState.gameFiles
        })
        set({ isSaved: false });
    },
    loading: false,
    error: null,
    renderKey: 0,
    rerender: () => {
        set(prev => ({ renderKey: prev.renderKey + 1 }))
    },
    isSaved: false,
    isLoaded: false,
}));

export default useManageGameStore;