import { UploadFile } from "antd";
import { Category } from "./category";
import { Tag } from "./tag";
import { Language } from "./language";
import { AgeRestriction } from "./age-restriction";

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
    releaseStatus: "Released" | "InDevelopment" | "OnHold" | "Canceled" | "Prototype";
    description: string;
    price: number;
    allowDonate: boolean;
    pricingOption: "Free" | "Paid";
    visibility: "Draft" | "Restricted" | "Public"
};

export type GameMediaAssets = {
    coverImage: UploadFile[];
    gameImages: UploadFile[];
    videoLink: string;
};

export type GameFiles = {
    files: GameFile[];
    installInstruction: string;
}

export type GameFile = {
    displayName: string;
    file: UploadFile[];
    platformId: string;
    fileSize: number;
}

export type GameData = {
    gameInfo: GameInfo,
    gameMediaAssets: GameMediaAssets,
    gameFiles: GameFiles
}

export type Game = {
    id: string;
    name: string;
    coverImage: string;
    description: string;
    shortDescription: string;
    status: "Released" | "InDevelopment" | "OnHold" | "Canceled" | "Prototype";
    allowDonation: boolean;
    price: number;
    priceAfterDiscount: number;
    discount: any[];
    visibility: "Draft" | "Restricted" | "Public"
    category: Category;
    gameTags: { tag: Tag }[];
    gameLanguages: { language: Language }[];
    gameImages: GameImage[],
    ageRestriction: AgeRestriction;
    averageSession: number;
    videoLink: string;
    gamePlatforms: any[];
}

type GameImage = {
    id: string;
    image: string;
}