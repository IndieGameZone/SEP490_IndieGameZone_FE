import { UploadFile } from "antd";

export type Image = {
    id: string;
    image: string;
}

export type GameInfo = {
    name: string;
    shortDescription: string;
    averageSession: number;
    categoryId: string;
    tagIds: string[];
    languageIds: string[];
    ageRestrictionId: string;
    releaseStatus: "Released" | "In Development" | "On Hold" | "Canceled" | "Prototype";
    description: string;
    price: number;
    allowDonate: boolean;
};

export type GameMediaAssets = {
    coverImage: UploadFile[];
    coverImageUrl: string;
    gameImages: UploadFile[];
    gameImageUrls: string[],
    videoLink: string;
};

export type GameFiles = {
    files: {
        displayName: string;
        file: UploadFile[];
        fileUrls: string;
        platformId: string;
    }[];
    installInstruction: string;
}

export type GameData = {
    gameInfo: GameInfo,
    gameMediaAssets: GameMediaAssets,
    gameFiles: GameFiles
}